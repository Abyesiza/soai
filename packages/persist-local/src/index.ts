import { SoaiPlugin, PluginContext, IntentDimensions } from '@soai/types';

const STORAGE_KEY = 'soai:user_dna';

interface StoredData {
    vector: IntentDimensions;
    persona: string;
    timestamp: number;
}

export class LocalPersistPlugin implements SoaiPlugin {
    name = '@soai/persist-local';
    version = '0.1.0';
    consumes = ['persona:change'];
    produces = ['persist:loaded', 'persist:saved', 'intent:seed'];

    private userId: string;

    constructor(config?: { userId?: string }) {
        this.userId = config?.userId ?? 'anonymous';
    }

    install(ctx: PluginContext): void {
        // Load saved state on init
        if (typeof localStorage !== 'undefined') {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const data: StoredData = JSON.parse(raw);
                    ctx.emit('intent:seed', { vector: data.vector });
                    ctx.emit('persist:loaded', {
                        userId: this.userId,
                        vector: data.vector,
                        persona: data.persona,
                    });
                    ctx.log.info('Loaded saved user DNA from localStorage');
                }
            } catch (e) {
                ctx.log.warn('Failed to load saved state:', e);
            }
        }

        // Save on persona change
        ctx.on('persona:change', (payload) => {
            const vector = ctx.getState<IntentDimensions>('intentVector') ?? {};

            const data: StoredData = {
                vector,
                persona: payload.to,
                timestamp: Date.now(),
            };

            if (typeof localStorage !== 'undefined') {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                    ctx.emit('persist:saved', {
                        userId: this.userId,
                        vector,
                        persona: payload.to,
                    });
                } catch (e) {
                    ctx.log.warn('Failed to save state:', e);
                }
            }
        });
    }
}

export default LocalPersistPlugin;
