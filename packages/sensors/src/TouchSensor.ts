import { SoaiPlugin, PluginContext } from '@soai/types';

export class TouchSensor implements SoaiPlugin {
    name = '@soai/sensor-touch';
    version = '0.1.0';
    produces = ['signal:touch'];

    private throttleMs: number;
    private cleanup: (() => void) | null = null;

    constructor(config?: { throttleMs?: number }) {
        this.throttleMs = config?.throttleMs ?? 16;
    }

    install(ctx: PluginContext): void {
        let lastX = 0;
        let lastY = 0;
        let lastTime = 0;
        let lastThrottleTime = 0;

        const handler = (e: TouchEvent) => {
            const now = performance.now();
            if (now - lastThrottleTime < this.throttleMs) return;
            lastThrottleTime = now;

            const touch = e.touches[0];
            if (!touch) return;

            const dx = touch.clientX - lastX;
            const dy = touch.clientY - lastY;
            const dt = now - lastTime;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const velocity = dt > 0 ? distance / dt : 0;
            const pressure = touch.force || 0;

            if (lastTime > 0) {
                ctx.emit('signal:touch', {
                    x: touch.clientX,
                    y: touch.clientY,
                    velocity,
                    pressure,
                    timestamp: Date.now(),
                });
            }

            lastX = touch.clientX;
            lastY = touch.clientY;
            lastTime = now;
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('touchmove', handler, { passive: true });
            this.cleanup = () => window.removeEventListener('touchmove', handler);
        }
    }

    destroy(): void {
        this.cleanup?.();
        this.cleanup = null;
    }
}
