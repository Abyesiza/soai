/**
 * Persona Classifier — Unsupervised Learning Module
 *
 * Implements two complementary algorithms from the paper:
 *
 * 1. K-Means++ (hard assignment)
 *    Minimises Within-Cluster Sum of Squares:
 *      WCSS = Σᵢ Σₓ∈Cᵢ ‖x − cᵢ‖²
 *    Uses D²-sampling (K-Means++) for initialisation to spread centroids
 *    far apart, avoiding poor convergence from coincident initial seeds.
 *
 * 2. Gaussian Mixture Model (soft assignment) with Expectation-Maximisation
 *    Assumes each persona cluster is a multivariate Gaussian with diagonal
 *    covariance (tractable in the browser with small feature dimension).
 *
 *    E-step:  rᵢⱼ  = πᵢ · N(xⱼ; μᵢ, Σᵢ) / [Σₖ πₖ · N(xⱼ; μₖ, Σₖ)]
 *    M-step:  πᵢ   = Σⱼ rᵢⱼ / N
 *             μᵢ   = Σⱼ rᵢⱼ xⱼ / Σⱼ rᵢⱼ
 *             σ²ᵢ  = Σⱼ rᵢⱼ (xⱼ − μᵢ)² / Σⱼ rᵢⱼ   (diagonal variance)
 *
 * Feature vector used for behavioural segmentation:
 *   [velocityPercentile, globalEntropy, |eigen₂|, p_ENGAGED]
 *   Dimension d = 4, matching the normalized [0, 1] range of each feature.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface KMeansResult {
  /** Cluster assignment for each data point */
  labels:    number[];
  /** Centroid for each cluster [K × d] */
  centroids: number[][];
  /** Within-cluster sum of squares: Σᵢ Σₓ∈Cᵢ ‖x − cᵢ‖² */
  wcss:      number;
}

export interface GMMComponent {
  mean:     number[];  // μᵢ  [d]
  variance: number[];  // σ²ᵢ [d]  (diagonal covariance)
  weight:   number;    // πᵢ  scalar mixture weight
}

export interface GMMResult {
  /** Soft responsibility matrix [N_samples × K] */
  responsibilities: number[][];
  /** Calibrated Gaussian components */
  components:       GMMComponent[];
  /** Final log-likelihood Σⱼ log P(xⱼ | θ) */
  logLikelihood:    number;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Euclidean distance: d(x, c) = √Σᵢ (xᵢ − cᵢ)² */
function euclidean(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, ai, i) => sum + (ai - b[i]) ** 2, 0));
}

/** Numerically stable log-sum-exp */
function logSumExp(logVals: number[]): number {
  const max = Math.max(...logVals);
  if (!isFinite(max)) return -Infinity;
  return max + Math.log(logVals.reduce((s, lv) => s + Math.exp(lv - max), 0));
}

/** Log-PDF of a diagonal-covariance Gaussian */
function gaussianLogPDF(x: number[], mean: number[], variance: number[]): number {
  const d = x.length;
  let logDet = 0;
  let mahal  = 0;
  for (let i = 0; i < d; i++) {
    const v = Math.max(variance[i], 1e-8);
    logDet += Math.log(v);
    mahal  += (x[i] - mean[i]) ** 2 / v;
  }
  return -0.5 * (d * Math.log(2 * Math.PI) + logDet + mahal);
}

// ─── K-Means++ Initialisation ─────────────────────────────────────────────────

/**
 * Selects K initial centroids via D²-weighted sampling.
 *
 * Algorithm (Arthur & Vassilvitskii, 2007):
 *   1. Choose first centroid uniformly at random.
 *   2. For each subsequent centroid, sample from the distribution
 *      proportional to D²(x) = minₖ ‖x − cₖ‖² (squared nearest-centroid dist).
 *   This ensures centroids are spread far apart, dramatically reducing
 *   the probability of converging to a sub-optimal local minimum.
 */
function kMeansPlusPlusInit(data: number[][], k: number): number[][] {
  const n = data.length;
  const centroids: number[][] = [[...data[Math.floor(Math.random() * n)]]];

  for (let c = 1; c < k; c++) {
    // Squared distance from each point to its nearest centroid
    const d2 = data.map(x =>
      Math.min(...centroids.map(cent => euclidean(x, cent) ** 2))
    );
    const total = d2.reduce((a, b) => a + b, 0);

    // Multinomial sample proportional to D²
    let rand = Math.random() * total;
    let chosen = n - 1;
    for (let i = 0; i < n; i++) {
      rand -= d2[i];
      if (rand <= 0) { chosen = i; break; }
    }
    centroids.push([...data[chosen]]);
  }
  return centroids;
}

