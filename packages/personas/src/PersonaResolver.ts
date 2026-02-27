import { SoaiPlugin, PluginContext, IntentDimensions } from '@soai/types';
import { getMathEngine } from '@soai/math';

export interface PersonaResolverConfig {
    centroids: Record<string, Record<string, number>>;
    minStableMs?: number;
    switchConfidenceThreshold?: number;
    customResolver?: (vector: IntentDimensions) => { persona: string; confidence: number } | null;
}

const DEFAULT_CENTROIDS: Record<string, Record<string, number>> = {
    analytical: {
        taskUrgency: 0.8,
        emotionalEngagement: 0.2,
        informationDensityPreference: 0.9,
    },
    storyteller: {
        taskUrgency: 0.2,
        emotionalEngagement: 0.9,
        informationDensityPreference: 0.3,
    },
    neutral: {
        taskUrgency: 0.5,
        emotionalEngagement: 0.5,
        informationDensityPreference: 0.5,
    },
};

export class PersonaResolver implements SoaiPlugin {
    name = '@soai/personas';
    version = '0.1.0';
    consumes = ['intent:update'];
    produces = ['persona:change', 'persona:stable'];
    // No hard dependencies — works with any intent:update source

    private centroids: Record<string, Record<string, number>>;
    private minStableMs: number;
    private switchConfidenceThreshold: number;
    private customResolver?: (vector: IntentDimensions) => { persona: string; confidence: number } | null;

    private currentPersona = 'neutral';
    private candidatePersona = '';
    private candidateStartTime = 0;
    private stableStartTime = Date.now();

    constructor(config?: PersonaResolverConfig) {
        this.centroids = config?.centroids ?? DEFAULT_CENTROIDS;
        this.minStableMs = config?.minStableMs ?? 1500;
        this.switchConfidenceThreshold = config?.switchConfidenceThreshold ?? 0.3;
        this.customResolver = config?.customResolver;
    }

    install(ctx: PluginContext): void {
        const math = getMathEngine();

        // Build Float64Array centroids for the math engine
        const dimensionNames = Object.keys(Object.values(this.centroids)[0] ?? {});
        const centroidArrays = new Map<string, Float64Array>();

        for (const [name, dims] of Object.entries(this.centroids)) {
            centroidArrays.set(name, new Float64Array(dimensionNames.map(d => dims[d] ?? 0.5)));
        }

        // Initialize to closest persona from a neutral vector (all 0.5)
        const neutralVector = new Float64Array(dimensionNames.length).fill(0.5);
        const initialResult = math.classifyPersona(neutralVector, centroidArrays);
        this.currentPersona = initialResult.persona;

        ctx.setState('persona', this.currentPersona);
        ctx.setState('personaConfidence', initialResult.confidence);

        // Emit initial persona so React bindings sync immediately
        ctx.emit('persona:change', {
            from: 'neutral',
            to: this.currentPersona,
            confidence: initialResult.confidence,
            timestamp: Date.now(),
        });

        ctx.on('intent:update', (payload) => {
            const { smoothed } = payload;

            let result: { persona: string; confidence: number };

            // Custom resolver takes priority
            if (this.customResolver) {
                const custom = this.customResolver(smoothed);
                if (custom) {
                    result = custom;
                } else {
                    return;
                }
            } else {
                const vector = new Float64Array(dimensionNames.map(d => smoothed[d] ?? 0));
                result = math.classifyPersona(vector, centroidArrays);
            }

            const { persona: candidate, confidence } = result;
            const now = Date.now();

            ctx.setState('personaConfidence', confidence);
            ctx.setState('personaDistances', result);

            // Hysteresis: require sustained stable signal before switching
            if (candidate !== this.currentPersona) {
                if (candidate !== this.candidatePersona) {
                    // New candidate — start the clock
                    this.candidatePersona = candidate;
                    this.candidateStartTime = now;
                } else {
                    // Existing candidate — check if it's been stable long enough
                    const stableMs = now - this.candidateStartTime;
                    if (stableMs >= this.minStableMs && confidence >= this.switchConfidenceThreshold) {
                        const from = this.currentPersona;
                        this.currentPersona = candidate;
                        this.stableStartTime = now;
                        this.candidatePersona = '';

                        ctx.setState('persona', candidate);
                        ctx.emit('persona:change', {
                            from,
                            to: candidate,
                            confidence,
                            timestamp: now,
                        });
                    }
                }
            } else {
                // Same persona — emit stable marker periodically
                this.candidatePersona = '';
                const stableDuration = now - this.stableStartTime;
                if (stableDuration > 0 && stableDuration % 5000 < 100) {
                    ctx.emit('persona:stable', {
                        persona: this.currentPersona,
                        stableSince: this.stableStartTime,
                        durationMs: stableDuration,
                    });
                }
            }
        });
    }
}
