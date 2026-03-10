import type { SensorMetrics } from '@/types';

/**
 * Behavioral Sensor Array
 *
 * Translates raw DOM events (mouse, scroll, click, hover) into the
 * quantified interaction features consumed by the HMM pipeline.
 *
 * New capabilities beyond basic velocity:
 *   - Dwell time tracking   — time cursor spends over one element
 *   - Hesitation detection  — anomalously long pauses (> HESITATION_THRESHOLD_MS)
 *   - Click-rate estimation — clicks per second in a rolling window
 *   - Velocity history      — last HISTORY_SIZE readings for PCHIP percentile rank
 *
 * All math lives here so React hooks stay thin and free from physics logic.
 */

/** Pause duration (ms) that qualifies as a hesitation event */
const HESITATION_THRESHOLD_MS = 500;

/** Rolling window size for click-rate estimation (ms) */
const CLICK_RATE_WINDOW_MS = 5000;

/** Maximum entries kept in velocity history for PCHIP interpolation */
const HISTORY_SIZE = 200;

export class SensorService {
  // ── Mouse tracking ────────────────────────────────────────────────────────
  private lastPos:  { x: number; y: number } = { x: 0, y: 0 };
  private lastTime: number = Date.now();

  // ── Scroll tracking ───────────────────────────────────────────────────────
  private lastScrollY:    number = 0;
  private lastScrollTime: number = Date.now();

  // ── Dwell tracking ────────────────────────────────────────────────────────
  private dwellStart:     number = Date.now();
  private dwellElementId: string | null = null;

  // ── Hesitation detection ──────────────────────────────────────────────────
  private lastInteractionTime: number = Date.now();
  private hesitationCount:     number = 0;

  // ── Click-rate (rolling window) ───────────────────────────────────────────
  /** Timestamps of recent clicks kept within CLICK_RATE_WINDOW_MS */
  private clickTimestamps: number[] = [];

  // ── Velocity history (circular buffer for PCHIP) ──────────────────────────
  private velocityHistory: number[] = [];

  // ─────────────────────────────────────────────────────────────────────────

  /** Reset all internal state (call on mount or tab focus). */
  reset(x = 0, y = 0): void {
    const now = Date.now();
    this.lastPos           = { x, y };
    this.lastTime          = now;
    this.lastScrollY       = typeof window !== 'undefined' ? window.scrollY : 0;
    this.lastScrollTime    = now;
    this.dwellStart        = now;
    this.dwellElementId    = null;
    this.lastInteractionTime = now;
    this.hesitationCount   = 0;
    this.clickTimestamps   = [];
    this.velocityHistory   = [];
  }

  // ─── Mouse Velocity ───────────────────────────────────────────────────────

  /**
   * Computes Euclidean mouse speed in px/ms and records it in the rolling
   * history buffer used later by PCHIP percentile ranking.
   *
   *   v = √(Δx² + Δy²) / Δt
   */
  calculateVelocity(clientX: number, clientY: number, now: number = Date.now()): number {
    const dt = now - this.lastTime;
    if (dt <= 0) return 0;

    // Hesitation detection — flag gaps larger than the threshold
    if (dt > HESITATION_THRESHOLD_MS) this.hesitationCount++;

    const dx = clientX - this.lastPos.x;
    const dy = clientY - this.lastPos.y;
    const velocity = Math.sqrt(dx * dx + dy * dy) / dt;

    this.lastPos  = { x: clientX, y: clientY };
    this.lastTime = now;
    this.lastInteractionTime = now;

    // Maintain rolling velocity history (circular push)
    this.velocityHistory.push(velocity);
    if (this.velocityHistory.length > HISTORY_SIZE) this.velocityHistory.shift();

    return velocity;
  }

  // ─── Scroll Velocity ──────────────────────────────────────────────────────

  /**
   * Computes scroll speed in px/ms.
   *   v_scroll = |Δscroll| / Δt
   */
  calculateScrollVelocity(scrollY: number, now: number = Date.now()): number {
    const dt = now - this.lastScrollTime;
    if (dt <= 0) return 0;

    const velocity = Math.abs(scrollY - this.lastScrollY) / dt;
    this.lastScrollY    = scrollY;
    this.lastScrollTime = now;
    this.lastInteractionTime = now;
    return velocity;
  }

  // ─── Dwell Tracking ───────────────────────────────────────────────────────

  /**
   * Call this when the cursor enters a new element.
   * Resets the dwell timer and records which element is being dwelt on.
   */
  startDwell(elementId: string | null, now: number = Date.now()): void {
    this.dwellStart     = now;
    this.dwellElementId = elementId;
  }

  /**
   * Returns the milliseconds elapsed since the last dwell start.
   * Useful for passing into the HMM discretizer.
   */
  getDwellMs(now: number = Date.now()): number {
    return now - this.dwellStart;
  }

  /** ID of the element currently being dwelt on (null if between elements). */
  getDwellElementId(): string | null {
    return this.dwellElementId;
  }

  // ─── Click Rate ───────────────────────────────────────────────────────────

  /**
   * Records a click event and returns the current rolling click rate (clicks/s).
   * Prunes timestamps outside the CLICK_RATE_WINDOW_MS window before computing.
   */
  registerClick(now: number = Date.now()): number {
    this.clickTimestamps.push(now);
    this.lastInteractionTime = now;
    // Evict timestamps older than the window
    const cutoff = now - CLICK_RATE_WINDOW_MS;
    this.clickTimestamps = this.clickTimestamps.filter(t => t >= cutoff);
    return this.getClickRate(now);
  }

  /** Current click rate in clicks per second (rolling CLICK_RATE_WINDOW_MS). */
  getClickRate(now: number = Date.now()): number {
    const cutoff = now - CLICK_RATE_WINDOW_MS;
    const recent = this.clickTimestamps.filter(t => t >= cutoff).length;
    return recent / (CLICK_RATE_WINDOW_MS / 1000);
  }

  // ─── Hesitation ───────────────────────────────────────────────────────────

  /** Total number of detected hesitation events in the current session. */
  getHesitationCount(): number {
    return this.hesitationCount;
  }

  /** Clear the hesitation counter (e.g. after a page navigation). */
  resetHesitationCount(): void {
    this.hesitationCount = 0;
  }

  // ─── Velocity History ─────────────────────────────────────────────────────

  /**
   * Returns a read-only copy of the rolling velocity history.
   * Used by the PCHIP module to build an individualized CDF.
   */
  getVelocityHistory(): readonly number[] {
    return this.velocityHistory;
  }

  // ─── Composite Metrics Snapshot ───────────────────────────────────────────

  /**
   * Returns a complete SensorMetrics snapshot for the current tick.
   * Callers pass in the pre-computed velocities to avoid double-calculation.
   */
  getMetrics(
    mouseVelocity:  number,
    scrollVelocity: number,
    now:            number = Date.now()
  ): SensorMetrics {
    return {
      mouseVelocity,
      scrollVelocity,
      dwellDuration:   this.getDwellMs(now),
      hesitationCount: this.hesitationCount,
      clickRate:       this.getClickRate(now),
      hoverDwellId:    this.dwellElementId,
    };
  }
}

export const sensorService = new SensorService();
