import type { LearnerState } from './learnerState';
import type { DifficultyDirection } from './difficultyScaler';
import type { TeachingMode } from './teachingModes';

export type ToneStyle = 'calm' | 'warm' | 'playful' | 'firm';

export type CorrectionStyle = 'direct' | 'gentle' | 'contrastive';

export type ResponsePlanReason =
  | 'confused'
  | 'frustrated'
  | 'challenge_requested'
  | 'momentum'
  | 'correction'
  | 'explanation_requested'
  | 'review_required'
  | 'drill_required'
  | 'recap_required'
  | 'low_confidence'
  | 'encourage_default';

export interface ResponsePlan {
  teachingMode: TeachingMode;
  tone: ToneStyle;
  shouldUseHumor: boolean;
  shouldBeBrief: boolean;
  correctionStyle: CorrectionStyle;
  acknowledgeEffort: boolean;
  addNextStep: boolean;
  difficultyDirection: DifficultyDirection;
  reason: ResponsePlanReason;
}

export interface PlannerInput {
  learnerState: LearnerState;

  isCorrectiveTurn?: boolean;
  wantsChallenge?: boolean;
  wantsExplanation?: boolean;
  wantsDrill?: boolean;
  wantsRecap?: boolean;

  repeatedMistake?: boolean;
  shouldReviewConcept?: boolean;

  difficultyDirection?: DifficultyDirection;

  suppressHumor?: boolean;
  requireDirectness?: boolean;
  softenTone?: boolean;
}

function baseToneFromState(state: LearnerState): ToneStyle {
  if (state.affect === 'frustrated') return 'warm';
  if (state.affect === 'playful') return 'playful';
  if (state.confidence === 'low') return 'warm';
  return 'calm';
}

function humorAllowed(
  state: LearnerState,
  options: {
    suppressHumor?: boolean;
    repeatedMistake?: boolean;
    requireDirectness?: boolean;
  } = {}
): boolean {
  const {
    suppressHumor = false,
    repeatedMistake = false,
    requireDirectness = false,
  } = options;

  if (suppressHumor) return false;
  if (repeatedMistake) return false;
  if (requireDirectness) return false;
  if (state.affect === 'frustrated') return false;
  if (state.clarity === 'lost') return false;

  return state.affect === 'playful';
}

function calibrateTone(baseTone: ToneStyle, input: PlannerInput): ToneStyle {
  const {
    learnerState,
    softenTone = false,
    requireDirectness = false,
    repeatedMistake = false,
  } = input;

  let tone = baseTone;

  if (learnerState.clarity === 'lost' || learnerState.affect === 'frustrated') {
    tone = 'warm';
  }

  if (learnerState.confidence === 'low' && tone === 'firm') {
    tone = 'warm';
  }

  if (softenTone) {
    if (tone === 'firm') tone = 'calm';
    if (tone === 'playful') tone = 'warm';
  }

  if (requireDirectness && tone === 'playful') {
    tone = 'calm';
  }

  if (repeatedMistake && tone === 'playful') {
    tone = 'calm';
  }

  return tone;
}

function chooseCorrectionStyle(input: PlannerInput): CorrectionStyle {
  const {
    repeatedMistake = false,
    requireDirectness = false,
    learnerState,
  } = input;

  if (learnerState.clarity === 'lost' || learnerState.affect === 'frustrated') {
    return 'gentle';
  }

  if (repeatedMistake) {
    return 'contrastive';
  }

  if (requireDirectness) {
    return 'direct';
  }

  return 'gentle';
}

