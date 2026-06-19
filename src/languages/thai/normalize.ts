// src/languages/thai/normalize.ts
//
// Converts a ThaiLesson → NormalizedLesson for the shared <LessonRenderer>.
//
// Thai is script-bearing (Thai abugida) and the renderer's NormalizedSentence /
// NormalizedVocabEntry / NormalizedDialogueLine all expose a `romanization`
// slot, so this normalizer maps the Thai source into `native` and carries the
// transliteration through `romanization`. The renderer stays field-name-pure;
// all Thai-specific field names (`thai`, `pronunciation_focus`, …) are resolved
// here at the module boundary.

import type {
  NormalizedExercise,
  NormalizedLesson,
} from "@/components/languages/LessonRenderer.types";
import type { ThaiExercise, ThaiLesson } from "./lessons";

export function normalizeThaiLesson(lesson: ThaiLesson): NormalizedLesson {
  return {
    id: lesson.id,
    level: lesson.level,
    title: { vi: lesson.title_vi, en: lesson.title_en },
    introVi: lesson.intro_vi,
    introEn: lesson.intro_en,
    sentences: lesson.sentences.map((s) => ({
      native: s.thai,
      romanization: s.romanization,
      en: s.en,
      vi: s.vi,
      pronunciationFocus: s.pronunciation_focus,
      pronunciationFocusEn: s.pronunciation_focus_en,
    })),
    vocabulary: lesson.vocabulary.map((v) => ({
      native: v.thai,
      romanization: v.romanization,
      en: v.en,
      vi: v.vi,
    })),
    dialogue: lesson.dialogue?.map((d) => ({
      speaker: d.speaker,
      native: d.thai,
      romanization: d.romanization,
      en: d.en,
      vi: d.vi,
    })),
    exercises: normalizeThaiExercises(lesson.exercises),
    culturalNotesVi: lesson.cultural_notes_vi,
    culturalNotesEn: lesson.cultural_notes_en,
    tipAdviceVi: lesson.tip_advice_vi,
    tipAdviceEn: lesson.tip_advice_en,
    // audioBase intentionally omitted: there is no "th" audio bundle yet, and
    // NormalizedLesson.audioBase is optional — LessonAudioButton renders nothing
    // until the Thai audio bundle ships.
  };
}

function normalizeThaiExercises(
  exercises: ThaiLesson["exercises"],
): NormalizedExercise[] | undefined {
  if (!exercises || exercises.length === 0) return undefined;
  const out: NormalizedExercise[] = [];
  for (const ex of exercises as ThaiExercise[]) {
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
        pairs: ex.pairs.map((p) => ({ a: p.thai, b: p.meaning })),
      });
    } else if (ex.type === "translation") {
      out.push({
        kind: "translation",
        vi: ex.vi,
        en: ex.en,
        native: ex.thai,
      });
    }
  }
  return out.length > 0 ? out : undefined;
}
