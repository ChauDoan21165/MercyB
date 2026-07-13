// src/languages/arabic/normalize.ts
//
// Arabic normalizer foundation for the shared <LessonRenderer>.
//
// Arabic display text is preserved exactly as authored. The folding helpers in
// this file are for lenient typed-answer comparison only: harakat/tashkeel,
// tatweel, common alef variants, alif maqsurah, and Arabic/Persian digits can
// be normalized without changing rendered lesson content.

import type {
  CefrLevel,
  NormalizedExercise,
  NormalizedLesson,
} from "@/components/languages/LessonRenderer.types";

export type ArabicSentenceInput = {
  ar: string;
  romanization?: string;
  en: string;
  vi: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
  note_vi?: string;
  note_en?: string;
};

export type ArabicVocabInput = {
  cell_id?: string;
  ar: string;
  romanization?: string;
  en: string;
  vi: string;
  pos?: string;
};

export type ArabicDialogueInput = {
  cell_id?: string;
  speaker: string;
  ar: string;
  romanization?: string;
  en: string;
  vi: string;
};

export type ArabicExerciseInput =
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
            ar?: string;
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
      ar: string;
      romanization?: string;
      accepted_answers?: string[];
    };

export type ArabicLessonInput = {
  id: string;
  level: CefrLevel;
  title_vi: string;
  title_en: string;
  intro_vi?: string;
  intro_en?: string;
  sentences?: ArabicSentenceInput[];
  vocabulary?: ArabicVocabInput[];
  dialogue?: ArabicDialogueInput[];
  exercises?: ArabicExerciseInput[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  register_notes_vi?: string;
  register_notes_en?: string;
  roleplay_prompts?: string[];
  roleplay_prompts_en?: string[];
  dialogue_long?: ArabicDialogueInput[];
};

export type ArabicMatchOptions = {
  allowFinalTaMarbutaHa?: boolean;
};

const ARABIC_HARAKAT_RE =
  /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const TATWEEL_RE = /\u0640/g;

const ALEF_HAMZA_MAP: Record<string, string> = {
  "أ": "ا",
  "إ": "ا",
  "آ": "ا",
  "ٱ": "ا",
};

const DIGIT_MAP: Record<string, string> = {
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
};

const PUNCTUATION_MAP: Record<string, string> = {
  "،": ",",
  "؛": ";",
  "؟": "?",
  "“": '"',
  "”": '"',
  "„": '"',
  "’": "'",
  "‘": "'",
  "ـ": "",
};

export function stripArabicHarakat(input: string): string {
  return input.replace(ARABIC_HARAKAT_RE, "");
}

export const stripArabicDiacritics = stripArabicHarakat;

export function stripTatweel(input: string): string {
  return input.replace(TATWEEL_RE, "");
}

export function normalizeArabicAlefHamza(input: string): string {
  let out = "";
  for (const ch of input) out += ALEF_HAMZA_MAP[ch] ?? ch;
  return out;
}

export function normalizeArabicYaAlifMaqsurah(input: string): string {
  return input.replace(/ى/g, "ي");
}

export function normalizeArabicTaMarbuta(
  input: string,
  options: ArabicMatchOptions = {},
): string {
  if (!options.allowFinalTaMarbutaHa) return input;
  return input.replace(/[هة](?=\s|$)/g, "ة");
}

export function normalizeArabicDigits(input: string): string {
  let out = "";
  for (const ch of input) out += DIGIT_MAP[ch] ?? ch;
  return out;
}

function normalizeArabicPunctuation(input: string): string {
  let out = "";
  for (const ch of input) out += PUNCTUATION_MAP[ch] ?? ch;
  return out;
}

export function foldArabicForMatching(
  input: string,
  options: ArabicMatchOptions = {},
): string {
  return normalizeArabicTaMarbuta(
    normalizeArabicYaAlifMaqsurah(
      normalizeArabicAlefHamza(
        normalizeArabicDigits(
          normalizeArabicPunctuation(stripArabicHarakat(stripTatweel(input.normalize("NFKC")))),
        ),
      ),
    ),
    options,
  )
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export const normalizeArabicAnswer = foldArabicForMatching;

export function arabicAnswersMatch(
  learnerAnswer: string,
  expectedAnswer: string,
  options: ArabicMatchOptions = {},
): boolean {
  return (
    foldArabicForMatching(learnerAnswer, options) ===
    foldArabicForMatching(expectedAnswer, options)
  );
}

function hashStringId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function normalizeArabicLesson(
  lesson: ArabicLessonInput,
  id?: number,
): NormalizedLesson {
  return {
    id: id ?? hashStringId(lesson.id),
    level: lesson.level,
    title: { vi: lesson.title_vi, en: lesson.title_en },
    introVi: lesson.intro_vi,
    introEn: lesson.intro_en,
    sentences: (lesson.sentences ?? []).map((s) => ({
      native: s.ar,
      romanization: s.romanization,
      en: s.en,
      vi: s.vi,
      pronunciationFocus: s.pronunciation_focus,
      pronunciationFocusEn: s.pronunciation_focus_en,
      note: s.note_vi,
    })),
    vocabulary: lesson.vocabulary?.map((v) => ({
      native: v.ar,
      romanization: v.romanization,
      en: v.en,
      vi: v.vi,
    })),
    dialogue: lesson.dialogue?.map((d) => ({
      speaker: d.speaker,
      native: d.ar,
      romanization: d.romanization,
      en: d.en,
      vi: d.vi,
    })),
    exercises: normalizeArabicExercises(lesson.exercises),
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
      native: d.ar,
      romanization: d.romanization,
      en: d.en,
      vi: d.vi,
    })),
    // audioBase intentionally omitted: Arabic audio is out of W2 scope.
  };
}

function normalizeArabicExercises(
  exercises: ArabicLessonInput["exercises"],
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
                a: String(p.ar ?? p.a ?? p.prompt ?? ""),
                b: String(p.meaning_vi ?? p.b ?? p.answer ?? p.vi ?? ""),
              },
        ),
      });
    } else if (ex.type === "translation") {
      out.push({
        kind: "translation",
        vi: ex.vi,
        en: ex.en,
        native: ex.ar,
        romanization: ex.romanization,
      });
    }
  }
  return out.length > 0 ? out : undefined;
}
