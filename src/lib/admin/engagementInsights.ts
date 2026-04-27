// src/lib/admin/engagementInsights.ts
//
// Pure rules that turn the cohort-retention triangle into one or more
// human-legible insight cards rendered on /admin/retention. The
// generator is fully deterministic — same input, same output — so it
// can be tested without mocks.
//
// Three insight families:
//
//   1. better-cohort:
//      A cohort whose day-7 retention is at least 10 percentage
//      points above the average across the rolling window.
//
//   2. drop-off:
//      The day-offset where cohort-average retention falls the most
//      sharply versus the previous offset. Surfaces "users churn at
//      day 3" patterns.
//
//   3. weak-cohort:
//      A cohort whose day-7 retention is at least 10 percentage
//      points below the rolling average. Helps spot regressions tied
//      to specific releases.
//
// Anonymisation: insights operate on cohort-week labels and aggregate
// counts. No user IDs.

import {
  RETENTION_DAY_OFFSETS,
  classifyRetention,
  type CohortBucketCount,
  type RetentionDayOffset,
} from "./cohortRetention";

export type EngagementInsight =
  | {
      kind: "better_cohort";
      cohortWeekStart: string;
      day7Retention: number;
      averageDay7: number;
      delta: number;
    }
  | {
      kind: "drop_off";
      fromOffset: RetentionDayOffset;
      toOffset: RetentionDayOffset;
      averageBefore: number;
      averageAfter: number;
      drop: number;
    }
  | {
      kind: "weak_cohort";
      cohortWeekStart: string;
      day7Retention: number;
      averageDay7: number;
      delta: number;
    };

/** Threshold for flagging a cohort as better/worse than the rolling average. */
export const COHORT_DEVIATION_THRESHOLD = 0.1;

/** Compute the (active / total) ratio across all rows that share `daysSinceSignup`. */
function averageRatioAt(
  triangle: ReadonlyArray<CohortBucketCount>,
  offset: RetentionDayOffset,
): number {
  let active = 0;
  let total = 0;
  for (const row of triangle) {
    if (row.daysSinceSignup !== offset) continue;
    active += row.activeUsers;
    total += row.totalUsers;
  }
  if (total <= 0) return 0;
  return active / total;
}

/** Per-cohort ratio at a given offset. Skips cohorts whose total is zero. */
function perCohortRatios(
  triangle: ReadonlyArray<CohortBucketCount>,
  offset: RetentionDayOffset,
): Array<{ cohort: string; ratio: number }> {
  const out: Array<{ cohort: string; ratio: number }> = [];
  for (const row of triangle) {
    if (row.daysSinceSignup !== offset) continue;
    const c = classifyRetention(row.activeUsers, row.totalUsers);
    if (c.ratio === null) continue;
    out.push({ cohort: row.cohortWeekStart, ratio: c.ratio });
  }
  return out;
}

export function generateEngagementInsights(
  triangle: ReadonlyArray<CohortBucketCount>,
): EngagementInsight[] {
  const out: EngagementInsight[] = [];
  if (triangle.length === 0) return out;

  // ── 1 + 3. Better-than-average and weak cohorts (anchored on day 7) ──
  const day7Avg = averageRatioAt(triangle, 7);
  const day7Cohorts = perCohortRatios(triangle, 7);

  // Pick the SINGLE most-positive deviation that crosses the threshold,
  // and the single most-negative. Surfaces the strongest signal each
  // way without flooding the page.
  let bestCohort: { cohort: string; ratio: number; delta: number } | null = null;
  let worstCohort: { cohort: string; ratio: number; delta: number } | null = null;
  for (const c of day7Cohorts) {
    const delta = c.ratio - day7Avg;
    if (delta >= COHORT_DEVIATION_THRESHOLD) {
      if (!bestCohort || delta > bestCohort.delta) {
        bestCohort = { cohort: c.cohort, ratio: c.ratio, delta };
      }
    } else if (delta <= -COHORT_DEVIATION_THRESHOLD) {
      if (!worstCohort || delta < worstCohort.delta) {
        worstCohort = { cohort: c.cohort, ratio: c.ratio, delta };
      }
    }
  }

  if (bestCohort) {
    out.push({
      kind: "better_cohort",
      cohortWeekStart: bestCohort.cohort,
      day7Retention: bestCohort.ratio,
      averageDay7: day7Avg,
      delta: bestCohort.delta,
    });
  }
  if (worstCohort) {
    out.push({
      kind: "weak_cohort",
      cohortWeekStart: worstCohort.cohort,
      day7Retention: worstCohort.ratio,
      averageDay7: day7Avg,
      delta: worstCohort.delta,
    });
  }

  // ── 2. Largest drop-off between consecutive checkpoints ──────────
  let worstDrop: {
    fromOffset: RetentionDayOffset;
    toOffset: RetentionDayOffset;
    averageBefore: number;
    averageAfter: number;
    drop: number;
  } | null = null;
  for (let i = 0; i < RETENTION_DAY_OFFSETS.length - 1; i += 1) {
    const a = RETENTION_DAY_OFFSETS[i];
    const b = RETENTION_DAY_OFFSETS[i + 1];
    const before = averageRatioAt(triangle, a);
    const after = averageRatioAt(triangle, b);
    const drop = before - after;
    if (drop <= 0) continue;
    if (!worstDrop || drop > worstDrop.drop) {
      worstDrop = {
        fromOffset: a,
        toOffset: b,
        averageBefore: before,
        averageAfter: after,
        drop,
      };
    }
  }
  if (worstDrop) {
    out.push({ kind: "drop_off", ...worstDrop });
  }

  return out;
}
