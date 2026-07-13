// src/languages/hindi/normalize.ts
//
// Hindi Devanagari normalizer foundation for the shared <LessonRenderer>.
//
// Display text is preserved exactly as authored. The folding helpers here are
// for typed-answer comparison only, and default to conservative matching:
// matras, nukta, nasal marks, visarga, and virama remain significant unless a
// caller explicitly opts into a narrow leniency.

import type {
  CefrLevel,
  NormalizedExercise,
  NormalizedLesson,
} from "@/components/languages/LessonRenderer.types";

export type HindiSentenceInput = {
  hi: string;
  romanization?: string;
  en: string;
  vi: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
  note_vi?: string;
  note_en?: string;
};

export type HindiVocabInput = {
  cell_id?: string;
  hi: string;
  romanization?: string;
  en: string;
  vi: string;
  pos?: string;
};

export type HindiDialogueInput = {
  cell_id?: string;
  speaker: string;
  hi: string;
  romanization?: string;
  en: string;
  vi: string;
};

export type HindiExerciseInput =
  | {
      type: "fill-blank" | "fill_blank";
      question: string;
      answer: string;
      accepted_answers?: string[];
      hint_vi?: string;
      hint_en?: string;
    }
  | {
      type: "matching";
      instruction_vi?: string;
      instruction_en?: string;
      pairs: Array<
        | [string, string]
        | {
            hi?: string;
            a?: string;
            prompt?: string;
            meaning_vi?: string;
            meaning_en?: string;
            b?: string;
            answer?: string;
            vi?: string;
          }
      >;
    }
  | {
      type: "translation";
      vi: string;
      en?: string;
      hi: string;
      romanization?: string;
      accepted_answers?: string[];
    };

