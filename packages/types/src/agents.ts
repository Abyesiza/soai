import { SoaiPlugin, PluginContext } from './plugin';

export interface SoaiAgent extends SoaiPlugin {
    capabilities: AgentCapability[];
    runtime: 'client' | 'server' | 'edge';
    onActivate?(ctx: AgentContext): void;
    onDeactivate?(ctx: AgentContext): void;
    onCooldown?(ctx: AgentContext): void;
    onFeedback?(feedback: AgentFeedback): void;
    health?(): AgentHealthReport;
}

export interface AgentCapability {
    description: string;
    trigger: string;
    produces: string[];
    handler: (event: any, ctx: AgentContext) => void | Promise<void>;
}

export interface AgentContext extends PluginContext {
    // Agent-specific context methods can be added here
}

export interface AgentFeedback {
    type: 'accepted' | 'dismissed' | 'modified' | 'ignored';
    suggestionId: string;
    latencyMs: number;
    context: Record<string, unknown>;
}

export interface AgentHealthReport {
    status: 'healthy' | 'degraded' | 'unhealthy';
    suggestionsEmitted: number;
    acceptanceRate: number;
    averageLatencyMs: number;
}
