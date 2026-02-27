export class SoaiError extends Error {
    constructor(message: string, public readonly code: string) {
        super(message);
        this.name = 'SoaiError';
    }
}

export class PluginError extends SoaiError {
    constructor(pluginName: string, message: string) {
        super(`Plugin [${pluginName}]: ${message}`, 'ERR_PLUGIN');
    }
}
