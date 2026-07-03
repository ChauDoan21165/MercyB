import { describe, expect, it } from 'vitest';
import { buildResponsePlan } from '../responsePlanner';
import type { LearnerState } from '../learnerState';

type PlannerTestLearnerState = LearnerState &
  Partial<{
    directnessRequired: boolean;
    emotion: 'frustrated';
    needsConceptReview: boolean;
    playful: boolean;
    toneSofteningRequested: boolean;
  }>;

function makeLearnerState(
  overrides: Partial<PlannerTestLearnerState> = {}
): PlannerTestLearnerState {
  return {
    confidence: 'medium',
    clarity: 'clear',
    momentum: 'steady',
    affect: 'neutral',
    ...overrides,
  };
}

function makeSparseLearnerState(
  overrides: Partial<PlannerTestLearnerState> = {}
): PlannerTestLearnerState {
  return overrides as PlannerTestLearnerState;
}

describe('buildResponsePlan', () => {
  it('uses warm, non-humorous support for confused learners', () => {
    const plan = buildResponsePlan({
      learnerState: makeLearnerState({
        clarity: 'lost',
      }),
    });

    expect(plan.teachingMode).toBe('correct');
    expect(plan.tone).toBe('warm');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.shouldBeBrief).toBe(false);
    expect(plan.correctionStyle).toBe('gentle');
    expect(plan.difficultyDirection).toBe('down');
    expect(plan.acknowledgeEffort).toBe(true);
    expect(plan.reason).toBe('confused');
  });

  it('uses warm, non-humorous support for frustrated learners', () => {
    const plan = buildResponsePlan({
      learnerState: makeLearnerState({
        emotion: 'frustrated',
      }),
    });

    expect(plan.teachingMode).toBe('correct');
    expect(plan.tone).toBe('warm');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.shouldBeBrief).toBe(false);
    expect(plan.correctionStyle).toBe('gentle');
    expect(plan.difficultyDirection).toBe('down');
    expect(plan.acknowledgeEffort).toBe(true);
    expect(plan.reason).toBe('frustrated');
  });

  it('switches to review when concept review is required', () => {
    const plan = buildResponsePlan({
      learnerState: makeLearnerState({
        needsConceptReview: true,
      }),
    });

    expect(plan.teachingMode).toBe('review');
    expect(plan.tone).toBe('calm');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.shouldBeBrief).toBe(false);
    expect(plan.correctionStyle).toBe('gentle');
    expect(plan.difficultyDirection).toBe('down');
    expect(plan.reason).toBe('review_required');
  });

  it('uses recap mode when explicitly requested', () => {
    const plan = buildResponsePlan({
      learnerState: makeLearnerState(),
      wantsRecap: true,
    });

    expect(plan.teachingMode).toBe('recap');
    expect(plan.tone).toBe('calm');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.shouldBeBrief).toBe(false);
    expect(plan.correctionStyle).toBe('gentle');
    expect(plan.difficultyDirection).toBe('hold');
    expect(plan.reason).toBe('recap_required');
  });

  it('uses drill mode when explicitly requested', () => {
    const plan = buildResponsePlan({
      learnerState: makeLearnerState(),
      wantsDrill: true,
    });

    expect(plan.teachingMode).toBe('drill');
    expect(plan.tone).toBe('calm');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.shouldBeBrief).toBe(true);
    expect(plan.correctionStyle).toBe('direct');
    expect(plan.difficultyDirection).toBe('hold');
    expect(plan.addNextStep).toBe(true);
    expect(plan.reason).toBe('drill_required');
  });

  it('moves into challenge mode when challenge is requested', () => {
    const plan = buildResponsePlan({
      learnerState: makeLearnerState(),
      wantsChallenge: true,
    });

    expect(plan.teachingMode).toBe('challenge');
    expect(plan.tone).toBe('playful');
    expect(plan.shouldUseHumor).toBe(true);
    expect(plan.shouldBeBrief).toBe(true);
    expect(plan.correctionStyle).toBe('direct');
    expect(plan.difficultyDirection).toBe('up');
    expect(plan.reason).toBe('challenge_requested');
  });

  it('moves into challenge mode when learner momentum is flowing', () => {
    const plan = buildResponsePlan({
      learnerState: makeLearnerState({
        momentum: 'flowing',
        confidence: 'high',
      }),
    });

    expect(plan.teachingMode).toBe('challenge');
    expect(plan.tone).toBe('firm');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.shouldBeBrief).toBe(true);
    expect(plan.correctionStyle).toBe('direct');
    expect(plan.difficultyDirection).toBe('up');
    expect(plan.reason).toBe('momentum');
  });

  it('uses contrastive correction for repeated mistakes', () => {
    const plan = buildResponsePlan({
      learnerState: makeLearnerState(),
      isCorrectiveTurn: true,
      repeatedMistake: true,
    });

    expect(plan.teachingMode).toBe('correct');
    expect(plan.tone).toBe('firm');
    expect(plan.correctionStyle).toBe('contrastive');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.shouldBeBrief).toBe(false);
    expect(plan.difficultyDirection).toBe('down');
    expect(plan.acknowledgeEffort).toBe(true);
    expect(plan.reason).toBe('repeated_mistake');
  });

  it('uses direct correction when directness is required', () => {
    const plan = buildResponsePlan({
      learnerState: makeLearnerState({
        directnessRequired: true,
      }),
      isCorrectiveTurn: true,
    });

    expect(plan.teachingMode).toBe('correct');
    expect(plan.tone).toBe('firm');
    expect(plan.correctionStyle).toBe('direct');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.shouldBeBrief).toBe(true);
    expect(plan.difficultyDirection).toBe('down');
    expect(plan.reason).toBe('directness_required');
  });

  it('suppresses humor when suppressHumor is true even for playful learners', () => {
    const plan = buildResponsePlan({
      learnerState: makeLearnerState({
        playful: true,
      }),
      suppressHumor: true,
    });

    expect(plan.teachingMode).toBe('encourage');
    expect(plan.tone).toBe('playful');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.shouldBeBrief).toBe(false);
  });

  it('suppresses humor for playful learners who are also confused', () => {
    const plan = buildResponsePlan({
      learnerState: makeLearnerState({
        playful: true,
        clarity: 'lost',
      }),
    });

    expect(plan.teachingMode).toBe('correct');
    expect(plan.tone).toBe('warm');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.reason).toBe('confused');
  });

  it('softens explanation mode for low-confidence learners', () => {
    const plan = buildResponsePlan({
      learnerState: makeLearnerState({
        confidence: 'low',
      }),
      wantsExplanation: true,
    });

    expect(plan.teachingMode).toBe('explain');
    expect(plan.tone).toBe('warm');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.shouldBeBrief).toBe(false);
    expect(plan.acknowledgeEffort).toBe(true);
    expect(plan.reason).toBe('low_confidence');
  });

  it('defaults to encouragement for neutral learners', () => {
    const plan = buildResponsePlan({
      learnerState: makeSparseLearnerState(),
    });

    expect(plan.teachingMode).toBe('encourage');
    expect(plan.tone).toBe('warm');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.shouldBeBrief).toBe(false);
    expect(plan.correctionStyle).toBe('gentle');
    expect(plan.difficultyDirection).toBe('hold');
    expect(plan.reason).toBe('neutral');
  });

  it('keeps playful encouragement when learner is stable and playful', () => {
    const plan = buildResponsePlan({
      learnerState: makeLearnerState({
        playful: true,
      }),
    });

    expect(plan.teachingMode).toBe('encourage');
    expect(plan.tone).toBe('playful');
    expect(plan.shouldUseHumor).toBe(true);
    expect(plan.shouldBeBrief).toBe(false);
    expect(plan.correctionStyle).toBe('gentle');
    expect(plan.difficultyDirection).toBe('hold');
    expect(plan.reason).toBe('stable_playful');
  });

  it('softens playful correction when tone softening is requested', () => {
    const plan = buildResponsePlan({
      learnerState: makeLearnerState({
        toneSofteningRequested: true,
      }),
      isCorrectiveTurn: true,
      repeatedMistake: true,
    });

    expect(plan.teachingMode).toBe('correct');
    expect(plan.tone).toBe('warm');
    expect(plan.correctionStyle).toBe('gentle');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.difficultyDirection).toBe('down');
    expect(plan.reason).toBe('repeated_mistake');
  });

  it('uses explanation mode when explicitly requested', () => {
    const plan = buildResponsePlan({
      learnerState: makeLearnerState(),
      wantsExplanation: true,
    });

    expect(plan.teachingMode).toBe('explain');
    expect(plan.tone).toBe('warm');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.shouldBeBrief).toBe(false);
    expect(plan.correctionStyle).toBe('gentle');
    expect(plan.difficultyDirection).toBe('hold');
    expect(plan.reason).toBe('explanation_requested');
  });

  it('uses gentle correction for a normal corrective turn', () => {
    const plan = buildResponsePlan({
      learnerState: makeLearnerState(),
      isCorrectiveTurn: true,
    });

    expect(plan.teachingMode).toBe('correct');
    expect(plan.tone).toBe('warm');
    expect(plan.correctionStyle).toBe('gentle');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.shouldBeBrief).toBe(false);
    expect(plan.difficultyDirection).toBe('hold');
    expect(plan.reason).toBe('correction');
  });
});
