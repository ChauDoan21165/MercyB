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
const LABEL_PREFIX_PATTERN =
  /^(?:teacher\s+mercy|mercy|corrected(?:\s+version)?|correction|câu\s+đã\s+sửa|explanation|giải\s+thích(?:\s+ngắn)?|short\s+explanation|natural\s+reply|câu\s+trả\s+lời\s+tự\s+nhiên|next\s+question|question|learner|user|you|bạn\s+viết|gợi\s+ý)\s*[:：-]\s*/i;

function normalizeText(value: string | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeFragmentForDedupe(value: string): string {
  return value
    .replace(/[.!?。！？]+$/u, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function removeRepeatedSentenceFragments(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const half = Math.floor(trimmed.length / 2);
  if (trimmed.length % 2 === 0) {
    const first = trimmed.slice(0, half).trim();
    const second = trimmed.slice(half).trim();
    if (first && normalizeFragmentForDedupe(first) === normalizeFragmentForDedupe(second)) {
      return first;
    }
  }

  const fragments = trimmed.match(/[^.!?。！？]+[.!?。！？]*/gu) ?? [trimmed];
  const kept: string[] = [];
  for (const fragment of fragments) {
    const clean = fragment.trim();
    if (!clean) continue;
    const normalized = normalizeFragmentForDedupe(clean);
    const previous = kept.length ? normalizeFragmentForDedupe(kept[kept.length - 1]) : "";
    if (normalized && normalized === previous) continue;
    kept.push(clean);
  }

  return kept.join(" ").trim();
}

export function sanitizeSpeakableText(text: string | undefined): string {
  const lines = String(text ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .split(/\r?\n/)
    .map((line) => {
      let clean = line
        .replace(/^\s*(?:#{1,6}|\*|-|•|\d+[.)])\s*/u, "")
        .replace(/[`*_~>|[\]{}]/g, " ")
        .trim();
      while (LABEL_PREFIX_PATTERN.test(clean)) {
        clean = clean.replace(LABEL_PREFIX_PATTERN, "").trim();
      }
      return clean;
    })
    .filter(Boolean);

  return removeRepeatedSentenceFragments(lines.join(" ").replace(/\s+/g, " ").trim());
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
  return sanitizeSpeakableText(parts.map(sanitizeSpeakableText).filter(Boolean).join(" "));
}

function expectedSpeakableText(turn: TutorTurn): string {
  if (turn.mode === "correction") return sanitizeSpeakableText(turn.correctedText);
  return buildSpeakableText([turn.correctedText, turn.naturalReply, turn.nextQuestion]);
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
    naturalReply: naturalReply || undefined,
    nextQuestion: nextQuestion || undefined,
    shouldReadAloudText: buildSpeakableText([correctedText, naturalReply, nextQuestion]),
    createdAt: createIsoDate(input.createdAt),
  };

  return { turn };
}

export function validateTutorTurn(turn: TutorTurn): boolean {
  if (!turn || typeof turn !== "object") return false;
  if (!turn.id || !turn.mode || !turn.targetLanguage || !turn.explainLanguage || !turn.createdAt) {
    return false;
  }
  if (turn.mode !== "correction" && turn.mode !== "conversation") return false;
  if (Number.isNaN(new Date(turn.createdAt).getTime())) return false;
  if (turn.explanation.length > MAX_EXPLANATION_LENGTH) return false;
  if (!hasOnlyOneNextQuestion(turn)) return false;

  const speakable = sanitizeSpeakableText(turn.shouldReadAloudText);
  const expectedSpeakable = expectedSpeakableText(turn);
  if (turn.mode === "correction") {
    if (!normalizeText(turn.correctedText)) return false;
    if (!validateCorrectionChangedWhenNeeded(turn.userText, turn.correctedText).ok) return false;
    return Boolean(expectedSpeakable) && (!speakable || speakable === expectedSpeakable);
  }

  if (!expectedSpeakable) return false;
  if (speakable && speakable !== expectedSpeakable) return false;
  if (
    normalizeText(turn.correctedText) &&
    !validateCorrectionChangedWhenNeeded(turn.userText, turn.correctedText).ok
  ) {
    return false;
  }
  const userText = normalizeText(turn.userText);
  if (
    userText.length >= 8 &&
    expectedSpeakable.includes(userText) &&
    userText !== normalizeText(turn.correctedText)
  ) {
    return false;
  }

  return true;
}

export function getSpeakableText(turn: TutorTurn): string {
  if (!validateTutorTurn(turn)) return "";
  return expectedSpeakableText(turn);
}
