// src/languages/spanish/normalize.ts
//
// Converts SpanishLesson → NormalizedLesson for the shared <LessonRenderer>.
//
// Key shape decisions:
//
//   - title.vi holds the English title (the learner's L1 for this module).
//     The renderer treats title.vi as the primary string regardless of
//     uiLanguage; SpanishLessonsPage passes uiLanguage="en" so the chrome
//     reads correctly, but the lesson title itself uses the existing
//     title.vi slot to avoid forking the NormalizedLesson contract.
//
//   - Gender markers in vocabulary: bare words ("libro") get "(m)" appended
//     when no article prefix is present. Words already prefixed with an
//     article (el/la/los/las/un/una/unos/unas) are passed through unchanged
//     since the article already encodes gender.
//
//   - dialogue_long, roleplay_prompts, register_notes, idiom_glosses,
//     regional_variants are NOT emitted to the normalized shape — they
//     aren't part of the shared NormalizedLesson contract yet. Raw data
//     persists in Supabase for a future contract extension.

import type { SpanishGender, SpanishLesson } from "./lessons";
import type {
  NormalizedExercise,
  NormalizedLesson,
} from "@/components/languages/LessonRenderer.types";
import { lessonAudioBase } from "@/lib/lessonAudio";

// Stable hash for SpanishLesson string ids — deterministic React keys
// without callers passing an explicit numeric id.
function hashStringId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const ARTICLE_PREFIX_RE =
  /^(el|la|los|las|un|una|unos|unas)\s+/i;

function formatVocabWord(
  word: string,
  gender: SpanishGender | undefined,
): string {
  if (!word) return "";
  if (!gender) return word;
  if (ARTICLE_PREFIX_RE.test(word)) return word;
  if (gender === "m" || gender === "f") return `${word} (${gender})`;
  if (gender === "mf") return `${word} (m/f)`;
  if (gender === "n") return `${word} (n)`;
  return word;
}

function normalizeSpanishExercises(
  exercises: SpanishLesson["exercises"],
): NormalizedExercise[] | undefined {
  if (!exercises || exercises.length === 0) return undefined;
  const out: NormalizedExercise[] = [];
  for (const ex of exercises) {
    if (ex.type === "fill_blank") {
      // Each item is its own self-contained prompt/answer.
      for (const it of ex.items) {
        out.push({
          kind: "fill-blank",
          question: String(it.prompt ?? ""),
          answer: String(it.answer ?? ""),
        });
      }
    } else if (ex.type === "matching") {
      out.push({
        kind: "matching",
        instruction: ex.instruction,
        pairs: ex.items.map((it) => ({
          a: String(it.prompt ?? ""),
          b: String(it.answer ?? ""),
        })),
      });
    } else if (ex.type === "translation") {
      for (const it of ex.items) {
        out.push({
          kind: "translation",
          vi: String(it.prompt ?? ""),
          native: String(it.answer ?? ""),
        });
      }
    }
  }
  return out.length > 0 ? out : undefined;
}

function normalizeSpanishGrammar(
  grammar: SpanishLesson["grammar"],
): NormalizedLesson["grammar"] | undefined {
  if (!grammar || grammar.length === 0) return undefined;
  return grammar.map((g) => {
    let explanation = g.explanation;
    if (g.examples && g.examples.length > 0) {
      const lines = g.examples.map(
        (ex) => `• ${ex.spanish} — ${ex.english}`,
      );
      explanation = `${explanation}\n\nExamples:\n${lines.join("\n")}`;
    }
    return { point: g.point, explanation };
  });
}

export function normalizeSpanishLesson(
  lesson: SpanishLesson,
  id?: number,
): NormalizedLesson {
  return {
    id: id ?? hashStringId(lesson.id),
    level: lesson.level,
    // title.vi carries the English title for this module — the renderer
    // treats title.vi as primary regardless of uiLanguage.
    title: { vi: lesson.title, en: lesson.subtitle ?? "" },
    intro: lesson.intro,
    sentences: (lesson.sentences ?? []).map((s) => ({
      native: s.spanish,
      romanization: s.pronunciation,
      en: s.english,
      pronunciationFocus: s.pronunciation_focus,
      note: s.note,
    })),
    vocabulary: lesson.vocabulary?.map((v) => ({
      native: formatVocabWord(v.word, v.gender),
      en: v.english,
      phonetic: v.pronunciation,
    })),
    dialogue: lesson.dialogue?.map((d) => ({
      speaker: d.speaker,
      native: d.spanish,
      romanization: d.pronunciation,
      en: d.english,
    })),
    exercises: normalizeSpanishExercises(lesson.exercises),
    grammar: normalizeSpanishGrammar(lesson.grammar),
    // Spanish content is authored in English (the L1 for this module).
    // SpanishLessonsPage passes uiLanguage="en" so the renderer reads from
    // the `*En` slots. Storing English here under `*En` is semantically
    // correct and removes the prior `culturalNotesVi`-stuffing workaround.
    culturalNotesEn: lesson.cultural_note,
    tipAdviceEn: lesson.tip,
    audioBase: lessonAudioBase("es", lesson.id, lesson.level),
  };
}
