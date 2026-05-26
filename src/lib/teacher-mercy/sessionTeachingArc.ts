/**
 * sessionTeachingArc.ts
 *
 * Session-level teaching arc planner.
 *
 * Purpose:
 * - keep Mercy from feeling purely reactive
 * - maintain a coherent short teaching arc within one session
 * - suggest what the next pedagogically sensible move should be
 * - track whether the learner is still diagnosing, practicing, recovering, or stabilizing
 *
 * Notes:
 * - in-memory store for local runtime and tests
 * - deterministic and easy to replace with persistent storage later
 */

export type SessionArcStage =
  | 'diagnose'
  | 'explain'
  | 'guided_practice'
  | 'retry'
  | 'review'
  | 'challenge'
  | 'recap'
  | 'stabilize'
  | 'close';

export interface SessionArcTurn {
  teachingMode: string;
  concept?: string | null;
  correct: boolean;
  repeatedMistake: boolean;
  shouldReviewConcept: boolean;
  learnerSignal?: string | null;
  timestamp: string;
}

export interface SessionTeachingArcState {
  userId: string;
  sessionId: string;

  currentStage: SessionArcStage;
  targetConcept?: string;

  turns: SessionArcTurn[];

  totalTurns: number;
  correctTurns: number;
  incorrectTurns: number;

  repeatedMistakeCount: number;
  reviewCount: number;
  challengeCount: number;

  lastUpdatedAt: number;
}

export interface UpdateSessionTeachingArcInput {
  userId: string;
  sessionId: string;

  teachingMode: string;
  concept?: string | null;

  correct: boolean;
  repeatedMistake?: boolean;
  shouldReviewConcept?: boolean;
  learnerSignal?: string | null;
  timestamp?: string;
}

export interface SessionTeachingArcInsightInput {
  userId: string;
  sessionId: string;
  learnerAffect?: string | null;
  learnerConfidence?: string | null;
  wantsChallenge?: boolean;
  wantsRecap?: boolean;
}

export interface SessionTeachingArcInsight {
  currentStage: SessionArcStage;
  suggestedNextMode:
    | 'explain'
    | 'correct'
    | 'review'
    | 'drill'
    | 'challenge'
    | 'recap'
    | 'encourage';
  shouldStayOnConcept: boolean;
  shouldSlowDown: boolean;
  shouldEscalateChallenge: boolean;
  shouldRecapSoon: boolean;
  shouldProtectMomentum: boolean;
  rationale: string[];
}

const MAX_SESSION_ARC_TURNS = 20;
const arcStore = new Map<string, SessionTeachingArcState>();

function buildArcKey(userId: string, sessionId: string): string {
  return `${userId}::${sessionId}`;
}

function normalizeText(value?: string | null): string {
  return (value ?? '').trim().toLowerCase();
}

function toTimestampMs(value?: string): number {
  if (!value) return Date.now();

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : Date.now();
}

function createEmptySessionTeachingArcState(
  userId: string,
  sessionId: string
): SessionTeachingArcState {
  return {
    userId,
    sessionId,
    currentStage: 'diagnose',
    targetConcept: undefined,
    turns: [],
    totalTurns: 0,
    correctTurns: 0,
    incorrectTurns: 0,
    repeatedMistakeCount: 0,
    reviewCount: 0,
    challengeCount: 0,
    lastUpdatedAt: Date.now(),
  };
}

function cloneTurn(turn: SessionArcTurn): SessionArcTurn {
  return { ...turn };
}

function cloneState(state: SessionTeachingArcState): SessionTeachingArcState {
  return {
    ...state,
    turns: state.turns.map(cloneTurn),
  };
}

function hasRecentRepeatedMistake(state: SessionTeachingArcState): boolean {
  return state.turns.slice(0, 3).some((t) => t.repeatedMistake);
}

function hasRecentIncorrectStreak(state: SessionTeachingArcState): boolean {
  const recent = state.turns.slice(0, 3);
  return recent.length >= 2 && recent.every((t) => !t.correct);
}

function hasRecentSuccessStreak(state: SessionTeachingArcState): boolean {
  const recent = state.turns.slice(0, 3);
  return recent.length >= 2 && recent.every((t) => t.correct);
}

function hasRecentReviewPressure(state: SessionTeachingArcState): boolean {
  return state.turns
    .slice(0, 3)
    .some((t) => t.shouldReviewConcept || t.teachingMode === 'review');
}

