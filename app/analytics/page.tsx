'use client';

import { useBehavioralSensor } from '@/hooks/useBehavioralSensor';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useIntent } from '@/hooks/useIntent';
import { useAtom } from 'jotai';
import { analyticsAtom } from '@/lib/store/analyticsStore';
import { Header } from '@/components/layout/Header';
import { LiveMetricsPanel } from '@/components/agentic/LiveMetricsPanel';
import { motion } from 'framer-motion';
import type { PersonaType, SectionMetrics, PersonaSnapshot } from '@/types';

// ─── Color maps ───────────────────────────────────────────────────────────────

const PERSONA_COLORS: Record<PersonaType, string> = {
  commander:   '#ef4444',
  analytical:  '#06b6d4',
  researcher:  '#10b981',
  explorer:    '#f59e0b',
  storyteller: '#8b5cf6',
  skeptic:     '#f97316',
  neutral:     '#64748b',
};

const SECTION_COLORS = [
  '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#f97316',
];

// ─── Utility helpers ──────────────────────────────────────────────────────────

function fmtMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}

function fmtPx(px: number): string {
  if (px < 1000) return `${Math.round(px)}px`;
  return `${(px / 1000).toFixed(1)}k px`;
}

// ─── Reusable chart components ────────────────────────────────────────────────

