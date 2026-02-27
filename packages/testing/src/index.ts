import { Soai } from '@soai/core';
import { SoaiPlugin, SoaiEventMap, SoaiEvent } from '@soai/types';

export interface TestKernelOptions {
    plugins?: SoaiPlugin[];
}

/**
 * createTestKernel: pre-configured kernel for unit tests (no browser events, no transport).
 */
export function createTestKernel(options?: TestKernelOptions): TestKernel {
    const kernel = new Soai({ debug: false });
    const recorded: SoaiEvent[] = [];

    // Record all events
    kernel.events.on('*', ((event: SoaiEvent) => {
        recorded.push(event);
    }) as any);

    if (options?.plugins) {
        for (const plugin of options.plugins) {
            kernel.use(plugin);
        }
    }

    return new TestKernel(kernel, recorded);
}

export class TestKernel {
    constructor(
        private kernel: Soai,
        private recorded: SoaiEvent[],
    ) { }

    get events() {
        return {
            emitted: <K extends keyof SoaiEventMap>(type: K): SoaiEvent<K>[] => {
                return this.recorded.filter(e => e.type === type) as SoaiEvent<K>[];
            },
            all: () => [...this.recorded],
        };
    }

    async start() { await this.kernel.start(); }
    async stop() { await this.kernel.stop(); }

    emit<K extends keyof SoaiEventMap>(type: K, payload: SoaiEventMap[K]) {
        this.kernel.emit(type, payload);
    }

    getState<T>(key: string): T | undefined {
        return this.kernel.getState<T>(key);
    }
}

// Signal fixtures
export const fixtures = {
    'fast-scan': [
        { type: 'signal:mouse' as const, payload: { x: 100, y: 100, velocity: 4.5, straightness: 0.9, timestamp: Date.now() } },
        { type: 'signal:mouse' as const, payload: { x: 500, y: 200, velocity: 5.0, straightness: 0.85, timestamp: Date.now() + 50 } },
        { type: 'signal:scroll' as const, payload: { y: 800, velocity: 3.0, direction: 'down' as const, timestamp: Date.now() + 100 } },
        { type: 'signal:click' as const, payload: { x: 300, y: 400, target: 'button', frequency: 1.5, timestamp: Date.now() + 200 } },
    ],
    'slow-read': [
        { type: 'signal:mouse' as const, payload: { x: 200, y: 300, velocity: 0.3, straightness: 0.5, timestamp: Date.now() } },
        { type: 'signal:hover:dwell' as const, payload: { elementId: 'article', durationMs: 4000 } },
        { type: 'signal:viewport:dwell' as const, payload: { durationMs: 6000, scrollY: 500 } },
        { type: 'signal:idle' as const, payload: { durationMs: 3500 } },
    ],
    'erratic': [
        { type: 'signal:mouse' as const, payload: { x: 50, y: 50, velocity: 8.0, straightness: 0.2, timestamp: Date.now() } },
        { type: 'signal:mouse' as const, payload: { x: 900, y: 100, velocity: 7.5, straightness: 0.15, timestamp: Date.now() + 30 } },
        { type: 'signal:click' as const, payload: { x: 400, y: 200, target: 'div', frequency: 3.0, timestamp: Date.now() + 60 } },
        { type: 'signal:scroll' as const, payload: { y: 200, velocity: 5.0, direction: 'up' as const, timestamp: Date.now() + 90 } },
    ],
    'idle-then-burst': [
        { type: 'signal:idle' as const, payload: { durationMs: 8000 } },
        { type: 'signal:mouse' as const, payload: { x: 300, y: 300, velocity: 6.0, straightness: 0.95, timestamp: Date.now() } },
        { type: 'signal:click' as const, payload: { x: 300, y: 300, target: 'cta', frequency: 2.5, timestamp: Date.now() + 50 } },
    ],
} as const;

/**
 * mockSignals: emit synthetic signal sequences from fixtures or custom arrays.
 */
export async function mockSignals(
    kernel: TestKernel,
    fixtureOrSignals: keyof typeof fixtures | Array<{ type: string; payload: any }>,
): Promise<void> {
    const signals = typeof fixtureOrSignals === 'string' ? fixtures[fixtureOrSignals] : fixtureOrSignals;
    for (const signal of signals) {
        kernel.emit(signal.type as keyof SoaiEventMap, signal.payload as any);
        // Small tick between signals
        await new Promise(r => setTimeout(r, 10));
    }
}

export { fixtures as signalFixtures };
