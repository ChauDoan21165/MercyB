// src/languages/swahili/normalize.ts
//
// Converts a Swahili (Kiswahili) lesson → NormalizedLesson for the
// shared <LessonRenderer>. Handles all authoring-wave input variations:
//
// - Sentences: `sw` (B1/B2/C2) or `kiswahili` (alt); falls back to `en`
//   when no Swahili text is present (A1 wave).
// - Vocab: `sw` (B1) or `word` (A1/B2/C2).
// - Dialogue: `sw` (B1) or `text` (A1/B2/C2).
// - Exercises: fill-blank / fill_blank, matching (various pair shapes),
//   translation (various field names).
//
// Swahili uses the plain Latin alphabet with no diacritics in modern
// standard orthography — no tones, no accents, no special characters.
// The normalization concern is minimal: just map the per-lesson shape
// to the canonical NormalizedLesson fields.

import type {
  CefrLevel,
  NormalizedExercise,
  NormalizedLesson,
} from "@/components/languages/LessonRenderer.types";

// ── Permissive input shape ──────────────────────────────────────────

type SwahiliSentenceInput = {
  sw?: string;
  kiswahili?: string;
  en?: string;
  vi: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
  note_vi?: string;
  note_en?: string;
};

type SwahiliVocabInput = {
  sw?: string;
  word?: string;
  en: string;
  vi: string;
  pos?: string;
  ngeli?: string;
  pronunciation_vi?: string;
  pronunciation_en?: string;
};

type SwahiliDialogueInput = {
  speaker: string;
  sw?: string;
  text?: string;
  vi?: string;
  en?: string;
};

type SwahiliIdiomGlossInput = {
  idiom: string;
  literal: string;
  literal_en?: string;
  meaning: string;
  meaning_en?: string;
  example: string;
  example_en?: string;
};

