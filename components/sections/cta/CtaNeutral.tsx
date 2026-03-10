export function CtaNeutral() {
  return (
    <section className="py-24 bg-slate-950 relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-black text-white mb-4">
          Ready to build a{' '}
          <span className="gradient-text-analytical">smarter interface?</span>
        </h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Integrate SOAI&apos;s behavioral engine in minutes. The HMM runs entirely client-side —
          no data leaves the browser until you choose to persist it.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#"
            className="px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all"
          >
            Get started free
          </a>
          <a
            href="/demo"
            className="px-8 py-3.5 rounded-xl font-semibold text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white transition-all"
          >
            View live demo
          </a>
        </div>
      </div>
    </section>
  );
}
