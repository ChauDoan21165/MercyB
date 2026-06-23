// src/languages/swahili/index.ts
//
// Barrel for the Swahili (Kiswahili) lesson pack. Re-exports each
// validated top-level lesson array under a stable named export, the
// level-grouped + flattened aggregates, metadata, the shared normalizer
// that turns any Swahili lesson into the renderer's NormalizedLesson
// shape, and the permissive input type.
//
// Consolidated from multiple authoring waves:
//   A1 wave → lessons-a1.ts (7 categories)
//   A2     → lessons-a2.ts (6 categories, fresh scaffold)
//   B1 wave → lessons-b1.ts (5 categories)
//   B2 wave → lessons-b2.ts (5 categories)
//   C2 wave → lessons-c2.ts (10 categories)
//   C1     → pending (A5 wave produced room JSON only, no lesson file)

import type { CefrLevel } from "@/components/languages/LessonRenderer.types";
import type { SwahiliLessonInput } from "./normalize";

import a1Lessons from "./lessons-a1";
import a2Lessons from "./lessons-a2";
import b1Lessons from "./lessons-b1";
import b2Lessons from "./lessons-b2";
import c2Lessons from "./lessons-c2";

export { a1Lessons, a2Lessons, b1Lessons, b2Lessons, c2Lessons };

export {
  SWAHILI_CATEGORIES,
  SWAHILI_LANGUAGE_META,
  SWAHILI_TOTAL_LESSONS,
  SWAHILI_VALIDATED_LEVELS,
} from "./lessons";
export type {
  SwahiliCategoryId,
  SwahiliCategoryMeta,
  SwahiliCefrLevel,
  SwahiliDialogueInput,
  SwahiliIdiomGlossInput,
  SwahiliLanguageMeta,
  SwahiliLesson,
  SwahiliLessonInput as SwahiliLessonType,
  SwahiliSentenceInput,
  SwahiliVocabInput,
} from "./lessons";

export {
  foldSwahiliForMatching,
  normalizeSwahiliLesson,
  swahiliAnswersMatch,
} from "./normalize";
export type { SwahiliLessonInput } from "./normalize";

export type SwahiliLevel = Extract<
  CefrLevel,
  "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
>;

export type SwahiliShippedLevel = SwahiliLevel;

// Lessons grouped by CEFR level, in curriculum order.
// C1 is empty — A5 wave produced room JSON only (no lesson file).
export const SWAHILI_LESSONS_BY_LEVEL: Record<
  SwahiliShippedLevel,
  SwahiliLessonInput[]
> = {
  A1: a1Lessons as unknown as SwahiliLessonInput[],
  A2: a2Lessons as unknown as SwahiliLessonInput[],
  B1: b1Lessons as unknown as SwahiliLessonInput[],
  B2: b2Lessons as unknown as SwahiliLessonInput[],
  C1: [],
  C2: c2Lessons as unknown as SwahiliLessonInput[],
};

// Every validated top-level Swahili lesson, flattened in A1 → C2 order.
export const allSwahiliLessons: SwahiliLessonInput[] = [
  ...SWAHILI_LESSONS_BY_LEVEL.A1,
  ...SWAHILI_LESSONS_BY_LEVEL.A2,
  ...SWAHILI_LESSONS_BY_LEVEL.B1,
  ...SWAHILI_LESSONS_BY_LEVEL.B2,
  ...SWAHILI_LESSONS_BY_LEVEL.C1,
  ...SWAHILI_LESSONS_BY_LEVEL.C2,
];
