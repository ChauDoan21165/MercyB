// src/languages/chinese/normalize.ts
//
// Converts ChineseLesson → NormalizedLesson for the shared <LessonRenderer>.
//
// Chinese title shape:
//   - lesson.title       → Chinese characters (e.g. "你好")          → title.native
//   - lesson.pinyin      → romanization     (e.g. "nǐ hǎo")           → title.romanization
//   - lesson.topic       → English label    (e.g. "Greetings")        → title.en (and title.vi fallback)
// There is no Vietnamese title in the data; title.vi falls back to lesson.topic.
//
// Chinese vocabulary uses the legacy `vocab` field (not `vocabulary`).
// Chinese sentences have no Vietnamese; vi is undefined.
//
// Inline type definitions are duplicated here for now; PR-C will replace
// them with imports from '@/components/languages/LessonRenderer.types'
// once A1's canonical types file lands.

import type { ChineseLesson, ChineseExercise } from "./lessons";
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

export function normalizeChineseLesson(
  lesson: ChineseLesson,
  id?: number,
): NormalizedLesson {
  return {
    id: id ?? lesson.id,
    level: lesson.level,
    title: {
      vi: lesson.topic,
      en: lesson.topic,
      native: lesson.title,
      romanization: lesson.pinyin,
    },
    sentences: lesson.sentences.map((s) => ({
      native: s.chinese,
      romanization: s.pinyin,
      en: s.english,
      vi: s.vi,
      pronunciationFocus: s.pronunciation_focus,
    })),
    vocabulary: lesson.vocab.map((v) => ({
      native: v.chinese,
      romanization: v.pinyin,
      en: v.english,
      vi: v.vi,
    })),
    dialogue: lesson.dialogue.map((d) => ({
      speaker: d.speaker,
      native: d.chinese,
      romanization: d.pinyin,
      en: d.english,
      vi: d.vi,
    })),
    exercises: lesson.exercises.map(normalizeChineseExercise),
    culturalNotesVi: (lesson as any).cultural_notes_vi,
    tipAdviceVi: (lesson as any).tip_advice_vi,
    dialogueLong: (lesson as any).dialogue_long?.map((line: any) => ({
      speaker: line.speaker,
      native: line.chinese,
      romanization: line.pinyin,
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
    audioBase: lessonAudioBase("zh", lesson.id, lesson.level),
  };
}

function normalizeChineseExercise(ex: ChineseExercise): NormalizedExercise {
  switch (ex.type) {
    case "fill-blank":
      return { kind: "fill-blank", question: ex.question, answer: ex.answer };
    case "matching":
      return {
        kind: "matching",
        instruction: ex.instruction,
        pairs: ex.pairs.map((p) => ({ a: p.chinese, b: p.english })),
      };
    case "translation":
      return {
        kind: "translation",
        vi: ex.vietnamese,
        native: ex.chinese,
        romanization: ex.pinyin,
      };
  }
}
