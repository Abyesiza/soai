'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Brain, ChevronUp, ChevronDown, BarChart2 } from 'lucide-react';
import { useIntent } from '@/hooks/useIntent';
import { HMM_STATE_NAMES } from '@/lib/math/HMMEngine';

// ── Color maps ────────────────────────────────────────────────────────────────
const STATE_COLORS: Record<string, { dot: string; bar: string; text: string }> = {
  ENGAGED:  { dot: 'bg-cyan-400',   bar: 'bg-cyan-500',   text: 'text-cyan-400' },
  SCANNING: { dot: 'bg-violet-400', bar: 'bg-violet-500', text: 'text-violet-400' },
  HESITANT: { dot: 'bg-amber-400',  bar: 'bg-amber-500',  text: 'text-amber-400' },
};

const PERSONA_META = [
  { label: 'Analytical',  bar: 'bg-cyan-500' },
  { label: 'Storyteller', bar: 'bg-violet-500' },
  { label: 'Neutral',     bar: 'bg-amber-500' },
];

// ── Animated bar ──────────────────────────────────────────────────────────────
function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className={`h-full ${color} rounded-full`}
        animate={{ width: `${Math.min(value * 100, 100)}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 22 }}
      />
    </div>
  );
}

// ── Stat tile ─────────────────────────────────────────────────────────────────
function StatTile({
  label, value, unit, color, fill,
}: {
  label: string; value: string; unit?: string; color: string; fill: number;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-3 flex flex-col gap-1">
      <span className="text-[10px] uppercase tracking-widest text-slate-500">{label}</span>
      <span className={`text-xl font-bold font-mono ${color}`}>
        {value}<span className="text-sm text-slate-500 ml-0.5">{unit}</span>
      </span>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color.replace('text-', 'bg-')} rounded-full`}
          animate={{ width: `${Math.min(fill * 100, 100)}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function LiveMetricsPanel() {
  const { intent } = useIntent();
  const [open, setOpen] = useState(false);

  const { hmm, metrics, probability, mouseVelocity } = intent;
  const state = hmm.currentStateName;
  const colors = STATE_COLORS[state] ?? STATE_COLORS.HESITANT;

  const maxEntropy = Math.log2(3); // max for N = 3 states

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="w-[300px] bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-4 space-y-4"
          >
            {/* Title row */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Brain className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-sm font-semibold text-slate-200">HMM Live Engine</span>
              <span className="ml-auto font-mono text-[10px] text-slate-500 tabular-nums">
                {hmm.observationCount} obs
              </span>
            </div>

            {/* HMM State Posteriors */}
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">
                State Posteriors  P(h<sub>t</sub> | O, θ)
              </p>
              {HMM_STATE_NAMES.map((name, i) => {
                const c = STATE_COLORS[name] ?? STATE_COLORS.HESITANT;
                const pct = hmm.posteriors[i] ?? 0;
                return (
                  <div key={name} className="flex items-center gap-2">
                    <span className={`text-[11px] font-mono w-[68px] ${c.text}`}>{name}</span>
                    <Bar value={pct} color={c.bar} />
                    <span className="text-[11px] font-mono w-8 text-right text-slate-300 tabular-nums">
                      {(pct * 100).toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Statistical metrics grid */}
            <div className="grid grid-cols-2 gap-2">
              <StatTile
                label="Shannon H"
                value={metrics.globalEntropy.toFixed(2)}
                unit=" bits"
                color="text-cyan-400"
                fill={metrics.globalEntropy / maxEntropy}
              />
              <StatTile
                label="λ₂ Eigen"
                value={metrics.eigen2.toFixed(3)}
                color="text-violet-400"
                fill={Math.abs(metrics.eigen2)}
              />
              <StatTile
                label="Velocity %ile"
                value={(metrics.velocityPercentile * 100).toFixed(0)}
                unit="th"
                color="text-emerald-400"
                fill={metrics.velocityPercentile}
              />
              <StatTile
                label="Intent P"
                value={probability.toFixed(2)}
                color="text-amber-400"
                fill={probability}
              />
            </div>

            {/* GMM Memberships */}
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">
                GMM Persona Memberships
              </p>
              {PERSONA_META.map((pm, i) => {
                const val = metrics.personaMemberships[i] ?? 1 / 3;
                return (
                  <div key={pm.label} className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400 w-20">{pm.label}</span>
                    <Bar value={val} color={pm.bar} />
                    <span className="text-[11px] font-mono w-8 text-right text-slate-300 tabular-nums">
                      {(val * 100).toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Mouse velocity ticker */}
            <div className="bg-white/5 rounded-xl p-2 flex items-center gap-2">
              <BarChart2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">Mouse v</span>
              <span className="ml-auto font-mono text-[11px] text-slate-300 tabular-nums">
                {mouseVelocity.toFixed(3)} px/ms
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle pill */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-950/90 backdrop-blur-xl border border-white/10 shadow-lg hover:border-white/20 transition-all"
      >
        <span className={`w-2 h-2 rounded-full animate-glow-pulse ${colors.dot}`} />
        <Activity className="w-3.5 h-3.5 text-slate-400" />
        <span className={`text-xs font-mono ${colors.text}`}>{state}</span>
        {open
          ? <ChevronDown className="w-3 h-3 text-slate-500" />
          : <ChevronUp   className="w-3 h-3 text-slate-500" />}
      </button>
    </div>
  );
}
