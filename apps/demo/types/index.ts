/**
 * Central type definitions for the SOAI (Self-Optimizing Agentic Interface).
 * Keeps IntentState, sensor metrics, and persona types in one place.
 */

/** Detected user persona driving UI superposition collapse */
export type PersonaType = 'analytical' | 'storyteller' | 'neutral';

/** Full intent state stored in Jotai and derived from sensor metrics */
export interface IntentState {
  /** 0.0 = Storyteller, 1.0 = Analytical; 0.3–0.7 = Neutral/Superposition */
  probability: number;
  persona: PersonaType;
  mouseVelocity: number;
  scrollVelocity: number;
  /** ID of the element the user is dwelling on (hover intent) */
  hoverDwellId: string | null;
}

/** Raw metrics computed by SensorService from mouse/scroll events */
export interface SensorMetrics {
  mouseVelocity: number;
  scrollVelocity: number;
  /** Optional: element id when hover dwell is tracked */
  hoverDwellId?: string | null;
}

/** User DNA record for persistence (Supabase user_dna table) */
export interface UserPersonaRecord {
  user_id: string;
  persona: string;
  probability: number;
  last_updated: string;
}
