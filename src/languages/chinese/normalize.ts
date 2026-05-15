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

import type { ChineseLesson, ChineseExercise } from "./lessons";
import type {
  NormalizedExercise,
  NormalizedLesson,
} from "@/components/languages/LessonRenderer.types";
import { lessonAudioBase } from "@/lib/lessonAudio";

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
    sentences: (lesson.sentences ?? []).map((s) => ({
      native: s.chinese,
      romanization: s.pinyin,
      en: s.english,
      vi: s.vi,
      pronunciationFocus: s.pronunciation_focus,
      pronunciationFocusEn: s.pronunciation_focus_en,
    })),
    vocabulary: (lesson.vocab ?? []).map((v) => ({
      native: v.chinese,
      romanization: v.pinyin,
      en: v.english,
      vi: v.vi,
    })),
    dialogue: (lesson.dialogue ?? []).map((d) => ({
      speaker: d.speaker,
      native: d.chinese,
      romanization: d.pinyin,
      en: d.english,
      vi: d.vi,
    })),
    exercises: (lesson.exercises ?? []).map(normalizeChineseExercise),
    culturalNotesVi: lesson.cultural_notes_vi,
    culturalNotesEn: lesson.cultural_notes_en,
    tipAdviceVi: lesson.tip_advice_vi,
    tipAdviceEn: lesson.tip_advice_en,
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
