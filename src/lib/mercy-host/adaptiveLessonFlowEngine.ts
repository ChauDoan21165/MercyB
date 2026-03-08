/**
 * VERSION: adaptiveLessonFlowEngine.ts v2
 *
 * Adaptive Lesson Flow Engine
 *
 * Purpose:
 * - give Mercy a top-level teaching arc across turns
 * * - decide where the lesson should go next, not just how one reply should sound
 * - make Mercy feel like one teacher guiding a real lesson
 *
 * What this adds:
 * - stage awareness
 * - recovery awareness
 * - advancement readiness
 * - loop prevention
 * - lesson-level nudges for planning
 *
 * Design rules:
 * - light-touch guidance, not hard override
 * - protect learner dignity during setbacks
 * - move forward only when understanding is stable enough
 * - detect when Mercy is stuck in the same teaching move too long
 */

import type { LearnerState } from './learnerState';
import type { TeachingMode } from './teachingModes';
import type { DifficultyDirection } from './difficultyScaler';
import type { TeacherEmotionState } from './teacherEmotionModel';
import type { AdaptiveTeachingAdjustment } from './adaptiveTeachingIntelligence';

export type LessonFlowStage =
  | 'stabilize'
  | 'clarify'
  | 'correct'
  | 'retry'
  | 'consolidate'
  | 'advance'
  | 'recap';

export interface AdaptiveLessonFlowInput {
  learnerState: LearnerState;
  emotion: TeacherEmotionState;
  adaptive: AdaptiveTeachingAdjustment;

  currentMode: TeachingMode;
  repeatedMistake?: boolean;
  shouldReviewConcept?: boolean;

  wantsChallenge?: boolean;
  wantsExplanation?: boolean;
  wantsDrill?: boolean;
  wantsRecap?: boolean;

  recentModes?: TeachingMode[];
  sameConceptStreak?: number;
  recentSuccess?: boolean;
}

export interface AdaptiveLessonFlowResult {
  stage: LessonFlowStage;

  preferredNextMode?: TeachingMode;
  preferredDifficultyDirection?: DifficultyDirection;

  shouldHoldConcept: boolean;
  shouldSwitchTeachingMove: boolean;
  shouldUseWorkedExample: boolean;
  shouldAskGuidedQuestion: boolean;
  shouldForceRecap: boolean;
  shouldAdvanceLesson: boolean;

  lessonConfidence: number;
  rationale: string[];
}

function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

function countTrailingSameMode(
  modes: TeachingMode[],
  currentMode: TeachingMode
): number {
  let count = 0;

  for (let i = modes.length - 1; i >= 0; i -= 1) {
    if (modes[i] === currentMode) {
      count += 1;
    } else {
      break;
    }
  }

  return count;
}

