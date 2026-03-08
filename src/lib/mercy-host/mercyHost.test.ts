/**
 * VERSION: mercyHost.test.ts v1
 *
 * Host-level integration tests for Mercy.
 *
 * Purpose:
 * - verify generateTeachingTurn wires learner state, emotion, adaptive logic,
 *   planner, tone calibration, strategy selection, and dialogue building together
 * - protect the live host path from regressions
 */

import { beforeEach, describe, expect, it } from 'vitest';
import { generateTeachingTurn } from './mercyHost';
import {
  clearTeacherContinuity,
} from './teacherContinuity';
import {
  clearRepetitionGuardState,
} from './repetitionGuard';
import {
  clearLearningStyleProfile,
} from './learningStyleProfile';

describe('generateTeachingTurn', () => {
  const userId = 'mercy-host-test-user';

  beforeEach(() => {
    clearTeacherContinuity(userId);
    clearRepetitionGuardState(userId);
    clearLearningStyleProfile(userId);
  });

  it('handles confused learner with warm explanation and no humor', () => {
    const result = generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: "I don't get it. This is hard.",
      explanation: 'Start with the denominator first.',
      concept: 'fractions',
      nextPrompt: 'Try the denominator step again.',
    });

    expect(result.learnerState.clarity).toBe('lost');
    expect(result.plan.teachingMode).toBe('explain');
    expect(result.plan.tone).toBe('warm');
    expect(result.plan.shouldUseHumor).toBe(false);

    expect(result.emotion.primarySignal).toBe('overwhelmed');
    expect(result.emotion.cognitiveLoadLevel).toBe('high');
    expect(result.adaptive.preferredTone).toBe('warm');
    expect(result.adaptive.explanationDepthBias).toBeGreaterThan(0.7);

    expect(result.text.length).toBeGreaterThan(0);
    expect(result.textAlt.length).toBeGreaterThan(0);
  });

  it('handles repeated mistake with correction and lower difficulty', () => {
    const result = generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: 'So I can just add the top numbers?',
      correction: {
        mistake: 'add the top numbers directly',
        fix: 'match the denominators first',
      },
      concept: 'fractions',
      nextPrompt: 'Try one more with matching denominators.',
      repeatedMistake: true,
      isCorrectiveTurn: true,
    });

    expect(result.plan.teachingMode).toBe('correct');
    expect(result.plan.shouldUseHumor).toBe(false);
    expect(result.repeatedMistake).toBe(true);

    expect(result.emotion.momentumProtection).toBe(true);
    expect(result.adaptive.shouldAcknowledgeEffort).toBe(true);

    expect(
      result.plan.difficultyDirection === 'down' ||
        result.adaptive.preferredDifficultyDirection === 'down'
    ).toBe(true);

    expect(result.strategy.mode).toBe('correct');
    expect(result.text.length).toBeGreaterThan(0);
  });

  it('enters challenge mode when learner has momentum', () => {
    const result = generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: 'Got it. Give me a harder one.',
      concept: 'fractions',
      wantsChallenge: true,
      nextPrompt: 'Try a harder fraction problem.',
    });

    expect(result.plan.teachingMode).toBe('challenge');
    expect(result.plan.difficultyDirection).toBe('up');
    expect(['proud', 'curious']).toContain(result.emotion.primarySignal);
    expect(result.adaptive.preferredDifficultyDirection).toBe('up');
    expect(result.text.length).toBeGreaterThan(0);
  });

  it('holds difficulty during recap', () => {
    const result = generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: 'Can we summarize the rule?',
      concept: 'fractions',
      summary: 'Match denominators before adding numerators.',
      wantsRecap: true,
      nextPrompt: 'Say the rule back once.',
    });

    expect(result.plan.teachingMode).toBe('recap');
    expect(result.plan.difficultyDirection).toBe('hold');
    expect(result.adaptive.preferredTeachingMode).toBe('recap');
    expect(result.strategy.mode).toBe('recap');
  });

  it('uses specific praise in a recovery / success turn', () => {
    const result = generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: 'Oh, okay, that worked now.',
      concept: 'fractions',
      wantsChallenge: true,
      nextPrompt: 'Try the next harder one.',
    });

    expect(result.strategy.mode === 'encourage' || result.strategy.mode === 'challenge').toBe(true);

    const combined = [
      result.strategy.opening?.en || '',
      result.strategy.teaching?.en || '',
      result.strategy.nextStep?.en || '',
      result.text,
    ]
      .join(' ')
      .toLowerCase();

    expect(
      combined.includes('good') ||
        combined.includes('nice') ||
        combined.includes('cleaner') ||
        combined.includes('footing') ||
        combined.includes('correct')
    ).toBe(true);
  });

  it('suppresses humor in sensitive moments even if learner sounds playful', () => {
    const result = generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: "lol I'm confused and this makes no sense",
      explanation: 'Track one variable at a time.',
      concept: 'algebra',
      nextPrompt: 'Try the first step again.',
    });

    expect(result.learnerState.clarity).toBe('lost');
    expect(result.plan.shouldUseHumor).toBe(false);
    expect(result.tone.shouldUseHumor).toBe(false);
  });

  it('returns a complete result shape', () => {
    const result = generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: 'I think I get it.',
      concept: 'verb tense',
      explanation: 'Use past tense for completed actions.',
      nextPrompt: 'Make one more sentence in past tense.',
    });

    expect(result.text).toBeTruthy();
    expect(result.textAlt).toBeTruthy();

    expect(result.learnerState).toBeDefined();
    expect(result.emotion).toBeDefined();
    expect(result.adaptive).toBeDefined();
    expect(result.plan).toBeDefined();
    expect(result.tone).toBeDefined();
    expect(result.strategy).toBeDefined();
    expect(result.memory).toBeDefined();
    expect(result.curriculum).toBeDefined();
    expect(result.curriculumRecommendation).toBeDefined();
    expect(result.difficulty).toBeDefined();
    expect(result.guardSignals).toBeDefined();

    expect(typeof result.repeatedMistake).toBe('boolean');
    expect(typeof result.shouldReviewConcept).toBe('boolean');
  });
});