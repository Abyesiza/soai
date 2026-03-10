import { DynamicButton } from '@/components/agentic/DynamicButton';

export function HeroStory() {
  return (
    <div className="relative w-full min-h-[600px] bg-slate-950 overflow-hidden flex items-center">
      {/* Ambient blobs */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 blur-[120px] animate-float-slow" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-indigo-600/20 to-cyan-600/10 blur-[100px] animate-float" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-violet-500/30 text-violet-300 text-sm font-medium mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Interface adapts to your natural rhythm
        </div>

        {/* Headline */}
        <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tight mb-8">
          <span className="text-white">A Design</span>
          <br />
          <span className="gradient-text-story">That Feels You.</span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
          Every scroll. Every hover. Every pause.
          The interface reads the poetry of your interaction and rewrites itself —
          always one thought ahead.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <DynamicButton storyText="Begin the Experience" dataText="Initialize Engine" />
          <button className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:border-white/30 hover:text-white transition-all text-sm font-medium">
            Watch how it works
          </button>
        </div>

        {/* Floating stat pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-14 text-xs font-mono">
          {[['HMM Inference','real-time'],['Baum–Welch EM','adaptive'],['PCHIP CDF','personalised']].map(([k,v]) => (
            <div key={k} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
              <span className="text-violet-300">{k}</span> · {v}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