export function adaptiveLessonFlowEngine(
  input: AdaptiveLessonFlowInput
): AdaptiveLessonFlowResult {
  const {
    learnerState,
    emotion,
    adaptive,
    currentMode,
    repeatedMistake = false,
    shouldReviewConcept = false,
    wantsChallenge = false,
    wantsExplanation = false,
    wantsDrill = false,
    wantsRecap = false,
    recentModes = [],
    sameConceptStreak = 1,
    recentSuccess = false,
  } = input;

  let stage: LessonFlowStage = 'clarify';
  let preferredNextMode: TeachingMode | undefined;
  let preferredDifficultyDirection: DifficultyDirection | undefined;

  let shouldHoldConcept = false;
  let shouldSwitchTeachingMove = false;
  let shouldUseWorkedExample = false;
  let shouldAskGuidedQuestion = false;
  let shouldForceRecap = false;
  let shouldAdvanceLesson = false;

  let lessonConfidence = 0.5;
  const rationale: string[] = [];

  const trailingSameModeCount = countTrailingSameMode(recentModes, currentMode);

  if (
    learnerState.clarity === 'lost' ||
    emotion.primarySignal === 'overwhelmed' ||
    emotion.cognitiveLoadLevel === 'high'
  ) {
    stage = 'stabilize';
    preferredNextMode = wantsRecap ? 'recap' : 'explain';
    preferredDifficultyDirection = 'down';
    shouldHoldConcept = true;
    shouldUseWorkedExample = true;
    lessonConfidence -= 0.25;
    rationale.push('stabilize_overload');
  } else if (wantsRecap) {
    stage = 'recap';
    preferredNextMode = 'recap';
    preferredDifficultyDirection = 'hold';
    shouldForceRecap = true;
    shouldHoldConcept = true;
    rationale.push('recap_requested');
  } else if (repeatedMistake) {
    stage = 'retry';
    preferredNextMode = 'drill';
    preferredDifficultyDirection = 'down';
    shouldHoldConcept = true;
    shouldUseWorkedExample = true;
    lessonConfidence -= 0.15;
    rationale.push('retry_after_mistake');
  } else if (shouldReviewConcept || currentMode === 'correct') {
    stage = 'correct';
    preferredNextMode = shouldReviewConcept ? 'review' : 'correct';
    preferredDifficultyDirection = 'down';
    shouldHoldConcept = true;
    lessonConfidence -= 0.05;
    rationale.push(shouldReviewConcept ? 'review_needed' : 'correction_needed');
  } else if (
    recentSuccess ||
    learnerState.clarity === 'clear' ||
    learnerState.momentum === 'flowing'
  ) {
    stage = wantsChallenge ? 'advance' : 'consolidate';
    preferredNextMode = wantsChallenge
      ? 'challenge'
      : wantsDrill
        ? 'drill'
        : 'encourage';
    preferredDifficultyDirection = wantsChallenge ? 'up' : 'hold';
    shouldAdvanceLesson = wantsChallenge || adaptive.shouldProtectMomentum;
    lessonConfidence += 0.2;
    rationale.push(wantsChallenge ? 'advance_ready' : 'consolidate_success');
  } else {
    stage = wantsExplanation ? 'clarify' : 'consolidate';
    preferredNextMode = wantsExplanation ? 'explain' : currentMode;
    preferredDifficultyDirection = 'hold';
    rationale.push(wantsExplanation ? 'clarify_requested' : 'steady_progress');
  }

  if (
    trailingSameModeCount >= 2 &&
    sameConceptStreak >= 3 &&
    stage !== 'advance'
  ) {
    shouldSwitchTeachingMove = true;
    lessonConfidence -= 0.1;
    rationale.push('loop_prevention');
  }

  if (
    shouldSwitchTeachingMove &&
    (currentMode === 'explain' || preferredNextMode === 'explain')
  ) {
    shouldUseWorkedExample = true;
    shouldAskGuidedQuestion = false;
    rationale.push('switch_to_worked_example');
  }

  if (
    !shouldSwitchTeachingMove &&
    learnerState.clarity === 'shaky' &&
    learnerState.confidence !== 'low' &&
    emotion.primarySignal !== 'overwhelmed'
  ) {
    shouldAskGuidedQuestion = true;
    rationale.push('guided_question_window');
  }

  if (
    stage === 'consolidate' &&
    sameConceptStreak >= 2 &&
    learnerState.clarity === 'clear'
  ) {
    shouldForceRecap = true;
    rationale.push('recap_before_advance');
  }

  if (
    stage === 'advance' &&
    (emotion.primarySignal === 'discouraged' ||
      emotion.primarySignal === 'embarrassed')
  ) {
    shouldAdvanceLesson = false;
    preferredDifficultyDirection = 'hold';
    shouldHoldConcept = true;
    rationale.push('protect_dignity_before_advance');
  }

  const canYieldModeToAdaptive =
    stage === 'consolidate' || stage === 'clarify';

  if (
    adaptive.preferredTeachingMode &&
    (!preferredNextMode || canYieldModeToAdaptive)
  ) {
    preferredNextMode = adaptive.preferredTeachingMode;
    rationale.push('adaptive_mode_alignment');
  }

  if (
    adaptive.preferredDifficultyDirection &&
    (!preferredDifficultyDirection || canYieldModeToAdaptive)
  ) {
    preferredDifficultyDirection = adaptive.preferredDifficultyDirection;
    rationale.push('adaptive_difficulty_alignment');
  }

  if (shouldReviewConcept) {
    shouldHoldConcept = true;
    shouldForceRecap = true;
    lessonConfidence -= 0.1;
    rationale.push('review_required');
  }

  return {
    stage,
    preferredNextMode,
    preferredDifficultyDirection,
    shouldHoldConcept,
    shouldSwitchTeachingMove,
    shouldUseWorkedExample,
    shouldAskGuidedQuestion,
    shouldForceRecap,
    shouldAdvanceLesson,
    lessonConfidence: clamp(lessonConfidence),
    rationale,
  };
}

export default adaptiveLessonFlowEngine;