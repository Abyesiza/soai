'use client';

import { useEffect, useRef } from 'react';
import { useIntent } from '@/hooks/useIntent';
import { sensorService } from '@/lib/services/SensorService';
import type { IntentState, PersonaType } from '@/types';

function derivePersona(probability: number): PersonaType {
  if (probability > 0.7) return 'analytical';
  if (probability < 0.3) return 'storyteller';
  return 'neutral';
}

/**
 * Bridges SensorService to React: tracks mouse velocity, scroll velocity,
 * and updates Jotai intent state. Uses a ref for latest intent so we
 * don't re-subscribe to window events on every probability tick.
 */
export function useBehavioralSensor(): void {
  const { intent, setIntent } = useIntent();
  const intentRef = useRef<IntentState>(intent);
  intentRef.current = intent;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    sensorService.reset();

    const handleMouse = (e: MouseEvent) => {
      const mouseVelocity = sensorService.calculateVelocity(e.clientX, e.clientY);
      const prev = intentRef.current;
      let newProb = prev.probability;

      if (mouseVelocity > 2.5) {
        newProb = Math.min(newProb + 0.05, 1.0);
      } else if (mouseVelocity < 0.2 && mouseVelocity > 0) {
        newProb = Math.max(newProb - 0.02, 0);
      }

      setIntent({
        probability: newProb,
        persona: derivePersona(newProb),
        mouseVelocity,
        scrollVelocity: prev.scrollVelocity,
        hoverDwellId: prev.hoverDwellId,
      });
    };

    const handleScroll = () => {
      const now = Date.now();
      const scrollY = window.scrollY;
      const scrollVelocity = sensorService.calculateScrollVelocity(scrollY, now);
      const prev = intentRef.current;
      let newProb = prev.probability;

      if (scrollVelocity > 2.0) {
        newProb = Math.min(newProb + 0.05, 1.0);
      } else if (scrollVelocity < 0.2 && scrollVelocity > 0) {
        newProb = Math.max(newProb - 0.02, 0);
      }

      setIntent({
        probability: newProb,
        persona: derivePersona(newProb),
        mouseVelocity: prev.mouseVelocity,
        scrollVelocity,
        hoverDwellId: prev.hoverDwellId,
      });
    };

    window.addEventListener('mousemove', handleMouse);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setIntent]);
}
