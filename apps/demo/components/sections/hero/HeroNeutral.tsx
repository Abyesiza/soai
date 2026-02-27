export function HeroNeutral() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-[85vh] px-6 py-24 overflow-hidden">
            {/* Dot grid background */}
            <div className="absolute inset-0 soai-particle-bg opacity-40" />

            {/* Radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(0,217,192,0.08)_0%,transparent_70%)]" />

            <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00d9c0]/20 bg-[#00d9c0]/[0.05] mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d9c0] animate-pulse" />
                    <span className="text-[11px] font-[family-name:var(--font-code)] tracking-wider uppercase text-[#00d9c0]">
                        Live Behavioral Intelligence
                    </span>
                </div>

                <h1 className="text-5xl sm:text-7xl font-[family-name:var(--font-display)] font-extrabold tracking-tight mb-6 leading-[1.05]">
                    <span className="text-[var(--color-soai-text)]">The Interface </span>
                    <br />
                    <span className="bg-gradient-to-r from-[#00d9c0] to-[#00d9c0]/60 bg-clip-text text-transparent">
                        That Reads You
                    </span>
                </h1>

                <p className="text-lg sm:text-xl text-[var(--color-soai-muted)] max-w-2xl leading-relaxed mb-10 font-[family-name:var(--font-body)]">
                    8 behavioral sensors. One intent vector.
                    <br className="hidden sm:inline" />
                    UI that adapts before you click.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                        href="#demo"
                        className="px-8 py-3.5 rounded-xl bg-[#00d9c0] text-[#060808] font-[family-name:var(--font-body)] font-semibold text-sm hover:bg-[#00d9c0]/90 transition-all shadow-[0_0_30px_rgba(0,217,192,0.2)]"
                    >
                        See It Live
                    </a>
                    <a
                        href="#how-it-works"
                        className="px-8 py-3.5 rounded-xl border border-white/[0.12] text-[var(--color-soai-text)] font-[family-name:var(--font-body)] font-medium text-sm hover:bg-white/[0.04] transition-all"
                    >
                        How It Works
                    </a>
                </div>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060808] to-transparent" />
        </div>
    );
}
