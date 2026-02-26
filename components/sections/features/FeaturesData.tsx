export function FeaturesData() {
    return (
        <section id="features" className="py-24 bg-slate-900 text-slate-100 flex justify-center">
            <div className="max-w-6xl w-full px-6">
                <h2 className="text-3xl font-mono font-bold text-blue-400 mb-12 border-b border-slate-800 pb-4">
                    Core Capabilities Overview
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                                <th className="py-4 pr-6">Feature</th>
                                <th className="py-4 px-6">Specification</th>
                                <th className="py-4 pl-6">Metric</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                                <td className="py-4 pr-6 font-medium text-emerald-400">Vector Memory</td>
                                <td className="py-4 px-6 text-slate-300">pgvector powered multi-session persistence</td>
                                <td className="py-4 pl-6 text-slate-400">1536 dims</td>
                            </tr>
                            <tr className="border-b border-slate-800/50 hover:bg-slate-800/20">
                                <td className="py-4 pr-6 font-medium text-emerald-400">Shadow DOM</td>
                                <td className="py-4 px-6 text-slate-300">Pre-rendering adjacent layout states</td>
                                <td className="py-4 pl-6 text-slate-400">0ms switch</td>
                            </tr>
                            <tr className="hover:bg-slate-800/20">
                                <td className="py-4 pr-6 font-medium text-emerald-400">Agentic Inference</td>
                                <td className="py-4 px-6 text-slate-300">Gemini 2.5 Flash context streaming</td>
                                <td className="py-4 pl-6 text-slate-400">High Token Troughput</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
