'use client';

import { useIntent } from '@/hooks/useIntent';
import { ReactNode } from 'react';

interface InteractiveCardProps {
    id: string;
    title: string;
    defaultDescription: string;
    expandedData: ReactNode;
}

export function InteractiveCard({ id, title, defaultDescription, expandedData }: InteractiveCardProps) {
    const { intent, setIntent } = useIntent();

    const handleMouseEnter = () => {
        setIntent((prev) => ({ ...prev, hoverDwellId: id }));
    };

    const handleMouseLeave = () => {
        setIntent((prev) => ({ ...prev, hoverDwellId: null }));
    };

    // If the user's velocity has slowed down and they are hovering over THIS card
    const isExpanded = intent.persona === 'analytical' || intent.hoverDwellId === id;

    return (
        <div
            className={`border rounded-xl transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${isExpanded ? 'bg-slate-50 border-blue-200' : 'bg-white border-slate-200'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 mb-4">{defaultDescription}</p>

                <div
                    className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                    <div className="overflow-hidden">
                        {expandedData}
                    </div>
                </div>
            </div>
        </div>
    );
}
