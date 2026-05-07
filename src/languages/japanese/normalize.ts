// src/languages/japanese/normalize.ts
//
// Converts JapaneseLesson → NormalizedLesson for the shared <LessonRenderer>.
// Japanese uses 'examples' instead of 'sentences' on the lesson; this is
// collapsed into NormalizedLesson.sentences.
//
// JapaneseLesson has only a single `title: string` field (no separate vi/en
// in the data), so title.vi and title.en both fall back to lesson.title.
// The renderer or page can choose to deduplicate when both halves match.
//
// Inline type definitions are duplicated here for now; PR-C will replace
// them with imports from '@/components/languages/LessonRenderer.types'
// once A1's canonical types file lands.

import type { JapaneseLesson, JapaneseExercise } from "./lessons";
import { lessonAudioBase } from "@/lib/lessonAudio";

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
  audioBase?: string;
};

// ────────────────────────────────────────────────────────────────────────

export function normalizeJapaneseLesson(
  lesson: JapaneseLesson,
  id?: number,
): NormalizedLesson {
  return {
    id: id ?? lesson.id,
    level: lesson.level,
    // Japanese data has only one `title` field; both halves fall back to it.
    title: { vi: lesson.title, en: lesson.title },
    sentences: lesson.examples.map((e) => ({
      native: e.japanese,
      en: e.english,
      pronunciationFocus: e.pronunciation_focus,
    })),
    vocabulary: lesson.vocabulary.map((v) => ({
      native: v.japanese,
      en: v.english,
    })),
    dialogue: lesson.dialogue?.map((d) => ({
      speaker: d.speaker,
      native: d.japanese,
      en: d.english,
    })),
    exercises: lesson.exercises?.map(normalizeJapaneseExercise),
    grammar: lesson.grammar,
    // cultural_notes_vi / tip_advice_vi are not yet on JapaneseLesson; passthrough via cast.
    // A5's B2 Japanese sample lessons surface these fields at the top level (matching A3's French template).
    culturalNotesVi: (lesson as any).cultural_notes_vi,
    tipAdviceVi: (lesson as any).tip_advice_vi,
    dialogueLong: (lesson as any).dialogue_long?.map((line: any) => ({
      speaker: line.speaker,
      native: line.japanese,
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
    audioBase: lessonAudioBase("ja", lesson.id, lesson.level),
  };
}

function normalizeJapaneseExercise(ex: JapaneseExercise): NormalizedExercise {
  switch (ex.type) {
    case "fill-blank":
      return { kind: "fill-blank", question: ex.question, answer: ex.answer };
    case "matching":
      return {
        kind: "matching",
        instruction: ex.instruction,
        pairs: ex.pairs.map((p) => ({ a: p.japanese, b: p.english })),
      };
    case "translation":
      return { kind: "translation", vi: ex.vietnamese, native: ex.japanese };
  }
}
