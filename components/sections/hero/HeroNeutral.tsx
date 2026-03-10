export function HeroNeutral() {
  return (
    <div className="relative w-full min-h-[600px] bg-slate-950 overflow-hidden flex items-center">
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:64px_64px]" />
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-indigo-600/8 blur-[100px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
          </span>
          Superposition active — move to collapse the state
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
          The Interface That
          <br />
          <span className="gradient-text-analytical">Learns You.</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          SOAI reads your digital body language in real-time — mouse velocity, scroll rhythm,
          hover dwell — and uses a Hidden Markov Model to infer your cognitive state,
          then morphs its own layout to match.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <button className="px-7 py-3.5 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-all shadow-lg shadow-white/10 text-sm">
            Get Started Free
          </button>
          <button className="px-7 py-3.5 rounded-xl border border-slate-700 text-slate-300 font-medium hover:border-slate-500 hover:text-white transition-all text-sm">
            View Documentation
          </button>
        </div>

        {/* Three floating persona preview cards */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto opacity-70">
          {[
            { label: 'Analytical', color: 'border-cyan-500/40 bg-cyan-500/5',   text: 'text-cyan-300',   desc: 'Data & metrics mode' },
            { label: 'Superposition', color: 'border-slate-600 bg-slate-800/50', text: 'text-slate-300', desc: '← You are here →' },
            { label: 'Storyteller', color: 'border-violet-500/40 bg-violet-500/5', text: 'text-violet-300', desc: 'Narrative & flow mode' },
          ].map(p => (
            <div key={p.label} className={`rounded-xl border ${p.color} p-3 text-center`}>
              <div className={`text-xs font-semibold ${p.text} mb-1`}>{p.label}</div>
              <div className="text-[10px] text-slate-500">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
