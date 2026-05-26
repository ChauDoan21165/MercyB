import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearTeacherContinuity,
  createEmptyTeacherContinuityState,
  getContinuityBridgeLine,
  getContinuityLeadLine,
  getLastTeacherTurn,
  getRecentTeacherTurns,
  getTeacherContinuitySuggestion,
  loadTeacherContinuity,
  updateTeacherContinuity,
} from './teacherContinuity';

describe('teacherContinuity', () => {
  const userId = 'teacher-continuity-test-user';

  beforeEach(() => {
    clearTeacherContinuity(userId);
    vi.restoreAllMocks();
  });

  it('creates an empty continuity state', () => {
    const state = createEmptyTeacherContinuityState(userId);

    expect(state.userId).toBe(userId);
    expect(state.recentTurns).toEqual([]);
    expect(state.lastTurn).toBeUndefined();
    expect(typeof state.lastUpdatedAt).toBe('number');
  });

  it('updates continuity with the latest teacher turn', () => {
    const state = updateTeacherContinuity(
      {
        mode: 'explain',
        tone: 'warm',
        concept: 'fractions',
        learnerText: 'I do not get denominators yet',
        usedHumor: false,
      },
      userId
    );

    expect(state.lastTurn).toBeDefined();
    expect(state.lastTurn?.mode).toBe('explain');
    expect(state.lastTurn?.move).toBe('explain');
    expect(state.lastTurn?.tone).toBe('warm');
    expect(state.lastTurn?.concept).toBe('fractions');
    expect(state.recentTurns).toHaveLength(1);
  });

  it('returns the last teacher turn after update', () => {
    updateTeacherContinuity(
      {
        mode: 'correct',
        tone: 'calm',
        concept: 'negative signs',
        mistake: 'dropped the minus sign',
      },
      userId
    );

    const lastTurn = getLastTeacherTurn(userId);

    expect(lastTurn).toBeDefined();
    expect(lastTurn?.mode).toBe('correct');
    expect(lastTurn?.move).toBe('correct');
    expect(lastTurn?.concept).toBe('negative signs');
    expect(lastTurn?.mistake).toBe('dropped the minus sign');
  });

  it('returns recent teacher turns in newest-first order', () => {
    updateTeacherContinuity(
      {
        mode: 'review',
        tone: 'warm',
        concept: 'equations',
      },
      userId
    );

    updateTeacherContinuity(
      {
        mode: 'drill',
        tone: 'firm',
        concept: 'equations',
      },
      userId
    );

    const recentTurns = getRecentTeacherTurns(userId);

    expect(recentTurns).toHaveLength(2);
    expect(recentTurns[0]?.mode).toBe('drill');
    expect(recentTurns[1]?.mode).toBe('review');
  });

  it('suggests strong continuity after correction on the same concept', () => {
    updateTeacherContinuity(
      {
        mode: 'correct',
        tone: 'warm',
        concept: 'fractions',
        mistake: 'common denominator',
      },
      userId
    );

    const suggestion = getTeacherContinuitySuggestion({
      userId,
      nextMode: 'correct',
      nextConcept: 'fractions',
      nextMistake: 'common denominator',
    });

    expect(suggestion.preferredLead).toBe('resume_correction');
    expect(suggestion.preferredBridge).toBe('one_more_try');
    expect(suggestion.shouldReferencePreviousTurn).toBe(true);
    expect(suggestion.shouldReduceRepetition).toBe(true);
    expect(suggestion.shouldStayWithConcept).toBe(true);
    expect(suggestion.continuityStrength).toBe('strong');
    expect(suggestion.reason).toBe('post_correction_retry');
  });

  it('suggests strong continuity after review on the same concept', () => {
    updateTeacherContinuity(
      {
        mode: 'review',
        tone: 'warm',
        concept: 'verb tense',
      },
      userId
    );

    const suggestion = getTeacherContinuitySuggestion({
      userId,
      nextMode: 'review',
      nextConcept: 'verb tense',
    });

    expect(suggestion.preferredLead).toBe('resume_review');
    expect(suggestion.preferredBridge).toBe('same_concept_retry');
    expect(suggestion.continuityStrength).toBe('strong');
    expect(suggestion.reason).toBe('post_review_retry');
  });

  it('suggests medium continuity after drill on the same concept', () => {
    updateTeacherContinuity(
      {
        mode: 'drill',
        tone: 'firm',
        concept: 'word order',
      },
      userId
    );

    const suggestion = getTeacherContinuitySuggestion({
      userId,
      nextMode: 'drill',
      nextConcept: 'word order',
    });

    expect(suggestion.preferredLead).toBe('resume_drill');
    expect(suggestion.preferredBridge).toBe('lock_it_in');
    expect(suggestion.continuityStrength).toBe('medium');
    expect(suggestion.reason).toBe('post_drill_retry');
  });

  it('suggests advance after encouragement into challenge', () => {
    updateTeacherContinuity(
      {
        mode: 'encourage',
        tone: 'warm',
        concept: 'linear equations',
      },
      userId
    );

    const suggestion = getTeacherContinuitySuggestion({
      userId,
      nextMode: 'challenge',
      nextConcept: 'linear equations',
    });

    expect(suggestion.preferredLead).toBe('advance');
    expect(suggestion.preferredBridge).toBe('step_forward');
    expect(suggestion.shouldReferencePreviousTurn).toBe(true);
    expect(suggestion.continuityStrength).toBe('medium');
    expect(suggestion.reason).toBe('post_success_advance');
  });

  it('suggests light same-concept continuity when topic matches but no stronger rule applies', () => {
    updateTeacherContinuity(
      {
        mode: 'explain',
        tone: 'calm',
        concept: 'subject pronouns',
      },
      userId
    );

    const suggestion = getTeacherContinuitySuggestion({
      userId,
      nextMode: 'encourage',
      nextConcept: 'subject pronouns',
    });

    expect(suggestion.preferredLead).toBe('steady_support');
    expect(suggestion.preferredBridge).toBe('same_concept_retry');
    expect(suggestion.shouldReferencePreviousTurn).toBe(true);
    expect(suggestion.shouldStayWithConcept).toBe(true);
    expect(suggestion.continuityStrength).toBe('light');
    expect(suggestion.reason).toBe('same_concept_followup');
  });

  it('falls back to generic continuity for different concepts', () => {
    updateTeacherContinuity(
      {
        mode: 'explain',
        tone: 'calm',
        concept: 'fractions',
      },
      userId
    );

    const suggestion = getTeacherContinuitySuggestion({
      userId,
      nextMode: 'encourage',
      nextConcept: 'probability',
    });

    expect(suggestion.preferredLead).toBe('steady_support');
    expect(suggestion.preferredBridge).toBe('step_forward');
    expect(suggestion.shouldReferencePreviousTurn).toBe(false);
    expect(suggestion.shouldStayWithConcept).toBe(false);
    expect(suggestion.continuityStrength).toBe('light');
    expect(suggestion.reason).toBe('generic_continuity');
  });

  it('returns no continuity when there is no prior turn', () => {
    const suggestion = getTeacherContinuitySuggestion({
      userId,
      nextMode: 'explain',
      nextConcept: 'fractions',
    });

    expect(suggestion.shouldReferencePreviousTurn).toBe(false);
    expect(suggestion.shouldReduceRepetition).toBe(false);
    expect(suggestion.shouldStayWithConcept).toBe(false);
    expect(suggestion.continuityStrength).toBe('none');
    expect(suggestion.reason).toBe('no_prior_turn');
  });

  it('returns stale_history when prior turn is too old', () => {
    const realNow = Date.now;
    const baseTime = 1_700_000_000_000;

    vi.spyOn(Date, 'now').mockImplementation(() => baseTime);
    updateTeacherContinuity(
      {
        mode: 'correct',
        tone: 'warm',
        concept: 'fractions',
      },
      userId
    );

    vi.spyOn(Date, 'now').mockImplementation(
      () => baseTime + 1000 * 60 * 21
    );

    const suggestion = getTeacherContinuitySuggestion({
      userId,
      nextMode: 'correct',
      nextConcept: 'fractions',
    });

    expect(suggestion.shouldReferencePreviousTurn).toBe(false);
    expect(suggestion.shouldReduceRepetition).toBe(true);
    expect(suggestion.shouldStayWithConcept).toBe(false);
    expect(suggestion.continuityStrength).toBe('none');
    expect(suggestion.reason).toBe('stale_history');

    Date.now = realNow;
  });

  it('caps recent turns to the maximum window', () => {
    const modes = ['encourage', 'explain', 'correct', 'review', 'drill', 'challenge', 'recap'] as const;

    for (const [index, mode] of modes.entries()) {
      updateTeacherContinuity(
        {
          mode,
          tone: 'warm',
          concept: `concept-${index}`,
        },
        userId
      );
    }

    const state = loadTeacherContinuity(userId);

    expect(state.recentTurns).toHaveLength(6);
    expect(state.lastTurn?.concept).toBe('concept-6');
    expect(state.recentTurns[0]?.concept).toBe('concept-6');
    expect(state.recentTurns[5]?.concept).toBe('concept-1');
  });

  it('provides lead lines for supported continuity leads', () => {
    const line = getContinuityLeadLine({
      preferredLead: 'resume_correction',
      preferredBridge: 'one_more_try',
      shouldReferencePreviousTurn: true,
      shouldReduceRepetition: true,
      shouldStayWithConcept: true,
      continuityStrength: 'strong',
      reason: 'post_correction_retry',
    });

    expect(line).toBeDefined();
    expect(line?.en).toMatch(/clean up|same point/i);
    expect(line?.vi).toBeTruthy();
  });

  it('provides bridge lines for supported continuity bridges', () => {
    const line = getContinuityBridgeLine({
      preferredLead: 'resume_drill',
      preferredBridge: 'lock_it_in',
      shouldReferencePreviousTurn: true,
      shouldReduceRepetition: true,
      shouldStayWithConcept: true,
      continuityStrength: 'medium',
      reason: 'post_drill_retry',
    });

    expect(line).toBeDefined();
    expect(line?.en).toMatch(/lock/i);
    expect(line?.vi).toBeTruthy();
  });

  it('returns undefined lead/bridge lines when no preferred value exists', () => {
    const lead = getContinuityLeadLine({
      shouldReferencePreviousTurn: false,
      shouldReduceRepetition: false,
      shouldStayWithConcept: false,
      continuityStrength: 'none',
      reason: 'no_prior_turn',
    });

    const bridge = getContinuityBridgeLine({
      shouldReferencePreviousTurn: false,
      shouldReduceRepetition: false,
      shouldStayWithConcept: false,
      continuityStrength: 'none',
      reason: 'no_prior_turn',
    });

    expect(lead).toBeUndefined();
    expect(bridge).toBeUndefined();
  });
});