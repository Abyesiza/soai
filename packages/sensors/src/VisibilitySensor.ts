import { SoaiPlugin, PluginContext } from '@soai/types';

export class VisibilitySensor implements SoaiPlugin {
    name = '@soai/sensor-visibility';
    version = '0.1.0';
    produces = ['signal:visibility'];

    private cleanup: (() => void) | null = null;

    install(ctx: PluginContext): void {
        const handler = () => {
            ctx.emit('signal:visibility', {
                visible: document.visibilityState === 'visible',
            });
        };

        if (typeof document !== 'undefined') {
            document.addEventListener('visibilitychange', handler);
            this.cleanup = () => document.removeEventListener('visibilitychange', handler);
        }
    }

    destroy(): void {
        this.cleanup?.();
        this.cleanup = null;
    }
}
