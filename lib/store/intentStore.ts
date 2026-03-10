import { atom } from 'jotai';
import type { IntentState } from '@/types';
import { defaultHMMParams, HMM_STATE_NAMES, N_STATES } from '@/lib/math/HMMEngine';

/** Re-export for consumers that import from store */
export type { IntentState };

// ─── Default values ────────────────────────────────────────────────────────────

const { A, B, pi } = defaultHMMParams();

/**
 * ATOMIC STATE — full intent model.
 *
 * hmm.transitionMatrix / emissionMatrix / initialDistribution start with the
 * empirically-motivated prior from defaultHMMParams() and are refined in-place
 * by the Baum-Welch EM step inside useBehavioralSensor every 20 observations.
 *
 * metrics are zeroed/neutral until the first Baum-Welch pass completes.
 *
 * Probability semantics:
 *   0.0 = Storyteller (SCANNING state dominant)
 *   0.5 = Neutral / Superposition (HESITANT dominant)
 *   1.0 = Analytical (ENGAGED state dominant)
 */
export const intentAtom = atom<IntentState>({
  probability:    0.5,
  persona:        'neutral',
  mouseVelocity:  0,
  scrollVelocity: 0,
  hoverDwellId:   null,

  hmm: {
    currentStateIndex:   1,          // start in SCANNING
    currentStateName:    HMM_STATE_NAMES[1],
    posteriors:          [1 / N_STATES, 1 / N_STATES, 1 / N_STATES],
    transitionMatrix:    A,
    emissionMatrix:      B,
    initialDistribution: pi,
    observationCount:    0,
  },

  metrics: {
    globalEntropy:       Math.log2(N_STATES), // max entropy — uniform prior
    localEntropies:      Array(N_STATES).fill(Math.log2(N_STATES)),
    eigen2:              0,
    velocityPercentile:  0.5,
    personaMemberships:  [1 / 3, 1 / 3, 1 / 3],
  },
});
