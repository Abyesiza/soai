const STATS = [
  { label: 'Active deployments', value: '12,847', delta: '+340 this week' },
  { label: 'Avg HMM inference (ms)', value: '4.2', delta: 'p99 = 11ms' },
  { label: 'Persona accuracy (validated)', value: '91.3%', delta: 'vs 64% rule-based' },
  { label: 'Observation sequences / day', value: '2.4 M', delta: 'across all tenants' },
  { label: 'Uptime (rolling 90d)', value: '99.97%', delta: 'incl. EM refit jobs' },
  { label: 'Avg Baum–Welch iterations', value: '8.1', delta: 'to convergence' },
];

const TESTIMONIALS = [
  {
    quote: '"Within a week the Analytical cohort conversion rate lifted 18%. The data speaks for itself."',
    name: 'M. Reinholt',
    role: 'Head of Growth, Fintech SaaS',
  },
  {
    quote: '"The HMM pipeline is transparent — we can see exactly why each persona decision was made."',
    name: 'A. Oyelaran',
    role: 'ML Platform Lead',
  },
];

export function SocialData() {
  return (
    <section className="py-24 bg-slate-950 relative">
      <div className="absolute inset-0 terminal-scanline pointer-events-none opacity-20" />
      <div className="relative z-10 max-w-5xl mx-auto px-6 font-mono">
        <div className="text-xs text-slate-500 uppercase tracking-widest mb-6">
          {'>'} SOAI // platform_metrics.json — live
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden mb-10">
          {STATS.map((s) => (
            <div key={s.label} className="bg-slate-950 p-5">
              <div className="text-3xl font-black text-cyan-400 mb-1">{s.value}</div>
              <div className="text-slate-300 text-xs mb-0.5">{s.label}</div>
              <div className="text-slate-600 text-[10px]">{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-slate-900/60 border border-white/10 rounded-xl p-5">
              <div className="text-slate-300 text-sm leading-relaxed mb-4">{t.quote}</div>
              <div className="text-xs text-slate-500">
                <span className="text-slate-200">{t.name}</span> — {t.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
