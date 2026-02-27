'use client';

declare var process: any;

import React, { useEffect, useState, useCallback, memo } from 'react';
import { useSoai } from '@soai/react';
import { useSoaiInstance } from '@soai/react';
import type { SoaiEvent } from '@soai/types';

interface DevToolsOverlayProps {
    position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
}

const MAX_EVENTS = 50;

export const DevToolsOverlay = memo(function DevToolsOverlay({
    position = 'bottom-left',
}: DevToolsOverlayProps) {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production') {
        return null;
    }

    const { persona, confidence, vector } = useSoai();
    const instance = useSoaiInstance();
    const [events, setEvents] = useState<SoaiEvent[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'vector' | 'events' | 'persona'>('vector');

    useEffect(() => {
        const unsub = instance.events.on('*', ((event: SoaiEvent) => {
            setEvents(prev => [...prev.slice(-MAX_EVENTS), event]);
        }) as any);
        return unsub;
    }, [instance]);

    const posMap: Record<string, React.CSSProperties> = {
        'bottom-left': { bottom: 16, left: 16 },
        'bottom-right': { bottom: 16, right: 16 },
        'top-left': { top: 16, left: 16 },
        'top-right': { top: 16, right: 16 },
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    ...posMap[position],
                    zIndex: 99999,
                    background: '#1e1b4b',
                    color: '#a5b4fc',
                    border: '1px solid #4338ca',
                    borderRadius: 8,
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontFamily: 'monospace',
                }}
            >
                🔬 SOAI DevTools
            </button>
        );
    }

    return (
        <div
            style={{
                position: 'fixed',
                ...posMap[position],
                zIndex: 99999,
                width: 400,
                maxHeight: '70vh',
                background: 'rgba(15, 23, 42, 0.97)',
                backdropFilter: 'blur(16px)',
                borderRadius: 12,
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#e2e8f0',
                fontFamily: 'monospace',
                fontSize: 12,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Header */}
            <div style={{ padding: '10px 14px', borderBottom: '1px solid rgba(99,102,241,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#a5b4fc' }}>🔬 SOAI DevTools</span>
                <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 16 }}>×</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
                {(['vector', 'events', 'persona'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            flex: 1,
                            padding: '8px',
                            background: activeTab === tab ? 'rgba(99,102,241,0.2)' : 'transparent',
                            border: 'none',
                            color: activeTab === tab ? '#a5b4fc' : '#64748b',
                            cursor: 'pointer',
                            fontSize: 11,
                            textTransform: 'uppercase',
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div style={{ padding: 14, overflowY: 'auto', flex: 1 }}>
                {activeTab === 'vector' && (
                    <div>
                        {Object.entries(vector).map(([dim, val]) => (
                            <div key={dim} style={{ marginBottom: 8 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                    <span>{dim}</span>
                                    <span style={{ color: '#a5b4fc' }}>{(val ?? 0).toFixed(3)}</span>
                                </div>
                                <div style={{ height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(val ?? 0) * 100}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 3, transition: 'width 0.3s' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'persona' && (
                    <div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: '#a5b4fc', marginBottom: 8 }}>{persona}</div>
                        <div style={{ marginBottom: 4 }}>Confidence: <span style={{ color: '#22d3ee' }}>{(confidence * 100).toFixed(1)}%</span></div>
                        <div style={{ marginTop: 16 }}>
                            <button
                                onClick={() => instance.emit('persona:change', { from: persona, to: 'analytical', confidence: 1, timestamp: Date.now() })}
                                style={{ padding: '4px 10px', marginRight: 6, background: '#4338ca', border: 'none', color: 'white', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}
                            >Force Analytical</button>
                            <button
                                onClick={() => instance.emit('persona:change', { from: persona, to: 'storyteller', confidence: 1, timestamp: Date.now() })}
                                style={{ padding: '4px 10px', marginRight: 6, background: '#7c3aed', border: 'none', color: 'white', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}
                            >Force Storyteller</button>
                            <button
                                onClick={() => instance.emit('persona:change', { from: persona, to: 'neutral', confidence: 1, timestamp: Date.now() })}
                                style={{ padding: '4px 10px', background: '#475569', border: 'none', color: 'white', borderRadius: 4, cursor: 'pointer', fontSize: 11 }}
                            >Force Neutral</button>
                        </div>
                    </div>
                )}

                {activeTab === 'events' && (
                    <div>
                        {events.slice().reverse().map((evt, i) => (
                            <div key={i} style={{ padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', wordBreak: 'break-all' }}>
                                <span style={{ color: '#6366f1' }}>{evt.type}</span>
                                <span style={{ color: '#64748b', marginLeft: 8 }}>{JSON.stringify(evt.payload).slice(0, 80)}</span>
                            </div>
                        ))}
                        {events.length === 0 && <span style={{ color: '#64748b' }}>No events yet...</span>}
                    </div>
                )}
            </div>
        </div>
    );
});
