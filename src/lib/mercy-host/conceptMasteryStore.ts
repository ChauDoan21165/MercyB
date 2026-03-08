/**
 * FILE: src/lib/mercy-host/conceptMasteryStore.ts
 * VERSION: conceptMasteryStore.ts v1.2
 *
 * Long-term learner mastery tracking.
 *
 * Purpose:
 * - track how well a learner understands each concept across sessions
 * - estimate whether a concept is fragile, developing, stable, or mastered
 * - help Mercy decide whether to review, hold, or advance
 * - preserve common mistake history for concept-aware teaching
 *
 * Design notes:
 * - in-memory only, deterministic, test-safe
 * - keeps the richer scoring model from the older version
 * - adds a stronger planning insight layer for Mercy Host
 */

export type ConceptMasteryStatus =
  | 'new'
  | 'learning'
  | 'unstable'
  | 'stable'
  | 'mastered';

export interface ConceptMistakeRecord {
  mistake: string;
  count: number;
  lastSeenAt: string;
}

export interface ConceptMasteryRecord {
  userId: string;
  concept: string;

  masteryScore: number; // 0..1
  confidenceScore: number; // 0..1
  stabilityScore: number; // 0..1

  attempts: number;
  correctCount: number;
  incorrectCount: number;

  lastSeenAt: string;
  lastCorrectAt?: string;
  lastIncorrectAt?: string;

  consecutiveCorrect: number;
  consecutiveIncorrect: number;

  commonMistakes: ConceptMistakeRecord[];

  needsReview: boolean;
  reviewDueAt?: string;

  status: ConceptMasteryStatus;
}

export interface ConceptMasteryInsightInput {
  userId?: string;
  concept?: string | null;
  wantsChallenge?: boolean;
  repeatedMistake?: boolean;
  wasSuccessfulTurn?: boolean;
  wasCorrectiveTurn?: boolean;
}

export interface ConceptMasteryInsight {
  shouldReview: boolean;
  shouldReviewBeforeAdvance: boolean;
  shouldAllowChallenge: boolean;
  shouldAcknowledgeProgress: boolean;
  isFragile: boolean;
  isStable: boolean;
  masteryScore: number;
  confidenceScore: number;
  stabilityScore: number;
  status: ConceptMasteryStatus;
  topMistake?: string;
  rationale: string[];
}

const masteryStore = new Map<string, ConceptMasteryRecord>();

function normalize(value?: string | null): string {
  return (value ?? '').trim().toLowerCase();
}

function buildKey(userId: string, concept: string): string {
  return `${userId}::${normalize(concept)}`;
}

function now(): string {
  return new Date().toISOString();
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, Math.round(value * 1000) / 1000));
}

function cloneMistake(mistake: ConceptMistakeRecord): ConceptMistakeRecord {
  return { ...mistake };
}

function cloneRecord(record: ConceptMasteryRecord): ConceptMasteryRecord {
  return {
    ...record,
    commonMistakes: record.commonMistakes.map(cloneMistake),
  };
}

function createNewRecord(userId: string, concept: string): ConceptMasteryRecord {
  return {
    userId,
    concept,

    masteryScore: 0.2,
    confidenceScore: 0.3,
    stabilityScore: 0.1,

    attempts: 0,
    correctCount: 0,
    incorrectCount: 0,

    lastSeenAt: now(),

    consecutiveCorrect: 0,
    consecutiveIncorrect: 0,

    commonMistakes: [],

    needsReview: false,
    status: 'new',
  };
}

export function loadConceptMastery(
  userId: string,
  concept: string
): ConceptMasteryRecord {
  const conceptNorm = normalize(concept);
  const key = buildKey(userId, conceptNorm);

  if (!masteryStore.has(key)) {
    masteryStore.set(key, createNewRecord(userId, conceptNorm));
  }

  return cloneRecord(masteryStore.get(key)!);
}

