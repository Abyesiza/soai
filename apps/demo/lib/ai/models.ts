import { groq } from '@ai-sdk/groq';
import { google } from '@ai-sdk/google';
import type { LanguageModel } from 'ai';

export type ModelProvider = 'groq' | 'google';

export interface ModelConfig {
    provider: ModelProvider;
    label: string;
    modelId: string;
}

export const MODEL_OPTIONS: ModelConfig[] = [
    {
        provider: 'groq',
        label: 'Kimi K2 Instruct (Groq)',
        modelId: 'moonshotai/kimi-k2-instruct',
    },
    {
        provider: 'google',
        label: 'Gemini 2.5 Flash',
        modelId: 'gemini-2.5-flash-preview-05-20',
    },
];

export const DEFAULT_MODEL = MODEL_OPTIONS[0];

export function getModel(provider?: ModelProvider): LanguageModel {
    const config = provider
        ? MODEL_OPTIONS.find(m => m.provider === provider) ?? DEFAULT_MODEL
        : DEFAULT_MODEL;

    switch (config.provider) {
        case 'groq':
            return groq(config.modelId);
        case 'google':
            return google(config.modelId);
        default:
            return groq(DEFAULT_MODEL.modelId);
    }
}
