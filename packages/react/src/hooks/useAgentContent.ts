'use client';

import { useEffect, useState } from 'react';
import { useSoaiInstance } from '../SoaiProvider';

interface AgentContent {
    type: string;
    content: string;
    persona: string;
    source: string;
    meta?: Record<string, unknown>;
}

export function useAgentContent(): AgentContent | null {
    const instance = useSoaiInstance();
    const [content, setContent] = useState<AgentContent | null>(null);

    useEffect(() => {
        const unsub = instance.events.on('agent:content', (payload) => {
            setContent(payload);
        });
        return unsub;
    }, [instance]);

    return content;
}
