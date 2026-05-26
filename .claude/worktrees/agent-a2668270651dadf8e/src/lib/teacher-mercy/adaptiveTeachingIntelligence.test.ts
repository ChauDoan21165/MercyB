/**
 * VERSION: adaptiveTeachingIntelligence.test.ts v2
 *
 * Tests for adaptiveTeachingIntelligence.
 *
 * Purpose:
 * - verify adaptive teaching biases respond correctly to learner state + emotion
 * - avoid loose `as any` casts
 * - protect momentum / overload / correction behavior from regressions
 */

import { describe, expect, it } from 'vitest';
import { adaptiveTeachingIntelligence } from './adaptiveTeachingIntelligence';
import type { LearnerState } from './learnerState';
import type { TeacherEmotionState } from './teacherEmotionModel';

function makeLearnerState(
  overrides: Partial<LearnerState> = {}
): LearnerState {
  return {
    clarity: 'shaky',
    affect: 'neutral',
    confidence: 'medium',
    momentum: 'steady',
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

describe('adaptiveTeachingIntelligence', () => {
  it('raises explanation and recap bias under high cognitive load', () => {
    const result = adaptiveTeachingIntelligence({
      learnerState: makeLearnerState({
        clarity: 'lost',
        affect: 'frustrated',
        confidence: 'low',
        momentum: 'stuck',
      }),
      emotion: makeEmotion({
        primarySignal: 'overwhelmed',
        humorAllowance: 0.1,
        warmthLevel: 0.85,
        paceAdjustment: 'slow',
        cognitiveLoadLevel: 'high',
        momentumProtection: true,
        correctionSoftnessBias: 0.7,
        encouragementBias: 0.75,
        challengeReadiness: 0.2,
      }),
      wantsExplanation: true,
    });

    expect(result.explanationDepthBias).toBeGreaterThan(0.7);
    expect(result.recapBias).toBeGreaterThan(0.6);
    expect(result.challengePaceBias).toBeLessThan(0.4);
    expect(result.preferredTone).toBe('warm');
    expect(result.shouldStayBrief).toBe(true);
    expect(result.shouldAcknowledgeEffort).toBe(true);
    expect(result.rationale).toContain('high_cognitive_load');
    expect(result.rationale).toContain('clarity_lost');
    expect(result.rationale).toContain('overwhelm_signal');
  });

  it('raises drill bias when drill is explicitly requested', () => {
    const result = adaptiveTeachingIntelligence({
      learnerState: makeLearnerState({
        clarity: 'clear',
        affect: 'neutral',
        confidence: 'medium',
        momentum: 'steady',
      }),
      emotion: makeEmotion(),
      wantsDrill: true,
    });

    expect(result.drillBias).toBeGreaterThan(0.7);
    expect(result.preferredTeachingMode).toBe('drill');
    expect(result.explanationDepthBias).toBeLessThan(0.5);
    expect(result.rationale).toContain('drill_requested');
  });

  it('protects momentum for curious or proud learners', () => {
    const result = adaptiveTeachingIntelligence({
      learnerState: makeLearnerState({
        clarity: 'clear',
        affect: 'playful',
        confidence: 'high',
        momentum: 'flowing',
      }),
      emotion: makeEmotion({
        primarySignal: 'curious',
        humorAllowance: 0.7,
        warmthLevel: 0.6,
        paceAdjustment: 'fast',
        cognitiveLoadLevel: 'low',
        momentumProtection: true,
        correctionSoftnessBias: 0.45,
        encouragementBias: 0.55,
        challengeReadiness: 0.85,
      }),
      wantsChallenge: true,
      difficultyDirection: 'hold',
    });

    expect(result.challengePaceBias).toBeGreaterThan(0.7);
    expect(result.shouldProtectMomentum).toBe(true);
    expect(result.preferredDifficultyDirection).toBe('up');
    expect(result.rationale).toContain('challenge_or_momentum');
    expect(result.rationale).toContain('momentum_protection');
    expect(result.rationale).toContain('positive_momentum_signal');
  });

  it('softens correction for discouraged or embarrassed states', () => {
    const result = adaptiveTeachingIntelligence({
      learnerState: makeLearnerState({
        clarity: 'clear',
        affect: 'neutral',
        confidence: 'low',
        momentum: 'stuck',
      }),
      emotion: makeEmotion({
        primarySignal: 'discouraged',
        humorAllowance: 0.2,
        warmthLevel: 0.8,
        paceAdjustment: 'slow',
        cognitiveLoadLevel: 'moderate',
        momentumProtection: true,
        correctionSoftnessBias: 0.65,
        encouragementBias: 0.8,
        challengeReadiness: 0.25,
      }),
      isCorrectiveTurn: true,
    });

    expect(result.correctionSoftnessBias).toBeGreaterThan(0.75);
    expect(result.preferredCorrectionStyle).toBe('gentle');
    expect(result.shouldAcknowledgeEffort).toBe(true);
    expect(result.preferredTone).toBe('warm');
    expect(result.rationale).toContain('discouragement_or_embarrassment');
    expect(result.rationale).toContain('corrective_turn');
  });

  it('respects directness when required', () => {
    const result = adaptiveTeachingIntelligence({
      learnerState: makeLearnerState({
        clarity: 'clear',
        affect: 'neutral',
        confidence: 'medium',
        momentum: 'stuck',
      }),
      emotion: makeEmotion({
        primarySignal: 'neutral',
        correctionSoftnessBias: 0.55,
      }),
      isCorrectiveTurn: true,
      requireDirectness: true,
    });

    expect(result.preferredCorrectionStyle).toBe('direct');
    expect(result.rationale).toContain('directness_required');
  });

  it('prefers recap when recap is requested', () => {
    const result = adaptiveTeachingIntelligence({
      learnerState: makeLearnerState({
        clarity: 'clear',
        confidence: 'medium',
        momentum: 'flowing',
      }),
      emotion: makeEmotion({
        primarySignal: 'neutral',
        momentumProtection: true,
      }),
      wantsRecap: true,
    });

    expect(result.preferredTeachingMode).toBe('recap');
    expect(result.preferredDifficultyDirection).toBe('hold');
    expect(result.recapBias).toBeGreaterThan(result.drillBias);
    expect(result.rationale).toContain('recap_requested');
  });

  it('pushes review mode when concept review is needed', () => {
    const result = adaptiveTeachingIntelligence({
      learnerState: makeLearnerState({
        clarity: 'shaky',
        confidence: 'medium',
      }),
      emotion: makeEmotion(),
      shouldReviewConcept: true,
    });

    expect(result.preferredTeachingMode).toBe('review');
    expect(result.preferredDifficultyDirection).toBe('down');
    expect(result.recapBias).toBeGreaterThan(0.6);
    expect(result.rationale).toContain('concept_review_needed');
  });

  it('keeps challenge pace down for repeated mistakes', () => {
    const result = adaptiveTeachingIntelligence({
      learnerState: makeLearnerState({
        clarity: 'clear',
        confidence: 'low',
        momentum: 'stuck',
      }),
      emotion: makeEmotion({
        primarySignal: 'discouraged',
        momentumProtection: true,
        correctionSoftnessBias: 0.6,
      }),
      repeatedMistake: true,
      isCorrectiveTurn: true,
    });

    expect(result.challengePaceBias).toBeLessThan(0.4);
    expect(result.preferredDifficultyDirection).toBe('down');
    expect(result.shouldProtectMomentum).toBe(true);
    expect(result.shouldAcknowledgeEffort).toBe(true);
    expect(result.rationale).toContain('repeated_mistake');
  });

  it('clamps all numeric biases into 0..1', () => {
    const result = adaptiveTeachingIntelligence({
      learnerState: makeLearnerState({
        clarity: 'lost',
        affect: 'frustrated',
        confidence: 'low',
        momentum: 'stuck',
      }),
      emotion: makeEmotion({
        primarySignal: 'overwhelmed',
        cognitiveLoadLevel: 'high',
        correctionSoftnessBias: 0.95,
        momentumProtection: true,
      }),
      wantsExplanation: true,
      wantsRecap: true,
      repeatedMistake: true,
      shouldReviewConcept: true,
      isCorrectiveTurn: true,
    });

    expect(result.explanationDepthBias).toBeGreaterThanOrEqual(0);
    expect(result.explanationDepthBias).toBeLessThanOrEqual(1);

    expect(result.correctionSoftnessBias).toBeGreaterThanOrEqual(0);
    expect(result.correctionSoftnessBias).toBeLessThanOrEqual(1);

    expect(result.drillBias).toBeGreaterThanOrEqual(0);
    expect(result.drillBias).toBeLessThanOrEqual(1);

    expect(result.recapBias).toBeGreaterThanOrEqual(0);
    expect(result.recapBias).toBeLessThanOrEqual(1);

    expect(result.challengePaceBias).toBeGreaterThanOrEqual(0);
    expect(result.challengePaceBias).toBeLessThanOrEqual(1);
  });
});