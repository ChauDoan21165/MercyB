export type PromptModality =
  | "writing"
  | "speaking"
  | "reading"
  | "listening"
  | "conversation";

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type CEFRSubskill =
  | "grammar"
  | "vocabulary"
  | "coherence"
  | "taskAchievement";

export type PlacementPrompt = {
  id: string;
  modality: PromptModality;
  targetLevel: CEFRLevel;
  acceptableLevels: CEFRLevel[];
  promptText: string;
  promptTextVi: string;
  context?: string;
  expectedDurationSec: number;
  minResponseLength: number;
  rubricFocus: string[];
  l1InterferenceTriggers: string[];
};

export type PlacementQuestion = {
  id: string;
  questionText: string;
  questionTextVi: string;
  options?: string[];
  correctAnswer?: string;
};

export type ReadingPlacementPrompt = PlacementPrompt & {
  modality: "reading";
  title: string;
  titleVi: string;
  passageText: string;
  passageTextVi: string;
  questions: PlacementQuestion[];
};

export type ListeningPlacementPrompt = PlacementPrompt & {
  modality: "listening";
  title: string;
  titleVi: string;
  audioScript: string;
  audioScriptVi: string;
  questions: PlacementQuestion[];
};

export const CEFR_LEVELS: readonly CEFRLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
] as const;

export const CEFR_SUBSKILLS: readonly CEFRSubskill[] = [
  "grammar",
  "vocabulary",
  "coherence",
  "taskAchievement",
] as const;

export const KNOWN_L1_INTERFERENCE_IDS = [
  "article-omission",
  "calque-from-vietnamese",
  "classifier-transfer",
  "collocation-transfer",
  "conditional-simplification",
  "connector-overuse",
  "copula-be-omission",
  "direct-translation",
  "final-consonant-deletion",
  "lexical-repetition",
  "missing-articles",
  "missing-plurals",
  "missing-pronouns",
  "modal-verb-inflection",
  "negation-no-not-placement",
  "past-tense-omission",
  "preposition-transfer",
  "pronoun-gender-confusion",
  "question-word-order-transfer",
  "register-flattening",
  "relative-clause-transfer",
  "run-on-sentences",
  "subject-verb-agreement",
  "tense-aspect-transfer",
  "topic-comment-transfer",
  "tone-stress-transfer",
  "verb-form-after-to",
  "word-family-confusion",
] as const;

export type KnownL1InterferenceId = (typeof KNOWN_L1_INTERFERENCE_IDS)[number];

export { WRITING_PLACEMENT_PROMPTS } from "./writing.ts";
export { SPEAKING_PLACEMENT_PROMPTS } from "./speaking.ts";
export { READING_PLACEMENT_PROMPTS } from "./reading.ts";
export { LISTENING_PLACEMENT_PROMPTS } from "./listening.ts";
export { CONVERSATION_PLACEMENT_PROMPTS } from "./conversation.ts";

import { CONVERSATION_PLACEMENT_PROMPTS } from "./conversation.ts";
import { LISTENING_PLACEMENT_PROMPTS } from "./listening.ts";
import { READING_PLACEMENT_PROMPTS } from "./reading.ts";
import { SPEAKING_PLACEMENT_PROMPTS } from "./speaking.ts";
import { WRITING_PLACEMENT_PROMPTS } from "./writing.ts";

export const PLACEMENT_V3_PROMPTS = [
  ...WRITING_PLACEMENT_PROMPTS,
  ...SPEAKING_PLACEMENT_PROMPTS,
  ...READING_PLACEMENT_PROMPTS,
  ...LISTENING_PLACEMENT_PROMPTS,
  ...CONVERSATION_PLACEMENT_PROMPTS,
] satisfies PlacementPrompt[];
