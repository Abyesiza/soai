import { SoaiPlugin, PluginContext } from '@soai/types';

export class IdleSensor implements SoaiPlugin {
    name = '@soai/sensor-idle';
    version = '0.1.0';
    produces = ['signal:idle'];

    private idleThresholdMs: number;
    private cleanup: (() => void) | null = null;

    constructor(config?: { idleThresholdMs?: number }) {
        this.idleThresholdMs = config?.idleThresholdMs ?? 3000;
    }

    install(ctx: PluginContext): void {
        let timer: ReturnType<typeof setTimeout> | null = null;
        let idleStart = Date.now();
        const events = ['mousemove', 'scroll', 'click', 'keydown', 'touchstart'] as const;

        const resetTimer = () => {
            if (timer) clearTimeout(timer);
            idleStart = Date.now();
            timer = setTimeout(() => {
                const durationMs = Date.now() - idleStart;
                ctx.emit('signal:idle', { durationMs });
            }, this.idleThresholdMs);
        };

        if (typeof window !== 'undefined') {
            for (const event of events) {
                window.addEventListener(event, resetTimer, { passive: true });
            }
            resetTimer();
            this.cleanup = () => {
                for (const event of events) {
                    window.removeEventListener(event, resetTimer);
                }
                if (timer) clearTimeout(timer);
            };
        }
    }

    destroy(): void {
        this.cleanup?.();
        this.cleanup = null;
    }
}
