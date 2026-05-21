// Placement v4 telemetry — retention signal extraction.
//
// Retention is computed against an explicit analysis horizon (an integer
// timestamp the caller supplies). This is what makes signals stable under
// replay: the horizon is data, not wall-clock.

import {
  UTC_MS_PER_DAY,
  longestContiguousRun,
  utcDayOrdinal,
} from "./time";
import type {
  AggregationSummary,
  ChurnRiskBucket,
  RetentionSignal,
  UserAggregate,
} from "./types";

export interface RetentionOptions {
  /**
   * Analysis horizon. All retention measurements are taken as if "now" were
   * this timestamp. MUST be >= the latest event timestamp; otherwise the
   * function throws because daysSinceLastSeen would go negative.
   */
  horizonMs: number;
}

/**
 * Extract per-user retention signals.
 *
 * Determinism: the horizon parameter is the only source of time. No Date.now
 * is consulted. Same (summary, horizonMs) pair always yields identical output.
 */
export function extractRetentionSignals(
  summary: AggregationSummary,
  opts: RetentionOptions,
): readonly RetentionSignal[] {
  if (!Number.isInteger(opts.horizonMs)) {
    throw new Error("horizonMs must be an integer millisecond timestamp");
  }

  return summary.users.map((u) => extractOne(u, opts.horizonMs));
}

function extractOne(user: UserAggregate, horizonMs: number): RetentionSignal {
  if (user.lastSeenMs > horizonMs) {
    throw new Error(
      `horizonMs (${horizonMs}) precedes user.lastSeenMs (${user.lastSeenMs}); replay error`,
    );
  }

  const firstDay = utcDayOrdinal(user.firstSeenMs);
  const lastDay = utcDayOrdinal(user.lastSeenMs);
  const spanDays = lastDay - firstDay + 1;
  const activeDayCount = user.activeDays.length;
  const activityDensity =
    spanDays > 0 ? clampDensity(activeDayCount / spanDays) : 0;
  const longestRun = longestContiguousRun(user.activeDays);
  const daysSinceLastSeen = Math.max(
    0,
    utcDayOrdinal(horizonMs) - lastDay,
  );

  return {
    userIdHash: user.userIdHash,
    spanDays,
    activeDays: activeDayCount,
    activityDensity,
    longestActiveRun: longestRun,
    daysSinceLastSeen,
    churnRisk: classifyChurnRisk(daysSinceLastSeen, activityDensity),
  };
}

function clampDensity(x: number): number {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

/**
 * Coarse, deterministic churn-risk bucket.
 *
 * Thresholds are intentionally simple and tunable. The point of this routine
 * is to produce a stable categorical signal that the placement engine can
 * use; precise risk modelling lives in a separate downstream model.
 */
export function classifyChurnRisk(
  daysSinceLastSeen: number,
  activityDensity: number,
): ChurnRiskBucket {
  if (daysSinceLastSeen >= 28) return "lost";
  if (daysSinceLastSeen >= 14) return "high";
  if (daysSinceLastSeen >= 7) return activityDensity < 0.3 ? "high" : "medium";
  return activityDensity < 0.4 ? "medium" : "low";
}

/**
 * Aggregate retention into a single stability metric.
 *
 * Used by tests/dashboards to assert metric stability across replays.
 * Returns a struct of integer counts plus mean density × 10_000 (kept as an
 * integer-valued ratio for exact replay comparisons).
 */
export function retentionStabilityFingerprint(
  signals: readonly RetentionSignal[],
): {
  userCount: number;
  bucketCounts: Record<ChurnRiskBucket, number>;
  densitySumMicros: number;
  longestRunSum: number;
} {
  const bucketCounts: Record<ChurnRiskBucket, number> = {
    low: 0,
    medium: 0,
    high: 0,
    lost: 0,
  };
  let densitySumMicros = 0;
  let longestRunSum = 0;
  for (const s of signals) {
    bucketCounts[s.churnRisk] += 1;
    densitySumMicros += Math.round(s.activityDensity * 1_000_000);
    longestRunSum += s.longestActiveRun;
  }
  return {
    userCount: signals.length,
    bucketCounts,
    densitySumMicros,
    longestRunSum,
  };
}

export { UTC_MS_PER_DAY };
