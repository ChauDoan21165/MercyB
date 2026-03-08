/**
 * Adaptive Teaching Intelligence
 *
 * Purpose:
 * - adapt Mercy's teaching behavior to how the learner actually learns
 * - combine learning style profile, emotion signals, and recent outcomes
 * - gently adjust explanation depth, challenge pacing, correction tone,
 *   recap frequency, and drill usage
 *
 * Design rules:
 * - never override core teaching safety rules
 * - adapt gradually (avoid large sudden shifts)
 * - prefer "nudging" planner decisions rather than replacing them
 * - remain deterministic and testable
 */

import type { DifficultyLevel } from './difficultyScaler';
import type { TeachingMode } from './teachingModes';
import type { TeacherEmotionResult } from './teacherEmotionModel';
import {
  loadLearningStyleProfile,
  updateLearningStyleProfile,
  type LearningStyleProfile,
} from './learningStyleProfile';

export interface AdaptiveTeachingInput {
  userId?: string | null;

  teachingMode: TeachingMode;
  currentDifficulty: DifficultyLevel;

  learnerText?: string;
  concept?: string;

  wasCorrect?: boolean;
  repeatedMistake?: boolean;

  wantsExplanation?: boolean;
  wantsDrill?: boolean;
  wantsChallenge?: boolean;

  emotion?: TeacherEmotionResult;
}

export interface AdaptiveTeachingAdjustment {
  explanationDepth: 'short' | 'medium' | 'deep';
  challengePace: 'slower' | 'steady' | 'faster';
  correctionStyleBias: 'gentle' | 'balanced' | 'direct';
  recapBias: 'low' | 'normal' | 'high';
  drillBias: 'low' | 'normal' | 'high';

  notes: string[];
  profile: LearningStyleProfile;
}

/* ------------------------------------------------------------------ */
/* helpers                                                            */
/* ------------------------------------------------------------------ */

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function normalize(text: string): string {
  return String(text ?? '').toLowerCase().trim();
}

function detectShortAnswer(text?: string): boolean {
  const t = normalize(text || '');
  if (!t) return false;

  const words = t.split(/\s+/);
  return words.length <= 2;
}

function detectLongQuestion(text?: string): boolean {
  const t = normalize(text || '');
  if (!t) return false;

  return t.length > 60 || t.includes('why') || t.includes('how');
}

/* ------------------------------------------------------------------ */
/* core                                                               */
/* ------------------------------------------------------------------ */

