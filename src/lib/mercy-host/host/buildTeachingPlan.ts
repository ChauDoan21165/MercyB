/**
 * VERSION: buildTeachingPlan.ts v2.1
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
import type { TeachingSignalsResult } from './buildTeachingSignals';

export interface BuildTeachingPlanInput {
  currentDifficulty?: string;
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
}

export interface BuildTeachingPlanResult {
  adaptive: {
    preferredTeachingMode: ResponsePlan['teachingMode'];
    preferredDifficultyDirection: ResponsePlan['difficultyDirection'];
    rationale: string;
  };
  plan: ResponsePlan;
  calibrated: ToneCalibrationResult;
  difficulty: {
    currentLevel: string;
    direction: ResponsePlan['difficultyDirection'];
    nextLevel: string;
  };
}

function bumpDifficulty(
  currentLevel: string,
  direction: ResponsePlan['difficultyDirection']
): string {
  const levels = ['starter', 'easy', 'medium', 'hard'] as const;
  const normalized = levels.includes(currentLevel as (typeof levels)[number])
    ? (currentLevel as (typeof levels)[number])
    : 'medium';

  const currentIndex = levels.indexOf(normalized);

  if (direction === 'hold') return normalized;
  if (direction === 'up') {
    return levels[Math.min(levels.length - 1, currentIndex + 1)];
  }

  return levels[Math.max(0, currentIndex - 1)];
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

export function buildTeachingPlan(
  input: BuildTeachingPlanInput,
  signals: TeachingSignalsResult
): BuildTeachingPlanResult {
  const basePlan = buildResponsePlan({
    learnerState: signals.learnerState,
    isCorrectiveTurn: input.isCorrectiveTurn ?? signals.isCorrectiveTurn,
    repeatedMistake: signals.repeatedMistake,
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

  const currentLevel = input.currentDifficulty ?? 'medium';
  const nextLevel = bumpDifficulty(currentLevel, plan.difficultyDirection);

  return {
    adaptive: {
      preferredTeachingMode: plan.teachingMode,
      preferredDifficultyDirection: plan.difficultyDirection,
      rationale: plan.reason,
    },
    plan,
    calibrated,
    difficulty: {
      currentLevel,
      direction: plan.difficultyDirection,
      nextLevel,
    },
  };
}

export default buildTeachingPlan;