/**
 * Statistical Metrics for Behavioral Analysis
 *
 * Implements three core mathematical constructs from the paper:
 *
 * 1. Shannon Entropy (global & local transition)
 *      H  = -Σ pᵢ log₂(pᵢ)
 *      Hᵢ = -Σⱼ P[i][j] log₂(P[i][j])
 *
 * 2. Spectral Analysis – Second-Largest Eigenvalue (Eigen₂)
 *    For a row-stochastic N×N transition matrix, λ₁ ≡ 1 always.
 *    Eigen₂ captures "mixing rate": close to 1 → persistent states;
 *    close to 0 → fast mixing between behavioral modes.
 *
 * 3. PCHIP Interpolation – Individualized CDF / Percentile Ranking
 *    Transforms a user's historical observation series into a monotone
 *    smooth CDF using Piecewise Cubic Hermite Interpolating Polynomials
 *    (Fritsch–Carlson method).  The result p = CDF(x_now) is the
 *    percentile rank of the current reading vs the user's own baseline.
 */

// ─── 1. Shannon Entropy ───────────────────────────────────────────────────────

/**
 * Global stationary entropy of a probability distribution.
 *   H = -Σᵢ pᵢ · log₂(pᵢ)
 * High entropy → diverse, unpredictable behavior.
 * Low entropy  → repetitive, stereotyped behavior.
 */
export function shannonEntropy(dist: number[]): number {
  return -dist.reduce((h, p) => {
    if (p <= 0) return h;
    return h + p * Math.log2(p);
  }, 0);
}

/**
 * Local transition entropy for state row i of a transition matrix.
 *   Hᵢ = -Σⱼ P[i][j] · log₂(P[i][j])
 * Measures the predictability of the "next state" from state i.
 */
export function localTransitionEntropy(
  transitionMatrix: number[][],
  stateIndex: number
): number {
  return shannonEntropy(transitionMatrix[stateIndex]);
}

/**
 * Computes local transition entropy for every row of the transition matrix.
 * @returns array of length N_STATES
 */
export function allLocalEntropies(transitionMatrix: number[][]): number[] {
  return transitionMatrix.map((_, i) => localTransitionEntropy(transitionMatrix, i));
}

// ─── 2. Stationary Distribution ───────────────────────────────────────────────

/**
 * Computes the stationary distribution π of a row-stochastic matrix via
 * power iteration:  π = π · A  iterated until convergence.
 *
 * For an ergodic Markov chain the unique stationary distribution satisfies
 * πᵢ = Σⱼ πⱼ · A[j][i]  and  Σᵢ πᵢ = 1.
 */
export function stationaryDistribution(
  A:       number[][],
  maxIter: number  = 2000,
  tol:     number  = 1e-10
): number[] {
  const N = A.length;
  let pi = Array<number>(N).fill(1 / N);

  for (let iter = 0; iter < maxIter; iter++) {
    const newPi = Array<number>(N).fill(0);
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) newPi[j] += pi[i] * A[i][j];
    }
    let maxDiff = 0;
    for (let i = 0; i < N; i++) maxDiff = Math.max(maxDiff, Math.abs(newPi[i] - pi[i]));
    pi = newPi;
    if (maxDiff < tol) break;
  }
  return pi;
}

// ─── 3. Second-Largest Eigenvalue (Eigen₂) ────────────────────────────────────

/**
 * Returns the second-largest eigenvalue λ₂ of a row-stochastic matrix using
 * deflated power iteration.
 *
 * Mathematical derivation:
 *   For a row-stochastic A, λ₁ = 1 always (right eigenvector = [1,…,1]ᵀ,
 *   left eigenvector = stationary distribution π).
 *
 *   Deflated matrix:  B[i][j] = A[i][j] − π[j]
 *   (This projects A onto the subspace orthogonal to the dominant
 *    invariant distribution, suppressing λ₁ to 0.)
 *
 *   Biorthogonality ensures B · v_k = λ_k · v_k for all k ≥ 2,
 *   so power iteration on B converges to λ₂ (dominant eigenvalue of B).
 *
 * Closed-form is used for 2×2 and 3×3 cases; deflated iteration for N > 3.
 *
 * Interpretation:
 *   |λ₂| ≈ 1  →  high temporal persistence (user lingers in states)
 *   |λ₂| ≈ 0  →  rapid mixing, fluid transitions
 */
