import { Zap, Infinity, Smartphone } from 'lucide-react';

const FEATURES = [
    {
        icon: Zap,
        title: 'Fluid Motion',
        description: 'The interface glides from one state to another, matching the pace of your thoughts effortlessly.',
    },
    {
        icon: Infinity,
        title: 'Endless Context',
        description: 'Returning tomorrow? The system remembers exactly how you prefer to work, picking up where you left off.',
    },
    {
        icon: Smartphone,
        title: 'Holistic Presence',
        description: 'Seamless integration across your entire digital environment, preserving your flow state everywhere.',
    },
];

export function FeaturesStory() {
    return (
        <section className="py-32 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <h2 className="text-4xl sm:text-5xl font-[family-name:var(--font-display)] font-extrabold text-[var(--color-soai-text)] mb-6 leading-tight">
                        Crafted for
                        <br />
                        <span className="bg-gradient-to-r from-[#f59324] to-[#f59324]/60 bg-clip-text text-transparent">
                            Intuition
                        </span>
                    </h2>
                    <p className="text-lg text-[var(--color-soai-muted)] leading-relaxed font-[family-name:var(--font-body)]">
                        Every interaction is a brushstroke. We designed SOAI to remove friction so you can focus entirely on your creative process.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {FEATURES.map((f) => {
                        const Icon = f.icon;
                        return (
                            <div key={f.title} className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#f59324] mb-6">
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-[family-name:var(--font-display)] font-bold text-[var(--color-soai-text)] mb-3">
                                    {f.title}
                                </h3>
                                <p className="text-sm text-[var(--color-soai-muted)] leading-relaxed font-[family-name:var(--font-body)]">
                                    {f.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
