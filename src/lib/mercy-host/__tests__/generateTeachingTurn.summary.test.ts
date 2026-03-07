import { beforeEach, describe, expect, it } from 'vitest';
import { generateTeachingTurn, summarizeTeachingTurn } from '../mercyHost';

function pickStableToneFields(result: ReturnType<typeof generateTeachingTurn>) {
  return {
    tone: result.tone.tone,
    shouldUseHumor: result.tone.shouldUseHumor,
    shouldBeBrief: result.tone.shouldBeBrief,
    correctionStyle: result.tone.correctionStyle,
    acknowledgeEffort: result.tone.acknowledgeEffort,
    addNextStep: result.tone.addNextStep,
    notes: result.tone.notes,
  };
}

function pickStablePlanFields(result: ReturnType<typeof generateTeachingTurn>) {
  return {
    teachingMode: result.plan.teachingMode,
    tone: result.plan.tone,
    correctionStyle: result.plan.correctionStyle,
    difficultyDirection: result.plan.difficultyDirection,
    reason: result.plan.reason,
    shouldUseHumor: result.plan.shouldUseHumor,
    shouldBeBrief: result.plan.shouldBeBrief,
    acknowledgeEffort: result.plan.acknowledgeEffort,
    addNextStep: result.plan.addNextStep,
  };
}

