export function FeaturesData() {
  const rows = [
    { feature: 'HMM States',         spec: 'N=3 discrete cognitive states via Viterbi decoding',            metric: '3 states' },
    { feature: 'Baum–Welch EM',      spec: 'Online parameter refinement every 20 observations',             metric: '<2 ms/step' },
    { feature: 'Shannon Entropy',    spec: 'H = −Σ pᵢ log₂(pᵢ) — behavioral diversity index',                 metric: '[0, 1.58] bits' },
    { feature: 'λ₂ Eigenvalue',       spec: 'Spectral mixing rate of row-stochastic transition matrix',     metric: '|\u03bb₂| ≤ 1' },
    { feature: 'PCHIP Percentile',   spec: 'Fritsch–Carlson monotone CDF against user’s own baseline',       metric: 'O(n log n)' },
    { feature: 'GMM Soft Assign',    spec: 'EM diagonal Gaussian mixture — K=3 persona clusters',             metric: 'Probabilistic' },
    { feature: 'Gemini 2.5 Flash',   spec: 'Full behavioral fingerprint injected into context window',        metric: 'Streaming' },
    { feature: 'Vector Persistence', spec: 'HMM θ={A,B,π} serialised to Supabase user_dna table',             metric: 'JSON' },
  ];

  return (
    <section id="features" className="py-24 bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-10">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-glow-pulse" />
          <h2 className="text-sm font-mono uppercase tracking-widest text-slate-400">Capability Matrix</h2>
        </div>
        <h2 className="text-4xl font-black gradient-text-analytical mb-12">Core Engine Specifications</h2>

        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full font-mono text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900">
                <th className="text-left py-4 px-6 text-slate-400 font-medium">Feature</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium">Specification</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium">Metric</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.feature} className={`border-b border-slate-800/60 hover:bg-slate-900/60 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-900/20'}`}>
                  <td className="py-4 px-6 font-semibold text-cyan-400">{r.feature}</td>
                  <td className="py-4 px-6 text-slate-300">{r.spec}</td>
                  <td className="py-4 px-6 text-slate-500">{r.metric}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
