'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSoai } from '@soai/react';
import { WelcomeSlide } from './WelcomeSlide';
import { SensingSlide } from './SensingSlide';
import { RevealSlide } from './RevealSlide';

type Phase = 'welcome' | 'sensing' | 'reveal' | 'complete';

interface SoaiJourneyProps {
    onComplete: () => void;
}

export function SoaiJourney({ onComplete }: SoaiJourneyProps) {
    const [phase, setPhase] = useState<Phase>('welcome');
    const { persona, vector } = useSoai();

    const goToSensing = useCallback(() => setPhase('sensing'), []);
    const goToReveal = useCallback(() => setPhase('reveal'), []);
    const handleComplete = useCallback(() => {
        setPhase('complete');
        onComplete();
    }, [onComplete]);

    if (phase === 'complete') return null;

    return (
        <AnimatePresence>
            <motion.div
                key="soai-journey-overlay"
                className="fixed inset-0 z-[200] bg-[var(--color-soai-bg)]"
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
                <AnimatePresence mode="wait">
                    {phase === 'welcome' && (
                        <motion.div
                            key="welcome"
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.4 }}
                        >
                            <WelcomeSlide onAdvance={goToSensing} />
                        </motion.div>
                    )}
                    {phase === 'sensing' && (
                        <motion.div
                            key="sensing"
                            className="absolute inset-0"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                            transition={{ duration: 0.4 }}
                        >
                            <SensingSlide onAdvance={goToReveal} />
                        </motion.div>
                    )}
                    {phase === 'reveal' && (
                        <motion.div
                            key="reveal"
                            className="absolute inset-0"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.4 }}
                        >
                            <RevealSlide
                                persona={persona}
                                vector={vector}
                                onComplete={handleComplete}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </AnimatePresence>
    );
}
