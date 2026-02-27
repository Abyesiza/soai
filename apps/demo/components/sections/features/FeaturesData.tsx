export function FeaturesData() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-[family-name:var(--font-display)] font-bold text-[var(--color-soai-text)] mb-2">
                    Core Specifications
                </h2>
                <p className="text-xs font-[family-name:var(--font-code)] text-[var(--color-soai-muted)] mb-8 tracking-wider">
                    SYSTEM CAPABILITIES OVERVIEW
                </p>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/[0.06]">
                                    <th className="px-5 py-3 text-[10px] font-[family-name:var(--font-code)] tracking-[0.12em] uppercase text-[var(--color-soai-muted)] font-medium">
                                        Feature
                                    </th>
                                    <th className="px-5 py-3 text-[10px] font-[family-name:var(--font-code)] tracking-[0.12em] uppercase text-[var(--color-soai-muted)] font-medium">
                                        Specification
                                    </th>
                                    <th className="px-5 py-3 text-[10px] font-[family-name:var(--font-code)] tracking-[0.12em] uppercase text-[var(--color-soai-muted)] font-medium">
                                        Metric
                                    </th>
                                    <th className="px-5 py-3 text-[10px] font-[family-name:var(--font-code)] tracking-[0.12em] uppercase text-[var(--color-soai-muted)] font-medium">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-[family-name:var(--font-code)]">
                                {[
                                    ['Vector Memory', 'pgvector multi-session persistence', '1536 dims', 'Active'],
                                    ['EWMA Smoothing', 'Exponential weighted moving average', 'α=0.85', 'Active'],
                                    ['Persona Hysteresis', 'Centroid + minimum stable duration', '1500ms', 'Active'],
                                    ['Shadow Preloading', 'Pre-render adjacent states at p>0.65', '0ms switch', 'Active'],
                                    ['Agentic Inference', 'Gemini 2.5 Flash context streaming', 'Real-time', 'Active'],
                                    ['Plugin Architecture', 'Microkernel event bus + middleware', '16 packages', 'Active'],
                                ].map(([feature, spec, metric, status]) => (
                                    <tr key={feature} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-3 text-[#00d9c0] font-medium">{feature}</td>
                                        <td className="px-5 py-3 text-[var(--color-soai-text)]">{spec}</td>
                                        <td className="px-5 py-3 text-[var(--color-soai-muted)]">{metric}</td>
                                        <td className="px-5 py-3">
                                            <span className="inline-flex items-center gap-1.5 text-xs">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                <span className="text-emerald-400">{status}</span>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
