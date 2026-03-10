'use client';

import { useIntent } from '@/hooks/useIntent';
import Link from 'next/link';
import { useState } from 'react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3.5 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" onClick={handleNavClick}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white text-xs font-black">S</span>
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            <span className="gradient-text-analytical">SOAI</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          <a href="#features"           className="hover:text-white transition-colors">Features</a>
          <a href="#pipeline"           className="hover:text-white transition-colors">Pipeline</a>
          <a href="#pricing"            className="hover:text-white transition-colors">Pricing</a>
          <Link href="/demo"            className="hover:text-white transition-colors">Demo</Link>
          <Link href="/superposition"   className="hover:text-white transition-colors font-semibold text-indigo-400 hover:text-indigo-300">Superposition</Link>
          <Link href="/analytics"       className="hover:text-white transition-colors font-semibold text-cyan-400 hover:text-cyan-300">Analytics</Link>
        </nav>

        {/* Right — persona indicator + CTA */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Live persona badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className={`w-2 h-2 rounded-full animate-glow-pulse ${cfg.dot}`} />
            <span className={`text-xs font-mono ${cfg.text}`}>{cfg.label}</span>
          </div>

          {/* Desktop buttons */}
          <div className="hidden sm:flex items-center gap-2 md:gap-3">
            <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Sign In
            </button>
            <button className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20 transition-all">
              Get Started
            </button>
          </div>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-6 h-6 gap-1.5"
          >
            <span
              className={`w-6 h-0.5 bg-slate-400 transition-all duration-300 ${
                mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-slate-400 transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-slate-400 transition-all duration-300 ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            ></span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Drawer */}
          <div className="fixed top-16 left-0 right-0 z-40 md:hidden bg-slate-900/95 border-b border-slate-800 shadow-lg animate-in slide-in-from-top-2">
            <nav className="flex flex-col divide-y divide-slate-800">
              <a
                href="#features"
                onClick={handleNavClick}
                className="px-6 py-4 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
              >
                Features
              </a>
              <a
                href="#pipeline"
                onClick={handleNavClick}
                className="px-6 py-4 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
              >
                Pipeline
              </a>
              <a
                href="#pricing"
                onClick={handleNavClick}
                className="px-6 py-4 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
              >
                Pricing
              </a>
              <Link
                href="/demo"
                onClick={handleNavClick}
                className="px-6 py-4 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
              >
                Demo
              </Link>
              <Link
                href="/superposition"
                onClick={handleNavClick}
                className="px-6 py-4 text-sm font-medium font-semibold text-indigo-400 hover:text-indigo-300 hover:bg-slate-800/50 transition-colors"
              >
                Superposition
              </Link>
              <Link
                href="/analytics"
                onClick={handleNavClick}
                className="px-6 py-4 text-sm font-medium font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/50 transition-colors"
              >
                Analytics
              </Link>

              {/* Mobile action buttons */}
              <div className="px-6 py-4 flex flex-col gap-3">
                <button className="w-full text-sm font-medium text-slate-400 hover:text-white transition-colors py-2 px-4 rounded-lg hover:bg-slate-800/50">
                  Sign In
                </button>
                <button className="w-full text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/20 transition-all">
                  Get Started
                </button>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
