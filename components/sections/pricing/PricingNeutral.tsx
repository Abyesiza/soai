import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$0',
    desc: 'Explore the behavioral engine.',
    features: ['HMM inference', 'Basic entropy metrics', 'Client-side only'],
    cta: 'Get started free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    desc: 'Full-featured behavioral AI.',
    features: ['Baum–Welch EM updates', 'GMM persona clustering', 'AI personalization', 'Persistent memory', 'PCHIP baseline ranking'],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    desc: 'White-label for your platform.',
    features: ['Custom HMM topology', 'On-premise deployment', 'Dedicated support', 'SLA guarantee', 'Hybrid LSTM/HMM models'],
    cta: 'Contact sales',
    highlight: false,
  },
];

export function PricingNeutral() {
  return (
    <section id="pricing" className="py-24 bg-slate-950 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm mb-6">
            Simple, transparent pricing
          </div>
          <h2 className="text-4xl font-black text-white mb-3">
            Start free. <span className="gradient-text-analytical">Scale as you grow.</span>
          </h2>
          <p className="text-slate-400">No hidden fees. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map(p => (
            <div
              key={p.name}
              className={`rounded-2xl p-6 border flex flex-col gap-5 transition-all ${
                p.highlight
                  ? 'bg-indigo-950/50 border-indigo-500/60 ring-1 ring-indigo-500/30'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              {p.highlight && (
                <span className="text-[10px] font-mono uppercase tracking-widest bg-indigo-500 text-white rounded-full px-3 py-1 self-start">
                  Recommended
                </span>
              )}
              <div>
                <h3 className="font-bold text-white mb-1">{p.name}</h3>
                <div className="text-2xl font-black text-white">
                  {p.price}
                  {'period' in p && <span className="text-slate-400 text-sm font-normal">{p.period}</span>}
                </div>
                <p className="text-slate-400 text-sm mt-2">{p.desc}</p>
              </div>
              <ul className="space-y-2 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${p.highlight ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
