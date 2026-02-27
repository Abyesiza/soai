export interface MathEngine {
    ewma(current: Float64Array, previous: Float64Array, alpha: number): Float64Array;
    centroidDistance(vector: Float64Array, centroid: Float64Array): number;
    classifyPersona(vector: Float64Array, centroids: Map<string, Float64Array>): { persona: string; confidence: number };
    applyHysteresis(current: string, candidate: string, stableMs: number, threshold: number): string;
}

export { FallbackMathEngine } from './fallback';
export { getMathEngine } from './index-runtime';
