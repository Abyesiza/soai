'use client';

import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { analyticsAtom, TRACKED_SECTIONS } from '@/lib/store/analyticsStore';
import { useIntent } from '@/hooks/useIntent';
import type { PersonaSnapshot, AnalyticsState } from '@/types';

/**
 * useAnalytics
 *
 * Passive session tracking hook. Attach once in a root layout component.
 * Collects:
 *   - Per-section dwell time via IntersectionObserver
 *   - Per-section click counts via delegated click handlers
 *   - Persona history (logs on every persona transition)
 *   - HMM state history (logs on every state transition)
 *   - Total scroll distance
 *   - Total click count
 *
 * All data lives in the `analyticsAtom` Jotai atom — components can subscribe
 * independently without prop-drilling.
 */
export function useAnalytics(): void {
  const [, setAnalytics] = useAtom(analyticsAtom);
  const { intent } = useIntent();

  // Refs to track dwell start times per section
  const dwellStartRef = useRef<Record<string, number>>({});
  // Last recorded persona to detect transitions
  const lastPersonaRef     = useRef<string>('');
  const lastHMMStateRef    = useRef<string>('');
  const lastScrollYRef     = useRef<number>(0);
  const personaDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── IntersectionObserver: section dwell time ────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observers: IntersectionObserver[] = [];

    for (const { id } of TRACKED_SECTIONS) {
      const el = document.getElementById(id);
      if (!el) continue;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const now = Date.now();
            if (entry.isIntersecting) {
              dwellStartRef.current[id] = now;
              setAnalytics((prev: AnalyticsState) => {
                const existing = prev.sections[id];
                const wasNew   = existing.visitCount === 0;
                return {
                  ...prev,
                  sectionsVisited: wasNew ? prev.sectionsVisited + 1 : prev.sectionsVisited,
                  sections: {
                    ...prev.sections,
                    [id]: {
                      ...existing,
                      visitCount:  existing.visitCount + 1,
                      lastVisitAt: now,
                    },
                  },
                };
              });
            } else {
              // Section left viewport — accumulate dwell time
              const start = dwellStartRef.current[id];
              if (start) {
                const elapsed = now - start;
                delete dwellStartRef.current[id];
                setAnalytics((prev: AnalyticsState) => ({
                  ...prev,
                  sections: {
                    ...prev.sections,
                    [id]: {
                      ...prev.sections[id],
                      totalDwellMs: prev.sections[id].totalDwellMs + elapsed,
                    },
                  },
                }));
              }
            }
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(el);
      observers.push(observer);
    }

    return () => observers.forEach(o => o.disconnect());
  }, [setAnalytics]);

  // ── Click delegation: per-section click counts ──────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Walk up the DOM to find a tracked section
      let el: HTMLElement | null = target;
      while (el) {
        if (el.id && TRACKED_SECTIONS.some(s => s.id === el!.id)) {
          setAnalytics((prev: AnalyticsState) => ({
            ...prev,
            totalClicks: prev.totalClicks + 1,
            sections: {
              ...prev.sections,
              [el!.id]: {
                ...prev.sections[el!.id],
                clickCount: prev.sections[el!.id].clickCount + 1,
              },
            },
          }));
          return;
        }
        el = el.parentElement;
      }
      // Click outside any tracked section
      setAnalytics((prev: AnalyticsState) => ({
        ...prev,
        totalClicks: prev.totalClicks + 1,
      }));
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [setAnalytics]);

  // ── Scroll distance tracking ─────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta    = Math.abs(currentY - lastScrollYRef.current);
      lastScrollYRef.current = currentY;
      if (delta > 0) {
        setAnalytics((prev: AnalyticsState) => ({
          ...prev,
          totalScrollPx: prev.totalScrollPx + delta,
        }));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setAnalytics]);

  // ── Persona transition logging ───────────────────────────────────────────
  useEffect(() => {
    const persona  = intent.persona;
    const hmmState = intent.hmm.currentStateName;

    // Log HMM state transitions immediately
    if (hmmState !== lastHMMStateRef.current) {
      lastHMMStateRef.current = hmmState;
      setAnalytics((prev: AnalyticsState) => ({
        ...prev,
        hmmStateHistory: [
          ...prev.hmmStateHistory.slice(-199), // keep last 200
          { state: hmmState, timestamp: Date.now() },
        ],
      }));
    }

    // Debounce persona changes by 500 ms to avoid noise
    if (persona !== lastPersonaRef.current) {
      if (personaDebounceRef.current) clearTimeout(personaDebounceRef.current);
      personaDebounceRef.current = setTimeout(() => {
        lastPersonaRef.current = persona;
        const snap: PersonaSnapshot = {
          persona,
          probability: intent.probability,
          timestamp:   Date.now(),
          hmmState:    intent.hmm.currentStateName,
        };
        setAnalytics((prev: AnalyticsState) => ({
          ...prev,
          personaHistory: [...prev.personaHistory.slice(-99), snap],
        }));
      }, 500);
    }
  }, [intent.persona, intent.hmm.currentStateName, intent.probability, setAnalytics]);
}
