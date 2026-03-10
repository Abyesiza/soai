'use client';

import { useEffect, useRef } from 'react';
import { useIntent } from '@/hooks/useIntent';
import { sensorService } from '@/lib/services/SensorService';
import {
  baumWelchStep,
  viterbi,
  getStatePosteriors,
  discretizeObservation,
  posteriorsToIntentProbability,
  defaultHMMParams,
  HMM_STATE_NAMES,
  N_STATES,
  type HMMParams,
} from '@/lib/math/HMMEngine';
import {
  shannonEntropy,
  allLocalEntropies,
  secondLargestEigenvalue,
  stationaryDistribution,
  pchipPercentileRank,
} from '@/lib/math/StatisticalMetrics';
import { softPersonaMembership, type GMMComponent } from '@/lib/math/PersonaClassifier';
import type { IntentState, PersonaType, HMMModelState, BehavioralMetrics } from '@/types';

// ─── Configuration ─────────────────────────────────────────────────────────────

/** Rolling window for discrete HMM observations */
const OBS_WINDOW_SIZE    = 100;
/** Baum-Welch EM update fired every N new observations */
const BAUM_WELCH_EVERY   = 20;
/** Minimum observations before running Baum-Welch */
const BAUM_WELCH_MIN_OBS = 10;
/** GMM refitted every N observations (more expensive) */
const GMM_REFIT_EVERY    = 50;
/** Minimum feature vectors before fitting GMM */
const GMM_MIN_SAMPLES    = 12;
/**
 * SCANNING-state hysteresis — ps must exceed this to trigger a storyteller change.
 * Prevents UI instability from noisy/transitional SCANNING flickers.
 */
const SCANNING_LOCK_THRESHOLD = 0.68;
/**
 * Additionally, the gap between ps and the next-highest posterior must be at
 * least this wide before we accept it as a definitive SCANNING state.
 */
const SCANNING_MIN_MARGIN = 0.18;

// ─── Helper: derive 7-persona label from HMM posteriors + metrics ─────────────

/**
 * Maps HMM posteriors and statistical metrics to one of 7 behavioral archetypes.
 *
 * Decision logic (priority order):
 *   1. commander  — ENGAGED dominant + velocity burst (>80th pct) + click rate > 0.3
 *   2. researcher — HESITANT dominant + low hesitation count + high dwell signal
 *   3. analytical — ENGAGED dominant + low entropy (stereotyped fast movement)
 *   4. explorer   — high global entropy (> 0.85 × log₂3) — diverse, curious
 *   5. skeptic    — HESITANT dominant + high hesitation count (> 5)
 *   6. storyteller— SCANNING dominant
 *   7. neutral    — fallback when no clear dominant signal
 */
