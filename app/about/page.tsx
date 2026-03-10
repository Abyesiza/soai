import { Header } from '@/components/layout/Header';
import Link from 'next/link';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-16 border-t border-slate-800">
      <h2 className="text-2xl font-black text-white mb-8">{title}</h2>
      {children}
    </section>
  );
}

function Eq({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="my-4 flex items-start gap-4">
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 font-mono text-sm text-slate-200 overflow-x-auto whitespace-pre">
        {children}
      </div>
      {label && <div className="shrink-0 text-xs text-slate-500 self-center">{label}</div>}
    </div>
  );
}

function KeyFact({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-3 border-b border-slate-800/60 last:border-0">
      <dt className="w-40 shrink-0 text-sm font-semibold text-slate-300 font-mono">{term}</dt>
      <dd className="text-sm text-slate-400 leading-relaxed">{children}</dd>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      <Header />
      <main className="pt-28 pb-24 max-w-4xl mx-auto px-6">

        {/* Hero */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono uppercase tracking-widest mb-6">
            Mathematical Foundations
          </div>
          <h1 className="text-5xl font-black leading-tight mb-4">
            How SOAI Reads{' '}
            <span className="gradient-text-analytical">Your Behavioral Pattern</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
            SOAI never asks who you are. Instead it observes a continuous stream of interaction
            signals — mouse velocity, dwell time, scroll rhythm — and infers your cognitive mode
            using a principled probabilistic pipeline.
          </p>
        </div>

        {/* 1. Sensor Layer */}
        <Section title="1. Behavioral Sensing">
          <p className="text-slate-400 mb-6 leading-relaxed">
            The <code className="text-indigo-300 bg-indigo-950/40 px-1 rounded">SensorService</code> listens
            to raw DOM events and computes derived signals at 60 fps without blocking the main thread.
          </p>
          <dl className="bg-slate-900/40 rounded-xl border border-slate-800 px-5 py-2">
            <KeyFact term="mouseVelocity">Euclidean distance between consecutive mousemove events divided by inter-event time (px/ms).</KeyFact>
            <KeyFact term="scrollVelocity">Absolute delta scroll distance per ms, using a timestamp diff.</KeyFact>
            <KeyFact term="dwellDuration">Time elapsed since the last significant mouse movement (&gt;2 px/ms threshold), measured via <code className="text-indigo-300 bg-indigo-950/40 px-1 rounded">startDwell()</code>.</KeyFact>
            <KeyFact term="hesitationCount">Incremented whenever ≥500 ms passes between consecutive interaction events.</KeyFact>
            <KeyFact term="clickRate">Number of clicks in a 5-second rolling window.</KeyFact>
          </dl>
        </Section>

        {/* 2. Observation Discretisation */}
        <Section title="2. Observation Discretisation">
          <p className="text-slate-400 mb-4 leading-relaxed">
            Continuous signals are mapped to one of <strong className="text-white">M = 6</strong> discrete
            observation symbols using a threshold-based rule, making the data compatible with the HMM&apos;s
            finite emission alphabet.
          </p>
          <Eq label="discretize()">{`if   velocity > 0.8:              → FAST_MOVE      (0)
elif velocity > 0.2:              → SLOW_MOVE      (1)
elif dwell   > 2000ms:            → DWELL          (2)
elif |scrollVelocity| > 0.5:      → RAPID_SCROLL   (3)
elif idle    > 1500ms:            → IDLE           (4)
else:                             → INTERACTION    (5)`}</Eq>
        </Section>

        {/* 3. HMM */}
        <Section title="3. Hidden Markov Model">
          <p className="text-slate-400 mb-6 leading-relaxed">
            A discrete-time HMM with <strong className="text-white">N = 3</strong> hidden states
            (ENGAGED, SCANNING, HESITANT) and <strong className="text-white">M = 6</strong> emission
            symbols models the user&apos;s latent cognitive mode as a Markov chain driven by observable
            interaction symbols.
          </p>
          <Eq label="Model parameters θ = (A, B, π)">{`A  ∈ ℝ^{N×N}   transition matrix   A[i,j] = P(hₜ₊₁=j | hₜ=i)
B  ∈ ℝ^{N×M}   emission matrix    B[i,k] = P(oₜ=k  | hₜ=i)
π  ∈ ℝ^N       initial distribution π[i]  = P(h₁=i)`}</Eq>

          <h3 className="text-lg font-bold text-white mt-8 mb-3">Forward–Backward (log-space)</h3>
          <p className="text-slate-400 mb-3 text-sm">Used to compute the smoothed posteriors P(hₜ | O, θ) for every time step, providing a full probability distribution over states rather than a point estimate.</p>
          <Eq label="α pass">{`α[t][i] = log P(o₁…oₜ, hₜ=i | θ)
α[1][i] = log π[i] + log B[i][o₁]
α[t][i] = logsumexp_j(α[t-1][j] + log A[j][i]) + log B[i][oₜ]`}</Eq>
          <Eq label="γ (posterior)">{`γ[t][i] = P(hₜ=i | O, θ)
         = exp(α[t][i] + β[t][i] - log P(O|θ))`}</Eq>

          <h3 className="text-lg font-bold text-white mt-8 mb-3">Viterbi (log-space max-product)</h3>
          <p className="text-slate-400 mb-3 text-sm">Finds the single most likely hidden-state sequence h* given the observations — this is the reported &quot;current state&quot;.</p>
          <Eq label="Viterbi recursion">{`δ[t][i] = max_{h₁…hₜ₋₁} log P(h₁…hₜ=i, o₁…oₜ | θ)
δ[t][i] = max_j(δ[t-1][j] + log A[j][i]) + log B[i][oₜ]
h*_T    = argmax_i δ[T][i]`}</Eq>

          <h3 className="text-lg font-bold text-white mt-8 mb-3">Baum–Welch EM (online update)</h3>
          <p className="text-slate-400 mb-3 text-sm">Re-estimates A, B, π from the observed sequence every 20 new observations (minimum 10). Uses Laplace smoothing ε = 1×10⁻⁸ to avoid zero-probability emissions.</p>
          <Eq label="M-step">{`Â[i,j] = Σₜ ξ[t][i][j] / Σₜ γ[t][i]
B̂[i,k] = Σ_{t: oₜ=k} γ[t][i] / Σₜ γ[t][i]
π̂[i]   = γ[1][i]`}</Eq>
        </Section>

        {/* 4. Statistical Metrics */}
        <Section title="4. Statistical Metrics">
          <h3 className="text-lg font-bold text-white mb-3">Shannon Entropy</h3>
          <p className="text-slate-400 mb-3 text-sm">Global entropy of the stationary distribution measures overall behavioral diversity.</p>
          <Eq label="globalEntropy">{`π* = stationary distribution (power iteration on A)
H  = -Σᵢ π*[i] · log₂(π*[i])   ∈ [0, log₂(N)] bits`}</Eq>

          <h3 className="text-lg font-bold text-white mt-8 mb-3">Second-Largest Eigenvalue λ₂</h3>
          <p className="text-slate-400 mb-3 text-sm">Measures temporal persistence. |λ₂| near 1 means slow state-switching; near 0 means rapid mixing.</p>
          <Eq label="eigen2">{`λ₂ = second eigenvalue of A (by magnitude after λ₁ = 1)
     computed via deflated power iteration for N > 2`}</Eq>

          <h3 className="text-lg font-bold text-white mt-8 mb-3">PCHIP Velocity Percentile</h3>
          <p className="text-slate-400 mb-3 text-sm">Ranks the current velocity against the user&apos;s own history using a Fritsch–Carlson PCHIP monotone spline, avoiding bell-curve assumptions.</p>
          <Eq label="velocityPercentile">{`cdf  = PCHIP interpolant of empirical CDF (Hazen plotting positions)
rank = cdf(currentVelocity)   ∈ [0, 1]`}</Eq>
        </Section>

        {/* 5. Persona Classification */}
        <Section title="5. Persona Classification">
          <p className="text-slate-400 mb-6 leading-relaxed">
            The behavioral feature vector <strong className="text-white">x = [H, λ₂, velocityPercentile]</strong> is
            classified into three personas using a Gaussian Mixture Model, re-fit every 50 observations.
          </p>

          <h3 className="text-lg font-bold text-white mb-3">K-Means++ (cold start)</h3>
          <Eq label="init">{`Select first centroid c₁ uniformly at random.
For k = 2 … K: sample cₖ with probability ∝ min_j ||x - cⱼ||²
Run Lloyd iterations until convergence (WCSS).`}</Eq>

          <h3 className="text-lg font-bold text-white mt-8 mb-3">GMM Expectation–Maximisation</h3>
          <Eq label="E-step / M-step">{`r[i][k] = π[k] N(xᵢ; μₖ, Σₖ) / Σⱼ π[j] N(xᵢ; μⱼ, Σⱼ)   (responsibility)
μ̂[k]   = Σᵢ r[i][k] xᵢ / Σᵢ r[i][k]
Σ̂[k]   = diag(Σᵢ r[i][k] (xᵢ - μ̂[k])²) / Σᵢ r[i][k]
π̂[k]   = (1/N) Σᵢ r[i][k]`}</Eq>

          <h3 className="text-lg font-bold text-white mt-8 mb-3">Gap Statistic (optimal K)</h3>
          <Eq label="optimalKGap()">{`Gap(k) = E*[log W(k)] - log W(k)
W(k)   = within-cluster sum of squares
E*     = expectation under B=5 uniform reference datasets
k*     = smallest k with Gap(k) ≥ Gap(k+1) - σₖ₊₁`}</Eq>
        </Section>

        {/* 6. Persona → UI */}
        <Section title="6. Persona → UI Collapse">
          <p className="text-slate-400 mb-6 leading-relaxed">
            The normalized <code className="text-indigo-300 bg-indigo-950/40 px-1 rounded">intentProbability ∈ [0, 1]</code>{' '}
            is derived from the posterior and drives the <code className="text-indigo-300 bg-indigo-950/40 px-1 rounded">SuperpositionContainer</code>:{' '}
          </p>
          <dl className="bg-slate-900/40 rounded-xl border border-slate-800 px-5 py-2">
            <KeyFact term="p > 0.7">Analytical view rendered — dense, data-forward, monospace, terminal aesthetic.</KeyFact>
            <KeyFact term="p < 0.3">Storyteller view rendered — narrative copy, gradients, ambient animations.</KeyFact>
            <KeyFact term="0.3 ≤ p ≤ 0.7">Neutral view — balanced, glassmorphism, gentle UI transitions.</KeyFact>
          </dl>
          <p className="text-slate-500 text-sm mt-6">
            The transition matrix is continuously updated by Baum–Welch, so the thresholds adapt to each user&apos;s own behavioral baseline — not a global population average.
          </p>
        </Section>

        {/* Footer CTA */}
        <div className="mt-16 pt-10 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link href="/demo" className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:from-indigo-500 hover:to-violet-500 transition-all">
            See it live →
          </Link>
          <Link href="/" className="px-6 py-3 rounded-xl border border-slate-700 text-slate-300 hover:border-slate-500 transition-colors">
            Back to home
          </Link>
        </div>

      </main>
    </div>
  );
}
