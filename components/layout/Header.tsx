export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between border-b border-slate-200/50 bg-white/50 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm">
                    S
                </div>
                SOAI
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                <a href="#features" className="hover:text-slate-900 transition">Features</a>
                <a href="#demo" className="hover:text-slate-900 transition">How it Works</a>
                <a href="#pricing" className="hover:text-slate-900 transition">Pricing</a>
            </nav>
            <div className="flex items-center gap-4">
                <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                    Sign In
                </button>
                <button className="text-sm font-medium px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition">
                    Get Started
                </button>
            </div>
        </header>
    );
}
