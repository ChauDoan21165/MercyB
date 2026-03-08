/**
 * FILE: src/lib/mercy-host/toneCalibration.ts
 * VERSION: toneCalibration.ts v1.1
 *
 * Mercy Tone Calibration
 *
 * Purpose:
 * - adjust tone after planner decisions
 * - keep Mercy calm, warm, and teacher-like
 * - reduce wit when the learner is confused or discouraged
 * - raise firmness slightly when challenge is appropriate
 * - provide a single post-planning pass before final rendering
 *
 * Design rules:
 * - clarity > warmth > wit
 * - confusion lowers playfulness
 * - repeated mistakes reduce sharpness, not kindness
 * - challenge can be firm without becoming harsh
 * - low confidence should feel supported, not overprotected
 */

import type { LearnerState } from './learnerState';
import type { ToneStyle, ResponsePlan, CorrectionStyle } from './responsePlanner';

export type ToneCalibrationNote =
  | 'humor_suppressed'
  | 'confusion_warmth'
  | 'frustration_softening'
  | 'tone_softened'
  | 'directness_required'
  | 'repeated_mistake_focus'
  | 'review_mode'
  | 'safe_playfulness'
  | 'low_confidence_support'
  | 'challenge_momentum'
  | 'briefness_reduced'
  | 'briefness_enforced'
  | 'firmness_dampened'
  | 'humor_restored'
  | 'correction_softened';

export interface ToneCalibrationInput {
  learnerState: LearnerState;
  plan: ResponsePlan;
  suppressHumor?: boolean;
  requireDirectness?: boolean;
  softenTone?: boolean;
  repeatedMistake?: boolean;
  shouldReviewConcept?: boolean;
  wantsExplanation?: boolean;
  wantsRecap?: boolean;
  wantsDrill?: boolean;
}

export interface ToneCalibrationResult {
  tone: ToneStyle;
  shouldUseHumor: boolean;
  shouldBeBrief: boolean;
  correctionStyle: CorrectionStyle;
  acknowledgeEffort: boolean;
  addNextStep: boolean;
  notes: ToneCalibrationNote[];
}

function clonePlan(plan: ResponsePlan): ToneCalibrationResult {
  return {
    tone: plan.tone,
    shouldUseHumor: plan.shouldUseHumor,
    shouldBeBrief: plan.shouldBeBrief,
    correctionStyle: plan.correctionStyle ?? 'gentle',
    acknowledgeEffort: plan.acknowledgeEffort,
    addNextStep: plan.addNextStep,
    notes: [],
  };
}

function pushNote(
  notes: ToneCalibrationNote[],
  note: ToneCalibrationNote
): void {
  if (!notes.includes(note)) {
    notes.push(note);
  }
}

function isLearnerOverloaded(state: LearnerState): boolean {
  return state.clarity === 'lost' || state.affect === 'frustrated';
}

function isStableForPlayfulness(state: LearnerState): boolean {
  return (
    state.affect === 'playful' &&
    state.clarity === 'clear' &&
    state.confidence === 'high'
  );
}

/**
 * Tone calibration pass.
 * Run this after response planning and before final rendering.
 */