export function buildResponsePlan(input: PlannerInput): ResponsePlan {
  const {
    learnerState,
    isCorrectiveTurn = false,
    wantsChallenge = false,
    wantsExplanation = false,
    wantsDrill = false,
    wantsRecap = false,
    repeatedMistake = false,
    shouldReviewConcept = false,
    difficultyDirection = 'hold',
    suppressHumor = false,
    requireDirectness = false,
  } = input;

  const baseTone = baseToneFromState(learnerState);
  const tone = calibrateTone(baseTone, input);
  const correctionStyle = chooseCorrectionStyle(input);

  const humor = humorAllowed(learnerState, {
    suppressHumor,
    repeatedMistake,
    requireDirectness,
  });

  if (learnerState.clarity === 'lost' || learnerState.affect === 'frustrated') {
    return {
      teachingMode: wantsExplanation
        ? 'explain'
        : isCorrectiveTurn
          ? 'correct'
          : 'encourage',
      tone: 'warm',
      shouldUseHumor: false,
      shouldBeBrief: false,
      correctionStyle: 'gentle',
      acknowledgeEffort: true,
      addNextStep: true,
      difficultyDirection: 'down',
      reason: learnerState.affect === 'frustrated' ? 'frustrated' : 'confused',
    };
  }

  if (shouldReviewConcept) {
    return {
      teachingMode: 'review',
      tone: tone === 'playful' ? 'calm' : tone,
      shouldUseHumor: false,
      shouldBeBrief: false,
      correctionStyle: 'gentle',
      acknowledgeEffort: true,
      addNextStep: true,
      difficultyDirection: 'down',
      reason: 'review_required',
    };
  }

  if (wantsRecap) {
    return {
      teachingMode: 'recap',
      tone: tone === 'firm' ? 'calm' : tone,
      shouldUseHumor: false,
      shouldBeBrief: false,
      correctionStyle: 'gentle',
      acknowledgeEffort: true,
      addNextStep: true,
      difficultyDirection: 'hold',
      reason: 'recap_required',
    };
  }

  if (wantsDrill) {
    return {
      teachingMode: 'drill',
      tone: requireDirectness ? 'firm' : tone === 'playful' ? 'calm' : tone,
      shouldUseHumor: false,
      shouldBeBrief: true,
      correctionStyle: requireDirectness ? 'direct' : 'gentle',
      acknowledgeEffort: false,
      addNextStep: true,
      difficultyDirection: repeatedMistake ? 'down' : difficultyDirection,
      reason: 'drill_required',
    };
  }

  if (wantsChallenge || learnerState.momentum === 'flowing') {
    return {
      teachingMode: 'challenge',
      tone:
        learnerState.affect === 'playful' && !requireDirectness ? 'playful' : 'firm',
      shouldUseHumor: humor,
      shouldBeBrief: true,
      correctionStyle: 'direct',
      acknowledgeEffort: false,
      addNextStep: true,
      difficultyDirection: 'up',
      reason: wantsChallenge ? 'challenge_requested' : 'momentum',
    };
  }

  if (isCorrectiveTurn) {
    return {
      teachingMode: 'correct',
      tone: requireDirectness ? 'firm' : tone,
      shouldUseHumor: humor && !repeatedMistake,
      shouldBeBrief: true,
      correctionStyle,
      acknowledgeEffort: true,
      addNextStep: true,
      difficultyDirection: repeatedMistake ? 'down' : difficultyDirection,
      reason: 'correction',
    };
  }

  if (wantsExplanation) {
    return {
      teachingMode: 'explain',
      tone: tone === 'playful' ? 'calm' : tone,
      shouldUseHumor: false,
      shouldBeBrief: false,
      correctionStyle: requireDirectness ? 'direct' : 'gentle',
      acknowledgeEffort: learnerState.confidence === 'low',
      addNextStep: true,
      difficultyDirection: 'hold',
      reason:
        learnerState.confidence === 'low'
          ? 'low_confidence'
          : 'explanation_requested',
    };
  }

  return {
    teachingMode: 'encourage',
    tone: tone === 'firm' ? 'warm' : tone === 'playful' ? 'playful' : 'warm',
    shouldUseHumor: humor,
    shouldBeBrief: true,
    correctionStyle: 'gentle',
    acknowledgeEffort: true,
    addNextStep: true,
    difficultyDirection,
    reason:
      learnerState.confidence === 'low' ? 'low_confidence' : 'encourage_default',
  };
}