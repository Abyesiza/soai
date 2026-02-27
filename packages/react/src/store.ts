import { atom } from 'jotai';
import type { IntentDimensions } from '@soai/types';

export const personaAtom = atom<string>('neutral');
export const confidenceAtom = atom<number>(0);
export const vectorAtom = atom<IntentDimensions>({});
export const suggestionsAtom = atom<Array<{
    message: string;
    suggestedPersona?: string;
    confidence: number;
    action?: Record<string, unknown>;
}>>([]);
