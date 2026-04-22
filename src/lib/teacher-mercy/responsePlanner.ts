/**
 * FILE: src/lib/mercy-host/responsePlanner.ts
 * VERSION: responsePlanner.ts v3.3.1
 *
 * Core teaching response planner for Mercy.
 * Converts learner state and intent signals into
 * teaching mode, tone, humor allowance, and difficulty direction.
 */

import type { LearnerState } from './learnerState';

export type TeachingMode =
  | 'explain'
  | 'correct'
  | 'challenge'
  | 'review'
  | 'recap'
  | 'drill'
  | 'encourage';

export type ToneStyle = 'calm' | 'warm' | 'playful' | 'firm';

export type CorrectionStyle = 'direct' | 'gentle' | 'contrastive';

export type DifficultyDirection = 'up' | 'down' | 'hold';

export interface ResponsePlannerInput {
  learnerState: LearnerState;

  isCorrectiveTurn?: boolean;
  repeatedMistake?: boolean;

  wantsChallenge?: boolean;
  wantsExplanation?: boolean;
  wantsDrill?: boolean;
  wantsRecap?: boolean;

  suppressHumor?: boolean;
}

export interface ResponsePlan {
  teachingMode: TeachingMode;
  tone: ToneStyle;
  correctionStyle?: CorrectionStyle;

  difficultyDirection: DifficultyDirection;

  shouldUseHumor: boolean;
  shouldBeBrief: boolean;
  acknowledgeEffort: boolean;
  addNextStep: boolean;

  reason: string;
}

function hasStructuredNeutralState(
  state: Partial<LearnerState> & {
    clarity?: string;
    momentum?: string;
    confidence?: string;
    affect?: string;
  }
): boolean {
  return Boolean(
    state.clarity !== undefined ||
      state.momentum !== undefined ||
      state.confidence !== undefined ||
      state.affect !== undefined
  );
}

