/**
 * Mercy Learning Style Profile
 *
 * Purpose
 * -------
 * Track how a learner tends to learn best over time.
 *
 * This does NOT try to guess personality types.
 * Instead it measures teaching signals such as:
 *
 * - explanation responsiveness
 * - drill effectiveness
 * - challenge engagement
 * - reassurance need
 * - brevity preference
 *
 * Mercy can later use this to:
 * - choose explanation depth
 * - adjust correction softness
 * - increase or decrease challenge
 * - favor examples vs drills
 */

export type LearningStyleSignal =
  | 'needs_explanation'
  | 'likes_challenge'
  | 'needs_reassurance'
  | 'responds_to_drills'
  | 'prefers_brief'
  | 'prefers_examples';

export interface LearningStyleProfile {
  userId: string;

  explanationAffinity: number;
  challengeAffinity: number;
  reassuranceNeed: number;
  drillResponsiveness: number;
  brevityPreference: number;
  examplePreference: number;

  lastUpdatedAt: number;
}

export interface LearningObservationInput {
  userId?: string | null;

  wantsExplanation?: boolean;
  wantsChallenge?: boolean;
  wantsDrill?: boolean;

  confused?: boolean;
  frustrated?: boolean;

  correct?: boolean;
}

const STORE_PREFIX = 'mercy_learning_style_';

const memoryFallback = new Map<string, LearningStyleProfile>();

function now(): number {
  return Date.now();
}

function clamp(v: number): number {
  return Math.max(-10, Math.min(10, v));
}

function storageAvailable(): boolean {
  try {
    return typeof localStorage !== 'undefined';
  } catch {
    return false;
  }
}

function key(userId?: string | null): string {
  return STORE_PREFIX + (userId || 'default');
}

export function createEmptyLearningStyleProfile(
  userId?: string | null
): LearningStyleProfile {
  return {
    userId: userId || 'default',
    explanationAffinity: 0,
    challengeAffinity: 0,
    reassuranceNeed: 0,
    drillResponsiveness: 0,
    brevityPreference: 0,
    examplePreference: 0,
    lastUpdatedAt: now(),
  };
}

export function loadLearningStyleProfile(
  userId?: string | null
): LearningStyleProfile {
  const k = key(userId);

  if (storageAvailable()) {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) return createEmptyLearningStyleProfile(userId);
      return JSON.parse(raw);
    } catch {
      return createEmptyLearningStyleProfile(userId);
    }
  }

  return memoryFallback.get(k) || createEmptyLearningStyleProfile(userId);
}

export function saveLearningStyleProfile(profile: LearningStyleProfile): void {
  const k = key(profile.userId);

  if (storageAvailable()) {
    try {
      localStorage.setItem(k, JSON.stringify(profile));
      return;
    } catch {
      /* fallback */
    }
  }

  memoryFallback.set(k, profile);
}

export function updateLearningStyleProfile(
  input: LearningObservationInput
): LearningStyleProfile {
  const profile = loadLearningStyleProfile(input.userId);

  if (input.wantsExplanation) profile.explanationAffinity++;
  if (input.wantsChallenge) profile.challengeAffinity++;
  if (input.wantsDrill) profile.drillResponsiveness++;

  if (input.confused) profile.reassuranceNeed++;
  if (input.frustrated) profile.reassuranceNeed += 2;

  if (input.correct && input.wantsChallenge) profile.challengeAffinity++;

  profile.explanationAffinity = clamp(profile.explanationAffinity);
  profile.challengeAffinity = clamp(profile.challengeAffinity);
  profile.reassuranceNeed = clamp(profile.reassuranceNeed);
  profile.drillResponsiveness = clamp(profile.drillResponsiveness);
  profile.brevityPreference = clamp(profile.brevityPreference);
  profile.examplePreference = clamp(profile.examplePreference);

  profile.lastUpdatedAt = now();

  saveLearningStyleProfile(profile);

  return profile;
}

export function getLearningStyleSignals(
  profile: LearningStyleProfile
): LearningStyleSignal[] {
  const signals: LearningStyleSignal[] = [];

  if (profile.explanationAffinity > 3) signals.push('needs_explanation');
  if (profile.challengeAffinity > 3) signals.push('likes_challenge');
  if (profile.reassuranceNeed > 3) signals.push('needs_reassurance');
  if (profile.drillResponsiveness > 3) signals.push('responds_to_drills');
  if (profile.brevityPreference > 3) signals.push('prefers_brief');
  if (profile.examplePreference > 3) signals.push('prefers_examples');

  return signals;
}

export function clearLearningStyleProfile(userId?: string | null): void {
  const k = key(userId);

  if (storageAvailable()) {
    try {
      localStorage.removeItem(k);
    } catch {
      /* ignore */
    }
  }

  memoryFallback.delete(k);
}