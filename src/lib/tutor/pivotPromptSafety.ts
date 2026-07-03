import type { BilingualSaliencePivot } from "./bilingualSalienceDetector";

export type PivotPromptRole = "learner" | "assistant";

export type PivotPromptTurn = {
  role: PivotPromptRole;
  text: string;
};

export type PivotPromptInput = {
  currentLearnerReply: string;
  selectedSaliencePivot: BilingualSaliencePivot;
  sessionTurns: PivotPromptTurn[];
};

export type PivotCandidateRejectReason =
  | "empty"
  | "too_long"
  | "as_ai"
  | "hollow_praise"
  | "missing_question"
  | "multiple_questions"
  | "missing_punctuation"
  | "repeated_previous_assistant";

export type PivotCandidateCheck =
  | { ok: true; text: string }
  | { ok: false; reason: PivotCandidateRejectReason };

export type PivotResponseDecision =
  | { source: "pivot"; text: string }
  | {
      source: "deterministic_fallback";
      text: string;
      rejectReason?: PivotCandidateRejectReason | "timeout_or_failure";
    };

export type PivotResponseDecisionInput = {
  candidate?: string | null;
  promptInput: PivotPromptInput;
  failed?: boolean;
};

const MAX_PIVOT_RESPONSE_WORDS = 30;
const ENDING_PUNCTUATION = /[.!?。！？]$/;
const HOLLOW_PRAISE = /\b(?:great job|that's wonderful|that is wonderful|nice|awesome|amazing|that's great|that is great)\b/i;
const AS_AN_AI = /\bas (?:an ai|a language model)\b/i;
const QUESTION_STARTER = /^(?:what|where|why|who|how|when|do|does|did|can|could|would|is|are|will|should)\b/i;
const QUESTION_WORD = /\b(?:what|where|why|who|how|when|do|does|did|can|could|would|is|are|will|should)\b/i;

function compact(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function countWords(value: string): number {
  return compact(value).split(/\s+/).filter(Boolean).length;
}

function normalizeForRepeatCheck(value: string): string {
  return compact(value).toLocaleLowerCase("en").replace(/[.!?。！？\s]+$/g, "");
}

function questionCount(value: string): number {
  const explicitQuestions = (value.match(/[?？]/g) ?? []).length;
  const implicitQuestionLines = value
    .split(/\r?\n/)
    .map(compact)
    .filter((line) => line && !/[?？]/.test(line) && QUESTION_STARTER.test(line))
    .length;
  return explicitQuestions + implicitQuestionLines;
}

function hasSemanticQuestion(value: string): boolean {
  return QUESTION_WORD.test(value);
}

function lastThreeTurns(turns: PivotPromptTurn[]): PivotPromptTurn[] {
  return turns
    .map((turn) => ({
      role: turn.role,
      text: compact(turn.text),
    }))
    .filter((turn) => turn.text)
    .slice(-3);
}

function previousAssistantTurn(turns: PivotPromptTurn[]): string {
  for (let index = turns.length - 1; index >= 0; index -= 1) {
    if (turns[index].role === "assistant") return turns[index].text;
  }

  return "";
}

function salienceLabel(pivot: BilingualSaliencePivot): string {
  if (pivot.highStakes) return "important personal detail";
  if (pivot.signalType === "contradiction") return "changed or corrected detail";
  return "specific detail";
}

export function buildConstrainedPivotPrompt(input: PivotPromptInput): string {
  const currentReply = compact(input.currentLearnerReply);
  const pivot = input.selectedSaliencePivot;
  const recentTurns = lastThreeTurns(input.sessionTurns)
    .map((turn) => `${turn.role}: ${turn.text}`)
    .join("\n");

  return [
    "Write one Teacher Mercy follow-up for a Vietnamese learner practicing English.",
    `Current learner reply: ${currentReply}`,
    `Salience token: ${compact(pivot.matchedText)}`,
    `Salience signal type: ${pivot.signalType}`,
    `Salience priority: ${pivot.priority}`,
    `Salience confidence: ${pivot.confidence}`,
    `Salience high stakes: ${pivot.highStakes ? "yes" : "no"}`,
    `Salience decision: ${salienceLabel(pivot)}`,
    "Last 3 session turns only:",
    recentTurns || "(none)",
    "Rules:",
    "- Write 1-2 short sentences.",
    "- Acknowledge one specific detail from the learner's reply or salience token.",
    "- Ask exactly one natural follow-up question.",
    "- Use simple English for a Vietnamese learner.",
    "- Do not introduce a new topic.",
    "- Do not use hollow praise like \"Nice\", \"Great job\", or \"That's great\".",
  ].join("\n");
}

export function checkPivotCandidate(candidate: string, previousAssistant = ""): PivotCandidateCheck {
  const text = compact(candidate);

  if (!text) return { ok: false, reason: "empty" };
  if (countWords(text) > MAX_PIVOT_RESPONSE_WORDS) return { ok: false, reason: "too_long" };
  if (AS_AN_AI.test(text)) return { ok: false, reason: "as_ai" };
  if (HOLLOW_PRAISE.test(text)) return { ok: false, reason: "hollow_praise" };
  const questions = questionCount(candidate);
  if (questions === 0 || !hasSemanticQuestion(candidate)) return { ok: false, reason: "missing_question" };
  if (questions > 1) return { ok: false, reason: "multiple_questions" };
  if (!ENDING_PUNCTUATION.test(text)) return { ok: false, reason: "missing_punctuation" };
  if (previousAssistant && normalizeForRepeatCheck(text) === normalizeForRepeatCheck(previousAssistant)) {
    return { ok: false, reason: "repeated_previous_assistant" };
  }

  return { ok: true, text };
}

export function buildDeterministicPivotFallback(input: PivotPromptInput): string {
  const token = compact(input.selectedSaliencePivot.matchedText);
  const detail = token || (input.selectedSaliencePivot.highStakes ? "this important personal detail" : "your last answer");

  if (input.selectedSaliencePivot.highStakes) {
    return `I understand ${detail}. Do you want to say more about it?`;
  }

  return `I understand ${detail}. What happened next?`;
}

export function decidePivotResponse(input: PivotResponseDecisionInput): PivotResponseDecision {
  if (input.failed || input.candidate == null) {
    return {
      source: "deterministic_fallback",
      text: buildDeterministicPivotFallback(input.promptInput),
      rejectReason: "timeout_or_failure",
    };
  }

  const checked = checkPivotCandidate(input.candidate, previousAssistantTurn(input.promptInput.sessionTurns));

  if (checked.ok) {
    return { source: "pivot", text: checked.text };
  }

  return {
    source: "deterministic_fallback",
    text: buildDeterministicPivotFallback(input.promptInput),
    rejectReason: checked.reason,
  };
}
