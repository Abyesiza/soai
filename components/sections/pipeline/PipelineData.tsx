export function PipelineData() {
  const steps = [
    {
      n: '01',
      label: 'DOM Event Capture',
      spec: 'mousemove · scroll · click · mouseenter',
      out: 'clientX/Y, scrollY, timestamp',
      color: 'border-cyan-500/40 text-cyan-400',
    },
    {
      n: '02',
      label: 'SensorService',
      spec: 'velocity px/ms · dwell ms · hesitation count · click rate',
      out: 'SensorMetrics{}',
      color: 'border-blue-500/40 text-blue-400',
    },
    {
      n: '03',
      label: 'discretizeObservation()',
      spec: 'Maps to 6-symbol alphabet {FAST_MOVE, SLOW_MOVE, DWELL, SCROLL, IDLE, INTERACT}',
      out: 'ObsSymbolIndex ∈ [0, 5]',
      color: 'border-indigo-500/40 text-indigo-400',
    },
    {
      n: '04',
      label: 'Rolling Window',
      spec: 'Circular buffer keeps last 100 observations O₁…OT',
      out: 'number[]',
      color: 'border-violet-500/40 text-violet-400',
    },
    {
      n: '05',
      label: 'Baum–Welch EM',
      spec: 'Updates θ={A,B,π} every 20 obs  ·  Laplace smoothing ε=1e-8',
      out: 'HMMParams{A,B,pi}',
      color: 'border-purple-500/40 text-purple-400',
    },
    {
      n: '06',
      label: 'Viterbi + Posteriors',
      spec: 'Optimal state path via δₜ(i)  ·  Smoothed P(hₜ|O,θ) via γₜ(i)',
      out: '[P(ENG), P(SCN), P(HES)]',
      color: 'border-fuchsia-500/40 text-fuchsia-400',
    },
    {
      n: '07',
      label: 'Statistical Metrics',
      spec: 'H = −Σpᵢlog₂pᵢ  ·  λ₂ via deflated power iter  ·  PCHIP CDF',
      out: 'BehavioralMetrics{}',
      color: 'border-rose-500/40 text-rose-400',
    },
    {
      n: '08',
      label: 'Persona Collapse',
      spec: 'p = 1.0·P(ENG) + 0.0·P(SCN) + 0.5·P(HES)  →  analytical|storyteller|neutral',
      out: 'IntentState{}',
      color: 'border-amber-500/40 text-amber-400',
    },
  ];

  return (
    <section id="pipeline" className="py-24 bg-slate-950 terminal-scanline relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-glow-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-500">Processing Pipeline</span>
        </div>
        <h2 className="text-4xl font-black gradient-text-analytical mb-12">
          Event → Inference in 8 Steps
        </h2>

        <div className="space-y-3">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`flex items-start gap-6 p-5 rounded-xl border bg-slate-900/60 hover:bg-slate-900 transition-colors ${s.color.split(' ')[0]}`}
            >
              <span className={`text-2xl font-black font-mono shrink-0 ${s.color.split(' ')[1]}`}>{s.n}</span>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-sm mb-1 ${s.color.split(' ')[1]}`}>{s.label}</div>
                <div className="font-mono text-xs text-slate-400 mb-2">{s.spec}</div>
                <div className="font-mono text-[10px] text-slate-600">→ {s.out}</div>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block text-slate-700 font-mono text-lg self-center">↓</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