describe('generateTeachingTurn summary snapshots', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('summarizes a baseline encouragement turn', () => {
    const result = generateTeachingTurn({
      userId: 'summary-default',
      language: 'en',
      learnerText: 'okay let me try',
      concept: 'articles',
      currentDifficulty: 'medium',
      nextPrompt: 'Try one sentence with "the".',
    });

    expect(result.plan.teachingMode).toBe('encourage');
    expect(result.difficulty.direction).toBe('hold');
    expect(result.repeatedMistake).toBe(false);
    expect(result.shouldReviewConcept).toBe(false);

    const summary = summarizeTeachingTurn(result);
    expect(summary).toContain('mode=encourage');
    expect(summary).toContain('difficulty=hold');

    const tone = pickStableToneFields(result);
    expect(typeof tone.tone).toBe('string');
    expect(typeof tone.shouldUseHumor).toBe('boolean');
    expect(Array.isArray(tone.notes)).toBe(true);

    const plan = pickStablePlanFields(result);
    expect(plan.reason).toBe('encourage_default');
    expect(plan.addNextStep).toBe(true);
  });

  it('summarizes a confused explanation turn', () => {
    const result = generateTeachingTurn({
      userId: 'summary-confused',
      language: 'en',
      learnerText: "I don't get it. Why is this so hard?",
      wantsExplanation: true,
      explanation: 'Use "went" because "go" changes in the past tense.',
      concept: 'past tense',
      currentDifficulty: 'medium',
      nextPrompt: 'Now say: I went home early.',
    });

    expect(result.plan.teachingMode).toBe('explain');
    expect(result.difficulty.direction).toBe('down');
    expect(result.repeatedMistake).toBe(false);
    expect(result.shouldReviewConcept).toBe(false);

    const summary = summarizeTeachingTurn(result);
    expect(summary).toContain('mode=explain');
    expect(summary).toContain('difficulty=down');

    const tone = pickStableToneFields(result);
    expect(tone.tone).toBe('warm');
    expect(tone.shouldUseHumor).toBe(false);
    expect(tone.shouldBeBrief).toBe(false);
    expect(tone.notes).toContain('confusion_warmth');

    const plan = pickStablePlanFields(result);
    expect(['confused', 'frustrated', 'explanation_requested']).toContain(plan.reason);
  });

  it('summarizes a stable correction turn', () => {
    const result = generateTeachingTurn({
      userId: 'summary-correct',
      language: 'en',
      learnerText: 'maybe it is goed',
      correction: {
        mistake: 'goed',
        fix: 'Use "went"',
      },
      concept: 'past tense',
      isCorrectiveTurn: true,
      currentDifficulty: 'medium',
      nextPrompt: 'Try again with "went".',
    });

    expect(result.plan.teachingMode).toBe('correct');
    expect(result.repeatedMistake).toBe(false);

    const summary = summarizeTeachingTurn(result);
    expect(summary).toContain('mode=correct');
    expect(summary).toContain('repeat=false');

    const tone = pickStableToneFields(result);
    expect(['calm', 'warm']).toContain(tone.tone);
    expect(['gentle', 'direct']).toContain(tone.correctionStyle);

    const plan = pickStablePlanFields(result);
    expect(plan.reason).toBe('correction');
  });

  it('summarizes a repeated-mistake turn', () => {
    const userId = 'summary-repeat';

    generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: 'goed',
      correction: {
        mistake: 'goed',
        fix: 'Use "went"',
      },
      concept: 'past tense',
      isCorrectiveTurn: true,
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
      concept: 'past tense',
      isCorrectiveTurn: true,
      currentDifficulty: 'medium',
    });

    const result = generateTeachingTurn({
      userId,
      language: 'en',
      learnerText: 'still goed',
      correction: {
        mistake: 'goed',
        fix: 'Use "went"',
      },
      concept: 'past tense',
      isCorrectiveTurn: true,
      currentDifficulty: 'medium',
      nextPrompt: 'Try: I went there yesterday.',
    });

    expect(result.repeatedMistake).toBe(true);
    expect(result.shouldReviewConcept).toBe(true);
    expect(result.difficulty.direction).toBe('down');

    const summary = summarizeTeachingTurn(result);
    expect(summary).toContain('mode=review');
    expect(summary).toContain('repeat=true');
    expect(summary).toContain('review=true');
    expect(summary).toContain('difficulty=down');

    const tone = pickStableToneFields(result);
    expect(['contrastive', 'gentle']).toContain(tone.correctionStyle);
    expect(tone.notes).toContain('repeated_mistake_focus');
  });

  it('summarizes a challenge turn for a playful learner', () => {
    const result = generateTeachingTurn({
      userId: 'summary-challenge',
      language: 'en',
      learnerText: 'haha give me a harder one',
      wantsChallenge: true,
      concept: 'conditionals',
      currentDifficulty: 'medium',
      nextPrompt: 'Translate: If I had known, I would have called.',
    });

    expect(result.plan.teachingMode).toBe('challenge');
    expect(result.repeatedMistake).toBe(false);
    expect(result.shouldReviewConcept).toBe(false);

    const summary = summarizeTeachingTurn(result);
    expect(summary).toContain('mode=challenge');
    expect(summary).toContain('repeat=false');
    expect(summary).toContain('review=false');

    const tone = pickStableToneFields(result);
    expect(['playful', 'firm', 'calm']).toContain(tone.tone);
    expect(typeof tone.shouldUseHumor).toBe('boolean');

    const plan = pickStablePlanFields(result);
    expect(plan.reason).toBe('challenge_requested');
  });

  it('summarizes a recap turn', () => {
    const result = generateTeachingTurn({
      userId: 'summary-recap',
      language: 'en',
      learnerText: 'can you recap that for me',
      wantsRecap: true,
      concept: 'present perfect',
      summary: 'Use it for past actions connected to the present.',
      currentDifficulty: 'medium',
      nextPrompt: 'Now make one sentence with have + past participle.',
    });

    expect(result.plan.teachingMode).toBe('recap');
    expect(result.repeatedMistake).toBe(false);
    expect(result.shouldReviewConcept).toBe(false);

    const summary = summarizeTeachingTurn(result);
    expect(summary).toContain('mode=recap');

    const tone = pickStableToneFields(result);
    expect(tone.shouldBeBrief).toBe(false);
    expect(tone.shouldUseHumor).toBe(false);

    const plan = pickStablePlanFields(result);
    expect(plan.reason).toBe('recap_required');
  });

  it('summarizes a drill turn', () => {
    const result = generateTeachingTurn({
      userId: 'summary-drill',
      language: 'en',
      learnerText: 'can we practice that sound again',
      wantsDrill: true,
      concept: 'final t sound',
      currentDifficulty: 'easy',
      nextPrompt: 'Say: cat, hat, late.',
    });

    expect(result.plan.teachingMode).toBe('drill');
    expect(result.repeatedMistake).toBe(false);
    expect(result.shouldReviewConcept).toBe(false);

    const summary = summarizeTeachingTurn(result);
    expect(summary).toContain('mode=drill');

    const tone = pickStableToneFields(result);
    expect(tone.shouldBeBrief).toBe(true);
    expect(tone.shouldUseHumor).toBe(false);

    const plan = pickStablePlanFields(result);
    expect(['drill_required', 'encourage_default']).toContain(plan.reason);
  });

  it('summarizes a low-confidence drill turn with softened firmness', () => {
    const result = generateTeachingTurn({
      userId: 'summary-low-confidence-drill',
      language: 'en',
      learnerText: 'i am not sure. can we do one more?',
      wantsDrill: true,
      concept: 'final consonants',
      currentDifficulty: 'medium',
      nextPrompt: 'Say: bag, bed, big.',
      suppressHumor: true,
      softenTone: true,
      requireDirectness: true,
    });

    expect(result.plan.teachingMode).toBe('drill');
    expect(result.difficulty.direction).toBe('hold');
    expect(result.repeatedMistake).toBe(false);
    expect(result.shouldReviewConcept).toBe(false);

    const summary = summarizeTeachingTurn(result);
    expect(summary).toContain('mode=drill');
    expect(summary).toContain('difficulty=hold');

    const tone = pickStableToneFields(result);
    expect(['calm', 'warm']).toContain(tone.tone);
    expect(tone.shouldBeBrief).toBe(true);
    expect(tone.shouldUseHumor).toBe(false);
    expect(['direct', 'gentle']).toContain(tone.correctionStyle);
    expect(tone.notes.length).toBeGreaterThan(0);

    const plan = pickStablePlanFields(result);
    expect(plan.reason).toBe('drill_required');
  });
});