// src/components/languages/LessonRenderer.types.ts
//
// Canonical contract for the shared LessonRenderer component.
// All 5 language modules normalize their per-language lesson shape
// to NormalizedLesson at the page-module boundary; the renderer is
// field-name-pure and never reads per-language field aliases.
//
// Bilingual pedagogy fields: Vietnamese-suffixed (`*Vi`) and English-
// suffixed (`*En`) fields are independent siblings, not translations
// of each other. Each is authored for its language's audience. The
// renderer picks which to display based on its `uiLanguage` prop,
// with fallback when one is missing. NEVER assume a `*En` value is a
// translation of its `*Vi` counterpart — they share intent, not wording.

export type CefrLevel = "A1" | "A1+" | "A2" | "B1" | "B2" | "C1" | "C2";

export type NormalizedSentence = {
  native: string;
  romanization?: string;
  en?: string;
  vi?: string;
  /** Pronunciation hints calibrated for Vietnamese-speaker learners. */
  pronunciationFocus?: string[];
  /** Pronunciation hints calibrated for English-speaker learners.
   *  Independent sibling — NOT a translation of pronunciationFocus. */
  pronunciationFocusEn?: string[];
  note?: string;
};

export type NormalizedVocabEntry = {
  native: string;
  romanization?: string;
  en?: string;
  vi?: string;
  /** Phonetic hint calibrated for Vietnamese-speaker learners. */
  phonetic?: string;
  /** Phonetic hint calibrated for English-speaker learners.
   *  Independent sibling — NOT a translation of phonetic. */
  phoneticEn?: string;
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
  /** Optional contextual hint shown to the learner, in Vietnamese. */
  hint?: string;
  /** Optional contextual hint shown to the learner, in English. */
  hintEn?: string;
};

export type NormalizedExerciseMatching = {
  kind: "matching";
  /** Instruction calibrated for Vietnamese-speaker learners. */
  instruction?: string;
  /** Instruction calibrated for English-speaker learners. */
  instructionEn?: string;
  pairs: Array<{ a: string; b: string }>;
};

export type NormalizedExerciseTranslation = {
  kind: "translation";
  /** Source prompt in Vietnamese; learner translates this into native. */
  vi: string;
  /** Source prompt in English; learner translates this into native.
   *  Optional — falls back to vi when missing. */
  en?: string;
  /** Target answer in the language being learned. */
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
  /** Cultural notes calibrated for Vietnamese-speaker learners. */
  culturalNotesVi?: string;
  /** Cultural notes calibrated for English-speaker learners.
   *  Independent sibling — NOT a translation of culturalNotesVi. */
  culturalNotesEn?: string;
  /** Study tip calibrated for Vietnamese-speaker learners. */
  tipAdviceVi?: string;
  /** Study tip calibrated for English-speaker learners.
   *  Independent sibling — NOT a translation of tipAdviceVi. */
  tipAdviceEn?: string;
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
