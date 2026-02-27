'use client';

import { useState, FormEvent } from 'react';
import { useSoai } from '@soai/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, AlertCircle, RotateCcw } from 'lucide-react';
import { DashboardRenderer } from '@/components/ui/DashboardRenderer';
import type { DashboardSpec } from '@/lib/types/dashboard';

type Phase = 'idle' | 'generating' | 'rendered' | 'error';
type Provider = 'groq' | 'google';

const MODEL_OPTIONS: { value: Provider; label: string; badge: string }[] = [
    { value: 'groq', label: 'Kimi K2 Instruct', badge: 'Groq' },
    { value: 'google', label: 'Gemini 2.5 Flash', badge: 'Google' },
];

const EXAMPLE_PROMPTS = [
    { label: 'Q4 Sales Pipeline', prompt: 'Q4 sales pipeline with deal velocity and rep performance' },
    { label: 'Team Velocity', prompt: 'Engineering team velocity with sprint burndown and deployment frequency' },
    { label: 'Customer Health', prompt: 'Customer health scores with churn risk and engagement trends' },
];

export function DashboardGenerator() {
    const { persona } = useSoai();
    const [phase, setPhase] = useState<Phase>('idle');
    const [input, setInput] = useState('');
    const [provider, setProvider] = useState<Provider>('groq');
    const [dashboard, setDashboard] = useState<DashboardSpec | null>(null);
    const [error, setError] = useState('');

    const generate = async (prompt: string) => {
        if (!prompt.trim()) return;
        setPhase('generating');
        setError('');

        try {
            const res = await fetch('/api/dashboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: prompt.trim(), persona, provider }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || data.error || 'Generation failed');
            }

            setDashboard(data.dashboard);
            setPhase('rendered');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
            setPhase('error');
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        generate(input);
    };

    const handleExample = (prompt: string) => {
        setInput(prompt);
        generate(prompt);
    };

    const reset = () => {
        setPhase('idle');
        setDashboard(null);
        setError('');
    };

    return (
        <section id="demo" className="py-24 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-[11px] font-[family-name:var(--font-code)] tracking-[0.15em] uppercase text-[#00d9c0] mb-4 block">
                        Predictive Dashboard Generator
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-display)] font-bold text-[var(--color-soai-text)] mb-4">
                        Generate. Adapt. Repeat.
                    </h2>
                    <p className="text-[var(--color-soai-muted)] max-w-xl mx-auto font-[family-name:var(--font-body)]">
                        Type a prompt. SOAI generates a dashboard via AI, then renders it differently based on your detected persona.
                    </p>
                </div>

                {/* Model selector */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="text-[10px] font-[family-name:var(--font-code)] tracking-[0.12em] uppercase text-[var(--color-soai-muted)] mr-1">
                        Model
                    </span>
                    {MODEL_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setProvider(opt.value)}
                            disabled={phase === 'generating'}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-[family-name:var(--font-body)] transition-all ${
                                provider === opt.value
                                    ? 'bg-white/[0.08] border border-[#00d9c0]/40 text-[var(--color-soai-text)]'
                                    : 'bg-white/[0.02] border border-white/[0.06] text-[var(--color-soai-muted)] hover:border-white/[0.12]'
                            } disabled:opacity-50`}
                        >
                            {opt.label}
                            <span className={`text-[9px] font-[family-name:var(--font-code)] px-1.5 py-0.5 rounded ${
                                provider === opt.value
                                    ? 'bg-[#00d9c0]/20 text-[#00d9c0]'
                                    : 'bg-white/[0.04] text-[var(--color-soai-muted)]'
                            }`}>
                                {opt.badge}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Input area */}
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Describe a dashboard..."
                            disabled={phase === 'generating'}
                            className="flex-1 px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[var(--color-soai-text)] font-[family-name:var(--font-body)] text-sm placeholder:text-[var(--color-soai-muted)]/50 focus:outline-none focus:border-[#00d9c0]/40 focus:ring-1 focus:ring-[#00d9c0]/20 transition-all disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={phase === 'generating' || !input.trim()}
                            className="px-6 py-3.5 rounded-xl bg-[#00d9c0] text-[#060808] font-[family-name:var(--font-body)] font-semibold text-sm hover:bg-[#00d9c0]/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {phase === 'generating' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Sparkles className="w-4 h-4" />
                            )}
                            Generate
                        </button>
                    </div>
                </form>

                {/* Example chips */}
                {phase === 'idle' && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {EXAMPLE_PROMPTS.map((ex) => (
                            <button
                                key={ex.label}
                                onClick={() => handleExample(ex.prompt)}
                                className="px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] text-xs font-[family-name:var(--font-body)] text-[var(--color-soai-muted)] hover:text-[var(--color-soai-text)] hover:border-[#00d9c0]/30 transition-all"
                            >
                                {ex.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Render area */}
                <div className="min-h-[300px] rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
                    <AnimatePresence mode="wait">
                        {phase === 'idle' && (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-64 text-[var(--color-soai-muted)]"
                            >
                                {/* Ghost skeleton */}
                                <div className="w-full max-w-md space-y-3 opacity-20">
                                    <div className="h-6 bg-white/10 rounded w-48" />
                                    <div className="h-3 bg-white/10 rounded w-64" />
                                    <div className="grid grid-cols-3 gap-3 mt-6">
                                        <div className="h-20 bg-white/10 rounded-lg" />
                                        <div className="h-20 bg-white/10 rounded-lg" />
                                        <div className="h-20 bg-white/10 rounded-lg" />
                                    </div>
                                    <div className="h-32 bg-white/10 rounded-lg mt-3" />
                                </div>
                                <p className="text-sm mt-6">Enter a prompt to generate an adaptive dashboard</p>
                            </motion.div>
                        )}

                        {phase === 'generating' && (
                            <motion.div
                                key="generating"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-64 gap-4"
                            >
                                <Loader2 className="w-8 h-8 text-[#00d9c0] animate-spin" />
                                <div className="text-sm text-[var(--color-soai-muted)] font-[family-name:var(--font-body)]">
                                    Analyzing intent
                                    <span className="inline-flex ml-1">
                                        <span className="animate-[typing-dots_1.4s_infinite_0s]">.</span>
                                        <span className="animate-[typing-dots_1.4s_infinite_0.2s]">.</span>
                                        <span className="animate-[typing-dots_1.4s_infinite_0.4s]">.</span>
                                    </span>
                                </div>
                                <span className="text-[10px] font-[family-name:var(--font-code)] text-[var(--color-soai-muted)]/60 tracking-wider uppercase">
                                    {MODEL_OPTIONS.find(m => m.value === provider)?.label} &middot; Persona: {persona}
                                </span>
                            </motion.div>
                        )}

                        {phase === 'rendered' && dashboard && (
                            <motion.div
                                key="rendered"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="flex justify-end mb-4">
                                    <button
                                        onClick={reset}
                                        className="flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-code)] tracking-wider uppercase text-[var(--color-soai-muted)] hover:text-[var(--color-soai-text)] transition-colors"
                                    >
                                        <RotateCcw className="w-3 h-3" />
                                        New Dashboard
                                    </button>
                                </div>
                                <DashboardRenderer spec={dashboard} />
                            </motion.div>
                        )}

                        {phase === 'error' && (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-64 gap-4"
                            >
                                <AlertCircle className="w-8 h-8 text-red-400" />
                                <p className="text-sm text-red-400">{error}</p>
                                <button
                                    onClick={() => generate(input)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-400/30 text-red-400 text-xs hover:bg-red-400/10 transition-colors"
                                >
                                    <RotateCcw className="w-3 h-3" />
                                    Retry
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
