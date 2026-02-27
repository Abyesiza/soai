export interface SoaiPlugin {
    name: string;
    version: string;
    produces?: string[];
    consumes?: string[];
    dependencies?: string[];
    install(ctx: PluginContext): void | Promise<void>;
    destroy?(): void | Promise<void>;
    onError?(error: Error, ctx: PluginContext): 'retry' | 'skip' | 'fatal';
}

export interface PluginContext {
    on<K extends keyof import('./events').SoaiEventMap>(event: K | '*', handler: (payload: any) => void): () => void;
    emit<K extends keyof import('./events').SoaiEventMap>(event: K, payload: import('./events').SoaiEventMap[K]): void;
    getState<T>(key: string): T | undefined;
    setState<T>(key: string, value: T): void;
    config: SoaiConfig;
    log: Logger;
}

export interface SoaiConfig {
    debug?: boolean;
}

export interface Logger {
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
    debug(...args: any[]): void;
}

export type Middleware = (event: import('./events').SoaiEvent, next: () => void) => void | Promise<void>;