function saveConceptMastery(record: ConceptMasteryRecord): ConceptMasteryRecord {
  masteryStore.set(buildKey(record.userId, record.concept), cloneRecord(record));
  return cloneRecord(record);
}

function recordMistake(record: ConceptMasteryRecord, mistake: string): void {
  const normalizedMistake = normalize(mistake);
  if (!normalizedMistake) return;

  const existing = record.commonMistakes.find(
    (m) => normalize(m.mistake) === normalizedMistake
  );

  if (existing) {
    existing.count += 1;
    existing.lastSeenAt = now();
  } else {
    record.commonMistakes.push({
      mistake,
      count: 1,
      lastSeenAt: now(),
    });
  }

  record.commonMistakes.sort((a, b) => b.count - a.count);
  record.commonMistakes = record.commonMistakes.slice(0, 8);
}

function recomputeStatus(record: ConceptMasteryRecord): ConceptMasteryStatus {
  if (record.masteryScore >= 0.92 && record.stabilityScore >= 0.85) {
    return 'mastered';
  }

  if (record.masteryScore >= 0.75 && record.stabilityScore >= 0.65) {
    return 'stable';
  }

  if (
    record.consecutiveIncorrect >= 2 ||
    record.masteryScore < 0.35 ||
    record.stabilityScore < 0.2
  ) {
    return 'unstable';
  }

  if (record.attempts < 3) {
    return 'new';
  }

  return 'learning';
}

function recomputeReviewState(record: ConceptMasteryRecord): void {
  if (
    record.consecutiveIncorrect >= 2 ||
    record.status === 'unstable' ||
    (record.masteryScore < 0.45 && record.attempts >= 2)
  ) {
    record.needsReview = true;
    record.reviewDueAt = record.reviewDueAt ?? now();
    return;
  }

  if (
    record.consecutiveCorrect >= 3 ||
    record.status === 'stable' ||
    record.status === 'mastered'
  ) {
    record.needsReview = false;
    record.reviewDueAt = undefined;
  }
}

export function updateConceptMastery(input: {
  userId: string;
  concept: string;
  correct: boolean;
  mistake?: string | null;
  timestamp?: string;
  repeatedMistake?: boolean;
}): ConceptMasteryRecord {
  const { userId, correct } = input;
  const concept = normalize(input.concept);
  const key = buildKey(userId, concept);

  const record = masteryStore.has(key)
    ? cloneRecord(masteryStore.get(key)!)
    : createNewRecord(userId, concept);

  const timestamp = input.timestamp ?? now();
  const repeatedMistake = input.repeatedMistake === true;

  record.attempts += 1;
  record.lastSeenAt = timestamp;

  if (correct) {
    record.correctCount += 1;
    record.lastCorrectAt = timestamp;

    record.consecutiveCorrect += 1;
    record.consecutiveIncorrect = 0;

    record.masteryScore = clamp(
      record.masteryScore + 0.12 + Math.min(0.05, record.consecutiveCorrect * 0.01)
    );
    record.confidenceScore = clamp(record.confidenceScore + 0.08);
    record.stabilityScore = clamp(
      record.stabilityScore + 0.05 + Math.min(0.05, record.consecutiveCorrect * 0.01)
    );
  } else {
    record.incorrectCount += 1;
    record.lastIncorrectAt = timestamp;

    record.consecutiveIncorrect += 1;
    record.consecutiveCorrect = 0;

    record.masteryScore = clamp(
      record.masteryScore - 0.18 - (repeatedMistake ? 0.04 : 0)
    );
    record.confidenceScore = clamp(
      record.confidenceScore - 0.12 - (repeatedMistake ? 0.03 : 0)
    );
    record.stabilityScore = clamp(
      record.stabilityScore - 0.08 - (repeatedMistake ? 0.04 : 0)
    );

    if (input.mistake) {
      recordMistake(record, input.mistake);
    }
  }

  record.status = recomputeStatus(record);
  recomputeReviewState(record);

  return saveConceptMastery(record);
}

