import { SoaiAgent, PluginContext } from '@soai/types';

export interface ArbitratorConfig {
    strategy: 'highest-confidence' | 'round-robin' | 'priority';
    maxConcurrent?: number;
    deduplication?: boolean;
}

/**
 * AgentArbitrator: runs agents in parallel and picks the best result.
 */
export class AgentArbitrator {
    private agents: SoaiAgent[] = [];
    private config: ArbitratorConfig;

    constructor(config: ArbitratorConfig) {
        this.config = config;
    }

    add(agent: SoaiAgent): this {
        this.agents.push(agent);
        return this;
    }

    createPlugin(): SoaiAgent {
        const agents = this.agents;
        const config = this.config;

        return {
            name: `arbitrator:${agents.map(a => a.name).join('+')}`,
            version: '0.1.0',
            capabilities: agents.flatMap(a => a.capabilities ?? []),
            runtime: 'client',
            produces: agents.flatMap(a => a.produces ?? []),
            consumes: agents.flatMap(a => a.consumes ?? []),

            async install(ctx: PluginContext) {
                // Install all agents
                const maxConcurrent = config.maxConcurrent ?? agents.length;
                const batch = agents.slice(0, maxConcurrent);
                for (const agent of batch) {
                    await agent.install(ctx);
                }
            },

            async destroy() {
                for (const agent of agents) {
                    await agent.destroy?.();
                }
            },
        };
    }
}
