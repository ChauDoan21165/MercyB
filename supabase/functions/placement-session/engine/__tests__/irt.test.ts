// supabase/functions/placement-session/engine/__tests__/irt.test.ts
//
// Golden-value + property tests for the 2PL IRT core (design §6.1).
// Expected numbers are HAND-COMPUTED from the design §2.4 formulas with
// D = 1.0 (logistic metric), cross-checked here in comments. vitest owns
// this file (excluded from tsconfig.functions.json — the engine gate
// type-checks production code, vitest transpiles + runs tests).

import { describe, it, expect } from "vitest";

import {
  prob2PL,
  itemInformation,
  testInformation,
  seFromInformation,
  logLikelihood,
  scoreFn,
  infoFn,
  type ScoredItem,
} from "../irt";

// sigmoid(1) = 1/(1+e^-1)
const P_AT_1 = 0.731058578630005;
const LN_HALF = Math.log(0.5); // -0.6931471805599453

describe("prob2PL — 2PL item response function", () => {
  it("P(θ=b) = 0.5 exactly (any a, D)", () => {
    expect(prob2PL(0, 1, 0)).toBe(0.5);
    expect(prob2PL(2.3, 1.7, 2.3)).toBeCloseTo(0.5, 12);
    expect(prob2PL(-1, 0.8, -1, 1.702)).toBeCloseTo(0.5, 12);
  });

  it("matches the hand-computed sigmoid at θ−b = 1", () => {
    expect(prob2PL(1, 1, 0)).toBeCloseTo(P_AT_1, 12); // 0.73105857863
    expect(prob2PL(-1, 1, 0)).toBeCloseTo(1 - P_AT_1, 12); // antisymmetry
  });

  it("is monotone increasing in θ", () => {
    const xs = [-3, -1, -0.2, 0, 0.5, 1, 3].map((t) => prob2PL(t, 1.2, 0.3));
    for (let i = 1; i < xs.length; i++) expect(xs[i]).toBeGreaterThan(xs[i - 1]);
  });

  it("is antisymmetric about b: P(b+x) + P(b−x) = 1", () => {
    const b = 0.4;
    for (const x of [0.1, 1, 2.5]) {
      expect(prob2PL(b + x, 1.3, b) + prob2PL(b - x, 1.3, b)).toBeCloseTo(1, 12);
    }
  });

  it("higher D steepens the curve (θ>b ⇒ larger P)", () => {
    expect(prob2PL(1, 1, 0, 1.702)).toBeGreaterThan(prob2PL(1, 1, 0, 1.0));
  });
});

describe("itemInformation — Fisher info", () => {
  it("equals D²·a²·P·Q (hand values)", () => {
    expect(itemInformation(0, 1, 0)).toBeCloseTo(0.25, 12); // 1·1·.5·.5
    // θ=1,a=1,b=0: P=.73105857863, Q=.26894142137 → .196611933
    expect(itemInformation(1, 1, 0)).toBeCloseTo(0.19661193324, 10);
  });

  it("peaks at θ = b", () => {
    const atB = itemInformation(0.5, 1.4, 0.5);
    expect(atB).toBeGreaterThan(itemInformation(1.5, 1.4, 0.5));
    expect(atB).toBeGreaterThan(itemInformation(-0.5, 1.4, 0.5));
  });

  it("scales with a² (double a ⇒ ×4 at θ=b)", () => {
    expect(itemInformation(0, 2, 0)).toBeCloseTo(4 * itemInformation(0, 1, 0), 12);
    expect(itemInformation(0, 2, 0)).toBeCloseTo(1.0, 12); // 1·4·.25
  });

  it("scales with D² (double D ⇒ ×4 at θ=b)", () => {
    expect(itemInformation(0, 1, 0, 2)).toBeCloseTo(4 * itemInformation(0, 1, 0, 1), 12);
  });
});

