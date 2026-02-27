'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSoai } from '@soai/react';

const personaColors: Record<string, string> = {
    browser: '#00d9c0',
    researcher: '#6366f1',
    buyer: '#f59324',
};

export function PersonaTransitionToast() {
    const { persona } = useSoai();
    const prevRef = useRef(persona);
    const isFirstChange = useRef(true);
    const [toast, setToast] = useState<{ persona: string; color: string } | null>(null);

    useEffect(() => {
        const prev = prevRef.current;
        prevRef.current = persona;

        if (prev === persona) return;

        // Skip the initial neutral → browser boot transition
        if (isFirstChange.current) {
            isFirstChange.current = false;
            return;
        }

        const color = personaColors[persona] ?? '#00d9c0';
        setToast({ persona, color });

        const timer = setTimeout(() => setToast(null), 3000);
        return () => clearTimeout(timer);
    }, [persona]);

    return (
        <AnimatePresence>
            {toast && (
                <motion.div
                    key={toast.persona}
                    className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-[var(--color-soai-surface)]/90 backdrop-blur-md border border-white/[0.08] shadow-lg">
                        {/* Pulsing dot */}
                        <span className="relative flex h-2.5 w-2.5">
                            <span
                                className="absolute inset-0 rounded-full animate-ping opacity-75"
                                style={{ backgroundColor: toast.color }}
                            />
                            <span
                                className="relative inline-flex rounded-full h-2.5 w-2.5"
                                style={{ backgroundColor: toast.color }}
                            />
                        </span>

                        <span className="text-sm text-[var(--color-soai-muted)]">
                            SOAI detected a behavioral shift &rarr;{' '}
                            <span className="font-semibold capitalize" style={{ color: toast.color }}>
                                {toast.persona}
                            </span>
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
