'use client';

import { motion } from 'framer-motion';
import type { IntentDimensions } from '@soai/types';

interface RevealSlideProps {
    persona: string;
    vector: IntentDimensions;
    onComplete: () => void;
}

const personaConfig: Record<string, {
    color: string;
    headline: string;
    description: string;
}> = {
    browser: {
        color: '#00d9c0',
        headline: 'You move with curiosity.',
        description:
            'Relaxed pace, exploratory clicks — you discover before you decide. Your interface should invite wandering, not demand direction.',
    },
    researcher: {
        color: '#6366f1',
        headline: 'You are built for speed.',
        description:
            'High velocity, precise direction, dense scanning. You extract, not explore. Your interface should be information-dense and skip the preamble.',
    },
    buyer: {
        color: '#f59324',
        headline: 'You feel before you think.',
        description:
            'Lingering attention and emotional depth reveal a buyer instinct. Your interface should build trust through narrative and warmth.',
    },
};

const vectorLabels: { key: keyof IntentDimensions; label: string }[] = [
    { key: 'taskUrgency', label: 'Task Urgency' },
    { key: 'emotionalEngagement', label: 'Engagement' },
    { key: 'informationDensityPreference', label: 'Info Density' },
];

export function RevealSlide({ persona, vector, onComplete }: RevealSlideProps) {
    const config = personaConfig[persona] ?? personaConfig.browser;
    const chars = persona.toUpperCase().split('');

    return (
        <div className="flex flex-col items-center justify-center h-full relative overflow-hidden px-6">
            {/* Background color flood */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    top: '50%',
                    left: '50%',
                    width: 200,
                    height: 200,
                    marginTop: -100,
                    marginLeft: -100,
                    borderRadius: '100%',
                    backgroundColor: config.color,
                    opacity: 0.06,
                }}
                initial={{ scale: 0, borderRadius: '100%' }}
                animate={{ scale: 9, borderRadius: '0%' }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
            />

            {/* Timed sequence */}
            <div className="relative z-10 flex flex-col items-center max-w-2xl">
                {/* 1. Intro text */}
                <motion.p
                    className="text-sm font-mono text-[var(--color-soai-muted)] uppercase tracking-wider mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    After analyzing your behavioral signals...
                </motion.p>

                {/* 2. YOU ARE A */}
                <motion.p
                    className="text-xs font-mono text-[var(--color-soai-muted)] uppercase tracking-[0.3em] mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                >
                    You are a
                </motion.p>

                {/* 3. Persona name — letter by letter */}
                <motion.h1
                    className="text-6xl sm:text-8xl font-extrabold mb-6 flex"
                    style={{ fontFamily: 'var(--font-syne)', color: config.color }}
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: { staggerChildren: 0.05, delayChildren: 1.8 },
                        },
                    }}
                >
                    {chars.map((char, i) => (
                        <motion.span
                            key={i}
                            variants={{
                                hidden: { opacity: 0, y: 60, scale: 0.5 },
                                visible: { opacity: 1, y: 0, scale: 1 },
                            }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </motion.h1>

                {/* 4. Headline */}
                <motion.p
                    className="text-xl sm:text-2xl font-bold text-[var(--color-soai-text)] text-center mb-3"
                    style={{ fontFamily: 'var(--font-syne)' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.8, duration: 0.5 }}
                >
                    {config.headline}
                </motion.p>

                {/* 5. Description */}
                <motion.p
                    className="text-base text-[var(--color-soai-muted)] text-center max-w-lg mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.1, duration: 0.5 }}
                >
                    {config.description}
                </motion.p>

                {/* 6. Vector bars */}
                <motion.div
                    className="w-full max-w-sm space-y-3 mb-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.4, duration: 0.5 }}
                >
                    {vectorLabels.map(({ key, label }) => {
                        const value = (vector[key] as number) ?? 0;
                        return (
                            <div key={key}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-mono text-[var(--color-soai-muted)] uppercase tracking-wider">
                                        {label}
                                    </span>
                                    <span className="text-xs font-mono" style={{ color: config.color }}>
                                        {Math.round(value * 100)}%
                                    </span>
                                </div>
                                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: config.color }}
                                        initial={{ width: '0%' }}
                                        animate={{ width: `${value * 100}%` }}
                                        transition={{ delay: 3.4, duration: 0.8, ease: 'easeOut' }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </motion.div>

                {/* 7. CTA */}
                <motion.button
                    onClick={onComplete}
                    className="px-8 py-3 rounded-xl text-base font-semibold text-[#060808] hover:brightness-110 transition-all cursor-pointer"
                    style={{ backgroundColor: config.color }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.8, duration: 0.5 }}
                >
                    Enter your calibrated experience &rarr;
                </motion.button>
            </div>
        </div>
    );
}
