const stats = [
  { n: '12K+', label: 'Developers deployed' },
  { n: '4.2ms', label: 'Median inference' },
  { n: '91%', label: 'Persona accuracy' },
  { n: '99.9%', label: 'Uptime SLA' },
];

const testimonials = [
  {
    quote: 'SOAI makes personalization feel effortless. The HMM engine is a genuinely fresh approach.',
    name: 'Elena Vasquez',
    role: 'Senior ML Engineer',
    initials: 'EV',
  },
  {
    quote: 'Dropped our A/B test cycle from weeks to days. The behavioral signal is remarkably precise.',
    name: 'James Okafor',
    role: 'Head of Product',
    initials: 'JO',
  },
];

export function SocialNeutral() {
  return (
    <section className="py-24 bg-slate-950 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-3">
            Trusted by <span className="gradient-text-analytical">forward-thinking teams</span>
          </h2>
          <p className="text-slate-400 text-sm">From solo developers to enterprise platforms.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-xl p-5 text-center">
              <div className="text-3xl font-black gradient-text-analytical">{s.n}</div>
              <div className="text-slate-400 text-xs mt-2">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-6 flex gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-sm">
                {t.initials}
              </div>
              <div>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                <div className="text-xs text-slate-500">
                  <span className="text-slate-200">{t.name}</span> — {t.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
