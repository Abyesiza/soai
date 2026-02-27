'use client';

import { useSoai } from '@soai/react';
import { motion } from 'framer-motion';
import type { DashboardSpec, DashboardChart, DashboardMetric, DashboardTable } from '@/lib/types/dashboard';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DashboardRendererProps {
    spec: DashboardSpec;
}

export function DashboardRenderer({ spec }: DashboardRendererProps) {
    const { persona } = useSoai();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6"
        >
            {/* Title */}
            <motion.div variants={item}>
                <h3 className="text-xl font-[family-name:var(--font-display)] font-bold text-[var(--color-soai-text)]">
                    {spec.title}
                </h3>
                <p className="text-sm text-[var(--color-soai-muted)] mt-1">{spec.subtitle}</p>
            </motion.div>

            {/* Metrics */}
            <motion.div
                variants={item}
                className={
                    persona === 'buyer'
                        ? 'grid grid-cols-1 sm:grid-cols-3 gap-4'
                        : persona === 'researcher'
                            ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3'
                            : 'grid grid-cols-2 sm:grid-cols-4 gap-4'
                }
            >
                {spec.metrics.map((m, i) => (
                    <MetricCard key={i} metric={m} persona={persona} />
                ))}
            </motion.div>

            {/* Charts */}
            {spec.charts.length > 0 && (
                <motion.div
                    variants={item}
                    className={
                        persona === 'buyer'
                            ? 'flex justify-center'
                            : 'grid grid-cols-1 md:grid-cols-2 gap-4'
                    }
                >
                    {spec.charts.map((c, i) => (
                        <ChartCard key={i} chart={c} persona={persona} />
                    ))}
                </motion.div>
            )}

            {/* Tables */}
            {spec.tables.length > 0 && persona !== 'buyer' && (
                <motion.div variants={item} className="space-y-4">
                    {spec.tables.map((t, i) => (
                        <TableCard key={i} table={t} persona={persona} />
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}

function MetricCard({ metric, persona }: { metric: DashboardMetric; persona: string }) {
    const ChangeIcon = metric.changeDirection === 'up'
        ? TrendingUp
        : metric.changeDirection === 'down'
            ? TrendingDown
            : Minus;

    const changeColor = metric.changeDirection === 'up'
        ? 'text-emerald-400'
        : metric.changeDirection === 'down'
            ? 'text-red-400'
            : 'text-[var(--color-soai-muted)]';

    if (persona === 'buyer') {
        return (
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 text-center">
                <div className="text-4xl font-[family-name:var(--font-display)] font-bold text-[var(--color-soai-text)] mb-1">
                    {metric.value}
                </div>
                <div className="text-sm text-[var(--color-soai-muted)] mb-2">{metric.label}</div>
                {metric.change && (
                    <div className={`flex items-center justify-center gap-1 text-sm ${changeColor}`}>
                        <ChangeIcon className="w-3.5 h-3.5" />
                        {metric.change}
                    </div>
                )}
            </div>
        );
    }

    if (persona === 'researcher') {
        return (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg px-3 py-2">
                <div className="text-[10px] font-[family-name:var(--font-code)] tracking-wider uppercase text-[var(--color-soai-muted)] mb-0.5">
                    {metric.label}
                </div>
                <div className="text-lg font-[family-name:var(--font-code)] font-medium text-[var(--color-soai-text)]">
                    {metric.value}
                </div>
                {metric.change && (
                    <span className={`text-[10px] font-[family-name:var(--font-code)] ${changeColor}`}>
                        {metric.change}
                    </span>
                )}
            </div>
        );
    }

    // browser (default)
    return (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4">
            <div className="text-xs text-[var(--color-soai-muted)] mb-1">{metric.label}</div>
            <div className="text-2xl font-[family-name:var(--font-display)] font-bold text-[var(--color-soai-text)]">
                {metric.value}
            </div>
            {metric.change && (
                <div className={`flex items-center gap-1 mt-1 text-xs ${changeColor}`}>
                    <ChangeIcon className="w-3 h-3" />
                    {metric.change}
                </div>
            )}
        </div>
    );
}

function ChartCard({ chart, persona }: { chart: DashboardChart; persona: string }) {
    const maxVal = Math.max(...chart.data.map(d => d.value), 1);

    return (
        <div className={`bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 ${persona === 'buyer' ? 'w-full max-w-md' : ''}`}>
            <div className="text-xs font-[family-name:var(--font-code)] tracking-wider uppercase text-[var(--color-soai-muted)] mb-4">
                {chart.title}
            </div>

            {chart.type === 'bar' && (
                <div className="flex items-end gap-2 h-32">
                    {chart.data.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <motion.div
                                className="w-full rounded-t"
                                style={{ backgroundColor: '#00d9c0' }}
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                                data-height={`${(d.value / maxVal) * 100}%`}
                            >
                                <div
                                    className="w-full rounded-t"
                                    style={{
                                        height: `${(d.value / maxVal) * 128}px`,
                                        backgroundColor: '#00d9c0',
                                        opacity: 0.7 + (i % 3) * 0.1,
                                    }}
                                />
                            </motion.div>
                            <span className="text-[9px] font-[family-name:var(--font-code)] text-[var(--color-soai-muted)] truncate w-full text-center">
                                {d.label}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {chart.type === 'line' && (
                <svg viewBox="0 0 300 120" className="w-full h-32" preserveAspectRatio="none">
                    <polyline
                        fill="none"
                        stroke="#00d9c0"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        points={chart.data
                            .map((d, i) => {
                                const x = (i / Math.max(chart.data.length - 1, 1)) * 290 + 5;
                                const y = 115 - (d.value / maxVal) * 100;
                                return `${x},${y}`;
                            })
                            .join(' ')}
                    />
                    <polygon
                        fill="url(#lineGradient)"
                        opacity="0.15"
                        points={`5,115 ${chart.data
                            .map((d, i) => {
                                const x = (i / Math.max(chart.data.length - 1, 1)) * 290 + 5;
                                const y = 115 - (d.value / maxVal) * 100;
                                return `${x},${y}`;
                            })
                            .join(' ')} 295,115`}
                    />
                    <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#00d9c0" />
                            <stop offset="100%" stopColor="#00d9c0" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>
            )}

            {chart.type === 'donut' && <DonutChart data={chart.data} />}
        </div>
    );
}

function DonutChart({ data }: { data: DashboardChart['data'] }) {
    const total = data.reduce((s, d) => s + d.value, 0) || 1;
    const colors = ['#00d9c0', '#f59324', '#6366f1', '#ec4899', '#8b5cf6', '#06b6d4'];
    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    let accumulated = 0;

    return (
        <div className="flex items-center justify-center gap-6">
            <svg width="120" height="120" viewBox="0 0 120 120">
                {data.map((d, i) => {
                    const pct = d.value / total;
                    const offset = circumference * (1 - pct);
                    const rotation = accumulated * 360 - 90;
                    accumulated += pct;
                    return (
                        <circle
                            key={i}
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="none"
                            stroke={colors[i % colors.length]}
                            strokeWidth="12"
                            strokeDasharray={`${circumference}`}
                            strokeDashoffset={offset}
                            transform={`rotate(${rotation} 60 60)`}
                            className="transition-all duration-500"
                        />
                    );
                })}
            </svg>
            <div className="space-y-1.5">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                        <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: colors[i % colors.length] }}
                        />
                        <span className="text-[var(--color-soai-muted)]">{d.label}</span>
                        <span className="text-[var(--color-soai-text)] font-[family-name:var(--font-code)]">
                            {Math.round((d.value / total) * 100)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function TableCard({ table, persona }: { table: DashboardTable; persona: string }) {
    const rows = persona === 'researcher' ? table.rows : table.rows.slice(0, 5);

    return (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06]">
                <span className="text-xs font-[family-name:var(--font-code)] tracking-wider uppercase text-[var(--color-soai-muted)]">
                    {table.title}
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/[0.06]">
                            {table.columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-4 py-2.5 text-left text-[10px] font-[family-name:var(--font-code)] tracking-wider uppercase text-[var(--color-soai-muted)] font-medium"
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, ri) => (
                            <tr key={ri} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                {table.columns.map((col, ci) => (
                                    <td
                                        key={col.key}
                                        className="px-4 py-2 text-[var(--color-soai-text)] font-[family-name:var(--font-code)] text-xs"
                                    >
                                        {row[ci] ?? ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
