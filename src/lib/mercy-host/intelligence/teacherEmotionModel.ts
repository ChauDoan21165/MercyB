export type PaceAdjustment = "slow" | "normal" | "fast";
export type CognitiveLoadLevel = "low" | "moderate" | "high";
export type EmotionSignal =
  | "curious"
  | "proud"
  | "discouraged"
  | "embarrassed"
  | "overwhelmed"
  | "frustrated"
  | "confused"
  | "neutral";

export interface TeacherEmotionModelInput {
  learnerState?: {
    confusionLevel?: number;        // 0..1
    confidenceLevel?: number;       // 0..1
    frustrationLevel?: number;      // 0..1
    engagementLevel?: number;       // 0..1
    momentumLevel?: number;         // 0..1
    recentSuccessRate?: number;     // 0..1
    correctionSensitivity?: number; // 0..1
    emotionalState?: string;
  };
  lastTurn?: {
    learnerMessage?: string;
    wasCorrected?: boolean;
    retriedAfterMistake?: boolean;
    succeededAfterRetry?: boolean;
    askedFollowUpQuestion?: boolean;
    explicitEmotion?: string;
  };
  sessionState?: {
    consecutiveMistakes?: number;
    consecutiveSuccesses?: number;
    recentCorrections?: number;
    recentChallengesCompleted?: number;
    recapRequestedRecently?: boolean;
    struggleStreak?: number;
  };
}

