export class StateStore {
    private state: Map<string, unknown> = new Map();

    get<T>(key: string): T | undefined {
        return this.state.get(key) as T | undefined;
    }

    set<T>(key: string, value: T): void {
        this.state.set(key, value);
    }

    delete(key: string): boolean {
        return this.state.delete(key);
    }

    clear(): void {
        this.state.clear();
    }
}
