'use client';

import { CodeBlock } from '@/components/ui/CodeBlock';

const INSTALL_CODE = `npm install @soai/react`;

const USAGE_CODE = `import { SoaiProvider, AdaptiveContainer, useSoai } from '@soai/react';

function App() {
  return (
    <SoaiProvider preset="ecommerce">
      <AdaptiveContainer
        id="hero"
        variants={{
          browser: DefaultHero,
          researcher: DataHero,
          buyer: EmotionalHero,
        }}
      />
    </SoaiProvider>
  );
}`;

export function Integration() {
    return (
        <section id="integrate" className="py-24 px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <span className="text-[11px] font-[family-name:var(--font-code)] tracking-[0.15em] uppercase text-[#00d9c0] mb-4 block">
                        Integration
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-[family-name:var(--font-display)] font-bold text-[var(--color-soai-text)] mb-4">
                        Three Lines to Intelligence
                    </h2>
                    <p className="text-[var(--color-soai-muted)] max-w-xl mx-auto font-[family-name:var(--font-body)]">
                        Drop-in React integration. No configuration required. Behavioral sensors activate automatically.
                    </p>
                </div>

                <div className="space-y-4">
                    <CodeBlock code={INSTALL_CODE} language="bash" />
                    <CodeBlock code={USAGE_CODE} language="tsx" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 text-center">
                        <div className="text-2xl font-[family-name:var(--font-display)] font-bold text-[#00d9c0] mb-1">{'<'} 8kb</div>
                        <div className="text-xs text-[var(--color-soai-muted)] font-[family-name:var(--font-body)]">Gzipped bundle</div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 text-center">
                        <div className="text-2xl font-[family-name:var(--font-display)] font-bold text-[#6366f1] mb-1">0 config</div>
                        <div className="text-xs text-[var(--color-soai-muted)] font-[family-name:var(--font-body)]">Works out of the box</div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 text-center">
                        <div className="text-2xl font-[family-name:var(--font-display)] font-bold text-[#f59324] mb-1">16 pkgs</div>
                        <div className="text-xs text-[var(--color-soai-muted)] font-[family-name:var(--font-body)]">Modular architecture</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
