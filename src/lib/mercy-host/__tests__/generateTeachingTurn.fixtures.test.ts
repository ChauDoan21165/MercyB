import { beforeEach, describe, expect, it } from 'vitest';
import { generateTeachingTurn, summarizeTeachingTurn } from '../mercyHost';

describe('generateTeachingTurn realistic conversation fixtures', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('handles a shy beginner with warmth and a clear next step', () => {
    const result = generateTeachingTurn({
      userId: 'fixture-shy-beginner',
      userName: 'Lina',
      language: 'en',
      learnerText: 'um i think maybe it is go to school yesterday?',
      correction: {
        mistake: 'go to school yesterday',
        fix: 'Say "went to school yesterday"',
      },
      concept: 'past tense',
      isCorrectiveTurn: true,
      currentDifficulty: 'easy',
      nextPrompt: 'Try one sentence with "went".',
    });

    expect(result.plan.teachingMode).toBe('correct');
    expect(result.tone.tone).toBe('calm');
    expect(result.tone.correctionStyle).toBe('gentle');
    expect(result.tone.shouldUseHumor).toBe(false);

    expect(result.text).toContain('went to school yesterday');
    expect(result.text).toContain('Try one sentence with "went".');

    const summary = summarizeTeachingTurn(result);
    expect(summary).toContain('mode=correct');
    expect(summary).toContain('repeat=false');
  });

  it('handles a frustrated learner by shifting into warm explanation mode', () => {
    const result = generateTeachingTurn({
      userId: 'fixture-frustrated',
      userName: 'Minh',
      language: 'en',
      learnerText: "I don't get it. Why is this so hard?",
      explanation: 'Use "went" because "go" changes in the past tense.',
      concept: 'past tense',
      wantsExplanation: true,
      currentDifficulty: 'medium',
      nextPrompt: 'Now say: I went home early.',
    });

    expect(result.plan.teachingMode).toBe('explain');
    expect(result.tone.tone).toBe('warm');
    expect(result.tone.shouldUseHumor).toBe(false);
    expect(result.tone.shouldBeBrief).toBe(false);
    expect(result.tone.notes).toContain('confusion_warmth');

    expect(result.text).toContain('went');
    expect(result.text).toContain('Now say: I went home early.');

    const summary = summarizeTeachingTurn(result);
    expect(summary).toContain('mode=explain');
    expect(summary).toContain('difficulty=down');
  });

  it('allows safe humor for a playful learner asking for challenge', () => {
    const result = generateTeachingTurn({
      userId: 'fixture-playful',
      userName: 'Jay',
      language: 'en',
      learnerText: 'haha okay boss, give me a harder one',
      wantsChallenge: true,
      concept: 'conditionals',
      currentDifficulty: 'medium',
      nextPrompt: 'Translate: If I had known, I would have called.',
    });

    expect(result.plan.teachingMode).toBe('challenge');
    expect(result.tone.tone).toBe('playful');
    expect(result.tone.shouldUseHumor).toBe(true);

    expect(result.text).toContain('Translate: If I had known, I would have called.');

    const summary = summarizeTeachingTurn(result);
    expect(summary).toContain('mode=challenge');
    expect(summary).toContain('reason=challenge_requested');
  });

  it('keeps an overconfident learner brief, direct, and advancing', () => {
    const result = generateTeachingTurn({
      userId: 'fixture-overconfident',
      language: 'en',
      learnerText: 'easy. next.',
      wantsChallenge: true,
      concept: 'reported speech',
      currentDifficulty: 'hard',
      nextPrompt: 'Rewrite: She said, "I am tired."',
      requireDirectness: true,
    });

    expect(result.plan.teachingMode).toBe('challenge');
    expect(result.tone.shouldBeBrief).toBe(true);
    expect(result.tone.shouldUseHumor).toBe(false);

    expect(result.text).toContain('Rewrite: She said, "I am tired."');

    const summary = summarizeTeachingTurn(result);
    expect(summary).toContain('mode=challenge');
  });

  it('supports a returning learner by turning weakness into review', () => {
    const userId = 'fixture-returning-gap';

    generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: 'I said goed',
      concept: 'past tense',
      correction: {
        mistake: 'goed',
        fix: 'Use "went"',
      },
      isCorrectiveTurn: true,
      currentDifficulty: 'medium',
    });

    generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: 'Oops, goed again',
      concept: 'past tense',
      correction: {
        mistake: 'goed',
        fix: 'Use "went"',
      },
      isCorrectiveTurn: true,
      currentDifficulty: 'medium',
    });

    generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: 'Still goed',
      concept: 'past tense',
      correction: {
        mistake: 'goed',
        fix: 'Use "went"',
      },
      isCorrectiveTurn: true,
      currentDifficulty: 'medium',
    });

    const result = generateTeachingTurn({
      userId,
      userName: 'An',
      language: 'en',
      learnerText: 'I am back. Can we try again?',
      concept: 'past tense',
      nextPrompt: 'Say one sentence about yesterday with "went".',
      currentDifficulty: 'medium',
    });

    expect(result.shouldReviewConcept).toBe(true);
    expect(result.plan.teachingMode).toBe('review');
    expect(result.tone.shouldBeBrief).toBe(false);

    expect(result.text).toContain('went');

    const summary = summarizeTeachingTurn(result);
    expect(summary).toContain('mode=review');
    expect(summary).toContain('review=true');
  });

  it('softens repeated correction for a discouraged learner', () => {
    const userId = 'fixture-discouraged-repeat';

    generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: 'goed',
      correction: {
        mistake: 'goed',
        fix: 'Use "went"',
      },
      isCorrectiveTurn: true,
      concept: 'past tense',
      currentDifficulty: 'medium',
    });

    generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: 'goed again',
      correction: {
        mistake: 'goed',
        fix: 'Use "went"',
      },
      isCorrectiveTurn: true,
      concept: 'past tense',
      currentDifficulty: 'medium',
    });

    const result = generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: 'I keep getting it wrong. This makes no sense.',
      correction: {
        mistake: 'goed',
        fix: 'Use "went"',
      },
      isCorrectiveTurn: true,
      concept: 'past tense',
      currentDifficulty: 'medium',
      nextPrompt: 'Try: I went there yesterday.',
    });

    expect(result.repeatedMistake).toBe(true);
    expect(result.tone.tone).toBe('warm');
    expect(result.tone.correctionStyle).toBe('gentle');
    expect(result.tone.notes).toContain('repeated_mistake_focus');

    expect(result.text).toContain('went');
    expect(result.text).toContain('Try: I went there yesterday.');

    const summary = summarizeTeachingTurn(result);
    expect(summary).toContain('repeat=true');
  });

  it('keeps recap mode calm, humor-free, and useful', () => {
    const result = generateTeachingTurn({
      userId: 'fixture-recap',
      language: 'en',
      learnerText: 'Can you recap that for me?',
      wantsRecap: true,
      concept: 'present perfect',
      summary: 'Use it for past actions connected to the present.',
      currentDifficulty: 'medium',
      nextPrompt: 'Now make one sentence with have + past participle.',
    });

    expect(result.plan.teachingMode).toBe('recap');
    expect(result.tone.tone).toBe('calm');
    expect(result.tone.shouldUseHumor).toBe(false);
    expect(result.tone.shouldBeBrief).toBe(false);

    expect(result.text).toContain('present');
    expect(result.text).toContain('have + past participle');

    const summary = summarizeTeachingTurn(result);
    expect(summary).toContain('mode=recap');
  });

  it('keeps pronunciation work clear and drill-like without fluff', () => {
    const result = generateTeachingTurn({
      userId: 'fixture-pronunciation',
      language: 'en',
      learnerText: 'Can we practice that sound again?',
      wantsDrill: true,
      concept: 'final t sound',
      currentDifficulty: 'easy',
      nextPrompt: 'Say: cat, hat, late.',
    });

    expect(result.plan.teachingMode).toBe('drill');
    expect(result.tone.shouldBeBrief).toBe(true);
    expect(result.tone.shouldUseHumor).toBe(false);

    expect(result.text).toContain('cat, hat, late');

    const summary = summarizeTeachingTurn(result);
    expect(summary).toContain('mode=drill');
  });
});