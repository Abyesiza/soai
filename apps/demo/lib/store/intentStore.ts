import { atom } from 'jotai';
import type { IntentState } from '@/types';

/** Re-export for consumers that import from store */
export type { IntentState };

/**
 * ATOMIC STATE: The multi-dimensional 'Superposition' Probability
 * 0.0 = Storyteller, 1.0 = Analytical; 0.3–0.7 = Neutral
 */
export const intentAtom = atom<IntentState>({
    probability: 0.5,
    persona: 'neutral',
    mouseVelocity: 0,
    scrollVelocity: 0,
    hoverDwellId: null,
});
