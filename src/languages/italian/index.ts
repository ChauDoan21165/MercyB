// src/languages/italian/index.ts
//
// Barrel for the Italian lesson pack. Re-exports each per-level lesson array
// (a1 … c2) under a stable named export, the level-grouped + flattened
// aggregates, and the shared normalizer that turns any Italian lesson into the
// renderer's NormalizedLesson shape.
//
// NOTE: the six lessons-*.ts files each declare their own (slightly divergent)
// `ItalianLesson` / `LessonSentence` / `VocabEntry` types — see normalize.ts for
// the two-wave shape history. We therefore re-export only the default DATA
// arrays here (never `export *`), so the duplicate type names don't collide.

import type { CefrLevel } from "@/components/languages/LessonRenderer.types";
import type { ItalianLessonInput } from "./normalize";

import a1Lessons from "./lessons-a1";
import a2Lessons from "./lessons-a2";
import b1Lessons from "./lessons-b1";
import b2Lessons from "./lessons-b2";
import c1Lessons from "./lessons-c1";
import c2Lessons from "./lessons-c2";

export { a1Lessons, a2Lessons, b1Lessons, b2Lessons, c1Lessons, c2Lessons };
export { normalizeItalianLesson } from "./normalize";
export type { ItalianLessonInput } from "./normalize";

export type ItalianLevel = Extract<CefrLevel, "A1" | "A2" | "B1" | "B2" | "C1" | "C2">;

// Lessons grouped by CEFR level, in curriculum order.
export const ITALIAN_LESSONS_BY_LEVEL: Record<ItalianLevel, ItalianLessonInput[]> = {
  A1: a1Lessons,
  A2: a2Lessons,
  B1: b1Lessons,
  B2: b2Lessons,
  C1: c1Lessons,
  C2: c2Lessons,
};

// Every Italian lesson, flattened in A1 → C2 order.
export const allItalianLessons: ItalianLessonInput[] = [
  ...a1Lessons,
  ...a2Lessons,
  ...b1Lessons,
  ...b2Lessons,
  ...c1Lessons,
  ...c2Lessons,
];
