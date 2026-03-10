'use client';

import { useIntent } from '@/hooks/useIntent';
import Link from 'next/link';
import type { PersonaType } from '@/types';

const PERSONA_CONFIG: Record<PersonaType, { label: string; dot: string; text: string }> = {
  analytical:  { label: 'Analytical',  dot: 'bg-cyan-400',    text: 'text-cyan-400' },
  storyteller: { label: 'Storyteller', dot: 'bg-violet-400',  text: 'text-violet-400' },
  commander:   { label: 'Commander',   dot: 'bg-red-400',     text: 'text-red-400' },
  researcher:  { label: 'Researcher',  dot: 'bg-emerald-400', text: 'text-emerald-400' },
  explorer:    { label: 'Explorer',    dot: 'bg-amber-400',   text: 'text-amber-400' },
  skeptic:     { label: 'Skeptic',     dot: 'bg-orange-400',  text: 'text-orange-400' },
  neutral:     { label: 'Detecting…',  dot: 'bg-slate-400',   text: 'text-slate-400' },
};

export function Header() {
  const { intent } = useIntent();
  const cfg = PERSONA_CONFIG[intent.persona];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-3.5 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <span className="text-white text-xs font-black">S</span>
        </div>
        <span className="text-lg font-black tracking-tight text-white">
          <span className="gradient-text-analytical">SOAI</span>
        </span>
      </Link>

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
        <a href="#features"           className="hover:text-white transition-colors">Features</a>
        <a href="#pipeline"           className="hover:text-white transition-colors">Pipeline</a>
        <a href="#pricing"            className="hover:text-white transition-colors">Pricing</a>
        <Link href="/demo"            className="hover:text-white transition-colors">Demo</Link>
        <Link href="/superposition"   className="hover:text-white transition-colors font-semibold text-indigo-400 hover:text-indigo-300">Superposition</Link>
        <Link href="/analytics"       className="hover:text-white transition-colors font-semibold text-cyan-400 hover:text-cyan-300">Analytics</Link>
      </nav>

      {/* Right — persona indicator + CTA */}
      <div className="flex items-center gap-4">
        {/* Live persona badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
          <span className={`w-2 h-2 rounded-full animate-glow-pulse ${cfg.dot}`} />
          <span className={`text-xs font-mono ${cfg.text}`}>{cfg.label}</span>
        </div>

        <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
          Sign In
        </button>
        <button className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20 transition-all">
          Get Started
        </button>
      </div>
    </header>
  );
}
