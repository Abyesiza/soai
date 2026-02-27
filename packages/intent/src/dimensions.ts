import type { DimensionConfig } from './IntentEngine';

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export const defaultDimensions: Record<string, DimensionConfig> = {
    taskUrgency: {
        signals: {
            'signal:mouse': [
                { extract: (s: any) => clamp(s.velocity / 5.0, 0, 1), weight: 0.35 },
                { extract: (s: any) => s.straightness, weight: 0.20 },
            ],
            'signal:scroll': [
                { extract: (s: any) => clamp(s.velocity / 3.0, 0, 1), weight: 0.30 },
            ],
            'signal:click': [
                { extract: (s: any) => clamp(s.frequency / 2.0, 0, 1), weight: 0.15 },
            ],
        },
    },
    emotionalEngagement: {
        signals: {
            'signal:hover:dwell': [
                { extract: (s: any) => clamp(s.durationMs / 3000, 0, 1), weight: 0.30 },
            ],
            'signal:viewport:dwell': [
                { extract: (s: any) => clamp(s.durationMs / 5000, 0, 1), weight: 0.30 },
            ],
            'signal:mouse': [
                { extract: (s: any) => 1 - clamp(s.velocity / 3.0, 0, 1), weight: 0.25 },
            ],
            'signal:idle': [
                { extract: (s: any) => clamp(s.durationMs / 2000, 0, 1), weight: 0.15 },
            ],
        },
    },
    informationDensityPreference: {
        signals: {
            'signal:click': [
                { extract: (s: any) => clamp(s.frequency / 2.5, 0, 1), weight: 0.35 },
            ],
            'signal:scroll': [
                { extract: (s: any) => clamp(s.velocity / 2.0, 0, 1), weight: 0.35 },
            ],
            'signal:mouse': [
                { extract: (s: any) => clamp(s.velocity / 4.0, 0, 1), weight: 0.30 },
            ],
        },
    },
};
