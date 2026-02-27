'use client';

import { useAtomValue } from 'jotai';
import { personaAtom, confidenceAtom, vectorAtom } from '../store';
import type { IntentDimensions } from '@soai/types';

export interface SoaiState {
    persona: string;
    confidence: number;
    vector: IntentDimensions;
}

export function useSoai(): SoaiState {
    const persona = useAtomValue(personaAtom);
    const confidence = useAtomValue(confidenceAtom);
    const vector = useAtomValue(vectorAtom);
    return { persona, confidence, vector };
}
