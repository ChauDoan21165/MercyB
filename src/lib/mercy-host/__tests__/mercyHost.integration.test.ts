import { beforeEach, describe, expect, it } from 'vitest';
import {
  generateEnglishFoundationReply,
  generateTeachingTurn,
  summarizeTeachingTurn,
} from '../mercyHost';

describe('mercyHost integration', () => {
  const USER_ID = 'integration-test-user';

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('switches into review mode when a concept has become weak', () => {
    for (let i = 0; i < 3; i += 1) {
      generateTeachingTurn({
        userId: USER_ID,
        language: 'en',
        learnerText: 'I keep missing this one',
        concept: 'past tense',
        correction: {
          mistake: 'goed',
          fix: 'Use "went"',
        },
        isCorrectiveTurn: true,
      });
    }

    const result = generateTeachingTurn({
      userId: USER_ID,
      language: 'en',
      learnerText: 'Can we try again?',
      concept: 'past tense',
      nextPrompt: 'Try one more sentence in the past tense.',
    });

    expect(result.shouldReviewConcept).toBe(true);
    expect(result.plan.teachingMode).toBe('review');
    expect(result.tone.notes).toContain('review_mode');
    expect(result.text.length).toBeGreaterThan(0);
  });

  it('detects repeated mistakes and lowers difficulty direction', () => {
    generateTeachingTurn({
      userId: USER_ID,
      language: 'en',
      learnerText: 'I said goed again',
      correction: {
        mistake: 'goed',
        fix: 'Use "went"',
      },
      isCorrectiveTurn: true,
      concept: 'past tense',
      currentDifficulty: 'medium',
    });

    generateTeachingTurn({
      userId: USER_ID,
      language: 'en',
      learnerText: 'Oops, goed again',
      correction: {
        mistake: 'goed',
        fix: 'Use "went"',
      },
      isCorrectiveTurn: true,
      concept: 'past tense',
      currentDifficulty: 'medium',
    });

    const result = generateTeachingTurn({
      userId: USER_ID,
      language: 'en',
      learnerText: 'I keep saying goed',
      correction: {
        mistake: 'goed',
        fix: 'Use "went"',
      },
      isCorrectiveTurn: true,
      concept: 'past tense',
      currentDifficulty: 'medium',
      nextPrompt: 'Say: I went to school yesterday.',
    });

    expect(result.repeatedMistake).toBe(true);
    expect(result.difficulty.direction).toBe('down');
    expect(result.tone.correctionStyle).toBe('contrastive');
  });

  it('allows humor for a stable playful learner but blocks it for a frustrated learner', () => {
    const playful = generateTeachingTurn({
      userId: `${USER_ID}-playful`,
      language: 'en',
      learnerText: 'haha give me a harder one',
      wantsChallenge: true,
      currentDifficulty: 'medium',
      nextPrompt: 'Translate: I would have gone if I had known.',
    });

    const frustrated = generateTeachingTurn({
      userId: `${USER_ID}-frustrated`,
      language: 'en',
      learnerText: "I don't get it. This is hard.",
      wantsExplanation: true,
      currentDifficulty: 'medium',
      explanation: 'Use "went" for the past tense of "go".',
      nextPrompt: 'Try the sentence again with went.',
    });

    expect(playful.tone.shouldUseHumor).toBe(true);
    expect(frustrated.tone.shouldUseHumor).toBe(false);
    expect(frustrated.tone.tone).toBe('warm');
    expect(frustrated.tone.notes).toContain('confusion_warmth');
  });

  it('includes the next step in the rendered reply when nextPrompt exists', () => {
    const result = generateTeachingTurn({
      userId: `${USER_ID}-next-step`,
      language: 'en',
      learnerText: 'Can you explain it?',
      wantsExplanation: true,
      explanation: 'Use "went" for the past tense of "go".',
      nextPrompt: 'Now write one sentence with went.',
      concept: 'past tense',
    });

    expect(result.plan.addNextStep).toBe(true);
    expect(result.text).toContain('Now write one sentence with went.');
  });

  it('updates curriculum and returns a curriculum recommendation after success and failure', () => {
    const failedTurn = generateTeachingTurn({
      userId: `${USER_ID}-curriculum`,
      language: 'en',
      learnerText: 'I wrote goed',
      concept: 'past tense',
      correction: {
        mistake: 'goed',
        fix: 'Use "went"',
      },
      isCorrectiveTurn: true,
      currentDifficulty: 'medium',
    });

    const successTurn = generateTeachingTurn({
      userId: `${USER_ID}-curriculum`,
      language: 'en',
      learnerText: 'I used went correctly',
      concept: 'past tense',
      currentDifficulty: 'medium',
    });

    expect(failedTurn.curriculum).toBeDefined();
    expect(successTurn.curriculum).toBeDefined();
    expect(failedTurn.curriculumRecommendation).toBeDefined();
    expect(successTurn.curriculumRecommendation).toBeDefined();
  });

  it('supports the English Foundation helper and returns a useful summary string', () => {
    const result = generateEnglishFoundationReply({
      userId: `${USER_ID}-ef`,
      userTier: 'vip2',
      language: 'en',
      learnerText: 'haha test me again',
      wantsChallenge: true,
      concept: 'conditionals',
      nextPrompt: 'Translate: If I had known, I would have called.',
      currentDifficulty: 'medium',
    });

    const summary = summarizeTeachingTurn(result);

    expect(result.text.length).toBeGreaterThan(0);
    expect(typeof summary).toBe('string');
    expect(summary).toContain('mode=');
    expect(summary).toContain('tone=');
    expect(summary).toContain('difficulty=');
  });
});