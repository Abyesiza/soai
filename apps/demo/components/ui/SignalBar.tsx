'use client';

interface SignalBarProps {
    label: string;
    value: number;
    color?: string;
}

export function SignalBar({ label, value, color = '#00d9c0' }: SignalBarProps) {
    const pct = Math.round(Math.min(Math.max(value, 0), 1) * 100);

    return (
        <div className="flex items-center gap-3 min-w-0">
            <span className="text-[10px] font-[family-name:var(--font-code)] tracking-[0.12em] uppercase text-[var(--color-soai-muted)] shrink-0 w-24 text-right">
                {label}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-300 ease-out"
                    style={{
                        width: `${pct}%`,
                        backgroundColor: color,
                        boxShadow: `0 0 8px ${color}40`,
                    }}
                />
            </div>
            <span className="text-[10px] font-[family-name:var(--font-code)] text-[var(--color-soai-muted)] shrink-0 w-8 tabular-nums">
                {pct}%
            </span>
        </div>
    );
}