describe("testInformation / seFromInformation", () => {
  it("sums item information", () => {
    // {a:1,b:0}=.25  +  {a:2,b:0}=1.0  = 1.25  at θ=0
    expect(testInformation(0, [{ a: 1, b: 0 }, { a: 2, b: 0 }])).toBeCloseTo(1.25, 12);
    expect(testInformation(0, [])).toBe(0);
  });

  it("SE = 1/√I, +∞ when I ≤ 0", () => {
    expect(seFromInformation(0.25)).toBe(2);
    expect(seFromInformation(1)).toBe(1);
    expect(seFromInformation(4)).toBe(0.5);
    expect(seFromInformation(0)).toBe(Number.POSITIVE_INFINITY);
    expect(seFromInformation(-1)).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("logLikelihood", () => {
  it("single item at θ=b: ln(0.5) regardless of u", () => {
    expect(logLikelihood(0, [{ a: 1, b: 0, u: 1 }])).toBeCloseTo(LN_HALF, 12);
    expect(logLikelihood(0, [{ a: 1, b: 0, u: 0 }])).toBeCloseTo(LN_HALF, 12);
  });

  it("balanced 1-right/1-wrong at θ=0 ⇒ 2·ln(0.5)", () => {
    const data: ScoredItem[] = [
      { a: 1, b: 0, u: 1 },
      { a: 1, b: 0, u: 0 },
    ];
    expect(logLikelihood(0, data)).toBeCloseTo(2 * LN_HALF, 12);
  });

  it("correct answer to an easy item ⇒ ll = ln(P) = −ln(1+e⁻¹)", () => {
    expect(logLikelihood(1, [{ a: 1, b: 0, u: 1 }])).toBeCloseTo(
      -Math.log(1 + Math.exp(-1)),
      12,
    ); // ≈ -0.31326168752
  });

  it("stays finite on an extreme mismatch (no -Infinity)", () => {
    const ll = logLikelihood(-50, [{ a: 2.5, b: 0, u: 1 }]);
    expect(Number.isFinite(ll)).toBe(true);
  });
});

describe("scoreFn (L') and infoFn (−L'')", () => {
  it("scoreFn hand values", () => {
    expect(scoreFn(0, [{ a: 1, b: 0, u: 1 }])).toBeCloseTo(0.5, 12); // 1·(1−.5)
    expect(scoreFn(0, [{ a: 1, b: 0, u: 0 }])).toBeCloseTo(-0.5, 12);
    expect(scoreFn(0, [{ a: 2, b: 0, u: 1 }])).toBeCloseTo(1.0, 12); // 2·(1−.5)
  });

  it("scoreFn = 0 at the MLE of a symmetric 1-right/1-wrong pair (θ=0)", () => {
    const data: ScoredItem[] = [
      { a: 1, b: 0, u: 1 },
      { a: 1, b: 0, u: 0 },
    ];
    expect(scoreFn(0, data)).toBeCloseTo(0, 12);
  });

  it("infoFn equals testInformation over the same params, and > 0", () => {
    const data: ScoredItem[] = [
      { a: 1, b: 0, u: 1 },
      { a: 1, b: 0, u: 0 },
    ];
    expect(infoFn(0, data)).toBeCloseTo(0.5, 12); // .25 + .25
    expect(infoFn(0, data)).toBeCloseTo(
      testInformation(0, data.map(({ a, b }) => ({ a, b }))),
      12,
    );
    expect(infoFn(0, data)).toBeGreaterThan(0);
  });

  it("Newton step L'/(−L'') is well-formed on a mixed pattern", () => {
    const data: ScoredItem[] = [
      { a: 1.2, b: -0.5, u: 1 },
      { a: 0.9, b: 0.8, u: 0 },
      { a: 1.5, b: 0.0, u: 1 },
    ];
    const lp = scoreFn(0, data);
    const lpp = infoFn(0, data);
    expect(lpp).toBeGreaterThan(0);
    expect(Number.isFinite(lp / lpp)).toBe(true);
  });
});
