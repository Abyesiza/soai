import { SoaiPlugin, PluginContext } from '@soai/types';

export class MouseSensor implements SoaiPlugin {
    name = '@soai/sensor-mouse';
    version = '0.1.0';
    produces = ['signal:mouse'];

    private throttleMs: number;
    private cleanup: (() => void) | null = null;

    constructor(config?: { throttleMs?: number }) {
        this.throttleMs = config?.throttleMs ?? 16; // ~60fps
    }

    install(ctx: PluginContext): void {
        let lastX = 0;
        let lastY = 0;
        let lastTime = 0;
        let pathLength = 0;
        let pathStartX = 0;
        let pathStartY = 0;
        let lastThrottleTime = 0;

        const handler = (e: MouseEvent) => {
            const now = performance.now();
            if (now - lastThrottleTime < this.throttleMs) return;
            lastThrottleTime = now;

            const dx = e.clientX - lastX;
            const dy = e.clientY - lastY;
            const dt = now - lastTime;

            const distance = Math.sqrt(dx * dx + dy * dy);
            const velocity = dt > 0 ? distance / dt : 0;

            // Reset path tracking every 500ms for rolling straightness
            if (dt > 500 || lastTime === 0) {
                pathLength = 0;
                pathStartX = e.clientX;
                pathStartY = e.clientY;
            }

            // Straightness: total displacement from path start / accumulated path length (1.0 = perfectly straight)
            pathLength += distance;
            const displacementX = e.clientX - pathStartX;
            const displacementY = e.clientY - pathStartY;
            const displacement = Math.sqrt(displacementX * displacementX + displacementY * displacementY);
            const straightness = pathLength > 0 ? Math.min(displacement / pathLength, 1) : 1;

            if (lastTime > 0) {
                ctx.emit('signal:mouse', {
                    x: e.clientX,
                    y: e.clientY,
                    velocity,
                    straightness,
                    timestamp: Date.now(),
                });
            }

            lastX = e.clientX;
            lastY = e.clientY;
            lastTime = now;
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('mousemove', handler, { passive: true });
            this.cleanup = () => window.removeEventListener('mousemove', handler);
        }
    }

    destroy(): void {
        this.cleanup?.();
        this.cleanup = null;
    }
}
