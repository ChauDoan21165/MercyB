// src/languages/vietnamese/normalize.ts
//
// Converts VietnameseLesson to the shared LessonRenderer contract.
//
// Audio mapping: Vietnamese-for-foreigners uses a different filename scheme
// than the other 5 languages — phrase_${n}.mp3 / dialogue_${n}.mp3 (no
// speaker suffix; voice alternates by index in the generation script).
// We declare that via `audioKinds` so the shared renderer dispatches to
// the correct LessonAudioUnit kind without per-language branching.

import type { NormalizedLesson } from "@/components/languages/LessonRenderer.types";
import { lessonAudioBase } from "@/lib/lessonAudio";
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
    sentences: (lesson.phrases ?? []).map((phrase) => ({
      native: phrase.vietnamese,
      romanization: phrase.pronunciation,
      en: phrase.english,
      ipa_en: phrase.ipa_en,
      note: phrase.context,
    })),
    dialogue: lesson.dialogue?.map((line) => ({
      speaker: line.speaker,
      native: line.vietnamese,
      romanization: line.pronunciation,
      en: line.english,
      ipa_en: line.ipa_en,
    })),
    culturalNotesVi: lesson.cultural_note,
    tipAdviceVi: lesson.tip,
    audioBase: lessonAudioBase("vi", lesson.id, lesson.level),
    audioKinds: { sentence: "phrase", dialogue: "dialogue_vi" },
  };
}
