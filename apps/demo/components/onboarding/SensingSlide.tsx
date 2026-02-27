'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useSoai } from '@soai/react';

interface SensingSlideProps {
    onAdvance: () => void;
}

const statusMessages = [
    'Detecting velocity patterns...',
    'Measuring hover depth...',
    'Calibrating intent baseline...',
    'Analyzing scroll momentum...',
    'Mapping click precision...',
    'Reading engagement depth...',
];

const signals = [
    { label: 'URGENCY', key: 'taskUrgency' as const, color: '#00d9c0' },
    { label: 'ENGAGEMENT', key: 'emotionalEngagement' as const, color: '#f59324' },
    { label: 'FOCUS', key: 'informationDensityPreference' as const, color: '#6366f1' },
];

export function SensingSlide({ onAdvance }: SensingSlideProps) {
    const { vector, confidence } = useSoai();
    const [statusIndex, setStatusIndex] = useState(0);
    const startTimeRef = useRef(Date.now());
    const advancedRef = useRef(false);

    // Confidence spring — amplified display
    const confidenceMotion = useMotionValue(0);
    const confidenceSpring = useSpring(confidenceMotion, { stiffness: 40, damping: 20 });
    const [displayConfidence, setDisplayConfidence] = useState(0);

    // Signal bar springs
    const urgencyMotion = useMotionValue(0);
    const engagementMotion = useMotionValue(0);
    const focusMotion = useMotionValue(0);
    const urgencySpring = useSpring(urgencyMotion, { stiffness: 60, damping: 15 });
    const engagementSpring = useSpring(engagementMotion, { stiffness: 60, damping: 15 });
    const focusSpring = useSpring(focusMotion, { stiffness: 60, damping: 15 });

    const urgencyWidth = useTransform(urgencySpring, [0, 1], ['0%', '100%']);
    const engagementWidth = useTransform(engagementSpring, [0, 1], ['0%', '100%']);
    const focusWidth = useTransform(focusSpring, [0, 1], ['0%', '100%']);

    const widths = [urgencyWidth, engagementWidth, focusWidth];

    // Update motion values from live data
    useEffect(() => {
        const amplified = Math.min(confidence * 1.8, 0.99);
        confidenceMotion.set(amplified);
        urgencyMotion.set(vector.taskUrgency ?? 0);
        engagementMotion.set(vector.emotionalEngagement ?? 0);
        focusMotion.set(vector.informationDensityPreference ?? 0);
    }, [confidence, vector, confidenceMotion, urgencyMotion, engagementMotion, focusMotion]);

    // Track displayed confidence value
    useEffect(() => {
        const unsubscribe = confidenceSpring.on('change', (v) => {
            setDisplayConfidence(Math.round(v * 100));
        });
        return unsubscribe;
    }, [confidenceSpring]);

    // Rotate status messages
    useEffect(() => {
        const interval = setInterval(() => {
            setStatusIndex((i) => (i + 1) % statusMessages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Auto-advance logic
    useEffect(() => {
        const check = setInterval(() => {
            if (advancedRef.current) return;
            const elapsed = Date.now() - startTimeRef.current;
            const meetsConfidence = confidence >= 0.45 && elapsed >= 4000;
            const fallback = elapsed >= 10000;
            if (meetsConfidence || fallback) {
                advancedRef.current = true;
                onAdvance();
            }
        }, 200);
        return () => clearInterval(check);
    }, [confidence, onAdvance]);

    return (
        <div className="flex flex-col items-center justify-center h-full relative overflow-hidden px-6">
            {/* Background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,217,192,0.06)_0%,transparent_60%)]" />

            {/* Confidence counter — top right */}
            <motion.div
                className="absolute top-8 right-8 sm:top-12 sm:right-12 text-right"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <div className="text-xs font-mono text-[var(--color-soai-muted)] uppercase tracking-wider mb-1">
                    Confidence
                </div>
                <div
                    className="text-4xl sm:text-5xl font-extrabold tabular-nums"
                    style={{ fontFamily: 'var(--font-syne)', color: '#00d9c0' }}
                >
                    {displayConfidence}%
                </div>
            </motion.div>

            {/* Header with pulsing dots */}
            <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2
                    className="text-2xl sm:text-4xl font-extrabold text-[var(--color-soai-text)] mb-2"
                    style={{ fontFamily: 'var(--font-syne)' }}
                >
                    Reading your behavioral signals
                    <span className="inline-flex ml-1">
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                className="inline-block w-1.5 h-1.5 rounded-full bg-[#00d9c0] mx-0.5"
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{
                                    duration: 1.4,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </span>
                </h2>

                {/* Rotating status */}
                <div className="h-6 relative">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={statusIndex}
                            className="text-sm font-mono text-[var(--color-soai-muted)] absolute inset-x-0"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3 }}
                        >
                            {statusMessages[statusIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Live signal bars */}
            <motion.div
                className="w-full max-w-md space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                {signals.map((signal, i) => (
                    <div key={signal.key}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-mono text-[var(--color-soai-muted)] uppercase tracking-wider">
                                {signal.label}
                            </span>
                        </div>
                        <div className="h-3 rounded-full bg-white/[0.06] overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{
                                    width: widths[i],
                                    backgroundColor: signal.color,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Bottom prompt */}
            <motion.p
                className="absolute bottom-8 sm:bottom-12 text-sm text-[var(--color-soai-muted)] text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
            >
                Move your mouse. Scroll. Click. We&apos;re listening.
            </motion.p>
        </div>
    );
}
