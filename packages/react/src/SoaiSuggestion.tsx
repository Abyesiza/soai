'use client';

import React, { useCallback } from 'react';
import { useAtom } from 'jotai';
import { AnimatePresence, motion } from 'framer-motion';
import { suggestionsAtom } from './store';
import { useSoaiInstance } from './SoaiProvider';

interface SoaiSuggestionProps {
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    renderSuggestion?: (suggestion: any, onAccept: () => void, onDismiss: () => void) => React.ReactNode;
}

const positionStyles: Record<string, React.CSSProperties> = {
    'bottom-right': { position: 'fixed', bottom: 24, right: 24 },
    'bottom-left': { position: 'fixed', bottom: 24, left: 24 },
    'top-right': { position: 'fixed', top: 24, right: 24 },
    'top-left': { position: 'fixed', top: 24, left: 24 },
};

export function SoaiSuggestion({
    position = 'bottom-right',
    renderSuggestion,
}: SoaiSuggestionProps) {
    const instance = useSoaiInstance();
    const [suggestions, setSuggestions] = useAtom(suggestionsAtom);

    const current = suggestions[suggestions.length - 1];

    const handleAccept = useCallback(() => {
        if (!current) return;
        instance.emit('user:preference', {
            persona: current.suggestedPersona ?? 'neutral',
            strength: current.confidence,
        });
        setSuggestions([]);
    }, [current, instance, setSuggestions]);

    const handleDismiss = useCallback(() => {
        instance.emit('user:dismiss', { suggestionType: 'persona-switch' });
        setSuggestions([]);
    }, [instance, setSuggestions]);

    if (!current) return null;

    if (renderSuggestion) {
        return <>{renderSuggestion(current, handleAccept, handleDismiss)}</>;
    }

    return (
        <div style={positionStyles[position]}>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    style={{
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: 12,
                        padding: '16px 20px',
                        color: 'white',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        maxWidth: 320,
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    <p style={{ margin: '0 0 12px', fontSize: 14, lineHeight: 1.5 }}>{current.message}</p>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button
                            onClick={handleDismiss}
                            style={{
                                padding: '6px 14px',
                                borderRadius: 8,
                                border: '1px solid rgba(255,255,255,0.2)',
                                background: 'transparent',
                                color: 'rgba(255,255,255,0.7)',
                                cursor: 'pointer',
                                fontSize: 13,
                            }}
                        >
                            Dismiss
                        </button>
                        <button
                            onClick={handleAccept}
                            style={{
                                padding: '6px 14px',
                                borderRadius: 8,
                                border: 'none',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: 13,
                                fontWeight: 600,
                            }}
                        >
                            Adjust
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