export function applyAdaptiveTeachingIntelligence(
  input: AdaptiveTeachingInput
): AdaptiveTeachingAdjustment {
  const profile = loadLearningStyleProfile(input.userId);

  const notes: string[] = [];

  let explanationDepth: 'short' | 'medium' | 'deep' = 'medium';
  let challengePace: 'slower' | 'steady' | 'faster' = 'steady';
  let correctionStyleBias: 'gentle' | 'balanced' | 'direct' = 'balanced';
  let recapBias: 'low' | 'normal' | 'high' = 'normal';
  let drillBias: 'low' | 'normal' | 'high' = 'normal';

  /* -------------------------------------------------------------- */
  /* explanation preference                                         */
  /* -------------------------------------------------------------- */

  if (input.wantsExplanation || detectLongQuestion(input.learnerText)) {
    explanationDepth = 'deep';
    profile.explanationPreference = clamp(profile.explanationPreference + 1, -5, 5);
    notes.push('learner_requested_explanation');
  }

  if (detectShortAnswer(input.learnerText) && !input.wantsExplanation) {
    explanationDepth = 'short';
    profile.explanationPreference = clamp(profile.explanationPreference - 1, -5, 5);
    notes.push('learner_prefers_short_steps');
  }

  if (profile.explanationPreference >= 3) explanationDepth = 'deep';
  if (profile.explanationPreference <= -3) explanationDepth = 'short';

  /* -------------------------------------------------------------- */
  /* challenge pacing                                               */
  /* -------------------------------------------------------------- */

  if (input.wasCorrect && input.wantsChallenge) {
    challengePace = 'faster';
    profile.challengePreference = clamp(profile.challengePreference + 1, -5, 5);
    notes.push('challenge_requested');
  }

  if (input.repeatedMistake) {
    challengePace = 'slower';
    profile.challengePreference = clamp(profile.challengePreference - 1, -5, 5);
    notes.push('slow_due_to_repetition');
  }

  if (profile.challengePreference >= 3) challengePace = 'faster';
  if (profile.challengePreference <= -3) challengePace = 'slower';

  /* -------------------------------------------------------------- */
  /* correction tone preference                                     */
  /* -------------------------------------------------------------- */

  if (input.emotion?.primary === 'embarrassed' || input.emotion?.primary === 'discouraged') {
    correctionStyleBias = 'gentle';
    profile.correctionSensitivity = clamp(profile.correctionSensitivity + 1, -5, 5);
    notes.push('soften_due_to_embarrassment');
  }

  if (input.emotion?.primary === 'proud' && input.wantsChallenge) {
    correctionStyleBias = 'direct';
    profile.correctionSensitivity = clamp(profile.correctionSensitivity - 1, -5, 5);
    notes.push('directness_ok');
  }

  if (profile.correctionSensitivity >= 3) correctionStyleBias = 'gentle';
  if (profile.correctionSensitivity <= -3) correctionStyleBias = 'direct';

  /* -------------------------------------------------------------- */
  /* recap tendency                                                 */
  /* -------------------------------------------------------------- */

  if (input.repeatedMistake) {
    recapBias = 'high';
    profile.recapPreference = clamp(profile.recapPreference + 1, -5, 5);
    notes.push('recap_needed');
  }

  if (input.wasCorrect && !input.repeatedMistake) {
    profile.recapPreference = clamp(profile.recapPreference - 1, -5, 5);
  }

  if (profile.recapPreference >= 3) recapBias = 'high';
  if (profile.recapPreference <= -3) recapBias = 'low';

  /* -------------------------------------------------------------- */
  /* drill preference                                               */
  /* -------------------------------------------------------------- */

  if (input.wantsDrill) {
    drillBias = 'high';
    profile.drillPreference = clamp(profile.drillPreference + 1, -5, 5);
    notes.push('drill_requested');
  }

  if (input.repeatedMistake && input.teachingMode === 'correct') {
    drillBias = 'high';
    profile.drillPreference = clamp(profile.drillPreference + 1, -5, 5);
  }

  if (profile.drillPreference >= 3) drillBias = 'high';
  if (profile.drillPreference <= -3) drillBias = 'low';

  /* -------------------------------------------------------------- */
  /* emotion modulation                                             */
  /* -------------------------------------------------------------- */

  if (input.emotion?.isSensitiveMoment) {
    challengePace = 'slower';
    correctionStyleBias = 'gentle';
    notes.push('emotion_sensitive_adjustment');
  }

  if (input.emotion?.primary === 'engaged' || input.emotion?.primary === 'curious') {
    challengePace = 'faster';
    notes.push('engagement_detected');
  }

  /* -------------------------------------------------------------- */
  /* persist profile update                                         */
  /* -------------------------------------------------------------- */

  updateLearningStyleProfile(input.userId, profile);

  return {
    explanationDepth,
    challengePace,
    correctionStyleBias,
    recapBias,
    drillBias,
    notes,
    profile,
  };
}

/**
 * Compact debug summary useful for logs and tests.
 */
export function summarizeAdaptiveTeaching(
  adj: AdaptiveTeachingAdjustment
): string {
  return [
    `explain=${adj.explanationDepth}`,
    `pace=${adj.challengePace}`,
    `correct=${adj.correctionStyleBias}`,
    `recap=${adj.recapBias}`,
    `drill=${adj.drillBias}`,
  ].join(' | ');
}