export function HeroData() {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[500px] p-12 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl text-slate-100">
            <h1 className="text-4xl font-mono font-bold tracking-tight mb-4 text-blue-400">
                SOAI Analytics Engine
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl text-center mb-12 font-mono">
                High-frequency event tracking processing 60 frames per second.
                Zero UI latency. Vector DNA persistence.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
                <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 opacity-90 hover:opacity-100 transition">
                    <div className="text-sm text-slate-500 font-mono mb-2">LATENCY</div>
                    <div className="text-3xl font-bold text-emerald-400">{'<'} 50ms</div>
                </div>
                <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 opacity-90 hover:opacity-100 transition">
                    <div className="text-sm text-slate-500 font-mono mb-2">STATE OPS</div>
                    <div className="text-3xl font-bold text-blue-400">60/sec</div>
                </div>
                <div className="bg-slate-950 p-6 rounded-lg border border-slate-800 opacity-90 hover:opacity-100 transition">
                    <div className="text-sm text-slate-500 font-mono mb-2">PRECISION</div>
                    <div className="text-3xl font-bold text-purple-400">99.9%</div>
                </div>
            </div>
        </div>
    );
}
