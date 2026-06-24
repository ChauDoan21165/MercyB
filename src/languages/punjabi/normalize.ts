// src/languages/punjabi/normalize.ts
//
// Converts a PunjabiLesson into the shared LessonRenderer shape. Punjabi
// source text is Gurmukhi-primary and maps to NormalizedLesson.native.

import type {
  NormalizedExercise,
  NormalizedLesson,
} from "@/components/languages/LessonRenderer.types";
import type { PunjabiExercise, PunjabiLesson } from "./lessons";

export function normalizePunjabiLesson(lesson: PunjabiLesson): NormalizedLesson {
  return {
    id: lesson.id,
    level: lesson.level,
    title: { vi: lesson.title_vi, en: lesson.title_en },
    introVi: lesson.intro_vi,
    introEn: lesson.intro_en,
    sentences: lesson.sentences.map((s) => ({
      native: s.gurmukhi,
      romanization: s.romanization,
      en: s.en,
      vi: s.vi,
      pronunciationFocus: s.pronunciation_focus,
      pronunciationFocusEn: s.pronunciation_focus_en,
    })),
    vocabulary: lesson.vocabulary.map((v) => ({
      native: v.gurmukhi,
      romanization: v.romanization,
      en: v.en,
      vi: v.vi,
    })),
    dialogue: lesson.dialogue?.map((d) => ({
      speaker: d.speaker,
      native: d.gurmukhi,
      romanization: d.romanization,
      en: d.en,
      vi: d.vi,
    })),
    exercises: normalizePunjabiExercises(lesson.exercises),
    culturalNotesVi: lesson.cultural_notes_vi,
    culturalNotesEn: lesson.cultural_notes_en,
    tipAdviceVi: lesson.tip_advice_vi,
    tipAdviceEn: lesson.tip_advice_en,
  };
}

function normalizePunjabiExercises(
  exercises: PunjabiLesson["exercises"],
): NormalizedExercise[] | undefined {
  if (!exercises || exercises.length === 0) return undefined;
  const out: NormalizedExercise[] = [];
  for (const ex of exercises as PunjabiExercise[]) {
    if (ex.type === "fill-blank") {
      out.push({
        kind: "fill-blank",
        question: ex.question,
        answer: ex.answer,
        hint: ex.hint_vi,
        hintEn: ex.hint_en,
      });
    } else if (ex.type === "matching") {
      out.push({
        kind: "matching",
        instruction: ex.instruction_vi,
        instructionEn: ex.instruction_en,
        pairs: ex.pairs.map((p) => ({ a: p.gurmukhi, b: p.meaning })),
      });
    } else if (ex.type === "translation") {
      out.push({
        kind: "translation",
        vi: ex.vi,
        en: ex.en,
        native: ex.gurmukhi,
        romanization: ex.romanization,
      });
    }
  }
  return out.length > 0 ? out : undefined;
}
