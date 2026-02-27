'use client';

import { useSoai } from '@soai/react';

const PERSONA_CONFIG: Record<string, { label: string; color: string }> = {
    browser: { label: 'Browser', color: '#00d9c0' },
    researcher: { label: 'Researcher', color: '#6366f1' },
    buyer: { label: 'Buyer', color: '#f59324' },
};

export function PersonaBadge() {
    const { persona, confidence } = useSoai();
    const config = PERSONA_CONFIG[persona] ?? { label: persona, color: '#6b7280' };

    return (
        <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-sm"
            style={{
                borderColor: `${config.color}40`,
                background: `${config.color}10`,
            }}
        >
            <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: config.color }}
            />
            <span
                className="text-[11px] font-[family-name:var(--font-code)] font-medium tracking-wider uppercase"
                style={{ color: config.color }}
            >
                {config.label}
            </span>
            <span className="text-[10px] font-[family-name:var(--font-code)] text-[var(--color-soai-muted)]">
                {Math.round(confidence * 100)}%
            </span>
        </div>
    );
}
