/**
 * VERSION: adaptiveLessonFlowEngine.test.ts v1
 *
 * Tests for adaptiveLessonFlowEngine.
 *
 * Purpose:
 * - verify lesson-stage decisions across confusion, correction, recap, and advancement
 * - protect loop prevention and lesson progression behavior
 */

import { describe, expect, it } from 'vitest';
import adaptiveLessonFlowEngine from './adaptiveLessonFlowEngine';
import type { LearnerState } from './learnerState';
import type { TeacherEmotionState } from './teacherEmotionModel';
import type { AdaptiveTeachingAdjustment } from './adaptiveTeachingIntelligence';
import type { TeachingMode } from './teachingModes';

function makeLearnerState(
  overrides: Partial<LearnerState> = {}
): LearnerState {
  return {
    confidence: 'medium',
    clarity: 'shaky',
    momentum: 'steady',
    affect: 'neutral',
    ...overrides,
  };
}

function makeEmotion(
  overrides: Partial<TeacherEmotionState> = {}
): TeacherEmotionState {
  return {
    primarySignal: 'neutral',
    humorAllowance: 0.4,
    warmthLevel: 0.55,
    paceAdjustment: 'normal',
    cognitiveLoadLevel: 'moderate',
    momentumProtection: false,
    correctionSoftnessBias: 0.5,
    encouragementBias: 0.5,
    challengeReadiness: 0.5,
    ...overrides,
  };
}

function makeAdaptive(
  overrides: Partial<AdaptiveTeachingAdjustment> = {}
): AdaptiveTeachingAdjustment {
  return {
    explanationDepthBias: 0.5,
    correctionSoftnessBias: 0.5,
    drillBias: 0.5,
    recapBias: 0.5,
    challengePaceBias: 0.5,
    preferredTeachingMode: undefined,
    preferredTone: undefined,
    preferredCorrectionStyle: undefined,
    preferredDifficultyDirection: undefined,
    shouldStayBrief: false,
    shouldAcknowledgeEffort: false,
    shouldProtectMomentum: false,
    rationale: [],
    ...overrides,
  };
}

