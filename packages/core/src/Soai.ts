import { SoaiPlugin, PluginContext, Middleware, SoaiConfig, SoaiEventMap, Logger, SoaiEvent } from '@soai/types';
import { EventBus } from './EventBus';
import { MiddlewarePipeline } from './MiddlewarePipeline';
import { PluginManager } from './PluginManager';
import { StateStore } from './StateStore';

// Default primitive logger
const defaultLogger: Logger = {
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
};

export class Soai {
    public readonly events = new EventBus();
    private readonly pipeline = new MiddlewarePipeline();
    private readonly plugins = new PluginManager();
    private readonly state = new StateStore();

    public config: SoaiConfig;
    public log: Logger;

    private isStarted = false;

    constructor(config: SoaiConfig = {}, logger: Logger = defaultLogger) {
        this.config = config;
        this.log = logger;
    }

    use(plugin: SoaiPlugin): this {
        if (this.isStarted) {
            this.log.warn(`Cannot add plugin ${plugin.name} after SOAI has started.`);
            return this;
        }
        this.plugins.register(plugin);
        return this;
    }

    middleware(fn: Middleware): this {
        this.pipeline.add(fn);
        return this;
    }

    getState<T>(key: string): T | undefined {
        return this.state.get<T>(key);
    }

    setState<T>(key: string, value: T): void {
        this.state.set<T>(key, value);
    }

    // Wrapper around EventBus to pipe through middleware
    emit<K extends keyof SoaiEventMap>(type: K, payload: SoaiEventMap[K]): void {
        const timestamp = Date.now();
        const event: SoaiEvent<K> = { type, payload, timestamp };

        // Process through middleware pipeline, then really emit to bus
        this.pipeline.run(event as SoaiEvent, (evt) => {
            this.events.emit(evt.type as keyof SoaiEventMap, evt.payload);
        }).catch(e => {
            this.log.error(`Middleware pipeline error:`, e);
        });
    }

    private createPluginContext(): PluginContext {
        return {
            on: (event, handler) => this.events.on(event, handler as any),
            emit: (event, payload) => this.emit(event, payload),
            getState: <T>(k: string) => this.getState<T>(k),
            setState: <T>(k: string, v: T) => this.setState<T>(k, v),
            config: this.config,
            log: this.log,
        };
    }

    async start(): Promise<void> {
        if (this.isStarted) return;
        this.isStarted = true;

        this.emit('lifecycle:init', {});

        const ctx = this.createPluginContext();
        await this.plugins.installAll(ctx);

        this.emit('lifecycle:ready', {});
    }

    async stop(): Promise<void> {
        if (!this.isStarted) return;
        this.isStarted = false;

        await this.plugins.destroyAll();
        this.emit('lifecycle:destroy', {});
        this.state.clear();
    }
}
