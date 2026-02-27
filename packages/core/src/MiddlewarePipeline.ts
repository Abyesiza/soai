import { SoaiEvent, Middleware } from '@soai/types';

export class MiddlewarePipeline {
    private middlewares: Middleware[] = [];

    add(middleware: Middleware): this {
        this.middlewares.push(middleware);
        return this;
    }

    async run(event: SoaiEvent, finalFn: (event: SoaiEvent) => void | Promise<void>): Promise<void> {
        let index = -1;

        const dispatch = async (i: number): Promise<void> => {
            if (i <= index) {
                throw new Error('next() called multiple times');
            }
            index = i;

            if (i === this.middlewares.length) {
                await finalFn(event);
                return;
            }

            const mw = this.middlewares[i];
            await mw(event, () => dispatch(i + 1));
        };

        await dispatch(0);
    }
}

// Built-in middleware utilities
export function logger(): Middleware {
    return (event, next) => {
        console.debug(`[SOAI Event] ${event.type}`, event.payload);
        next();
    };
}
