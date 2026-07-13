// src/languages/thai/lessons.ts
//
// Type definitions for the Thai lesson pack.
//
// Thai is an abugida (Thai script, Unicode block U+0E00–U+0E7F) and a tonal
// language. Vietnamese learners share the experience of lexical tone, so the
// pedagogy here leans on that: `pronunciation_focus` is authored for
// Vietnamese speakers, `pronunciation_focus_en` for English speakers, and the
// two are independent siblings (same intent, audience-specific wording) —
// NEVER assume one is a translation of the other.
//
// Every learner-facing string carries the Thai source plus a `romanization`
// (a readable Latin transliteration with tone diacritics) so the renderer can
// show the script and a pronounceable cue side by side. There are NO CJK,
// Hangul, Japanese-kana, or Cyrillic assumptions anywhere in this pack — Thai
// has its own script and must not be modelled on the other language modules'
// character sets.

export type ThaiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ThaiSentence = {
  /** The sentence in Thai script (U+0E00–U+0E7F). */
  thai: string;
  /** Readable Latin transliteration with tone marks (e.g. "sàwàtdii khráp"). */
  romanization: string;
  /** English translation / gloss. */
  en: string;
  /** Vietnamese translation / gloss. */
  vi: string;
  /** Pronunciation hints for Vietnamese-speaker learners. */
  pronunciation_focus?: string[];
  /** Pronunciation hints for English-speaker learners.
   *  Independent sibling — NOT a translation of pronunciation_focus. */
  pronunciation_focus_en?: string[];
};

export type ThaiVocabEntry = {
  cell_id?: string;
  /** The word/phrase in Thai script. */
  thai: string;
  /** Readable Latin transliteration with tone marks. */
  romanization: string;
  /** English meaning. */
  en: string;
  /** Vietnamese meaning. */
  vi: string;
  /** Part of speech (kept language-neutral, e.g. "particle", "noun"). */
  pos?: string;
};

export type ThaiDialogueLine = {
  cell_id?: string;
  speaker: string;
  /** The line in Thai script. */
  thai: string;
  romanization: string;
  en: string;
  vi: string;
};

export type ThaiExerciseFillBlank = {
  type: "fill-blank";
  question: string;
  answer: string;
  /** Optional hint for Vietnamese-speaker learners. */
  hint_vi?: string;
  /** Optional hint for English-speaker learners. */
  hint_en?: string;
};

export type ThaiExerciseMatching = {
  type: "matching";
  /** Instruction for Vietnamese-speaker learners. */
  instruction_vi: string;
  /** Instruction for English-speaker learners. */
  instruction_en: string;
  pairs: Array<{ thai: string; meaning: string }>;
};

export type ThaiExerciseTranslation = {
  type: "translation";
  /** Vietnamese prompt the learner translates into Thai. */
  vi: string;
  /** English prompt the learner translates into Thai. */
  en: string;
  /** Target answer in Thai script. */
  thai: string;
};

export type ThaiExercise =
  | ThaiExerciseFillBlank
  | ThaiExerciseMatching
  | ThaiExerciseTranslation;

export type ThaiLesson = {
  id: number;
  level: ThaiCefrLevel;
  title_vi: string;
  title_en: string;
  /** Lesson intro for Vietnamese-speaker learners. */
  intro_vi: string;
  /** Lesson intro for English-speaker learners.
   *  Independent sibling — NOT a translation of intro_vi. */
  intro_en: string;
  vocabulary: ThaiVocabEntry[];
  sentences: ThaiSentence[];
  dialogue?: ThaiDialogueLine[];
  exercises?: ThaiExercise[];
  /** Cultural notes for Vietnamese-speaker learners. */
  cultural_notes_vi?: string;
  /** Cultural notes for English-speaker learners. */
  cultural_notes_en?: string;
  /** Study tip for Vietnamese-speaker learners. */
  tip_advice_vi?: string;
  /** Study tip for English-speaker learners. */
  tip_advice_en?: string;
};
