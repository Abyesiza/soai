/**
 * Hidden Markov Model Engine
 *
 * Implements a discrete-time HMM (dHMM) following Rabiner (1989):
 *   θ = {A, B, π}
 *   A[i][j]  = P(hₜ = j | hₜ₋₁ = i)   — N×N transition matrix
 *   B[i][k]  = P(Oₜ = k | hₜ = i)      — N×M emission matrix
 *   π[i]     = P(h₁ = i)               — initial state distribution
 *
 * Hidden states represent cognitive/behavioral modes inferred from
 * the observable interaction stream (mouse, scroll, dwell, click).
 *
 * Algorithms implemented:
 *   - Forward–Backward  (log-space for numerical stability)
 *   - Viterbi decoding   (optimal hidden-state sequence, log-space)
 *   - Baum–Welch EM      (online parameter estimation, single step)
 */

// ─── State & Observation Alphabet ─────────────────────────────────────────────

/** N = 3 hidden behavioral states */
export const HMM_STATES = {
  ENGAGED:  0,   // deliberate, fast, interactive
  SCANNING: 1,   // exploratory, scrolling, slow movement
  HESITANT: 2,   // dwelling, pausing, uncertain
} as const;
export type HMMStateIndex = (typeof HMM_STATES)[keyof typeof HMM_STATES];
export const HMM_STATE_NAMES = ['ENGAGED', 'SCANNING', 'HESITANT'] as const;
export type HiddenStateName = (typeof HMM_STATE_NAMES)[number];

/** M = 6 discrete observation symbols derived from sensor readings */
export const OBS_SYMBOLS = {
  FAST_MOVE:    0,   // mouseVelocity > 5 px/ms
  SLOW_MOVE:    1,   // 0.1 < mouseVelocity ≤ 5
  DWELL:        2,   // hover dwell > 800 ms on an element
  RAPID_SCROLL: 3,   // scrollVelocity > 3 px/ms
  IDLE:         4,   // no movement or scroll
  INTERACTION:  5,   // click or keypress event
} as const;
export type ObsSymbolIndex = (typeof OBS_SYMBOLS)[keyof typeof OBS_SYMBOLS];

export const N_STATES  = 3;
export const M_SYMBOLS = 6;

// ─── Parameter Container ──────────────────────────────────────────────────────

export interface HMMParams {
  A:  number[][];  // [N_STATES × N_STATES]  transition matrix
  B:  number[][];  // [N_STATES × M_SYMBOLS] emission matrix
  pi: number[];    // [N_STATES]              initial distribution
}

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Numerically stable log-sum-exp: log(Σ exp(xᵢ)) */
function logSumExp(logValues: number[]): number {
  const max = Math.max(...logValues);
  if (!isFinite(max)) return -Infinity;
  return max + Math.log(
    logValues.reduce((acc, lv) => acc + Math.exp(lv - max), 0)
  );
}

/** Normalize an array so its elements sum to 1, with uniform fallback. */
export function normalize(arr: number[]): number[] {
  const sum = arr.reduce((a, b) => a + b, 0);
  if (sum === 0) return arr.map(() => 1 / arr.length);
  return arr.map(v => v / sum);
}

// ─── Default (Prior) Parameters ───────────────────────────────────────────────
/**
 * Empirically-motivated prior:
 *   ENGAGED  emits fast movement and interactions.
 *   SCANNING emits slow movement and rapid scrolling.
 *   HESITANT emits long dwells and idle pauses.
 */
export function defaultHMMParams(): HMMParams {
  return {
    pi: [0.40, 0.40, 0.20],
    A: [
      //  ENG   SCN   HES
      [0.70, 0.20, 0.10],   // from ENGAGED
      [0.30, 0.50, 0.20],   // from SCANNING
      [0.20, 0.30, 0.50],   // from HESITANT
    ],
    B: [
      //  FAST  SLOW  DWELL SCROLL IDLE  INTERACT
      [0.25, 0.20,  0.10,  0.20,  0.05, 0.20],   // ENGAGED
      [0.15, 0.30,  0.10,  0.30,  0.10, 0.05],   // SCANNING
      [0.05, 0.15,  0.40,  0.05,  0.30, 0.05],   // HESITANT
    ],
  };
}

