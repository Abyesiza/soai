import { Waves, GitBranch, Sparkles, Database, Cpu, User } from 'lucide-react';

const journey = [
  {
    icon: Waves,
    title: 'You arrive',
    body: 'The moment the page loads, the system begins to breathe with you \u2014 every mouse movement a heartbeat.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Cpu,
    title: 'Your rhythm is felt',
    body: 'Hidden Markov states awaken. Are you engaged, scanning, or hesitating? The model listens without a word spoken.',
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
  },
  {
    icon: Sparkles,
    title: 'The interface shifts',
    body: 'Probabilities collapse. Where a data table lived, now prose blooms. Where poetry waited, numbers crystallise.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
  {
    icon: User,
    title: 'Your persona is born',
    body: 'Gaussian Mixture Models carve a space only you occupy \u2014 analytical, storyteller, or beautifully somewhere in between.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: GitBranch,
    title: 'AI speaks your language',
    body: 'Gemini 2.5 Flash receives your full behavioral fingerprint and responds in precisely the tone your current state needs.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
  {
    icon: Database,
    title: 'Memory persists',
    body: 'The calibrated HMM parameters travel with you. Return tomorrow and find the interface already knowing who you are today.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
];

export function PipelineStory() {
  return (
    <section id="pipeline" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-violet-600/6 blur-[150px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-8">
            The journey from movement to meaning
          </div>
          <h2 className="text-5xl font-black text-white leading-tight mb-5">
            <span className="gradient-text-story">How the magic flows.</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            Six moments. One continuous loop of understanding.
          </p>
        </div>

        {/* Vertical timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-indigo-500/30 to-transparent" />
          <div className="space-y-8">
            {journey.map(({ icon: Icon, title, body, color, bg }) => (
              <div key={title} className="relative pl-16 group">
                {/* Node */}
                <div className={`absolute left-0 w-12 h-12 rounded-xl ${bg} flex items-center justify-center ring-1 ring-black group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="glass rounded-2xl p-6 hover:border-white/15 transition-all">
                  <h3 className={`font-bold text-lg mb-2 ${color}`}>{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