function Panel({ title, subtitle, children, className = '' }: {
  title: string; subtitle?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`bg-slate-900/60 border border-slate-800 rounded-2xl p-6 ${className}`}>
      <div className="mb-5">
        <div className="text-xs font-mono uppercase tracking-widest text-slate-500">{title}</div>
        {subtitle && <div className="text-[11px] text-slate-600 mt-0.5">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function KpiCard({ label, value, sub, color }: {
  label: string; value: string; sub?: string; color: string;
}) {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-1">
      <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{label}</div>
      <div className="text-3xl font-black font-mono" style={{ color }}>{value}</div>
      {sub && <div className="text-xs text-slate-600">{sub}</div>}
    </div>
  );
}

/** Horizontal bar chart for section dwell time */
function SectionDwellChart({ sections }: { sections: SectionMetrics[] }) {
  const max = Math.max(...sections.map(s => s.totalDwellMs), 1);
  return (
    <div className="space-y-3">
      {sections.map((s, i) => (
        <div key={s.id} className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>{s.label}</span>
            <span className="font-mono">{fmtMs(s.totalDwellMs)}</span>
          </div>
          <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: SECTION_COLORS[i % SECTION_COLORS.length] }}
              initial={{ width: 0 }}
              animate={{ width: `${(s.totalDwellMs / max) * 100}%` }}
              transition={{ type: 'spring', stiffness: 80, damping: 18, delay: i * 0.05 }}
            />
          </div>
          <div className="flex gap-4 text-[10px] text-slate-600">
            <span>{s.visitCount} visit{s.visitCount !== 1 ? 's' : ''}</span>
            <span>{s.clickCount} click{s.clickCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Persona timeline — colour-coded dot timeline */
function PersonaTimeline({ history, sessionStart }: {
  history: PersonaSnapshot[];
  sessionStart: number;
}) {
  if (history.length === 0) {
    return <div className="text-sm text-slate-600 py-4 text-center">Interact to generate persona history…</div>;
  }
  const sessionDuration = Date.now() - sessionStart;
  return (
    <div className="relative">
      {/* Horizontal axis */}
      <div className="h-8 relative">
        <div className="absolute inset-y-0 left-0 right-0 flex items-center">
          {history.map((snap, i) => {
            const x = ((snap.timestamp - sessionStart) / Math.max(sessionDuration, 1)) * 100;
            return (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -translate-x-1/2 group"
                style={{ left: `${x}%` }}
              >
                <div
                  className="w-3 h-3 rounded-full border-2 border-slate-950 cursor-default"
                  style={{ backgroundColor: PERSONA_COLORS[snap.persona] }}
                  title={`${snap.persona} @ ${new Date(snap.timestamp).toLocaleTimeString()}`}
                />
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 border border-slate-700 rounded px-2 py-1 text-[10px] font-mono text-white whitespace-nowrap z-10">
                  {snap.persona}<br />{(snap.probability * 100).toFixed(0)}%
                </div>
              </motion.div>
            );
          })}
        </div>
        {/* Baseline */}
        <div className="absolute inset-y-4 left-0 right-0 h-px bg-slate-800" />
      </div>
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3">
        {(Object.keys(PERSONA_COLORS) as PersonaType[]).filter(p =>
          history.some(h => h.persona === p)
        ).map(p => (
          <div key={p} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PERSONA_COLORS[p] }} />
            <span className="text-[10px] text-slate-500 capitalize">{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Donut-style persona distribution chart (CSS-based) */
function PersonaDonut({ history }: { history: PersonaSnapshot[] }) {
  if (history.length === 0) {
    return <div className="text-sm text-slate-600 text-center py-6">No data yet</div>;
  }

  const counts: Record<string, number> = {};
  for (const s of history) counts[s.persona] = (counts[s.persona] ?? 0) + 1;
  const total = history.length;
  const items = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  // Build conic-gradient segments
  let cumPct = 0;
  const stops = items.map(([p, count]) => {
    const pct = (count / total) * 100;
    const color = PERSONA_COLORS[p as PersonaType] ?? '#64748b';
    const stop = `${color} ${cumPct.toFixed(1)}% ${(cumPct + pct).toFixed(1)}%`;
    cumPct += pct;
    return stop;
  });

  return (
    <div className="flex items-center gap-8">
      {/* Donut */}
      <div
        className="w-28 h-28 rounded-full shrink-0"
        style={{
          background: `conic-gradient(${stops.join(', ')})`,
          WebkitMask: 'radial-gradient(farthest-side, transparent 55%, black 56%)',
          mask: 'radial-gradient(farthest-side, transparent 55%, black 56%)',
        }}
      />
      {/* Legend */}
      <div className="space-y-1.5 flex-1 min-w-0">
        {items.map(([p, count]) => (
          <div key={p} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PERSONA_COLORS[p as PersonaType] ?? '#64748b' }} />
            <span className="text-xs text-slate-400 capitalize flex-1 truncate">{p}</span>
            <span className="text-xs font-mono text-slate-500">{((count / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** HMM state transition frequency table */
function StateTransitionTable({ matrix }: { matrix: number[][] }) {
  const labels = ['ENGAGED', 'SCANNING', 'HESITANT'];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-mono">
        <thead>
          <tr>
            <th className="text-left text-slate-600 pb-2 pr-3">From \ To</th>
            {labels.map(l => <th key={l} className="text-right text-slate-500 pb-2 px-2">{l.slice(0, 3)}</th>)}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <td className="text-slate-500 pr-3 py-1.5">{labels[i].slice(0, 3)}</td>
              {row.map((v, j) => (
                <td key={j} className="text-right py-1.5 px-2">
                  <span
                    className="rounded px-1 py-0.5"
                    style={{
                      color:           v > 0.5 ? '#fff' : '#94a3b8',
                      backgroundColor: `rgba(99,102,241,${(v * 0.6).toFixed(2)})`,
                    }}
                  >
                    {v.toFixed(3)}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Posterior bar */
function PosteriorRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-0.5">
      <div className="flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className="font-mono">{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${value * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        />
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  useBehavioralSensor();
  useAnalytics();

  const { intent } = useIntent();
  const [analytics] = useAtom(analyticsAtom);

  const sections         = Object.values(analytics.sections);
  const sessionDurationMs = Date.now() - analytics.sessionStartMs;
  const totalDwellMs     = sections.reduce((s, x) => s + x.totalDwellMs, 0);
  const topSection       = sections.reduce((a, b) => a.totalDwellMs > b.totalDwellMs ? a : b, sections[0]);

  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      <Header />

      <main className="pt-24 pb-16 max-w-7xl mx-auto px-6 space-y-8">

        {/* Page header */}
        <div className="space-y-1">
          <div className="text-xs font-mono uppercase tracking-widest text-indigo-500">Behavioral Analytics</div>
          <h1 className="text-3xl font-black text-white">Session Intelligence Dashboard</h1>
          <p className="text-slate-500 text-sm">
            Live behavioral fingerprint — driven by HMM inference, Shannon entropy, and PCHIP personalization.
          </p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          <KpiCard label="Session Time"     value={fmtMs(sessionDurationMs)}           sub="time since first load"             color="#06b6d4" />
          <KpiCard label="Total Clicks"     value={String(analytics.totalClicks)}       sub="within tracked sections"           color="#8b5cf6" />
          <KpiCard label="Scroll Distance"  value={fmtPx(analytics.totalScrollPx)}     sub="cumulative scroll"                 color="#10b981" />
          <KpiCard label="Sections Visited" value={String(analytics.sectionsVisited)}   sub={`of ${sections.length} total`}    color="#f59e0b" />
          <KpiCard label="HMM Obs"          value={String(intent.hmm.observationCount)} sub="discrete events processed"        color="#ef4444" />
          <KpiCard label="Persona Changes"  value={String(analytics.personaHistory.length)} sub="detected transitions"         color="#f97316" />
        </div>

        {/* Row 2 — Section dwell + persona donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Panel
            title="Section Dwell Time"
            subtitle="Intersection Observer — 20% visibility threshold"
            className="lg:col-span-2"
          >
            <SectionDwellChart sections={sections} />
          </Panel>

          <Panel title="Persona Distribution" subtitle="Proportion of time in each archetype">
            <PersonaDonut history={analytics.personaHistory} />
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Current persona</span>
                <span className="font-mono capitalize" style={{ color: PERSONA_COLORS[intent.persona] }}>
                  {intent.persona}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Probability</span>
                <span className="font-mono text-slate-400">{(intent.probability * 100).toFixed(1)}%</span>
              </div>
            </div>
          </Panel>
        </div>

        {/* Row 3 — Persona timeline */}
        <Panel title="Persona Evolution Timeline" subtitle="Each dot = one persona transition event (hover for details)">
          <PersonaTimeline history={analytics.personaHistory} sessionStart={analytics.sessionStartMs} />
        </Panel>

        {/* Row 4 — HMM internals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Panel title="HMM State Posteriors" subtitle="P(hₜ = i | O₁…OT, θ) — Baum-Welch smoothed">
            <div className="space-y-3">
              {(['ENGAGED', 'SCANNING', 'HESITANT'] as const).map((s, i) => (
                <PosteriorRow
                  key={s}
                  label={s}
                  value={intent.hmm.posteriors[i] ?? 0}
                  color={['#06b6d4', '#8b5cf6', '#f59e0b'][i]}
                />
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Current state</span>
                <span className="font-mono text-white">{intent.hmm.currentStateName}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Observations</span>
                <span className="font-mono text-white">{intent.hmm.observationCount}</span>
              </div>
            </div>
          </Panel>

          <Panel title="Transition Matrix A" subtitle="Calibrated by Baum-Welch EM — row-stochastic">
            <StateTransitionTable matrix={intent.hmm.transitionMatrix} />
          </Panel>

          <Panel title="Statistical Metrics" subtitle="Shannon entropy, Eigen₂, PCHIP percentile">
            <div className="space-y-4">
              {[
                { label: 'Shannon H', value: `${intent.metrics.globalEntropy.toFixed(4)} bits`, sub: `max = ${Math.log2(3).toFixed(4)} bits`, fill: intent.metrics.globalEntropy / Math.log2(3), color: '#06b6d4' },
                { label: 'λ₂ (Eigen₂)', value: intent.metrics.eigen2.toFixed(4), sub: '1 = persistent, 0 = fluid', fill: Math.abs(intent.metrics.eigen2), color: '#8b5cf6' },
                { label: 'Velocity Pct', value: `${(intent.metrics.velocityPercentile * 100).toFixed(1)}th`, sub: 'vs your own baseline (PCHIP)', fill: intent.metrics.velocityPercentile, color: '#10b981' },
              ].map(m => (
                <div key={m.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{m.label}</span>
                    <span className="font-mono text-white">{m.value}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: m.color }}
                      animate={{ width: `${Math.min(m.fill * 100, 100)}%` }}
                      transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-600">{m.sub}</div>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-800 space-y-1">
                {intent.metrics.localEntropies.map((h, i) => (
                  <div key={i} className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span>H{['ENGAGED', 'SCANNING', 'HESITANT'][i][0]}</span>
                    <span>{h.toFixed(4)} bits</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>

        {/* Row 5 — Per-section detail table */}
        <Panel title="Section Interaction Detail" subtitle="Full breakdown of every tracked section this session">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  {['Section', 'Dwell Time', 'Visits', 'Clicks', 'Click Rate', 'Last Seen'].map(h => (
                    <th key={h} className="text-left text-xs font-mono uppercase tracking-widest text-slate-500 pb-3 pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sections.map((s, i) => {
                  const isTop = s.id === topSection?.id && s.totalDwellMs > 0;
                  return (
                    <tr key={s.id} className={`border-b border-slate-800/40 ${isTop ? 'bg-indigo-950/20' : ''}`}>
                      <td className="py-3 pr-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SECTION_COLORS[i % SECTION_COLORS.length] }} />
                          <span className="text-white font-medium">{s.label}</span>
                          {isTop && <span className="text-[9px] font-mono text-indigo-400 border border-indigo-700/40 rounded px-1">TOP</span>}
                        </div>
                      </td>
                      <td className="py-3 pr-6 font-mono text-cyan-300">{fmtMs(s.totalDwellMs)}</td>
                      <td className="py-3 pr-6 font-mono text-slate-300">{s.visitCount}</td>
                      <td className="py-3 pr-6 font-mono text-slate-300">{s.clickCount}</td>
                      <td className="py-3 pr-6 font-mono text-slate-400">
                        {s.visitCount > 0 ? `${(s.clickCount / s.visitCount).toFixed(1)}/visit` : '—'}
                      </td>
                      <td className="py-3 pr-6 font-mono text-slate-500">
                        {s.lastVisitAt ? new Date(s.lastVisitAt).toLocaleTimeString() : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Row 6 — GMM persona memberships */}
        <Panel title="GMM Soft Persona Memberships" subtitle="Gaussian Mixture Model: probabilistic assignment over 3 clusters (refit every 50 observations)">
          <div className="grid grid-cols-3 gap-4">
            {(['Analytical', 'Storyteller', 'Neutral'] as const).map((label, i) => {
              const v    = intent.metrics.personaMemberships[i] ?? 1 / 3;
              const colors = ['#06b6d4', '#8b5cf6', '#f59e0b'];
              return (
                <div key={label} className="space-y-3 text-center">
                  <div
                    className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-xl font-black text-white border-4"
                    style={{
                      borderColor: colors[i],
                      background:  `conic-gradient(${colors[i]} ${(v * 360).toFixed(0)}deg, #1e293b 0deg)`,
                    }}
                  >
                    <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center">
                      <span className="text-sm font-mono" style={{ color: colors[i] }}>
                        {(v * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-white">{label}</div>
                  <div className="text-xs text-slate-500">rᵢ = {v.toFixed(4)}</div>
                </div>
              );
            })}
          </div>
        </Panel>

      </main>

      <LiveMetricsPanel />
    </div>
  );
}