// ─── Forward Algorithm (log-space) ────────────────────────────────────────────
/**
 * Computes log α_t(i) = log P(O₁…Oₜ, hₜ=i | θ).
 *   α₁(i)  = π_i · b_i(O₁)
 *   αₜ(i)  = [Σⱼ αₜ₋₁(j) · a_{ji}] · b_i(Oₜ)
 *
 * @returns log-alpha matrix [T × N]
 */
function forwardLog(obs: number[], p: HMMParams): number[][] {
  const T = obs.length;
  const N = p.pi.length;
  const logA  = p.A.map(row => row.map(v => Math.log(Math.max(v, 1e-15))));
  const logB  = p.B.map(row => row.map(v => Math.log(Math.max(v, 1e-15))));
  const logPi = p.pi.map(v => Math.log(Math.max(v, 1e-15)));

  const logAlpha: number[][] = Array.from({ length: T }, () => Array(N).fill(-Infinity));

  for (let i = 0; i < N; i++) {
    logAlpha[0][i] = logPi[i] + logB[i][obs[0]];
  }
  for (let t = 1; t < T; t++) {
    for (let j = 0; j < N; j++) {
      const terms = logAlpha[t - 1].map((la, i) => la + logA[i][j]);
      logAlpha[t][j] = logSumExp(terms) + logB[j][obs[t]];
    }
  }
  return logAlpha;
}

// ─── Backward Algorithm (log-space) ───────────────────────────────────────────
/**
 * Computes log β_t(i) = log P(Oₜ₊₁…OT | hₜ=i, θ).
 *   βT(i) = 1  (log 0)
 *   βₜ(i) = Σⱼ a_{ij} · b_j(Oₜ₊₁) · βₜ₊₁(j)
 *
 * @returns log-beta matrix [T × N]
 */
function backwardLog(obs: number[], p: HMMParams): number[][] {
  const T = obs.length;
  const N = p.pi.length;
  const logA = p.A.map(row => row.map(v => Math.log(Math.max(v, 1e-15))));
  const logB = p.B.map(row => row.map(v => Math.log(Math.max(v, 1e-15))));

  const logBeta: number[][] = Array.from({ length: T }, () => Array(N).fill(-Infinity));
  for (let i = 0; i < N; i++) logBeta[T - 1][i] = 0; // log(1) = 0

  for (let t = T - 2; t >= 0; t--) {
    for (let i = 0; i < N; i++) {
      const terms = Array.from({ length: N }, (_, j) =>
        logA[i][j] + logB[j][obs[t + 1]] + logBeta[t + 1][j]
      );
      logBeta[t][i] = logSumExp(terms);
    }
  }
  return logBeta;
}

// ─── State Posterior γ ────────────────────────────────────────────────────────
/**
 * γ_t(i) = P(hₜ=i | O, θ) = α_t(i)·β_t(i) / Σⱼ α_t(j)·β_t(j)
 * @returns gamma matrix [T × N] (probabilities, not log)
 */
function statePosteriorsFromLog(
  logAlpha: number[][],
  logBeta:  number[][]
): number[][] {
  const T = logAlpha.length;
  const N = logAlpha[0].length;
  return Array.from({ length: T }, (_, t) => {
    const logNorm = logSumExp(logAlpha[t].map((la, i) => la + logBeta[t][i]));
    return Array.from({ length: N }, (_, i) =>
      Math.exp(logAlpha[t][i] + logBeta[t][i] - logNorm)
    );
  });
}

// ─── Transition Posterior ξ ───────────────────────────────────────────────────
/**
 * ξ_t(i,j) = P(hₜ=i, hₜ₊₁=j | O, θ)
 *           = α_t(i) · a_{ij} · b_j(Oₜ₊₁) · β_{t+1}(j)  /  P(O|θ)
 * @returns xi array [(T-1) × N × N]
 */
