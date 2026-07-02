// src/languages/french/normalize.ts
//
// Converts FrenchLesson → NormalizedLesson for the shared <LessonRenderer>.
// French sentences use s.en for the French content (legacy field name);
// French exercises mix two shapes (lessons 1-20 nested items[], 21-50 flat).

import type { FrenchLesson } from "./lessons";
import type {
  NormalizedExercise,
  NormalizedLesson,
} from "@/components/languages/LessonRenderer.types";
import { lessonAudioBase } from "@/lib/lessonAudio";
type NormalizeUnknownRecord = Record<string, unknown>;

const normalizeStringOrUndefined = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;

const normalizeString = (value: unknown): string =>
  typeof value === "string" ? value : "";

// Stable hash for FrenchLesson string ids ("french_greetings_intro" etc.)
// so the React key is deterministic without requiring callers to pass an
// explicit numeric id. Caller may still override via the second arg.
function hashStringId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function normalizeFrenchLesson(
  lesson: FrenchLesson,
  id?: number,
): NormalizedLesson {
  return {
    id: id ?? hashStringId(lesson.id),
    level: lesson.level,
    title: { vi: lesson.title_vi, en: lesson.title_en },
    sentences: (lesson.sentences ?? []).map((s) => ({
      // French content lives in s.en for historical reasons
      native: normalizeString(s.en),
      vi: s.vi,
      pronunciationFocus: s.pronunciation_focus,
      pronunciationFocusEn: s.pronunciation_focus_en,
    })),
    vocabulary: lesson.vocabulary?.map((v) => ({
      native: normalizeString(v.word),
      en: v.en,
      vi: v.vi,
      phonetic: v.pronunciation_vi,
    })),
    dialogue: lesson.dialogue?.map((d) => ({
      speaker: d.speaker,
      native: normalizeString(d.text),
      en: d.en,
      vi: d.vi,
    })),
    exercises: normalizeFrenchExercises(lesson.exercises),
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
      example: normalizeStringOrUndefined(g.example),
      literalEn: g.literal_en,
      meaningEn: g.meaning_en,
      exampleEn: g.example_en,
    })),
    dialogueLong: lesson.dialogue_long?.map((d) => ({
      speaker: d.speaker,
      native: normalizeString(d.text),
      en: d.en,
      vi: d.vi,
    })),
    audioBase: lessonAudioBase("fr", lesson.id, lesson.level),
  };
}

function normalizeFrenchExercises(
  exercises: FrenchLesson["exercises"],
): NormalizedExercise[] | undefined {
  if (!exercises || exercises.length === 0) return undefined;
  const out: NormalizedExercise[] = [];
  for (const ex of exercises) {
    const kind = String(ex.type ?? "").replace("_", "-");

    // Lessons 1-20 nested shape: { type, instruction_vi, items: [{prompt, answer, options?}] }
    if (Array.isArray(ex.items)) {
      if (kind === "matching") {
        out.push({
          kind: "matching",
          instruction: normalizeStringOrUndefined(ex.instruction_vi),
          instructionEn: normalizeStringOrUndefined(ex.instruction_en),
          pairs: (ex.items as NormalizeUnknownRecord[]).map((it) => ({
            a: String(it.prompt ?? ""),
            b: String(it.answer ?? ""),
          })),
        });
      } else if (kind === "fill-blank") {
        // Each item in the nested form is its own self-contained prompt/answer
        for (const it of ex.items) {
          out.push({
            kind: "fill-blank",
            question: String(it.prompt ?? ""),
            answer: String(it.answer ?? ""),
          });
        }
      } else if (kind === "translation") {
        for (const it of ex.items) {
          out.push({
            kind: "translation",
            vi: String(it.prompt ?? ""),
            native: String(it.answer ?? ""),
          });
        }
      }
      continue;
    }

    // Lessons 21-50 flat shape
    if (kind === "fill-blank") {
      out.push({
        kind: "fill-blank",
        question: String(ex.question ?? ""),
        answer: String(ex.answer ?? ""),
      });
    } else if (kind === "matching") {
      // Flat-shape pairs are tuples: [["a", "b"], ...] in 21-50 data
      const raw: unknown[] = Array.isArray(ex.pairs) ? ex.pairs : [];
      out.push({
        kind: "matching",
        instruction: normalizeStringOrUndefined(ex.instruction),
        instructionEn: normalizeStringOrUndefined(ex.instruction_en),
        pairs: (raw as NormalizeUnknownRecord[]).map((p) =>
          Array.isArray(p)
            ? { a: String(p[0] ?? ""), b: String(p[1] ?? "") }
            : {
                a: String(p.a ?? p.prompt ?? p.french ?? ""),
                b: String(p.b ?? p.answer ?? p.vi ?? ""),
              },
        ),
      });
    } else if (kind === "translation") {
      out.push({
        kind: "translation",
        vi: String(ex.vietnamese ?? ""),
        native: String(ex.french ?? ""),
      });
    }
  }
  return out.length > 0 ? out : undefined;
}