export function buildResponsePlan(
  input: ResponsePlannerInput
): ResponsePlan {
  const {
    learnerState,
    isCorrectiveTurn = false,
    repeatedMistake = false,
    wantsChallenge = false,
    wantsExplanation = false,
    wantsDrill = false,
    wantsRecap = false,
    suppressHumor = false,
  } = input;

  const state = learnerState as LearnerState & {
    clarity?: string;
    momentum?: string;
    confidence?: string;
    emotion?: string;
    frustration?: string | boolean;
    affect?: string;
    needsConceptReview?: boolean;
    wantsReview?: boolean;
    reviewRequired?: boolean;
    directnessRequired?: boolean;
    softenTone?: boolean;
    toneSofteningRequested?: boolean;
    playful?: boolean;
  };

  // Widen locally so legacy comparisons remain behavior-compatible
  // without fighting the narrower LearnerState unions.
  const clarity: string | undefined = state.clarity;
  const momentum: string | undefined = state.momentum;
  const confidence: string | undefined = state.confidence;

  const isConfused = clarity === 'lost' || clarity === 'confused';
  const isFrustrated =
    state.emotion === 'frustrated' ||
    state.affect === 'frustrated' ||
    state.frustration === true ||
    state.frustration === 'high';

  const needsReview =
    state.needsConceptReview === true ||
    state.wantsReview === true ||
    state.reviewRequired === true;

  const directnessRequired = state.directnessRequired === true;
  const softenTone =
    state.softenTone === true || state.toneSofteningRequested === true;

  const isPlayful =
    state.playful === true ||
    momentum === 'playful' ||
    momentum === 'light' ||
    momentum === 'flowing';

  const isLowConfidence = confidence === 'low';
  const hasMomentum = momentum === 'flowing';
  const hasNeutralStructure = hasStructuredNeutralState(state);

  let teachingMode: TeachingMode = 'encourage';
  let tone: ToneStyle = isPlayful ? 'playful' : 'warm';
  let correctionStyle: CorrectionStyle = 'gentle';

  let difficultyDirection: DifficultyDirection = 'hold';

  let shouldUseHumor = isPlayful && !suppressHumor;
  let shouldBeBrief = false;
  let acknowledgeEffort = true;
  let addNextStep = true;

  let reason = hasNeutralStructure ? 'encourage_default' : 'neutral';

  /* -----------------------------
     1. confusion / frustration
  ----------------------------- */

  if (isConfused) {
    const shouldExplainLostLearner =
      wantsExplanation || isLowConfidence || isFrustrated;

    teachingMode = shouldExplainLostLearner ? 'explain' : 'correct';
    tone = 'warm';
    correctionStyle = 'gentle';

    difficultyDirection = 'down';

    shouldUseHumor = false;
    shouldBeBrief = false;
    acknowledgeEffort = true;
    addNextStep = false;

    reason = 'confused';
  } else if (isFrustrated) {
    const shouldExplainFrustration = wantsExplanation || isLowConfidence;

    teachingMode = shouldExplainFrustration ? 'explain' : 'correct';
    tone = 'warm';
    correctionStyle = 'gentle';

    difficultyDirection = 'down';

    shouldUseHumor = false;
    shouldBeBrief = false;
    acknowledgeEffort = true;
    addNextStep = false;

    reason = 'frustrated';
  }

  /* -----------------------------
     2. explicit review / recap / drill / challenge / explain
  ----------------------------- */

  else if (needsReview) {
    teachingMode = 'review';
    tone = 'calm';
    correctionStyle = 'gentle';

    difficultyDirection = 'down';

    shouldUseHumor = false;
    shouldBeBrief = false;
    acknowledgeEffort = true;
    addNextStep = false;

    reason = 'review_required';
  } else if (wantsRecap) {
    teachingMode = 'recap';
    tone = 'calm';
    correctionStyle = 'gentle';

    difficultyDirection = 'hold';

    shouldUseHumor = false;
    shouldBeBrief = false;
    acknowledgeEffort = false;
    addNextStep = false;

    reason = 'recap_required';
  } else if (wantsDrill) {
    teachingMode = 'drill';
    tone = 'calm';
    correctionStyle = 'direct';

    difficultyDirection = 'hold';

    shouldUseHumor = false;
    shouldBeBrief = true;
    acknowledgeEffort = false;
    addNextStep = true;

    reason = 'drill_required';
  } else if (wantsChallenge) {
    teachingMode = 'challenge';
    tone = 'playful';
    correctionStyle = 'direct';

    difficultyDirection = 'up';

    shouldUseHumor = !suppressHumor;
    shouldBeBrief = true;
    acknowledgeEffort = false;
    addNextStep = true;

    reason = 'challenge_requested';
  } else if (wantsExplanation && isLowConfidence) {
    teachingMode = 'explain';
    tone = 'warm';
    correctionStyle = 'gentle';

    difficultyDirection = 'hold';

    shouldUseHumor = false;
    shouldBeBrief = false;
    acknowledgeEffort = true;
    addNextStep = false;

    reason = 'low_confidence';
  }

  /* -----------------------------
     3. corrective turns
  ----------------------------- */

  else if (isCorrectiveTurn && directnessRequired) {
    teachingMode = 'correct';
    tone = 'firm';
    correctionStyle = 'direct';

    difficultyDirection = 'down';

    shouldUseHumor = false;
    shouldBeBrief = true;
    acknowledgeEffort = false;
    addNextStep = false;

    reason = 'directness_required';
  } else if (isCorrectiveTurn && repeatedMistake) {
    teachingMode = 'correct';
    tone = softenTone ? 'warm' : 'firm';
    correctionStyle = softenTone ? 'gentle' : 'contrastive';

    difficultyDirection = 'down';

    shouldUseHumor = false;
    shouldBeBrief = false;
    acknowledgeEffort = true;
    addNextStep = false;

    reason = 'repeated_mistake';
  } else if (isCorrectiveTurn) {
    teachingMode = 'correct';
    tone = 'warm';
    correctionStyle = 'gentle';

    difficultyDirection = 'hold';

    shouldUseHumor = false;
    shouldBeBrief = false;
    acknowledgeEffort = true;
    addNextStep = false;

    reason = 'correction';
  }

  /* -----------------------------
     4. momentum challenge
  ----------------------------- */

  else if (hasMomentum && !isLowConfidence) {
    teachingMode = 'challenge';
    tone = 'firm';
    correctionStyle = 'direct';

    difficultyDirection = 'up';

    shouldUseHumor = false;
    shouldBeBrief = true;
    acknowledgeEffort = false;
    addNextStep = true;

    reason = 'momentum';
  }

  /* -----------------------------
     5. explanation and encouragement fallback
  ----------------------------- */

  else if (wantsExplanation) {
    teachingMode = 'explain';
    tone = 'warm';
    correctionStyle = 'gentle';

    difficultyDirection = 'hold';

    shouldUseHumor = false;
    shouldBeBrief = false;
    acknowledgeEffort = true;
    addNextStep = false;

    reason = 'explanation_requested';
  } else if (isPlayful) {
    teachingMode = 'encourage';
    tone = 'playful';
    correctionStyle = 'gentle';

    difficultyDirection = 'hold';

    shouldUseHumor = !suppressHumor;
    shouldBeBrief = false;
    acknowledgeEffort = true;
    addNextStep = true;

    reason = 'stable_playful';
  } else {
    teachingMode = 'encourage';
    tone = 'warm';
    correctionStyle = 'gentle';

    difficultyDirection = 'hold';

    shouldUseHumor = false;
    shouldBeBrief = false;
    acknowledgeEffort = true;
    addNextStep = true;

    reason = hasNeutralStructure ? 'encourage_default' : 'neutral';
  }

  /* -----------------------------
     humor override
  ----------------------------- */

  if (suppressHumor) {
    shouldUseHumor = false;
  }

  /* -----------------------------
     defensive normalization
  ----------------------------- */

  teachingMode = teachingMode ?? 'encourage';
  tone = tone ?? 'warm';
  difficultyDirection = difficultyDirection ?? 'hold';
  correctionStyle = correctionStyle ?? 'gentle';
  shouldUseHumor = Boolean(shouldUseHumor);
  shouldBeBrief = Boolean(shouldBeBrief);
  acknowledgeEffort = Boolean(acknowledgeEffort);
  addNextStep = Boolean(addNextStep);

  return {
    teachingMode,
    tone,
    correctionStyle,
    difficultyDirection,
    shouldUseHumor,
    shouldBeBrief,
    acknowledgeEffort,
    addNextStep,
    reason,
  };
}

export default buildResponsePlan;