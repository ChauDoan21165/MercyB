// src/languages/korean/normalize.ts
//
// Converts KoreanLesson → NormalizedLesson for the shared <LessonRenderer>.
//
// Korean field-name notes:
//   - sentences carry full {korean, romanized, en, vi}
//   - vocab/dialogue use {hangul, meaning} where `meaning` is Vietnamese
//     glossing (verified by spot-reading lessons 1-20 — meaning values like
//     "Xin chào", "tên", "phụ âm cuối"); mapped to NormalizedVocab/Dialogue.vi
//   - exercises use a discriminated union keyed by `type`
//
// Inline type definitions are duplicated here for now; PR-C will replace
// them with imports from '@/components/languages/LessonRenderer.types'
// once A1's canonical types file lands.

import type { KoreanLesson, KoreanExercise } from "./lessons";

// ────────────────────────────────────────────────────────────────────────
// Inline contract — TODO(PR-C): replace with import from
// '@/components/languages/LessonRenderer.types'
// ────────────────────────────────────────────────────────────────────────

type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

type NormalizedExercise =
  | { kind: "fill-blank"; question: string; answer: string }
  | { kind: "matching"; instruction?: string; pairs: Array<{ a: string; b: string }> }
  | { kind: "translation"; vi: string; native: string; romanization?: string };

type NormalizedIdiomGloss = {
  idiom: string;
  literal: string;
  meaning: string;
  example: string;
};

type NormalizedLesson = {
  id: number;
  level: CefrLevel;
  title: { vi: string; en: string; native?: string; romanization?: string };
  intro?: string;
  sentences: Array<{
    native: string;
    romanization?: string;
    en?: string;
    vi?: string;
    pronunciationFocus?: string[];
    note?: string;
  }>;
  vocabulary?: Array<{
    native: string;
    romanization?: string;
    en?: string;
    vi?: string;
    phonetic?: string;
  }>;
  dialogue?: Array<{
    speaker: string;
    native: string;
    romanization?: string;
    en?: string;
    vi?: string;
  }>;
  exercises?: NormalizedExercise[];
  culturalNotesVi?: string;
  tipAdviceVi?: string;
  grammar?: Array<{ point: string; explanation: string }>;
  // B2 fields — forward-compatible passthrough; raw data does not yet have these.
  // Cast access via (lesson as any) until the per-language Lesson types pick them up.
  dialogueLong?: Array<{
    speaker: string;
    native: string;
    romanization?: string;
    en?: string;
    vi?: string;
  }>;
  roleplayPrompts?: string[];
  registerNotes?: string;
  idiomGlosses?: NormalizedIdiomGloss[];
};

// ────────────────────────────────────────────────────────────────────────

export function normalizeKoreanLesson(
  lesson: KoreanLesson,
  id?: number,
): NormalizedLesson {
  return {
    id: id ?? lesson.id,
    level: lesson.level,
    title: { vi: lesson.title_vi, en: lesson.title_en },
    intro: lesson.intro_vi,
    sentences: lesson.sentences.map((s) => ({
      native: s.korean,
      romanization: s.romanized,
      en: s.en,
      vi: s.vi,
    })),
    vocabulary: lesson.vocabulary.map((v) => ({
      native: v.hangul,
      vi: v.meaning,
    })),
    dialogue: lesson.dialogue.map((d) => ({
      speaker: d.speaker,
      native: d.hangul,
      vi: d.meaning,
    })),
    exercises: lesson.exercises.map(normalizeKoreanExercise),
    culturalNotesVi: (lesson as any).cultural_notes_vi,
    tipAdviceVi: (lesson as any).tip_advice_vi,
    dialogueLong: (lesson as any).dialogue_long?.map((line: any) => ({
      speaker: line.speaker,
      native: line.korean,
      en: line.english,
      vi: line.vi,
    })),
    roleplayPrompts: (lesson as any).roleplay_prompts,
    registerNotes: (lesson as any).register_notes,
    idiomGlosses: (lesson as any).idiom_glosses?.map((g: any) => ({
      idiom: g.idiom,
      literal: g.literal,
      meaning: g.meaning,
      example: g.example,
    })),
  };
}

function normalizeKoreanExercise(ex: KoreanExercise): NormalizedExercise {
  switch (ex.type) {
    case "fill-blank":
      return { kind: "fill-blank", question: ex.question, answer: ex.answer };
    case "matching":
      return {
        kind: "matching",
        instruction: ex.instruction,
        pairs: ex.pairs.map((p) => ({ a: p.hangul, b: p.meaning })),
      };
    case "translation":
      return { kind: "translation", vi: ex.vietnamese, native: ex.hangul };
  }
}
