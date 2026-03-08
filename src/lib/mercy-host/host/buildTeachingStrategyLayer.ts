/**
 * FILE: src/lib/mercy-host/host/buildTeachingStrategyLayer.ts
 * VERSION: buildTeachingStrategyLayer.ts v3.1
 *
 * Purpose:
 * - centralize Mercy's strategy-layer assembly after signals + planning are known
 * - generate specific praise
 * - choose correction vs non-correction teaching strategy
 * - incorporate short-term teacher memory so Mercy can reference real progress
 * - wire worked-example support from lesson flow / retry conditions
 * - reduce mercyHost.ts size without changing behavior
 */

import {
  buildTeachingStrategy,
  buildCorrectionStrategy,
  type TeachingStrategyResult,
} from '../teachingStrategies';
import { getSpecificPraiseText } from '../specificPraise';
import {
  getTeacherMemoryInsight,
  updateTeacherMemory,
} from '../teacherMemoryEngine';
import type { LearnerState } from '../learnerState';
import type { MercyTeachingTurnInput } from '../mercyHost';
import type { TeachingSignalsResult } from './buildTeachingSignals';
import type { TeachingPlanLayerResult } from './buildTeachingPlan';

export interface TeachingStrategyLayerResult {
  specificPraise: string;
  memoryProgressLine?: string;
  strategy: TeachingStrategyResult;
}

function cleanText(text: string): string {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\s([,.!?;:])/g, '$1')
    .trim();
}

function lower(text?: string): string {
  return cleanText(text || '').toLowerCase();
}

function joinText(...parts: Array<string | undefined>): string {
  return cleanText(parts.filter(Boolean).join(' '));
}

function inferPraiseImprovementType(args: {
  learnerState: LearnerState;
  concept?: string;
  mistake?: string;
  repeatedMistake: boolean;
  isCorrectiveTurn: boolean;
  wantsChallenge?: boolean;
}):
  | 'accuracy'
  | 'clarity'
  | 'confidence'
  | 'consistency'
  | 'retry_success'
  | 'rule_use'
  | 'pronunciation'
  | 'structure'
  | 'momentum'
  | undefined {
  const {
    learnerState,
    concept,
    mistake,
    repeatedMistake,
    isCorrectiveTurn,
    wantsChallenge,
  } = args;

  const conceptText = lower(concept);
  const mistakeText = lower(mistake);
  const hay = `${conceptText} ${mistakeText}`;

  if (repeatedMistake && isCorrectiveTurn) return 'retry_success';
  if (wantsChallenge || learnerState.momentum === 'flowing') return 'momentum';
  if (learnerState.clarity === 'clear') return 'clarity';

  if (
    hay.includes('pronunciation') ||
    hay.includes('stress') ||
    hay.includes('sound') ||
    hay.includes('intonation') ||
    hay.includes('accent')
  ) {
    return 'pronunciation';
  }

  if (
    hay.includes('structure') ||
    hay.includes('grammar') ||
    hay.includes('tense') ||
    hay.includes('word order') ||
    hay.includes('sentence')
  ) {
    return 'structure';
  }

  if (conceptText) return 'rule_use';
  if (mistakeText) return 'accuracy';

  return undefined;
}

function shouldTreatTurnAsSuccessful(args: {
  input: MercyTeachingTurnInput;
  signals: TeachingSignalsResult;
  planning: TeachingPlanLayerResult;
}): boolean {
  const { input, signals, planning } = args;

  if (signals.repeatedMistake) return false;
  if (signals.isCorrectiveTurn) return false;
  if (signals.learnerState.clarity !== 'clear') return false;

  return (
    planning.plan.teachingMode === 'challenge' ||
    planning.plan.teachingMode === 'encourage' ||
    planning.plan.teachingMode === 'recap' ||
    planning.plan.teachingMode === 'drill' ||
    !!input.wantsChallenge ||
    signals.learnerState.momentum === 'flowing'
  );
}

