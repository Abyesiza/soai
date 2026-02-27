'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface WelcomeSlideProps {
    onAdvance: () => void;
}

const words = ['Your', 'interface', 'is', 'about', 'to', 'meet', 'you.'];

export function WelcomeSlide({ onAdvance }: WelcomeSlideProps) {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        timerRef.current = setTimeout(onAdvance, 4000);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [onAdvance]);

    return (
        <div className="flex flex-col items-center justify-center h-full relative overflow-hidden px-6">
            {/* Dot grid background */}
            <div className="soai-particle-bg absolute inset-0 opacity-30" />

            {/* Teal radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,217,192,0.12)_0%,transparent_70%)]" />

            {/* Logo with expanding rings */}
            <div className="relative mb-12">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className="absolute inset-0 rounded-full border border-[#00d9c0]"
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={{ scale: 2.5 + i * 0.8, opacity: 0 }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: 'easeOut',
                        }}
                        style={{
                            width: 80,
                            height: 80,
                            top: '50%',
                            left: '50%',
                            marginTop: -40,
                            marginLeft: -40,
                        }}
                    />
                ))}
                <motion.div
                    className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#00d9c0] to-[#00a89a] flex items-center justify-center"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <span
                        className="text-3xl font-extrabold text-[#060808]"
                        style={{ fontFamily: 'var(--font-syne)' }}
                    >
                        S
                    </span>
                </motion.div>
            </div>

            {/* Word-by-word headline */}
            <motion.h1
                className="text-3xl sm:text-5xl font-extrabold text-center text-[var(--color-soai-text)] mb-6 flex flex-wrap justify-center gap-x-3"
                style={{ fontFamily: 'var(--font-syne)' }}
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
                }}
            >
                {words.map((word, i) => (
                    <motion.span
                        key={i}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    >
                        {word}
                    </motion.span>
                ))}
            </motion.h1>

            {/* Sub-text */}
            <motion.p
                className="text-base sm:text-lg text-[var(--color-soai-muted)] text-center max-w-md mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.6 }}
            >
                In the next few seconds, we&apos;ll profile your behavioral DNA
            </motion.p>

            {/* CTA */}
            <motion.button
                onClick={() => {
                    if (timerRef.current) clearTimeout(timerRef.current);
                    onAdvance();
                }}
                className="px-8 py-3 rounded-xl text-base font-semibold bg-[#00d9c0] text-[#060808] hover:bg-[#00c4ae] transition-colors cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0, duration: 0.5 }}
            >
                Begin Analysis
            </motion.button>
        </div>
    );
}
