import { detectSpeakConversationContext, type SpeakConversationTopic } from "./speakConversationState";

export type ContentAwarePivotType =
  | "too_short"
  | "help_request"
  | "emotion_or_opinion"
  | "new_topic"
  | "clear_answer"
  | "correction_opportunity"
  | "unknown";

export type ContentAwarePivotAction =
  | "deepen_same_topic"
  | "clarify"
  | "switch_topic"
  | "encourage_expand"
  | "gentle_correction"
  | "graceful_pivot";

export type ContentAwareCorrectionSignal = {
  hasCorrection: boolean;
  issueId?: string;
  suggestedTeacherMove?: string;
};

export type ContentAwarePivotInput = {
  learnerText: string;
  currentTopicId?: string;
  topicLabel?: string;
  turnCountOnTopic?: number;
  previousQuestions?: string[];
  followUpIds?: string[];
  correctionSignal?: ContentAwareCorrectionSignal | null;
};

export type ContentAwarePivotDecision = {
  contentType: ContentAwarePivotType;
  pivotAction: ContentAwarePivotAction;
  topicId: string | null;
  topicLabel: string | null;
  suggestedFollowUpIntent: string | null;
  safeTeacherMove: string;
  reason: string;
};

const TOPIC_LABELS: Record<SpeakConversationTopic, string> = {
  morning: "Morning routine",
  work: "Work",
  office: "Office",
  lunch: "Lunch",
  evening: "Evening",
  dinner: "Dinner",
  family: "Family",
  commute: "Commute",
  general: "General practice",
};

const TOO_SHORT_WORD_LIMIT = 2;

