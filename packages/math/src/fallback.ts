import { MathEngine } from './index';

export class FallbackMathEngine implements MathEngine {
    ewma(current: Float64Array, previous: Float64Array, alpha: number): Float64Array {
        const result = new Float64Array(current.length);
        for (let i = 0; i < current.length; i++) {
            result[i] = alpha * current[i] + (1 - alpha) * (previous[i] ?? 0);
        }
        return result;
    }

    centroidDistance(vector: Float64Array, centroid: Float64Array): number {
        let sum = 0;
        const len = Math.min(vector.length, centroid.length);
        for (let i = 0; i < len; i++) {
            const diff = vector[i] - centroid[i];
            sum += diff * diff;
        }
        return Math.sqrt(sum);
    }

    classifyPersona(
        vector: Float64Array,
        centroids: Map<string, Float64Array>,
    ): { persona: string; confidence: number } {
        let bestPersona = 'neutral';
        let bestDistance = Infinity;
        let totalInverseDistance = 0;

        const distances = new Map<string, number>();

        for (const [name, centroid] of centroids) {
            const dist = this.centroidDistance(vector, centroid);
            distances.set(name, dist);
            if (dist < bestDistance) {
                bestDistance = dist;
                bestPersona = name;
            }
        }

        // Compute confidence using softmax-like inverse distance
        for (const dist of distances.values()) {
            totalInverseDistance += 1 / (dist + 0.001);
        }

        const confidence = (1 / (bestDistance + 0.001)) / totalInverseDistance;

        return { persona: bestPersona, confidence };
    }

    applyHysteresis(
        current: string,
        candidate: string,
        stableMs: number,
        threshold: number,
    ): string {
        // Simple: if stableMs not met or threshold not met, keep current
        // Callers should track time externally; this is a pure logic gate
        if (stableMs < 1500 || threshold < 0.3) {
            return current;
        }
        return candidate;
    }
}
