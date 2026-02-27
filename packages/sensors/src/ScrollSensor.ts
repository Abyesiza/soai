import { SoaiPlugin, PluginContext } from '@soai/types';

export class ScrollSensor implements SoaiPlugin {
    name = '@soai/sensor-scroll';
    version = '0.1.0';
    produces = ['signal:scroll'];

    private throttleMs: number;
    private cleanup: (() => void) | null = null;

    constructor(config?: { throttleMs?: number }) {
        this.throttleMs = config?.throttleMs ?? 16;
    }

    install(ctx: PluginContext): void {
        let lastScrollY = 0;
        let lastTime = 0;
        let lastThrottleTime = 0;

        const handler = () => {
            const now = performance.now();
            if (now - lastThrottleTime < this.throttleMs) return;
            lastThrottleTime = now;

            const scrollY = window.scrollY;
            const dt = now - lastTime;
            const dy = scrollY - lastScrollY;
            const velocity = dt > 0 ? Math.abs(dy) / dt : 0;
            const direction: 'up' | 'down' = dy >= 0 ? 'down' : 'up';

            if (lastTime > 0) {
                ctx.emit('signal:scroll', {
                    y: scrollY,
                    velocity,
                    direction,
                    timestamp: Date.now(),
                });
            }

            lastScrollY = scrollY;
            lastTime = now;
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', handler, { passive: true });
            this.cleanup = () => window.removeEventListener('scroll', handler);
        }
    }

    destroy(): void {
        this.cleanup?.();
        this.cleanup = null;
    }
}
