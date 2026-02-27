import { SoaiEventMap, SoaiEvent } from '@soai/types';

export type EventHandler<K extends keyof SoaiEventMap> = (payload: SoaiEventMap[K]) => void;
export type WildcardHandler = (event: SoaiEvent) => void;

export class EventBus {
    private handlers: Map<keyof SoaiEventMap, Set<EventHandler<any>>> = new Map();
    private wildcardHandlers: Set<WildcardHandler> = new Set();

    on<K extends keyof SoaiEventMap>(event: K | '*', handler: K extends '*' ? WildcardHandler : EventHandler<K>): () => void {
        if (event === '*') {
            this.wildcardHandlers.add(handler as unknown as WildcardHandler);
            return () => this.wildcardHandlers.delete(handler as unknown as WildcardHandler);
        }

        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event)!.add(handler as EventHandler<any>);

        return () => {
            const set = this.handlers.get(event);
            if (set) {
                set.delete(handler as EventHandler<any>);
                if (set.size === 0) {
                    this.handlers.delete(event);
                }
            }
        };
    }

    off<K extends keyof SoaiEventMap>(event: K | '*', handler: K extends '*' ? WildcardHandler : EventHandler<K>): void {
        if (event === '*') {
            this.wildcardHandlers.delete(handler as unknown as WildcardHandler);
            return;
        }
        const set = this.handlers.get(event);
        if (set) {
            set.delete(handler as EventHandler<any>);
            if (set.size === 0) {
                this.handlers.delete(event);
            }
        }
    }

    emit<K extends keyof SoaiEventMap>(type: K, payload: SoaiEventMap[K]): void {
        const timestamp = Date.now();
        const event: SoaiEvent<K> = { type, payload, timestamp };

        // Emit to specific handlers
        const specificHandlers = this.handlers.get(type);
        if (specificHandlers) {
            for (const handler of Array.from(specificHandlers)) {
                try {
                    handler(payload);
                } catch (error) {
                    console.error(`Error in EventBus handler for ${String(type)}:`, error);
                }
            }
        }

        // Emit to wildcard handlers
        for (const handler of Array.from(this.wildcardHandlers)) {
            try {
                handler(event);
            } catch (error) {
                console.error(`Error in EventBus wildcard handler:`, error);
            }
        }
    }
}
