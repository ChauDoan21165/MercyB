import type {
  TutorConversationResult,
  TutorCorrectionResult,
  TutorExplainLanguage,
  TutorMode,
  TutorTargetLanguage,
  TutorTurn,
} from "./tutorTypes";
import { validateCorrectionChangedWhenNeeded } from "./correctionEngine";

type BaseTurnInput = {
  id?: string;
  targetLanguage: TutorTargetLanguage;
  explainLanguage: TutorExplainLanguage;
  userText: string;
  correctedText?: string;
  explanation?: string;
  createdAt?: string;
};

type CorrectionTurnInput = BaseTurnInput & {
  correctedText: string;
  explanation: string;
};

type ConversationTurnInput = BaseTurnInput & {
  naturalReply?: string;
  nextQuestion: string;
};

const MAX_EXPLANATION_LENGTH = 240;

function normalizeText(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function createTurnId(mode: TutorMode): string {
  return `${mode}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function createIsoDate(value: string | undefined): string {
  const parsed = value ? new Date(value) : new Date();
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString();
  return parsed.toISOString();
}

function shortenExplanation(value: string | undefined): string {
  const normalized = normalizeText(value);
  if (normalized.length <= MAX_EXPLANATION_LENGTH) return normalized;
  return `${normalized.slice(0, MAX_EXPLANATION_LENGTH - 3).trim()}...`;
}

function getQuestionCount(value: string | undefined): number {
  return normalizeText(value).match(/[?？]/g)?.length ?? 0;
}

function keepOneQuestion(value: string | undefined): string {
  const normalized = normalizeText(value);
  const firstQuestionEnd = normalized.search(/[?？]/);
  if (firstQuestionEnd === -1) return normalized;
  return normalized.slice(0, firstQuestionEnd + 1).trim();
}

function hasOnlyOneNextQuestion(turn: TutorTurn): boolean {
  if (turn.mode !== "conversation") return true;
  const question = normalizeText(turn.nextQuestion);
  return Boolean(question) && getQuestionCount(question) <= 1;
}

function buildSpeakableText(parts: Array<string | undefined>): string {
  return parts.map(normalizeText).filter(Boolean).join(" ");
}

function isTutorTurnShape(value: unknown): value is TutorTurn {
  if (!value || typeof value !== "object") return false;
  const turn = value as Record<string, unknown>;
  return (
    typeof turn.id === "string" &&
    typeof turn.mode === "string" &&
    typeof turn.targetLanguage === "string" &&
    typeof turn.explainLanguage === "string" &&
    typeof turn.userText === "string" &&
    typeof turn.correctedText === "string" &&
    typeof turn.explanation === "string" &&
    typeof turn.naturalReply === "string" &&
    typeof turn.nextQuestion === "string" &&
    typeof turn.shouldReadAloudText === "string" &&
    typeof turn.createdAt === "string"
  );
}

export function buildCorrectionTurn(input: CorrectionTurnInput): TutorCorrectionResult {
  const correctedText = normalizeText(input.correctedText);
  const turn: TutorTurn = {
    id: normalizeText(input.id) || createTurnId("correction"),
    mode: "correction",
    targetLanguage: normalizeText(input.targetLanguage),
    explainLanguage: normalizeText(input.explainLanguage),
    userText: normalizeText(input.userText),
    correctedText,
    explanation: shortenExplanation(input.explanation),
    naturalReply: "",
    nextQuestion: "",
    shouldReadAloudText: correctedText,
    createdAt: createIsoDate(input.createdAt),
  };

  return { turn };
}

export function buildConversationTurn(input: ConversationTurnInput): TutorConversationResult {
  const correctedText = normalizeText(input.correctedText);
  const naturalReply = normalizeText(input.naturalReply);
  const nextQuestion = keepOneQuestion(input.nextQuestion);
  const turn: TutorTurn = {
    id: normalizeText(input.id) || createTurnId("conversation"),
    mode: "conversation",
    targetLanguage: normalizeText(input.targetLanguage),
    explainLanguage: normalizeText(input.explainLanguage),
    userText: normalizeText(input.userText),
    correctedText,
    explanation: shortenExplanation(input.explanation),
    naturalReply,
    nextQuestion,
    shouldReadAloudText: buildSpeakableText([correctedText, naturalReply, nextQuestion]),
    createdAt: createIsoDate(input.createdAt),
  };

  return { turn };
}

export function validateTutorTurn(turn: unknown): turn is TutorTurn {
  if (!isTutorTurnShape(turn)) return false;
  if (!turn.id || !turn.mode || !turn.targetLanguage || !turn.explainLanguage || !turn.createdAt) {
    return false;
  }
  if (turn.mode !== "correction" && turn.mode !== "conversation") return false;
  if (Number.isNaN(new Date(turn.createdAt).getTime())) return false;
  if (turn.explanation.length > MAX_EXPLANATION_LENGTH) return false;
  if (!hasOnlyOneNextQuestion(turn)) return false;

  const speakable = normalizeText(turn.shouldReadAloudText);
  if (turn.mode === "correction") {
    if (!normalizeText(turn.correctedText)) return false;
    if (!validateCorrectionChangedWhenNeeded(turn.userText, turn.correctedText).ok) return false;
    return speakable === normalizeText(turn.correctedText);
  }

  if (!speakable) return false;
  if (
    normalizeText(turn.correctedText) &&
    !validateCorrectionChangedWhenNeeded(turn.userText, turn.correctedText).ok
  ) {
    return false;
  }
  const userText = normalizeText(turn.userText);
  if (
    userText.length >= 8 &&
    speakable.includes(userText) &&
    userText !== normalizeText(turn.correctedText)
  ) {
    return false;
  }

  return true;
}

export function getSpeakableText(turn: unknown): string {
  if (!validateTutorTurn(turn)) return "";
  return normalizeText(turn.shouldReadAloudText);
}
