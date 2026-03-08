/**
 * VERSION: buildProgressState.ts v1
 *
 * Purpose:
 * - centralize Mercy's progress-state updates after dialogue is built
 * - update lesson memory
 * - update curriculum state
 * - fetch curriculum recommendation
 * - reduce mercyHost.ts size without changing behavior
 */

import {
  updateLessonMemory,
  type LessonMemoryState,
} from '../lessonMemory';
import {
  updateCurriculumTopic,
  getCurriculumRecommendation,
  type CurriculumRecommendation,
  type CurriculumState,
} from '../curriculumTracker';
import type { MercyTeachingTurnInput } from '../mercyHost';
import type { TeachingSignalsResult } from './buildTeachingSignals';

export interface TeachingProgressLayerResult {
  memory: LessonMemoryState;
  curriculum: CurriculumState;
  curriculumRecommendation: CurriculumRecommendation;
}

export interface BuildProgressStateInput {
  curriculumBefore: CurriculumState;
}

export function buildProgressState(
  input: MercyTeachingTurnInput,
  signals: TeachingSignalsResult,
  state: BuildProgressStateInput
): TeachingProgressLayerResult {
  const memory = updateLessonMemory(
    {
      correct: !(input.isCorrectiveTurn || input.correction),
      mistake: input.correction?.mistake,
      concept: signals.conceptKey,
    },
    signals.userId
  );

  const curriculum =
    signals.conceptKey
      ? updateCurriculumTopic({
          topic: signals.conceptKey,
          correct: !(input.isCorrectiveTurn || input.correction),
        })
      : state.curriculumBefore;

  const curriculumRecommendation = getCurriculumRecommendation();

  return {
    memory,
    curriculum,
    curriculumRecommendation,
  };
}

export default buildProgressState;