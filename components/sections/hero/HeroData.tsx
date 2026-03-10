'use client';

import { useIntent } from '@/hooks/useIntent';
import { motion } from 'framer-motion';

function LiveMetric({ label, value, sub, color }: {
  label: string; value: string; sub?: string; color: string;
}) {
  return (
    <motion.div
      layout
      className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors"
    >
      <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">{label}</div>
      <div className={`text-3xl font-black font-mono tabular-nums ${color}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500 font-mono mt-1">{sub}</div>}
    </motion.div>
  );
}

export function HeroData() {
  const { intent } = useIntent();
  const { hmm, metrics, probability, mouseVelocity, scrollVelocity } = intent;

  return (
    <div className="relative w-full min-h-[600px] bg-slate-950 terminal-scanline overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Status bar */}
        <div className="flex items-center gap-3 mb-10">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-glow-pulse" />
          <span className="font-mono text-xs text-slate-400 uppercase tracking-widest">SOAI/ENGINE — STATE: {hmm.currentStateName}</span>
          <span className="ml-auto font-mono text-xs text-slate-600">{hmm.observationCount} obs collected</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black font-mono tracking-tight mb-4">
          <span className="gradient-text-analytical">Behavioral</span>
          <br />
          <span className="text-slate-100">Engine Active.</span>
        </h1>
        <p className="font-mono text-slate-400 text-lg mb-14 max-w-2xl">
          Real-time HMM inference · Baum–Welch parameter estimation · PCHIP personalisation
        </p>

        {/* Live metric grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <LiveMetric
            label="HMM State"
            value={hmm.currentStateName.slice(0, 3)}
            sub={`${(hmm.posteriors[hmm.currentStateIndex] * 100).toFixed(0)}% confident`}
            color="text-cyan-400"
          />
          <LiveMetric
            label="Shannon H"
            value={metrics.globalEntropy.toFixed(3)}
            sub="behavioral entropy (bits)"
            color="text-violet-400"
          />
          <LiveMetric
            label="λ₂ Eigen"
            value={metrics.eigen2.toFixed(4)}
            sub="temporal persistence"
            color="text-emerald-400"
          />
          <LiveMetric
            label="Intent P"
            value={probability.toFixed(3)}
            sub="[0=story · 1=analytical]"
            color="text-amber-400"
          />
        </div>

        {/* Posterior bar row */}
        <div className="grid grid-cols-3 gap-3">
          {(['ENGAGED','SCANNING','HESITANT'] as const).map((s, i) => {
            const colors = ['bg-cyan-500','bg-violet-500','bg-amber-500'];
            const pct = hmm.posteriors[i] ?? 0;
            return (
              <div key={s} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{s}</span>
                  <span className="text-xs font-mono text-slate-300 tabular-nums">{(pct*100).toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${colors[i]} rounded-full`}
                    animate={{ width: `${pct * 100}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
