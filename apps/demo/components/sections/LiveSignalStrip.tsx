'use client';

import { useSoai } from '@soai/react';
import { SignalBar } from '@/components/ui/SignalBar';

export function LiveSignalStrip() {
    const { vector, confidence } = useSoai();

    return (
        <div className="w-full border-y border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex items-center gap-2 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00d9c0] animate-pulse" />
                    <span className="text-[10px] font-[family-name:var(--font-code)] tracking-[0.12em] uppercase text-[var(--color-soai-muted)]">
                        Live Signal Feed
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <SignalBar
                        label="Urgency"
                        value={vector.taskUrgency ?? 0}
                        color="#00d9c0"
                    />
                    <SignalBar
                        label="Engagement"
                        value={vector.emotionalEngagement ?? 0}
                        color="#f59324"
                    />
                    <SignalBar
                        label="Info Density"
                        value={vector.informationDensityPreference ?? 0}
                        color="#6366f1"
                    />
                    <SignalBar
                        label="Confidence"
                        value={confidence}
                        color="#ec4899"
                    />
                </div>
            </div>
        </div>
    );
}
