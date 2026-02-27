import { SoaiPlugin, PluginContext } from '@soai/types';

export class ViewportSensor implements SoaiPlugin {
    name = '@soai/sensor-viewport';
    version = '0.1.0';
    produces = ['signal:viewport:dwell'];

    private stagnationMs: number;
    private cleanup: (() => void) | null = null;

    constructor(config?: { stagnationMs?: number }) {
        this.stagnationMs = config?.stagnationMs ?? 2000;
    }

    install(ctx: PluginContext): void {
        let timer: ReturnType<typeof setTimeout> | null = null;
        let dwellStart = Date.now();

        const resetTimer = () => {
            if (timer) clearTimeout(timer);
            dwellStart = Date.now();
            timer = setTimeout(() => {
                const durationMs = Date.now() - dwellStart;
                ctx.emit('signal:viewport:dwell', {
                    durationMs,
                    scrollY: typeof window !== 'undefined' ? window.scrollY : 0,
                });
            }, this.stagnationMs);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', resetTimer, { passive: true });
            resetTimer(); // Start initial timer
            this.cleanup = () => {
                window.removeEventListener('scroll', resetTimer);
                if (timer) clearTimeout(timer);
            };
        }
    }

    destroy(): void {
        this.cleanup?.();
        this.cleanup = null;
    }
}
