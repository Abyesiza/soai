import { SoaiPlugin, PluginContext } from '@soai/types';

export class PluginManager {
    private plugins: Map<string, SoaiPlugin> = new Map();
    private orderedPlugins: SoaiPlugin[] = [];

    register(plugin: SoaiPlugin): void {
        if (this.plugins.has(plugin.name)) {
            console.warn(`Plugin ${plugin.name} is already registered. Overwriting.`);
        }
        this.plugins.set(plugin.name, plugin);
    }

    resolveOrder(): void {
        const visited = new Set<string>();
        const temp = new Set<string>();
        const order: SoaiPlugin[] = [];

        const visit = (pluginName: string) => {
            if (temp.has(pluginName)) {
                throw new Error(`Circular dependency detected involving plugin: ${pluginName}`);
            }
            if (!visited.has(pluginName)) {
                temp.add(pluginName);
                const plugin = this.plugins.get(pluginName);
                if (!plugin) {
                    throw new Error(`Missing required dependency: ${pluginName}`);
                }

                if (plugin.dependencies) {
                    for (const dep of plugin.dependencies) {
                        visit(dep);
                    }
                }

                temp.delete(pluginName);
                visited.add(pluginName);
                order.push(plugin);
            }
        };

        for (const name of this.plugins.keys()) {
            visit(name);
        }

        this.orderedPlugins = order;
    }

    async installAll(ctx: PluginContext): Promise<void> {
        this.resolveOrder();
        for (const plugin of this.orderedPlugins) {
            try {
                ctx.log.info(`Installing plugin: ${plugin.name}`);
                await plugin.install(ctx);
            } catch (e) {
                ctx.log.error(`Failed to install plugin: ${plugin.name}`, e);
                if (plugin.onError) {
                    const action = plugin.onError(e instanceof Error ? e : new Error(String(e)), ctx);
                    if (action === 'fatal') {
                        throw e;
                    }
                } else {
                    throw e; // Default to fatal if no handler
                }
            }
        }
    }

    async destroyAll(): Promise<void> {
        const reversed = [...this.orderedPlugins].reverse();
        for (const plugin of reversed) {
            if (plugin.destroy) {
                try {
                    await plugin.destroy();
                } catch (e) {
                    console.error(`Error destroying plugin ${plugin.name}`, e);
                }
            }
        }
    }
}
