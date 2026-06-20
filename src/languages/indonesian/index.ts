// src/languages/indonesian/index.ts
//
// Barrel for the Indonesian (Bahasa Indonesia) lesson pack. Re-exports each
// validated top-level lesson array under a stable named export, the level-grouped
// + flattened aggregates, metadata, the shared normalizer that turns any
// Indonesian lesson into the renderer's NormalizedLesson shape, the permissive
// input type, and the register/diacritic comparison helpers.
//
// NOTE: the lessons-*.ts files each declare their OWN inline `IndonesianLesson`
// / `LessonSentence` / `VocabEntry` types (they are authored in parallel and the
// shapes diverge slightly between waves). We therefore import only each module's
// default DATA array here — never `export *` — so the duplicate type names can't
// collide, and we re-type the arrays as the renderer-facing `IndonesianLessonInput`
// (a structural superset every wave satisfies). The generated extra/** bank is
// intentionally absent from this barrel until it gets a separate audit and
// product brief.

import type { CefrLevel } from "@/components/languages/LessonRenderer.types";
import type { IndonesianLessonInput } from "./normalize";

import a1Lessons from "./lessons-a1";
import a2Lessons from "./lessons-a2";
import b1Lessons from "./lessons-b1";
import b2Lessons from "./lessons-b2";
import c1Lessons from "./lessons-c1";
import c2Lessons from "./lessons-c2";

export { a1Lessons, a2Lessons, b1Lessons, b2Lessons, c1Lessons, c2Lessons };

export {
  INDONESIAN_CATEGORIES,
  INDONESIAN_LANGUAGE_META,
  INDONESIAN_TOTAL_LESSONS,
  INDONESIAN_VALIDATED_LEVELS,
} from "./lessons";
export type {
  IndonesianCategoryId,
  IndonesianCategoryMeta,
  IndonesianLanguageMeta,
  IndonesianLesson,
} from "./lessons";

export { normalizeIndonesianLesson } from "./normalize";
export {
  foldIndonesianDiacritics,
  foldIndonesianInformal,
  indonesianAnswersMatch,
} from "./normalize";
export type { IndonesianLessonInput } from "./normalize";

export type IndonesianLevel = Extract<
  CefrLevel,
  "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
>;

export type IndonesianShippedLevel = IndonesianLevel;

// Lessons grouped by CEFR level, in curriculum order. Each per-level array is a
// `default` export typed against that file's own inline `IndonesianLesson`; we
// widen to the renderer-facing `IndonesianLessonInput` (structural superset) so
// the aggregate has one stable element type across waves.
export const INDONESIAN_LESSONS_BY_LEVEL: Record<
  IndonesianShippedLevel,
  IndonesianLessonInput[]
> = {
  A1: a1Lessons as unknown as IndonesianLessonInput[],
  A2: a2Lessons as unknown as IndonesianLessonInput[],
  B1: b1Lessons as unknown as IndonesianLessonInput[],
  B2: b2Lessons as unknown as IndonesianLessonInput[],
  C1: c1Lessons as unknown as IndonesianLessonInput[],
  C2: c2Lessons as unknown as IndonesianLessonInput[],
};

// Every validated top-level Indonesian lesson, flattened in A1 → C2 order.
export const allIndonesianLessons: IndonesianLessonInput[] = [
  ...INDONESIAN_LESSONS_BY_LEVEL.A1,
  ...INDONESIAN_LESSONS_BY_LEVEL.A2,
  ...INDONESIAN_LESSONS_BY_LEVEL.B1,
  ...INDONESIAN_LESSONS_BY_LEVEL.B2,
  ...INDONESIAN_LESSONS_BY_LEVEL.C1,
  ...INDONESIAN_LESSONS_BY_LEVEL.C2,
];

// Lazy registry for Indonesian extra lesson expansion files.
// This keeps the extra bank discoverable without adding it to the core A1-C2 lesson list.
export const indonesianExtraLessonModules = import.meta.glob("./extra/*.ts");
