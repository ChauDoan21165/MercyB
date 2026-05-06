// src/languages/vietnamese/normalize.ts
//
// Converts VietnameseLesson to the shared LessonRenderer contract.

import type { NormalizedLesson } from "@/components/languages/LessonRenderer.types";
import type { VietnameseLesson } from "./lessons";

export function normalizeVietnameseLesson(
  lesson: VietnameseLesson,
): NormalizedLesson {
  return {
    id: lesson.id,
    level: lesson.level,
    title: {
      vi: lesson.title_en,
      en: lesson.subtitle,
    },
    intro: lesson.intro,
    sentences: lesson.phrases.map((phrase) => ({
      native: phrase.vietnamese,
      romanization: phrase.pronunciation,
      en: phrase.english,
      note: phrase.context,
    })),
    dialogue: lesson.dialogue?.map((line) => ({
      speaker: line.speaker,
      native: line.vietnamese,
      romanization: line.pronunciation,
      en: line.english,
    })),
    culturalNotesVi: lesson.cultural_note,
    tipAdviceVi: lesson.tip,
  };
}
