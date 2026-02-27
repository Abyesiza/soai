export function CTAFooter() {
    return (
        <section className="relative py-32 px-6 overflow-hidden">
            {/* Teal radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,217,192,0.08)_0%,transparent_70%)]" />

            <div className="relative z-10 max-w-2xl mx-auto text-center">
                <h2 className="text-3xl sm:text-5xl font-[family-name:var(--font-display)] font-extrabold text-[var(--color-soai-text)] mb-6 leading-tight">
                    Start building interfaces
                    <br />
                    <span className="bg-gradient-to-r from-[#00d9c0] to-[#00d9c0]/60 bg-clip-text text-transparent">
                        that understand.
                    </span>
                </h2>

                <p className="text-[var(--color-soai-muted)] mb-10 font-[family-name:var(--font-body)] text-lg">
                    Open source. MIT licensed. Ready for production.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="#integrate"
                        className="px-10 py-4 rounded-xl bg-[#00d9c0] text-[#060808] font-[family-name:var(--font-body)] font-semibold text-sm hover:bg-[#00d9c0]/90 transition-all shadow-[0_0_40px_rgba(0,217,192,0.2)]"
                    >
                        Get Started
                    </a>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-10 py-4 rounded-xl border border-white/[0.12] text-[var(--color-soai-text)] font-[family-name:var(--font-body)] font-medium text-sm hover:bg-white/[0.04] transition-all"
                    >
                        View on GitHub
                    </a>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 mt-24 pt-8 border-t border-white/[0.06] max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00d9c0] to-[#00d9c0]/40 flex items-center justify-center">
                        <span className="text-[#060808] font-[family-name:var(--font-display)] font-bold text-[10px]">S</span>
                    </div>
                    <span className="text-sm font-[family-name:var(--font-display)] font-bold text-[var(--color-soai-text)]">
                        SOAI
                    </span>
                </div>
                <span className="text-xs text-[var(--color-soai-muted)] font-[family-name:var(--font-body)]">
                    Self-Optimizing Agentic Interface
                </span>
            </div>
        </section>
    );
}
