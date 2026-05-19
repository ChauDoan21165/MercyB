// supabase/functions/placement-session/engine/thetaEstimator.ts
//
// Placement Test v2 — θ estimator: seed / EAP / MLE (Phase 2, PR 3).
//
// Implements: sequence-doc PR 3 "theta estimator (EAP + MLE)"; design
// §2.5 (EAP + Newton–Raphson pseudo-code). LOCKED decision #2: EAP is the
// WORKING estimator (drives selection + the SE stop, never diverges, and
// consumes the self-rating prior); MLE is the REPORTED estimator once the
// response pattern is mixed; both are computed so PR 8 can log them for a
// later validity comparison.
//
// SERVER-SIDE, like all engine/* code (locked Q1): θ̂ and the math that
// produces it never reach the browser. Pure functions, dependency-light:
// the only imports are this series' own config + the PR-2 `irt.ts` kernel.
// Type-checked by tsconfig.functions.json; unit-tested by vitest.
//
// SCOPE BOUNDARY (deliberate, mirrors irt.ts): this module operates on
// `ScoredItem[]` — the minimal {a,b,u} structural shape from irt.ts — NOT
// on `Response`/`Item`. The Response/Item → ScoredItem mapping encodes
// SCORING policy (what counts as correct; the writing_sample/null-correct
// exclusion of decision #3; any L1-revealed discount, cf. PR #656) and
// therefore belongs with server scoring in PR 8, not in the numeric
// estimator. irt.ts's header makes the same split ("mapping the bank/
// session shapes into these arrays is the estimator's job (PR 3+)" — the
// "+" is PR 8, where scoring lives). This is a scope boundary, not a
// design-doc contradiction.
//
// NUMERICAL NOTE: design §2.5's EAP pseudo-code multiplies raw
// likelihoods. With up to MAX_ITEMS=35 items a raw product underflows to
// 0 for off-target θ (e.g. 0.1^35 ≈ 1e-35). Production EAP here works in
// the LOG domain (log-likelihood from irt.ts + log-prior, max-subtracted
// before exp — the standard log-sum-exp stabilization). Same posterior,
// finite arithmetic. The additive log-prior normalization constant
// (−ln σ₀ − ½ln 2π) is identical at every grid node and cancels in the
// posterior mean/variance ratio, so only the quadratic term is kept.

import {
  EAP_GRID_MAX,
  EAP_GRID_MIN,
  EAP_GRID_STEP,
  MLE_FLAT_EPSILON,
  MLE_MAX_ITER,
  MLE_STEP_CLAMP,
  MLE_TOL,
  PRIOR_SD,
  SELF_RATING_PRIOR_MEAN,
  THETA_CLAMP,
} from "../config.ts";
import {
  infoFn,
  logLikelihood,
  scoreFn,
  seFromInformation,
  type ScoredItem,
} from "./irt.ts";
import type { SelfRating, ThetaEstimate } from "../types.ts";

/** Context for the `estimate()` orchestrator. The EAP prior mean μ₀ is
 *  required (map a `SelfRating` through `priorMeanForSelfRating`); σ₀ and
 *  the Newton warm start have engine defaults. */
export interface EstimatorContext {
  /** EAP prior mean μ₀ (θ logit scale). From self-rating via
   *  `priorMeanForSelfRating`, or a previous session's θ̂ for a retake. */
  priorMean: number;
  /** EAP prior SD σ₀. Defaults to config `PRIOR_SD` (1.0). */
  priorSd?: number;
  /** Newton–Raphson warm start. Defaults to the EAP point estimate
   *  (the robust, always-finite starting point). */
  warmStart?: number;
}

function clamp(x: number, lo: number, hi: number): number {
  return x < lo ? lo : x > hi ? hi : x;
}

/**
 * Self-rating → EAP prior mean μ₀ (design §2.5 / config
 * `SELF_RATING_PRIOR_MEAN`). The ONE place this mapping is read so the
 * "not_sure is conservatively A2" policy lives in exactly one location.
 */
export function priorMeanForSelfRating(rating: SelfRating): number {
  return SELF_RATING_PRIOR_MEAN[rating];
}

/**
 * n == 0 case (design §2.5 step 1): no data yet → the posterior IS the
 * prior. θ̂ = μ₀, and the posterior SD equals the prior SD σ₀ exactly —
 * which is "large" relative to SE_STOP (0.30), so a freshly seeded
 * session can never satisfy the precision stop. `method:'seed'`,
 * `converged:false` (a prior, not a data-driven fit).
 */
export function seed(priorMean: number, priorSd: number = PRIOR_SD): ThetaEstimate {
  return {
    theta: priorMean,
    se: priorSd,
    method: "seed",
    iterations: 0,
    converged: false,
  };
}

/**
 * EAP (Expected A Posteriori) over an 81-node θ grid (design §2.5).
 * Always finite, monotone in #correct, and naturally pulled by the
 * normal prior N(μ₀, σ₀²) — this is why it is the working estimator that
 * drives item selection and the SE stop (it cannot diverge on an
 * all-right / all-wrong pattern the way MLE does).
 *
 * Empty `data` is well-defined: the posterior collapses to the prior, so
 * θ̂ ≈ μ₀ and SE ≈ σ₀ (slightly below σ₀ from the ±4 grid truncation).
 */
