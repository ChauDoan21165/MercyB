// src/components/languages/LessonRenderer.types.ts
//
// Canonical contract for the shared LessonRenderer component.
// All 5 language modules normalize their per-language lesson shape
// to NormalizedLesson at the page-module boundary; the renderer is
// field-name-pure and never reads per-language field aliases.

export type CefrLevel = "A1" | "A1+" | "A2" | "B1" | "B2" | "C1" | "C2";

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

// Per-lesson hint about which LessonAudioUnit kind to use for sentence-row
// and dialogue-row audio buttons. Vietnamese-for-foreigners uses `phrase` /
// `dialogue_vi` (no speaker suffix); the other 5 languages default to
// `sentence` / `dialogue_short`. Set at the normalizer boundary so the
// renderer stays field-name-pure (no per-language branching).
export type NormalizedAudioKinds = {
  sentence?: "sentence" | "phrase";
  dialogue?: "dialogue_short" | "dialogue_vi";
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
  // Storage prefix for the lesson's audio in the Supabase `room-audio` bucket,
  // e.g. "a1/de/lgreetings_intro" or "a1/ja/l21". Append "/sentence_${i+1}.mp3"
  // (or vocab/dialogue_short variants) to get a canonical audio key.
  // Optional so callers that don't have audio mapping can still produce a
  // valid NormalizedLesson; LessonAudioButton renders nothing when absent.
  audioBase?: string;
  audioKinds?: NormalizedAudioKinds;
};

export type LessonTheme = {
  accent: string; // hex color used for level pill, lesson number badge, expand chevron, dialogue speaker color
};
