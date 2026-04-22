/**
 * VERSION: responsePlanner.test.ts v2
 *
 * Tests for Mercy's response planner.
 *
 * Purpose:
 * - verify planner decisions for key learner states
 * - ensure tone, teachingMode, humor rules, and difficulty direction behave correctly
 * - protect teaching logic from regressions
 */

import { describe, expect, it } from 'vitest';
import { buildResponsePlan } from './responsePlanner';
import type { LearnerState } from './learnerState';

function makeLearnerState(overrides: Partial<LearnerState> = {}): LearnerState {
  return {
    confidence: 'medium',
    clarity: 'shaky',
    momentum: 'steady',
    affect: 'neutral',
    ...overrides,
  };
}

describe('buildResponsePlan', () => {
  it('explains warmly and lowers difficulty when learner is lost', () => {
    const learnerState = makeLearnerState({
      clarity: 'lost',
      confidence: 'low',
      affect: 'frustrated',
    });

    const plan = buildResponsePlan({
      learnerState,
    });

    expect(plan.teachingMode).toBe('explain');
    expect(plan.tone).toBe('warm');
    expect(plan.difficultyDirection).toBe('down');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.acknowledgeEffort).toBe(true);
  });

  it('handles corrective turn with acknowledgement', () => {
    const learnerState = makeLearnerState();

    const plan = buildResponsePlan({
      learnerState,
      isCorrectiveTurn: true,
    });

    expect(plan.teachingMode).toBe('correct');
    expect(plan.acknowledgeEffort).toBe(true);
    expect(plan.correctionStyle).toBeDefined();
  });

  it('lowers difficulty on repeated mistake', () => {
    const learnerState = makeLearnerState();

    const plan = buildResponsePlan({
      learnerState,
      isCorrectiveTurn: true,
      repeatedMistake: true,
    });

    expect(plan.teachingMode).toBe('correct');
    expect(plan.difficultyDirection).toBe('down');
    expect(plan.shouldUseHumor).toBe(false);
  });

  it('enters recap mode when requested', () => {
    const learnerState = makeLearnerState();

    const plan = buildResponsePlan({
      learnerState,
      wantsRecap: true,
    });

    expect(plan.teachingMode).toBe('recap');
    expect(plan.difficultyDirection).toBe('hold');
    expect(plan.shouldUseHumor).toBe(false);
  });

  it('enters drill mode when drill is requested', () => {
    const learnerState = makeLearnerState();

    const plan = buildResponsePlan({
      learnerState,
      wantsDrill: true,
    });

    expect(plan.teachingMode).toBe('drill');
    expect(plan.addNextStep).toBe(true);
    expect(plan.shouldUseHumor).toBe(false);
  });

  it('challenges learner with strong momentum', () => {
    const learnerState = makeLearnerState({
      momentum: 'flowing',
      confidence: 'high',
      clarity: 'clear',
    });

    const plan = buildResponsePlan({
      learnerState,
    });

    expect(plan.teachingMode).toBe('challenge');
    expect(plan.difficultyDirection).toBe('up');
  });

  it('respects explicit challenge request', () => {
    const learnerState = makeLearnerState({
      confidence: 'medium',
      momentum: 'steady',
    });

    const plan = buildResponsePlan({
      learnerState,
      wantsChallenge: true,
    });

    expect(plan.teachingMode).toBe('challenge');
    expect(plan.difficultyDirection).toBe('up');
  });

  it('suppresses humor when requested', () => {
    const learnerState = makeLearnerState({
      momentum: 'flowing',
      confidence: 'high',
    });

    const plan = buildResponsePlan({
      learnerState,
      suppressHumor: true,
    });

    expect(plan.shouldUseHumor).toBe(false);
  });

  it('defaults to a complete valid plan shape', () => {
    const learnerState = makeLearnerState();

    const plan = buildResponsePlan({
      learnerState,
    });

    expect(plan.teachingMode).toBeDefined();
    expect(plan.tone).toBeDefined();
    expect(plan.difficultyDirection).toBeDefined();
    expect(typeof plan.shouldUseHumor).toBe('boolean');
    expect(typeof plan.acknowledgeEffort).toBe('boolean');
    expect(typeof plan.addNextStep).toBe('boolean');
    expect(typeof plan.reason).toBe('string');
  });
});