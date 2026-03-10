'use client';

import { useIntent } from '@/hooks/useIntent';
import { ButtonHTMLAttributes } from 'react';

interface DynamicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    storyText: string;
    dataText: string;
}

export function DynamicButton({ storyText, dataText, className, ...props }: DynamicButtonProps) {
    const { intent } = useIntent();
    const isDataMode = intent.persona === 'analytical';

    return (
        <button
            {...props}
            className={`relative overflow-hidden px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-sm
        ${isDataMode
                    ? 'bg-slate-900 text-slate-100 hover:bg-slate-800'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105'
                } ${className}`}
        >
            <span className="relative z-10 transition-colors">
                {isDataMode ? dataText : storyText}
            </span>

            {/* Decorative gradient that appears in story mode */}
            {!isDataMode && (
                <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 hover:opacity-100 transition-opacity duration-300 z-0" />
            )}
        </button>
    );
}
