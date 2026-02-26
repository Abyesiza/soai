'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useIntent } from '@/hooks/useIntent';
import { ReactNode } from 'react';

interface SuperpositionContainerProps {
    children?: ReactNode;
    analyticalView: ReactNode;
    storytellerView: ReactNode;
    neutralView?: ReactNode;
    /** Unique id for Framer Motion layout morphing (e.g. "hero", "features") */
    layoutId?: string;
}

/**
 * COMPONENT: SuperpositionContainer
 * Handles the "Predictive Shadow DOM" logic morphing between personas.
 */
export function SuperpositionContainer({
    children,
    analyticalView,
    storytellerView,
    neutralView,
    layoutId = 'superposition-main',
}: SuperpositionContainerProps) {
    const { intent } = useIntent();
    const prob = intent.probability;
    const springConfig = { type: 'spring' as const, stiffness: 300, damping: 30 };

    return (
        <div className="relative w-full min-h-[500px]">
            <AnimatePresence mode="popLayout">
                {/* ANALYTICAL COLLAPSE */}
                {prob > 0.7 && (
                    <motion.div
                        key="analytical"
                        layoutId={layoutId}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={springConfig}
                        className="w-full"
                    >
                        {analyticalView}
                    </motion.div>
                )}

                {/* STORYTELLER COLLAPSE */}
                {prob < 0.3 && (
                    <motion.div
                        key="storyteller"
                        layoutId={layoutId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={springConfig}
                        className="w-full"
                    >
                        {storytellerView}
                    </motion.div>
                )}

                {/* NEUTRAL / SUPERPOSITION STATE */}
                {prob >= 0.3 && prob <= 0.7 && (
                    <motion.div
                        key="neutral"
                        layoutId={layoutId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full"
                    >
                        {neutralView || children}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* GHOST PRE-RENDERING (Hidden from view but mounted in DOM for asset pre-fetching) */}
            <div className="pointer-events-none absolute inset-0 -z-50 opacity-0 overflow-hidden h-0">
                <div id="ghost-analytical">{analyticalView}</div>
                <div id="ghost-storyteller">{storytellerView}</div>
            </div>
        </div>
    );
}
