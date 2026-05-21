// Placement v4 telemetry — weak-pattern clustering.
//
// Groups lessons by shared failure signatures so the placement engine can
// avoid recommending an entire cluster of weak content to a learner who
// struggled with one. Clustering is deterministic: a single-pass partition by
// quantized signature vector with stable cluster id derivation.

import { scoreAllLessons } from "./effectiveness";
import type {
  AggregationSummary,
  EffectivenessScore,
  LessonAggregate,
  WeakPatternCluster,
} from "./types";

export interface ClusteringOptions {
  /** Minimum users-per-lesson for inclusion in the analysis. Defaults to 3. */
  minUsersPerLesson?: number;
  /**
   * Discretization grid for the signature vector. Values are bucketed to the
   * nearest 1/granularity. Higher = finer clusters, more groups. Default 4
   * means buckets of width 0.25 across the 0..1 dimensions.
   */
  signatureGranularity?: number;
  /**
   * Composite threshold below which a lesson is considered "weak" enough to
   * cluster. Lessons above this are not clustered. Default 0.5.
   */
  weakThreshold?: number;
}

interface SignatureFeatures {
  retryBurdenBucket: number;
  dropoffRateBucket: number;
  scoreBucket: number;
  cefrLiftBucket: number;
}

export function clusterWeakLessons(
  summary: AggregationSummary,
  opts: ClusteringOptions = {},
): readonly WeakPatternCluster[] {
  const minUsers = opts.minUsersPerLesson ?? 3;
  const granularity = opts.signatureGranularity ?? 4;
  const weakThreshold = opts.weakThreshold ?? 0.5;

  if (!Number.isInteger(granularity) || granularity < 1 || granularity > 100) {
    throw new Error("signatureGranularity must be an integer in [1, 100]");
  }

  const scores = scoreAllLessons(summary);
  const lessonsById = new Map(
    summary.lessons.map((l) => [l.lessonId, l] as const),
  );

  // Group by signature.
  const groups = new Map<
    string,
    {
      lessons: Array<{ lesson: LessonAggregate; score: EffectivenessScore }>;
    }
  >();

  for (const score of scores) {
    if (score.composite > weakThreshold) continue;
    if (score.userN < minUsers) continue;
    const lesson = lessonsById.get(score.lessonId);
    if (!lesson) continue;
    const sig = signatureFor(lesson, score, granularity);
    const key = serializeSignature(sig);
    let group = groups.get(key);
    if (!group) {
      group = { lessons: [] };
      groups.set(key, group);
    }
    group.lessons.push({ lesson, score });
  }

  const clusters: WeakPatternCluster[] = [];
  for (const key of [...groups.keys()].sort()) {
    const group = groups.get(key)!;
    const lessonIds = group.lessons.map((x) => x.lesson.lessonId).sort();
    const compositeSum = group.lessons.reduce(
      (acc, x) => acc + x.score.composite,
      0,
    );
    const retrySum = group.lessons.reduce(
      (acc, x) => acc + x.score.retryBurden,
      0,
    );
    const dropoffRateSum = group.lessons.reduce((acc, x) => {
      const starts = x.lesson.starts;
      return acc + (starts > 0 ? x.lesson.dropoffs / starts : 0);
    }, 0);
    const totalUserN = group.lessons.reduce(
      (acc, x) => acc + x.lesson.uniqueUsers,
      0,
    );
    clusters.push({
      id: `cluster::${key}`,
      lessonIds,
      meanComposite: compositeSum / group.lessons.length,
      meanRetryBurden: retrySum / group.lessons.length,
      meanDropoffRate: dropoffRateSum / group.lessons.length,
      totalUserN,
    });
  }

  return clusters;
}

function signatureFor(
  lesson: LessonAggregate,
  score: EffectivenessScore,
  granularity: number,
): SignatureFeatures {
  const dropoffRate =
    lesson.starts > 0 ? lesson.dropoffs / lesson.starts : 0;
  return {
    retryBurdenBucket: bucket(score.retryBurden / 10, granularity),
    dropoffRateBucket: bucket(dropoffRate, granularity),
    scoreBucket: bucket(score.meanScore, granularity),
    cefrLiftBucket: bucket((score.cefrLift + 5) / 10, granularity),
  };
}

function bucket(x: number, granularity: number): number {
  const clamped = x < 0 ? 0 : x > 1 ? 1 : x;
  return Math.round(clamped * granularity);
}

function serializeSignature(sig: SignatureFeatures): string {
  return [
    sig.retryBurdenBucket,
    sig.dropoffRateBucket,
    sig.scoreBucket,
    sig.cefrLiftBucket,
  ].join("-");
}
