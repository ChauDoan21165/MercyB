import { describe, expect, it } from 'vitest';
import { teacherEmotionModel } from './teacherEmotionModel';
import type { LearnerState } from './learnerState';

function makeLearnerState(overrides: Partial<LearnerState>): LearnerState {
  return {
    clarity: 'clear',
    affect: 'neutral',
    confidence: 'medium',
    momentum: 'steady',
    ...overrides,
  };
}

describe('teacherEmotionModel', () => {
  it('reduces humor and slows down when learner is lost', () => {
    const result = teacherEmotionModel({
      learnerState: makeLearnerState({
        clarity: 'lost',
        momentum: 'stuck',
      }),
      repeatedMistake: true,
      wantsExplanation: true,
    });

    expect(result.primarySignal).toBe('overwhelmed');
    expect(result.cognitiveLoadLevel).toBe('high');
    expect(result.paceAdjustment).toBe('slow');
    expect(result.humorAllowance).toBeLessThan(0.3);
    expect(result.momentumProtection).toBe(true);
  });

  it('increases warmth and encouragement when confidence is low', () => {
    const result = teacherEmotionModel({
      learnerState: makeLearnerState({
        confidence: 'low',
        momentum: 'stuck',
      }),
      isCorrectiveTurn: true,
      repeatedMistake: true,
    });

    expect(result.warmthLevel).toBeGreaterThan(0.65);
    expect(result.encouragementBias).toBeGreaterThan(0.6);
    expect(result.correctionSoftnessBias).toBeGreaterThan(0.6);
  });

  it('preserves momentum when learner is flowing and wants challenge', () => {
    const result = teacherEmotionModel({
      learnerState: makeLearnerState({
        affect: 'playful',
        confidence: 'high',
        momentum: 'flowing',
      }),
      wantsChallenge: true,
    });

    expect(['proud', 'curious']).toContain(result.primarySignal);
    expect(result.challengeReadiness).toBeGreaterThan(0.7);
    expect(result.momentumProtection).toBe(true);
    expect(result.humorAllowance).toBeGreaterThan(0.5);
  });

  it('suppresses humor when repeated mistakes are happening', () => {
    const result = teacherEmotionModel({
      learnerState: makeLearnerState({
        affect: 'playful',
        momentum: 'stuck',
      }),
      repeatedMistake: true,
    });

    expect(result.humorAllowance).toBeLessThan(0.5);
    expect(result.challengeReadiness).toBeLessThan(0.5);
  });

  it('respects suppressHumor override', () => {
    const result = teacherEmotionModel({
      learnerState: makeLearnerState({
        affect: 'playful',
        confidence: 'high',
        momentum: 'flowing',
      }),
      suppressHumor: true,
    });

    expect(result.humorAllowance).toBe(0);
  });

  it('leans gentler unless directness is required', () => {
    const gentle = teacherEmotionModel({
      learnerState: makeLearnerState({
        confidence: 'low',
        momentum: 'stuck',
      }),
    });

    const direct = teacherEmotionModel({
      learnerState: makeLearnerState({
        confidence: 'low',
        momentum: 'stuck',
      }),
      requireDirectness: true,
    });

    expect(gentle.correctionSoftnessBias).toBeGreaterThan(direct.correctionSoftnessBias);
  });
});
