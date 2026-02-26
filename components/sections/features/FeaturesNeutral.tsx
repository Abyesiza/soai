import { Server, Layout, Brain } from 'lucide-react';
import { InteractiveCard } from '@/components/agentic/InteractiveCard';

export function FeaturesNeutral() {
    return (
        <section id="features" className="py-24 bg-white border-y border-slate-200 flex justify-center">
            <div className="max-w-6xl w-full px-6">
                <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-16">
                    Everything you need to build intelligent UIs
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <InteractiveCard
                        id="layout-card"
                        title="Adaptive Layouts"
                        defaultDescription="Components automatically restructure themselves based on user intent loops and behavioral reading speed."
                        expandedData={
                            <div className="pt-4 mt-4 border-t border-slate-200 text-sm font-mono text-slate-500">
                                <Layout className="w-5 h-5 mb-2 text-blue-500" />
                                Trigger: hover &gt; 2.5s <br />
                                Action: CSS Grid Auto-reflow <br />
                                Latency: 0ms (Pre-rendered)
                            </div>
                        }
                    />
                    <InteractiveCard
                        id="ai-card"
                        title="Agentic Reasoning"
                        defaultDescription="Powered by the Gemini 2.5 Flash model, seamlessly generating and streaming React interfaces into the DOM."
                        expandedData={
                            <div className="pt-4 mt-4 border-t border-slate-200 text-sm font-mono text-slate-500">
                                <Brain className="w-5 h-5 mb-2 text-emerald-500" />
                                LLM: Gemini-2.5-Flash <br />
                                Context window utilized for persona mapping.
                            </div>
                        }
                    />
                    <InteractiveCard
                        id="db-card"
                        title="Vector Memory"
                        defaultDescription="Long-term conversational and behavioral memory stored safely across multiple sessions utilizing Supabase."
                        expandedData={
                            <div className="pt-4 mt-4 border-t border-slate-200 text-sm font-mono text-slate-500">
                                <Server className="w-5 h-5 mb-2 text-purple-500" />
                                DB: Supabase pgvector <br />
                                Schema: user_dna (UUID, Probability Vector)
                            </div>
                        }
                    />
                </div>
            </div>
        </section>
    );
}
