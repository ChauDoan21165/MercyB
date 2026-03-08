import { describe, expect, it } from 'vitest';
import { buildResponsePlan } from '../responsePlanner';

describe('buildResponsePlan', () => {
  it('uses warm, non-humorous support for confused learners', () => {
    const plan = buildResponsePlan({
      learnerState: {
        clarity: 'lost',
      } as any,
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
      learnerState: {
        emotion: 'frustrated',
      } as any,
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
      learnerState: {
        needsConceptReview: true,
      } as any,
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
      learnerState: {} as any,
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
      learnerState: {} as any,
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
      learnerState: {} as any,
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
      learnerState: {
        momentum: 'flowing',
        confidence: 'high',
      } as any,
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
      learnerState: {} as any,
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
      learnerState: {
        directnessRequired: true,
      } as any,
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
      learnerState: {
        playful: true,
      } as any,
      suppressHumor: true,
    });

    expect(plan.teachingMode).toBe('encourage');
    expect(plan.tone).toBe('playful');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.shouldBeBrief).toBe(false);
  });

  it('suppresses humor for playful learners who are also confused', () => {
    const plan = buildResponsePlan({
      learnerState: {
        playful: true,
        clarity: 'lost',
      } as any,
    });

    expect(plan.teachingMode).toBe('correct');
    expect(plan.tone).toBe('warm');
    expect(plan.shouldUseHumor).toBe(false);
    expect(plan.reason).toBe('confused');
  });

  it('softens explanation mode for low-confidence learners', () => {
    const plan = buildResponsePlan({
      learnerState: {
        confidence: 'low',
      } as any,
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
      learnerState: {} as any,
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
      learnerState: {
        playful: true,
      } as any,
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
      learnerState: {
        toneSofteningRequested: true,
      } as any,
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
      learnerState: {} as any,
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
      learnerState: {} as any,
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