function derivePersona(
  posteriors:       number[],
  probability:      number,
  globalEntropy:    number,
  velocityPct:      number,
  hesitationCount:  number,
  clickRate:        number,
  prevPersona:      PersonaType,
): PersonaType {
  const maxEntropy  = Math.log2(N_STATES);
  const [pe, ps, ph] = posteriors; // ENGAGED, SCANNING, HESITANT

  const engagedDominant  = pe > 0.5 && pe >= ps && pe >= ph;
  const hesitantDominant = ph > 0.5 && ph >= pe && ph >= ps;

  // Hysteresis for SCANNING: require a strong, unambiguous lead before
  // committing — otherwise keep the previous persona to avoid UI thrashing.
  const secondHighest    = Math.max(pe, ph); // highest non-scanning posterior
  const scanningDefinite =
    ps >= SCANNING_LOCK_THRESHOLD &&
    (ps - secondHighest) >= SCANNING_MIN_MARGIN;

  if (engagedDominant && velocityPct > 0.80 && clickRate > 0.3) return 'commander';
  if (hesitantDominant && hesitationCount <= 3)                   return 'researcher';
  if (engagedDominant && globalEntropy < 0.5 * maxEntropy)        return 'analytical';
  if (globalEntropy > 0.85 * maxEntropy)                          return 'explorer';
  if (hesitantDominant && hesitationCount > 5)                    return 'skeptic';
  // Only commit to storyteller when SCANNING is unambiguously dominant;
  // a weak SCANNING signal keeps the previous stable persona.
  if (scanningDefinite)                                            return 'storyteller';
  if (ps > 0.5 && !scanningDefinite)                              return prevPersona;
  return 'neutral';
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

/**
 * useBehavioralSensor
 *
 * Bridges raw DOM events → SensorService → HMM pipeline → Jotai intent state.
 *
 * Processing pipeline per event:
 *   1. SensorService computes mouse/scroll velocity, dwell time, hesitations.
 *   2. discretizeObservation maps continuous readings to a discrete symbol.
 *   3. The symbol is appended to a rolling observation window (OBS_WINDOW_SIZE).
 *   4. Every BAUM_WELCH_EVERY observations (after MIN reached), one Baum-Welch
 *      EM step refines the transition (A) and emission (B) matrices.
 *   5. Viterbi decoding recovers the optimal current hidden state.
 *   6. Forward-Backward posteriors provide probability of each state.
 *   7. posteriorsToIntentProbability() maps posteriors to the [0,1] scalar.
 *   8. Shannon entropy and λ₂ of A characterise behavioral structure.
 *   9. PCHIP ranks current velocity against user's own velocity history.
 *  10. Soft GMM membership (refitted every GMM_REFIT_EVERY obs) gives the
 *      probabilistic persona assignment over [analytical, storyteller, neutral].
 *  11. setIntent() updates the Jotai atom → triggers React re-renders.
 *
 * All heavy computation lives in refs to avoid stale closures and unnecessary
 * re-renders; only the derived IntentState diff is written to the atom.
 */
export function useBehavioralSensor(): void {
  const { setIntent } = useIntent();

  // ── Mutable refs — survive renders, never trigger re-renders ──────────────
  const hmmParamsRef      = useRef<HMMParams>(defaultHMMParams());
  const obsHistoryRef     = useRef<number[]>([]);
  const featureHistoryRef = useRef<number[][]>([]);  // [velocityPct, entropy, eigen2, pEngaged]
  const gmmComponentsRef  = useRef<GMMComponent[]>([]);
  const obsCountRef       = useRef<number>(0);
  /** Last committed persona — used for SCANNING hysteresis */
  const prevPersonaRef    = useRef<PersonaType>('neutral');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    sensorService.reset();

    // ── Shared update function ─────────────────────────────────────────────
    const processTick = (
      mouseVelocity:  number,
      scrollVelocity: number,
      isInteraction:  boolean
    ) => {
      const now     = Date.now();
      const dwellMs = sensorService.getDwellMs(now);

      // 1. Discretize to HMM observation symbol
      const symbol = discretizeObservation(mouseVelocity, scrollVelocity, dwellMs, isInteraction);

      // 2. Append to rolling observation window
      obsHistoryRef.current.push(symbol);
      if (obsHistoryRef.current.length > OBS_WINDOW_SIZE) {
        obsHistoryRef.current.shift();
      }
      obsCountRef.current++;

      const obs = obsHistoryRef.current;
      let params = hmmParamsRef.current;

      // 3. Baum-Welch EM update (periodically, once enough data)
      if (
        obsCountRef.current >= BAUM_WELCH_MIN_OBS &&
        obsCountRef.current % BAUM_WELCH_EVERY === 0
      ) {
        params = baumWelchStep(obs, params);
        hmmParamsRef.current = params;
      }

      // 4. Viterbi optimal state sequence
      const stateSeq   = viterbi(obs, params);
      const currentIdx = stateSeq[stateSeq.length - 1] ?? 1;

      // 5. State posteriors P(hₜ=i | O, θ)
      const posteriors = getStatePosteriors(obs, params);

      // 6. Intent probability derived from posteriors
      const probability = posteriorsToIntentProbability(posteriors);

      // 7. Shannon entropy of stationary distribution
      const stationary     = stationaryDistribution(params.A);
      const globalEntropy  = shannonEntropy(stationary);
      const localEntropies = allLocalEntropies(params.A);

      // 8. Second-largest eigenvalue (mixing / persistence)
      const eigen2 = secondLargestEigenvalue(params.A);

      // 9. PCHIP velocity percentile vs user's own history
      const velHistory       = sensorService.getVelocityHistory() as number[];
      const velocityPercentile = pchipPercentileRank(velHistory, mouseVelocity);

      // 10. Build feature vector for GMM and accumulate history
      const featureVec: number[] = [velocityPercentile, globalEntropy / Math.log2(N_STATES), Math.abs(eigen2), posteriors[0]];
      featureHistoryRef.current.push(featureVec);
      if (featureHistoryRef.current.length > 500) featureHistoryRef.current.shift();

      // 11. GMM refit (periodically once enough feature vectors exist)
      if (
        featureHistoryRef.current.length >= GMM_MIN_SAMPLES &&
        obsCountRef.current % GMM_REFIT_EVERY === 0
      ) {
        // Lazy import to keep initial bundle light — runs async (fire-and-forget)
        import('@/lib/math/PersonaClassifier').then(({ fitGMM }) => {
          const result = fitGMM(featureHistoryRef.current, 3, 50);
          gmmComponentsRef.current = result.components;
        });
      }

      // 12. Soft persona membership from GMM (or uniform prior)
      const personaMemberships = softPersonaMembership(featureVec, gmmComponentsRef.current);

      // 13. Assemble updated IntentState and push to Jotai
      const hmmState: HMMModelState = {
        currentStateIndex:   currentIdx,
        currentStateName:    HMM_STATE_NAMES[currentIdx],
        posteriors,
        transitionMatrix:    params.A,
        emissionMatrix:      params.B,
        initialDistribution: params.pi,
        observationCount:    obsCountRef.current,
      };

      const metrics: BehavioralMetrics = {
        globalEntropy,
        localEntropies,
        eigen2,
        velocityPercentile,
        personaMemberships,
      };

      const persona = derivePersona(
        posteriors,
        probability,
        globalEntropy,
        velocityPercentile,
        sensorService.getHesitationCount(),
        sensorService.getClickRate(),
        prevPersonaRef.current,
      );
      prevPersonaRef.current = persona;

      const newState: IntentState = {
        probability,
        persona,
        mouseVelocity,
        scrollVelocity,
        hoverDwellId:  sensorService.getDwellElementId(),
        hmm:           hmmState,
        metrics,
      };

      setIntent(newState);
    };

    // ── DOM Event Handlers ─────────────────────────────────────────────────

    const handleMouse = (e: MouseEvent) => {
      const mouseVelocity = sensorService.calculateVelocity(e.clientX, e.clientY);
      processTick(mouseVelocity, 0, false);
    };

    const handleScroll = () => {
      const scrollVelocity = sensorService.calculateScrollVelocity(window.scrollY);
      processTick(0, scrollVelocity, false);
    };

    const handleClick = () => {
      sensorService.registerClick();
      processTick(0, 0, true);
    };

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const id = target?.id ?? target?.dataset?.dwellId ?? null;
      sensorService.startDwell(id);
    };

    window.addEventListener('mousemove',  handleMouse);
    window.addEventListener('scroll',     handleScroll,     { passive: true });
    window.addEventListener('click',      handleClick);
    document.addEventListener('mouseenter', handleMouseEnter, true);

    return () => {
      window.removeEventListener('mousemove',  handleMouse);
      window.removeEventListener('scroll',     handleScroll);
      window.removeEventListener('click',      handleClick);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
    };
  }, [setIntent]);
}
