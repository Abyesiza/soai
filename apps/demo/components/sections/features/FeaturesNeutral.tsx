import { Layout, Brain, Server } from 'lucide-react';

const FEATURES = [
    {
        icon: Layout,
        title: 'Adaptive Layouts',
        description: 'Components automatically restructure themselves based on user intent and behavioral reading speed.',
        stat: '0ms switch',
        color: '#00d9c0',
    },
    {
        icon: Brain,
        title: 'Agentic Reasoning',
        description: 'Powered by Gemini, seamlessly generating and streaming personalized interfaces into the DOM.',
        stat: 'Real-time',
        color: '#6366f1',
    },
    {
        icon: Server,
        title: 'Vector Memory',
        description: 'Long-term behavioral memory stored across sessions. Your interface remembers each user.',
        stat: '1536 dims',
        color: '#f59324',
    },
];

export function FeaturesNeutral() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-display)] font-bold text-[var(--color-soai-text)] mb-4">
                        Everything You Need
                    </h2>
                    <p className="text-[var(--color-soai-muted)] max-w-lg mx-auto font-[family-name:var(--font-body)]">
                        A complete toolkit for building interfaces that understand their users.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {FEATURES.map((f) => {
                        const Icon = f.icon;
                        return (
                            <div
                                key={f.title}
                                className="group bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:border-white/[0.15] transition-all duration-300"
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 border"
                                    style={{
                                        backgroundColor: `${f.color}10`,
                                        borderColor: `${f.color}20`,
                                    }}
                                >
                                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                                </div>
                                <h3 className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-soai-text)] mb-2">
                                    {f.title}
                                </h3>
                                <p className="text-sm text-[var(--color-soai-muted)] mb-4 font-[family-name:var(--font-body)] leading-relaxed">
                                    {f.description}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: f.color }} />
                                    <span className="text-[10px] font-[family-name:var(--font-code)] tracking-wider uppercase" style={{ color: f.color }}>
                                        {f.stat}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
