import { SoaiPlugin, PluginContext } from '@soai/types';

export interface CollaborativeAgentConfig {
    cooldownMs?: number;
    maxDismissals?: number;
    confidenceGate?: number;
}

export class CollaborativeAgent implements SoaiPlugin {
    name = '@soai/agent-collaborative';
    version = '0.1.0';
    consumes = ['persona:change', 'user:dismiss', 'user:preference'];
    produces = ['agent:suggestion'];

    private cooldownMs: number;
    private maxDismissals: number;
    private confidenceGate: number;
    private dismissalCount = 0;
    private lastSuggestionTime = 0;
    private hasSuggestedThisSession = false;
    private disabled = false;

    constructor(config?: CollaborativeAgentConfig) {
        this.cooldownMs = config?.cooldownMs ?? 30000;
        this.maxDismissals = config?.maxDismissals ?? 3;
        this.confidenceGate = config?.confidenceGate ?? 0.6;
    }

    install(ctx: PluginContext): void {
        ctx.on('persona:change', (payload) => {
            if (this.disabled) return;
            if (this.hasSuggestedThisSession) return;

            const now = Date.now();
            if (now - this.lastSuggestionTime < this.cooldownMs) return;
            if (payload.confidence < this.confidenceGate) return;

            this.hasSuggestedThisSession = true;
            this.lastSuggestionTime = now;

            ctx.emit('agent:suggestion', {
                message: `It looks like you might prefer a ${payload.to} experience. Want me to adjust?`,
                suggestedPersona: payload.to,
                confidence: payload.confidence,
                action: { switchPersona: payload.to },
            });
        });

        ctx.on('user:dismiss', () => {
            this.dismissalCount++;
            this.hasSuggestedThisSession = false; // Allow retry after cooldown
            if (this.dismissalCount >= this.maxDismissals) {
                this.disabled = true;
                ctx.log.info('CollaborativeAgent disabled after too many dismissals');
            }
        });

        ctx.on('user:preference', () => {
            // Positive signal — reset dismissals
            this.dismissalCount = Math.max(0, this.dismissalCount - 1);
        });
    }
}

export default CollaborativeAgent;
