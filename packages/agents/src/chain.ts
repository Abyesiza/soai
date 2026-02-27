import { SoaiAgent, PluginContext } from '@soai/types';

/**
 * Chain agents sequentially: output of one feeds into the next.
 */
export function chain(agents: SoaiAgent[]): SoaiAgent {
    return {
        name: `chain:${agents.map(a => a.name).join('+')}`,
        version: '0.1.0',
        capabilities: agents.flatMap(a => a.capabilities ?? []),
        runtime: 'client',
        produces: agents.flatMap(a => a.produces ?? []),
        consumes: agents.flatMap(a => a.consumes ?? []),

        async install(ctx: PluginContext) {
            for (const agent of agents) {
                await agent.install(ctx);
            }
        },

        async destroy() {
            for (const agent of agents.reverse()) {
                await agent.destroy?.();
            }
        },
    };
}
