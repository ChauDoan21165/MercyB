import type { BilingualSaliencePivot } from "@/lib/tutor/bilingualSalienceDetector";

export type ResponseStance =
  | "neutral"
  | "needs_acknowledgment"
  | "needs_clarification"
  | "needs_pause";

export type ResponseStanceInput = {
  learnerText: string;
  salience?: BilingualSaliencePivot | null;
};

export type ResponseStanceDecision = {
  stance: ResponseStance;
  reason: string;
  priority: number;
  advisoryCopy: string;
};

export const RESPONSE_STANCE_ADVISORY_COPY: Readonly<Record<ResponseStance, string>> = {
  neutral: "Continue with the normal tutor response.",
  needs_acknowledgment: "Briefly acknowledge the learner's feeling or opinion before continuing.",
  needs_clarification: "Ask one simple clarifying question before continuing.",
  needs_pause: "Pause correction and respond carefully before continuing.",
};

const UNCLEAR_PATTERNS = [
  "confused",
  "i do not understand",
  "i don't understand",
  "i dont understand",
  "not understand",
  "what do you mean",
  "what?",
  "không hiểu",
  "khong hieu",
  "chưa hiểu",
  "chua hieu",
];

const MILD_ACK_PATTERNS = [
  "happy",
  "sad",
  "tired",
  "worried",
  "fun",
  "boring",
  "delicious",
  "expensive",
  "vui",
  "buồn",
  "mệt",
  "lo",
  "thích",
  "ghét",
];

const PAUSE_PATTERNS = [
  "passed away",
  "died",
  "death",
  "scared",
  "afraid",
  "hurt",
  "accident",
  "very sick",
  "chết",
  "sợ",
  "đau",
  "tai nạn",
  "bệnh nặng",
  "om nang",
];

function normalizeText(value: string): string {
  return value
    .toLocaleLowerCase("en")
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function phraseRegex(phrase: string): RegExp {
  const body = escapeRegExp(normalizeText(phrase)).replace(/\\ /g, "\\s+");
  return new RegExp(`(?<![\\p{L}\\p{N}])${body}(?![\\p{L}\\p{N}])`, "u");
}

function containsAny(text: string, phrases: readonly string[]): boolean {
  return phrases.some((phrase) => phraseRegex(phrase).test(text));
}

function decision(stance: ResponseStance, reason: string, priority: number): ResponseStanceDecision {
  return {
    stance,
    reason,
    priority,
    advisoryCopy: RESPONSE_STANCE_ADVISORY_COPY[stance],
  };
}

function salienceSuggestsPause(salience: BilingualSaliencePivot | null | undefined): boolean {
  if (!salience?.highStakes) return false;
  return true;
}

export function classifyResponseStance(
  input: ResponseStanceInput,
): ResponseStanceDecision {
  const normalized = normalizeText(input.learnerText);

  if (salienceSuggestsPause(input.salience) || containsAny(normalized, PAUSE_PATTERNS)) {
    return decision("needs_pause", "safety_adjacent_or_distress_like_content", 100);
  }

  if (containsAny(normalized, UNCLEAR_PATTERNS)) {
    return decision("needs_clarification", "learner_reply_unclear", 70);
  }

  if (
    input.salience?.signalType === "ordinary_salience" ||
    input.salience?.signalType === "contradiction" ||
    containsAny(normalized, MILD_ACK_PATTERNS)
  ) {
    return decision("needs_acknowledgment", "mild_salience_or_contrast", 50);
  }

  return decision("neutral", "no_response_stance_signal", 0);
}