// ─── K-Means ──────────────────────────────────────────────────────────────────

/**
 * K-Means clustering with K-Means++ initialisation.
 *
 * Minimises WCSS = Σᵢ Σₓ∈Cᵢ ‖x − cᵢ‖²
 * via alternating assignment and centroid update steps.
 *
 * Empty clusters are re-seeded from a random data point to prevent
 * degenerate solutions.
 *
 * @param data     Feature matrix [N × d]
 * @param k        Number of clusters
 * @param maxIter  Maximum EM iterations (default 100)
 */
export function kMeans(
  data:    number[][],
  k:       number,
  maxIter: number = 100
): KMeansResult {
  if (data.length === 0) return { labels: [], centroids: [], wcss: 0 };
  const n   = data.length;
  const dim = data[0].length;

  let centroids = kMeansPlusPlusInit(data, k);
  let labels: number[] = Array(n).fill(0);

  for (let iter = 0; iter < maxIter; iter++) {
    // ── Assignment step: hard-assign each point to nearest centroid ──────
    const newLabels = data.map(x => {
      const dists = centroids.map(c => euclidean(x, c));
      return dists.indexOf(Math.min(...dists));
    });

    const converged = newLabels.every((l, i) => l === labels[i]);
    labels = newLabels;
    if (converged && iter > 0) break;

    // ── Update step: recompute cluster means ─────────────────────────────
    const sums:   number[][] = Array.from({ length: k }, () => Array(dim).fill(0));
    const counts: number[]   = Array(k).fill(0);
    for (let i = 0; i < n; i++) {
      counts[labels[i]]++;
      for (let d = 0; d < dim; d++) sums[labels[i]][d] += data[i][d];
    }
    centroids = sums.map((s, c) =>
      counts[c] > 0
        ? s.map(v => v / counts[c])
        : [...data[Math.floor(Math.random() * n)]]  // re-seed empty cluster
    );
  }

  const wcss = data.reduce(
    (sum, x, i) => sum + euclidean(x, centroids[labels[i]]) ** 2, 0
  );
  return { labels, centroids, wcss };
}

// ─── GMM with EM ──────────────────────────────────────────────────────────────

/**
 * Fits a Gaussian Mixture Model via Expectation-Maximisation.
 *
 * Initialised with K-Means++ centroids; all variances set to 1.0 initially.
 * Uses diagonal covariance matrices for efficiency (d² params → d params).
 *
 * A small regularisation floor (σ²_min = 1e-6) prevents numerical collapse
 * when a cluster captures very few points in high-density regions.
 *
 * @param data    Feature matrix [N × d]
 * @param k       Number of mixture components
 * @param maxIter Maximum EM iterations
 * @param tol     Log-likelihood convergence tolerance
 */
export function fitGMM(
  data:    number[][],
  k:       number,
  maxIter: number = 100,
  tol:     number = 1e-4
): GMMResult {
  const n   = data.length;
  const dim = data[0].length;

  // Initialise with K-Means centroids and unit variances
  const { centroids } = kMeans(data, k, 20);
  let components: GMMComponent[] = centroids.map(mean => ({
    mean:     [...mean],
    variance: Array(dim).fill(1.0),
    weight:   1 / k,
  }));

  let responsibilities: number[][] = Array.from({ length: n }, () =>
    Array(k).fill(1 / k)
  );
  let prevLL = -Infinity;

  for (let iter = 0; iter < maxIter; iter++) {
    // ── E-Step: compute responsibilities r[j][i] ──────────────────────
    const pointLL: number[] = [];
    for (let j = 0; j < n; j++) {
      const logWPDF = components.map(c =>
        Math.log(Math.max(c.weight, 1e-15)) + gaussianLogPDF(data[j], c.mean, c.variance)
      );
      const logNorm = logSumExp(logWPDF);
      pointLL.push(logNorm);
      for (let i = 0; i < k; i++) {
        responsibilities[j][i] = Math.exp(logWPDF[i] - logNorm);
      }
    }
    const logLikelihood = pointLL.reduce((a, b) => a + b, 0);
    if (Math.abs(logLikelihood - prevLL) < tol) {
      return { responsibilities, components, logLikelihood };
    }
    prevLL = logLikelihood;

    // ── M-Step: update component parameters ──────────────────────────
    components = Array.from({ length: k }, (_, i) => {
      const Nk = responsibilities.reduce((s, r) => s + r[i], 0);
      const safeNk = Math.max(Nk, 1e-10);
      const weight = Math.max(Nk / n, 1e-10);

      // Updated mean
      const mean = Array(dim).fill(0);
      for (let j = 0; j < n; j++) {
        for (let d = 0; d < dim; d++) mean[d] += responsibilities[j][i] * data[j][d];
      }
      for (let d = 0; d < dim; d++) mean[d] /= safeNk;

      // Updated diagonal variance (with floor for regularisation)
      const variance = Array(dim).fill(0);
      for (let j = 0; j < n; j++) {
        for (let d = 0; d < dim; d++) {
          variance[d] += responsibilities[j][i] * (data[j][d] - mean[d]) ** 2;
        }
      }
      for (let d = 0; d < dim; d++) {
        variance[d] = Math.max(variance[d] / safeNk, 1e-6);
      }
      return { mean, variance, weight };
    });
  }

  return { responsibilities, components, logLikelihood: prevLL };
}

