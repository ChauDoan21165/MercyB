// Shared fixture builders for the adapter integration tests.
//
// Pure, deterministic, no Date.now, no Math.random. All time anchored to
// FIXED_EPOCH_MS so the tests stay reproducible.

import { UTC_MS_PER_DAY } from "../index";
import type {
  AdaptiveSignalBundle,
  ForecastLike,
  ForecastSkillTargetLike,
  IneffectiveClusterFlag,
  IngestionContext,
  LearnerMemoryEventLike,
  LearnerMemorySummaryLike,
  ProgressionSnapshotLike,
  Skill,
  StudyPlanDayLike,
  StudyPlanIntensity,
  StudyPlanLessonLike,
  StudyPlanLike,
} from "../index";
import type { CEFRLevel } from "../../../../../types/placement-v3";

export const FIXED_EPOCH_MS = 1_700_000_000_000;
export const U1 = "uhash_user_one_aaaaaaaaaaaaaaaa";
export const U2 = "uhash_user_two_bbbbbbbbbbbbbbbb";
export const U3 = "uhash_user_three_ccccccccccccccc";
export const SESSION = "sess-u1-aaaaaaaaaaaaaaaa";

export function day(d: number): number {
  return FIXED_EPOCH_MS + d * UTC_MS_PER_DAY;
}

export function ctx(
  overrides: Partial<IngestionContext> = {},
): IngestionContext {
  return {
    userIdHash: U1,
    sessionId: SESSION,
    nowMs: day(0),
    eventIdPrefix: "fx::ctx",
    ...overrides,
  };
}

export function makeLesson(
  partial: Partial<StudyPlanLessonLike> & { lessonId: string },
): StudyPlanLessonLike {
  return {
    skill: "reading",
    estimatedMinutes: 12,
    ...partial,
  };
}

export function makeDay(
  partial: Partial<StudyPlanDayLike> & { day: number },
): StudyPlanDayLike {
  return {
    lessons: [],
    ...partial,
  };
}

export function makePlan(
  partial: Partial<StudyPlanLike> = {},
): StudyPlanLike {
  return {
    planVersion: "v4.test.001",
    totalDays: 7,
    intensity: "balanced",
    days: [
      makeDay({
        day: 1,
        lessons: [
          makeLesson({ lessonId: "lesson-a", skill: "reading", estimatedMinutes: 12 }),
          makeLesson({ lessonId: "lesson-b", skill: "vocabulary", estimatedMinutes: 10 }),
        ],
      }),
      makeDay({ day: 2, lessons: [makeLesson({ lessonId: "lesson-c", skill: "writing", estimatedMinutes: 18 })] }),
      makeDay({ day: 3, lessons: [makeLesson({ lessonId: "lesson-d", skill: "speaking", estimatedMinutes: 15 })] }),
      makeDay({
        day: 4,
        lessons: [
          makeLesson({ lessonId: "lesson-e", skill: "listening", estimatedMinutes: 14 }),
        ],
      }),
      makeDay({ day: 5, lessons: [], isRecoveryDay: true }),
      makeDay({ day: 6, lessons: [makeLesson({ lessonId: "lesson-f", skill: "writing", estimatedMinutes: 16 })] }),
      makeDay({ day: 7, lessons: [makeLesson({ lessonId: "lesson-g", skill: "reading", estimatedMinutes: 14 })] }),
    ],
    generatedAtMs: FIXED_EPOCH_MS,
    ...partial,
  };
}

export function makeSnapshot(
  partial: Partial<ProgressionSnapshotLike> = {},
): ProgressionSnapshotLike {
  return {
    userIdHash: U1,
    sessionId: SESSION,
    snapshotMs: day(3),
    plan: makePlan(),
    currentDay: 3,
    lastActiveDay: 3,
    skills: {
      reading: { mastery: 0.7, attempts: 4, lastPracticedDayOrdinal: dayOrdinal(2) },
      vocabulary: { mastery: 0.65, attempts: 3, lastPracticedDayOrdinal: dayOrdinal(2) },
      writing: { mastery: 0.55, attempts: 2, lastPracticedDayOrdinal: dayOrdinal(1) },
      speaking: { mastery: 0.45, attempts: 2, lastPracticedDayOrdinal: dayOrdinal(0) },
      pronunciation: { mastery: 0.3, attempts: 1, lastPracticedDayOrdinal: dayOrdinal(0) },
      listening: { mastery: 0.6, attempts: 2, lastPracticedDayOrdinal: dayOrdinal(2) },
    },
    cefr: {
      overall: "A2",
      perSkill: {
        reading: "A2",
        writing: "A2",
        speaking: "A2",
        pronunciation: "A1",
        listening: "A2",
        vocabulary: "A2",
      },
    },
    activeL1Patterns: ["voicing_final_consonants"],
    reviewDebtCount: 2,
    streakDays: 3,
    ...partial,
  };
}

export function dayOrdinal(d: number): number {
  return Math.floor(day(d) / UTC_MS_PER_DAY);
}

export function makeMemory(
  events: readonly LearnerMemoryEventLike[] = [],
  overrides: Partial<LearnerMemorySummaryLike> = {},
): LearnerMemorySummaryLike {
  return {
    userIdHash: U1,
    recent: events,
    sessionIds: [SESSION],
    ...overrides,
  };
}

export function makeForecast(
  targets: readonly ForecastSkillTargetLike[],
  overrides: Partial<ForecastLike> = {},
): ForecastLike {
  return {
    forecastId: "fc-001",
    planVersion: "v4.test.001",
    horizonDays: 7,
    targets,
    predictedStreakDays: 7,
    predictedReviewDebt: 0,
    ...overrides,
  };
}

export function tg(
  skill: Skill,
  predictedMastery: number,
  predictedCefr: CEFRLevel,
  confidence = 0.7,
): ForecastSkillTargetLike {
  return { skill, predictedMastery, predictedCefr, confidence };
}

export function ineffective(
  clusterId: string,
  lessonIds: readonly string[],
  meanComposite: number,
  userN: number,
): IneffectiveClusterFlag {
  return {
    clusterId,
    lessonIds,
    meanComposite,
    userN,
  };
}

export type StudyPlanIntensityValue = StudyPlanIntensity;

export {} ;
// (empty re-export so the file is treated as a module if compiled standalone)

export function noSignals(): AdaptiveSignalBundle {
  return {
    burnout: { level: "low", score: 0, factors: [] },
    churn: { level: "low", score: 0, daysSinceLastActive: 0, activityDensity: 1, factors: [] },
    stagnation: { bySkill: {}, criticallyStagnantSkills: [] },
    speakingAvoidance: { detected: false, speakingLessonsSkippedRatio: 0, consecutiveSpeakingSkips: 0 },
    reviewOverload: { detected: false, reviewDebtCount: 0, reviewDebtThreshold: 5 },
    l1Persistence: [],
    ineffectiveClusters: [],
  };
}
