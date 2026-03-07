import { describe, expect, it } from 'vitest';
import { calibrateTone } from '../toneCalibration';
import type { LearnerState } from '../learnerState';
import type { ResponsePlan } from '../responsePlanner';

function makeLearnerState(
  overrides: Partial<LearnerState> = {}
): LearnerState {
  return {
    confidence: 'medium',
    clarity: 'clear',
    momentum: 'steady',
    affect: 'neutral',
    ...overrides,
  };
}

function makePlan(
  overrides: Partial<ResponsePlan> = {}
): ResponsePlan {
  return {
    teachingMode: 'encourage',
    tone: 'warm',
    shouldUseHumor: false,
    shouldBeBrief: true,
    correctionStyle: 'gentle',
    acknowledgeEffort: true,
    addNextStep: true,
    difficultyDirection: 'hold',
    reason: 'encourage_default',
    ...overrides,
  };
}

describe('calibrateTone', () => {
  it('warms and lengthens tone for confused learners', () => {
    const result = calibrateTone({
      learnerState: makeLearnerState({
        clarity: 'lost',
        affect: 'neutral',
      }),
      plan: makePlan({
        tone: 'firm',
        shouldUseHumor: true,
        shouldBeBrief: true,
        correctionStyle: 'direct',
      }),
    });

    expect(result.tone).toBe('warm');
    expect(result.shouldUseHumor).toBe(false);
    expect(result.shouldBeBrief).toBe(false);
    expect(result.correctionStyle).toBe('gentle');
    expect(result.acknowledgeEffort).toBe(true);
    expect(result.notes).toContain('confusion_warmth');
  });

  it('adds frustration note when learner is frustrated', () => {
    const result = calibrateTone({
      learnerState: makeLearnerState({
        clarity: 'shaky',
        affect: 'frustrated',
      }),
      plan: makePlan({
        tone: 'firm',
        shouldUseHumor: true,
      }),
    });

    expect(result.tone).toBe('warm');
    expect(result.shouldUseHumor).toBe(false);
    expect(result.notes).toContain('frustration_softening');
  });

  it('suppresses humor when explicitly requested', () => {
    const result = calibrateTone({
      learnerState: makeLearnerState({
        affect: 'playful',
      }),
      plan: makePlan({
        tone: 'playful',
        shouldUseHumor: true,
      }),
      suppressHumor: true,
    });

    expect(result.shouldUseHumor).toBe(false);
    expect(result.notes).toContain('humor_suppressed');
  });

  it('softens firm tone when softenTone is true', () => {
    const result = calibrateTone({
      learnerState: makeLearnerState(),
      plan: makePlan({
        tone: 'firm',
      }),
      softenTone: true,
    });

    expect(result.tone).toBe('calm');
    expect(result.notes).toContain('tone_softened');
  });

  it('converts playful tone to warm when softened', () => {
    const result = calibrateTone({
      learnerState: makeLearnerState({
        affect: 'playful',
      }),
      plan: makePlan({
        tone: 'playful',
        shouldUseHumor: true,
      }),
      softenTone: true,
    });

    expect(result.tone).toBe('warm');
    expect(result.notes).toContain('tone_softened');
    expect(result.notes).not.toContain('safe_playfulness');
  });

  it('enforces directness for stable learners when required', () => {
    const result = calibrateTone({
      learnerState: makeLearnerState(),
      plan: makePlan({
        tone: 'playful',
        correctionStyle: 'gentle',
        shouldBeBrief: false,
      }),
      requireDirectness: true,
    });

    expect(result.tone).toBe('calm');
    expect(result.correctionStyle).toBe('direct');
    expect(result.shouldBeBrief).toBe(true);
    expect(result.notes).toContain('directness_required');
    expect(result.notes).toContain('briefness_enforced');
  });

  it('keeps correction gentle under overload even if directness is required', () => {
    const result = calibrateTone({
      learnerState: makeLearnerState({
        clarity: 'lost',
        affect: 'frustrated',
      }),
      plan: makePlan({
        teachingMode: 'correct',
        tone: 'firm',
        correctionStyle: 'direct',
      }),
      requireDirectness: true,
    });

    expect(result.tone).toBe('warm');
    expect(result.correctionStyle).toBe('gentle');
  });

  it('uses contrastive correction for repeated mistakes when learner is stable', () => {
    const result = calibrateTone({
      learnerState: makeLearnerState(),
      plan: makePlan({
        teachingMode: 'correct',
        correctionStyle: 'gentle',
        shouldUseHumor: true,
      }),
      repeatedMistake: true,
    });

    expect(result.shouldUseHumor).toBe(false);
    expect(result.correctionStyle).toBe('contrastive');
    expect(result.acknowledgeEffort).toBe(true);
    expect(result.notes).toContain('repeated_mistake_focus');
  });

  it('softens repeated-mistake correction when learner is frustrated', () => {
    const result = calibrateTone({
      learnerState: makeLearnerState({
        affect: 'frustrated',
        clarity: 'shaky',
      }),
      plan: makePlan({
        teachingMode: 'correct',
        correctionStyle: 'direct',
      }),
      repeatedMistake: true,
    });

    expect(result.correctionStyle).toBe('gentle');
    expect(result.notes).toContain('correction_softened');
  });

  it('switches to calm review mode when concept review is needed', () => {
    const result = calibrateTone({
      learnerState: makeLearnerState({
        affect: 'playful',
      }),
      plan: makePlan({
        teachingMode: 'review',
        tone: 'playful',
        shouldUseHumor: true,
        shouldBeBrief: true,
      }),
      shouldReviewConcept: true,
    });

    expect(result.tone).toBe('calm');
    expect(result.shouldUseHumor).toBe(false);
    expect(result.shouldBeBrief).toBe(false);
    expect(result.notes).toContain('review_mode');
    expect(result.notes).toContain('briefness_reduced');
  });

  it('reduces brevity and humor for explanation mode', () => {
    const result = calibrateTone({
      learnerState: makeLearnerState({
        affect: 'playful',
      }),
      plan: makePlan({
        teachingMode: 'explain',
        tone: 'playful',
        shouldUseHumor: true,
        shouldBeBrief: true,
      }),
      wantsExplanation: true,
    });

    expect(result.tone).toBe('calm');
    expect(result.shouldUseHumor).toBe(false);
    expect(result.shouldBeBrief).toBe(false);
    expect(result.notes).toContain('briefness_reduced');
    expect(result.notes).not.toContain('safe_playfulness');
  });

  it('keeps drill mode brief and dampens firmness for low-confidence learners', () => {
    const result = calibrateTone({
      learnerState: makeLearnerState({
        confidence: 'low',
      }),
      plan: makePlan({
        teachingMode: 'drill',
        tone: 'firm',
        shouldBeBrief: false,
      }),
      wantsDrill: true,
    });

    expect(result.shouldBeBrief).toBe(true);
    expect(result.tone).toBe('warm');
    expect(result.notes).toContain('briefness_enforced');
    expect(result.notes).toContain('firmness_dampened');
    expect(result.notes).toContain('low_confidence_support');
  });

  it('restores safe playfulness for stable playful learners', () => {
    const result = calibrateTone({
      learnerState: makeLearnerState({
        affect: 'playful',
        clarity: 'clear',
        confidence: 'high',
      }),
      plan: makePlan({
        tone: 'warm',
        shouldUseHumor: true,
      }),
    });

    expect(result.tone).toBe('playful');
    expect(result.shouldUseHumor).toBe(true);
    expect(result.notes).toContain('humor_restored');
    expect(result.notes).toContain('safe_playfulness');
  });

  it('does not restore playfulness for low-confidence playful learners', () => {
    const result = calibrateTone({
      learnerState: makeLearnerState({
        affect: 'playful',
        clarity: 'clear',
        confidence: 'low',
      }),
      plan: makePlan({
        tone: 'warm',
        shouldUseHumor: true,
      }),
    });

    expect(result.tone).toBe('warm');
    expect(result.notes).not.toContain('safe_playfulness');
    expect(result.notes).toContain('low_confidence_support');
  });

  it('keeps challenge mode brief when learner momentum is flowing', () => {
    const result = calibrateTone({
      learnerState: makeLearnerState({
        momentum: 'flowing',
        clarity: 'clear',
        confidence: 'high',
      }),
      plan: makePlan({
        teachingMode: 'challenge',
        tone: 'warm',
        shouldBeBrief: false,
      }),
    });

    expect(result.tone).toBe('calm');
    expect(result.shouldBeBrief).toBe(true);
    expect(result.notes).toContain('challenge_momentum');
    expect(result.notes).toContain('briefness_enforced');
  });

  it('dampens challenge firmness when learner is not stable enough', () => {
    const result = calibrateTone({
      learnerState: makeLearnerState({
        momentum: 'flowing',
        clarity: 'clear',
        confidence: 'low',
      }),
      plan: makePlan({
        teachingMode: 'challenge',
        tone: 'firm',
      }),
    });

    expect(result.tone).toBe('warm');
    expect(result.notes).toContain('firmness_dampened');
    expect(result.notes).toContain('low_confidence_support');
  });

  it('does not restore humor during recap even for playful learners', () => {
    const result = calibrateTone({
      learnerState: makeLearnerState({
        affect: 'playful',
        clarity: 'clear',
        confidence: 'high',
      }),
      plan: makePlan({
        teachingMode: 'recap',
        tone: 'playful',
        shouldUseHumor: true,
        shouldBeBrief: true,
      }),
      wantsRecap: true,
    });

    expect(result.tone).toBe('calm');
    expect(result.shouldUseHumor).toBe(false);
    expect(result.shouldBeBrief).toBe(false);
    expect(result.notes).toContain('briefness_reduced');
    expect(result.notes).not.toContain('safe_playfulness');
  });
});