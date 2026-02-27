import { SoaiPlugin, PluginContext } from '@soai/types';

export class ClickSensor implements SoaiPlugin {
    name = '@soai/sensor-click';
    version = '0.1.0';
    produces = ['signal:click'];

    private windowMs: number;
    private cleanup: (() => void) | null = null;

    constructor(config?: { windowMs?: number }) {
        this.windowMs = config?.windowMs ?? 5000; // 5s sliding window
    }

    install(ctx: PluginContext): void {
        const clickTimes: number[] = [];

        const handler = (e: MouseEvent) => {
            const now = Date.now();

            // Prune old clicks outside window
            while (clickTimes.length > 0 && now - clickTimes[0] > this.windowMs) {
                clickTimes.shift();
            }

            clickTimes.push(now);

            const frequency = clickTimes.length / (this.windowMs / 1000); // clicks per second

            const target = (e.target as HTMLElement)?.id ||
                (e.target as HTMLElement)?.tagName?.toLowerCase() ||
                'unknown';

            ctx.emit('signal:click', {
                x: e.clientX,
                y: e.clientY,
                target,
                frequency,
                timestamp: now,
            });
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('click', handler, { passive: true });
            this.cleanup = () => window.removeEventListener('click', handler);
        }
    }

    destroy(): void {
        this.cleanup?.();
        this.cleanup = null;
    }
}
