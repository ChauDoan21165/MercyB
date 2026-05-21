// Placement v4 telemetry — cohort assignment + comparison.
//
// A cohort is a (CEFR band, native lang, target lang, age bucket) tuple. The
// caller supplies a CohortAssignment per user — the analytical core does NOT
// derive demographics from raw profile rows (privacy-by-design boundary).

import { extractRetentionSignals } from "./retention";
import { scoreAllLessons } from "./effectiveness";
import type {
  AggregationSummary,
  Cohort,
  CohortAssignment,
  CohortComparisonRow,
  CohortDriftReport,
  CohortGap,
} from "./types";

export interface CohortComparisonOptions {
  /** Horizon for retention computations (see retention.ts). */
  horizonMs: number;
  /** Cohorts with fewer than `kAnonThreshold` users are dropped from the report. */
  kAnonThreshold: number;
}

const NOTABLE_DELTA_THRESHOLDS = {
  completionRate: 0.1,
  stickiness: 0.1,
  retryBurden: 0.5,
  cefrLift: 0.5,
} as const;

export function buildCohortDriftReport(
  summary: AggregationSummary,
  assignments: readonly CohortAssignment[],
  opts: CohortComparisonOptions,
): CohortDriftReport {
  if (!Number.isFinite(opts.kAnonThreshold) || opts.kAnonThreshold < 1) {
    throw new Error("kAnonThreshold must be >= 1");
  }

  const userToCohortKey = new Map<string, string>();
  const cohortByKey = new Map<string, Cohort>();
  for (const a of assignments) {
    userToCohortKey.set(a.userIdHash, a.cohort.key);
    if (!cohortByKey.has(a.cohort.key)) cohortByKey.set(a.cohort.key, a.cohort);
  }

  const effectiveness = scoreAllLessons(summary);
  const effByLesson = new Map(effectiveness.map((e) => [e.lessonId, e]));
  const retention = extractRetentionSignals(summary, {
    horizonMs: opts.horizonMs,
  });
  const retentionByUser = new Map(retention.map((r) => [r.userIdHash, r]));

  // Per-user metric aggregates that we can roll up by cohort.
  const userMetrics = new Map<
    string,
    {
      completionRateSum: number;
      stickinessSum: number;
      retryBurdenSum: number;
      cefrLiftSum: number;
      lessonSamples: number;
      activityDensity: number;
    }
  >();

  for (const user of summary.users) {
    let completionRateSum = 0;
    let stickinessSum = 0;
    let retryBurdenSum = 0;
    let cefrLiftSum = 0;
    let samples = 0;
    for (const lesson of summary.lessons) {
      if (!lesson.userIdHashes.includes(user.userIdHash)) continue;
      const score = effByLesson.get(lesson.lessonId);
      if (!score) continue;
      completionRateSum += score.completionRate;
      stickinessSum += score.stickiness;
      retryBurdenSum += score.retryBurden;
      cefrLiftSum += score.cefrLift;
      samples += 1;
    }
    const ret = retentionByUser.get(user.userIdHash);
    userMetrics.set(user.userIdHash, {
      completionRateSum,
      stickinessSum,
      retryBurdenSum,
      cefrLiftSum,
      lessonSamples: samples,
      activityDensity: ret?.activityDensity ?? 0,
    });
  }

  const cohortAcc = new Map<
    string,
    {
      userN: number;
      completionRateSum: number;
      stickinessSum: number;
      retryBurdenSum: number;
      cefrLiftSum: number;
      activityDensitySum: number;
    }
  >();
  for (const [userIdHash, metrics] of userMetrics) {
    const key = userToCohortKey.get(userIdHash);
    if (!key) continue;
    let acc = cohortAcc.get(key);
    if (!acc) {
      acc = {
        userN: 0,
        completionRateSum: 0,
        stickinessSum: 0,
        retryBurdenSum: 0,
        cefrLiftSum: 0,
        activityDensitySum: 0,
      };
      cohortAcc.set(key, acc);
    }
    acc.userN += 1;
    if (metrics.lessonSamples > 0) {
      acc.completionRateSum +=
        metrics.completionRateSum / metrics.lessonSamples;
      acc.stickinessSum += metrics.stickinessSum / metrics.lessonSamples;
      acc.retryBurdenSum += metrics.retryBurdenSum / metrics.lessonSamples;
      acc.cefrLiftSum += metrics.cefrLiftSum / metrics.lessonSamples;
    }
    acc.activityDensitySum += metrics.activityDensity;
  }

  const rows: CohortComparisonRow[] = [];
  for (const key of [...cohortAcc.keys()].sort()) {
    const acc = cohortAcc.get(key)!;
    if (acc.userN < opts.kAnonThreshold) continue;
    rows.push({
      cohortKey: key,
      userN: acc.userN,
      meanCompletionRate: acc.completionRateSum / acc.userN,
      meanStickiness: acc.stickinessSum / acc.userN,
      meanRetryBurden: acc.retryBurdenSum / acc.userN,
      meanCefrLift: acc.cefrLiftSum / acc.userN,
      meanActivityDensity: acc.activityDensitySum / acc.userN,
    });
  }

  const notableGaps = findNotableGaps(rows);

  return { rows, notableGaps };
}

function findNotableGaps(
  rows: readonly CohortComparisonRow[],
): readonly CohortGap[] {
  const gaps: CohortGap[] = [];
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      const a = rows[i];
      const b = rows[j];
      pushIfGap(
        gaps,
        a,
        b,
        "completionRate",
        a.meanCompletionRate - b.meanCompletionRate,
        NOTABLE_DELTA_THRESHOLDS.completionRate,
      );
      pushIfGap(
        gaps,
        a,
        b,
        "stickiness",
        a.meanStickiness - b.meanStickiness,
        NOTABLE_DELTA_THRESHOLDS.stickiness,
      );
      pushIfGap(
        gaps,
        a,
        b,
        "retryBurden",
        a.meanRetryBurden - b.meanRetryBurden,
        NOTABLE_DELTA_THRESHOLDS.retryBurden,
      );
      pushIfGap(
        gaps,
        a,
        b,
        "cefrLift",
        a.meanCefrLift - b.meanCefrLift,
        NOTABLE_DELTA_THRESHOLDS.cefrLift,
      );
    }
  }
  // Sort gaps deterministically: (metric asc, a asc, b asc).
  gaps.sort((x, y) => {
    if (x.metric < y.metric) return -1;
    if (x.metric > y.metric) return 1;
    if (x.a < y.a) return -1;
    if (x.a > y.a) return 1;
    if (x.b < y.b) return -1;
    if (x.b > y.b) return 1;
    return 0;
  });
  return gaps;
}

function pushIfGap(
  gaps: CohortGap[],
  a: CohortComparisonRow,
  b: CohortComparisonRow,
  metric: CohortGap["metric"],
  delta: number,
  threshold: number,
): void {
  if (Math.abs(delta) < threshold) return;
  gaps.push({
    a: a.cohortKey,
    b: b.cohortKey,
    metric,
    delta,
  });
}

/**
 * Helper for callers: assemble a stable cohort key from its components.
 * Keeps the canonical format in one place.
 */
export function cohortKey(c: Omit<Cohort, "key">): string {
  return `${c.cefrBand}|${c.nativeLang}|${c.targetLang}|${c.ageBucket}`;
}
