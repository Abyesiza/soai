import { SoaiPlugin, PluginContext, SoaiEventMap } from '@soai/types';

export interface TransportClientConfig {
    url: string;
    protocol?: 'ws' | 'sse' | 'post' | 'auto';
    forward?: (keyof SoaiEventMap)[];
    receive?: (keyof SoaiEventMap)[];
    reconnect?: { maxRetries?: number; backoffMs?: number };
}

export class TransportClient implements SoaiPlugin {
    name = '@soai/transport-client';
    version = '0.1.0';

    private config: TransportClientConfig;
    private ws: WebSocket | null = null;
    private retryCount = 0;
    private cleanup: (() => void) | null = null;

    constructor(config: TransportClientConfig) {
        this.config = { protocol: 'auto', ...config };
    }

    get produces() { return this.config.receive?.map(String) ?? []; }
    get consumes() { return this.config.forward?.map(String) ?? []; }

    install(ctx: PluginContext): void {
        const { url, forward = [], receive = [] } = this.config;

        // Forward local events to server
        const unsubscribers: (() => void)[] = [];
        for (const eventType of forward) {
            const unsub = ctx.on(eventType, (payload: any) => {
                this.send({ type: eventType, payload, timestamp: Date.now() });
            });
            unsubscribers.push(unsub);
        }

        // Connect
        this.connect(url, ctx, receive);

        this.cleanup = () => {
            unsubscribers.forEach(u => u());
            this.ws?.close();
        };
    }

    destroy(): void {
        this.cleanup?.();
        this.cleanup = null;
    }

    private connect(url: string, ctx: PluginContext, receive: (keyof SoaiEventMap)[]): void {
        if (typeof WebSocket === 'undefined') {
            ctx.log.warn('WebSocket not available, transport disabled');
            return;
        }

        try {
            const wsUrl = url.replace(/^http/, 'ws');
            this.ws = new WebSocket(wsUrl);

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type && receive.includes(data.type)) {
                        ctx.emit(data.type, data.payload);
                    }
                } catch (e) {
                    ctx.log.error('Transport parse error:', e);
                }
            };

            this.ws.onclose = () => {
                const maxRetries = this.config.reconnect?.maxRetries ?? 5;
                const backoffMs = this.config.reconnect?.backoffMs ?? 1000;
                if (this.retryCount < maxRetries) {
                    this.retryCount++;
                    setTimeout(() => this.connect(url, ctx, receive), backoffMs * this.retryCount);
                } else {
                    ctx.emit('error:transport', {
                        code: 1006,
                        message: 'Max reconnection attempts reached',
                        retryable: false,
                    });
                }
            };

            this.ws.onerror = () => {
                ctx.log.error('Transport WebSocket error');
            };

            this.ws.onopen = () => {
                this.retryCount = 0;
            };
        } catch {
            ctx.log.warn('WebSocket connection failed');
        }
    }

    private send(data: any): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }
}
