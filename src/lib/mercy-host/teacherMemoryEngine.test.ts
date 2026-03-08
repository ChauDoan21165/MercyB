/**
 * VERSION: teacherMemoryEngine.test.ts v1
 *
 * Tests for Teacher Memory Engine.
 *
 * Purpose:
 * - verify Mercy can track recent concept / mistake / success memory
 * - protect progress-reference behavior from regressions
 * - ensure storage fallback helpers behave safely
 */

import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearTeacherMemory,
  createEmptyTeacherMemoryState,
  getTeacherMemoryInsight,
  loadTeacherMemory,
  updateTeacherMemory,
} from './teacherMemoryEngine';

describe('teacherMemoryEngine', () => {
  const userId = 'teacher-memory-test-user';

  beforeEach(() => {
    clearTeacherMemory(userId);
  });

  it('creates an empty teacher memory state', () => {
    const state = createEmptyTeacherMemoryState(userId);

    expect(state.userId).toBe(userId);
    expect(state.recentTurns).toEqual([]);
    expect(typeof state.lastUpdatedAt).toBe('number');
  });

  it('loads an empty state when nothing is stored', () => {
    const state = loadTeacherMemory(userId);

    expect(state.userId).toBe(userId);
    expect(state.recentTurns).toEqual([]);
  });

  it('stores a turn record after update', () => {
    const state = updateTeacherMemory({
      userId,
      concept: 'fractions',
      mistake: 'denominator mismatch',
      fix: 'match denominators first',
      teachingMode: 'correct',
      learnerText: 'I just added them directly',
      wasCorrectiveTurn: true,
      repeatedMistake: false,
      successfulTurn: false,
    });

    expect(state.userId).toBe(userId);
    expect(state.recentTurns).toHaveLength(1);
    expect(state.recentTurns[0]?.concept).toBe('fractions');
    expect(state.recentTurns[0]?.mistake).toBe('denominator mismatch');
    expect(state.recentTurns[0]?.fix).toBe('match denominators first');
    expect(state.recentTurns[0]?.teachingMode).toBe('correct');
    expect(state.recentTurns[0]?.wasCorrectiveTurn).toBe(true);
  });

  it('returns same-mistake insight when the mistake appeared before', () => {
    updateTeacherMemory({
      userId,
      concept: 'fractions',
      mistake: 'denominator mismatch',
      fix: 'match denominators first',
      teachingMode: 'correct',
      wasCorrectiveTurn: true,
      repeatedMistake: true,
      successfulTurn: false,
    });

    const insight = getTeacherMemoryInsight(userId, {
      concept: 'fractions',
      mistake: 'denominator mismatch',
      successfulTurn: false,
    });

    expect(insight.shouldReferencePriorMistake).toBe(true);
    expect(insight.priorMistake).toBe('denominator mismatch');
    expect(insight.rationale).toContain('same_mistake_seen_before');
  });

  it('acknowledges repair after a prior mistake on a successful turn', () => {
    updateTeacherMemory({
      userId,
      concept: 'fractions',
      mistake: 'denominator mismatch',
      fix: 'match denominators first',
      teachingMode: 'correct',
      wasCorrectiveTurn: true,
      repeatedMistake: true,
      successfulTurn: false,
    });

    const insight = getTeacherMemoryInsight(userId, {
      concept: 'fractions',
      mistake: 'denominator mismatch',
      successfulTurn: true,
    });

    expect(insight.shouldAcknowledgeRepair).toBe(true);
    expect(insight.shouldReferencePriorProgress).toBe(true);
    expect(insight.progressLine.toLowerCase()).toContain('earlier');
    expect(insight.rationale).toContain('repair_after_prior_mistake');
  });

  it('references progress on the same concept after success', () => {
    updateTeacherMemory({
      userId,
      concept: 'past tense',
      teachingMode: 'explain',
      learnerText: 'I think I understand',
      successfulTurn: false,
    });

    const insight = getTeacherMemoryInsight(userId, {
      concept: 'past tense',
      successfulTurn: true,
    });

    expect(insight.shouldReferencePriorProgress).toBe(true);
    expect(insight.priorConcept).toBe('past tense');
    expect(insight.progressLine.toLowerCase()).toContain('idea');
    expect(insight.rationale).toContain('progress_on_same_concept');
  });

  it('references progress after a corrective turn even without exact same mistake', () => {
    updateTeacherMemory({
      userId,
      concept: 'articles',
      teachingMode: 'correct',
      wasCorrectiveTurn: true,
      successfulTurn: false,
    });

    const insight = getTeacherMemoryInsight(userId, {
      concept: 'articles',
      successfulTurn: true,
    });

    expect(insight.shouldReferencePriorProgress).toBe(true);
    expect(insight.progressLine.toLowerCase()).toContain('cleaner');
    expect(insight.rationale).toContain('progress_after_correction');
  });

  it('tracks ongoing concept progress when there was a recent success', () => {
    updateTeacherMemory({
      userId,
      concept: 'pronunciation',
      teachingMode: 'drill',
      successfulTurn: true,
    });

    const insight = getTeacherMemoryInsight(userId, {
      concept: 'pronunciation',
      successfulTurn: false,
    });

    expect(insight.shouldReferencePriorProgress).toBe(true);
    expect(insight.progressLine.toLowerCase()).toContain('stabilizing');
    expect(insight.rationale).toContain('ongoing_concept_progress');
  });

  it('caps stored history to the most recent 10 turns', () => {
    for (let i = 0; i < 12; i += 1) {
      updateTeacherMemory({
        userId,
        concept: `concept-${i}`,
        teachingMode: 'explain',
        successfulTurn: i % 2 === 0,
      });
    }

    const state = loadTeacherMemory(userId);

    expect(state.recentTurns.length).toBe(10);
    expect(state.recentTurns[0]?.concept).toBe('concept-11');
    expect(state.recentTurns[9]?.concept).toBe('concept-2');
  });

  it('keeps insight empty when there is no relevant prior memory', () => {
    const insight = getTeacherMemoryInsight(userId, {
      concept: 'brand new topic',
      mistake: 'new mistake',
      successfulTurn: false,
    });

    expect(insight.shouldReferencePriorProgress).toBe(false);
    expect(insight.shouldReferencePriorMistake).toBe(false);
    expect(insight.shouldAcknowledgeRepair).toBe(false);
    expect(insight.progressLine).toBe('');
    expect(insight.rationale).toEqual([]);
  });

  it('matches concept and mistake case-insensitively', () => {
    updateTeacherMemory({
      userId,
      concept: 'Past Tense',
      mistake: 'Missing -ed',
      teachingMode: 'correct',
      wasCorrectiveTurn: true,
    });

    const insight = getTeacherMemoryInsight(userId, {
      concept: 'past tense',
      mistake: 'missing -ed',
      successfulTurn: false,
    });

    expect(insight.shouldReferencePriorMistake).toBe(true);
    expect(insight.priorConcept).toBe('Past Tense');
    expect(insight.priorMistake).toBe('Missing -ed');
  });
});