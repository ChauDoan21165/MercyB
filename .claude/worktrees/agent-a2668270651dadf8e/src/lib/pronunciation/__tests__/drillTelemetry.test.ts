import { describe, expect, it } from "vitest";

import {
  computeBeforeAfter,
  newDrillSessionId,
} from "../drillTelemetry";

describe("computeBeforeAfter", () => {
  it("returns null deltas when fewer than 6 attempts (need 3 each side)", () => {
    expect(computeBeforeAfter([])).toEqual({
      before_avg: null,
      after_avg: null,
      delta: null,
    });
    expect(computeBeforeAfter([60, 70, 80, 90, 95]).delta).toBeNull();
  });

  it("computes before = first 3 mean, after = last 3 mean for a 6-score run", () => {
    // first 3 = 50,60,55 → avg 55
    // last 3  = 80,75,85 → avg 80
    // delta = 25
    const result = computeBeforeAfter([50, 60, 55, 80, 75, 85]);
    expect(result.before_avg).toBe(55);
    expect(result.after_avg).toBe(80);
    expect(result.delta).toBe(25);
  });

  it("rounds to integers (no floating-point leakage in the payload)", () => {
    const r = computeBeforeAfter([60, 70, 65, 80, 80, 80]);
    expect(Number.isInteger(r.before_avg ?? 0)).toBe(true);
    expect(Number.isInteger(r.after_avg ?? 0)).toBe(true);
    expect(Number.isInteger(r.delta ?? 0)).toBe(true);
  });

  it("treats non-finite scores as missing", () => {
    const r = computeBeforeAfter([NaN, 60, 70, 80, 90, 95]);
    // The valid run is [60,70,80,90,95] = 5 attempts → still below
    // the 6-attempt threshold, so before/after are null.
    expect(r.before_avg).toBeNull();
    expect(r.after_avg).toBeNull();
    expect(r.delta).toBeNull();
  });
});

describe("newDrillSessionId", () => {
  it("produces unique ids across calls", () => {
    const a = newDrillSessionId();
    const b = newDrillSessionId();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(8);
  });
});
