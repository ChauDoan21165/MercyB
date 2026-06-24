// src/languages/punjabi/index.ts
//
// Barrel + module foundation for the Punjabi lesson pack.

import type { CefrLevel } from "@/components/languages/LessonRenderer.types";
import type { PunjabiCefrLevel, PunjabiLesson } from "./lessons";

import * as a1Module from "./lessons-a1";
import * as a1CoreModule from "./lessons-a1-core";
import * as a2Module from "./lessons-a2-core";
import * as b1Module from "./lessons-b1-core";
import * as b2Module from "./lessons-b2-core";
import * as c1Module from "./lessons-c1-academic";
import * as c2Module from "./lessons-c2-discourse";
import * as survivalModule from "./lessons-survival";

export type { PunjabiCefrLevel, PunjabiLesson } from "./lessons";
export type {
  PunjabiDialogueLine,
  PunjabiExercise,
  PunjabiSentence,
  PunjabiVocabEntry,
} from "./lessons";
export { normalizePunjabiLesson } from "./normalize";

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

function asPunjabiLessons(value: unknown): PunjabiLesson[] {
  return Array.isArray(value) ? (value as PunjabiLesson[]) : [];
}

function firstPunjabiLessonArray(source: unknown): PunjabiLesson[] {
  if (!source) return [];

  if (Array.isArray(source)) {
    return source as PunjabiLesson[];
  }

  const record = source as Record<string, unknown>;
  const candidates = [
    record.default,
    record.lessons,
    record.punjabiB1CoreLessons,
    record.punjabiB2CoreLessons,
    record.punjabiSurvivalLessons,
  ];

  for (const candidate of candidates) {
    const lessons = asPunjabiLessons(candidate);
    if (lessons.length > 0) return lessons;
  }

  return [];
}

export const a1Lessons = firstPunjabiLessonArray(a1Module);
export const a1CoreLessons = firstPunjabiLessonArray(a1CoreModule);
export const a2Lessons = firstPunjabiLessonArray(a2Module);
export const b1Lessons = firstPunjabiLessonArray(b1Module);
export const b2Lessons = firstPunjabiLessonArray(b2Module);
export const c1Lessons = firstPunjabiLessonArray(c1Module);
export const c2Lessons = firstPunjabiLessonArray(c2Module);
export const survivalLessons = firstPunjabiLessonArray(survivalModule);

export const PUNJABI_LESSONS_BY_LEVEL: Record<PunjabiLevel, PunjabiLesson[]> = {
  A1: [...a1Lessons, ...a1CoreLessons, ...survivalLessons],
  A2: a2Lessons,
  B1: b1Lessons,
  B2: b2Lessons,
  C1: c1Lessons,
  C2: c2Lessons,
};

export const allPunjabiLessons: PunjabiLesson[] = [
  ...PUNJABI_LESSONS_BY_LEVEL.A1,
  ...PUNJABI_LESSONS_BY_LEVEL.A2,
  ...PUNJABI_LESSONS_BY_LEVEL.B1,
  ...PUNJABI_LESSONS_BY_LEVEL.B2,
  ...PUNJABI_LESSONS_BY_LEVEL.C1,
  ...PUNJABI_LESSONS_BY_LEVEL.C2,
];
