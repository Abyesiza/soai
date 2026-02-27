'use client';

import React from 'react';
import { SoaiProvider } from '@soai/react';
import { soai } from '@/lib/soai';
import { DevToolsOverlay } from '@soai/react-devtools';

export function SoaiShell({ children }: { children: React.ReactNode }) {
    return (
        <SoaiProvider instance={soai}>
            {children}
            <DevToolsOverlay />
        </SoaiProvider>
    );
}
