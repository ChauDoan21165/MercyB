import {
  classifyContentAwarePivot,
  type ContentAwareCorrectionSignal,
  type ContentAwarePivotDecision,
  type ContentAwarePivotType,
} from "./contentAwarePivots";
import { checkPivotCandidate } from "./pivotPromptSafety";

/**
 * Conversation turn policy (Steps 8-9). Deterministic, client-side, no LLM call.
 *
 * Decides whether the next AI turn should:
 *  - persist the current topic and deepen it (topic continuity),
 *  - pivot on what the LEARNER just introduced,
 *  - gracefully redirect an off-topic or low-confidence turn (never dead-end), or
 *  - warmly offer to move on once the topic depth cap is reached,
 * and returns a prompt-ready instruction the orchestrator/prompt layer injects into the turn
 * prompt. Anti-repetition is enforced against recently asked questions.
 *
 * Composition: reuses classifyContentAwarePivot (learner-input pivoting) and checkPivotCandidate
 * (repetition/safety guard). Those helpers are imported, never modified.
 */

// Step 8: a conversation should stay on its selected scenario/topic for at least 4 turns before
// the engine offers to move on. 4+ turns == topic persistence / continuity.
export const TOPIC_MIN_TURNS = 4;
// Anti-repetition lookback: how many recently asked questions we guard the next turn against.
export const RECENT_QUESTION_WINDOW = 8;

export type TurnPolicyAction =
  | "persist_topic"
  | "pivot_on_learner"
  | "redirect_off_topic"
  | "offer_move_on";

export type TurnPolicyInput = {
  /** What the learner just said this turn. */
  learnerText: string;
  currentTopicId?: string;
  topicLabel?: string;
  /** Turns already spent on the current topic (count of prior on-topic turns). */
  turnsOnTopic: number;
  /** Recently asked AI questions, newest last — the next turn must not repeat any of these. */
  recentQuestions?: readonly string[];
  askedFollowUpIds?: readonly string[];
  correctionSignal?: ContentAwareCorrectionSignal | null;
  /** True when pronunciation / Vietlish / interference confidence was null or low. The engine
   * MUST redirect into engaging practice — never dead-end and never guess. */
  abstain?: boolean;
};

export type TurnPolicyDecision = {
  action: TurnPolicyAction;
  topicId: string | null;
  topicLabel: string | null;
  /** Turns-on-topic the orchestrator should carry into the next turn. */
  turnsOnTopic: number;
  pivotType: ContentAwarePivotType;
  /** True when the naive next question would echo a recent one; the instruction avoids repetition. */
  repetitionRisk: boolean;
  /** Prompt-ready instruction for the orchestrator/prompt layer (no raw model output here). */
  promptInstruction: string;
  reason: string;
};

