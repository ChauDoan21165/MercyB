// src/languages/german/normalize.ts
//
// Converts GermanLesson → NormalizedLesson for the shared <LessonRenderer>.
// Mirrors French's mapping (German content lives in s.en for legacy reasons).
// German exercises are nested-only in the data — verified across all 50
// lessons (no flat-shape exists, unlike French 21-50). The dead flat-shape
// renderer branch was removed in commit d1429d9c.
//
// Inline type definitions are duplicated here for now; PR-C will replace
// them with imports from '@/components/languages/LessonRenderer.types'
// once A1's canonical types file lands.

import type { GermanLesson, Exercise as GermanExercise } from "./lessons";
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

function hashStringId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function normalizeGermanLesson(
  lesson: GermanLesson,
  id?: number,
): NormalizedLesson {
  return {
    id: id ?? hashStringId(lesson.id),
    level: lesson.level,
    title: { vi: lesson.title_vi, en: lesson.title_en },
    sentences: (lesson.sentences ?? []).map((s) => ({
      // German content lives in s.en for legacy reasons (mirrors French)
      native: s.en,
      vi: s.vi,
      pronunciationFocus: s.pronunciation_focus,
    })),
    vocabulary: lesson.vocabulary?.map((v) => ({
      native: v.word,
      en: v.en,
      vi: v.vi,
      phonetic: v.pronunciation_vi,
    })),
    dialogue: lesson.dialogue?.map((d) => ({
      speaker: d.speaker,
      native: d.text,
      vi: d.vi,
    })),
    exercises: normalizeGermanExercises(lesson.exercises),
    culturalNotesVi: lesson.cultural_notes_vi,
    tipAdviceVi: lesson.tip_advice_vi,
    dialogueLong: (lesson as any).dialogue_long?.map((line: any) => ({
      speaker: line.speaker,
      native: line.text,
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
    audioBase: lessonAudioBase("de", lesson.id, lesson.level),
  };
}

function normalizeGermanExercises(
  exercises: GermanExercise[] | undefined,
): NormalizedExercise[] | undefined {
  if (!exercises || exercises.length === 0) return undefined;
  const out: NormalizedExercise[] = [];
  for (const ex of exercises) {
    const kind = String(ex.type ?? "").replace("_", "-");

    if (kind === "matching") {
      out.push({
        kind: "matching",
        instruction: ex.instruction_vi,
        pairs: ex.items.map((it) => ({
          a: it.prompt,
          b: it.answer,
        })),
      });
    } else if (kind === "fill-blank") {
      for (const it of ex.items) {
        out.push({ kind: "fill-blank", question: it.prompt, answer: it.answer });
      }
    } else if (kind === "translation") {
      for (const it of ex.items) {
        out.push({ kind: "translation", vi: it.prompt, native: it.answer });
      }
    }
  }
  return out.length > 0 ? out : undefined;
}
