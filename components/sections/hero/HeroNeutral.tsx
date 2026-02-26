export function HeroNeutral() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[500px] p-12 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-900">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 mb-6">
                Generation 2.0 Released
            </div>
            <h1 className="text-5xl font-sans font-extrabold tracking-tight mb-5 text-center">
                The Self-Optimizing Interface
            </h1>
            <p className="text-lg text-slate-500 max-w-xl text-center mb-8">
                Stop forcing users to learn your site. The SOAI engine reads digital body language and rewrites its own layout in real-time. Move quickly to see data, slow down to read the story.
            </p>
            <div className="flex gap-4">
                <button className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition">
                    Get Started
                </button>
                <button className="px-6 py-3 bg-white text-slate-900 border border-slate-300 rounded-lg font-medium hover:bg-slate-50 transition">
                    View Documentation
                </button>
            </div>
        </div>
    );
}
