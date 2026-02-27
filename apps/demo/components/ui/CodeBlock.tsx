'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
    code: string;
    language?: string;
}

export function CodeBlock({ code, language = 'tsx' }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-xl border border-white/[0.08] bg-[#0d1117] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
                <span className="text-[10px] font-[family-name:var(--font-code)] tracking-[0.12em] uppercase text-[var(--color-soai-muted)]">
                    {language}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-code)] text-[var(--color-soai-muted)] hover:text-[var(--color-soai-teal)] transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="w-3 h-3" />
                            Copied
                        </>
                    ) : (
                        <>
                            <Copy className="w-3 h-3" />
                            Copy
                        </>
                    )}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto">
                <code className="text-[13px] font-[family-name:var(--font-code)] leading-relaxed text-[var(--color-soai-text)]">
                    {code}
                </code>
            </pre>
        </div>
    );
}
