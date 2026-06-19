// src/languages/arabic/index.ts
//
// Barrel for the Modern Standard Arabic lesson pack. Re-exports the W2
// per-level lesson arrays, metadata, level-grouped + flattened aggregates, and
// the normalizer boundary. Keep this module local-array only: no page, router,
// hub, audio, tutor, Supabase, database, or extra/** exports.

import type { ArabicCefrLevel, ArabicLesson } from "./lessons";

import a1Lessons from "./lessons-a1";
import a2Lessons from "./lessons-a2";
import b1Lessons from "./lessons-b1";
import b2Lessons from "./lessons-b2";
import { lessons as c1Lessons } from "./lessons-c1";
import c2Lessons from "./lessons-c2";

export { a1Lessons, a2Lessons, b1Lessons, b2Lessons, c1Lessons, c2Lessons };

export {
  ARABIC_CATEGORIES,
  ARABIC_EXPECTED_LESSON_COUNTS_BY_LEVEL,
  ARABIC_LANGUAGE,
  ARABIC_TOTAL_LESSONS,
  ARABIC_VALIDATED_LEVELS,
} from "./lessons";
export type {
  ArabicCategoryId,
  ArabicCategoryMeta,
  ArabicCefrLevel,
  ArabicDialectNote,
  ArabicDialogueLine,
  ArabicExercise,
  ArabicExerciseFillBlank,
  ArabicExerciseMatching,
  ArabicExerciseTranslation,
  ArabicLanguageMeta,
  ArabicLesson,
  ArabicSentence,
  ArabicVocabEntry,
} from "./lessons";

export {
  arabicAnswersMatch,
  foldArabicForMatching,
  normalizeArabicAlefHamza,
  normalizeArabicDigits,
  normalizeArabicLesson,
  normalizeArabicTaMarbuta,
  normalizeArabicYaAlifMaqsurah,
  stripArabicHarakat,
  stripTatweel,
} from "./normalize";

export type ArabicLevel = ArabicCefrLevel;

export const ARABIC_LESSONS_BY_LEVEL: Record<ArabicLevel, ArabicLesson[]> = {
  A1: a1Lessons as unknown as ArabicLesson[],
  A2: a2Lessons as unknown as ArabicLesson[],
  B1: b1Lessons as unknown as ArabicLesson[],
  B2: b2Lessons as unknown as ArabicLesson[],
  C1: c1Lessons as unknown as ArabicLesson[],
  C2: c2Lessons as unknown as ArabicLesson[],
};

export const allArabicLessons: ArabicLesson[] = [
  ...ARABIC_LESSONS_BY_LEVEL.A1,
  ...ARABIC_LESSONS_BY_LEVEL.A2,
  ...ARABIC_LESSONS_BY_LEVEL.B1,
  ...ARABIC_LESSONS_BY_LEVEL.B2,
  ...ARABIC_LESSONS_BY_LEVEL.C1,
  ...ARABIC_LESSONS_BY_LEVEL.C2,
];