export type SwahiliLessonInput = {
  id: string;
  level: CefrLevel;
  title_vi: string;
  title_en: string;
  intro_vi?: string;
  intro_en?: string;
  sentences?: SwahiliSentenceInput[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  vocabulary?: SwahiliVocabInput[];
  dialogue?: SwahiliDialogueInput[];
  exercises?: Array<Record<string, any>>;
  dialogue_long?: SwahiliDialogueInput[];
  roleplay_prompts?: string[];
  roleplay_prompts_en?: string[];
  register_notes?: string;
  register_notes_en?: string;
  register_notes_vi?: string;
  register_notes_en_field?: string;
  idiom_glosses?: SwahiliIdiomGlossInput[];
};

// ── Text folding utilities ──────────────────────────────────────────

/**
 * Fold Swahili text for lenient answer matching.
 *
 * Normalizes to NFC, lowercases, collapses whitespace, and strips
 * trailing punctuation. Swahili uses only ASCII letters so no
 * special-script handling is needed.
 */
export function foldSwahiliForMatching(input: string): string {
  return input
    .normalize("NFC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.!?;:,]+$/g, "")
    .trim();
}

/**
 * Compare a learner's typed answer against an expected Swahili answer
 * with lenient matching (case-insensitive, whitespace-collapsed,
 * trailing-punctuation-stripped).
 */
export function swahiliAnswersMatch(
  learnerAnswer: string,
  expectedAnswer: string,
): boolean {
  return (
    foldSwahiliForMatching(learnerAnswer) ===
    foldSwahiliForMatching(expectedAnswer)
  );
}

// ── Normalizer ──────────────────────────────────────────────────────

// Stable hash for Swahili string ids ("swahili_greetings_intro" etc.)
function hashStringId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Resolve the native Swahili text for a sentence, handling all input shapes. */
function resolveSentenceNative(s: SwahiliSentenceInput): string {
  return s.sw ?? s.kiswahili ?? s.en ?? "";
}

/** Resolve the English gloss for a sentence: omit when native IS English. */
function resolveSentenceEn(s: SwahiliSentenceInput): string | undefined {
  return s.sw ?? s.kiswahili ? s.en : undefined;
}

/** Resolve the native Swahili word for a vocab entry. */
function resolveVocabNative(v: SwahiliVocabInput): string {
  return v.sw ?? v.word ?? "";
}

/** Resolve the native Swahili text for a dialogue line. */
function resolveDialogueNative(d: SwahiliDialogueInput): string {
  return d.sw ?? d.text ?? "";
}

export function normalizeSwahiliLesson(
  lesson: SwahiliLessonInput,
  id?: number,
): NormalizedLesson {
  return {
    id: id ?? hashStringId(lesson.id),
    level: lesson.level,
    title: { vi: lesson.title_vi, en: lesson.title_en },
    introVi: lesson.intro_vi,
    introEn: lesson.intro_en,
    sentences: (lesson.sentences ?? []).map((s) => ({
      native: resolveSentenceNative(s),
      en: resolveSentenceEn(s),
      vi: s.vi,
      pronunciationFocus: s.pronunciation_focus,
      pronunciationFocusEn: s.pronunciation_focus_en,
      note: s.note_vi,
    })),
    vocabulary: lesson.vocabulary?.map((v) => ({
      native: resolveVocabNative(v),
      en: v.en,
      vi: v.vi,
      phonetic: v.pronunciation_vi,
      phoneticEn: v.pronunciation_en,
    })),
    dialogue: lesson.dialogue?.map((d) => ({
      speaker: d.speaker,
      native: resolveDialogueNative(d),
      en: d.en,
      vi: d.vi,
    })),
    exercises: normalizeSwahiliExercises(lesson.exercises),
    culturalNotesVi: lesson.cultural_notes_vi,
    culturalNotesEn: lesson.cultural_notes_en,
    tipAdviceVi: lesson.tip_advice_vi,
    tipAdviceEn: lesson.tip_advice_en,
    registerNotesVi:
      lesson.register_notes_vi ?? lesson.register_notes,
    registerNotesEn:
      lesson.register_notes_en_field ?? lesson.register_notes_en,
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
    dialogueLong: lesson.dialogue_long?.map((d) => ({
      speaker: d.speaker,
      native: resolveDialogueNative(d),
      en: d.en,
      vi: d.vi,
    })),
  };
}

function normalizeSwahiliExercises(
  exercises: SwahiliLessonInput["exercises"],
): NormalizedExercise[] | undefined {
  if (!exercises || exercises.length === 0) return undefined;
  const out: NormalizedExercise[] = [];
  for (const ex of exercises) {
    const kind = String(ex.type ?? "").replace("_", "-");

    if (Array.isArray(ex.items)) {
      if (kind === "matching") {
        out.push({
          kind: "matching",
          instruction: ex.instruction_vi,
          instructionEn: ex.instruction_en,
          pairs: ex.items.map((it: any) => ({
            a: String(it.prompt ?? ""),
            b: String(it.answer ?? ""),
          })),
        });
      } else if (kind === "fill-blank") {
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

    // Flat shape.
    if (kind === "fill-blank") {
      out.push({
        kind: "fill-blank",
        question: String(ex.question ?? ""),
        answer: String(ex.answer ?? ""),
        hint: ex.hint_vi,
        hintEn: ex.hint_en,
      });
    } else if (kind === "matching") {
      const raw: any[] = Array.isArray(ex.pairs) ? ex.pairs : [];
      out.push({
        kind: "matching",
        instruction: ex.instruction ?? ex.instruction_vi,
        instructionEn: ex.instruction_en,
        pairs: raw.map((p: any) =>
          Array.isArray(p)
            ? { a: String(p[0] ?? ""), b: String(p[1] ?? "") }
            : {
                a: String(p.a ?? p.prompt ?? p.swahili ?? p.sw ?? ""),
                b: String(p.b ?? p.answer ?? p.vi ?? p.meaning_vi ?? ""),
              },
        ),
      });
    } else if (kind === "translation") {
      out.push({
        kind: "translation",
        vi: String(ex.vietnamese ?? ex.vi ?? ""),
        en: ex.english ?? ex.en,
        native: String(ex.swahili ?? ex.sw ?? ""),
      });
    }
  }
  return out.length > 0 ? out : undefined;
}