function shouldUseWorkedExample(args: {
  input: MercyTeachingTurnInput;
  signals: TeachingSignalsResult;
  planning: TeachingPlanLayerResult;
}): boolean {
  const { input, signals, planning } = args;

  if (planning.plan.teachingMode !== 'explain') return false;
  if (!input.example) return false;

  return (
    signals.repeatedMistake ||
    signals.isSensitiveMoment ||
    signals.wantsExplanation
  );
}

export function buildTeachingStrategyLayer(
  input: MercyTeachingTurnInput,
  signals: TeachingSignalsResult,
  planning: TeachingPlanLayerResult
): TeachingStrategyLayerResult {
  const successfulTurn = shouldTreatTurnAsSuccessful({
    input,
    signals,
    planning,
  });

  const memoryInsight = getTeacherMemoryInsight({
    userId: signals.userId,
    teachingMode: planning.plan.teachingMode,
    concept: input.concept,
    mistake: input.correction?.mistake,
    successfulTurn,
  });

  const specificPraise = getSpecificPraiseText({
    language: input.language,
    concept: input.concept,
    mistake: input.correction?.mistake,
    fix: input.correction?.fix,
    learnerText: input.learnerText,
    repeatedMistake: signals.repeatedMistake,
    wasCorrectiveTurn: signals.isCorrectiveTurn,
    wantsChallenge: input.wantsChallenge,
    improvementType: inferPraiseImprovementType({
      learnerState: signals.learnerState,
      concept: input.concept,
      mistake: input.correction?.mistake,
      repeatedMistake: signals.repeatedMistake,
      isCorrectiveTurn: signals.isCorrectiveTurn,
      wantsChallenge: input.wantsChallenge,
    }),
    length: signals.repeatedMistake || signals.isSensitiveMoment ? 'short' : 'medium',
  });

  const contextualPraise = joinText(
    memoryInsight.progressLine,
    specificPraise
  );

  const workedExample =
    shouldUseWorkedExample({
      input,
      signals,
      planning,
    })
      ? input.example
      : undefined;

  const strategy =
    planning.plan.teachingMode === 'correct' && input.correction
      ? buildCorrectionStrategy(
          planning.calibrated.correctionStyle,
          input.correction,
          {
            tone: planning.calibrated.tone,
            nextPrompt: input.nextPrompt,
            specificPraise: contextualPraise || specificPraise,
            learnerName: input.userName || undefined,
            concept: input.concept,
            example: input.example,
            repeatedMistake: signals.repeatedMistake,
            isSensitiveMoment: signals.isSensitiveMoment,
            wantsChallenge: input.wantsChallenge,
            wantsExplanation: signals.wantsExplanation,
          }
        )
      : buildTeachingStrategy({
          mode: planning.plan.teachingMode,
          tone: planning.calibrated.tone,
          correction: input.correction,
          summary: input.summary,
          explanation: input.explanation,
          example: input.example,
          workedExample,
          concept: input.concept,
          cue: input.nextPrompt,
          nextPrompt: input.nextPrompt,
          specificPraise: contextualPraise || specificPraise,
          learnerName: input.userName || undefined,
          repeatedMistake: signals.repeatedMistake,
          isSensitiveMoment: signals.isSensitiveMoment,
          wantsChallenge: input.wantsChallenge,
          wantsExplanation: signals.wantsExplanation,
        });

  updateTeacherMemory({
    userId: signals.userId,
    concept: input.concept,
    mistake: input.correction?.mistake,
    fix: input.correction?.fix,
    teachingMode: planning.plan.teachingMode,
    learnerText: input.learnerText,
    wasCorrectiveTurn: signals.isCorrectiveTurn,
    repeatedMistake: signals.repeatedMistake,
    successfulTurn,
  });

  return {
    specificPraise,
    memoryProgressLine: memoryInsight.progressLine,
    strategy,
  };
}

export default buildTeachingStrategyLayer;