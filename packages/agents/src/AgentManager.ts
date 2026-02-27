import { SoaiAgent, AgentHealthReport, PluginContext } from '@soai/types';

export class AgentManager {
    private agents: Map<string, SoaiAgent> = new Map();
    private activeAgents: Set<string> = new Set();

    register(agent: SoaiAgent): void {
        this.agents.set(agent.name, agent);
    }

    async activateAll(ctx: PluginContext): Promise<void> {
        for (const [name, agent] of this.agents) {
            await agent.install(ctx);
            agent.onActivate?.(ctx as any);
            this.activeAgents.add(name);
        }
    }

    async deactivateAll(ctx: PluginContext): Promise<void> {
        for (const [name, agent] of this.agents) {
            agent.onDeactivate?.(ctx as any);
            await agent.destroy?.();
            this.activeAgents.delete(name);
        }
    }

    getHealth(): Map<string, AgentHealthReport> {
        const reports = new Map<string, AgentHealthReport>();
        for (const [name, agent] of this.agents) {
            if (agent.health) {
                reports.set(name, agent.health());
            }
        }
        return reports;
    }
}
