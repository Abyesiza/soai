import { SoaiPlugin, PluginContext, IntentDimensions, SoaiEventMap } from '@soai/types';
import { getMathEngine } from '@soai/math';
import { defaultDimensions } from './dimensions';

export interface SignalExtractor {
    extract: (signal: any) => number;
    weight: number;
}

export interface DimensionConfig {
    signals: {
        [signalType: string]: SignalExtractor[];
    };
}

export interface IntentEngineConfig {
    dimensions?: Record<string, DimensionConfig>;
    smoothing?: { alpha: number };
    epsilon?: number; // Minimum change to emit intent:update
}

export class IntentEngine implements SoaiPlugin {
    name = '@soai/intent';
    version = '0.1.0';
    consumes = ['signal:mouse', 'signal:scroll', 'signal:touch', 'signal:click',
        'signal:hover:dwell', 'signal:viewport:dwell', 'signal:idle', 'signal:visibility',
        'intent:seed'];
    produces = ['intent:update'];
    // No hard dependencies — works with any signal source (sensors or manual emit)

    private dimensions: Record<string, DimensionConfig>;
    private alpha: number;
    private epsilon: number;
    private previousSmoothed: IntentDimensions = {};
    private latestSignals: Map<string, any> = new Map();

    constructor(config?: IntentEngineConfig) {
        this.dimensions = config?.dimensions ?? defaultDimensions;
        this.alpha = config?.smoothing?.alpha ?? 0.85;
        this.epsilon = config?.epsilon ?? 0.01;
    }

    install(ctx: PluginContext): void {
        const math = getMathEngine();

        // Collect signals the intent engine needs
        const signalTypes = new Set<string>();
        for (const dim of Object.values(this.dimensions)) {
            for (const sigType of Object.keys(dim.signals)) {
                signalTypes.add(sigType);
            }
        }

        // Subscribe to each signal type
        for (const sigType of signalTypes) {
            ctx.on(sigType as keyof SoaiEventMap, (payload: any) => {
                this.latestSignals.set(sigType, payload);
                this.computeAndEmit(ctx, math);
            });
        }

        // Handle intent seeding from persistence
        ctx.on('intent:seed', (payload) => {
            this.previousSmoothed = { ...payload.vector };
            ctx.setState('intentVector', this.previousSmoothed);
        });
    }

    private computeAndEmit(ctx: PluginContext, math: ReturnType<typeof getMathEngine>): void {
        const dimensionNames = Object.keys(this.dimensions);
        const raw: IntentDimensions = {};

        // Compute each dimension
        for (const dimName of dimensionNames) {
            const dimConfig = this.dimensions[dimName];
            let totalWeight = 0;
            let weightedSum = 0;

            for (const [sigType, extractors] of Object.entries(dimConfig.signals)) {
                const signal = this.latestSignals.get(sigType);
                if (!signal) continue;

                for (const extractor of extractors) {
                    const value = extractor.extract(signal);
                    weightedSum += value * extractor.weight;
                    totalWeight += extractor.weight;
                }
            }

            raw[dimName] = totalWeight > 0 ? weightedSum / totalWeight : 0;
        }

        // EWMA smoothing
        const currentArr = new Float64Array(dimensionNames.map(n => raw[n] ?? 0));
        const prevArr = new Float64Array(dimensionNames.map(n => this.previousSmoothed[n] ?? 0));
        const smoothedArr = math.ewma(currentArr, prevArr, this.alpha);

        const smoothed: IntentDimensions = {};
        dimensionNames.forEach((name, i) => {
            smoothed[name] = smoothedArr[i];
        });

        // Check if change is significant
        let maxDelta = 0;
        for (const name of dimensionNames) {
            const delta = Math.abs((smoothed[name] ?? 0) - (this.previousSmoothed[name] ?? 0));
            if (delta > maxDelta) maxDelta = delta;
        }

        if (maxDelta > this.epsilon) {
            this.previousSmoothed = { ...smoothed };
            ctx.setState('intentVector', smoothed);
            ctx.emit('intent:update', { raw, smoothed });
        }
    }
}
