'use client';

import React, { Suspense, startTransition, useEffect, useState, ComponentType } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSoai } from './hooks/useSoai';

interface AdaptiveContainerProps {
    id: string;
    variants: Record<string, React.LazyExoticComponent<ComponentType<any>> | ComponentType<any>>;
    fallback?: React.ReactNode;
    transition?: {
        duration?: number;
        ease?: any;
    };
}

export function AdaptiveContainer({
    id,
    variants,
    fallback,
    transition = { duration: 0.5 },
}: AdaptiveContainerProps) {
    const { persona, confidence } = useSoai();
    const [activePersona, setActivePersona] = useState(persona);
    const [speculativePersona, setSpeculativePersona] = useState<string | null>(null);

    useEffect(() => {
        startTransition(() => {
            setActivePersona(persona);
        });
    }, [persona]);

    // Speculative preloading: if confidence > 0.65, mount one hidden variant
    useEffect(() => {
        if (confidence > 0.65 && persona !== activePersona) {
            setSpeculativePersona(persona);
        } else {
            setSpeculativePersona(null);
        }
    }, [persona, confidence, activePersona]);

    const ActiveComponent = variants[activePersona] || variants['neutral'] || Object.values(variants)[0];
    const SpecComponent = speculativePersona ? variants[speculativePersona] : null;

    if (!ActiveComponent) return fallback ?? null;

    return (
        <>
            <AnimatePresence mode="wait">
                <motion.div
                    key={`${id}-${activePersona}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={transition}
                >
                    <Suspense fallback={fallback ?? <div>Loading...</div>}>
                        <ActiveComponent />
                    </Suspense>
                </motion.div>
            </AnimatePresence>

            {/* Speculative preloading: ONE hidden variant */}
            {SpecComponent && (
                <div aria-hidden="true" style={{ position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }}>
                    <Suspense fallback={null}>
                        <SpecComponent />
                    </Suspense>
                </div>
            )}
        </>
    );
}
