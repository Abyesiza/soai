import { MousePointer2, Activity, GitMerge, Sparkles, Database, RefreshCw } from 'lucide-react';

const steps = [
  {
    icon: MousePointer2,
    title: 'Sense',
    body: 'Mouse, scroll, click and hover events are captured passively — zero friction.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: Activity,
    title: 'Discretise',
    body: '6-symbol observation alphabet maps raw physics to meaningful behavioral tokens.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: GitMerge,
    title: 'Infer',
    body: 'HMM Viterbi finds the optimal hidden cogntive state path. Baum-Welch refines parameters online.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: Sparkles,
    title: 'Characterise',
    body: 'Shannon entropy, λ₂, and PCHIP percentile quantify the structure of your interaction style.',
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
    border: 'border-fuchsia-500/20',
  },
  {
    icon: RefreshCw,
    title: 'Collapse',
    body: 'GMM soft membership resolves the superposition. The layout morphs to match your detected persona.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
  {
    icon: Database,
    title: 'Persist',
    body: 'Calibrated HMM parameters are saved to Supabase. Future visits begin from your personal prior.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
];

export function PipelineNeutral() {
  return (
    <section id="pipeline" className="py-24 bg-slate-950 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm mb-6">
            How it works
          </div>
          <h2 className="text-4xl font-black text-white mb-4">
            Six-step <span className="gradient-text-analytical">intelligence pipeline</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            From raw DOM events to personalised AI responses — fully client-side inference, zero data leaves your browser until the AI call.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className={`glass rounded-2xl p-6 border ${s.border} hover:bg-white/5 transition-all group`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center group-hover:scale-110 transition-transform shrink-0`}>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <div className={`text-xs font-mono font-bold ${s.color} uppercase tracking-widest`}>
                    {String(i + 1).padStart(2, '0')} / {s.title}
                  </div>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{s.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
