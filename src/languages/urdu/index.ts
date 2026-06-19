// src/languages/urdu/index.ts
//
// Barrel for the Urdu lesson pack. Re-exports W2 per-level local arrays,
// metadata, level-grouped + flattened aggregates, and the normalizer boundary.
// Keep this module local-array only; public integration surfaces are out of
// scope for the W2 language-module foundation.

import type { UrduCefrLevel, UrduLesson } from "./lessons";

import a1Lessons from "./lessons-a1";
import a2Lessons from "./lessons-a2";
import b1Lessons from "./lessons-b1";
import b2Lessons from "./lessons-b2";
import c1Lessons from "./lessons-c1";
import c2Lessons from "./lessons-c2";

export { a1Lessons, a2Lessons, b1Lessons, b2Lessons, c1Lessons, c2Lessons };

export {
  URDU_CATEGORIES,
  URDU_EXPECTED_LESSON_COUNTS_BY_LEVEL,
  URDU_LANGUAGE,
  URDU_TOTAL_LESSONS,
  URDU_VALIDATED_LEVELS,
} from "./lessons";
export type {
  UrduCategoryId,
  UrduCategoryMeta,
  UrduCefrLevel,
  UrduDialogueLine,
  UrduExercise,
  UrduExerciseFillBlank,
  UrduExerciseMatching,
  UrduExerciseTranslation,
  UrduLanguageMeta,
  UrduLesson,
  UrduRegisterNote,
  UrduSentence,
  UrduVocabEntry,
} from "./lessons";

export {
  foldUrduForMatching,
  normalizeUrduAlefHamza,
  normalizeUrduDigits,
  normalizeUrduHehVariants,
  normalizeUrduLesson,
  normalizeUrduYehVariants,
  stripTatweel,
  stripUrduDiacritics,
  urduAnswersMatch,
} from "./normalize";

export type UrduLevel = UrduCefrLevel;

export const URDU_LESSONS_BY_LEVEL: Record<UrduLevel, UrduLesson[]> = {
  A1: a1Lessons as unknown as UrduLesson[],
  A2: a2Lessons as unknown as UrduLesson[],
  B1: b1Lessons as unknown as UrduLesson[],
  B2: b2Lessons as unknown as UrduLesson[],
  C1: c1Lessons as unknown as UrduLesson[],
  C2: c2Lessons as unknown as UrduLesson[],
};

export const allUrduLessons: UrduLesson[] = [
  ...URDU_LESSONS_BY_LEVEL.A1,
  ...URDU_LESSONS_BY_LEVEL.A2,
  ...URDU_LESSONS_BY_LEVEL.B1,
  ...URDU_LESSONS_BY_LEVEL.B2,
  ...URDU_LESSONS_BY_LEVEL.C1,
  ...URDU_LESSONS_BY_LEVEL.C2,
];
