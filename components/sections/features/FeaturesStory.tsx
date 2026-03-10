import { Zap, Infinity, Smartphone, Eye, Heart, Sparkles } from 'lucide-react';

const cards = [
  {
    icon: Zap,
    title: 'Fluid Motion',
    body: 'The interface glides between states as naturally as breathing. No jarring transitions — only seamless metamorphosis.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Eye,
    title: 'Invisible Intelligence',
    body: 'The system watches without watching. Your rhythm is its language, and it speaks back through the shape of every element onscreen.',
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
  },
  {
    icon: Infinity,
    title: 'Endless Memory',
    body: 'Return tomorrow and find the interface right where you left it — not just the page, but the entire felt sense of your session.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
  {
    icon: Heart,
    title: 'Emotional Resonance',
    body: 'Built on the science of digital phenotyping and personality mapping, the system meets you where you are, not where you were.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
  {
    icon: Sparkles,
    title: 'Living Persona',
    body: 'Your behavioral DNA is never static. As you grow, the system evolves with you — capturing every subtle shift in cognitive style.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Smartphone,
    title: 'Universal Presence',
    body: 'One coherent intelligence across every surface you touch — preserving the fragile state of deep focus wherever you go.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
];

export function FeaturesStory() {
  return (
    <section id="features" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-8">
            Crafted for deep creative work
          </div>
          <h2 className="text-5xl font-black text-white mb-6 leading-tight">
            <span className="gradient-text-story">Designed for intuition.</span>
            <br />
            <span className="text-slate-300">Powered by science.</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Every feature exists to dissolve the boundary between you and the work.
            The interface recedes — only the flow remains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(({ icon: Icon, title, body, color, bg }) => (
            <div key={title} className="glass rounded-2xl p-6 hover:border-white/15 transition-all group">
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
