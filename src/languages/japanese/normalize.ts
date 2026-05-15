// src/languages/japanese/normalize.ts
//
// Converts JapaneseLesson → NormalizedLesson for the shared <LessonRenderer>.
// Japanese uses 'examples' instead of 'sentences' on the lesson; this is
// collapsed into NormalizedLesson.sentences.
//
// JapaneseLesson has only a single `title: string` field (no separate vi/en
// in the data), so title.vi and title.en both fall back to lesson.title.
// The renderer or page can choose to deduplicate when both halves match.

import type { JapaneseLesson, JapaneseExercise } from "./lessons";
import type {
  NormalizedExercise,
  NormalizedLesson,
} from "@/components/languages/LessonRenderer.types";
import { lessonAudioBase } from "@/lib/lessonAudio";

export function normalizeJapaneseLesson(
  lesson: JapaneseLesson,
  id?: number,
): NormalizedLesson {
  return {
    id: id ?? lesson.id,
    level: lesson.level,
    // Japanese data has only one `title` field; both halves fall back to it.
    title: { vi: lesson.title, en: lesson.title },
    sentences: (lesson.examples ?? []).map((e) => ({
      native: e.japanese,
      en: e.english,
      pronunciationFocus: e.pronunciation_focus,
      pronunciationFocusEn: e.pronunciation_focus_en,
    })),
    vocabulary: (lesson.vocabulary ?? []).map((v) => ({
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
    culturalNotesVi: lesson.cultural_notes_vi,
    culturalNotesEn: lesson.cultural_notes_en,
    tipAdviceVi: lesson.tip_advice_vi,
    tipAdviceEn: lesson.tip_advice_en,
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
