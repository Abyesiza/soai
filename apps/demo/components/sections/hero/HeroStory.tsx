export function HeroStory() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-[85vh] px-6 py-24 overflow-hidden">
            {/* Warm ambient glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_40%,rgba(245,147,36,0.06)_0%,transparent_70%)]" />

            <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto text-center">
                <h1 className="text-5xl sm:text-7xl font-[family-name:var(--font-display)] font-extrabold tracking-tight mb-8 leading-[1.08]">
                    <span className="text-[var(--color-soai-text)]">Stop building for </span>
                    <span className="bg-gradient-to-r from-[#f59324] to-[#f59324]/60 bg-clip-text text-transparent">everyone.</span>
                    <br />
                    <span className="text-[var(--color-soai-text)]">Start building for </span>
                    <span className="bg-gradient-to-r from-[#00d9c0] to-[#00d9c0]/60 bg-clip-text text-transparent">each one.</span>
                </h1>

                <p className="text-lg sm:text-xl text-[var(--color-soai-muted)] max-w-xl leading-relaxed mb-10 font-[family-name:var(--font-body)]">
                    Your interface should feel like it was designed for every single user — because with SOAI, it is.
                </p>

                <a
                    href="#demo"
                    className="group inline-flex items-center gap-3 px-10 py-4 rounded-xl bg-[#00d9c0] text-[#060808] font-[family-name:var(--font-body)] font-semibold text-base hover:bg-[#00d9c0]/90 transition-all shadow-[0_0_40px_rgba(0,217,192,0.25)]"
                >
                    Experience It Now
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </a>

                <p className="mt-8 text-sm text-[var(--color-soai-muted)] font-[family-name:var(--font-body)]">
                    Trusted by <span className="text-[var(--color-soai-text)] font-medium">400+ teams</span> building adaptive experiences
                </p>
            </div>

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060808] to-transparent" />
        </div>
    );
}
