// src/languages/punjabi/index.ts
//
// Barrel + module foundation for the Punjabi lesson pack.

import type { CefrLevel } from "@/components/languages/LessonRenderer.types";
import type { PunjabiCefrLevel, PunjabiLesson } from "./lessons";

import a1Lessons from "./lessons-a1";

export type { PunjabiCefrLevel, PunjabiLesson } from "./lessons";
export type {
  PunjabiDialogueLine,
  PunjabiExercise,
  PunjabiSentence,
  PunjabiVocabEntry,
} from "./lessons";
export { normalizePunjabiLesson } from "./normalize";
export { a1Lessons };

export type PunjabiLanguageMeta = {
  code: "pa";
  nativeName: string;
  name_vi: string;
  name_en: string;
  script: string;
  scriptUnicodeRange: string;
  primaryScript: "Gurmukhi";
  shahmukhiAwarenessOnly: boolean;
  tonal: boolean;
  levels: PunjabiCefrLevel[];
};

export const PUNJABI_LANGUAGE: PunjabiLanguageMeta = {
  code: "pa",
  nativeName: "ਪੰਜਾਬੀ",
  name_vi: "Tiếng Punjabi",
  name_en: "Punjabi",
  script: "Gurmukhi (primary); Shahmukhi awareness only",
  scriptUnicodeRange: "U+0A00–U+0A7F",
  primaryScript: "Gurmukhi",
  shahmukhiAwarenessOnly: true,
  tonal: true,
  levels: ["A1", "A2", "B1", "B2", "C1", "C2"],
};

export type PunjabiLevel = Extract<
  CefrLevel,
  "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
>;

export const PUNJABI_LESSONS_BY_LEVEL: Record<PunjabiLevel, PunjabiLesson[]> = {
  A1: a1Lessons,
  A2: [],
  B1: [],
  B2: [],
  C1: [],
  C2: [],
};

export const allPunjabiLessons: PunjabiLesson[] = [...a1Lessons];
