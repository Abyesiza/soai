export function PricingStory() {
  const paths = [
    {
      name: 'The Explorer',
      price: 'Free',
      desc: 'You move carefully, taking in every detail. This is the space for curious souls who want to feel the interface adapt before committing.',
      feeling: 'Perfect for: wanderers, dreamers, first-timers',
      color: 'from-violet-600/20 to-fuchsia-600/10',
      border: 'border-violet-500/30',
      cta: 'Begin exploring',
      ctaStyle: 'bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30',
    },
    {
      name: 'The Creator',
      price: '$29 / month',
      desc: 'You know what you want and you move fast to get there. The full power of the behavioral engine, AI resonance, and your evolving digital persona.',
      feeling: 'Perfect for: builders, designers, deep workers',
      color: 'from-indigo-600/30 to-violet-600/20',
      border: 'border-indigo-400/50',
      cta: 'Start creating',
      ctaStyle: 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-400 hover:to-violet-400',
      highlight: true,
    },
    {
      name: 'The Visionary',
      price: 'Let\'s talk',
      desc: 'You see beyond the interface. You want to weave this intelligence into products touched by millions. We should speak.',
      feeling: 'Perfect for: founders, product teams, enterprises',
      color: 'from-cyan-600/20 to-indigo-600/10',
      border: 'border-cyan-500/30',
      cta: 'Start a conversation',
      ctaStyle: 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600/30',
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-indigo-600/8 blur-[100px]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-white leading-tight mb-5">
            <span className="gradient-text-story">Choose your path.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Not a pricing table. A question about who you are today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paths.map(p => (
            <div
              key={p.name}
              className={`relative rounded-3xl border ${p.border} bg-gradient-to-b ${p.color} p-7 flex flex-col gap-5 ${p.highlight ? 'scale-[1.02]' : ''}`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest bg-indigo-500 text-white rounded-full px-3 py-1">
                  Most loved
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{p.name}</h3>
                <div className="text-indigo-300 font-semibold text-lg">{p.price}</div>
              </div>
              <p className="text-slate-300 leading-relaxed">{p.desc}</p>
              <p className="text-slate-500 text-xs italic">{p.feeling}</p>
              <button className={`mt-auto w-full py-3 rounded-xl text-sm font-semibold transition-all ${p.ctaStyle}`}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
