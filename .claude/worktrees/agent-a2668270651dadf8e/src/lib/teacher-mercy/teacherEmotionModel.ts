/**
 * Mercy Teacher Emotion Model
 *
 * Purpose:
 * - infer emotionally relevant teaching signals from learner state + turn context
 * - help Mercy respond like a caring, experienced teacher
 * - separate emotional interpretation from planning and rendering
 *
 * Design rules:
 * - detect teacher-relevant states, not clinical diagnoses
 * - prefer soft behavioral controls over rigid labels
 * - keep outputs directly usable by planner/adaptive layers
 * - prioritize safety: confusion, frustration, embarrassment, overwhelm
 *
 * This model is intentionally lightweight and composable.
 * It should inform planning/tone, not fully control them.
 */

import type { LearnerState } from './learnerState';

export type PaceAdjustment = 'slow' | 'normal' | 'fast';
export type CognitiveLoadLevel = 'low' | 'moderate' | 'high';
export type EmotionSignal =
  | 'curious'
  | 'proud'
  | 'discouraged'
  | 'embarrassed'
  | 'overwhelmed'
  | 'frustrated'
  | 'confused'
  | 'neutral';

export interface TeacherEmotionInput {
  learnerState: LearnerState;
  repeatedMistake?: boolean;
  isCorrectiveTurn?: boolean;
  wantsChallenge?: boolean;
  wantsExplanation?: boolean;
  wantsDrill?: boolean;
  wantsRecap?: boolean;
  shouldReviewConcept?: boolean;
  requireDirectness?: boolean;
  suppressHumor?: boolean;
}

export interface TeacherEmotionState {
  primarySignal: EmotionSignal;
  humorAllowance: number;
  warmthLevel: number;
  paceAdjustment: PaceAdjustment;
  cognitiveLoadLevel: CognitiveLoadLevel;
  momentumProtection: boolean;
  correctionSoftnessBias: number;
  encouragementBias: number;
  challengeReadiness: number;
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

export function teacherEmotionModel(
  input: TeacherEmotionInput
): TeacherEmotionState {
  const {
    learnerState,
    repeatedMistake = false,
    isCorrectiveTurn = false,
    wantsChallenge = false,
    wantsExplanation = false,
    wantsDrill = false,
    shouldReviewConcept = false,
    requireDirectness = false,
    suppressHumor = false,
  } = input;

  let primarySignal: TeacherEmotionState['primarySignal'] = 'neutral';
  let humorAllowance = 0.45;
  let warmthLevel = 0.55;
  let paceAdjustment: PaceAdjustment = 'normal';
  let cognitiveLoadLevel: CognitiveLoadLevel = 'moderate';
  let momentumProtection = false;
  let correctionSoftnessBias = 0.5;
  let encouragementBias = 0.5;
  let challengeReadiness = 0.5;

  if (learnerState.clarity === 'lost') {
    primarySignal = 'overwhelmed';
    cognitiveLoadLevel = 'high';
    paceAdjustment = 'slow';
    humorAllowance -= 0.3;
    warmthLevel += 0.2;
    correctionSoftnessBias += 0.2;
    encouragementBias += 0.15;
    challengeReadiness -= 0.25;
    momentumProtection = true;
  } else if (learnerState.affect === 'frustrated') {
    primarySignal = 'frustrated';
    cognitiveLoadLevel = 'high';
    paceAdjustment = 'slow';
    humorAllowance -= 0.25;
    warmthLevel += 0.15;
    correctionSoftnessBias += 0.15;
    encouragementBias += 0.15;
    challengeReadiness -= 0.2;
    momentumProtection = true;
  } else if (learnerState.confidence === 'low') {
    primarySignal = repeatedMistake || isCorrectiveTurn ? 'discouraged' : 'neutral';
    humorAllowance -= 0.1;
    warmthLevel += 0.2;
    correctionSoftnessBias += 0.15;
    encouragementBias += 0.2;
    challengeReadiness -= 0.15;
  } else if (learnerState.momentum === 'flowing') {
    primarySignal = wantsChallenge ? 'proud' : 'curious';
    humorAllowance += 0.1;
    warmthLevel += 0.05;
    challengeReadiness += 0.25;
    momentumProtection = true;
  } else if (learnerState.affect === 'playful' || learnerState.affect === 'engaged') {
    primarySignal = 'curious';
    humorAllowance += learnerState.affect === 'playful' ? 0.15 : 0.05;
    challengeReadiness += 0.1;
  }

  if (repeatedMistake) {
    humorAllowance -= 0.15;
    correctionSoftnessBias += 0.1;
    encouragementBias += 0.1;
    challengeReadiness -= 0.15;
    momentumProtection = true;
  }

  if (wantsExplanation || shouldReviewConcept) {
    paceAdjustment = 'slow';
    humorAllowance -= 0.1;
    correctionSoftnessBias += 0.05;
  }

  if (wantsDrill) {
    challengeReadiness -= 0.05;
    humorAllowance -= 0.05;
  }

  if (requireDirectness) {
    correctionSoftnessBias -= 0.15;
  }

  if (suppressHumor) {
    humorAllowance = 0;
  }

  if (
    learnerState.momentum === 'flowing' &&
    learnerState.confidence !== 'low' &&
    learnerState.clarity !== 'lost'
  ) {
    challengeReadiness += 0.15;
  }

  if (
    learnerState.affect === 'playful' &&
    learnerState.momentum === 'flowing' &&
    learnerState.confidence === 'high'
  ) {
    paceAdjustment = 'fast';
  }

  return {
    primarySignal,
    humorAllowance: clamp(humorAllowance),
    warmthLevel: clamp(warmthLevel),
    paceAdjustment,
    cognitiveLoadLevel,
    momentumProtection,
    correctionSoftnessBias: clamp(correctionSoftnessBias),
    encouragementBias: clamp(encouragementBias),
    challengeReadiness: clamp(challengeReadiness),
  };
}

export default teacherEmotionModel;