// src/components/languages/LessonRenderer.types.ts
//
// Canonical contract for the shared LessonRenderer component.
// All 5 language modules normalize their per-language lesson shape
// to NormalizedLesson at the page-module boundary; the renderer is
// field-name-pure and never reads per-language field aliases.

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type NormalizedSentence = {
  native: string;
  romanization?: string;
  en?: string;
  vi?: string;
  pronunciationFocus?: string[];
  note?: string;
};

export type NormalizedVocabEntry = {
  native: string;
  romanization?: string;
  en?: string;
  vi?: string;
  phonetic?: string;
};

export type NormalizedDialogueLine = {
  speaker: string;
  native: string;
  romanization?: string;
  en?: string;
  vi?: string;
};

export type NormalizedExerciseFillBlank = {
  kind: "fill-blank";
  question: string;
  answer: string;
};

export type NormalizedExerciseMatching = {
  kind: "matching";
  instruction?: string;
  pairs: Array<{ a: string; b: string }>;
};

export type NormalizedExerciseTranslation = {
  kind: "translation";
  vi: string;
  native: string;
  romanization?: string;
};

export type NormalizedExercise =
  | NormalizedExerciseFillBlank
  | NormalizedExerciseMatching
  | NormalizedExerciseTranslation;

export type NormalizedGrammarPoint = {
  point: string;
  explanation: string;
};

export type NormalizedLesson = {
  id: number;
  level: CefrLevel;
  title: {
    vi: string;
    en: string;
    native?: string;
    romanization?: string;
  };
  intro?: string;
  sentences: NormalizedSentence[];
  vocabulary?: NormalizedVocabEntry[];
  dialogue?: NormalizedDialogueLine[];
  exercises?: NormalizedExercise[];
  culturalNotesVi?: string;
  tipAdviceVi?: string;
  grammar?: NormalizedGrammarPoint[];
};

export type LessonTheme = {
  accent: string; // hex color used for level pill, lesson number badge, expand chevron, dialogue speaker color
};