export function listConceptMastery(userId: string): ConceptMasteryRecord[] {
  return Array.from(masteryStore.values())
    .filter((r) => r.userId === userId)
    .map(cloneRecord)
    .sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt));
}

export function clearConceptMastery(userId?: string): void {
  if (!userId) {
    masteryStore.clear();
    return;
  }

  for (const key of masteryStore.keys()) {
    if (key.startsWith(`${userId}::`)) {
      masteryStore.delete(key);
    }
  }
}

export const resetConceptMastery = clearConceptMastery;

export function getConceptMasteryInsight(
  input: ConceptMasteryInsightInput
): ConceptMasteryInsight {
  const concept = normalize(input.concept);

  if (!input.userId || !concept) {
    return {
      shouldReview: false,
      shouldReviewBeforeAdvance: false,
      shouldAllowChallenge: true,
      shouldAcknowledgeProgress: false,
      isFragile: false,
      isStable: false,
      masteryScore: 0,
      confidenceScore: 0,
      stabilityScore: 0,
      status: 'new',
      rationale: ['concept_missing_or_user_missing'],
    };
  }

  const record = loadConceptMastery(input.userId, concept);
  const topMistake = record.commonMistakes[0]?.mistake;

  const isFragile =
    record.status === 'unstable' ||
    record.consecutiveIncorrect >= 2 ||
    record.masteryScore < 0.4;

  const isStable =
    record.status === 'stable' ||
    record.status === 'mastered' ||
    (record.masteryScore >= 0.75 && record.stabilityScore >= 0.65);

  const shouldReview = record.needsReview;
  const shouldReviewBeforeAdvance =
    shouldReview || input.repeatedMistake === true || isFragile;

  const shouldAllowChallenge =
    !shouldReviewBeforeAdvance &&
    !input.repeatedMistake &&
    (record.status === 'stable' ||
      record.status === 'mastered' ||
      (record.masteryScore >= 0.78 &&
        record.stabilityScore >= 0.6 &&
        record.consecutiveCorrect >= 2));

  const shouldAcknowledgeProgress =
    input.wasSuccessfulTurn === true &&
    (record.consecutiveCorrect >= 2 ||
      record.status === 'stable' ||
      record.status === 'mastered');

  const rationale: string[] = [];

  if (record.attempts === 0) rationale.push('concept_not_attempted');
  if (record.status === 'new') rationale.push('concept_is_new');
  if (record.status === 'learning') rationale.push('concept_is_learning');
  if (record.status === 'unstable') rationale.push('concept_is_unstable');
  if (record.status === 'stable') rationale.push('concept_is_stable');
  if (record.status === 'mastered') rationale.push('concept_is_mastered');
  if (record.needsReview) rationale.push('concept_marked_for_review');
  if (record.consecutiveIncorrect >= 2) rationale.push('recent_incorrect_streak');
  if (record.consecutiveCorrect >= 2) rationale.push('recent_correct_streak');
  if (input.repeatedMistake) rationale.push('repeated_mistake_blocks_advance');
  if (topMistake) rationale.push('top_mistake_available');

  const result: ConceptMasteryInsight = {
    shouldReview,
    shouldReviewBeforeAdvance,
    shouldAllowChallenge,
    shouldAcknowledgeProgress,
    isFragile,
    isStable,
    masteryScore: record.masteryScore,
    confidenceScore: record.confidenceScore,
    stabilityScore: record.stabilityScore,
    status: record.status,
    rationale,
  };

  if (topMistake) {
    result.topMistake = topMistake;
  }

  return result;
}

export default {
  loadConceptMastery,
  updateConceptMastery,
  listConceptMastery,
  clearConceptMastery,
  resetConceptMastery,
  getConceptMasteryInsight,
};