import { SoaiPlugin, PluginContext } from '@soai/types';

export class DwellSensor implements SoaiPlugin {
    name = '@soai/sensor-dwell';
    version = '0.1.0';
    produces = ['signal:hover:dwell'];

    private stagnationThresholdMs: number;
    private cleanup: (() => void) | null = null;

    constructor(config?: { stagnationThresholdMs?: number }) {
        this.stagnationThresholdMs = config?.stagnationThresholdMs ?? 300;
    }

    install(ctx: PluginContext): void {
        let timer: ReturnType<typeof setTimeout> | null = null;
        let dwellStart = 0;
        let currentElementId = '';

        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const elementId = target?.id || target?.dataset?.soaiDwell || target?.tagName?.toLowerCase() || '';

            // If we moved to a new element, clear old timer and potentially emit
            if (elementId !== currentElementId) {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                if (dwellStart > 0 && currentElementId) {
                    const durationMs = Date.now() - dwellStart;
                    if (durationMs >= this.stagnationThresholdMs) {
                        ctx.emit('signal:hover:dwell', { elementId: currentElementId, durationMs });
                    }
                }

                currentElementId = elementId;
                dwellStart = Date.now();

                // Start new dwell timer
                timer = setTimeout(() => {
                    const durationMs = Date.now() - dwellStart;
                    ctx.emit('signal:hover:dwell', { elementId: currentElementId, durationMs });
                }, this.stagnationThresholdMs);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('mousemove', handler, { passive: true });
            this.cleanup = () => {
                window.removeEventListener('mousemove', handler);
                if (timer) clearTimeout(timer);
            };
        }
    }

    destroy(): void {
        this.cleanup?.();
        this.cleanup = null;
    }
}