function compact(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/** True when the suggested next intent would repeat a recently asked question. */
function detectRepetitionRisk(intent: string, recentQuestions: readonly string[]): boolean {
  const probe = compact(intent);
  if (!probe) return false;
  const previous = recentQuestions[recentQuestions.length - 1] ?? "";
  const safety = checkPivotCandidate(probe, previous);
  if (!safety.ok && safety.reason === "repeated_previous_assistant") return true;
  const needle = probe.toLowerCase();
  return recentQuestions.some((question) => compact(question).toLowerCase() === needle);
}

/** Anti-repetition guard appended to every instruction so the next turn avoids recent questions. */
function recentQuestionsGuard(recentQuestions: readonly string[]): string {
  if (recentQuestions.length === 0) return "";
  const recent = recentQuestions
    .slice(-RECENT_QUESTION_WINDOW)
    .map((question) => `"${compact(question)}"`)
    .join("; ");
  return ` Avoid repetition: do not repeat any recent question — ${recent}.`;
}

function persistInstruction(pivot: ContentAwarePivotDecision, recentQuestions: readonly string[]): string {
  const where = pivot.topicLabel ? ` (${pivot.topicLabel})` : "";
  return `Stay on the current topic${where} and deepen it with one fresh question that builds on what the learner said. ${pivot.safeTeacherMove}${recentQuestionsGuard(recentQuestions)}`;
}

function pivotInstruction(pivot: ContentAwarePivotDecision, recentQuestions: readonly string[]): string {
  const where = pivot.topicLabel ? ` (${pivot.topicLabel})` : "";
  return `Pivot to what the learner just introduced${where} — follow their own words, not the original script. ${pivot.safeTeacherMove}${recentQuestionsGuard(recentQuestions)}`;
}

function redirectInstruction(pivot: ContentAwarePivotDecision, recentQuestions: readonly string[]): string {
  return `The learner went off-topic or confidence is low — redirect gently into engaging practice. Never dead-end and never guess. ${pivot.safeTeacherMove}${recentQuestionsGuard(recentQuestions)}`;
}

function moveOnInstruction(pivot: ContentAwarePivotDecision, recentQuestions: readonly string[]): string {
  const where = pivot.topicLabel ? ` this topic${pivot.topicLabel ? ` (${pivot.topicLabel})` : ""}` : " this topic";
  return `You have stayed on${where} for ${TOPIC_MIN_TURNS}+ turns. Warmly offer to move on — but only offer, never force it, and keep the door open if the learner wants to continue.${recentQuestionsGuard(recentQuestions)}`;
}

function finalize(
  action: TurnPolicyAction,
  pivot: ContentAwarePivotDecision,
  turnsOnTopic: number,
  repetitionRisk: boolean,
  promptInstruction: string,
  reason: string,
): TurnPolicyDecision {
  return {
    action,
    topicId: pivot.topicId,
    topicLabel: pivot.topicLabel,
    turnsOnTopic,
    pivotType: pivot.contentType,
    repetitionRisk,
    promptInstruction,
    reason,
  };
}

export function decideConversationTurnPolicy(input: TurnPolicyInput): TurnPolicyDecision {
  const learnerText = compact(input.learnerText);
  const recentQuestions = input.recentQuestions ?? [];
  const turnsOnTopic = Math.max(0, Math.trunc(input.turnsOnTopic) || 0);

  const pivot = classifyContentAwarePivot({
    learnerText,
    currentTopicId: input.currentTopicId,
    topicLabel: input.topicLabel,
    turnCountOnTopic: turnsOnTopic,
    previousQuestions: [...recentQuestions],
    followUpIds: input.askedFollowUpIds ? [...input.askedFollowUpIds] : undefined,
    correctionSignal: input.correctionSignal ?? null,
  });

  const repetitionRisk = detectRepetitionRisk(pivot.suggestedFollowUpIntent ?? "", recentQuestions);

  // 1) Abstention (null/low confidence) -> safe graceful redirect, never a dead-end.
  if (input.abstain) {
    return finalize(
      "redirect_off_topic",
      pivot,
      turnsOnTopic,
      repetitionRisk,
      redirectInstruction(pivot, recentQuestions),
      "abstain_redirect_no_dead_end",
    );
  }

  // 2) Learner clearly introduced a new topic -> pivot on the learner's own words (Step 9).
  if (pivot.contentType === "new_topic" || pivot.pivotAction === "switch_topic") {
    return finalize(
      "pivot_on_learner",
      pivot,
      0,
      repetitionRisk,
      pivotInstruction(pivot, recentQuestions),
      "pivot_on_learner_input",
    );
  }

  // 3) Off-topic / unclear / help request -> redirect or clarify without leaving the scenario.
  if (pivot.pivotAction === "graceful_pivot" || pivot.pivotAction === "clarify") {
    return finalize(
      "redirect_off_topic",
      pivot,
      turnsOnTopic,
      repetitionRisk,
      redirectInstruction(pivot, recentQuestions),
      pivot.reason,
    );
  }

  // 4) Topic persistence: keep deepening until the 4-turn cap, then OFFER (never force) to move on.
  if (turnsOnTopic >= TOPIC_MIN_TURNS) {
    return finalize(
      "offer_move_on",
      pivot,
      turnsOnTopic,
      repetitionRisk,
      moveOnInstruction(pivot, recentQuestions),
      "topic_depth_cap_reached",
    );
  }

  return finalize(
    "persist_topic",
    pivot,
    turnsOnTopic + 1,
    repetitionRisk,
    persistInstruction(pivot, recentQuestions),
    "deepen_same_topic",
  );
}
