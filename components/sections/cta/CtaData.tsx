export function CtaData() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 terminal-scanline pointer-events-none opacity-20" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 font-mono">
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-slate-800/60 border-b border-white/10">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-500 text-xs ml-3">soai — terminal</span>
          </div>
          <div className="p-8 text-sm leading-7">
            <div className="text-slate-500">
              {'# SOAI behavioral engine v2.4.1'}
            </div>
            <div className="text-slate-500">{'# HMM N=3, M=6 | GMM K=3 | PCHIP baseline'}</div>
            <div className="mt-4 text-emerald-400">$ soai init --persona=auto --hmm-states=3 --baum-welch=online</div>
            <div className="text-slate-400 mt-1 ml-4">✓ SensorService registered (mousemove, scroll, click)</div>
            <div className="text-slate-400 ml-4">✓ HMM parameters loaded from defaultHMMParams()</div>
            <div className="text-slate-400 ml-4">✓ GMM cold-start: uniform priors K=3</div>
            <div className="text-slate-400 ml-4">✓ PCHIP baseline: empty — will build from observations</div>
            <div className="text-cyan-400 mt-2 ml-4">→ Ready. Awaiting first window of 10 observations…</div>
            <div className="mt-4 text-emerald-400">$ soai deploy --target=production --env=.env.local</div>
            <div className="text-slate-400 mt-1 ml-4">✓ API route: /api/agent (POST, Edge runtime)</div>
            <div className="text-slate-400 ml-4">✓ Jotai store: intentAtom hydrated</div>
            <div className="text-cyan-400 ml-4">→ Deployment successful.</div>

            <div className="mt-8 flex gap-4">
              <a
                href="https://github.com"
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-sans font-semibold hover:bg-indigo-500 transition-colors"
              >
                Start deploying →
              </a>
              <a
                href="/about"
                className="px-5 py-2.5 bg-white/5 text-slate-300 border border-white/10 rounded-lg text-sm font-sans hover:bg-white/10 transition-colors"
              >
                Read the math
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
