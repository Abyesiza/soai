import { Server, Layout, Brain } from 'lucide-react';
import { InteractiveCard } from '@/components/agentic/InteractiveCard';

export function FeaturesNeutral() {
  return (
    <section id="features" className="py-24 bg-slate-950 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-sm mb-6">
            Hover a card to see it expand
          </div>
          <h2 className="text-4xl font-black text-white">
            Everything you need to build
            <span className="gradient-text-analytical"> intelligent UIs</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InteractiveCard
            id="layout-card"
            title="Adaptive Layouts"
            defaultDescription="Components restructure themselves based on user behavioral DNA — before you even consciously decide."
            expandedData={
              <div className="pt-4 mt-4 border-t border-slate-700 text-sm font-mono text-slate-400">
                <Layout className="w-5 h-5 mb-2 text-cyan-400" />
                Trigger: dwell &gt; 800ms<br />
                Engine: HMM HESITANT state<br />
                Switch: 0ms (pre-rendered)
              </div>
            }
          />
          <InteractiveCard
            id="ai-card"
            title="Agentic Reasoning"
            defaultDescription="Gemini 2.5 Flash receives your full HMM fingerprint — entropy, eigenvalue, posteriors — and replies in your language."
            expandedData={
              <div className="pt-4 mt-4 border-t border-slate-700 text-sm font-mono text-slate-400">
                <Brain className="w-5 h-5 mb-2 text-violet-400" />
                Model: Gemini-2.5-Flash<br />
                Input: H, λ₂, PCHIP, GMM<br />
                Output: personalised greeting
              </div>
            }
          />
          <InteractiveCard
            id="db-card"
            title="Vector Memory"
            defaultDescription="HMM parameters \u03b8\u202f=\u202f{A,\u202fB,\u202f\u03c0} serialised to Supabase so returning users resume with their calibrated model."
            expandedData={
              <div className="pt-4 mt-4 border-t border-slate-700 text-sm font-mono text-slate-400">
                <Server className="w-5 h-5 mb-2 text-emerald-400" />
                DB: Supabase (user_dna)<br />
                Fields: hmm_state, metrics<br />
                Format: JSON blob
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}
