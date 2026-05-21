// Placement v4 telemetry — lesson effectiveness scoring.
//
// All metrics are derived from the deterministic AggregationSummary, so the
// scores themselves are deterministic. The CEFR ladder is a fixed enum and
// lift is computed as a signed integer delta in ladder positions.

import type {
  AggregationSummary,
  EffectivenessScore,
  LessonAggregate,
} from "./types";
import type { CEFRLevel } from "../../../../types/placement-v3";

const CEFR_RANK: Readonly<Record<CEFRLevel, number>> = {
  A1: 0,
  A2: 1,
  B1: 2,
  B2: 3,
  C1: 4,
  C2: 5,
};

/** Cap retryBurden at this value so a few outliers can't drag composite down. */
const RETRY_BURDEN_CAP = 10;

interface ScoreWeights {
  completion: number;
  stickiness: number;
  retryPenalty: number;
  score: number;
  cefr: number;
}

const DEFAULT_WEIGHTS: ScoreWeights = {
  completion: 0.30,
  stickiness: 0.20,
  retryPenalty: 0.15,
  score: 0.20,
  cefr: 0.15,
};

export function scoreLessonEffectiveness(
  lesson: LessonAggregate,
  cefrLiftByLesson: Readonly<Map<string, { lift: number; samples: number }>>,
  weights: ScoreWeights = DEFAULT_WEIGHTS,
): EffectivenessScore {
  const starts = lesson.starts;
  const completionRate =
    starts > 0 ? clamp01(lesson.completions / starts) : 0;
  const stickiness =
    starts > 0 ? clamp01(1 - lesson.dropoffs / starts) : 1;
  const retryBurden =
    lesson.completions > 0
      ? Math.min(lesson.retries / lesson.completions, RETRY_BURDEN_CAP)
      : Math.min(lesson.retries, RETRY_BURDEN_CAP);
  const meanScore =
    lesson.totalScoreSamples > 0
      ? clamp01(lesson.totalScoreRatio / lesson.totalScoreSamples)
      : 0;
  const lift = cefrLiftByLesson.get(lesson.lessonId) ?? {
    lift: 0,
    samples: 0,
  };
  const cefrLift = lift.lift;
  const normalizedLift = lift.samples > 0 ? clamp01((lift.lift + 5) / 10) : 0.5;
  const normalizedRetry = 1 - clamp01(retryBurden / RETRY_BURDEN_CAP);

  const composite = clamp01(
    weights.completion * completionRate +
      weights.stickiness * stickiness +
      weights.retryPenalty * normalizedRetry +
      weights.score * meanScore +
      weights.cefr * normalizedLift,
  );

  return {
    lessonId: lesson.lessonId,
    completionRate,
    stickiness,
    retryBurden,
    meanScore,
    cefrLift,
    composite,
    userN: lesson.uniqueUsers,
  };
}

export function computeCefrLiftByLesson(
  summary: AggregationSummary,
  lessonCompletionsByUser: Readonly<Map<string, Set<string>>>,
): Map<string, { lift: number; samples: number }> {
  // Heuristic, deterministic: for every user, attribute their net CEFR delta
  // across all checkpoints to every lesson they completed during that span.
  // This is a transparent attribution model — better attribution requires
  // joining checkpoint windows to lesson windows; that lives downstream.
  const liftByLesson = new Map<string, { lift: number; samples: number }>();

  for (const user of summary.users) {
    if (user.cefrTransitions.length === 0) continue;
    let net = 0;
    for (const t of user.cefrTransitions) {
      const from = t.fromLevel === null ? CEFR_RANK[t.toLevel] : CEFR_RANK[t.fromLevel];
      const to = CEFR_RANK[t.toLevel];
      net += to - from;
    }
    const lessonsForUser = lessonCompletionsByUser.get(user.userIdHash);
    if (!lessonsForUser || lessonsForUser.size === 0) continue;
    const perLessonShare = net / lessonsForUser.size;
    for (const lessonId of [...lessonsForUser].sort()) {
      const entry = liftByLesson.get(lessonId) ?? { lift: 0, samples: 0 };
      entry.lift += perLessonShare;
      entry.samples += 1;
      liftByLesson.set(lessonId, entry);
    }
  }

  return liftByLesson;
}

/**
 * Build the map of which users completed which lessons.
 * Returns a map keyed by userIdHash → set of lessonId.
 */
export function buildLessonCompletionsByUser(
  summary: AggregationSummary,
): Map<string, Set<string>> {
  const out = new Map<string, Set<string>>();
  for (const lesson of summary.lessons) {
    if (lesson.completions === 0) continue;
    for (const uid of lesson.userIdHashes) {
      let set = out.get(uid);
      if (!set) {
        set = new Set<string>();
        out.set(uid, set);
      }
      set.add(lesson.lessonId);
    }
  }
  return out;
}

/**
 * Score every lesson in an aggregation. Output is sorted by lessonId asc.
 */
export function scoreAllLessons(
  summary: AggregationSummary,
): readonly EffectivenessScore[] {
  const completionsByUser = buildLessonCompletionsByUser(summary);
  const liftByLesson = computeCefrLiftByLesson(summary, completionsByUser);
  return summary.lessons.map((l) =>
    scoreLessonEffectiveness(l, liftByLesson),
  );
}

function clamp01(x: number): number {
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}
