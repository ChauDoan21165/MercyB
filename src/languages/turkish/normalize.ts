// src/languages/turkish/normalize.ts

import type {
  NormalizedExercise,
  NormalizedLesson,
} from "@/components/languages/LessonRenderer.types";
import type { TurkishExerciseInput, TurkishLessonInput } from "./lessons";

const TURKISH_DIACRITIC_MAP: Record<string, string> = {
  ç: "c",
  Ç: "C",
  ğ: "g",
  Ğ: "G",
  ı: "i",
  İ: "I",
  ö: "o",
  Ö: "O",
  ş: "s",
  Ş: "S",
  ü: "u",
  Ü: "U",
};

export function foldTurkishDiacritics(input: string): string {
  let out = "";
  for (const ch of input) out += TURKISH_DIACRITIC_MAP[ch] ?? ch;
  return out;
}

export function turkishAnswersMatch(a: string, b: string): boolean {
  const norm = (value: string) =>
    foldTurkishDiacritics(value)
      .toLocaleLowerCase("tr")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .trim()
      .replace(/\s+/g, " ");
  return norm(a) === norm(b);
}

function hashStringId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function normalizeTurkishLesson(
  lesson: TurkishLessonInput,
  id?: number,
): NormalizedLesson {
  return {
    id: id ?? hashStringId(lesson.id),
    level: lesson.level,
    title: { vi: lesson.title_vi, en: lesson.title_en },
    introVi: lesson.intro_vi,
    introEn: lesson.intro_en,
    sentences: lesson.sentences.map((sentence) => ({
      native: sentence.tr,
      en: sentence.en,
      vi: sentence.vi,
      pronunciationFocus: sentence.pronunciation_focus,
      pronunciationFocusEn: sentence.pronunciation_focus_en,
    })),
    vocabulary: lesson.vocabulary.map((entry) => ({
      native: entry.word,
      en: entry.en,
      vi: entry.vi,
      phonetic: entry.pronunciation_vi,
      phoneticEn: entry.pronunciation_en,
    })),
    dialogue: lesson.dialogue?.map((line) => ({
      speaker: line.speaker,
      native: line.text,
      en: line.en,
      vi: line.vi,
    })),
    exercises: normalizeTurkishExercises(lesson.exercises),
    culturalNotesVi: lesson.cultural_notes_vi,
    culturalNotesEn: lesson.cultural_notes_en,
    tipAdviceVi: lesson.tip_advice_vi,
    tipAdviceEn: lesson.tip_advice_en,
    registerNotesVi: lesson.register_notes,
    registerNotesEn: lesson.register_notes_en,
    roleplayPromptsVi: lesson.roleplay_prompts,
    roleplayPromptsEn: lesson.roleplay_prompts_en,
    idiomGlosses: lesson.idiom_glosses?.map((gloss) => ({
      idiom: gloss.idiom,
      literal: gloss.literal,
      meaning: gloss.meaning,
      example: gloss.example,
      literalEn: gloss.literal_en,
      meaningEn: gloss.meaning_en,
      exampleEn: gloss.example_en,
    })),
    dialogueLong: lesson.dialogue_long?.map((line) => ({
      speaker: line.speaker,
      native: line.text,
      en: line.en,
      vi: line.vi,
    })),
  };
}

function normalizeTurkishExercises(
  exercises: TurkishLessonInput["exercises"],
): NormalizedExercise[] | undefined {
  if (!exercises || exercises.length === 0) return undefined;

  const normalized = exercises.map((exercise) => normalizeTurkishExercise(exercise));
  return normalized.length > 0 ? normalized : undefined;
}

function normalizeTurkishExercise(exercise: TurkishExerciseInput): NormalizedExercise {
  if (exercise.type === "fill_blank") {
    return {
      kind: "fill-blank",
      question: exercise.question,
      answer: exercise.answer,
      hint: exercise.hint_vi,
      hintEn: exercise.hint_en,
    };
  }

  if (exercise.type === "matching") {
    return {
      kind: "matching",
      instruction: exercise.instruction_vi,
      instructionEn: exercise.instruction_en,
      pairs: exercise.pairs,
    };
  }

  return {
    kind: "translation",
    vi: exercise.vietnamese,
    en: exercise.english,
    native: exercise.turkish,
  };
}
