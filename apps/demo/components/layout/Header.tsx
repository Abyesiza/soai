'use client';

import { useEffect, useState } from 'react';
import { PersonaBadge } from '@/components/ui/PersonaBadge';

export function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 px-6 py-3.5 flex items-center justify-between transition-all duration-300 ${
                scrolled
                    ? 'bg-[#060808]/90 backdrop-blur-xl border-b border-white/[0.06]'
                    : 'bg-transparent'
            }`}
        >
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d9c0] to-[#00d9c0]/40 flex items-center justify-center">
                    <span className="text-[#060808] font-[family-name:var(--font-display)] font-bold text-sm">S</span>
                </div>
                <span className="font-[family-name:var(--font-display)] font-bold text-lg text-[var(--color-soai-text)] tracking-tight">
                    SOAI
                </span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-[family-name:var(--font-body)] text-[var(--color-soai-muted)]">
                <a href="#demo" className="hover:text-[var(--color-soai-text)] transition-colors">Demo</a>
                <a href="#showcase" className="hover:text-[var(--color-soai-text)] transition-colors">Showcase</a>
                <a href="#how-it-works" className="hover:text-[var(--color-soai-text)] transition-colors">How It Works</a>
                <a href="#integrate" className="hover:text-[var(--color-soai-text)] transition-colors">Integrate</a>
            </nav>

            <div className="flex items-center gap-4">
                <PersonaBadge />
                <a
                    href="#integrate"
                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00d9c0] text-[#060808] text-sm font-[family-name:var(--font-body)] font-medium hover:bg-[#00d9c0]/90 transition-colors"
                >
                    Get Started
                </a>
            </div>
        </header>
    );
}
