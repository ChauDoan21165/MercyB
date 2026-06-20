// src/languages/turkish/index.ts
//
// Barrel for the local Turkish public lesson pack. Only the audited A1-C2 core
// arrays are exported here; there is no generated extra bank in this first
// product build.

import type { TurkishLessonInput } from "./lessons";

import a1Lessons from "./lessons-a1";
import a2Lessons from "./lessons-a2";
import b1Lessons from "./lessons-b1";
import b2Lessons from "./lessons-b2";
import c1Lessons from "./lessons-c1";
import c2Lessons from "./lessons-c2";

export { a1Lessons, a2Lessons, b1Lessons, b2Lessons, c1Lessons, c2Lessons };

export {
  TURKISH_CATEGORIES,
  TURKISH_LANGUAGE_META,
  TURKISH_TOTAL_LESSONS,
  TURKISH_VALIDATED_LEVELS,
} from "./lessons";
export type {
  TurkishCategoryId,
  TurkishCategoryMeta,
  TurkishCefrLevel,
  TurkishExerciseInput,
  TurkishLanguageMeta,
  TurkishLesson,
  TurkishLessonInput,
} from "./lessons";

export {
  foldTurkishDiacritics,
  normalizeTurkishLesson,
  turkishAnswersMatch,
} from "./normalize";

export type TurkishLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type TurkishShippedLevel = TurkishLevel;

export const TURKISH_LESSONS_BY_LEVEL: Record<
  TurkishShippedLevel,
  TurkishLessonInput[]
> = {
  A1: a1Lessons,
  A2: a2Lessons,
  B1: b1Lessons,
  B2: b2Lessons,
  C1: c1Lessons,
  C2: c2Lessons,
};

export const allTurkishLessons: TurkishLessonInput[] = [
  ...TURKISH_LESSONS_BY_LEVEL.A1,
  ...TURKISH_LESSONS_BY_LEVEL.A2,
  ...TURKISH_LESSONS_BY_LEVEL.B1,
  ...TURKISH_LESSONS_BY_LEVEL.B2,
  ...TURKISH_LESSONS_BY_LEVEL.C1,
  ...TURKISH_LESSONS_BY_LEVEL.C2,
];
