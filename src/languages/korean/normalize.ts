// src/languages/korean/normalize.ts
//
// Converts KoreanLesson → NormalizedLesson for the shared <LessonRenderer>.
//
// Korean field-name notes:
//   - sentences carry full {korean, romanized, en, vi, pronunciation_focus?}
//   - vocab/dialogue use {hangul, meaning} where `meaning` is Vietnamese
//     glossing (verified by spot-reading lessons 1-20 — meaning values like
//     "Xin chào", "tên", "phụ âm cuối"); mapped to NormalizedVocab/Dialogue.vi
//   - exercises use a discriminated union keyed by `type`

import type { KoreanLesson, KoreanExercise } from "./lessons";
import type {
  NormalizedExercise,
  NormalizedLesson,
} from "@/components/languages/LessonRenderer.types";
import { lessonAudioBase } from "@/lib/lessonAudio";

export function normalizeKoreanLesson(
  lesson: KoreanLesson,
  id?: number,
): NormalizedLesson {
  return {
    id: id ?? lesson.id,
    level: lesson.level,
    title: { vi: lesson.title_vi, en: lesson.title_en },
    intro: lesson.intro_vi,
    sentences: (lesson.sentences ?? []).map((s) => ({
      native: s.korean,
      romanization: s.romanized,
      en: s.en,
      vi: s.vi,
      pronunciationFocus: s.pronunciation_focus,
      pronunciationFocusEn: s.pronunciation_focus_en,
    })),
    vocabulary: (lesson.vocabulary ?? []).map((v) => ({
      native: v.hangul,
      vi: v.meaning,
    })),
    dialogue: (lesson.dialogue ?? []).map((d) => ({
      speaker: d.speaker,
      native: d.hangul ?? d.text_ko ?? "",
      en: d.text_en,
      vi: d.text_vi ?? d.meaning,
    })),
    exercises: (lesson.exercises ?? []).map(normalizeKoreanExercise),
    culturalNotesVi: lesson.cultural_notes_vi,
    culturalNotesEn: lesson.cultural_notes_en,
    tipAdviceVi: lesson.tip_advice_vi,
    tipAdviceEn: lesson.tip_advice_en,
    audioBase: lessonAudioBase("ko", lesson.id, lesson.level),
  };
}

function normalizeKoreanExercise(ex: KoreanExercise): NormalizedExercise {
  switch (ex.type) {
    case "fill-blank":
      return { kind: "fill-blank", question: ex.question, answer: ex.answer };
    case "matching":
      return {
        kind: "matching",
        instruction: ex.instruction,
        pairs: ex.pairs.map((p) => ({ a: p.hangul, b: p.meaning })),
      };
    case "translation":
      return { kind: "translation", vi: ex.vietnamese, native: ex.hangul };
  }
}