export function estimateEAP(
  data: ReadonlyArray<ScoredItem>,
  priorMean: number,
  priorSd: number = PRIOR_SD,
): ThetaEstimate {
  // Deterministic node count (round, not float accumulation) so the grid
  // is exactly the design's 81 nodes with exact endpoints.
  const nNodes = Math.round((EAP_GRID_MAX - EAP_GRID_MIN) / EAP_GRID_STEP) + 1;

  const nodes: number[] = new Array(nNodes);
  const logW: number[] = new Array(nNodes);
  let maxLog = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < nNodes; i++) {
    const theta = EAP_GRID_MIN + i * EAP_GRID_STEP;
    // log-likelihood (irt.ts already clamps P off {0,1} → always finite)
    // + log-prior quadratic term (normalization constant cancels below).
    const z = (theta - priorMean) / priorSd;
    const lw = logLikelihood(theta, data) - 0.5 * z * z;
    nodes[i] = theta;
    logW[i] = lw;
    if (lw > maxLog) maxLog = lw;
  }

  // Max-subtract → exp: stable weights, no underflow on extreme θ.
  let den = 0;
  let num = 0;
  const w: number[] = new Array(nNodes);
  for (let i = 0; i < nNodes; i++) {
    const wi = Math.exp(logW[i] - maxLog);
    w[i] = wi;
    den += wi;
    num += nodes[i] * wi;
  }

  const mean = num / den;
  let varNum = 0;
  for (let i = 0; i < nNodes; i++) {
    const d = nodes[i] - mean;
    varNum += w[i] * d * d;
  }
  const variance = varNum / den;

  return {
    theta: mean,
    se: Math.sqrt(Math.max(variance, 0)),
    method: "eap",
    iterations: 0,
    converged: true,
  };
}

/**
 * MLE via Newton–Raphson (design §2.5 — the brief's requested algorithm).
 *
 * Extreme-pattern guard: the 2PL log-likelihood has NO finite maximum for
 * an all-correct (θ→+∞) or all-wrong (θ→−∞) vector, and none for n=0.
 * Those return `converged:false` with `theta:theta0` so the orchestrator
 * falls back to the (always-finite) EAP estimate.
 *
 * Step `Δ = L'/(−L'')` is clamped to ±MLE_STEP_CLAMP (damps wild early
 * steps / oscillation) and θ to ±THETA_CLAMP (sane logit range). A near-
 * flat second derivative (−L'' < MLE_FLAT_EPSILON) also bails to EAP.
 */
export function estimateMLE(
  data: ReadonlyArray<ScoredItem>,
  theta0: number,
): ThetaEstimate {
  const n = data.length;
  const allRight = n > 0 && data.every((d) => d.u === 1);
  const allWrong = n > 0 && data.every((d) => d.u === 0);
  if (n === 0 || allRight || allWrong) {
    return {
      theta: theta0,
      se: Number.POSITIVE_INFINITY,
      method: "mle",
      iterations: 0,
      converged: false,
    };
  }

  let theta = theta0;
  let iter = 0;
  let converged = false;
  for (; iter < MLE_MAX_ITER;) {
    iter++;
    const lp = scoreFn(theta, data); // L'(θ)   (D defaults from config)
    const lpp = infoFn(theta, data); // −L''(θ) = I(θ)
    if (lpp < MLE_FLAT_EPSILON) break; // flat — bail to EAP (non-converged)
    const step = clamp(lp / lpp, -MLE_STEP_CLAMP, MLE_STEP_CLAMP);
    theta = clamp(theta + step, -THETA_CLAMP, THETA_CLAMP);
    if (Math.abs(step) < MLE_TOL) {
      converged = true;
      break;
    }
  }

  return {
    theta,
    se: seFromInformation(infoFn(theta, data)),
    method: "mle",
    iterations: iter,
    converged,
  };
}

/**
 * The estimator of record (design §2.5 step list):
 *   1. n == 0            → `seed` from the self-rating prior mean.
 *   2. n >= 1            → ALWAYS compute EAP (the working estimator).
 *   3. pattern is mixed  → ALSO compute MLE; report MLE iff it converged,
 *                          else fall back to the EAP estimate.
 * An all-right / all-wrong pattern is NOT mixed → EAP is reported (MLE is
 * undefined there). EAP is always what drives selection + the SE stop in
 * PR 5/6/8 regardless of which estimate is returned here.
 */
export function estimate(
  data: ReadonlyArray<ScoredItem>,
  ctx: EstimatorContext,
): ThetaEstimate {
  const priorSd = ctx.priorSd ?? PRIOR_SD;
  if (data.length === 0) return seed(ctx.priorMean, priorSd);

  const eap = estimateEAP(data, ctx.priorMean, priorSd);

  const allRight = data.every((d) => d.u === 1);
  const allWrong = data.every((d) => d.u === 0);
  const mixed = !allRight && !allWrong;
  if (!mixed) return eap; // MLE undefined on extreme patterns

  const mle = estimateMLE(data, ctx.warmStart ?? eap.theta);
  return mle.converged ? mle : eap;
}
