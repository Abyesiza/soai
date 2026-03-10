import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Observer',
    price: '$0',
    period: '/mo',
    desc: 'Perfect for exploring the behavioral engine.',
    features: [
      'HMM Inference (N=3 states)',
      'Shannon entropy metrics',
      'Client-side Viterbi decoding',
      '100-observation rolling window',
      'Community support',
    ],
    cta: 'Start Free',
    color: 'border-slate-700',
    ctaClass: 'bg-slate-800 text-slate-200 hover:bg-slate-700',
  },
  {
    name: 'Analyst',
    price: '$29',
    period: '/mo',
    desc: 'Full behavioral DNA with AI-powered persona responses.',
    features: [
      'Everything in Observer',
      'Baum–Welch online EM updates',
      'GMM soft persona membership',
      'PCHIP personalised baseline',
      'Gemini 2.5 Flash AI context',
      'Supabase session persistence',
    ],
    cta: 'Start Analyst',
    color: 'border-indigo-500/60',
    ctaClass: 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'White-label HMM engine for large-scale applications.',
    features: [
      'Everything in Analyst',
      'Custom N-state HMM topology',
      'LSTM/HMM hybrid models',
      'Gap Statistic K optimisation',
      'On-premise deployment',
      'SLA + dedicated support',
    ],
    cta: 'Contact Sales',
    color: 'border-slate-700',
    ctaClass: 'bg-slate-800 text-slate-200 hover:bg-slate-700',
  },
];

export function PricingData() {
  return (
    <section id="pricing" className="py-24 bg-slate-950 terminal-scanline relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-2 bg-violet-400 rounded-full animate-glow-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-500">Pricing / Access Tiers</span>
        </div>
        <h2 className="text-4xl font-black gradient-text-analytical mb-12">Select your access tier.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map(p => (
            <div key={p.name} className={`rounded-2xl border ${p.color} ${p.highlight ? 'bg-indigo-950/40' : 'bg-slate-900/60'} p-6 flex flex-col gap-4`}>
              {p.highlight && (
                <div className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 bg-indigo-500/20 rounded-full px-3 py-1 self-start">
                  Most Popular
                </div>
              )}
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-1">{p.name}</div>
                <div className="text-3xl font-black text-white">{p.price}<span className="text-slate-500 text-base font-normal">{p.period}</span></div>
                <p className="text-slate-400 text-sm mt-2">{p.desc}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${p.ctaClass}`}>{p.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
