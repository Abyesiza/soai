import { MathEngine } from './index';
import { FallbackMathEngine } from './fallback';

let engine: MathEngine | null = null;

export function getMathEngine(): MathEngine {
    if (engine) return engine;

    // TODO: In Phase 3.5, try to load WASM first:
    // try {
    //   const wasm = await import('../pkg/soai_math');
    //   engine = new WasmMathEngine(wasm);
    //   return engine;
    // } catch {}

    // Fallback to TypeScript implementation
    engine = new FallbackMathEngine();
    return engine;
}