export function secondLargestEigenvalue(A: number[][]): number {
  const N = A.length;
  if (N < 2) return 0;

  // ── Closed-form for 2×2 ──────────────────────────────────────────────────
  if (N === 2) {
    // Characteristic polynomial: (λ-1)(λ - [tr(A)-1]) = 0
    return A[0][0] + A[1][1] - 1;
  }

  // ── Closed-form for 3×3 via characteristic polynomial ───────────────────
  if (N === 3) {
    const tr = A[0][0] + A[1][1] + A[2][2];
    // Sum of 2×2 principal minors
    const M =
      (A[0][0] * A[1][1] - A[0][1] * A[1][0]) +
      (A[0][0] * A[2][2] - A[0][2] * A[2][0]) +
      (A[1][1] * A[2][2] - A[1][2] * A[2][1]);

    // p(λ) = (λ - 1)(λ² - pλ + q)  where:
    const p = tr - 1;
    const q = M - tr + 1;
    const disc = p * p - 4 * q;

    if (disc >= 0) {
      // Two real roots — return the larger (second-largest eigenvalue of A)
      return (p + Math.sqrt(disc)) / 2;
    } else {
      // Complex conjugate pair — return magnitude (relevant for mixing time)
      return Math.sqrt(Math.max(q, 0));
    }
  }

  // ── Deflated power iteration for N > 3 ──────────────────────────────────
  const pi = stationaryDistribution(A);

  // B[i][j] = A[i][j] − π[j]  (deflation operator)
  const B = A.map(row => row.map((a, j) => a - pi[j]));

  const matVec = (M: number[][], u: number[]): number[] =>
    M.map(row => row.reduce((s, m, j) => s + m * u[j], 0));
  const vecNorm = (u: number[]): number =>
    Math.sqrt(u.reduce((s, x) => s + x * x, 0));

  // Initialize with a random vector avoiding the stationary direction
  let v = Array.from({ length: N }, (_, i) => (i % 2 === 0 ? 1 : -1) as number);
  let n = vecNorm(v);
  v = v.map(x => x / n);

  let eigenval = 0;
  for (let iter = 0; iter < 1000; iter++) {
    const Bv = matVec(B, v);
    n = vecNorm(Bv);
    if (n < 1e-15) return 0;
    const newEigen = v.reduce((s, vi, i) => s + vi * Bv[i], 0); // Rayleigh quotient
    if (Math.abs(newEigen - eigenval) < 1e-10) { eigenval = newEigen; break; }
    eigenval = newEigen;
    v = Bv.map(x => x / n);
  }

  return eigenval;
}

// ─── 4. PCHIP Interpolation — Individualized CDF ─────────────────────────────

/**
 * Computes PCHIP slopes at knot points using the Fritsch–Carlson method.
 *
 * Standard cubic splines can produce local extrema that violate
 * monotonicity — critical for a valid CDF.  PCHIP guarantees monotone
 * interpolation by constraining slopes via the harmonic-mean formula
 * and zeroing slopes at detected local extrema.
 *
 * Reference: Fritsch & Carlson (1980), SIAM J. Numer. Anal., 17(2).
 */
function pchipSlopes(x: number[], y: number[]): number[] {
  const n = x.length;
  if (n < 2) return Array(n).fill(0);

  // Interval widths and finite-difference slopes
  const h     = Array.from({ length: n - 1 }, (_, i) => x[i + 1] - x[i]);
  const delta = Array.from({ length: n - 1 }, (_, i) => (y[i + 1] - y[i]) / h[i]);

  const m: number[] = Array(n).fill(0);

  // Endpoint slopes: one-sided differences
  m[0]     = delta[0];
  m[n - 1] = delta[n - 2];

  // Interior slopes: harmonic mean of adjacent differences weighted by h
  for (let i = 1; i < n - 1; i++) {
    if (delta[i - 1] * delta[i] <= 0) {
      m[i] = 0; // local extremum → zero slope preserves monotonicity
    } else {
      const w1 = 2 * h[i] + h[i - 1];
      const w2 = h[i] + 2 * h[i - 1];
      m[i] = (w1 + w2) / (w1 / delta[i - 1] + w2 / delta[i]);
    }
  }

  // Fritsch–Carlson monotonicity condition: |αᵢ|² + |βᵢ|² ≤ 9
  for (let i = 0; i < n - 1; i++) {
    if (Math.abs(delta[i]) < 1e-15) {
      m[i] = 0; m[i + 1] = 0;
    } else {
      const alpha = m[i] / delta[i];
      const beta  = m[i + 1] / delta[i];
      const norm  = Math.sqrt(alpha * alpha + beta * beta);
      if (norm > 3) {
        const scale = 3 / norm;
        m[i]     = scale * alpha * Math.abs(delta[i]);
        m[i + 1] = scale * beta  * Math.abs(delta[i]);
      }
    }
  }

  return m;
}

