// src/languages/portuguese/index.ts
//
// Barrel for the Brazilian Portuguese lesson pack. Re-exports each validated
// top-level lesson array under a stable named export, the level-grouped +
// flattened aggregates, metadata, the shared normalizer that turns any
// Portuguese lesson into the renderer's NormalizedLesson shape, the permissive
// input type, and the accent/nasal-vowel comparison helpers.
//
// NOTE: the lessons-*.ts files each declare their OWN inline `PortugueseLesson`
// / `LessonSentence` / `VocabEntry` types (they are authored in parallel and the
// shapes diverge slightly between waves). We therefore import only the `lessons`
// named export + each module's default DATA array here — never `export *` — so
// the duplicate type names can't collide, and we re-type the arrays as the
// renderer-facing `PortugueseLessonInput` (a structural superset every wave
// satisfies). The generated extra/** bank is intentionally absent from this
// barrel until it gets a separate audit and product brief.

import type { CefrLevel } from "@/components/languages/LessonRenderer.types";
import type { PortugueseLessonInput } from "./normalize";

import a1Lessons from "./lessons-a1";
import a2Lessons from "./lessons-a2";
import b1Lessons from "./lessons-b1";
import b2Lessons from "./lessons-b2";
import c1Lessons from "./lessons-c1";
import c2Lessons from "./lessons-c2";

export { a1Lessons, a2Lessons, b1Lessons, b2Lessons, c1Lessons, c2Lessons };

export {
  PORTUGUESE_CATEGORIES,
  PORTUGUESE_TOTAL_LESSONS,
  PORTUGUESE_VALIDATED_LEVELS,
} from "./lessons";
export type {
  PortugueseCategoryId,
  PortugueseCategoryMeta,
  PortugueseLesson,
} from "./lessons";

export { normalizePortugueseLesson } from "./normalize";
export {
  foldPortugueseDiacritics,
  portugueseAnswersMatch,
} from "./normalize";
export type { PortugueseLessonInput } from "./normalize";

export type PortugueseLevel = Extract<
  CefrLevel,
  "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
>;

export type PortugueseShippedLevel = PortugueseLevel;

// Lessons grouped by CEFR level, in curriculum order. Each per-level array is a
// `lessons` export typed against that file's own inline `PortugueseLesson`; we
// widen to the renderer-facing `PortugueseLessonInput` (structural superset) so
// the aggregate has one stable element type across waves.
export const PORTUGUESE_LESSONS_BY_LEVEL: Record<
  PortugueseShippedLevel,
  PortugueseLessonInput[]
> = {
  A1: a1Lessons as unknown as PortugueseLessonInput[],
  A2: a2Lessons as unknown as PortugueseLessonInput[],
  B1: b1Lessons as unknown as PortugueseLessonInput[],
  B2: b2Lessons as unknown as PortugueseLessonInput[],
  C1: c1Lessons as unknown as PortugueseLessonInput[],
  C2: c2Lessons as unknown as PortugueseLessonInput[],
};

// Every validated top-level Portuguese lesson, flattened in A1 → C2 order.
export const allPortugueseLessons: PortugueseLessonInput[] = [
  ...PORTUGUESE_LESSONS_BY_LEVEL.A1,
  ...PORTUGUESE_LESSONS_BY_LEVEL.A2,
  ...PORTUGUESE_LESSONS_BY_LEVEL.B1,
  ...PORTUGUESE_LESSONS_BY_LEVEL.B2,
  ...PORTUGUESE_LESSONS_BY_LEVEL.C1,
  ...PORTUGUESE_LESSONS_BY_LEVEL.C2,
];
