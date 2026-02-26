'use client';

import { useIntent } from '@/hooks/useIntent';
import { useEffect, useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

export function PersonalizedAgent() {
    const { intent } = useIntent();
    const [greeting, setGreeting] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [lastPersona, setLastPersona] = useState<string>('neutral');

    useEffect(() => {
        if (intent.persona === 'neutral' || intent.persona === lastPersona) return;
        setLastPersona(intent.persona);
        fetchAIContext(intent.persona, intent.mouseVelocity, intent.probability);
    }, [intent.persona, intent.mouseVelocity, intent.probability, lastPersona]);

    const fetchAIContext = async (persona: string, velocity: number, probability: number) => {
        setLoading(true);
        try {
            const res = await fetch('/api/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ persona, velocity, probability })
            });
            const data = await res.json();
            if (data.context) {
                setGreeting(data.context);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (intent.persona === 'neutral' && !greeting && !loading) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
            <div className="bg-white/90 backdrop-blur-md border border-indigo-100 shadow-2xl p-4 rounded-2xl flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">SOAI Agent</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        {loading ? "Analyzing interaction pattern..." : greeting}
                    </p>
                </div>
            </div>
        </div>
    );
}
