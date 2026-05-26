/**
 * VERSION: buildTeachingSignals.ts v1.1
 *
 * Purpose:
 * - extract learner / guard / correction / sensitivity signals from Mercy Host
 * - keep early-turn inference in one place
 * - reduce mercyHost.ts size without changing behavior
 */

import { inferLearnerState, type LearnerState } from '../learnerState';
import { inferGuardToneSignals, type GuardToneSignals } from '../guard';
import {
  isRepeatedMistake,
  shouldReviewConcept as checkReviewStatus,
} from '../lessonMemory';
import teacherEmotionModel, {
  type TeacherEmotionState,
} from '../teacherEmotionModel';

export interface BuildTeachingSignalsInput {
  userId?: string | null;
  language: 'en' | 'vi';
  learnerText: string;
  concept?: string;
  correction?: {
    mistake: string;
    fix: string;
  };
  explanation?: string;
  isCorrectiveTurn?: boolean;
  wantsChallenge?: boolean;
  wantsExplanation?: boolean;
  wantsDrill?: boolean;
  wantsRecap?: boolean;
  suppressHumor?: boolean;
  requireDirectness?: boolean;
  softenTone?: boolean;
  repeatedMistake?: boolean;
}

export interface TeachingSignalsResult {
  userId: string;
  learnerState: LearnerState;
  guardSignals: GuardToneSignals;
  conceptKey?: string;
  repeatedMistake: boolean;
  shouldReviewConcept: boolean;
  isCorrectiveTurn: boolean;
  wantsExplanation: boolean;
  suppressHumor: boolean;
  requireDirectness: boolean;
  softenTone: boolean;
  isSensitiveMoment: boolean;
  emotion: TeacherEmotionState;
}

export function buildTeachingSignals(
  input: BuildTeachingSignalsInput
): TeachingSignalsResult {
  const userId = input.userId || 'default';

  const learnerState = inferLearnerState(input.learnerText);
  const guardSignals = inferGuardToneSignals(input.learnerText);

  const conceptKey = input.concept || input.correction?.mistake || undefined;

  const repeatedMistake = input.correction?.mistake
    ? isRepeatedMistake(input.correction.mistake, userId)
    : Boolean(input.repeatedMistake);

  const shouldReviewConceptFlag = conceptKey
    ? checkReviewStatus(conceptKey, userId)
    : false;

  const isCorrectiveTurn = Boolean(input.isCorrectiveTurn || input.correction);
  const wantsExplanation = Boolean(input.wantsExplanation || input.explanation);

  const suppressHumor = input.suppressHumor ?? guardSignals.suppressHumor;
  const requireDirectness =
    input.requireDirectness ?? guardSignals.requireDirectness;
  const softenTone = input.softenTone ?? guardSignals.softenTone;

  const isSensitiveMoment =
    learnerState.affect === 'frustrated' ||
    learnerState.confidence === 'low' ||
    learnerState.clarity === 'lost';

  const emotion = teacherEmotionModel({
    learnerState,
    repeatedMistake,
    isCorrectiveTurn,
    wantsChallenge: input.wantsChallenge,
    wantsExplanation,
    wantsDrill: input.wantsDrill,
    wantsRecap: input.wantsRecap,
    shouldReviewConcept: shouldReviewConceptFlag,
    requireDirectness,
    suppressHumor,
  });

  return {
    userId,
    learnerState,
    guardSignals,
    conceptKey,
    repeatedMistake,
    shouldReviewConcept: shouldReviewConceptFlag,
    isCorrectiveTurn,
    wantsExplanation,
    suppressHumor,
    requireDirectness,
    softenTone,
    isSensitiveMoment,
    emotion,
  };
}

export default buildTeachingSignals;