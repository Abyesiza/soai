'use client';

import { useSoai } from '@soai/react';

const PERSONAS = [
    {
        key: 'browser',
        label: 'Browser',
        color: '#00d9c0',
        description: 'Balanced, scannable layout with clear hierarchy',
        features: ['Medium-density metrics', 'Bar + line charts', 'Summary tables'],
    },
    {
        key: 'researcher',
        label: 'Researcher',
        color: '#6366f1',
        description: 'Dense, technical layout optimized for fast scanning',
        features: ['Compact monospace metrics', 'Line charts with axes', 'Full data tables'],
    },
    {
        key: 'buyer',
        label: 'Buyer',
        color: '#f59324',
        description: 'Impact-focused layout with big, bold numbers',
        features: ['3 hero metric cards', 'Single donut chart', 'Minimal / hidden tables'],
    },
];

export function AdaptiveShowcase() {
    const { persona } = useSoai();

    return (
        <section id="showcase" className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-[11px] font-[family-name:var(--font-code)] tracking-[0.15em] uppercase text-[#00d9c0] mb-4 block">
                        Adaptive UI States
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-display)] font-bold text-[var(--color-soai-text)] mb-4">
                        Three Personas. One Interface.
                    </h2>
                    <p className="text-[var(--color-soai-muted)] max-w-xl mx-auto font-[family-name:var(--font-body)]">
                        The same content, rendered three ways. Your active persona is highlighted in real-time.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PERSONAS.map((p) => {
                        const isActive = persona === p.key;
                        return (
                            <div
                                key={p.key}
                                className={`relative rounded-2xl border p-6 transition-all duration-500 ${
                                    isActive
                                        ? 'bg-white/[0.04] border-white/[0.12]'
                                        : 'bg-white/[0.02] border-white/[0.06] opacity-50'
                                }`}
                                style={
                                    isActive
                                        ? {
                                              boxShadow: `0 0 0 1px ${p.color}40, 0 0 30px ${p.color}15`,
                                          }
                                        : undefined
                                }
                            >
                                {/* Live badge */}
                                {isActive && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <div
                                            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-[family-name:var(--font-code)] font-medium tracking-wider uppercase"
                                            style={{
                                                backgroundColor: `${p.color}20`,
                                                color: p.color,
                                                border: `1px solid ${p.color}40`,
                                            }}
                                        >
                                            <span
                                                className="w-1.5 h-1.5 rounded-full animate-pulse"
                                                style={{ backgroundColor: p.color }}
                                            />
                                            LIVE
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 mb-4 mt-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: p.color }}
                                    />
                                    <h3 className="text-lg font-[family-name:var(--font-display)] font-bold text-[var(--color-soai-text)]">
                                        {p.label}
                                    </h3>
                                </div>

                                <p className="text-sm text-[var(--color-soai-muted)] mb-6 font-[family-name:var(--font-body)]">
                                    {p.description}
                                </p>

                                <ul className="space-y-2">
                                    {p.features.map((f, i) => (
                                        <li
                                            key={i}
                                            className="flex items-center gap-2 text-xs font-[family-name:var(--font-code)] text-[var(--color-soai-muted)]"
                                        >
                                            <span
                                                className="w-1 h-1 rounded-full shrink-0"
                                                style={{ backgroundColor: p.color }}
                                            />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