export interface TeacherEmotionState {
  primarySignal: EmotionSignal;
  secondarySignals: EmotionSignal[];
  humorAllowance: number; // 0..1
  warmthLevel: number; // 0..1
  paceAdjustment: PaceAdjustment;
  cognitiveLoadLevel: CognitiveLoadLevel;
  momentumProtection: boolean;
  correctionSoftnessBias: number; // 0..1
  explanationDepthBias: number; // 0..1
  encouragementBias: number; // 0..1
  challengeReadiness: number; // 0..1
  reasoning: string[];
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeEmotionLabel(raw?: string): EmotionSignal | null {
  if (!raw) return null;
  const s = raw.trim().toLowerCase();

  if (["curious", "interested", "engaged", "inquisitive"].includes(s)) return "curious";
  if (["proud", "confident", "happy", "satisfied"].includes(s)) return "proud";
  if (["discouraged", "deflated", "down"].includes(s)) return "discouraged";
  if (["embarrassed", "ashamed", "self-conscious"].includes(s)) return "embarrassed";
  if (["overwhelmed", "flooded", "overloaded"].includes(s)) return "overwhelmed";
  if (["frustrated", "annoyed", "stuck"].includes(s)) return "frustrated";
  if (["confused", "unsure", "lost"].includes(s)) return "confused";
  if (["neutral", "ok", "fine"].includes(s)) return "neutral";

  return null;
}

function inferPrimarySignal(input: TeacherEmotionModelInput, reasoning: string[]): EmotionSignal {
  const learnerState = input.learnerState ?? {};
  const lastTurn = input.lastTurn ?? {};
  const sessionState = input.sessionState ?? {};

  const explicit =
    normalizeEmotionLabel(lastTurn.explicitEmotion) ??
    normalizeEmotionLabel(learnerState.emotionalState);

  if (explicit) {
    reasoning.push(`explicit emotion detected: ${explicit}`);
    return explicit;
  }

  const confusion = clamp(learnerState.confusionLevel ?? 0);
  const confidence = clamp(learnerState.confidenceLevel ?? 0.5);
  const frustration = clamp(learnerState.frustrationLevel ?? 0);
  const engagement = clamp(learnerState.engagementLevel ?? 0.5);
  const momentum = clamp(learnerState.momentumLevel ?? 0.5);
  const successRate = clamp(learnerState.recentSuccessRate ?? 0.5);
  const correctionSensitivity = clamp(learnerState.correctionSensitivity ?? 0.5);
  const mistakes = sessionState.consecutiveMistakes ?? 0;
  const successes = sessionState.consecutiveSuccesses ?? 0;
  const struggleStreak = sessionState.struggleStreak ?? 0;

  if (confusion > 0.8 || struggleStreak >= 3 || (mistakes >= 3 && frustration > 0.5)) {
    reasoning.push("high confusion/struggle suggests overwhelm");
    return "overwhelmed";
  }

  if (lastTurn.wasCorrected && correctionSensitivity > 0.7 && confidence < 0.45) {
    reasoning.push("recent correction plus low confidence suggests embarrassment");
    return "embarrassed";
  }

  if (frustration > 0.7) {
    reasoning.push("high frustration detected");
    return "frustrated";
  }

  if (confidence < 0.35 && successRate < 0.45) {
    reasoning.push("low confidence and low recent success suggest discouragement");
    return "discouraged";
  }

  if (confusion > 0.55) {
    reasoning.push("elevated confusion detected");
    return "confused";
  }

  if (
    successes >= 2 &&
    successRate > 0.7 &&
    confidence > 0.65 &&
    (lastTurn.succeededAfterRetry || momentum > 0.65)
  ) {
    reasoning.push("recent success and recovery suggest pride");
    return "proud";
  }

  if (lastTurn.askedFollowUpQuestion || (engagement > 0.7 && confusion < 0.5)) {
    reasoning.push("follow-up question or high engagement suggests curiosity");
    return "curious";
  }

  reasoning.push("no strong signal; defaulting to neutral");
  return "neutral";
}

function inferSecondarySignals(
  primary: EmotionSignal,
  input: TeacherEmotionModelInput,
): EmotionSignal[] {
  const learnerState = input.learnerState ?? {};
  const sessionState = input.sessionState ?? {};

  const confusion = clamp(learnerState.confusionLevel ?? 0);
  const confidence = clamp(learnerState.confidenceLevel ?? 0.5);
  const frustration = clamp(learnerState.frustrationLevel ?? 0);
  const engagement = clamp(learnerState.engagementLevel ?? 0.5);
  const successRate = clamp(learnerState.recentSuccessRate ?? 0.5);
  const recentCorrections = sessionState.recentCorrections ?? 0;

  const candidates: EmotionSignal[] = [];

  if (primary !== "confused" && confusion > 0.45) candidates.push("confused");
  if (primary !== "frustrated" && frustration > 0.45) candidates.push("frustrated");
  if (primary !== "discouraged" && confidence < 0.4 && successRate < 0.5) candidates.push("discouraged");
  if (primary !== "curious" && engagement > 0.7) candidates.push("curious");
  if (primary !== "proud" && successRate > 0.75) candidates.push("proud");
  if (primary !== "embarrassed" && recentCorrections >= 2 && confidence < 0.45) {
    candidates.push("embarrassed");
  }

  return [...new Set(candidates)].slice(0, 2);
}

export function teacherEmotionModel(
  input: TeacherEmotionModelInput,
): TeacherEmotionState {
  const learnerState = input.learnerState ?? {};
  const lastTurn = input.lastTurn ?? {};
  const sessionState = input.sessionState ?? {};
  const reasoning: string[] = [];

  const primarySignal = inferPrimarySignal(input, reasoning);
  const secondarySignals = inferSecondarySignals(primarySignal, input);

  const confusion = clamp(learnerState.confusionLevel ?? 0);
  const confidence = clamp(learnerState.confidenceLevel ?? 0.5);
  const frustration = clamp(learnerState.frustrationLevel ?? 0);
  const engagement = clamp(learnerState.engagementLevel ?? 0.5);
  const momentum = clamp(learnerState.momentumLevel ?? 0.5);
  const successRate = clamp(learnerState.recentSuccessRate ?? 0.5);
  const correctionSensitivity = clamp(learnerState.correctionSensitivity ?? 0.5);
  const mistakes = sessionState.consecutiveMistakes ?? 0;
  const successes = sessionState.consecutiveSuccesses ?? 0;
  const recentCorrections = sessionState.recentCorrections ?? 0;

  let humorAllowance = 0.45;
  let warmthLevel = 0.55;
  let paceAdjustment: PaceAdjustment = "normal";
  let cognitiveLoadLevel: CognitiveLoadLevel = "moderate";
  let momentumProtection = false;
  let correctionSoftnessBias = 0.5;
  let explanationDepthBias = 0.5;
  let encouragementBias = 0.5;
  let challengeReadiness = 0.5;

  if (confusion > 0.75 || primarySignal === "overwhelmed") {
    cognitiveLoadLevel = "high";
    paceAdjustment = "slow";
    explanationDepthBias = 0.75;
    challengeReadiness = 0.2;
    humorAllowance -= 0.25;
    warmthLevel += 0.2;
    encouragementBias += 0.2;
    correctionSoftnessBias += 0.2;
    reasoning.push("high load -> slower pace, more warmth, lower challenge");
  } else if (confusion < 0.3 && engagement > 0.65) {
    cognitiveLoadLevel = "low";
    explanationDepthBias -= 0.1;
    challengeReadiness += 0.15;
    reasoning.push("low load -> can preserve pace and raise challenge slightly");
  }

  switch (primarySignal) {
    case "embarrassed":
      humorAllowance -= 0.3;
      warmthLevel += 0.2;
      correctionSoftnessBias += 0.25;
      encouragementBias += 0.15;
      momentumProtection = true;
      reasoning.push("embarrassment -> suppress humor and soften correction");
      break;

    case "overwhelmed":
      humorAllowance -= 0.2;
      warmthLevel += 0.2;
      paceAdjustment = "slow";
      correctionSoftnessBias += 0.15;
      explanationDepthBias += 0.2;
      encouragementBias += 0.15;
      momentumProtection = true;
      reasoning.push("overwhelm -> slow down and reduce pressure");
      break;

    case "discouraged":
      humorAllowance -= 0.1;
      warmthLevel += 0.25;
      encouragementBias += 0.25;
      correctionSoftnessBias += 0.15;
      challengeReadiness -= 0.2;
      momentumProtection = true;
      reasoning.push("discouragement -> stronger warmth and momentum protection");
      break;

    case "frustrated":
      humorAllowance -= 0.15;
      warmthLevel += 0.1;
      correctionSoftnessBias += 0.1;
      explanationDepthBias += 0.1;
      challengeReadiness -= 0.1;
      reasoning.push("frustration -> reduce pressure and clarify");
      break;

    case "confused":
      humorAllowance -= 0.05;
      paceAdjustment = paceAdjustment === "fast" ? "normal" : paceAdjustment;
      explanationDepthBias += 0.15;
      correctionSoftnessBias += 0.05;
      reasoning.push("confusion -> modest clarification bias");
      break;

    case "curious":
      humorAllowance += 0.05;
      challengeReadiness += 0.2;
      explanationDepthBias += 0.05;
      momentumProtection = true;
      reasoning.push("curiosity -> preserve momentum and allow challenge");
      break;

    case "proud":
      humorAllowance += 0.05;
      warmthLevel += 0.05;
      challengeReadiness += 0.2;
      encouragementBias += 0.1;
      momentumProtection = true;
      reasoning.push("pride -> preserve momentum and escalate gently");
      break;

    case "neutral":
    default:
      reasoning.push("neutral signal -> balanced defaults");
      break;
  }

  if (successes >= 2 && successRate > 0.75) {
    challengeReadiness += 0.1;
    reasoning.push("success streak -> challenge readiness increased");
  }

  if (mistakes >= 2 || recentCorrections >= 2) {
    correctionSoftnessBias += 0.1;
    humorAllowance -= 0.05;
    reasoning.push("recent mistakes/corrections -> softer correction and less humor");
  }

  if (lastTurn.retriedAfterMistake) {
    momentumProtection = true;
    encouragementBias += 0.1;
    reasoning.push("retry effort detected -> protect momentum");
  }

  if (lastTurn.succeededAfterRetry) {
    warmthLevel += 0.05;
    challengeReadiness += 0.05;
    reasoning.push("successful recovery -> small confidence/challenge bump");
  }

  if (engagement > 0.8 && confidence > 0.7 && confusion < 0.25) {
    paceAdjustment = "fast";
    reasoning.push("high engagement and confidence -> faster pace allowed");
  }

  return {
    primarySignal,
    secondarySignals,
    humorAllowance: clamp(humorAllowance),
    warmthLevel: clamp(warmthLevel),
    paceAdjustment,
    cognitiveLoadLevel,
    momentumProtection,
    correctionSoftnessBias: clamp(correctionSoftnessBias),
    explanationDepthBias: clamp(explanationDepthBias),
    encouragementBias: clamp(encouragementBias),
    challengeReadiness: clamp(challengeReadiness),
    reasoning,
  };
}

export default teacherEmotionModel;