export type HindiLessonInput = {
  id: string;
  level: CefrLevel;
  title_vi: string;
  title_en: string;
  intro_vi?: string;
  intro_en?: string;
  sentences?: HindiSentenceInput[];
  vocabulary?: HindiVocabInput[];
  dialogue?: HindiDialogueInput[];
  exercises?: HindiExerciseInput[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  register_notes_vi?: string;
  register_notes_en?: string;
  roleplay_prompts?: string[];
  roleplay_prompts_en?: string[];
  dialogue_long?: HindiDialogueInput[];
};

export type HindiMatchOptions = {
  allowNuktaFolding?: boolean;
  allowAnusvaraChandrabinduFolding?: boolean;
  allowVisargaFolding?: boolean;
  allowViramaFolding?: boolean;
  stripMatras?: boolean;
  ignorePunctuation?: boolean;
};

const DEVANAGARI_DIGITS: Record<string, string> = {
  "०": "0",
  "१": "1",
  "२": "2",
  "३": "3",
  "४": "4",
  "५": "5",
  "६": "6",
  "७": "7",
  "८": "8",
  "९": "9",
};

const HINDI_PUNCTUATION_MAP: Record<string, string> = {
  "।": ".",
  "“": '"',
  "”": '"',
  "„": '"',
  "’": "'",
  "‘": "'",
};

const NUKTA_RE = /\u093C/g;
const ANUSVARA_CHANDRABINDU_RE = /[\u0901\u0902]/g;
const VISARGA_RE = /\u0903/g;
const VIRAMA_RE = /\u094D/g;
const HINDI_MATRA_RE = /[\u093E-\u094C\u0962\u0963]/g;

export function stripHindiCombiningMarks(
  input: string,
  options: HindiMatchOptions = {},
): string {
  let out = input;
  if (options.allowNuktaFolding) out = out.replace(NUKTA_RE, "");
  if (options.allowAnusvaraChandrabinduFolding) {
    out = out.replace(ANUSVARA_CHANDRABINDU_RE, "");
  }
  if (options.allowVisargaFolding) out = out.replace(VISARGA_RE, "");
  if (options.allowViramaFolding) out = out.replace(VIRAMA_RE, "");
  if (options.stripMatras) out = out.replace(HINDI_MATRA_RE, "");
  return out;
}

export function normalizeHindiNukta(
  input: string,
  options: HindiMatchOptions = {},
): string {
  if (!options.allowNuktaFolding) return input;
  return input.replace(NUKTA_RE, "");
}

export function normalizeHindiAnusvaraChandrabindu(
  input: string,
  options: HindiMatchOptions = {},
): string {
  if (!options.allowAnusvaraChandrabinduFolding) return input;
  return input.replace(/\u0901/g, "\u0902");
}

export function normalizeHindiVisarga(
  input: string,
  options: HindiMatchOptions = {},
): string {
  if (!options.allowVisargaFolding) return input;
  return input.replace(VISARGA_RE, "");
}

export function normalizeHindiVirama(
  input: string,
  options: HindiMatchOptions = {},
): string {
  if (!options.allowViramaFolding) return input;
  return input.replace(VIRAMA_RE, "");
}

export function normalizeHindiDigits(input: string): string {
  let out = "";
  for (const ch of input) out += DEVANAGARI_DIGITS[ch] ?? ch;
  return out;
}

function normalizeHindiPunctuation(
  input: string,
  options: HindiMatchOptions = {},
): string {
  let out = "";
  for (const ch of input) out += HINDI_PUNCTUATION_MAP[ch] ?? ch;
  if (options.ignorePunctuation) {
    out = out.replace(/[.,!?;:]+$/g, "").replace(/[.,!?;:]/g, "");
  }
  return out;
}

export function foldHindiForMatching(
  input: string,
  options: HindiMatchOptions = {},
): string {
  return normalizeHindiVirama(
    normalizeHindiVisarga(
      normalizeHindiAnusvaraChandrabindu(
        normalizeHindiNukta(
          normalizeHindiDigits(
            normalizeHindiPunctuation(input.normalize("NFC"), options),
          ),
          options,
        ),
        options,
      ),
      options,
    ),
    options,
  )
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function hindiAnswersMatch(
  learnerAnswer: string,
  expectedAnswer: string,
  options: HindiMatchOptions = {},
): boolean {
  return (
    foldHindiForMatching(learnerAnswer, options) ===
    foldHindiForMatching(expectedAnswer, options)
  );
}

function hashStringId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function normalizeHindiLesson(
  lesson: HindiLessonInput,
  id?: number,
): NormalizedLesson {
  return {
    id: id ?? hashStringId(lesson.id),
    level: lesson.level,
    title: { vi: lesson.title_vi, en: lesson.title_en },
    introVi: lesson.intro_vi,
    introEn: lesson.intro_en,
    sentences: (lesson.sentences ?? []).map((s) => ({
      native: s.hi,
      romanization: s.romanization,
      en: s.en,
      vi: s.vi,
      pronunciationFocus: s.pronunciation_focus,
      pronunciationFocusEn: s.pronunciation_focus_en,
      note: s.note_vi,
    })),
    vocabulary: lesson.vocabulary?.map((v) => ({
      native: v.hi,
      romanization: v.romanization,
      en: v.en,
      vi: v.vi,
    })),
    dialogue: lesson.dialogue?.map((d) => ({
      speaker: d.speaker,
      native: d.hi,
      romanization: d.romanization,
      en: d.en,
      vi: d.vi,
    })),
    exercises: normalizeHindiExercises(lesson.exercises),
    culturalNotesVi: lesson.cultural_notes_vi,
    culturalNotesEn: lesson.cultural_notes_en,
    tipAdviceVi: lesson.tip_advice_vi,
    tipAdviceEn: lesson.tip_advice_en,
    registerNotesVi: lesson.register_notes_vi,
    registerNotesEn: lesson.register_notes_en,
    roleplayPromptsVi: lesson.roleplay_prompts,
    roleplayPromptsEn: lesson.roleplay_prompts_en,
    dialogueLong: lesson.dialogue_long?.map((d) => ({
      speaker: d.speaker,
      native: d.hi,
      romanization: d.romanization,
      en: d.en,
      vi: d.vi,
    })),
    // audioBase intentionally omitted: Hindi audio is out of W2 scope.
  };
}

function normalizeHindiExercises(
  exercises: HindiLessonInput["exercises"],
): NormalizedExercise[] | undefined {
  if (!exercises || exercises.length === 0) return undefined;
  const out: NormalizedExercise[] = [];
  for (const ex of exercises) {
    if (ex.type === "fill-blank" || ex.type === "fill_blank") {
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
        pairs: ex.pairs.map((p) =>
          Array.isArray(p)
            ? { a: String(p[0] ?? ""), b: String(p[1] ?? "") }
            : {
                a: String(p.hi ?? p.a ?? p.prompt ?? ""),
                b: String(p.meaning_vi ?? p.b ?? p.answer ?? p.vi ?? ""),
              },
        ),
      });
    } else if (ex.type === "translation") {
      out.push({
        kind: "translation",
        vi: ex.vi,
        en: ex.en,
        native: ex.hi,
        romanization: ex.romanization,
      });
    }
  }
  return out.length > 0 ? out : undefined;
}