function inferStageFromHistory(
  prior: SessionTeachingArcState,
  incoming: SessionArcTurn
): SessionArcStage {
  const hasHistory = prior.totalTurns > 0;
  const recentTurns = [incoming, ...prior.turns].slice(0, 5);

  const recentCorrect = recentTurns.filter((t) => t.correct).length;
  const recentIncorrect = recentTurns.filter((t) => !t.correct).length;
  const recentRepeated = recentTurns.filter((t) => t.repeatedMistake).length;
  const recentReview = recentTurns.filter(
    (t) => t.shouldReviewConcept || t.teachingMode === 'review'
  ).length;
  const recentChallenge = recentTurns.filter(
    (t) => t.teachingMode === 'challenge'
  ).length;
  const recentRecap = recentTurns.filter((t) => t.teachingMode === 'recap').length;

  if (!hasHistory) {
    if (incoming.correct) return 'guided_practice';
    if (incoming.teachingMode === 'explain') return 'explain';
    return 'diagnose';
  }

  if (
    recentRecap >= 1 &&
    recentCorrect >= 3 &&
    recentIncorrect === 0 &&
    recentRepeated === 0
  ) {
    return 'close';
  }

  if (recentRepeated >= 2) {
    return 'retry';
  }

  if (recentReview >= 2) {
    return 'review';
  }

  if (incoming.teachingMode === 'recap') {
    return 'recap';
  }

  if (recentChallenge >= 1 && recentCorrect >= 2 && recentRepeated === 0) {
    return 'challenge';
  }

  if (recentCorrect >= 3 && recentIncorrect === 0) {
    return 'stabilize';
  }

  if (incoming.teachingMode === 'explain') {
    return 'explain';
  }

  if (!incoming.correct) {
    return 'guided_practice';
  }

  if (incoming.correct && recentCorrect >= 1) {
    return 'guided_practice';
  }

  return 'diagnose';
}

export function loadSessionTeachingArc(
  userId: string,
  sessionId: string
): SessionTeachingArcState {
  const key = buildArcKey(userId, sessionId);
  const existing = arcStore.get(key);

  if (!existing) {
    return createEmptySessionTeachingArcState(userId, sessionId);
  }

  return cloneState(existing);
}

export function updateSessionTeachingArc(
  input: UpdateSessionTeachingArcInput
): SessionTeachingArcState {
  const current = loadSessionTeachingArc(input.userId, input.sessionId);

  const turn: SessionArcTurn = {
    teachingMode: input.teachingMode,
    concept: input.concept ?? null,
    correct: input.correct,
    repeatedMistake: Boolean(input.repeatedMistake),
    shouldReviewConcept: Boolean(input.shouldReviewConcept),
    learnerSignal: input.learnerSignal ?? null,
    timestamp: input.timestamp ?? new Date().toISOString(),
  };

  const currentConceptNorm = normalizeText(current.targetConcept);
  const incomingConceptNorm = normalizeText(input.concept);

  const targetConcept =
    currentConceptNorm.length > 0
      ? current.targetConcept
      : incomingConceptNorm.length > 0
        ? input.concept ?? undefined
        : undefined;

  const next: SessionTeachingArcState = {
    userId: current.userId,
    sessionId: current.sessionId,
    currentStage: inferStageFromHistory(current, turn),
    targetConcept,
    turns: [turn, ...current.turns].slice(0, MAX_SESSION_ARC_TURNS),
    totalTurns: current.totalTurns + 1,
    correctTurns: current.correctTurns + (turn.correct ? 1 : 0),
    incorrectTurns: current.incorrectTurns + (turn.correct ? 0 : 1),
    repeatedMistakeCount:
      current.repeatedMistakeCount + (turn.repeatedMistake ? 1 : 0),
    reviewCount:
      current.reviewCount +
      (turn.shouldReviewConcept || turn.teachingMode === 'review' ? 1 : 0),
    challengeCount:
      current.challengeCount + (turn.teachingMode === 'challenge' ? 1 : 0),
    lastUpdatedAt: toTimestampMs(turn.timestamp),
  };

  arcStore.set(buildArcKey(input.userId, input.sessionId), next);
  return cloneState(next);
}

export function clearSessionTeachingArc(
  userId?: string,
  sessionId?: string
): void {
  if (!userId && !sessionId) {
    arcStore.clear();
    return;
  }

  for (const key of arcStore.keys()) {
    const [storedUserId, storedSessionId] = key.split('::');

    const userMatches = !userId || storedUserId === userId;
    const sessionMatches = !sessionId || storedSessionId === sessionId;

    if (userMatches && sessionMatches) {
      arcStore.delete(key);
    }
  }
}

export const resetSessionTeachingArc = clearSessionTeachingArc;