function transitionPosteriorsFromLog(
  obs:      number[],
  p:        HMMParams,
  logAlpha: number[][],
  logBeta:  number[][]
): number[][][] {
  const T = obs.length;
  const N = p.A.length;
  const logA = p.A.map(row => row.map(v => Math.log(Math.max(v, 1e-15))));
  const logB = p.B.map(row => row.map(v => Math.log(Math.max(v, 1e-15))));

  return Array.from({ length: T - 1 }, (_, t) => {
    const logTerms: number[][] = Array.from({ length: N }, (_, i) =>
      Array.from({ length: N }, (_, j) =>
        logAlpha[t][i] + logA[i][j] + logB[j][obs[t + 1]] + logBeta[t + 1][j]
      )
    );
    const flat = logTerms.flat();
    const logNorm = logSumExp(flat);
    return logTerms.map(row => row.map(lv => Math.exp(lv - logNorm)));
  });
}

// ─── Viterbi Decoding ─────────────────────────────────────────────────────────
/**
 * Finds the most-probable hidden-state sequence via the Viterbi algorithm
 * using max-product in log-space (avoiding underflow).
 *
 *   δₜ(i) = max_{h₁…hₜ₋₁} log P(h₁…hₜ=i, O₁…Oₜ | θ)
 *   δ₁(i) = log π_i + log b_i(O₁)
 *   δₜ(i) = max_j [δₜ₋₁(j) + log a_{ji}] + log b_i(Oₜ)
 *
 * @returns optimal state index sequence of length T
 */
export function viterbi(obs: number[], p: HMMParams): number[] {
  if (obs.length === 0) return [];
  const T = obs.length;
  const N = p.pi.length;
  const logA  = p.A.map(row => row.map(v => Math.log(Math.max(v, 1e-15))));
  const logB  = p.B.map(row => row.map(v => Math.log(Math.max(v, 1e-15))));
  const logPi = p.pi.map(v => Math.log(Math.max(v, 1e-15)));

  const delta: number[][] = Array.from({ length: T }, () => Array(N).fill(-Infinity));
  const psi:   number[][] = Array.from({ length: T }, () => Array(N).fill(0));

  for (let i = 0; i < N; i++) delta[0][i] = logPi[i] + logB[i][obs[0]];

  for (let t = 1; t < T; t++) {
    for (let j = 0; j < N; j++) {
      let maxVal = -Infinity;
      let maxIdx = 0;
      for (let i = 0; i < N; i++) {
        const val = delta[t - 1][i] + logA[i][j];
        if (val > maxVal) { maxVal = val; maxIdx = i; }
      }
      delta[t][j] = maxVal + logB[j][obs[t]];
      psi[t][j]   = maxIdx;
    }
  }

  // Backtrack optimal path
  const path: number[] = Array(T).fill(0);
  path[T - 1] = delta[T - 1].indexOf(Math.max(...delta[T - 1]));
  for (let t = T - 2; t >= 0; t--) path[t] = psi[t + 1][path[t + 1]];
  return path;
}

// ─── State Posteriors (current observation) ───────────────────────────────────
/**
 * Returns the smoothed posterior P(hₜ=i | O₁…OT, θ) for each state
 * at the final time step.  Used to update the intent probability.
 *
 * @returns normalized probability vector [N_STATES]
 */
export function getStatePosteriors(obs: number[], p: HMMParams): number[] {
  if (obs.length === 0) return normalize([...p.pi]);
  const logAlpha = forwardLog(obs, p);
  const logBeta  = backwardLog(obs, p);
  const gamma    = statePosteriorsFromLog(logAlpha, logBeta);
  return gamma[gamma.length - 1];
}

// ─── Baum–Welch EM Step ───────────────────────────────────────────────────────
/**
 * Performs one step of the Baum–Welch (EM) algorithm to update θ.
 * Requires at least 2 observations.  Returns in-place copy of params
 * when the sequence is too short.
 *
 * Re-estimation formulae:
 *   π̂_i          = γ₁(i)
 *   Â_{ij}        = Σₜ ξₜ(i,j) / Σₜ γₜ(i)          (t = 1…T-1)
 *   B̂_{i}(k)     = Σ{t: Oₜ=k} γₜ(i) / Σₜ γₜ(i)
 *
 * Laplace smoothing (ε = 1e-8) prevents zero-probability emissions.
 */