// ─── Soft Persona from GMM ────────────────────────────────────────────────────

/**
 * Given a feature vector for the current user and pre-fitted GMM components,
 * computes the soft membership (responsibility) over each persona cluster.
 *
 * This is a single E-step evaluation with no model update:
 *   rᵢ = πᵢ · N(x; μᵢ, Σᵢ) / Σₖ πₖ · N(x; μₖ, Σₖ)
 *
 * @param featureVector  Current user's feature vector [d]
 * @param components     Fitted GMM components
 * @returns             Probability array over K persona clusters
 */
export function softPersonaMembership(
  featureVector: number[],
  components:    GMMComponent[]
): number[] {
  if (components.length === 0) {
    return Array(3).fill(1 / 3);
  }
  const logWPDF = components.map(c =>
    Math.log(Math.max(c.weight, 1e-15)) +
    gaussianLogPDF(featureVector, c.mean, c.variance)
  );
  const logNorm = logSumExp(logWPDF);
  return logWPDF.map(lv => Math.exp(lv - logNorm));
}

// ─── Optimal K via Gap Statistic ─────────────────────────────────────────────

/**
 * Approximates the optimal number of clusters K using the Gap Statistic.
 *
 *   Gap(k) = (1/B) Σ_{b=1}^{B} log(W*_kb) − log(W_k)
 *
 * where W_k is the observed WCSS at K clusters and W*_kb is the WCSS
 * from B random uniform reference datasets.  The optimal K maximises
 * Gap(k) - Gap(k+1) + s_{k+1}, where s is the simulation standard error.
 *
 * Here we compute a lightweight version (B = 5 reference datasets) for
 * browser feasibility.
 *
 * @param data    Feature matrix [N × d]
 * @param maxK    Upper bound on K to evaluate (default 5)
 * @returns       Recommended optimal K
 */
export function optimalKGap(data: number[][], maxK = 5): number {
  if (data.length < maxK * 2) return Math.min(3, data.length);
  const n   = data.length;
  const dim = data[0].length;
  const B   = 5;

  // Compute column ranges for uniform reference data generation
  const mins = Array(dim).fill(Infinity);
  const maxs = Array(dim).fill(-Infinity);
  for (const x of data) {
    for (let d = 0; d < dim; d++) {
      mins[d] = Math.min(mins[d], x[d]);
      maxs[d] = Math.max(maxs[d], x[d]);
    }
  }

  const gaps: number[]   = [];
  const sims: number[][] = [];

  for (let k = 1; k <= maxK; k++) {
    const logWk = Math.log(Math.max(kMeans(data, k, 30).wcss, 1e-10));

    // Reference distribution log WCSS values
    const refLogs: number[] = [];
    for (let b = 0; b < B; b++) {
      const refData = Array.from({ length: n }, () =>
        Array.from({ length: dim }, (_, d) =>
          mins[d] + Math.random() * (maxs[d] - mins[d])
        )
      );
      refLogs.push(Math.log(Math.max(kMeans(refData, k, 30).wcss, 1e-10)));
    }

    const meanRefLog = refLogs.reduce((a, b) => a + b, 0) / B;
    gaps.push(meanRefLog - logWk);
    sims.push(refLogs);
  }

  // Find k* = smallest k where Gap(k) ≥ Gap(k+1) − s_{k+1}
  for (let k = 1; k < maxK; k++) {
    const simLogs = sims[k];
    const mean    = simLogs.reduce((a, b) => a + b, 0) / B;
    const std     = Math.sqrt(simLogs.reduce((s, v) => s + (v - mean) ** 2, 0) / B);
    const sk      = std * Math.sqrt(1 + 1 / B);
    if (gaps[k - 1] >= gaps[k] - sk) return k;
  }
  return maxK;
}
