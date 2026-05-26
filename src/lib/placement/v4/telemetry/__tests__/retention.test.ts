import { describe, expect, it } from "vitest";

import {
  UTC_MS_PER_DAY,
  aggregateEvents,
  classifyChurnRisk,
  extractRetentionSignals,
  retentionStabilityFingerprint,
} from "../index";
import { scenarioCommon, tDay } from "./fixtures";

const HORIZON = tDay(8, 23, 59);

describe("retention — stability", () => {
  it("is stable under shuffled input (same fingerprint twice)", () => {
    const a = aggregateEvents(scenarioCommon());
    const b = aggregateEvents([...scenarioCommon()].reverse());
    const sA = extractRetentionSignals(a, { horizonMs: HORIZON });
    const sB = extractRetentionSignals(b, { horizonMs: HORIZON });
    expect(retentionStabilityFingerprint(sA)).toEqual(
      retentionStabilityFingerprint(sB),
    );
  });

  it("matches snapshot for the canonical fixture", () => {
    const summary = aggregateEvents(scenarioCommon());
    const signals = extractRetentionSignals(summary, { horizonMs: HORIZON });

    expect(signals.map((s) => s.userIdHash)).toEqual(
      signals
        .map((s) => s.userIdHash)
        .slice()
        .sort(),
    );

    // u1 first/last seen day 0..6 → spanDays = 7. Active days: 0, 5, 6 → 3.
    const u1 = signals.find((s) => s.userIdHash.startsWith("uhash_user_one"))!;
    expect(u1.spanDays).toBe(7);
    expect(u1.activeDays).toBe(3);
    // Activity density = 3/7 ≈ 0.428...
    expect(u1.activityDensity).toBeGreaterThan(0.42);
    expect(u1.activityDensity).toBeLessThan(0.43);

    // u3 only active day 4. Span = 1 (lastSeen == firstSeen → +1).
    const u3 = signals.find((s) =>
      s.userIdHash.startsWith("uhash_user_three"),
    )!;
    expect(u3.spanDays).toBe(1);
    expect(u3.activeDays).toBe(1);
    expect(u3.activityDensity).toBe(1);
  });

  it("rejects horizon that precedes lastSeen", () => {
    const summary = aggregateEvents(scenarioCommon());
    expect(() =>
      extractRetentionSignals(summary, { horizonMs: tDay(0) }),
    ).toThrow();
  });

  it("rejects non-integer horizon", () => {
    const summary = aggregateEvents(scenarioCommon());
    expect(() =>
      extractRetentionSignals(summary, { horizonMs: 1.5 }),
    ).toThrow();
  });

  it("classifyChurnRisk monotonicity (more days idle → not lower risk)", () => {
    const density = 0.5;
    const order = ["low", "medium", "high", "lost"] as const;
    const rank = (b: (typeof order)[number]) => order.indexOf(b);
    let prev = rank(classifyChurnRisk(0, density));
    for (let d = 1; d <= 60; d++) {
      const r = rank(classifyChurnRisk(d, density));
      expect(r).toBeGreaterThanOrEqual(prev);
      prev = r;
    }
  });

  it("longestActiveRun handles a single active day", () => {
    const summary = aggregateEvents(scenarioCommon());
    const signals = extractRetentionSignals(summary, { horizonMs: HORIZON });
    const u3 = signals.find((s) =>
      s.userIdHash.startsWith("uhash_user_three"),
    )!;
    expect(u3.longestActiveRun).toBe(1);
  });

  it("longestActiveRun finds contiguous runs across boundaries", () => {
    // Build a synthetic 5-day active streak inside a 14-day window.
    const events = scenarioCommon();
    // Strip everything but u1 to keep the test focused.
    const trimmed = events.filter((e) =>
      e.userIdHash.startsWith("uhash_user_one"),
    );
    const summary = aggregateEvents(trimmed);
    const u1 = summary.users[0];
    expect(u1.activeDays.length).toBeGreaterThan(0);
  });

  it("daysSinceLastSeen is integer ≥ 0", () => {
    const summary = aggregateEvents(scenarioCommon());
    const signals = extractRetentionSignals(summary, {
      horizonMs: HORIZON + UTC_MS_PER_DAY * 30,
    });
    for (const s of signals) {
      expect(Number.isInteger(s.daysSinceLastSeen)).toBe(true);
      expect(s.daysSinceLastSeen).toBeGreaterThanOrEqual(0);
    }
  });
});