/**
 * Evaluates the PCHIP cubic Hermite interpolant at a query point xq.
 *
 * Hermite basis functions on local coordinate t = (xq − xₖ)/hₖ:
 *   H₀₀(t) =  2t³ − 3t² + 1   (maps xₖ  → 1, xₖ₊₁ → 0)
 *   H₁₀(t) =   t³ − 2t² + t   (maps xₖ  → slope hₖ·mₖ)
 *   H₀₁(t) = −2t³ + 3t²       (maps xₖ₊₁ → 1, xₖ  → 0)
 *   H₁₁(t) =   t³ −  t²       (maps xₖ₊₁ → slope hₖ·mₖ₊₁)
 *
 * p(xq) = yₖ·H₀₀ + hₖ·mₖ·H₁₀ + yₖ₊₁·H₀₁ + hₖ·mₖ₊₁·H₁₁
 */
function pchipEval(
  x:  number[],
  y:  number[],
  m:  number[],
  xq: number
): number {
  const n = x.length;
  if (n === 0) return 0;
  if (xq <= x[0])     return y[0];
  if (xq >= x[n - 1]) return y[n - 1];

  // Binary search for containing interval [xₖ, xₖ₊₁]
  let lo = 0, hi = n - 2;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (x[mid] <= xq) lo = mid; else hi = mid - 1;
  }
  const k = lo;
  const h = x[k + 1] - x[k];
  const t = (xq - x[k]) / h;
  const t2 = t * t, t3 = t2 * t;

  return (
    y[k]     * (2 * t3 - 3 * t2 + 1) +
    h * m[k] * (t3 - 2 * t2 + t) +
    y[k + 1] * (-2 * t3 + 3 * t2) +
    h * m[k + 1] * (t3 - t2)
  );
}

/**
 * Builds a PCHIP-smoothed empirical CDF from user history and returns
 * the percentile rank (p-value) of the current query value.
 *
 * This individualised normalisation maps a raw sensor reading to the
 * user's own baseline, enabling detection of "unusually high" or
 * "unusually low" behaviour relative to their personal history —
 * rather than against a global population mean.
 *
 * @param history  Array of historical observations (unsorted, any length ≥ 2)
 * @param query    Current observation value
 * @returns        Percentile rank ∈ [0, 1]
 */
export function pchipPercentileRank(history: number[], query: number): number {
  if (history.length < 2) return 0.5; // insufficient history → neutral baseline

  // Sort and build empirical CDF with Hazen plotting positions: (i + 0.5) / n
  const sorted = [...history].sort((a, b) => a - b);
  const n = sorted.length;
  const rawX: number[] = sorted;
  const rawY: number[] = sorted.map((_, i) => (i + 0.5) / n);

  // Deduplicate strictly-increasing x values (required for PCHIP)
  const dedupX: number[] = [rawX[0]];
  const dedupY: number[] = [rawY[0]];
  for (let i = 1; i < n; i++) {
    if (rawX[i] > dedupX[dedupX.length - 1]) {
      dedupX.push(rawX[i]);
      dedupY.push(rawY[i]);
    }
  }
  if (dedupX.length < 2) return 0.5;

  const slopes = pchipSlopes(dedupX, dedupY);
  const raw    = pchipEval(dedupX, dedupY, slopes, query);
  return Math.max(0, Math.min(1, raw)); // clamp CDF to [0, 1]
}
