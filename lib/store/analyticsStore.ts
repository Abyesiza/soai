import { atom } from 'jotai';
import type { AnalyticsState, SectionMetrics } from '@/types';

/** Default empty metrics for a named section */
export function defaultSection(id: string, label: string): SectionMetrics {
  return {
    id,
    label,
    totalDwellMs: 0,
    visitCount:   0,
    clickCount:   0,
    maxScrollPct: 0,
    lastVisitAt:  null,
  };
}

/**
 * All tracked section IDs and their display labels.
 * The analytics hook registers Intersection Observers for each of these.
 */
export const TRACKED_SECTIONS: Array<{ id: string; label: string }> = [
  { id: 'section-hero',     label: 'Hero' },
  { id: 'section-features', label: 'Features' },
  { id: 'section-pipeline', label: 'Pipeline' },
  { id: 'section-social',   label: 'Social Proof' },
  { id: 'section-pricing',  label: 'Pricing' },
  { id: 'section-cta',      label: 'CTA' },
];

const initialSections: Record<string, SectionMetrics> = {};
for (const s of TRACKED_SECTIONS) {
  initialSections[s.id] = defaultSection(s.id, s.label);
}

export const analyticsAtom = atom<AnalyticsState>({
  sessionStartMs:  Date.now(),
  sections:        initialSections,
  personaHistory:  [],
  hmmStateHistory: [],
  totalClicks:     0,
  totalScrollPx:   0,
  sectionsVisited: 0,
});
