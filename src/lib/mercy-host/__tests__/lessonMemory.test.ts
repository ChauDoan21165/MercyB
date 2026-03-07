import { describe, expect, it, beforeEach } from 'vitest';
import {
  loadLessonMemory,
  updateLessonMemory,
  isRepeatedMistake,
  shouldReviewConcept,
} from '../lessonMemory';

const TEST_USER = 'test-user';

function resetMemory() {
  // reset by writing empty events
  updateLessonMemory(
    {
      correct: true,
      mistake: undefined,
      concept: undefined,
    },
    TEST_USER
  );
}

describe('lessonMemory', () => {
  beforeEach(() => {
    resetMemory();
  });

  it('loads default memory state', () => {
    const memory = loadLessonMemory(TEST_USER);

    expect(memory).toBeDefined();
    expect(Array.isArray(memory.recentMistakes)).toBe(true);
    expect(Array.isArray(memory.recentConcepts)).toBe(true);
  });

  it('records mistakes and detects repeated mistakes', () => {
    const mistake = 'goed';

    updateLessonMemory(
      {
        correct: false,
        mistake,
        concept: 'past tense',
      },
      TEST_USER
    );

    updateLessonMemory(
      {
        correct: false,
        mistake,
        concept: 'past tense',
      },
      TEST_USER
    );

    expect(isRepeatedMistake(mistake, TEST_USER)).toBe(true);
  });

  it('does not mark a single mistake as repeated', () => {
    const mistake = 'goed';

    updateLessonMemory(
      {
        correct: false,
        mistake,
        concept: 'past tense',
      },
      TEST_USER
    );

    expect(isRepeatedMistake(mistake, TEST_USER)).toBe(false);
  });

  it('records concept review triggers', () => {
    const concept = 'past tense';

    updateLessonMemory(
      {
        correct: false,
        mistake: 'goed',
        concept,
      },
      TEST_USER
    );

    updateLessonMemory(
      {
        correct: false,
        mistake: 'goed',
        concept,
      },
      TEST_USER
    );

    expect(shouldReviewConcept(concept, TEST_USER)).toBe(true);
  });

  it('does not trigger review for new concepts', () => {
    const concept = 'future tense';

    updateLessonMemory(
      {
        correct: true,
        mistake: undefined,
        concept,
      },
      TEST_USER
    );

    expect(shouldReviewConcept(concept, TEST_USER)).toBe(false);
  });

  it('updates memory correctly after a successful answer', () => {
    updateLessonMemory(
      {
        correct: true,
        mistake: undefined,
        concept: 'plural nouns',
      },
      TEST_USER
    );

    const memory = loadLessonMemory(TEST_USER);

    expect(memory.recentConcepts.includes('plural nouns')).toBe(true);
  });

  it('handles multiple different mistakes independently', () => {
    updateLessonMemory(
      {
        correct: false,
        mistake: 'goed',
        concept: 'past tense',
      },
      TEST_USER
    );

    updateLessonMemory(
      {
        correct: false,
        mistake: 'eated',
        concept: 'past tense',
      },
      TEST_USER
    );

    expect(isRepeatedMistake('goed', TEST_USER)).toBe(false);
    expect(isRepeatedMistake('eated', TEST_USER)).toBe(false);
  });

  it('detects repeated mistake after three occurrences', () => {
    const mistake = 'eated';

    for (let i = 0; i < 3; i++) {
      updateLessonMemory(
        {
          correct: false,
          mistake,
          concept: 'past tense',
        },
        TEST_USER
      );
    }

    expect(isRepeatedMistake(mistake, TEST_USER)).toBe(true);
  });

  it('tracks multiple concepts without overwriting history', () => {
    updateLessonMemory(
      {
        correct: true,
        concept: 'plural nouns',
      },
      TEST_USER
    );

    updateLessonMemory(
      {
        correct: true,
        concept: 'present continuous',
      },
      TEST_USER
    );

    const memory = loadLessonMemory(TEST_USER);

    expect(memory.recentConcepts.includes('plural nouns')).toBe(true);
    expect(memory.recentConcepts.includes('present continuous')).toBe(true);
  });

  it('handles empty mistake input safely', () => {
    expect(() =>
      updateLessonMemory(
        {
          correct: false,
          mistake: undefined,
        },
        TEST_USER
      )
    ).not.toThrow();
  });

  it('handles unknown concept queries safely', () => {
    expect(shouldReviewConcept('nonexistent concept', TEST_USER)).toBe(false);
  });
});