'use client';

import { useEffect, useRef, useState } from 'react';
import { Radio, Brain, User, Bot, Monitor } from 'lucide-react';

const STEPS = [
    {
        icon: Radio,
        title: 'Sensors',
        description: 'Mouse velocity, scroll depth, click patterns, hover dwell, touch pressure, idle detection, viewport focus, and visibility state.',
        color: '#00d9c0',
    },
    {
        icon: Brain,
        title: 'Intent Engine',
        description: 'Raw signals feed into weighted extractors producing a 3-dimensional intent vector, smoothed via EWMA for noise-free classification.',
        color: '#6366f1',
    },
    {
        icon: User,
        title: 'Persona Resolver',
        description: 'Centroid distance + hysteresis (1.5s stability) maps the intent vector to browser, researcher, or buyer — with custom resolvers supported.',
        color: '#f59324',
    },
    {
        icon: Bot,
        title: 'Collaborative Agents',
        description: 'LLM-powered agents receive persona context and emit suggestions, content modifications, and layout adjustments via the event bus.',
        color: '#ec4899',
    },
    {
        icon: Monitor,
        title: 'Adaptive UI',
        description: 'React components subscribe via useSoai() and AdaptiveContainer — Framer Motion handles transitions with zero layout shift.',
        color: '#8b5cf6',
    },
];

export function HowItWorks() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section id="how-it-works" className="py-24 px-6" ref={sectionRef}>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-[11px] font-[family-name:var(--font-code)] tracking-[0.15em] uppercase text-[#00d9c0] mb-4 block">
                        Architecture
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-display)] font-bold text-[var(--color-soai-text)] mb-4">
                        From Signal to UI in {'<'} 50ms
                    </h2>
                    <p className="text-[var(--color-soai-muted)] max-w-xl mx-auto font-[family-name:var(--font-body)]">
                        A microkernel architecture where every component is a plugin. No monolith. No vendor lock-in.
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/[0.06] -translate-x-1/2" />

                    <div className="space-y-12">
                        {STEPS.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={step.title}
                                    className="relative flex items-start gap-6 md:gap-12"
                                    style={{
                                        opacity: isVisible ? 1 : 0,
                                        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                                        transition: `all 0.5s ease-out ${i * 0.12}s`,
                                    }}
                                >
                                    {/* Step number + icon */}
                                    <div className="flex flex-col items-center shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center border z-10"
                                            style={{
                                                backgroundColor: `${step.color}10`,
                                                borderColor: `${step.color}30`,
                                            }}
                                        >
                                            <Icon className="w-5 h-5" style={{ color: step.color }} />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className={`flex-1 ${i % 2 === 0 ? 'md:pr-[55%]' : 'md:pl-[55%]'}`}>
                                        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span
                                                    className="text-[10px] font-[family-name:var(--font-code)] font-medium tracking-wider"
                                                    style={{ color: step.color }}
                                                >
                                                    {String(i + 1).padStart(2, '0')}
                                                </span>
                                                <h3 className="text-base font-[family-name:var(--font-display)] font-bold text-[var(--color-soai-text)]">
                                                    {step.title}
                                                </h3>
                                            </div>
                                            <p className="text-sm text-[var(--color-soai-muted)] font-[family-name:var(--font-body)] leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
