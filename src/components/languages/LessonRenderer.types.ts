// src/components/languages/LessonRenderer.types.ts
//
// Canonical contract for the shared LessonRenderer component.
// All language modules — the six foreign-language modules plus the
// Vietnamese-for-foreigners page — normalize their per-language lesson
// shape to NormalizedLesson at the page-module boundary; the renderer
// is field-name-pure and never reads per-language field aliases.
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

// One idiom + its gloss. `literal`/`meaning`/`example` are the
// Vietnamese-audience values; the `*En` siblings are independent
// English-audience values (NOT translations of each other — same
// idiom, audience-specific phrasing). The renderer picks per
// `uiLanguage` with fallback, same as the prose pedagogy fields.
export type NormalizedIdiomGloss = {
  idiom: string;
  literal: string;
  meaning: string;
  example?: string;
  /** English-audience literal gloss. Independent sibling of `literal`. */
  literalEn?: string;
  /** English-audience meaning gloss. Independent sibling of `meaning`. */
  meaningEn?: string;
  /** English-audience example. Independent sibling of `example`. */
  exampleEn?: string;
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
  /**
   * @deprecated Legacy single-language intro slot. Language-agnostic:
   * rendered as-is with no fallback badge. Kept for back-compat with
   * modules still on the pre-bilingual schema (Vietnamese). New code
   * should populate `introVi` / `introEn` so the renderer can pick by
   * `uiLanguage` and badge fallbacks.
   */
  intro?: string;
  /** Lesson intro calibrated for Vietnamese-speaker learners. */
  introVi?: string;
  /** Lesson intro calibrated for English-speaker learners.
   *  Independent sibling — NOT a translation of introVi. */
  introEn?: string;
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
  /** Register / tone meta-advice for Vietnamese-speaker learners. */
  registerNotesVi?: string;
  /** Register / tone meta-advice for English-speaker learners.
   *  Independent sibling — NOT a translation of registerNotesVi. */
  registerNotesEn?: string;
  /** Roleplay / speaking-practice prompts for Vietnamese-speaker learners. */
  roleplayPromptsVi?: string[];
  /** Roleplay / speaking-practice prompts for English-speaker learners.
   *  Independent sibling — NOT a translation of roleplayPromptsVi. */
  roleplayPromptsEn?: string[];
  /** Idiom glosses (idiom + literal/meaning/example, each with an
   *  optional `*En` sibling). Renderer picks per `uiLanguage`. */
  idiomGlosses?: NormalizedIdiomGloss[];
  /** Extended (long-form) dialogue. Same line shape as `dialogue`;
   *  surfaced behind an opt-in toggle so the default view is unchanged. */
  dialogueLong?: NormalizedDialogueLine[];
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
