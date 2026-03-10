export function CtaStory() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-violet-950" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Your interface is already watching.
        </div>

        <h2 className="text-5xl font-black text-white leading-tight mb-6">
          Give every user a product
          <br />
          <span className="gradient-text-story">built just for them.</span>
        </h2>

        <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          SOAI doesn&apos;t ask users who they are. It listens — to their rhythm, their hesitations,
          the way they move — and adapts in real time, invisibly, beautifully.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#"
            className="px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all shadow-lg shadow-indigo-900/40"
          >
            Start for free
          </a>
          <a
            href="/demo"
            className="px-8 py-4 rounded-xl font-semibold text-slate-300 border border-white/20 hover:bg-white/5 transition-colors"
          >
            See the live demo →
          </a>
        </div>

        <p className="text-slate-600 text-xs mt-8">
          No credit card required. Free plan includes full HMM inference.
        </p>
      </div>
    </section>
  );
}
