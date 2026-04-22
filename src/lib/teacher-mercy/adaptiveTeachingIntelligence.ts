import type { LearnerState } from './learnerState';
import type { DifficultyDirection } from './difficultyScaler';
import type { TeachingMode } from './teachingModes';
import type { TeacherEmotionState } from './teacherEmotionModel';

/**
 * Keep these local to avoid a circular type import with responsePlanner.ts.
 * The unions stay structurally compatible with responsePlanner.
 */
export type ToneStyle = 'calm' | 'warm' | 'playful' | 'firm';
export type CorrectionStyle = 'direct' | 'gentle' | 'contrastive';

export interface AdaptiveTeachingInput {
  learnerState: LearnerState;
  emotion: TeacherEmotionState;

  isCorrectiveTurn?: boolean;
  wantsChallenge?: boolean;
  wantsExplanation?: boolean;
  wantsDrill?: boolean;
  wantsRecap?: boolean;

  repeatedMistake?: boolean;
  shouldReviewConcept?: boolean;
  difficultyDirection?: DifficultyDirection;
  requireDirectness?: boolean;
}

export interface AdaptiveTeachingAdjustment {
  explanationDepthBias: number;
  correctionSoftnessBias: number;
  drillBias: number;
  recapBias: number;
  challengePaceBias: number;

  preferredTeachingMode?: TeachingMode;
  preferredTone?: ToneStyle;
  preferredCorrectionStyle?: CorrectionStyle;
  preferredDifficultyDirection?: DifficultyDirection;

  shouldStayBrief: boolean;
  shouldAcknowledgeEffort: boolean;
  shouldProtectMomentum: boolean;