export function baumWelchStep(obs: number[], p: HMMParams): HMMParams {
  if (obs.length < 2) return p;

  const N = p.A.length;
  const M = p.B[0].length;

  const logAlpha = forwardLog(obs, p);
  const logBeta  = backwardLog(obs, p);
  const gamma    = statePosteriorsFromLog(logAlpha, logBeta);
  const xi       = transitionPosteriorsFromLog(obs, p, logAlpha, logBeta);

  // Re-estimate π̂
  const newPi = normalize(gamma[0]);

  // Re-estimate Â
  const newA: number[][] = Array.from({ length: N }, () => Array(N).fill(0));
  for (let i = 0; i < N; i++) {
    const denom = gamma.slice(0, -1).reduce((s, g) => s + g[i], 0);
    for (let j = 0; j < N; j++) {
      const numer = xi.reduce((s, xit) => s + xit[i][j], 0);
      newA[i][j] = denom > 0 ? numer / denom : 1 / N;
    }
    // Ensure row sums to 1
    const rowSum = newA[i].reduce((a, b) => a + b, 0);
    if (rowSum > 0) for (let j = 0; j < N; j++) newA[i][j] /= rowSum;
  }

  // Re-estimate B̂ with Laplace pseudo-count ε to avoid zero emissions
  const eps = 1e-8;
  const newB: number[][] = Array.from({ length: N }, () => Array(M).fill(0));
  for (let i = 0; i < N; i++) {
    const denom = gamma.reduce((s, g) => s + g[i], 0);
    for (let k = 0; k < M; k++) {
      const numer = gamma.reduce((s, g, t) => s + (obs[t] === k ? g[i] : 0), 0);
      newB[i][k] = (numer + eps) / (denom + M * eps);
    }
    const rowSum = newB[i].reduce((a, b) => a + b, 0);
    if (rowSum > 0) for (let k = 0; k < M; k++) newB[i][k] /= rowSum;
  }

  return { A: newA, B: newB, pi: newPi };
}

// ─── Observation Discretization ───────────────────────────────────────────────
/**
 * Maps continuous sensor readings to a discrete observation symbol index.
 * This is the feature-to-alphabet encoding layer between SensorService and HMM.
 *
 * Priority order: interaction > rapid scroll > dwell > fast move > slow move > idle
 */
export function discretizeObservation(
  mouseVelocity:  number,
  scrollVelocity: number,
  dwellMs:        number,
  isInteraction:  boolean
): ObsSymbolIndex {
  if (isInteraction)        return OBS_SYMBOLS.INTERACTION;
  if (scrollVelocity > 3.0) return OBS_SYMBOLS.RAPID_SCROLL;
  if (dwellMs > 800)        return OBS_SYMBOLS.DWELL;
  if (mouseVelocity > 5.0)  return OBS_SYMBOLS.FAST_MOVE;
  if (mouseVelocity > 0.1)  return OBS_SYMBOLS.SLOW_MOVE;
  return OBS_SYMBOLS.IDLE;
}

// ─── Probability Derivation from State Posteriors ─────────────────────────────
/**
 * Maps HMM state posteriors to the scalar intent probability used by the UI.
 *
 *   p = 1.0 · P(ENGAGED) + 0.0 · P(SCANNING) + 0.5 · P(HESITANT)
 *
 * Semantics:
 *   ENGAGED  → 1.0 (analytical)   — fast, deliberate interaction
 *   SCANNING → 0.0 (storyteller)  — browsing, exploratory scrolling
 *   HESITANT → 0.5 (neutral)      — uncertain, dwelling on content
 */
export function posteriorsToIntentProbability(posteriors: number[]): number {
  // posteriors = [P(ENGAGED), P(SCANNING), P(HESITANT)]
  return (
    posteriors[HMM_STATES.ENGAGED]  * 1.0 +
    posteriors[HMM_STATES.SCANNING] * 0.0 +
    posteriors[HMM_STATES.HESITANT] * 0.5
  );
}
