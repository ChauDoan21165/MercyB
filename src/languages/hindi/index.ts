// src/languages/hindi/index.ts
//
// Barrel for the Standard Hindi lesson pack. Re-exports the W2 per-level local
// lesson arrays, metadata, level-grouped + flattened aggregates, and the
// normalizer boundary. Keep this module local-array only and export only the
// audited top-level lesson files.

import type { HindiCefrLevel, HindiLesson } from "./lessons";

import a1Lessons from "./lessons-a1";
import a2Lessons from "./lessons-a2";
import b1Lessons from "./lessons-b1";
import b2Lessons from "./lessons-b2";
import c1Lessons from "./lessons-c1";
import c2Lessons from "./lessons-c2";

export { a1Lessons, a2Lessons, b1Lessons, b2Lessons, c1Lessons, c2Lessons };

export {
  HINDI_CATEGORIES,
  HINDI_EXPECTED_LESSON_COUNTS_BY_LEVEL,
  HINDI_LANGUAGE,
  HINDI_TOTAL_LESSONS,
  HINDI_VALIDATED_LEVELS,
} from "./lessons";
export type {
  HindiCategoryId,
  HindiCategoryMeta,
  HindiCefrLevel,
  HindiDialogueLine,
  HindiExercise,
  HindiExerciseFillBlank,
  HindiExerciseMatching,
  HindiExerciseTranslation,
  HindiLanguageMeta,
  HindiLesson,
  HindiSentence,
  HindiVocabEntry,
} from "./lessons";

export {
  foldHindiForMatching,
  hindiAnswersMatch,
  normalizeHindiAnusvaraChandrabindu,
  normalizeHindiDigits,
  normalizeHindiLesson,
  normalizeHindiNukta,
  normalizeHindiVirama,
  normalizeHindiVisarga,
  stripHindiCombiningMarks,
} from "./normalize";

export type HindiLevel = HindiCefrLevel;

export const HINDI_LESSONS_BY_LEVEL: Record<HindiLevel, HindiLesson[]> = {
  A1: a1Lessons as unknown as HindiLesson[],
  A2: a2Lessons as unknown as HindiLesson[],
  B1: b1Lessons as unknown as HindiLesson[],
  B2: b2Lessons as unknown as HindiLesson[],
  C1: c1Lessons as unknown as HindiLesson[],
  C2: c2Lessons as unknown as HindiLesson[],
};

export const allHindiLessons: HindiLesson[] = [
  ...HINDI_LESSONS_BY_LEVEL.A1,
  ...HINDI_LESSONS_BY_LEVEL.A2,
  ...HINDI_LESSONS_BY_LEVEL.B1,
  ...HINDI_LESSONS_BY_LEVEL.B2,
  ...HINDI_LESSONS_BY_LEVEL.C1,
  ...HINDI_LESSONS_BY_LEVEL.C2,
];
