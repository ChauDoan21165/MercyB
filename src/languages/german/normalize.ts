// src/languages/german/normalize.ts
//
// Converts GermanLesson → NormalizedLesson for the shared <LessonRenderer>.
// Mirrors French's mapping (German content lives in s.en for legacy reasons).
// German exercises are nested-only in the data — verified across all 50
// lessons (no flat-shape exists, unlike French 21-50). The dead flat-shape
// renderer branch was removed in commit d1429d9c.

import type { GermanLesson, Exercise as GermanExercise } from "./lessons";
import type {
  NormalizedExercise,
  NormalizedLesson,
} from "@/components/languages/LessonRenderer.types";
import { lessonAudioBase } from "@/lib/lessonAudio";

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
      pronunciationFocusEn: s.pronunciation_focus_en,
    })),
    vocabulary: lesson.vocabulary?.map((v) => ({
      native: v.word,
      en: v.en,
      vi: v.vi,
      phonetic: v.pronunciation_vi,
      phoneticEn: v.pronunciation_en,
    })),
    dialogue: lesson.dialogue?.map((d) => ({
      speaker: d.speaker,
      native: d.text,
      vi: d.vi,
    })),
    exercises: normalizeGermanExercises(lesson.exercises),
    culturalNotesVi: lesson.cultural_notes_vi,
    culturalNotesEn: lesson.cultural_notes_en,
    tipAdviceVi: lesson.tip_advice_vi,
    tipAdviceEn: lesson.tip_advice_en,
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
        instructionEn: ex.instruction_en,
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