export function calibrateTone(input: ToneCalibrationInput): ToneCalibrationResult {
  const {
    learnerState,
    plan,
    suppressHumor = false,
    requireDirectness = false,
    softenTone = false,
    repeatedMistake = false,
    shouldReviewConcept = false,
    wantsExplanation = false,
    wantsRecap = false,
    wantsDrill = false,
  } = input;

  const result = clonePlan(plan);

  if (suppressHumor) {
    result.shouldUseHumor = false;
    pushNote(result.notes, 'humor_suppressed');
  }

  if (isLearnerOverloaded(learnerState)) {
    result.tone = 'warm';
    result.shouldUseHumor = false;
    result.shouldBeBrief = false;
    result.correctionStyle = 'gentle';
    result.acknowledgeEffort = true;
    pushNote(result.notes, 'confusion_warmth');

    if (learnerState.affect === 'frustrated') {
      pushNote(result.notes, 'frustration_softening');
    }
  }

  if (softenTone) {
    if (result.tone === 'firm') {
      result.tone = 'calm';
      pushNote(result.notes, 'tone_softened');
    } else if (result.tone === 'playful') {
      result.tone = 'warm';
      pushNote(result.notes, 'tone_softened');
    }
  }

  if (requireDirectness && !isLearnerOverloaded(learnerState)) {
    if (result.tone === 'playful') {
      result.tone = 'calm';
    }
    result.correctionStyle = repeatedMistake ? 'contrastive' : 'direct';
    result.shouldBeBrief = true;
    pushNote(result.notes, 'directness_required');
    pushNote(result.notes, 'briefness_enforced');
  }

  if (repeatedMistake) {
    result.shouldUseHumor = false;
    result.correctionStyle = isLearnerOverloaded(learnerState)
      ? 'gentle'
      : 'contrastive';
    result.acknowledgeEffort = true;
    pushNote(result.notes, 'repeated_mistake_focus');

    if (result.correctionStyle === 'gentle') {
      pushNote(result.notes, 'correction_softened');
    }
  }

  if (shouldReviewConcept || plan.teachingMode === 'review') {
    result.tone = 'calm';
    result.shouldUseHumor = false;
    result.shouldBeBrief = false;
    result.acknowledgeEffort = true;
    result.addNextStep = true;
    pushNote(result.notes, 'review_mode');
    pushNote(result.notes, 'briefness_reduced');
  }

  if (
    wantsExplanation ||
    wantsRecap ||
    plan.teachingMode === 'explain' ||
    plan.teachingMode === 'recap'
  ) {
    result.tone = result.tone === 'playful' ? 'calm' : result.tone;
    result.shouldUseHumor = false;
    result.shouldBeBrief = false;
    pushNote(result.notes, 'briefness_reduced');
  }

  if (wantsDrill || plan.teachingMode === 'drill') {
    result.shouldBeBrief = true;
    pushNote(result.notes, 'briefness_enforced');

    if (learnerState.confidence === 'low') {
      result.tone = 'warm';
      pushNote(result.notes, 'firmness_dampened');
    } else if (result.tone === 'firm') {
      result.tone = 'calm';
      pushNote(result.notes, 'firmness_dampened');
    }
  }

  if (learnerState.confidence === 'low') {
    result.acknowledgeEffort = true;

    if (result.tone === 'firm' || result.tone === 'calm') {
      result.tone = 'warm';
      pushNote(result.notes, 'firmness_dampened');
    }

    pushNote(result.notes, 'low_confidence_support');
  }

  const canRestorePlayfulness =
    !softenTone &&
    !suppressHumor &&
    !repeatedMistake &&
    !shouldReviewConcept &&
    !wantsExplanation &&
    !wantsRecap &&
    !isLearnerOverloaded(learnerState) &&
    isStableForPlayfulness(learnerState);

  if (canRestorePlayfulness) {
    result.shouldUseHumor = plan.shouldUseHumor;

    if (plan.shouldUseHumor) {
      pushNote(result.notes, 'humor_restored');
    }

    if (result.tone !== 'firm') {
      result.tone = 'playful';
    }

    pushNote(result.notes, 'safe_playfulness');
  }

  if (plan.teachingMode === 'challenge' && learnerState.momentum === 'flowing') {
    if (
      learnerState.affect !== 'frustrated' &&
      learnerState.clarity === 'clear' &&
      learnerState.confidence === 'high'
    ) {
      result.tone = result.tone === 'warm' ? 'calm' : result.tone;
      result.shouldBeBrief = true;
      pushNote(result.notes, 'challenge_momentum');
      pushNote(result.notes, 'briefness_enforced');
    } else if (result.tone === 'firm') {
      result.tone = 'warm';
      pushNote(result.notes, 'firmness_dampened');
    }
  }

  return result;
}

export default calibrateTone;