// src/languages/thai/index.ts
//
// Barrel + module foundation for the Thai lesson pack. Exposes the language
// metadata, the per-level lesson arrays, the level-grouped + flattened
// aggregates, and the normalizer that turns a ThaiLesson into the renderer's
// NormalizedLesson shape.
//
// Scope: this is a FOUNDATION — only the A1 starter lesson ships today. The
// A2…C2 slots exist in the metadata/types so later rounds can backfill without
// reshaping this module.

import type { CefrLevel } from "@/components/languages/LessonRenderer.types";
import type { ThaiCefrLevel, ThaiLesson } from "./lessons";

import a1Lessons from "./lessons-a1";

export type { ThaiLesson, ThaiCefrLevel } from "./lessons";
export type {
  ThaiSentence,
  ThaiVocabEntry,
  ThaiDialogueLine,
  ThaiExercise,
} from "./lessons";
export { normalizeThaiLesson } from "./normalize";
export { a1Lessons };

// ── Language metadata ───────────────────────────────────────────────────
// The Vietnamese-first / English-second pair are independent siblings, not
// translations — each is authored for its own audience. `script` and
// `scriptUnicodeRange` document that Thai is its own abugida and must not be
// modelled on the CJK / Hangul / kana / Cyrillic assumptions of the other
// language modules.

export type ThaiLanguageMeta = {
  /** ISO 639-1 code. */
  code: "th";
  /** Endonym (Thai script). */
  nativeName: string;
  /** Vietnamese name of the language. */
  name_vi: string;
  /** English name of the language. */
  name_en: string;
  /** Writing-system description. */
  script: string;
  /** Unicode block covering the Thai script. */
  scriptUnicodeRange: string;
  /** Thai is a tonal language. */
  tonal: boolean;
  /** CEFR levels the pack is structured for. */
  levels: ThaiCefrLevel[];
};

export const THAI_LANGUAGE: ThaiLanguageMeta = {
  code: "th",
  nativeName: "ภาษาไทย",
  name_vi: "Tiếng Thái",
  name_en: "Thai",
  script: "Thai (abugida)",
  scriptUnicodeRange: "U+0E00–U+0E7F",
  tonal: true,
  levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
};

export type ThaiLevel = Extract<
  CefrLevel,
  "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
>;

// Lessons grouped by CEFR level, in curriculum order. Only A1 is populated in
// this foundation round; the rest are intentionally empty arrays.
export const THAI_LESSONS_BY_LEVEL: Record<ThaiLevel, ThaiLesson[]> = {
  A1: a1Lessons,
  A2: [],
  B1: [],
  B2: [],
  C1: [],
  C2: [],
};

// Every Thai lesson, flattened in A1 → C2 order.
export const allThaiLessons: ThaiLesson[] = [...a1Lessons];

// ── Integration glue (WAVE7): per-level lesson packs ─────────────────────
// The A2…C2 + survival packs each declare their OWN lesson shape (see the
// per-file `Thai*Lesson` types) — they are NOT structurally identical to the
// A1 `ThaiLesson` above, so they intentionally do NOT flow into the strictly
// typed `THAI_LESSONS_BY_LEVEL` / `allThaiLessons` (which stay the A1
// renderer-normalized path). Following the Italian barrel convention we
// re-export only the DATA arrays under stable names — never `export *`, so the
// divergent per-file type names never collide. Consumers import the pack they
// need; each pack ships its own self-describing entries (Thai script +
// romanization + Vietnamese & English explanations). Native review is
// deferred. This is additive surfacing, not a type refactor.
export { default as a2CoreLessons } from "./lessons-a2-core";
export { default as b1CoreLessons } from "./lessons-b1-core";
export { default as b2CoreLessons } from "./lessons-b2-core";
export { default as c1AcademicLessons } from "./lessons-c1-academic";
export { default as c2DiscourseLessons } from "./lessons-c2-discourse";
export { default as survivalLessons } from "./lessons-survival";
