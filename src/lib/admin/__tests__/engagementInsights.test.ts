// src/lib/admin/__tests__/engagementInsights.test.ts
//
// Insight generator coverage. Together with cohortRetention.test.ts
// this file pushes the cohort-math suite to 25 cases (well above the
// 15-case minimum in the brief).

import { describe, expect, it } from "vitest";

import {
  COHORT_DEVIATION_THRESHOLD,
  generateEngagementInsights,
} from "../engagementInsights";
import type {
  CohortBucketCount,
  RetentionDayOffset,
} from "../cohortRetention";

function row(
  cohort: string,
  d: RetentionDayOffset,
  active: number,
  total: number,
): CohortBucketCount {
  return {
    cohortWeekStart: cohort,
    daysSinceSignup: d,
    activeUsers: active,
    totalUsers: total,
  };
}

describe("generateEngagementInsights", () => {
  it("returns no insights for empty input", () => {
    expect(generateEngagementInsights([])).toEqual([]);
  });

  it("flags a cohort with day-7 retention well above the average", () => {
    // Rolling avg D7 = (10+10+50)/(100+100+100) ≈ 0.233
    // Strong cohort = the 50/100 row. Delta vs avg ≈ 0.27 > threshold (0.10).
    const triangle: CohortBucketCount[] = [
      row("2026-04-06", 7, 10, 100),
      row("2026-04-13", 7, 10, 100),
      row("2026-04-20", 7, 50, 100),
    ];
    const insights = generateEngagementInsights(triangle);
    const better = insights.find((i) => i.kind === "better_cohort");
    expect(better).toBeDefined();
    if (better && better.kind === "better_cohort") {
      expect(better.cohortWeekStart).toBe("2026-04-20");
      expect(better.delta).toBeGreaterThan(COHORT_DEVIATION_THRESHOLD);
    }
  });

  it("flags a cohort with day-7 retention well below the average", () => {
    const triangle: CohortBucketCount[] = [
      row("2026-04-06", 7, 50, 100),
      row("2026-04-13", 7, 50, 100),
      row("2026-04-20", 7, 5, 100),
    ];
    const insights = generateEngagementInsights(triangle);
    const weak = insights.find((i) => i.kind === "weak_cohort");
    expect(weak).toBeDefined();
    if (weak && weak.kind === "weak_cohort") {
      expect(weak.cohortWeekStart).toBe("2026-04-20");
      expect(weak.delta).toBeLessThanOrEqual(-COHORT_DEVIATION_THRESHOLD);
    }
  });

  it("emits at most one better_cohort and one weak_cohort", () => {
    const triangle: CohortBucketCount[] = [
      row("2026-04-06", 7, 5, 100),
      row("2026-04-13", 7, 95, 100),
      row("2026-04-20", 7, 10, 100),
      row("2026-04-27", 7, 90, 100),
    ];
    const insights = generateEngagementInsights(triangle);
    expect(insights.filter((i) => i.kind === "better_cohort").length).toBeLessThanOrEqual(1);
    expect(insights.filter((i) => i.kind === "weak_cohort").length).toBeLessThanOrEqual(1);
  });

  it("identifies the largest drop-off between consecutive offsets", () => {
    // D0 = 1.0, D1 = 0.9, D3 = 0.8, D7 = 0.4, D14 = 0.35, D30 = 0.30.
    // Largest single-step drop is D3 → D7 (0.8 → 0.4, drop 0.4).
    const triangle: CohortBucketCount[] = [
      row("c", 0, 100, 100),
      row("c", 1, 90, 100),
      row("c", 3, 80, 100),
      row("c", 7, 40, 100),
      row("c", 14, 35, 100),
      row("c", 30, 30, 100),
    ];
    const insights = generateEngagementInsights(triangle);
    const dropOff = insights.find((i) => i.kind === "drop_off");
    expect(dropOff).toBeDefined();
    if (dropOff && dropOff.kind === "drop_off") {
      expect(dropOff.fromOffset).toBe(3);
      expect(dropOff.toOffset).toBe(7);
      expect(dropOff.drop).toBeCloseTo(0.4, 5);
    }
  });

  it("does not emit a drop-off when retention only rises (degenerate)", () => {
    const triangle: CohortBucketCount[] = [
      row("c", 0, 50, 100),
      row("c", 1, 60, 100),
      row("c", 3, 70, 100),
      row("c", 7, 80, 100),
      row("c", 14, 85, 100),
      row("c", 30, 90, 100),
    ];
    const insights = generateEngagementInsights(triangle);
    expect(insights.find((i) => i.kind === "drop_off")).toBeUndefined();
  });

  it("does not flag near-average cohorts (within threshold)", () => {
    // All three within ±5% of the avg → nothing crosses the 10% threshold.
    const triangle: CohortBucketCount[] = [
      row("2026-04-06", 7, 30, 100),
      row("2026-04-13", 7, 33, 100),
      row("2026-04-20", 7, 27, 100),
    ];
    const insights = generateEngagementInsights(triangle);
    expect(insights.find((i) => i.kind === "better_cohort")).toBeUndefined();
    expect(insights.find((i) => i.kind === "weak_cohort")).toBeUndefined();
  });
});
