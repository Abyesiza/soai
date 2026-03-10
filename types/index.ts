/**
 * Central type definitions for the SOAI (Self-Optimizing Agentic Interface).
 *
 * Extended with HMM-based behavioral state modeling and statistical metrics:
 *   - HMMModelState  — current inferred hidden cognitive state
 *   - BehavioralMetrics — Shannon entropy, Eigen₂, PCHIP percentile, GMM memberships
 *
 * Existing fields (probability, persona, velocities) are preserved for
 * backward compatibility with all consuming components.
 */

// ─── Persona ──────────────────────────────────────────────────────────────────

/**
 * Seven behavioral archetypes detected by the HMM + statistical pipeline.
 *
 *  analytical  — ENGAGED dominant, low entropy, fast deliberate movement
 *  storyteller — SCANNING dominant, low velocity, exploratory scrolling
 *  commander   — ENGAGED dominant, high click rate, velocity bursts (>80th pct)
 *  researcher  — HESITANT dominant, high dwell, low hesitation count
 *  explorer    — high global entropy, mixed transitions, curious navigation
 *  skeptic     — HESITANT dominant, high hesitation count (> 5 events)
 *  neutral     — no clear dominant state; probability 0.3–0.7
 */
export type PersonaType =
  | 'analytical'
  | 'storyteller'
  | 'commander'
  | 'researcher'
  | 'explorer'
  | 'skeptic'
  | 'neutral';

// ─── HMM State ────────────────────────────────────────────────────────────────

/**
 * The three discrete hidden behavioral states inferred by the HMM.
 *   ENGAGED   — fast, deliberate interaction (analytical tendency)
 *   SCANNING  — exploratory scrolling/browsing (storyteller tendency)
 *   HESITANT  — dwelling, pausing, undecided (neutral tendency)
 */
export type HiddenStateName = 'ENGAGED' | 'SCANNING' | 'HESITANT';

/**
 * Snapshot of the HMM model and its current inference result.
 * Stored as part of IntentState so the pipeline can be continued between
 * React renders without losing calibrated parameters.
 */
export interface HMMModelState {
  /** Index of current most-likely hidden state from Viterbi (0=ENGAGED,1=SCANNING,2=HESITANT) */
  currentStateIndex: number;
  /** Human-readable name of the current state */
  currentStateName:  HiddenStateName;
  /** Smoothed posterior P(hₜ=i | O₁…OT, θ) for each state */
  posteriors:        number[];
  /** Calibrated N×N transition matrix A (updated by Baum-Welch) */
  transitionMatrix:  number[][];
  /** Calibrated N×M emission matrix B */
  emissionMatrix:    number[][];
  /** Initial state distribution π */
  initialDistribution: number[];
  /** Total number of discrete observations collected so far */
  observationCount:  number;
}

// ─── Behavioral Metrics ───────────────────────────────────────────────────────

/**
 * Statistical summary of the user's current behavioral profile.
 * All values are normalized where applicable for easy comparison.
 */
export interface BehavioralMetrics {
  /**
   * Global Shannon entropy of the stationary state distribution.
   *   H = -Σ pᵢ log₂(pᵢ)   bits ∈ [0, log₂(N)]
   * High entropy → diverse behavior; low entropy → stereotyped behavior.
   */
  globalEntropy: number;
  /**
   * Per-state local transition entropy Hᵢ = -Σⱼ Pᵢⱼ log₂(Pᵢⱼ) for each state.
   * Measures how predictable the "next state" is from state i.
   */
  localEntropies: number[];
  /**
   * Second-largest eigenvalue λ₂ of the transition matrix.
   * |λ₂| ≈ 1 → high temporal persistence (user lingers in states).
   * |λ₂| ≈ 0 → rapid mixing, fluid behavioral transitions.
   */
  eigen2: number;
  /**
   * PCHIP-derived percentile rank of the current velocity vs user's own history.
   * 0.9 means faster than 90 % of their own previous readings.
   */
  velocityPercentile: number;
  /**
   * Soft GMM persona membership probabilities [analytical, storyteller, neutral].
   * Values sum to 1 and represent the probability of belonging to each segment.
   */
  personaMemberships: number[];
}

// ─── Intent State (main Jotai atom value) ─────────────────────────────────────

/** Full intent state stored in Jotai and derived from sensor + HMM pipeline */
export interface IntentState {
  /** 0.0 = Storyteller, 1.0 = Analytical; 0.3–0.7 = Neutral/Superposition */
  probability:   number;
  persona:       PersonaType;
  mouseVelocity: number;
  scrollVelocity: number;
  /** ID of the element the user is dwelling on (hover intent) */
  hoverDwellId:  string | null;
  /** HMM-derived behavioral state model (full parameter snapshot) */
  hmm:           HMMModelState;
  /** Statistical metrics derived from the calibrated HMM */
  metrics:       BehavioralMetrics;
}

// ─── Sensor Metrics ───────────────────────────────────────────────────────────

/** Raw metrics computed by SensorService from mouse/scroll/hover events */
export interface SensorMetrics {
  mouseVelocity:   number;
  scrollVelocity:  number;
  /** Milliseconds the cursor has been dwelling on the current element */
  dwellDuration:   number;
  /** Number of anomalously long pauses (> 500 ms) in the current session */
  hesitationCount: number;
  /** Click events per second (rolling 5 s window) */
  clickRate:       number;
  hoverDwellId?:   string | null;
}

// ─── Database Record ──────────────────────────────────────────────────────────

/** User DNA record for persistence (Supabase user_dna table) */
export interface UserPersonaRecord {
  user_id:      string;
  persona:      string;
  probability:  number;
  /** JSON-serialised HMMModelState for session continuity */
  hmm_state?:   string;
  /** JSON-serialised BehavioralMetrics snapshot */
  metrics?:     string;
  last_updated: string;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

/** Time and interaction metrics collected for a single tracked section */
export interface SectionMetrics {
  id:           string;
  label:        string;
  /** Total milliseconds the section was in viewport */
  totalDwellMs: number;
  /** Number of times the section entered the viewport */
  visitCount:   number;
  /** Number of click events that fired inside this section */
  clickCount:   number;
  /** Maximum scroll depth reached inside this section (0–1) */
  maxScrollPct: number;
  /** Timestamp of last visit */
  lastVisitAt:  number | null;
}

/** A snapshot of persona at a point in time (for evolution timeline) */
export interface PersonaSnapshot {
  persona:     PersonaType;
  probability: number;
  timestamp:   number;
  /** HMM state at this moment */
  hmmState:    HiddenStateName;
}

/** Full session-level analytics state stored in Jotai */
export interface AnalyticsState {
  sessionStartMs:   number;
  /** Per-section interaction metrics keyed by section id */
  sections:         Record<string, SectionMetrics>;
  /** Time-ordered log of persona changes */
  personaHistory:   PersonaSnapshot[];
  /** Time-ordered log of HMM state transitions */
  hmmStateHistory:  Array<{ state: HiddenStateName; timestamp: number }>;
  totalClicks:      number;
  totalScrollPx:    number;
  /** Total distinct sections visited */
  sectionsVisited:  number;
}
