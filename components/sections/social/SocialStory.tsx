const quotes = [
  {
    text: 'I opened the dashboard and it already knew I was someone who needs the numbers first. That rarely happens.',
    name: 'Elena V.',
    role: 'Data Engineer',
    initials: 'EV',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    text: 'The onboarding felt like the product had been built just for me. Not a slider out of place.',
    name: 'James O.',
    role: 'Product Designer',
    initials: 'JO',
    color: 'from-violet-500 to-fuchsia-600',
  },
  {
    text: "My team spent three months A/B testing copy. SOAI's persona switching landed better results in two days.",
    name: 'Sara K.',
    role: 'Head of Growth',
    initials: 'SK',
    color: 'from-pink-500 to-rose-600',
  },
];

export function SocialStory() {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-white mb-3">
            Loved by builders who care about{' '}
            <span className="gradient-text-story">how humans actually think.</span>
          </h2>
          <p className="text-slate-400">Real experiences from teams using SOAI in production.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {quotes.map((q) => (
            <div key={q.name} className="glass rounded-2xl p-6 flex flex-col gap-5">
              <p className="text-slate-300 text-sm leading-relaxed flex-1">&ldquo;{q.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${q.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {q.initials}
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{q.name}</div>
                  <div className="text-slate-500 text-xs">{q.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6 mt-14 text-center">
          {[
            { n: '12K+', label: 'developers' },
            { n: '99.9%', label: 'uptime' },
            { n: '4.2ms', label: 'inference p50' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-black gradient-text-analytical">{s.n}</div>
              <div className="text-slate-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
