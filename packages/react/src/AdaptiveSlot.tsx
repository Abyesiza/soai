'use client';

import React from 'react';
import { useSoai } from './hooks/useSoai';
import type { IntentDimensions } from '@soai/types';

interface AdaptiveSlotProps {
    children: (state: {
        persona: string;
        confidence: number;
        vector: IntentDimensions;
    }) => React.ReactNode;
}

export function AdaptiveSlot({ children }: AdaptiveSlotProps) {
    const state = useSoai();
    return <>{children(state)}</>;
}
