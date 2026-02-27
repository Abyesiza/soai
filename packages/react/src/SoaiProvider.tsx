'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Provider as JotaiProvider, useSetAtom } from 'jotai';
import { Soai } from '@soai/core';
import { personaAtom, confidenceAtom, vectorAtom, suggestionsAtom } from './store';

interface SoaiContextValue {
    instance: Soai;
}

const SoaiContext = createContext<SoaiContextValue | null>(null);

export function useSoaiInstance(): Soai {
    const ctx = useContext(SoaiContext);
    if (!ctx) throw new Error('useSoaiInstance must be used within <SoaiProvider>');
    return ctx.instance;
}

function SoaiSync({ instance }: { instance: Soai }) {
    const setPersona = useSetAtom(personaAtom);
    const setConfidence = useSetAtom(confidenceAtom);
    const setVector = useSetAtom(vectorAtom);
    const setSuggestions = useSetAtom(suggestionsAtom);

    useEffect(() => {
        const unsubs: (() => void)[] = [];

        unsubs.push(instance.events.on('persona:change', (payload) => {
            setPersona(payload.to);
            setConfidence(payload.confidence);
        }));

        unsubs.push(instance.events.on('intent:update', (payload) => {
            setVector(payload.smoothed);
        }));

        unsubs.push(instance.events.on('agent:suggestion', (payload) => {
            setSuggestions(prev => [...prev, payload]);
        }));

        return () => unsubs.forEach(u => u());
    }, [instance, setPersona, setConfidence, setVector, setSuggestions]);

    return null;
}

export function SoaiProvider({
    instance,
    children,
}: {
    instance: Soai;
    children: React.ReactNode;
}) {
    const startedRef = useRef(false);

    useEffect(() => {
        if (!startedRef.current) {
            startedRef.current = true;
            instance.start();
        }
        return () => {
            instance.stop();
            startedRef.current = false;
        };
    }, [instance]);

    return (
        <JotaiProvider>
            <SoaiContext.Provider value={{ instance }}>
                <SoaiSync instance={instance} />
                {children}
            </SoaiContext.Provider>
        </JotaiProvider>
    );
}
