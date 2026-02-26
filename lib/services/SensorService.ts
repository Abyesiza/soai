import type { SensorMetrics } from '@/types';

/**
 * Behavioral Sensor Array: translates raw mouse/scroll events into
 * velocity and intent metrics. All math lives here so React stays thin.
 */
export class SensorService {
  private lastPos: { x: number; y: number } = { x: 0, y: 0 };
  private lastTime: number = Date.now();
  private lastScrollY: number = 0;
  private lastScrollTime: number = Date.now();

  /** Reset internal state (e.g. on mount or tab focus). */
  reset(x: number = 0, y: number = 0): void {
    this.lastPos = { x, y };
    this.lastTime = Date.now();
    this.lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    this.lastScrollTime = Date.now();
  }

  /**
   * Compute mouse velocity (distance/time) and update internal position/time.
   */
  calculateVelocity(clientX: number, clientY: number, now: number = Date.now()): number {
    const dt = now - this.lastTime;
    if (dt <= 0) return 0;

    const dx = clientX - this.lastPos.x;
    const dy = clientY - this.lastPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const velocity = distance / dt;

    this.lastPos = { x: clientX, y: clientY };
    this.lastTime = now;
    return velocity;
  }

  /**
   * Compute scroll velocity (absolute scroll distance / time) and update scroll state.
   */
  calculateScrollVelocity(scrollY: number, now: number = Date.now()): number {
    const dt = now - this.lastScrollTime;
    if (dt <= 0) return 0;

    const scrollDist = Math.abs(scrollY - this.lastScrollY);
    const velocity = scrollDist / dt;

    this.lastScrollY = scrollY;
    this.lastScrollTime = now;
    return velocity;
  }

  /**
   * Return current sensor-derived metrics (e.g. for logging or debugging).
   * Callers typically pass in the latest mouse/scroll values they just computed.
   */
  getMetrics(mouseVelocity: number, scrollVelocity: number): SensorMetrics {
    return { mouseVelocity, scrollVelocity };
  }
}

export const sensorService = new SensorService();
