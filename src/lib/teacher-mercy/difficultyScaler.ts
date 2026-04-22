/**
 * Mercy Difficulty Scaler
 *
 * Purpose:
 * - adjust challenge gradually like a real teacher
 * - increase difficulty after stable success
 * - reduce difficulty after repeated friction
 * - keep transitions calm, not dramatic
 *
 * Design rules:
 * - two solid wins can justify a small increase
 * - repeated mistakes should simplify, not shame
 * - never jump more than one step at a time
 * - difficulty changes should be explainable
 */

import type { LessonMemoryState } from './lessonMemory';

export type DifficultyLevel =
  | 'very_easy'
  | 'easy'
  | 'medium'
  | 'hard'
  | 'stretch';

export type DifficultyDirection = 'up' | 'down' | 'hold';

export interface DifficultySnapshot {
  current: DifficultyLevel;
  recommended: DifficultyLevel;
  direction: DifficultyDirection;
  reason:
    | 'stable_success'
    | 'high_success'
    | 'repeated_mistake'
    | 'low_confidence'
    | 'friction'
    | 'steady'
    | 'no_memory';
}

export interface DifficultyScalerInput {
  current: DifficultyLevel;
  memory?: Partial<LessonMemoryState> | null;
  repeatedMistake?: boolean;
  recentCorrect?: boolean;
  lowConfidence?: boolean;
  confused?: boolean;
}

const DIFFICULTY_ORDER: DifficultyLevel[] = [
  'very_easy',
  'easy',
  'medium',
  'hard',
  'stretch',
];

function clampIndex(index: number): number {
  if (index < 0) return 0;
  if (index >= DIFFICULTY_ORDER.length) return DIFFICULTY_ORDER.length - 1;
  return index;
}

function getDifficultyIndex(level: DifficultyLevel): number {
  return DIFFICULTY_ORDER.indexOf(level);
}

function shiftDifficulty(
  level: DifficultyLevel,
  step: -1 | 0 | 1
): DifficultyLevel {
  const currentIndex = getDifficultyIndex(level);
  const nextIndex = clampIndex(currentIndex + step);
  return DIFFICULTY_ORDER[nextIndex];
}

function getMistakePeakCount(
  mistakeCount?: Record<string, number>
): number {
  if (!mistakeCount) return 0;

  const values = Object.values(mistakeCount);
  if (values.length === 0) return 0;

  return Math.max(...values);
}

function getRecentConceptLoad(
  recentConcepts?: string[]
): number {
  return Array.isArray(recentConcepts) ? recentConcepts.length : 0;
}

/**
 * Compute recommended difficulty from recent learning signals.
 */
export function getRecommendedDifficulty(
  input: DifficultyScalerInput
): DifficultySnapshot {
  const {
    current,
    memory,
    repeatedMistake = false,
    recentCorrect = false,
    lowConfidence = false,
    confused = false,
  } = input;

  if (!memory) {
    return {
      current,
      recommended: current,
      direction: 'hold',
      reason: 'no_memory',
    };
  }

  const correctStreak = memory.correctStreak ?? 0;
  const peakMistakeCount = getMistakePeakCount(memory.mistakeCount);
  const recentConceptLoad = getRecentConceptLoad(memory.recentConcepts);

  if (repeatedMistake || confused || peakMistakeCount >= 3) {
    return {
      current,
      recommended: shiftDifficulty(current, -1),
      direction: 'down',
      reason: 'repeated_mistake',
    };
  }

  if (lowConfidence) {
    return {
      current,
      recommended: shiftDifficulty(current, -1),
      direction: 'down',
      reason: 'low_confidence',
    };
  }

  if ((correctStreak >= 3 && recentCorrect) || correctStreak >= 4) {
    return {
      current,
      recommended: shiftDifficulty(current, 1),
      direction: 'up',
      reason: 'high_success',
    };
  }

  if (correctStreak >= 2 && peakMistakeCount <= 1 && recentConceptLoad <= 5) {
    return {
      current,
      recommended: shiftDifficulty(current, 1),
      direction: 'up',
      reason: 'stable_success',
    };
  }

  if (peakMistakeCount >= 2) {
    return {
      current,
      recommended: shiftDifficulty(current, -1),
      direction: 'down',
      reason: 'friction',
    };
  }

  return {
    current,
    recommended: current,
    direction: 'hold',
    reason: 'steady',
  };
}

/**
 * Whether Mercy should increase challenge now.
 */
export function shouldIncreaseDifficulty(
  input: DifficultyScalerInput
): boolean {
  return getRecommendedDifficulty(input).direction === 'up';
}

/**
 * Whether Mercy should simplify now.
 */
export function shouldDecreaseDifficulty(
  input: DifficultyScalerInput
): boolean {
  return getRecommendedDifficulty(input).direction === 'down';
}

/**
 * Get the next difficulty level only.
 */
export function scaleDifficulty(
  input: DifficultyScalerInput
): DifficultyLevel {
  return getRecommendedDifficulty(input).recommended;
}

/**
 * Human-readable coaching note for logs, debug UIs, or planner traces.
 */
export function explainDifficultyDecision(
  snapshot: DifficultySnapshot
): string {
  switch (snapshot.reason) {
    case 'high_success':
      return 'Learner is performing strongly. Raise difficulty by one step.';
    case 'stable_success':
      return 'Learner is steady. A small challenge increase is appropriate.';
    case 'repeated_mistake':
      return 'Repeated friction detected. Simplify one step and reinforce basics.';
    case 'low_confidence':
      return 'Confidence appears low. Reduce pressure and simplify slightly.';
    case 'friction':
      return 'Recent mistakes suggest current level is a bit heavy.';
    case 'no_memory':
      return 'No recent memory. Hold current level until more signals appear.';
    case 'steady':
    default:
      return 'Current difficulty looks appropriate. Hold steady.';
  }
}

/**
 * Suggested exercise settings for each difficulty band.
 * This keeps content generators consistent.
 */
export function getDifficultyProfile(level: DifficultyLevel): {
  sentenceLength: 'short' | 'medium' | 'long';
  vocabularyLoad: 'light' | 'moderate' | 'dense';
  hintLevel: 'high' | 'medium' | 'low';
  correctionTolerance: 'supportive' | 'balanced' | 'strict';
} {
  switch (level) {
    case 'very_easy':
      return {
        sentenceLength: 'short',
        vocabularyLoad: 'light',
        hintLevel: 'high',
        correctionTolerance: 'supportive',
      };

    case 'easy':
      return {
        sentenceLength: 'short',
        vocabularyLoad: 'light',
        hintLevel: 'high',
        correctionTolerance: 'supportive',
      };

    case 'medium':
      return {
        sentenceLength: 'medium',
        vocabularyLoad: 'moderate',
        hintLevel: 'medium',
        correctionTolerance: 'balanced',
      };

    case 'hard':
      return {
        sentenceLength: 'medium',
        vocabularyLoad: 'dense',
        hintLevel: 'low',
        correctionTolerance: 'balanced',
      };

    case 'stretch':
      return {
        sentenceLength: 'long',
        vocabularyLoad: 'dense',
        hintLevel: 'low',
        correctionTolerance: 'strict',
      };

    default:
      return {
        sentenceLength: 'medium',
        vocabularyLoad: 'moderate',
        hintLevel: 'medium',
        correctionTolerance: 'balanced',
      };
  }
}