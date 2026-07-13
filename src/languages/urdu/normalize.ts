// src/languages/urdu/normalize.ts
//
// Urdu normalizer foundation for the shared <LessonRenderer>.
//
// Urdu display text is preserved exactly as authored. The folding helpers in
// this file are for lenient typed-answer comparison only: optional vowel marks,
// tatweel/kashida, safe keyboard variants, digits, punctuation, and whitespace
// may be normalized without changing rendered lesson content.

import type {
  CefrLevel,
  NormalizedExercise,
  NormalizedLesson,
} from "@/components/languages/LessonRenderer.types";

export type UrduSentenceInput = {
  ur: string;
  romanization?: string;
  en: string;
  vi: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
  note_vi?: string;
  note_en?: string;
};

export type UrduVocabInput = {
  cell_id?: string;
  ur: string;
  romanization?: string;
  en: string;
  vi: string;
  pos?: string;
};

export type UrduDialogueInput = {
  cell_id?: string;
  speaker: string;
  ur: string;
  romanization?: string;
  en: string;
  vi: string;
};

export type UrduExerciseInput =
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
            ur?: string;
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
      ur: string;
      romanization?: string;
      accepted_answers?: string[];
    };

export type UrduLessonInput = {
  id: string;
  level: CefrLevel;
  title_vi: string;
  title_en: string;
  intro_vi?: string;
  intro_en?: string;
  sentences?: UrduSentenceInput[];
  vocabulary?: UrduVocabInput[];
  dialogue?: UrduDialogueInput[];
  exercises?: UrduExerciseInput[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  register_notes_vi?: string;
  register_notes_en?: string;
  roleplay_prompts?: string[];
  roleplay_prompts_en?: string[];
  dialogue_long?: UrduDialogueInput[];
};

export type UrduMatchOptions = {
  allowBariYeChotiYe?: boolean;
  allowHamzaSeatLeniency?: boolean;
};

const URDU_DIACRITICS_RE =
  /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const TATWEEL_RE = /\u0640/g;

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
};

export function stripUrduDiacritics(input: string): string {
  return input.replace(URDU_DIACRITICS_RE, "");
}

export function stripTatweel(input: string): string {
  return input.replace(TATWEEL_RE, "");
}

export const stripUrduTatweel = stripTatweel;

export function normalizeUrduAlefHamza(
  input: string,
  options: UrduMatchOptions = {},
): string {
  let out = "";
  for (const ch of input) {
    if (ch === "أ" || ch === "إ" || ch === "آ" || ch === "ٱ") {
      out += "ا";
    } else if (options.allowHamzaSeatLeniency && (ch === "ؤ" || ch === "ئ")) {
      out += "ء";
    } else {
      out += ch;
    }
  }
  return out;
}

export function normalizeUrduYehVariants(
  input: string,
  options: UrduMatchOptions = {},
): string {
  let out = "";
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    const next = input[i + 1] ?? "";
    if (ch === "ي" || ch === "ى") {
      out += "ی";
    } else if (
      options.allowBariYeChotiYe &&
      ch === "ے" &&
      input[i - 1] !== "ہ" &&
      (next === "" || /\s|[.,;?!]/.test(next))
    ) {
      out += "ی";
    } else {
      out += ch;
    }
  }
  return out;
}

export function normalizeUrduHehVariants(input: string): string {
  let out = "";
  for (const ch of input) {
    // Fold Arabic heh to Urdu goal heh for keyboard leniency. Keep do-chashmi
    // heh (ھ), ta marbuta (ة), and hamza-bearing heh forms distinct.
    out += ch === "ه" ? "ہ" : ch;
  }
  return out;
}

export function normalizeUrduDigits(input: string): string {
  let out = "";
  for (const ch of input) out += DIGIT_MAP[ch] ?? ch;
  return out;
}

function normalizeUrduKaf(input: string): string {
  return input.replace(/ك/g, "ک");
}

function normalizeUrduPunctuation(input: string): string {
  let out = "";
  for (const ch of input) out += PUNCTUATION_MAP[ch] ?? ch;
  return out;
}

export function foldUrduForMatching(
  input: string,
  options: UrduMatchOptions = {},
): string {
  return normalizeUrduHehVariants(
    normalizeUrduYehVariants(
      normalizeUrduAlefHamza(
        normalizeUrduKaf(
          normalizeUrduDigits(
            normalizeUrduPunctuation(
              stripUrduDiacritics(stripTatweel(input.normalize("NFKC"))),
            ),
          ),
        ),
        options,
      ),
      options,
    ),
  )
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export const normalizeUrduAnswer = foldUrduForMatching;

export function urduAnswersMatch(
  learnerAnswer: string,
  expectedAnswer: string,
  options: UrduMatchOptions = {},
): boolean {
  return (
    foldUrduForMatching(learnerAnswer, options) ===
    foldUrduForMatching(expectedAnswer, options)
  );
}

function hashStringId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function normalizeUrduLesson(
  lesson: UrduLessonInput,
  id?: number,
): NormalizedLesson {
  return {
    id: id ?? hashStringId(lesson.id),
    level: lesson.level,
    title: { vi: lesson.title_vi, en: lesson.title_en },
    introVi: lesson.intro_vi,
    introEn: lesson.intro_en,
    sentences: (lesson.sentences ?? []).map((s) => ({
      native: s.ur,
      romanization: s.romanization,
      en: s.en,
      vi: s.vi,
      pronunciationFocus: s.pronunciation_focus,
      pronunciationFocusEn: s.pronunciation_focus_en,
      note: s.note_vi,
    })),
    vocabulary: lesson.vocabulary?.map((v) => ({
      native: v.ur,
      romanization: v.romanization,
      en: v.en,
      vi: v.vi,
    })),
    dialogue: lesson.dialogue?.map((d) => ({
      speaker: d.speaker,
      native: d.ur,
      romanization: d.romanization,
      en: d.en,
      vi: d.vi,
    })),
    exercises: normalizeUrduExercises(lesson.exercises),
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
      native: d.ur,
      romanization: d.romanization,
      en: d.en,
      vi: d.vi,
    })),
    // audioBase intentionally omitted: Urdu audio is out of W2 scope.
  };
}

function normalizeUrduExercises(
  exercises: UrduLessonInput["exercises"],
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
                a: String(p.ur ?? p.a ?? p.prompt ?? ""),
                b: String(p.meaning_vi ?? p.b ?? p.answer ?? p.vi ?? ""),
              },
        ),
      });
    } else if (ex.type === "translation") {
      out.push({
        kind: "translation",
        vi: ex.vi,
        en: ex.en,
        native: ex.ur,
        romanization: ex.romanization,
      });
    }
  }
  return out.length > 0 ? out : undefined;
}
