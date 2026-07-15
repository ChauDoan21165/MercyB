// src/languages/punjabi/lessons.ts
//
// Type definitions for the Punjabi lesson pack.
//
// This foundation is Gurmukhi-primary: all Punjabi teaching items use
// Gurmukhi script first, with romanization as a reading aid. Shahmukhi is
// mentioned only for awareness because this course does not teach it.

export type PunjabiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type PunjabiSentence = {
  /** Punjabi in Gurmukhi script. */
  gurmukhi: string;
  /** Readable Latin romanization for learners. */
  romanization: string;
  /** English translation / gloss. */
  en: string;
  /** Vietnamese translation / gloss. */
  vi: string;
  /** Pronunciation hints for Vietnamese-speaking learners. */
  pronunciation_focus?: string[];
  /** Pronunciation hints for English-speaking learners. */
  pronunciation_focus_en?: string[];
};

export type PunjabiVocabEntry = {
  cell_id?: string;
  /** Word or phrase in Gurmukhi script. */
  gurmukhi: string;
  romanization: string;
  en: string;
  vi: string;
  pos?: string;
};

export type PunjabiDialogueLine = {
  cell_id?: string;
  speaker: string;
  gurmukhi: string;
  romanization: string;
  en: string;
  vi: string;
};

export type PunjabiExerciseFillBlank = {
  type: "fill-blank";
  question: string;
  answer: string;
  hint_vi?: string;
  hint_en?: string;
};

export type PunjabiExerciseMatching = {
  type: "matching";
  instruction_vi: string;
  instruction_en: string;
  pairs: Array<{ gurmukhi: string; meaning: string }>;
};

export type PunjabiExerciseTranslation = {
  type: "translation";
  vi: string;
  en: string;
  gurmukhi: string;
  romanization?: string;
};

export type PunjabiExercise =
  | PunjabiExerciseFillBlank
  | PunjabiExerciseMatching
  | PunjabiExerciseTranslation;

export type PunjabiLesson = {
  id: number;
  level: PunjabiCefrLevel;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  intro_en: string;
  vocabulary: PunjabiVocabEntry[];
  sentences: PunjabiSentence[];
  dialogue?: PunjabiDialogueLine[];
  exercises?: PunjabiExercise[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
};
