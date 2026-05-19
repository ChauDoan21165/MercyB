// supabase/functions/placement-session/engine/__tests__/thetaEstimator.test.ts
//
// Golden + property tests for the θ estimator (design §2.5, §6.3).
// Goldens are HAND-DERIVED from the 2PL model (D = 1.0, logistic metric)
// and cross-checked in comments. vitest owns this file (excluded from
// tsconfig.functions.json — same split as irt.test.ts).

import { describe, expect, it } from "vitest";

import type { ScoredItem } from "../irt";
import {
  estimate,
  estimateEAP,
  estimateMLE,
  priorMeanForSelfRating,
  seed,
} from "../thetaEstimator";

// Hand anchors.
const LN2 = Math.log(2); // 0.6931471805599453

// ---------------------------------------------------------------------------
// priorMeanForSelfRating — single source for μ₀ (config SELF_RATING_PRIOR_MEAN)
// ---------------------------------------------------------------------------
describe("priorMeanForSelfRating", () => {
  it("maps every SelfRating to the locked design §2.5 anchor", () => {
    expect(priorMeanForSelfRating("beginner")).toBe(-2.0); // A1
    expect(priorMeanForSelfRating("intermediate")).toBe(0.0); // B1
    expect(priorMeanForSelfRating("advanced")).toBe(2.0); // C1
    expect(priorMeanForSelfRating("not_sure")).toBe(-1.0); // A2 (conservative)
  });
});

// ---------------------------------------------------------------------------
// seed — n == 0 (design §2.5 step 1): posterior == prior
// ---------------------------------------------------------------------------
describe("seed", () => {
  it("returns μ₀ with SE = σ₀ (default 1.0), method 'seed', not converged", () => {
    expect(seed(0.5)).toEqual({
      theta: 0.5,
      se: 1.0,
      method: "seed",
      iterations: 0,
      converged: false,
    });
  });

  it("honors an explicit prior SD", () => {
    expect(seed(-2.0, 2.0).se).toBe(2.0);
  });

  it("seed SE is far above the SE_STOP (0.30) — a seeded session can't stop", () => {
    expect(seed(0).se).toBeGreaterThan(0.3);
  });
});