function compact(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizedWords(value: string): string[] {
  return compact(value)
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function normalizeTopicId(topicId: string | undefined): string {
  return compact(topicId ?? "").toLowerCase() || "general";
}

function labelForTopic(topic: SpeakConversationTopic | string | null, fallback?: string): string | null {
  if (!topic) return fallback ?? null;
  return TOPIC_LABELS[topic as SpeakConversationTopic] ?? fallback ?? compact(topic);
}

function isHelpRequest(normalized: string): boolean {
  return /\b(i do not know|i don't know|i am not sure|i'm not sure|im not sure|not sure|dont know|don't know|help me|can you help|how to say|how do i say|what should i say)\b/.test(
    normalized,
  );
}

function isEmotionOrOpinion(normalized: string): boolean {
  return /\b(i like|i love|i hate|i feel|i am happy|i'm happy|i am tired|i'm tired|i am worried|i'm worried|i am sad|i'm sad|i think)\b/.test(
    normalized,
  );
}

function hasInternalCorrectionOpportunity(normalized: string): boolean {
  return (
    /\bi buy\b.+\byesterday\b/.test(normalized) ||
    /\bi go\b.+\byesterday\b/.test(normalized) ||
    /\b(two|three|four|five|many|several)\s+(book|student|day|hour|minute)\b/.test(normalized) ||
    /\b(i bought|she is|he is|this is)\s+(hat|teacher|doctor|student)\b/.test(normalized)
  );
}

function hasCorrectionOpportunity(input: ContentAwarePivotInput, normalized: string): boolean {
  if (input.correctionSignal?.hasCorrection) return true;
  return hasInternalCorrectionOpportunity(normalized);
}

function correctionMove(input: ContentAwarePivotInput): string {
  return input.correctionSignal?.suggestedTeacherMove ?? "Pause and show the small deterministic correction before asking the next question.";
}

function makeDecision(decision: ContentAwarePivotDecision): ContentAwarePivotDecision {
  return decision;
}

export function classifyContentAwarePivot(input: ContentAwarePivotInput): ContentAwarePivotDecision {
  const learnerText = compact(input.learnerText);
  const normalized = learnerText.toLowerCase();
  const words = normalizedWords(learnerText);
  const currentTopicId = normalizeTopicId(input.currentTopicId);
  const detectedContext = detectSpeakConversationContext(learnerText);
  const detectedTopicId = detectedContext.topic;
  const detectedTopicLabel = labelForTopic(detectedContext.topic);

  if (words.length === 0) {
    return makeDecision({
      contentType: "too_short",
      pivotAction: "clarify",
      topicId: currentTopicId === "general" ? null : currentTopicId,
      topicLabel: labelForTopic(currentTopicId, input.topicLabel),
      suggestedFollowUpIntent: "clarify-empty-answer",
      safeTeacherMove: "Ask the learner to say one short sentence.",
      reason: "empty_answer",
    });
  }

  if (isHelpRequest(normalized)) {
    return makeDecision({
      contentType: "help_request",
      pivotAction: "encourage_expand",
      topicId: currentTopicId === "general" ? null : currentTopicId,
      topicLabel: labelForTopic(currentTopicId, input.topicLabel),
      suggestedFollowUpIntent: "offer-model-answer",
      safeTeacherMove: "Offer one simple model sentence, then ask the learner to repeat or adapt it.",
      reason: "learner_requested_help",
    });
  }

  if (words.length <= TOO_SHORT_WORD_LIMIT) {
    return makeDecision({
      contentType: "too_short",
      pivotAction: "clarify",
      topicId: currentTopicId === "general" ? null : currentTopicId,
      topicLabel: labelForTopic(currentTopicId, input.topicLabel),
      suggestedFollowUpIntent: "clarify-short-answer",
      safeTeacherMove: "Ask one clarifying follow-up instead of changing topic.",
      reason: "answer_too_short",
    });
  }

  if (isEmotionOrOpinion(normalized)) {
    return makeDecision({
      contentType: "emotion_or_opinion",
      pivotAction: "encourage_expand",
      topicId: detectedTopicId === "general" ? (currentTopicId === "general" ? null : currentTopicId) : detectedTopicId,
      topicLabel: detectedTopicId === "general" ? labelForTopic(currentTopicId, input.topicLabel) : detectedTopicLabel,
      suggestedFollowUpIntent: "ask-why-or-detail",
      safeTeacherMove: "Acknowledge the feeling or opinion and invite one more detail.",
      reason: "emotion_or_opinion_detected",
    });
  }

  if (hasCorrectionOpportunity(input, normalized)) {
    const topicId = detectedTopicId === "general" ? (currentTopicId === "general" ? null : currentTopicId) : detectedTopicId;
    return makeDecision({
      contentType: "correction_opportunity",
      pivotAction: "gentle_correction",
      topicId,
      topicLabel: detectedTopicId === "general" ? labelForTopic(topicId, input.topicLabel) : detectedTopicLabel,
      suggestedFollowUpIntent: input.correctionSignal?.issueId ?? "deterministic-correction",
      safeTeacherMove: correctionMove(input),
      reason: input.correctionSignal?.issueId ?? "safe_deterministic_pattern",
    });
  }

  if (detectedTopicId !== "general" && detectedTopicId !== currentTopicId) {
    return makeDecision({
      contentType: "new_topic",
      pivotAction: "switch_topic",
      topicId: detectedTopicId,
      topicLabel: detectedTopicLabel,
      suggestedFollowUpIntent: `switch-to-${detectedTopicId}`,
      safeTeacherMove: `Switch to ${detectedTopicLabel} and ask a topic-specific follow-up.`,
      reason: "clear_new_topic_detected",
    });
  }

  if (detectedContext.isUnclear) {
    return makeDecision({
      contentType: "unknown",
      pivotAction: "clarify",
      topicId: currentTopicId === "general" ? null : currentTopicId,
      topicLabel: labelForTopic(currentTopicId, input.topicLabel),
      suggestedFollowUpIntent: "clarify-unclear-answer",
      safeTeacherMove: "Ask the learner to repeat the unclear part in one short sentence.",
      reason: "unclear_detection",
    });
  }

  if (words.length >= 3) {
    const topicId = detectedTopicId === "general" ? (currentTopicId === "general" ? null : currentTopicId) : detectedTopicId;
    const topicLabel = detectedTopicId === "general" ? labelForTopic(topicId, input.topicLabel) : detectedTopicLabel;
    return makeDecision({
      contentType: "clear_answer",
      pivotAction: "deepen_same_topic",
      topicId,
      topicLabel,
      suggestedFollowUpIntent: topicId ? `deepen-${topicId}` : "ask-one-detail",
      safeTeacherMove: "Stay on the learner's current topic and ask one non-repeated follow-up.",
      reason: "meaningful_answer_on_current_topic",
    });
  }

  return makeDecision({
    contentType: "unknown",
    pivotAction: "clarify",
    topicId: currentTopicId === "general" ? null : currentTopicId,
    topicLabel: labelForTopic(currentTopicId, input.topicLabel),
    suggestedFollowUpIntent: null,
    safeTeacherMove: "Do not infer a new topic. Ask for clarification if another turn is needed.",
    reason: "no_confident_classification",
  });
}
