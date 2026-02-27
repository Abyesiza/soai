import { IntentDimensions } from './dimensions';

export interface SoaiEventMap {
    // Signals
    'signal:mouse': { x: number; y: number; velocity: number; straightness: number; timestamp: number };
    'signal:scroll': { y: number; velocity: number; direction: 'up' | 'down'; timestamp: number };
    'signal:touch': { x: number; y: number; velocity: number; pressure: number; timestamp: number };
    'signal:click': { x: number; y: number; target: string; frequency: number; timestamp: number };
    'signal:hover:dwell': { elementId: string; durationMs: number };
    'signal:viewport:dwell': { durationMs: number; scrollY: number };
    'signal:idle': { durationMs: number };
    'signal:visibility': { visible: boolean };
    // Intent
    'intent:update': { raw: IntentDimensions; smoothed: IntentDimensions };
    'intent:seed': { vector: IntentDimensions };
    // Persona
    'persona:change': { from: string; to: string; confidence: number; timestamp: number };
    'persona:stable': { persona: string; stableSince: number; durationMs: number };
    // Agent
    'agent:content': { type: string; content: string; persona: string; source: string; meta?: Record<string, unknown> };
    'agent:suggestion': { message: string; suggestedPersona?: string; confidence: number; action?: Record<string, unknown> };
    // User
    'user:preference': { persona: string; strength: number };
    'user:dismiss': { suggestionType: string };
    // Persistence
    'persist:loaded': { userId: string; vector: IntentDimensions; persona: string };
    'persist:saved': { userId: string; vector: IntentDimensions; persona: string };
    // Errors
    'error:plugin': { plugin: string; error: Error; fatal: boolean };
    'error:transport': { code: number; message: string; retryable: boolean };
    'error:agent': { agent: string; error: Error; fallbackUsed: boolean };
    // Lifecycle
    'lifecycle:init': Record<string, never>;
    'lifecycle:ready': Record<string, never>;
    'lifecycle:destroy': Record<string, never>;
}

export type SoaiEventTypes = keyof SoaiEventMap;

export interface SoaiEvent<K extends SoaiEventTypes = SoaiEventTypes> {
    type: K;
    payload: SoaiEventMap[K];
    timestamp: number;
}