// ---------------------------------------------------------------------------
// estimateEAP — always finite working estimator (design §2.5)
// ---------------------------------------------------------------------------
describe("estimateEAP", () => {
  it("with no data the posterior collapses to the prior (θ̂≈μ₀, SE≈σ₀)", () => {
    const e = estimateEAP([], 0, 1);
    expect(e.theta).toBeCloseTo(0, 8);
    // Truncated standard normal on the ±4 grid: variance just under 1.
    expect(e.se).toBeGreaterThan(0.999);
    expect(e.se).toBeLessThan(1.0);
    expect(e.method).toBe("eap");
    expect(e.converged).toBe(true);
    expect(e.iterations).toBe(0);
  });

  it("empty-data θ̂ recovers μ₀, with the documented ±4-grid toward-center bias", () => {
    // The ±4 grid truncates the prior asymmetrically when μ₀ is off
    // centre, pulling θ̂ slightly toward 0 (|θ̂| ≤ |μ₀|, same sign). Bias
    // is < 0.06 logit for |μ₀| ≤ 2 — see the module's NUMERICAL NOTE.
    for (const mu of [0.5, 1.3, -1.0, -2.0, 2.0]) {
      const t = estimateEAP([], mu, 1).theta;
      expect(Math.abs(t - mu)).toBeLessThan(0.06); // deterministic, max ≈0.05
      expect(Math.sign(t)).toBe(Math.sign(mu)); // never crosses 0
      expect(Math.abs(t)).toBeLessThanOrEqual(Math.abs(mu)); // toward centre
    }
    expect(estimateEAP([], 0, 1).theta).toBeCloseTo(0, 10); // centred ⇒ exact
  });

  it("symmetry: one correct vs one wrong on the same item give ±θ̂", () => {
    const right = estimateEAP([{ a: 1, b: 0, u: 1 }], 0, 1).theta;
    const wrong = estimateEAP([{ a: 1, b: 0, u: 0 }], 0, 1).theta;
    expect(right).toBeGreaterThan(0);
    expect(wrong).toBeCloseTo(-right, 10); // exact mirror (symmetric prior)
  });

  it("a balanced correct/wrong pattern under a symmetric prior → θ̂ = 0", () => {
    const balanced: ScoredItem[] = [
      { a: 1, b: 0, u: 1 },
      { a: 1, b: 0, u: 0 },
    ];
    expect(estimateEAP(balanced, 0, 1).theta).toBeCloseTo(0, 10);
    // easy-correct + hard-wrong is also symmetric about 0.
    expect(
      estimateEAP([{ a: 1, b: -1, u: 1 }, { a: 1, b: 1, u: 0 }], 0, 1).theta,
    ).toBeCloseTo(0, 10);
  });

  it("is monotone increasing in #correct (fixed items, fixed prior)", () => {
    const mk = (correct: number): ScoredItem[] =>
      [0, 1, 2].map((i) => ({ a: 1, b: 0, u: (i < correct ? 1 : 0) as 0 | 1 }));
    const thetas = [0, 1, 2, 3].map((c) => estimateEAP(mk(c), 0, 1).theta);
    for (let i = 1; i < thetas.length; i++) {
      expect(thetas[i]).toBeGreaterThan(thetas[i - 1]);
    }
  });

  it("never diverges on an all-correct / all-wrong pattern (bounded by the grid)", () => {
    const allRight: ScoredItem[] = [-1, 0, 1].map((b) => ({ a: 1.5, b, u: 1 }));
    const allWrong: ScoredItem[] = [-1, 0, 1].map((b) => ({ a: 1.5, b, u: 0 }));
    const r = estimateEAP(allRight, 0, 1);
    const w = estimateEAP(allWrong, 0, 1);
    expect(Number.isFinite(r.theta)).toBe(true);
    expect(Number.isFinite(w.theta)).toBe(true);
    expect(r.theta).toBeGreaterThan(0);
    expect(r.theta).toBeLessThan(4); // EAP_GRID_MAX
    expect(w.theta).toBeLessThan(0);
    expect(w.theta).toBeGreaterThan(-4);
  });

  it("the prior pulls the estimate (same response, different μ₀)", () => {
    const lo = estimateEAP([{ a: 1, b: 0, u: 1 }], -2, 1).theta;
    const hi = estimateEAP([{ a: 1, b: 0, u: 1 }], 2, 1).theta;
    expect(hi).toBeGreaterThan(lo);
  });

  it("SE shrinks below the prior SD once informative items arrive", () => {
    const priorSe = estimateEAP([], 0, 1).se;
    const informed = estimateEAP(
      [{ a: 2, b: 0, u: 1 }, { a: 2, b: 0, u: 0 }],
      0,
      1,
    ).se;
    expect(informed).toBeLessThan(priorSe);
    expect(informed).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// estimateMLE — Newton–Raphson + extreme-pattern guard (design §2.5)
// ---------------------------------------------------------------------------
describe("estimateMLE", () => {
  it("extreme patterns / empty → not converged, 0 iters, θ = θ0 (caller uses EAP)", () => {
    for (const data of [
      [] as ScoredItem[],
      [{ a: 1, b: 0, u: 1 }, { a: 1, b: -1, u: 1 }], // all right
      [{ a: 1, b: 0, u: 0 }, { a: 1, b: 1, u: 0 }], // all wrong
    ]) {
      const e = estimateMLE(data, 0.42);
      expect(e.converged).toBe(false);
      expect(e.iterations).toBe(0);
      expect(e.theta).toBe(0.42);
      expect(e.se).toBe(Number.POSITIVE_INFINITY);
      expect(e.method).toBe("mle");
    }
  });

  it("golden: 2 correct + 1 wrong on a=1,b=0 ⇒ θ̂ = ln 2", () => {
    // L'(θ)=0 ⇒ Σ(u−P)=0 ⇒ 2−3P=0 ⇒ P=2/3 ⇒ θ = ln(P/(1−P)) = ln 2.
    const data: ScoredItem[] = [
      { a: 1, b: 0, u: 1 },
      { a: 1, b: 0, u: 1 },
      { a: 1, b: 0, u: 0 },
    ];
    const e = estimateMLE(data, 0);
    expect(e.converged).toBe(true);
    expect(e.theta).toBeCloseTo(LN2, 3);
    // I(θ̂) = Σ D²a²PQ = 3·(2/3)(1/3) ⇒ SE = 1/√I.
    expect(e.se).toBeCloseTo(1 / Math.sqrt(3 * (2 / 3) * (1 / 3)), 3);
    expect(e.iterations).toBeGreaterThanOrEqual(1);
  });

  it("golden: symmetric easy-right/hard-wrong ⇒ θ̂ = 0 (θ0 is the exact root)", () => {
    // At θ=0: a(u−P) = (1−σ(1)) + (0−σ(−1)) = 0.269 − 0.269 = 0.
    const e = estimateMLE([{ a: 1, b: -1, u: 1 }, { a: 1, b: 1, u: 0 }], 0);
    expect(e.theta).toBeCloseTo(0, 9);
    expect(e.converged).toBe(true);
  });

  it("step damping: a far warm start still converges to the same root", () => {
    const data: ScoredItem[] = [
      { a: 1, b: 0, u: 1 },
      { a: 1, b: 0, u: 1 },
      { a: 1, b: 0, u: 0 },
    ];
    const fromHi = estimateMLE(data, 4);
    const fromLo = estimateMLE(data, -4);
    expect(fromHi.theta).toBeCloseTo(LN2, 2);
    expect(fromLo.theta).toBeCloseTo(LN2, 2);
    expect(fromHi.converged).toBe(true);
    expect(fromLo.converged).toBe(true);
    expect(Math.abs(fromHi.theta)).toBeLessThanOrEqual(4); // THETA_CLAMP
  });

  it("bails to non-converged when the information is ~flat (tiny a)", () => {
    // −L'' = ΣD²a²PQ ≈ 1e-10·0.25 < MLE_FLAT_EPSILON (1e-9) ⇒ break.
    const e = estimateMLE(
      [{ a: 1e-5, b: -1, u: 1 }, { a: 1e-5, b: 1, u: 0 }],
      0,
    );
    expect(e.converged).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// estimate — orchestrator routing (design §2.5 step list, decision #2)
// ---------------------------------------------------------------------------
describe("estimate (orchestrator)", () => {
  it("n == 0 → seed from the prior mean", () => {
    const e = estimate([], { priorMean: -1.0 });
    expect(e).toEqual({
      theta: -1.0,
      se: 1.0,
      method: "seed",
      iterations: 0,
      converged: false,
    });
  });

  it("n == 0 honors an explicit prior SD in the seed", () => {
    expect(estimate([], { priorMean: 0, priorSd: 1.5 }).se).toBe(1.5);
  });

  it("all-correct (n≥1) → EAP reported (MLE undefined on extreme patterns)", () => {
    const e = estimate([{ a: 1, b: 0, u: 1 }, { a: 1, b: -1, u: 1 }], {
      priorMean: 0,
    });
    expect(e.method).toBe("eap");
    expect(e.converged).toBe(true);
    expect(Number.isFinite(e.theta)).toBe(true);
  });

  it("all-wrong → EAP reported", () => {
    expect(
      estimate([{ a: 1, b: 0, u: 0 }, { a: 1, b: 1, u: 0 }], { priorMean: 0 })
        .method,
    ).toBe("eap");
  });

  it("mixed + MLE converges → MLE reported, near the analytic root", () => {
    const e = estimate(
      [{ a: 1, b: 0, u: 1 }, { a: 1, b: 0, u: 1 }, { a: 1, b: 0, u: 0 }],
      { priorMean: 0 },
    );
    expect(e.method).toBe("mle");
    expect(e.converged).toBe(true);
    expect(e.theta).toBeCloseTo(LN2, 2); // warm-start agnostic
  });

  it("mixed but MLE can't converge (flat info) → EAP fallback", () => {
    const e = estimate(
      [{ a: 1e-5, b: -1, u: 1 }, { a: 1e-5, b: 1, u: 0 }],
      { priorMean: 0 },
    );
    expect(e.method).toBe("eap");
    expect(e.converged).toBe(true);
  });

  it("reported θ is monotone increasing in #correct (end-to-end)", () => {
    const mk = (correct: number): ScoredItem[] =>
      [0, 1, 2, 3, 4].map((i) => ({
        a: 1,
        b: 0,
        u: (i < correct ? 1 : 0) as 0 | 1,
      }));
    // 1..4 correct of 5 → every pattern mixed.
    const thetas = [1, 2, 3, 4].map(
      (c) => estimate(mk(c), { priorMean: 0 }).theta,
    );
    for (let i = 1; i < thetas.length; i++) {
      expect(thetas[i]).toBeGreaterThan(thetas[i - 1]);
    }
  });

  it("MLE ≈ EAP for a long mixed pattern (design §6.3 consistency)", () => {
    // 20 items a=1.2 spread over b∈[-2,2], alternating right/wrong.
    const data: ScoredItem[] = Array.from({ length: 20 }, (_, i) => ({
      a: 1.2,
      b: -2 + (4 * i) / 19,
      u: (i % 2) as 0 | 1,
    }));
    const reported = estimate(data, { priorMean: 0 });
    const eapOnly = estimateEAP(data, 0, 1);
    expect(reported.method).toBe("mle");
    expect(reported.theta).toBeCloseTo(eapOnly.theta, 1); // within ~0.1 logit
  });
});
