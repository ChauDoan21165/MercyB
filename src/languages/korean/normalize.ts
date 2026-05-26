// src/languages/korean/normalize.ts
//
// Converts KoreanLesson → NormalizedLesson for the shared <LessonRenderer>.
//
// Korean field-name notes (data shape updated by #514):
//   - sentences carry full {korean, romanized, en, vi, pronunciation_focus?}
//   - vocabulary uses {hangul, meaning} where `meaning` is the Vietnamese
//     gloss (spot-read lessons 1-20: "Xin chào", "tên", …) → NormalizedVocab.vi
//   - short dialogue uses {speaker, hangul|text_ko, meaning, text_vi?,
//     text_en?}: `meaning` is the ENGLISH gloss; `text_vi` (authored ×544
//     in #514) is the Vietnamese source. Normalizer: vi = text_vi ?? meaning,
//     en = text_en; renderer shows pick(uiLanguage, d.en, d.vi).
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
    // intro_vi is Vietnamese; intro_en is absent today, so an
    // English-UI render falls back to VI + a badge (Incidental D).
    introVi: lesson.intro_vi,
    introEn: lesson.intro_en,
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
    registerNotesVi: lesson.register_notes,
    registerNotesEn: lesson.register_notes_en,
    roleplayPromptsVi: lesson.roleplay_prompts,
    roleplayPromptsEn: lesson.roleplay_prompts_en,
    idiomGlosses: lesson.idiom_glosses?.map((g) => ({
      idiom: g.idiom,
      literal: g.literal,
      meaning: g.meaning,
      example: g.example,
      literalEn: g.literal_en,
      meaningEn: g.meaning_en,
      exampleEn: g.example_en,
    })),
    // KoreanB2DialogueLine carries English in `meaning` and Vietnamese
    // in `vi` (verified against lessons-b2/c1/c2 — `meaning` holds full
    // English sentences). Post-#514 short-dialogue `meaning` is ALSO
    // English (its Vietnamese now lives in `text_vi`); only vocab `meaning`
    // is still Vietnamese. Surface `meaning` as `en`; `vi` stays VI-only.
    // The previous `vi: d.vi ?? d.meaning` leaked English into the VI slot
    // whenever a line lacked `vi` — removed (the English now lives in `en`).
    dialogueLong: lesson.dialogue_long?.map((d) => ({
      speaker: d.speaker,
      native: d.hangul,
      en: d.meaning,
      vi: d.vi,
    })),
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
