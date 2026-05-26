/**
 * FILE: src/lib/mercy-host/host/buildTeachingPlan.ts
 * VERSION: buildTeachingPlan.ts v2.2
 *
 * Purpose:
 * - centralize live planning for Mercy teaching turns
 * - adapt raw signals into response plan + calibrated tone + difficulty direction
 * - keep orchestration here, not pedagogy invention
 */

import buildResponsePlan, { type ResponsePlan } from '../responsePlanner';
import {
  calibrateTone,
  type ToneCalibrationResult,
} from '../toneCalibration';
import type {
  AdaptiveTeachingAdjustment,
  CorrectionStyle,
  ToneStyle,
} from '../adaptiveTeachingIntelligence';
import type {
  DifficultyLevel,
  DifficultySnapshot,
} from '../difficultyScaler';
import type { TeachingSignalsResult } from './buildTeachingSignals';

export interface BuildTeachingPlanInput {
  currentDifficulty?: DifficultyLevel;
  memory?: unknown;
  correction?: {
    mistake: string;
    fix: string;
  };
  explanation?: string;
  isCorrectiveTurn?: boolean;
  wantsChallenge?: boolean;
  wantsDrill?: boolean;
  wantsRecap?: boolean;
  repeatedMistake?: boolean;
}

export interface BuildTeachingPlanResult {
  adaptive: AdaptiveTeachingAdjustment;
  plan: ResponsePlan;
  calibrated: ToneCalibrationResult;
  difficulty: DifficultySnapshot;
}

/**
 * Back-compat alias for older host-layer imports.
 */
export type TeachingPlanLayerResult = BuildTeachingPlanResult;

function bumpDifficulty(
  currentLevel: DifficultyLevel,
  direction: ResponsePlan['difficultyDirection']
): DifficultyLevel {
  const levels: DifficultyLevel[] = [
    'very_easy',
    'easy',
    'medium',
    'hard',
    'stretch',
  ];

  const currentIndex = levels.indexOf(currentLevel);
  const safeIndex = currentIndex === -1 ? levels.indexOf('medium') : currentIndex;

  if (direction === 'hold') return levels[safeIndex];
  if (direction === 'up') {
    return levels[Math.min(levels.length - 1, safeIndex + 1)];
  }

  return levels[Math.max(0, safeIndex - 1)];
}

function mapDifficultyReason(
  direction: ResponsePlan['difficultyDirection'],
  signals: TeachingSignalsResult
): DifficultySnapshot['reason'] {
  if (signals.repeatedMistake) return 'repeated_mistake';
  if (signals.learnerState.confidence === 'low') return 'low_confidence';

  if (direction === 'up') {
    return signals.learnerState.momentum === 'flowing'
      ? 'high_success'
      : 'stable_success';
  }

  if (direction === 'down') {
    return signals.learnerState.clarity === 'lost' ? 'friction' : 'friction';
  }

  return 'steady';
}

function applyReviewPriority(
  plan: ResponsePlan,
  signals: TeachingSignalsResult
): ResponsePlan {
  if (!signals.shouldReviewConcept) {
    return plan;
  }

  return {
    ...plan,
    teachingMode: 'review',
    tone: 'calm',
    difficultyDirection: 'down',
    shouldUseHumor: false,
    shouldBeBrief: false,
    acknowledgeEffort: true,
    correctionStyle: plan.correctionStyle ?? 'gentle',
    reason: 'review_required',
  };
}

function buildAdaptiveAdjustment(
  plan: ResponsePlan,
  calibrated: ToneCalibrationResult,
  signals: TeachingSignalsResult
): AdaptiveTeachingAdjustment {
  const preferredTone: ToneStyle | undefined = calibrated.tone;
  const preferredCorrectionStyle: CorrectionStyle | undefined =
    calibrated.correctionStyle ?? 'gentle';

  return {
    explanationDepthBias:
      signals.wantsExplanation || signals.learnerState.clarity === 'lost'
        ? 0.85
        : 0.5,
    correctionSoftnessBias:
      preferredCorrectionStyle === 'gentle'
        ? 0.8
        : preferredCorrectionStyle === 'contrastive'
          ? 0.45
          : 0.3,
    drillBias: plan.teachingMode === 'drill' ? 0.85 : 0.5,
    recapBias: plan.teachingMode === 'recap' ? 0.85 : 0.5,
    challengePaceBias: plan.teachingMode === 'challenge' ? 0.8 : 0.45,

    preferredTeachingMode: plan.teachingMode,
    preferredTone,
    preferredCorrectionStyle,
    preferredDifficultyDirection: plan.difficultyDirection,

    shouldStayBrief: Boolean(calibrated.shouldBeBrief),
    shouldAcknowledgeEffort: Boolean(plan.acknowledgeEffort),
    shouldProtectMomentum:
      signals.learnerState.momentum === 'flowing' ||
      signals.repeatedMistake ||
      signals.learnerState.confidence === 'low',

    rationale: [plan.reason],
  };
}

export function buildTeachingPlan(
  input: BuildTeachingPlanInput,
  signals: TeachingSignalsResult
): BuildTeachingPlanResult {
  const basePlan = buildResponsePlan({
    learnerState: signals.learnerState,
    isCorrectiveTurn: input.isCorrectiveTurn ?? signals.isCorrectiveTurn,
    repeatedMistake:
      input.repeatedMistake ?? signals.repeatedMistake,
    wantsChallenge: input.wantsChallenge,
    wantsExplanation: signals.wantsExplanation,
    wantsDrill: input.wantsDrill,
    wantsRecap: input.wantsRecap,
    suppressHumor: signals.suppressHumor,
  });

  const plan = applyReviewPriority(basePlan, signals);

  const calibrated = calibrateTone({
    plan,
    learnerState: signals.learnerState,
    repeatedMistake: signals.repeatedMistake,
    shouldReviewConcept: signals.shouldReviewConcept,
    suppressHumor: signals.suppressHumor,
    requireDirectness: signals.requireDirectness,
    softenTone: signals.softenTone,
  });

  const current = input.currentDifficulty ?? 'medium';
  const recommended = bumpDifficulty(current, plan.difficultyDirection);
  const difficulty: DifficultySnapshot = {
    current,
    recommended,
    direction: plan.difficultyDirection,
    reason: mapDifficultyReason(plan.difficultyDirection, signals),
  };

  const adaptive = buildAdaptiveAdjustment(plan, calibrated, signals);

  return {
    adaptive,
    plan,
    calibrated,
    difficulty,
  };
}

export default buildTeachingPlan;