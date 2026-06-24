// src/languages/russian/normalize.ts
//
// Converts RussianLesson -> NormalizedLesson for the shared lesson renderer.

import type { RussianExercise, RussianLesson } from "./lessons";
import type {
  NormalizedExercise,
  NormalizedLesson,
} from "@/components/languages/LessonRenderer.types";

function hashStringId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function normalizeRussianLesson(
  lesson: RussianLesson,
  id?: number,
): NormalizedLesson {
  return {
    id: id ?? hashStringId(lesson.id),
    level: lesson.level,
    title: { vi: lesson.title_vi, en: lesson.title_en, native: "Русский" },
    introVi: lesson.intro_vi,
    introEn: lesson.intro_en,
    sentences: (lesson.sentences ?? []).map((sentence) => ({
      native: sentence.russian,
      romanization: sentence.romanization,
      en: sentence.en,
      vi: sentence.vi,
      pronunciationFocus: sentence.pronunciation_focus,
      pronunciationFocusEn: sentence.pronunciation_focus_en,
    })),
    vocabulary: lesson.vocabulary?.map((entry) => ({
      native: entry.word,
      romanization: entry.romanization,
      en: entry.en,
      vi: entry.vi,
      phonetic: entry.pronunciation_vi,
      phoneticEn: entry.pronunciation_en,
    })),
    dialogue: lesson.dialogue?.map((line) => ({
      speaker: line.speaker,
      native: line.text,
      romanization: line.romanization,
      en: line.en,
      vi: line.vi,
    })),
    exercises: normalizeRussianExercises(lesson.exercises),
    culturalNotesVi: lesson.cultural_notes_vi,
    culturalNotesEn: lesson.cultural_notes_en,
    tipAdviceVi: lesson.tip_advice_vi,
    tipAdviceEn: lesson.tip_advice_en,
  };
}

function normalizeRussianExercises(
  exercises: RussianExercise[] | undefined,
): NormalizedExercise[] | undefined {
  if (!exercises || exercises.length === 0) return undefined;

  const out: NormalizedExercise[] = [];
  for (const exercise of exercises) {
    const kind = exercise.type.replace("_", "-");

    if (kind === "matching") {
      out.push({
        kind: "matching",
        instruction: exercise.instruction_vi,
        instructionEn: exercise.instruction_en,
        pairs: exercise.items.map((item) => ({
          a: item.prompt,
          b: item.answer,
        })),
      });
    } else if (kind === "translation") {
      for (const item of exercise.items) {
        out.push({
          kind: "translation",
          vi: item.prompt,
          native: item.answer,
        });
      }
    } else if (kind === "fill-blank") {
      for (const item of exercise.items) {
        out.push({
          kind: "fill-blank",
          question: item.prompt,
          answer: item.answer,
        });
      }
    }
  }

  return out.length > 0 ? out : undefined;
}