  rationale: string[];
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

export function adaptiveTeachingIntelligence(
  input: AdaptiveTeachingInput
): AdaptiveTeachingAdjustment {
  const {
    learnerState,
    emotion,
    isCorrectiveTurn = false,
    wantsChallenge = false,
    wantsExplanation = false,
    wantsDrill = false,
    wantsRecap = false,
    repeatedMistake = false,
    shouldReviewConcept = false,
    difficultyDirection = 'hold',
    requireDirectness = false,
  } = input;

  let explanationDepthBias = 0.5;
  let correctionSoftnessBias = emotion.correctionSoftnessBias;
  let drillBias = 0.5;
  let recapBias = 0.5;
  let challengePaceBias = 0.5;

  let preferredTeachingMode: TeachingMode | undefined;
  let preferredTone: ToneStyle | undefined;
  let preferredCorrectionStyle: CorrectionStyle | undefined;
  let preferredDifficultyDirection: DifficultyDirection | undefined;

  let shouldStayBrief = false;
  let shouldAcknowledgeEffort = false;
  let shouldProtectMomentum = emotion.momentumProtection;

  const rationale: string[] = [];

  if (emotion.cognitiveLoadLevel === 'high') {
    explanationDepthBias += 0.2;
    correctionSoftnessBias += 0.15;
    drillBias -= 0.2;
    recapBias += 0.2;
    challengePaceBias -= 0.3;
    shouldStayBrief = true;
    shouldAcknowledgeEffort = true;
    preferredTone = 'warm';
    preferredDifficultyDirection = 'hold';
    rationale.push('high_cognitive_load');
  }

  if (learnerState.clarity === 'lost') {
    explanationDepthBias += 0.2;
    recapBias += 0.15;
    drillBias -= 0.15;
    challengePaceBias -= 0.25;
    preferredTeachingMode = wantsRecap ? 'recap' : 'explain';
    preferredTone = 'warm';
    preferredCorrectionStyle = 'gentle';
    shouldAcknowledgeEffort = true;
    rationale.push('clarity_lost');
  }

  if (learnerState.affect === 'frustrated') {
    correctionSoftnessBias += 0.2;
    drillBias -= 0.15;
    challengePaceBias -= 0.2;
    preferredTone = 'warm';
    preferredCorrectionStyle = 'gentle';
    shouldAcknowledgeEffort = true;
    rationale.push('frustration_detected');
  }

  if (learnerState.confidence === 'low') {
    explanationDepthBias += 0.1;
    correctionSoftnessBias += 0.1;
    recapBias += 0.1;
    challengePaceBias -= 0.15;
    shouldAcknowledgeEffort = true;
    rationale.push('low_confidence');
  }

  if (repeatedMistake) {
    explanationDepthBias += 0.15;
    correctionSoftnessBias += 0.15;
    drillBias += 0.1;
    recapBias += 0.15;
    challengePaceBias -= 0.2;
    preferredDifficultyDirection = 'down';
    shouldAcknowledgeEffort = true;
    shouldProtectMomentum = true;
    rationale.push('repeated_mistake');
  }

  if (shouldReviewConcept) {
    explanationDepthBias += 0.15;
    recapBias += 0.2;
    drillBias -= 0.05;
    preferredTeachingMode = 'review';
    preferredDifficultyDirection = 'down';
    rationale.push('concept_review_needed');
  }

  if (wantsExplanation) {
    explanationDepthBias += 0.2;
    recapBias += 0.05;
    challengePaceBias -= 0.1;
    preferredTeachingMode = 'explain';
    rationale.push('explanation_requested');
  }

  if (wantsRecap) {
    recapBias += 0.25;
    drillBias -= 0.05;
    challengePaceBias -= 0.1;
    preferredTeachingMode = 'recap';
    preferredDifficultyDirection = 'hold';
    rationale.push('recap_requested');
  }

  if (wantsDrill) {
    drillBias += 0.25;
    explanationDepthBias -= 0.1;
    preferredTeachingMode = 'drill';
    rationale.push('drill_requested');
  }

  if (wantsChallenge || learnerState.momentum === 'flowing') {
    challengePaceBias += 0.2;
    drillBias -= 0.05;
    recapBias -= 0.05;
    rationale.push('challenge_or_momentum');
  }

  const recapLocked = wantsRecap;
  const reviewLocked = shouldReviewConcept && !wantsExplanation && !wantsDrill && !wantsRecap;
  const difficultyLocked = recapLocked || repeatedMistake || shouldReviewConcept;

  if (
    learnerState.momentum === 'flowing' &&
    emotion.primarySignal !== 'overwhelmed' &&
    emotion.primarySignal !== 'discouraged' &&
    emotion.cognitiveLoadLevel !== 'high'
  ) {
    challengePaceBias += 0.15;
    if (!difficultyLocked) {
      preferredDifficultyDirection =
        difficultyDirection === 'down' ? 'hold' : 'up';
    }
    shouldProtectMomentum = true;
    rationale.push('momentum_protection');
  }

  if (emotion.primarySignal === 'curious' || emotion.primarySignal === 'proud') {
    explanationDepthBias += 0.05;
    challengePaceBias += 0.15;
    if (!difficultyLocked) {
      preferredDifficultyDirection =
        difficultyDirection === 'down' ? 'hold' : 'up';
    }
    rationale.push('positive_momentum_signal');
  }

  if (
    emotion.primarySignal === 'discouraged' ||
    emotion.primarySignal === 'embarrassed'
  ) {
    correctionSoftnessBias += 0.2;
    challengePaceBias -= 0.2;
    preferredTone = 'warm';
    preferredCorrectionStyle = 'gentle';
    shouldAcknowledgeEffort = true;
    shouldProtectMomentum = true;
    rationale.push('discouragement_or_embarrassment');
  }

  if (emotion.primarySignal === 'overwhelmed') {
    explanationDepthBias += 0.15;
    drillBias -= 0.2;
    recapBias += 0.2;
    challengePaceBias -= 0.3;
    preferredTeachingMode = wantsRecap ? 'recap' : 'explain';
    preferredTone = 'warm';
    preferredCorrectionStyle = 'gentle';
    preferredDifficultyDirection = 'hold';
    shouldStayBrief = true;
    rationale.push('overwhelm_signal');
  }

  if (isCorrectiveTurn) {
    correctionSoftnessBias += repeatedMistake ? 0.1 : 0.05;
    preferredCorrectionStyle =
      requireDirectness && correctionSoftnessBias < 0.7 ? 'direct' : 'gentle';
    if (!preferredTone) {
      preferredTone = 'calm';
    }
    rationale.push('corrective_turn');
  }

  if (requireDirectness) {
    correctionSoftnessBias -= 0.15;
    if (preferredCorrectionStyle !== 'gentle') {
      preferredCorrectionStyle = 'direct';
    }
    rationale.push('directness_required');
  }

  if (!preferredTone) {
    if (wantsChallenge && !requireDirectness && !isCorrectiveTurn) {
      preferredTone = 'playful';
    } else if (isCorrectiveTurn || wantsRecap || wantsDrill || shouldReviewConcept) {
      preferredTone = 'calm';
    }
  }

  if (reviewLocked) {
    preferredTeachingMode = 'review';
  }

  if (recapLocked) {
    preferredTeachingMode = 'recap';
    preferredDifficultyDirection = 'hold';
  }

  if (repeatedMistake) {
    preferredDifficultyDirection = 'down';
  }

  if (shouldReviewConcept && !recapLocked) {
    preferredDifficultyDirection = 'down';
  }

  return {
    explanationDepthBias: clamp(explanationDepthBias),
    correctionSoftnessBias: clamp(correctionSoftnessBias),
    drillBias: clamp(drillBias),
    recapBias: clamp(recapBias),
    challengePaceBias: clamp(challengePaceBias),
    preferredTeachingMode,
    preferredTone,
    preferredCorrectionStyle,
    preferredDifficultyDirection,
    shouldStayBrief,
    shouldAcknowledgeEffort,
    shouldProtectMomentum,
    rationale,
  };
}

export default adaptiveTeachingIntelligence;