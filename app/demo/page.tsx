'use client';

import { useBehavioralSensor } from '@/hooks/useBehavioralSensor';
import { useIntent } from '@/hooks/useIntent';
import { Header } from '@/components/layout/Header';
import { LiveMetricsPanel } from '@/components/agentic/LiveMetricsPanel';
import { motion } from 'framer-motion';
import { HMM_STATE_NAMES } from '@/lib/math/HMMEngine';

// ── Animated value display ─────────────────────────────────────────────────────
function Num({ value, decimals = 3, color = 'text-cyan-400' }: { value: number; decimals?: number; color?: string }) {
  return (
    <motion.span
      key={value.toFixed(decimals)}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`font-mono tabular-nums ${color}`}
    >
      {value.toFixed(decimals)}
    </motion.span>
  );
}

// ── Posterior bar ──────────────────────────────────────────────────────────────
function PosteriorBar({ name, value, color }: { name: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-mono text-slate-400">
        <span>{name}</span>
        <span>{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          animate={{ width: `${value * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        />
      </div>
    </div>
  );
}

// ── Matrix display ─────────────────────────────────────────────────────────────
function Matrix({ matrix, label }: { matrix: number[][]; label: string }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">{label}</div>
      <div className="font-mono text-xs space-y-1">
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-2">
            {row.map((v, j) => (
              <span key={j} className="w-12 text-right text-slate-300 tabular-nums">{v.toFixed(3)}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Panel wrapper ──────────────────────────────────────────────────────────────
function Panel({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-slate-900/60 border border-slate-800 rounded-2xl p-5 ${className}`}>
      <div className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-4">{title}</div>
      {children}
    </div>
  );
}

// ── Obs symbol badge ───────────────────────────────────────────────────────────
const OBS_NAMES = ['FAST_MOVE', 'SLOW_MOVE', 'DWELL', 'RAPID_SCROLL', 'IDLE', 'INTERACTION'];
const OBS_COLORS = [
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'bg-slate-700/50 text-slate-400 border-slate-600/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
];

export default function DemoPage() {
  useBehavioralSensor();
  const { intent } = useIntent();
  const { hmm, metrics, probability, mouseVelocity, scrollVelocity } = intent;

  const maxEntropy = Math.log2(3);

  const STATE_COLORS = [
    { bar: 'bg-cyan-500', text: 'text-cyan-400' },
    { bar: 'bg-violet-500', text: 'text-violet-400' },
    { bar: 'bg-amber-500', text: 'text-amber-400' },
  ];

  const PERSONA_NAMES = ['Analytical', 'Storyteller', 'Neutral'];
  const PERSONA_COLORS = ['bg-cyan-500', 'bg-violet-500', 'bg-amber-500'];

  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      <Header />
      <main className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        {/* Page heading */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Live System</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            SOAI Control Room
          </h1>
          <p className="text-slate-400 max-w-2xl">
            All HMM inference metrics updated in real-time as you interact with the page. Move your mouse, scroll, click — watch the engine respond.
          </p>
        </div>

        {/* Primary grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          {/* Current state */}
          <Panel title="Current HMM State" className="col-span-1">
            <div className="text-center py-4">
              <div className={`text-5xl font-black font-mono mb-2 ${STATE_COLORS[hmm.currentStateIndex]?.text ?? 'text-slate-300'}`}>
                {hmm.currentStateName}
              </div>
              <div className="text-slate-500 text-sm font-mono">Viterbi max-product path</div>
              <div className="mt-4 text-xs text-slate-600 font-mono">{hmm.observationCount} observations collected</div>
            </div>
          </Panel>

          {/* HMM Posteriors */}
          <Panel title="State Posteriors P(hₜ | O, θ)" className="col-span-1">
            <div className="space-y-4">
              {HMM_STATE_NAMES.map((name, i) => (
                <PosteriorBar
                  key={name}
                  name={name}
                  value={hmm.posteriors[i] ?? 0}
                  color={STATE_COLORS[i]?.bar ?? 'bg-slate-500'}
                />
              ))}
            </div>
          </Panel>

          {/* Persona membership */}
          <Panel title="GMM Persona Memberships" className="col-span-1">
            <div className="space-y-4">
              {PERSONA_NAMES.map((name, i) => (
                <PosteriorBar
                  key={name}
                  name={name}
                  value={metrics.personaMemberships[i] ?? 1 / 3}
                  color={PERSONA_COLORS[i]}
                />
              ))}
              <div className="pt-2 border-t border-slate-800 text-xs font-mono text-slate-500">
                Active persona: <span className="text-slate-200">{intent.persona}</span>
              </div>
            </div>
          </Panel>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          {[
            { label: 'Shannon H',       value: metrics.globalEntropy, decimals: 4, unit: ' bits', max: maxEntropy, color: 'text-cyan-400',    bar: 'bg-cyan-500'  },
            { label: 'λ₂ Eigenvalue',   value: metrics.eigen2,         decimals: 4, unit: '',      max: 1,          color: 'text-violet-400', bar: 'bg-violet-500'},
            { label: 'Velocity %ile',   value: metrics.velocityPercentile, decimals: 3, unit: '',  max: 1,          color: 'text-emerald-400',bar: 'bg-emerald-500'},
            { label: 'Intent P',        value: probability,            decimals: 4, unit: '',      max: 1,          color: 'text-amber-400',  bar: 'bg-amber-500' },
          ].map(({ label, value, decimals, unit, max, color, bar }) => (
            <Panel key={label} title={label}>
              <div className={`text-3xl font-black font-mono mb-2 ${color}`}>
                <Num value={value} decimals={decimals} color={color} />{unit}
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${bar} rounded-full`}
                  animate={{ width: `${Math.min((Math.abs(value) / max) * 100, 100)}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                />
              </div>
            </Panel>
          ))}
        </div>

        {/* Transition matrix + emission matrix + velocity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <Panel title="Transition Matrix A (Baum–Welch)">
            <Matrix matrix={hmm.transitionMatrix} label="A[from→to]" />
            <div className="mt-3 text-[10px] font-mono text-slate-600">
              A[i,j] = P(hₜ₊₁=j | hₜ=i, θ)
            </div>
          </Panel>

          <Panel title="Emission Matrix B">
            <Matrix
              matrix={hmm.emissionMatrix.slice(0, 3).map(row => row.slice(0, 6))}
              label="B[state×symbol]"
            />
            <div className="mt-3 text-[10px] font-mono text-slate-600">
              B[i,k] = P(oₜ=k | hₜ=i, θ)
            </div>
          </Panel>

          <Panel title="Velocity Sensors">
            <div className="space-y-5">
              <div>
                <div className="text-xs font-mono text-slate-400 mb-1">Mouse velocity</div>
                <div className="text-2xl font-black font-mono text-cyan-400">
                  <Num value={mouseVelocity} decimals={3} color="text-cyan-400" />
                  <span className="text-slate-500 text-sm"> px/ms</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-slate-400 mb-1">Scroll velocity</div>
                <div className="text-2xl font-black font-mono text-violet-400">
                  <Num value={scrollVelocity} decimals={3} color="text-violet-400" />
                  <span className="text-slate-500 text-sm"> px/ms</span>
                </div>
              </div>
              <div>
                <div className="text-xs font-mono text-slate-400 mb-1">Observations</div>
                <div className="text-2xl font-black font-mono text-amber-400">
                  {hmm.observationCount}
                </div>
              </div>
            </div>
          </Panel>
        </div>

        {/* Local entropies */}
        <Panel title="Per-State Local Transition Entropy Hᵢ = -Σⱼ Aᵢⱼ log₂(Aᵢⱼ)">
          <div className="grid grid-cols-3 gap-6">
            {HMM_STATE_NAMES.map((name, i) => {
              const h = metrics.localEntropies[i] ?? 0;
              return (
                <div key={name}>
                  <div className={`text-lg font-black font-mono ${STATE_COLORS[i]?.text}`}>
                    {h.toFixed(4)} <span className="text-slate-500 text-xs font-normal">bits</span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{name}</div>
                  <div className="mt-2 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${STATE_COLORS[i]?.bar} rounded-full`}
                      animate={{ width: `${(h / maxEntropy) * 100}%` }}
                      transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>

        {/* Hint */}
        <div className="mt-8 text-center font-mono text-xs text-slate-600">
          Move your mouse fast to push toward ENGAGED · Move slowly or hover to push toward SCANNING · Pause to push toward HESITANT
        </div>
      </main>

      <LiveMetricsPanel />
    </div>
  );
}