export function getSessionTeachingArcInsight(
  input: SessionTeachingArcInsightInput
): SessionTeachingArcInsight {
  const state = loadSessionTeachingArc(input.userId, input.sessionId);

  if (state.totalTurns === 0) {
    return {
      currentStage: 'diagnose',
      suggestedNextMode: 'explain',
      shouldStayOnConcept: true,
      shouldSlowDown: false,
      shouldEscalateChallenge: false,
      shouldRecapSoon: false,
      shouldProtectMomentum: false,
      rationale: ['empty_session_arc'],
    };
  }

  const rationale: string[] = [];
  let suggestedNextMode: SessionTeachingArcInsight['suggestedNextMode'] =
    'encourage';

  const learnerAffect = normalizeText(input.learnerAffect);
  const learnerConfidence = normalizeText(input.learnerConfidence);
  const wantsChallenge = input.wantsChallenge === true;
  const wantsRecap = input.wantsRecap === true;

  const recentRepeatedMistake = hasRecentRepeatedMistake(state);
  const recentIncorrectStreak = hasRecentIncorrectStreak(state);
  const recentSuccessStreak = hasRecentSuccessStreak(state);
  const recentReviewPressure = hasRecentReviewPressure(state);

  let shouldStayOnConcept =
    Boolean(state.targetConcept) ||
    recentRepeatedMistake ||
    recentIncorrectStreak ||
    recentReviewPressure;

  let shouldSlowDown =
    recentRepeatedMistake ||
    recentIncorrectStreak ||
    learnerAffect === 'discouraged' ||
    learnerAffect === 'frustrated' ||
    learnerConfidence === 'low';

  let shouldProtectMomentum =
    recentRepeatedMistake ||
    recentIncorrectStreak ||
    learnerAffect === 'discouraged' ||
    learnerAffect === 'frustrated' ||
    learnerConfidence === 'low';

  let shouldEscalateChallenge = false;
  let shouldRecapSoon = false;

  if (wantsRecap) {
    suggestedNextMode = 'recap';
    shouldRecapSoon = true;
    rationale.push('explicit_recap_request');
  } else if (recentRepeatedMistake) {
    suggestedNextMode = 'review';
    shouldStayOnConcept = true;
    shouldSlowDown = true;
    shouldProtectMomentum = true;
    rationale.push('recent_repeated_mistake');
  } else if (recentIncorrectStreak) {
    suggestedNextMode = 'explain';
    shouldStayOnConcept = true;
    shouldSlowDown = true;
    shouldProtectMomentum = true;
    rationale.push('recent_incorrect_streak');
  } else if (state.currentStage === 'review') {
    suggestedNextMode = 'drill';
    shouldStayOnConcept = true;
    rationale.push('review_then_drill');
  } else if (state.currentStage === 'guided_practice') {
    suggestedNextMode = 'encourage';
    shouldStayOnConcept = true;
    rationale.push('guided_practice_continue');
  } else if (
    (wantsChallenge || recentSuccessStreak) &&
    state.challengeCount === 0 &&
    !recentRepeatedMistake &&
    !recentReviewPressure &&
    learnerAffect !== 'discouraged' &&
    learnerAffect !== 'frustrated' &&
    learnerConfidence !== 'low'
  ) {
    suggestedNextMode = 'challenge';
    shouldEscalateChallenge = true;
    shouldStayOnConcept = false;
    rationale.push('success_streak_ready_for_challenge');
  } else if (recentSuccessStreak && state.totalTurns >= 4) {
    suggestedNextMode = 'recap';
    shouldRecapSoon = true;
    rationale.push('success_streak_ready_for_recap');
  } else if (state.currentStage === 'stabilize') {
    suggestedNextMode = 'recap';
    shouldRecapSoon = true;
    rationale.push('stabilize_then_recap');
  } else if (state.currentStage === 'close') {
    suggestedNextMode = 'encourage';
    shouldStayOnConcept = false;
    shouldRecapSoon = false;
    rationale.push('session_arc_ready_to_close');
  } else {
    suggestedNextMode = 'encourage';
    rationale.push('default_progression');
  }

  if (state.currentStage === 'challenge') {
    rationale.push('currently_in_challenge_stage');
  }

  if (state.currentStage === 'recap') {
    shouldRecapSoon = true;
    rationale.push('currently_in_recap_stage');
  }

  if (shouldProtectMomentum) {
    rationale.push('momentum_protection_needed');
  }

  if (shouldSlowDown) {
    rationale.push('pace_should_slow_down');
  }

  if (shouldStayOnConcept && state.targetConcept) {
    rationale.push('concept_anchor_active');
  }

  return {
    currentStage: state.currentStage,
    suggestedNextMode,
    shouldStayOnConcept,
    shouldSlowDown,
    shouldEscalateChallenge,
    shouldRecapSoon,
    shouldProtectMomentum,
    rationale,
  };
}

export default {
  loadSessionTeachingArc,
  updateSessionTeachingArc,
  clearSessionTeachingArc,
  resetSessionTeachingArc,
  getSessionTeachingArcInsight,
};