describe('adaptiveLessonFlowEngine', () => {
  it('stabilizes under overload and prefers explanation or recap', () => {
    const result = adaptiveLessonFlowEngine({
      learnerState: makeLearnerState({
        clarity: 'lost',
        confidence: 'low',
        affect: 'frustrated',
        momentum: 'stuck',
      }),
      emotion: makeEmotion({
        primarySignal: 'overwhelmed',
        cognitiveLoadLevel: 'high',
      }),
      adaptive: makeAdaptive({
        shouldProtectMomentum: true,
      }),
      currentMode: 'explain',
      wantsExplanation: true,
    });

    expect(result.stage).toBe('stabilize');
    expect(['explain', 'recap']).toContain(result.preferredNextMode);
    expect(result.preferredDifficultyDirection).toBe('down');
    expect(result.shouldHoldConcept).toBe(true);
    expect(result.shouldUseWorkedExample).toBe(true);
    expect(result.lessonConfidence).toBeLessThan(0.5);
    expect(result.rationale).toContain('stabilize_overload');
  });

  it('enters retry flow after repeated mistake', () => {
    const result = adaptiveLessonFlowEngine({
      learnerState: makeLearnerState({
        clarity: 'clear',
        confidence: 'low',
        momentum: 'stuck',
      }),
      emotion: makeEmotion({
        primarySignal: 'discouraged',
      }),
      adaptive: makeAdaptive(),
      currentMode: 'correct',
      repeatedMistake: true,
    });

    expect(result.stage).toBe('retry');
    expect(result.preferredNextMode).toBe('drill');
    expect(result.preferredDifficultyDirection).toBe('down');
    expect(result.shouldHoldConcept).toBe(true);
    expect(result.shouldUseWorkedExample).toBe(true);
    expect(result.rationale).toContain('retry_after_mistake');
  });

  it('forces recap when recap is requested', () => {
    const result = adaptiveLessonFlowEngine({
      learnerState: makeLearnerState({
        clarity: 'clear',
        confidence: 'medium',
      }),
      emotion: makeEmotion(),
      adaptive: makeAdaptive(),
      currentMode: 'encourage',
      wantsRecap: true,
    });

    expect(result.stage).toBe('recap');
    expect(result.preferredNextMode).toBe('recap');
    expect(result.preferredDifficultyDirection).toBe('hold');
    expect(result.shouldForceRecap).toBe(true);
    expect(result.shouldHoldConcept).toBe(true);
    expect(result.rationale).toContain('recap_requested');
  });

  it('advances when learner has momentum and challenge is requested', () => {
    const result = adaptiveLessonFlowEngine({
      learnerState: makeLearnerState({
        clarity: 'clear',
        confidence: 'high',
        momentum: 'flowing',
        affect: 'engaged',
      }),
      emotion: makeEmotion({
        primarySignal: 'curious',
      }),
      adaptive: makeAdaptive({
        shouldProtectMomentum: true,
      }),
      currentMode: 'encourage',
      wantsChallenge: true,
      recentSuccess: true,
    });

    expect(result.stage).toBe('advance');
    expect(result.preferredNextMode).toBe('challenge');
    expect(result.preferredDifficultyDirection).toBe('up');
    expect(result.shouldAdvanceLesson).toBe(true);
    expect(result.lessonConfidence).toBeGreaterThan(0.6);
    expect(result.rationale).toContain('advance_ready');
  });

  it('consolidates after success without forcing challenge', () => {
    const result = adaptiveLessonFlowEngine({
      learnerState: makeLearnerState({
        clarity: 'clear',
        confidence: 'medium',
        momentum: 'flowing',
      }),
      emotion: makeEmotion({
        primarySignal: 'neutral',
      }),
      adaptive: makeAdaptive({
        shouldProtectMomentum: false,
      }),
      currentMode: 'drill',
      recentSuccess: true,
      wantsDrill: true,
    });

    expect(result.stage).toBe('consolidate');
    expect(['drill', 'encourage']).toContain(result.preferredNextMode);
    expect(result.shouldAdvanceLesson).toBe(false);
    expect(result.rationale).toContain('consolidate_success');
  });

  it('prevents loops when same mode and same concept continue too long', () => {
    const recentModes: TeachingMode[] = ['explain', 'explain', 'explain'];

    const result = adaptiveLessonFlowEngine({
      learnerState: makeLearnerState({
        clarity: 'shaky',
        confidence: 'medium',
      }),
      emotion: makeEmotion(),
      adaptive: makeAdaptive(),
      currentMode: 'explain',
      recentModes,
      sameConceptStreak: 3,
      wantsExplanation: true,
    });

    expect(result.shouldSwitchTeachingMove).toBe(true);
    expect(result.shouldUseWorkedExample).toBe(true);
    expect(result.lessonConfidence).toBeLessThan(0.5);
    expect(result.rationale).toContain('loop_prevention');
    expect(result.rationale).toContain('switch_to_worked_example');
  });

  it('opens a guided-question window for shaky but not overwhelmed learners', () => {
    const result = adaptiveLessonFlowEngine({
      learnerState: makeLearnerState({
        clarity: 'shaky',
        confidence: 'medium',
        momentum: 'steady',
      }),
      emotion: makeEmotion({
        primarySignal: 'neutral',
        cognitiveLoadLevel: 'moderate',
      }),
      adaptive: makeAdaptive(),
      currentMode: 'explain',
      wantsExplanation: true,
      recentModes: ['correct'],
      sameConceptStreak: 1,
    });

    expect(result.shouldAskGuidedQuestion).toBe(true);
    expect(result.shouldSwitchTeachingMove).toBe(false);
    expect(result.rationale).toContain('guided_question_window');
  });

  it('holds advancement when dignity needs protection', () => {
    const result = adaptiveLessonFlowEngine({
      learnerState: makeLearnerState({
        clarity: 'clear',
        confidence: 'medium',
        momentum: 'flowing',
      }),
      emotion: makeEmotion({
        primarySignal: 'embarrassed',
      }),
      adaptive: makeAdaptive({
        shouldProtectMomentum: true,
      }),
      currentMode: 'encourage',
      wantsChallenge: true,
      recentSuccess: true,
    });

    expect(result.stage).toBe('advance');
    expect(result.shouldAdvanceLesson).toBe(false);
    expect(result.preferredDifficultyDirection).toBe('hold');
    expect(result.shouldHoldConcept).toBe(true);
    expect(result.rationale).toContain('protect_dignity_before_advance');
  });

  it('aligns with adaptive preferences when lesson flow has no stronger preference', () => {
    const result = adaptiveLessonFlowEngine({
      learnerState: makeLearnerState({
        clarity: 'shaky',
        confidence: 'medium',
      }),
      emotion: makeEmotion(),
      adaptive: makeAdaptive({
        preferredTeachingMode: 'review',
        preferredDifficultyDirection: 'down',
      }),
      currentMode: 'encourage',
    });

    expect(result.preferredNextMode).toBe('review');
    expect(result.preferredDifficultyDirection).toBe('down');
    expect(result.rationale).toContain('adaptive_mode_alignment');
    expect(result.rationale).toContain('adaptive_difficulty_alignment');
  });

  it('clamps lesson confidence into 0..1', () => {
    const result = adaptiveLessonFlowEngine({
      learnerState: makeLearnerState({
        clarity: 'lost',
        confidence: 'low',
        momentum: 'stuck',
        affect: 'frustrated',
      }),
      emotion: makeEmotion({
        primarySignal: 'overwhelmed',
        cognitiveLoadLevel: 'high',
      }),
      adaptive: makeAdaptive({
        preferredDifficultyDirection: 'down',
      }),
      currentMode: 'explain',
      repeatedMistake: true,
      shouldReviewConcept: true,
      wantsExplanation: true,
      recentModes: ['explain', 'explain', 'explain'],
      sameConceptStreak: 4,
    });

    expect(result.lessonConfidence).toBeGreaterThanOrEqual(0);
    expect(result.lessonConfidence).toBeLessThanOrEqual(1);
  });
});