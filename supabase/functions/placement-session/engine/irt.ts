// supabase/functions/placement-session/engine/irt.ts
//
// Placement Test v2 — 2PL IRT math core (Phase 2, PR 2).
//
// Implements: sequence-doc PR 2 "2PL IRT math core"; design §2.4 (the
// five formulas) verbatim. Locked decision #2 leans on this: EAP/MLE
// (PR 3) consume `scoreFn`/`infoFn`/`logLikelihood` from here.
//
// This is "the heart" (design §2.2/§2.4): a PURE numeric kernel. It takes
// minimal structural inputs ({a,b} and {a,b,u}), NOT Item/Response —
// mapping the bank/session shapes into these arrays is the estimator's
// job (PR 3+), keeping this module dependency-free and trivially
// golden-testable. The ONLY import is the default scaling constant `D`
// from config (design §2.7: no magic numbers scattered in logic).
//
// Notation: Baker & Kim (2017). D = scaling constant (design §2.4
// decision: D = 1.0, logistic metric — never mixed with 1.702).

import { D as DEFAULT_D } from "../config.ts";

/** One administered item's IRT parameters. `a` = discrimination (>0),
 *  `b` = difficulty on the θ logit scale. */
export interface ItemParams {
  a: number;
  b: number;
}

/** An answered item: its params plus the dichotomous outcome
 *  (`u` = 1 correct, 0 incorrect). Drives the likelihood/derivatives. */
export interface ScoredItem extends ItemParams {
  u: 0 | 1;
}

/** Clamp probabilities away from {0,1} before any log so logLikelihood
 *  stays finite on extreme θ (standard numeric guard; the extreme-pattern
 *  *estimation* problem is handled in thetaEstimator, PR 3). */
const P_EPS = 1e-12;

/**
 * 2PL item response function (design §2.4):
 *
 *                 1
 *   P_i(θ) = ─────────────────────────
 *             1 + e^( -D·a·(θ - b) )
 *
 * Monotone increasing in θ; P(θ=b) = 0.5; antisymmetric about b.
 */
export function prob2PL(
  theta: number,
  a: number,
  b: number,
  D: number = DEFAULT_D,
): number {
  return 1 / (1 + Math.exp(-D * a * (theta - b)));
}

/**
 * Fisher item information (design §2.4):
 *
 *   I_i(θ) = D² · a² · P_i(θ) · Q_i(θ)        Q = 1 − P
 *
 * Maximal at θ = b; scales with a². This is why adaptive selection
 * (PR 5) beats a fixed quiz — each item is chosen where it is most
 * informative for THIS learner.
 */
export function itemInformation(
  theta: number,
  a: number,
  b: number,
  D: number = DEFAULT_D,
): number {
  const p = prob2PL(theta, a, b, D);
  return D * D * a * a * p * (1 - p);
}

/**
 * Test information at θ over the administered items (design §2.4):
 *
 *   I(θ) = Σ_j I_j(θ)
 *
 * Fisher information depends only on item params + θ (NOT on the
 * responses), so this takes `{a,b}` — the response-bearing twin is
 * `infoFn` below (numerically identical for 2PL; both exposed because
 * design §2.4 lists them separately and Newton–Raphson pairs
 * scoreFn/infoFn).
 */
export function testInformation(
  theta: number,
  items: ReadonlyArray<ItemParams>,
  D: number = DEFAULT_D,
): number {
  let sum = 0;
  for (const it of items) sum += itemInformation(theta, it.a, it.b, D);
  return sum;
}

/**
 * Standard error of the θ estimate (design §2.4):
 *
 *   SE(θ) = 1 / √( I(θ) )
 *
 * Returns +Infinity when information is 0 (no items / degenerate), so
 * callers see "infinitely uncertain" rather than a divide-by-zero NaN.
 */
export function seFromInformation(information: number): number {
  if (!(information > 0)) return Number.POSITIVE_INFINITY;
  return 1 / Math.sqrt(information);
}

/**
 * Log-likelihood of a response vector (design §2.4):
 *
 *   ln L(θ|u) = Σ_j [ u_j·ln P_j(θ) + (1−u_j)·ln Q_j(θ) ]
 */
export function logLikelihood(
  theta: number,
  data: ReadonlyArray<ScoredItem>,
  D: number = DEFAULT_D,
): number {
  let ll = 0;
  for (const it of data) {
    const pRaw = prob2PL(theta, it.a, it.b, D);
    const p = Math.min(1 - P_EPS, Math.max(P_EPS, pRaw));
    ll += it.u === 1 ? Math.log(p) : Math.log(1 - p);
  }
  return ll;
}

/**
 * Score function — 1st derivative of the log-likelihood (design §2.4):
 *
 *   L'(θ) = D · Σ_j a_j · ( u_j − P_j(θ) )
 *
 * Newton–Raphson (PR 3) drives θ to where this is 0.
 */
export function scoreFn(
  theta: number,
  data: ReadonlyArray<ScoredItem>,
  D: number = DEFAULT_D,
): number {
  let s = 0;
  for (const it of data) s += it.a * (it.u - prob2PL(theta, it.a, it.b, D));
  return D * s;
}

/**
 * Observed information — negative 2nd derivative of the log-likelihood
 * (design §2.4); for the 2PL this equals the expected (Fisher)
 * information:
 *
 *   −L''(θ) = D² · Σ_j a_j² · P_j(θ) · Q_j(θ)  =  I(θ)
 *
 * Exposed as the response-paired twin of `scoreFn` so the Newton step
 * Δ = L'/(−L'') (PR 3) reads straight off these two. `u` is irrelevant
 * to the 2PL second derivative — accepted only so callers can pass the
 * same `ScoredItem[]` they pass to `scoreFn`.
 */
export function infoFn(
  theta: number,
  data: ReadonlyArray<ScoredItem>,
  D: number = DEFAULT_D,
): number {
  let sum = 0;
  for (const it of data) sum += itemInformation(theta, it.a, it.b, D);
  return sum;
}
