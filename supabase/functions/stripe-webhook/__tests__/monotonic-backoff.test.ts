import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  MONOTONIC_BACKOFF_BASE_MS,
  MONOTONIC_BACKOFF_CAP_MS,
  monotonicBackoffDelayMs,
} from "../monotonic-backoff.ts";

// A91 fix A — exponential backoff + full jitter on the monotonic CAS retry
// loop. These tests cover the pure backoff *shape* (step 6) and a source-
// contract regression that the 8-retry exhaustion path is unchanged (step
// 7). The live CAS loop is intentionally NOT driven here: it needs the
// esm.sh/Deno module graph + an invasive DB mock, which the brief excludes.

/** Ceiling of the k-th backoff window (the exponential envelope). */
const expectedCeiling = (retry: number) =>
  Math.min(MONOTONIC_BACKOFF_CAP_MS, MONOTONIC_BACKOFF_BASE_MS * 2 ** retry);

describe("monotonicBackoffDelayMs — full-jitter exponential shape", () => {
  it("documents the ceiling envelope: 25 → 50 → 100 → 200 → 400 → 800 → 800", () => {
    expect([0, 1, 2, 3, 4, 5, 6].map(expectedCeiling)).toEqual([
      25, 50, 100, 200, 400, 800, 800,
    ]);
  });

  it("random()=0 yields a 0ms sleep at every retry (lower bound of full jitter)", () => {
    for (let retry = 0; retry < 12; retry++) {
      expect(monotonicBackoffDelayMs(retry, () => 0)).toBe(0);
    }
  });

  it("draws strictly inside [0, ceiling) — never reaches or exceeds the ceiling", () => {
    // random() → just under 1 is the worst case the floor can produce.
    for (let retry = 0; retry < 12; retry++) {
      const ceiling = expectedCeiling(retry);
      const hi = monotonicBackoffDelayMs(retry, () => 0.999999);
      expect(hi).toBeGreaterThanOrEqual(0);
      expect(hi).toBeLessThan(ceiling);
      expect(Number.isInteger(hi)).toBe(true);
    }
  });

  it("ceilings double per retry until the 800ms cap, then stay flat", () => {
    // retries 0..5 double; 6+ are capped at the 800ms ceiling forever.
    const mid = () => 0.5;
    expect(monotonicBackoffDelayMs(0, mid)).toBe(12); // floor(0.5*25)
    expect(monotonicBackoffDelayMs(1, mid)).toBe(25); // floor(0.5*50)
    expect(monotonicBackoffDelayMs(2, mid)).toBe(50); // floor(0.5*100)
    expect(monotonicBackoffDelayMs(5, mid)).toBe(400); // floor(0.5*800)
    expect(monotonicBackoffDelayMs(6, mid)).toBe(400); // capped: floor(0.5*800)
    expect(monotonicBackoffDelayMs(99, mid)).toBe(400); // still capped
  });

  it("every draw is bounded by the 800ms hard cap regardless of retry depth", () => {
    for (let retry = 0; retry < 50; retry++) {
      expect(monotonicBackoffDelayMs(retry, () => 0.999999)).toBeLessThan(
        MONOTONIC_BACKOFF_CAP_MS,
      );
    }
  });

  it("clamps negative / fractional retry indices to retry 0 (defensive)", () => {
    const hi = () => 0.999999;
    expect(monotonicBackoffDelayMs(-3, hi)).toBe(
      monotonicBackoffDelayMs(0, hi),
    );
    expect(monotonicBackoffDelayMs(0.9, hi)).toBe(
      monotonicBackoffDelayMs(0, hi),
    );
  });

  it("real-loop budget: 7 sleeps for an 8-attempt loop, worst case ≈ 2.4s", () => {
    // The loop sleeps before attempts 1..7 → retries 0..6. Sum of ceilings
    // bounds the total added latency on a fully-contended path.
    const worstCaseCeilingSum = [0, 1, 2, 3, 4, 5, 6]
      .map(expectedCeiling)
      .reduce((a, b) => a + b, 0);
    expect(worstCaseCeilingSum).toBe(2375); // 25+50+100+200+400+800+800
  });
});

describe("regression: monotonic CAS exhaustion path is unchanged (A91 'Do NOT')", () => {
  // Resolved from the repo root (vitest's cwd in local + CI runs) rather
  // than import.meta.url, which vitest does not expose as a file:// URL.
  const billingSource = readFileSync(
    resolve(process.cwd(), "supabase/functions/stripe-webhook/billing.ts"),
    "utf8",
  );

  it("retry budget constant is still exactly 8 (A91: do not lower it)", () => {
    expect(billingSource).toContain("const MAX_MONOTONIC_RETRIES = 8;");
  });

  it("loop bound still gated by MAX_MONOTONIC_RETRIES (no extra/fewer iterations)", () => {
    expect(billingSource).toMatch(
      /for \(let attempt = 0; attempt < MAX_MONOTONIC_RETRIES; attempt\+\+\)/,
    );
  });

  it("backoff is gated `if (attempt > 0)` so attempt 0 never sleeps and the iteration count is untouched", () => {
    expect(billingSource).toMatch(
      /if \(attempt > 0\) \{\s*await sleep\(monotonicBackoffDelayMs\(attempt - 1\)\);\s*\}/,
    );
  });

  it("post-exhaustion throw message is byte-for-byte unchanged", () => {
    expect(billingSource).toContain(
      '"Failed to apply monotonic Stripe subscription update after concurrent modifications"',
    );
  });

  it("the ~20-column CAS WHERE (applyExactFilter) was not touched by this change", () => {
    // Spot-check the CAS guard is still present and dense; A91 explicitly
    // scoped narrowing it to a later fix (recommendation C), not fix A.
    const occurrences = billingSource.match(/applyExactFilter\(/g) ?? [];
    expect(occurrences.length).toBeGreaterThan(10);
  });
});
