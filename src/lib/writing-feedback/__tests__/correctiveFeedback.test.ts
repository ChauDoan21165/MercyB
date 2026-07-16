import { describe, expect, it } from 'vitest';

import {
  buildWrittenMetalinguisticFeedback,
  selectRepresentativeWrittenErrors,
  selectWrittenFeedbackFocus,
  type WrittenFeedbackCandidate,
} from '../correctiveFeedback';

describe('CF-013 selectWrittenFeedbackFocus', () => {
  const candidates: WrittenFeedbackCandidate[] = [
    {
      id: 'tense-1',
      family: 'tense',
      message: 'Use past tense for yesterday.',
      severity: 'high',
    },
    {
      id: 'article-1',
      family: 'articles',
      message: 'Use an article before a singular count noun.',
      severity: 'medium',
    },
    {
      id: 'punctuation-1',
      family: 'punctuation',
      message: 'Split the comma splice.',
      severity: 'low',
    },
  ];

  it('prioritizes the active written target family over unrelated errors', () => {
    const result = selectWrittenFeedbackFocus({
      candidates,
      activeTargetFamily: 'articles',
    });

    expect(result.reason).toBe('active_target_family');
    expect(result.primary?.id).toBe('article-1');
    expect(result.secondary.map((candidate) => candidate.id)).toEqual([
      'tense-1',
      'punctuation-1',
    ]);
  });

  it('falls back to highest severity when the active family is absent', () => {
    const result = selectWrittenFeedbackFocus({
      candidates,
      activeTargetFamily: 'plural',
    });

    expect(result.reason).toBe('highest_severity');
    expect(result.primary?.id).toBe('tense-1');
  });

  it('does not invent feedback for an empty candidate list', () => {
    expect(selectWrittenFeedbackFocus({ candidates: [], activeTargetFamily: 'articles' })).toEqual({
      primary: null,
      secondary: [],
      reason: 'none',
    });
  });
});

describe('CF-014 buildWrittenMetalinguisticFeedback', () => {
  it('adds a concise rule explanation for a repeated grammar class', () => {
    const result = buildWrittenMetalinguisticFeedback({
      family: 'articles',
      learnerSentence: 'Teacher gave homework.',
      correctedSentence: 'The teacher gave homework.',
      priorAttemptsWithSameFamily: 1,
    });

    expect(result.kind).toBe('metalinguistic_explanation');
    expect(result.ruleLabel).toMatch(/Article/);
    expect(result.explanation).toMatch(/singular count noun/);
    expect(result.correctedExample).toBe('The teacher gave homework.');
  });

  it('keeps a first occurrence as direct correction only', () => {
    const result = buildWrittenMetalinguisticFeedback({
      family: 'articles',
      learnerSentence: 'Teacher gave homework.',
      correctedSentence: 'The teacher gave homework.',
      priorAttemptsWithSameFamily: 0,
    });

    expect(result.kind).toBe('direct_correction');
    expect(result.ruleLabel).toBeNull();
    expect(result.explanation).toBeNull();
  });
});

describe('CF-018 selectRepresentativeWrittenErrors', () => {
  it('selects one representative instance for repeated written error families', () => {
    const result = selectRepresentativeWrittenErrors({
      errors: [
        {
          id: 'article-1',
          family: 'articles',
          message: 'Missing article before teacher.',
          span: 'teacher',
          correction: 'the teacher',
        },
        {
          id: 'article-2',
          family: 'articles',
          message: 'Missing article before school.',
          span: 'school',
          correction: 'the school',
        },
        {
          id: 'article-3',
          family: 'articles',
          message: 'Missing article before lesson.',
          span: 'lesson',
          correction: 'the lesson',
        },
      ],
    });

    expect(result.selected.map((error) => error.id)).toEqual(['article-1']);
    expect(result.suppressedCount).toBe(2);
    expect(result.patternCue).toMatch(/same pattern/);
  });

  it('keeps distinct families visible without a repeated-pattern cue', () => {
    const result = selectRepresentativeWrittenErrors({
      errors: [
        { id: 'article-1', family: 'articles', message: 'Missing article.' },
        { id: 'tense-1', family: 'tense', message: 'Wrong tense.' },
      ],
    });

    expect(result.selected.map((error) => error.id)).toEqual(['article-1', 'tense-1']);
    expect(result.suppressedCount).toBe(0);
    expect(result.patternCue).toBeNull();
  });
});
