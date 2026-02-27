import { SoaiPlugin, PluginContext, SoaiEventMap } from '@soai/types';
import { Soai } from '@soai/core';

export class ServerBridge {
    private kernel: Soai;
    private plugins: SoaiPlugin[] = [];

    constructor() {
        this.kernel = new Soai({ debug: false });
    }

    use(plugin: SoaiPlugin): this {
        this.plugins.push(plugin);
        this.kernel.use(plugin);
        return this;
    }

    /**
     * Handle a POST request (simplest transport for server-side agent invocation)
     */
    handlePost() {
        return async (req: Request): Promise<Response> => {
            await this.kernel.start();

            try {
                const body = await req.json();
                const { type, payload } = body;

                if (type && payload) {
                    this.kernel.emit(type as keyof SoaiEventMap, payload);
                }

                // Collect responses emitted by server-side agents
                const responses: any[] = [];
                const unsub = this.kernel.events.on('*', (event: any) => {
                    if (event.type.startsWith('agent:')) {
                        responses.push(event);
                    }
                });

                // Wait a tick for agents to process
                await new Promise((resolve) => setTimeout(resolve, 100));
                unsub();

                return new Response(JSON.stringify({ events: responses }), {
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (e) {
                return new Response(JSON.stringify({ error: String(e) }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        };
    }

    /**
     * Handle SSE (Server-Sent Events) for streaming responses
     */
    handleSSE() {
        return async (req: Request): Promise<Response> => {
            await this.kernel.start();

            const encoder = new TextEncoder();
            const stream = new ReadableStream({
                start: (controller) => {
                    const unsub = this.kernel.events.on('*', (event: any) => {
                        if (event.type.startsWith('agent:')) {
                            const data = `data: ${JSON.stringify(event)}\n\n`;
                            controller.enqueue(encoder.encode(data));
                        }
                    });

                    // Handle request body
                    req.json().then((body) => {
                        if (body.type && body.payload) {
                            this.kernel.emit(body.type as keyof SoaiEventMap, body.payload);
                        }
                    }).catch(() => { });

                    // Close after timeout
                    setTimeout(() => {
                        unsub();
                        controller.close();
                    }, 30000);
                },
            });

            return new Response(stream, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
            });
        };
    }
}
