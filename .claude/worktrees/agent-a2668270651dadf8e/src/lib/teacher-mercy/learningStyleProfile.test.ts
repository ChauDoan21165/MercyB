import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearLearningStyleProfile,
  createEmptyLearningStyleProfile,
  getLearningStyleSignals,
  loadLearningStyleProfile,
  saveLearningStyleProfile,
  updateLearningStyleProfile,
} from './learningStyleProfile';

describe('learningStyleProfile', () => {
  const userId = 'learning-style-test-user';

  beforeEach(() => {
    clearLearningStyleProfile(userId);
    vi.restoreAllMocks();
  });

  it('creates an empty learning style profile', () => {
    const profile = createEmptyLearningStyleProfile(userId);

    expect(profile.userId).toBe(userId);
    expect(profile.explanationAffinity).toBe(0);
    expect(profile.challengeAffinity).toBe(0);
    expect(profile.reassuranceNeed).toBe(0);
    expect(profile.drillResponsiveness).toBe(0);
    expect(profile.brevityPreference).toBe(0);
    expect(profile.examplePreference).toBe(0);
    expect(typeof profile.lastUpdatedAt).toBe('number');
  });

  it('loads an empty profile when nothing is stored', () => {
    const profile = loadLearningStyleProfile(userId);

    expect(profile.userId).toBe(userId);
    expect(profile.explanationAffinity).toBe(0);
    expect(profile.challengeAffinity).toBe(0);
    expect(profile.reassuranceNeed).toBe(0);
    expect(profile.drillResponsiveness).toBe(0);
  });

  it('saves and reloads a profile', () => {
    const profile = createEmptyLearningStyleProfile(userId);
    profile.explanationAffinity = 2;
    profile.challengeAffinity = 1;
    profile.reassuranceNeed = 3;

    saveLearningStyleProfile(profile);

    const loaded = loadLearningStyleProfile(userId);

    expect(loaded.userId).toBe(userId);
    expect(loaded.explanationAffinity).toBe(2);
    expect(loaded.challengeAffinity).toBe(1);
    expect(loaded.reassuranceNeed).toBe(3);
  });

  it('increases explanation affinity when explanation is requested', () => {
    const updated = updateLearningStyleProfile({
      userId,
      wantsExplanation: true,
    });

    expect(updated.explanationAffinity).toBe(1);
    expect(updated.challengeAffinity).toBe(0);
    expect(updated.reassuranceNeed).toBe(0);
  });

  it('increases challenge affinity when challenge is requested', () => {
    const updated = updateLearningStyleProfile({
      userId,
      wantsChallenge: true,
    });

    expect(updated.challengeAffinity).toBe(1);
  });

  it('increases drill responsiveness when drill is requested', () => {
    const updated = updateLearningStyleProfile({
      userId,
      wantsDrill: true,
    });

    expect(updated.drillResponsiveness).toBe(1);
  });

  it('increases reassurance need when learner is confused', () => {
    const updated = updateLearningStyleProfile({
      userId,
      confused: true,
    });

    expect(updated.reassuranceNeed).toBe(1);
  });

  it('increases reassurance need more when learner is frustrated', () => {
    const updated = updateLearningStyleProfile({
      userId,
      frustrated: true,
    });

    expect(updated.reassuranceNeed).toBe(2);
  });

  it('gives extra challenge affinity when learner is correct during challenge', () => {
    const updated = updateLearningStyleProfile({
      userId,
      wantsChallenge: true,
      correct: true,
    });

    expect(updated.challengeAffinity).toBe(2);
  });

  it('combines multiple observations in one update', () => {
    const updated = updateLearningStyleProfile({
      userId,
      wantsExplanation: true,
      wantsDrill: true,
      confused: true,
      frustrated: true,
    });

    expect(updated.explanationAffinity).toBe(1);
    expect(updated.drillResponsiveness).toBe(1);
    expect(updated.reassuranceNeed).toBe(3);
  });

  it('accumulates updates over time', () => {
    updateLearningStyleProfile({
      userId,
      wantsExplanation: true,
    });

    const updated = updateLearningStyleProfile({
      userId,
      wantsExplanation: true,
      wantsChallenge: true,
    });

    expect(updated.explanationAffinity).toBe(2);
    expect(updated.challengeAffinity).toBe(1);
  });

  it('clamps scores at the upper bound', () => {
    for (let i = 0; i < 20; i += 1) {
      updateLearningStyleProfile({
        userId,
        wantsExplanation: true,
        wantsChallenge: true,
        wantsDrill: true,
        frustrated: true,
      });
    }

    const loaded = loadLearningStyleProfile(userId);

    expect(loaded.explanationAffinity).toBe(10);
    expect(loaded.challengeAffinity).toBe(10);
    expect(loaded.drillResponsiveness).toBe(10);
    expect(loaded.reassuranceNeed).toBe(10);
  });

  it('returns no signals when values are below threshold', () => {
    const profile = createEmptyLearningStyleProfile(userId);
    profile.explanationAffinity = 3;
    profile.challengeAffinity = 3;
    profile.reassuranceNeed = 3;
    profile.drillResponsiveness = 3;
    profile.brevityPreference = 3;
    profile.examplePreference = 3;

    const signals = getLearningStyleSignals(profile);

    expect(signals).toEqual([]);
  });

  it('returns signals when values are above threshold', () => {
    const profile = createEmptyLearningStyleProfile(userId);
    profile.explanationAffinity = 4;
    profile.challengeAffinity = 5;
    profile.reassuranceNeed = 6;
    profile.drillResponsiveness = 7;
    profile.brevityPreference = 8;
    profile.examplePreference = 9;

    const signals = getLearningStyleSignals(profile);

    expect(signals).toContain('needs_explanation');
    expect(signals).toContain('likes_challenge');
    expect(signals).toContain('needs_reassurance');
    expect(signals).toContain('responds_to_drills');
    expect(signals).toContain('prefers_brief');
    expect(signals).toContain('prefers_examples');
  });

  it('clears a stored profile', () => {
    updateLearningStyleProfile({
      userId,
      wantsExplanation: true,
      wantsChallenge: true,
      frustrated: true,
    });

    clearLearningStyleProfile(userId);

    const loaded = loadLearningStyleProfile(userId);

    expect(loaded.explanationAffinity).toBe(0);
    expect(loaded.challengeAffinity).toBe(0);
    expect(loaded.reassuranceNeed).toBe(0);
    expect(loaded.drillResponsiveness).toBe(0);
  });

  it('updates lastUpdatedAt on each write', () => {
    const baseTime = 1_700_000_000_000;

    vi.spyOn(Date, 'now').mockImplementation(() => baseTime);
    const first = updateLearningStyleProfile({
      userId,
      wantsExplanation: true,
    });

    vi.spyOn(Date, 'now').mockImplementation(() => baseTime + 5000);
    const second = updateLearningStyleProfile({
      userId,
      wantsChallenge: true,
    });

    expect(first.lastUpdatedAt).toBe(baseTime);
    expect(second.lastUpdatedAt).toBe(baseTime + 5000);
  });
});