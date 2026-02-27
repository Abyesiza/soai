export function HeroData() {
    return (
        <div className="relative flex flex-col min-h-[85vh] px-6 py-24 overflow-hidden">
            {/* Scan line effect */}
            <div className="absolute inset-0 soai-scan-line opacity-30" />

            <div className="relative z-10 max-w-6xl mx-auto w-full pt-12">
                <div className="flex items-center gap-3 mb-8">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-[family-name:var(--font-code)] tracking-[0.15em] uppercase text-[var(--color-soai-muted)]">
                        SOAI Runtime v2.0 — Active
                    </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-[family-name:var(--font-display)] font-bold text-[var(--color-soai-text)] mb-8 tracking-tight">
                    System Overview
                </h1>

                {/* Metric cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-5">
                        <div className="text-[10px] font-[family-name:var(--font-code)] tracking-[0.12em] uppercase text-[var(--color-soai-muted)] mb-2">
                            SIGNAL LATENCY
                        </div>
                        <div className="text-3xl font-[family-name:var(--font-code)] font-medium text-[#00d9c0]">
                            {'<'} 50ms
                        </div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-5">
                        <div className="text-[10px] font-[family-name:var(--font-code)] tracking-[0.12em] uppercase text-[var(--color-soai-muted)] mb-2">
                            ACTIVE SENSORS
                        </div>
                        <div className="text-3xl font-[family-name:var(--font-code)] font-medium text-[#6366f1]">
                            8
                        </div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-5">
                        <div className="text-[10px] font-[family-name:var(--font-code)] tracking-[0.12em] uppercase text-[var(--color-soai-muted)] mb-2">
                            PERSONA STATES
                        </div>
                        <div className="text-3xl font-[family-name:var(--font-code)] font-medium text-[#f59324]">
                            3
                        </div>
                    </div>
                </div>

                {/* Code preview */}
                <div className="bg-[#0d1117] border border-white/[0.06] rounded-xl overflow-hidden max-w-2xl">
                    <div className="px-4 py-2 border-b border-white/[0.06] flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500/40" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500/40" />
                        <span className="w-3 h-3 rounded-full bg-green-500/40" />
                        <span className="text-[10px] font-[family-name:var(--font-code)] text-[var(--color-soai-muted)] ml-2">
                            useSoai.ts
                        </span>
                    </div>
                    <pre className="p-4 text-[13px] font-[family-name:var(--font-code)] leading-relaxed overflow-x-auto">
                        <code>
                            <span className="text-[#6366f1]">const</span>
                            <span className="text-[var(--color-soai-text)]">{' { '}</span>
                            <span className="text-[#00d9c0]">persona</span>
                            <span className="text-[var(--color-soai-text)]">, </span>
                            <span className="text-[#00d9c0]">confidence</span>
                            <span className="text-[var(--color-soai-text)]">, </span>
                            <span className="text-[#00d9c0]">vector</span>
                            <span className="text-[var(--color-soai-text)]">{' } = '}</span>
                            <span className="text-[#f59324]">useSoai</span>
                            <span className="text-[var(--color-soai-text)]">();</span>
                            {'\n'}
                            <span className="text-[var(--color-soai-muted)]">{'// → { persona: "researcher", confidence: 0.87, vector: {...} }'}</span>
                        </code>
                    </pre>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060808] to-transparent" />
        </div>
    );
}
