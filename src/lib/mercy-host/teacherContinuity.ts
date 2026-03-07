/**
 * Mercy Teacher Continuity
 *
 * Purpose:
 * - help Mercy remember the immediate teaching flow across turns
 * - avoid sounding like a fresh bot every message
 * - preserve teacher momentum: correct -> retry -> reinforce -> advance
 * - make follow-up responses feel earned and connected
 *
 * Design rules:
 * - continuity is short-term, not permanent identity
 * - track the previous teaching move, tone, and concept
 * - nudge the next move rather than hard-overriding the planner
 * - prefer gentle continuity over rigid scripting
 *
 * Storage:
 * - sessionStorage when available
 * - in-memory fallback otherwise
 */

import type { TeachingMode } from './teachingModes';
import type { ToneStyle } from './responsePlanner';

export type TeacherContinuityMove =
  | 'welcome'
  | 'observe'
  | 'encourage'
  | 'correct'
  | 'explain'
  | 'challenge'
  | 'drill'
  | 'recap'
  | 'review'
  | 'retry'
  | 'advance';

export interface TeacherContinuityTurnRecord {
  move: TeacherContinuityMove;
  mode: TeachingMode;
  tone: ToneStyle;
  concept?: string;
  mistake?: string;
  learnerText?: string;
  usedHumor?: boolean;
  timestamp: number;
}

export interface TeacherContinuityState {
  userId: string;
  lastTurn?: TeacherContinuityTurnRecord;
  recentTurns: TeacherContinuityTurnRecord[];
  lastUpdatedAt: number;
}

export interface TeacherContinuityInput {
  mode: TeachingMode;
  tone: ToneStyle;
  concept?: string;
  mistake?: string;
  learnerText?: string;
  usedHumor?: boolean;
}

export interface TeacherContinuitySuggestion {
  preferredLead?:
    | 'acknowledge_progress'
    | 'resume_correction'
    | 'resume_review'
    | 'resume_drill'
    | 'advance'
    | 'steady_support';
  preferredBridge?:
    | 'one_more_try'
    | 'same_concept_retry'
    | 'lock_it_in'
    | 'step_forward'
    | 'slow_down';
  shouldReferencePreviousTurn: boolean;
  shouldReduceRepetition: boolean;
  shouldStayWithConcept: boolean;
  continuityStrength: 'none' | 'light' | 'medium' | 'strong';
  reason:
    | 'no_prior_turn'
    | 'same_concept_followup'
    | 'post_correction_retry'
    | 'post_review_retry'
    | 'post_drill_retry'
    | 'post_success_advance'
    | 'stale_history'
    | 'generic_continuity';
}

const MAX_RECENT_TURNS = 6;
const STALE_MS = 1000 * 60 * 20;

const memoryStore = new Map<string, TeacherContinuityState>();

function getKey(userId?: string | null): string {
  return `mercy_teacher_continuity_${userId || 'default'}`;
}

function now(): number {
  return Date.now();
}

function cleanText(text: string): string {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .replace(/\s([,.!?;:])/g, '$1')
    .trim();
}

function normalizeText(text?: string): string {
  return cleanText(text || '').toLowerCase();
}

function sameConcept(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  return normalizeText(a) === normalizeText(b);
}

function sameMistake(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  return normalizeText(a) === normalizeText(b);
}

function isStorageAvailable(): boolean {
  try {
    return typeof sessionStorage !== 'undefined';
  } catch {
    return false;
  }
}

export function createEmptyTeacherContinuityState(userId?: string | null): TeacherContinuityState {
  return {
    userId: userId || 'default',
    recentTurns: [],
    lastUpdatedAt: now(),
  };
}

export function loadTeacherContinuity(userId?: string | null): TeacherContinuityState {
  const key = getKey(userId);

  if (isStorageAvailable()) {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return createEmptyTeacherContinuityState(userId);

      const parsed = JSON.parse(raw) as TeacherContinuityState;

      return {
        userId: parsed.userId || userId || 'default',
        lastTurn: parsed.lastTurn,
        recentTurns: Array.isArray(parsed.recentTurns) ? parsed.recentTurns : [],
        lastUpdatedAt: typeof parsed.lastUpdatedAt === 'number' ? parsed.lastUpdatedAt : now(),
      };
    } catch {
      return createEmptyTeacherContinuityState(userId);
    }
  }

  return memoryStore.get(key) || createEmptyTeacherContinuityState(userId);
}

export function saveTeacherContinuity(
  state: TeacherContinuityState,
  userId?: string | null
): void {
  const key = getKey(userId || state.userId);

  if (isStorageAvailable()) {
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
      return;
    } catch {
      // fall through
    }
  }

  memoryStore.set(key, state);
}

function inferContinuityMove(input: TeacherContinuityInput): TeacherContinuityMove {
  switch (input.mode) {
    case 'correct':
      return 'correct';
    case 'explain':
      return 'explain';
    case 'challenge':
      return 'challenge';
    case 'drill':
      return 'drill';
    case 'recap':
      return 'recap';
    case 'review':
      return 'review';
    case 'encourage':
      return 'encourage';
    default:
      return 'observe';
  }
}

export function updateTeacherContinuity(
  input: TeacherContinuityInput,
  userId?: string | null
): TeacherContinuityState {
  const state = loadTeacherContinuity(userId);

  const turn: TeacherContinuityTurnRecord = {
    move: inferContinuityMove(input),
    mode: input.mode,
    tone: input.tone,
    concept: input.concept,
    mistake: input.mistake,
    learnerText: input.learnerText,
    usedHumor: !!input.usedHumor,
    timestamp: now(),
  };

  const recentTurns = [turn, ...state.recentTurns].slice(0, MAX_RECENT_TURNS);

  const nextState: TeacherContinuityState = {
    userId: state.userId || userId || 'default',
    lastTurn: turn,
    recentTurns,
    lastUpdatedAt: turn.timestamp,
  };

  saveTeacherContinuity(nextState, userId);
  return nextState;
}

export function clearTeacherContinuity(userId?: string | null): void {
  const key = getKey(userId);

  if (isStorageAvailable()) {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  }

  memoryStore.delete(key);
}

export function getLastTeacherTurn(
  userId?: string | null
): TeacherContinuityTurnRecord | undefined {
  return loadTeacherContinuity(userId).lastTurn;
}

export function getRecentTeacherTurns(
  userId?: string | null
): TeacherContinuityTurnRecord[] {
  return loadTeacherContinuity(userId).recentTurns;
}

export function getTeacherContinuitySuggestion(args: {
  userId?: string | null;
  nextMode: TeachingMode;
  nextConcept?: string;
  nextMistake?: string;
}): TeacherContinuitySuggestion {
  const state = loadTeacherContinuity(args.userId);
  const lastTurn = state.lastTurn;

  if (!lastTurn) {
    return {
      shouldReferencePreviousTurn: false,
      shouldReduceRepetition: false,
      shouldStayWithConcept: false,
      continuityStrength: 'none',
      reason: 'no_prior_turn',
    };
  }

  if (now() - lastTurn.timestamp > STALE_MS) {
    return {
      shouldReferencePreviousTurn: false,
      shouldReduceRepetition: true,
      shouldStayWithConcept: false,
      continuityStrength: 'none',
      reason: 'stale_history',
    };
  }

  const sameTopic =
    sameConcept(lastTurn.concept, args.nextConcept) ||
    sameMistake(lastTurn.mistake, args.nextMistake);

  if (lastTurn.mode === 'correct' && sameTopic) {
    return {
      preferredLead: 'resume_correction',
      preferredBridge: 'one_more_try',
      shouldReferencePreviousTurn: true,
      shouldReduceRepetition: true,
      shouldStayWithConcept: true,
      continuityStrength: 'strong',
      reason: 'post_correction_retry',
    };
  }

  if (lastTurn.mode === 'review' && sameTopic) {
    return {
      preferredLead: 'resume_review',
      preferredBridge: 'same_concept_retry',
      shouldReferencePreviousTurn: true,
      shouldReduceRepetition: true,
      shouldStayWithConcept: true,
      continuityStrength: 'strong',
      reason: 'post_review_retry',
    };
  }

  if (lastTurn.mode === 'drill' && sameTopic) {
    return {
      preferredLead: 'resume_drill',
      preferredBridge: 'lock_it_in',
      shouldReferencePreviousTurn: true,
      shouldReduceRepetition: true,
      shouldStayWithConcept: true,
      continuityStrength: 'medium',
      reason: 'post_drill_retry',
    };
  }

  if (
    (lastTurn.mode === 'encourage' || lastTurn.mode === 'challenge') &&
    args.nextMode === 'challenge'
  ) {
    return {
      preferredLead: 'advance',
      preferredBridge: 'step_forward',
      shouldReferencePreviousTurn: true,
      shouldReduceRepetition: true,
      shouldStayWithConcept: sameTopic,
      continuityStrength: 'medium',
      reason: 'post_success_advance',
    };
  }

  if (sameTopic) {
    return {
      preferredLead: 'steady_support',
      preferredBridge: 'same_concept_retry',
      shouldReferencePreviousTurn: true,
      shouldReduceRepetition: true,
      shouldStayWithConcept: true,
      continuityStrength: 'light',
      reason: 'same_concept_followup',
    };
  }

  return {
    preferredLead: 'steady_support',
    preferredBridge: 'step_forward',
    shouldReferencePreviousTurn: false,
    shouldReduceRepetition: true,
    shouldStayWithConcept: false,
    continuityStrength: 'light',
    reason: 'generic_continuity',
  };
}

export function getContinuityLeadLine(
  suggestion: TeacherContinuitySuggestion
): { en: string; vi: string } | undefined {
  switch (suggestion.preferredLead) {
    case 'acknowledge_progress':
      return {
        en: 'Good. You moved that forward.',
        vi: 'Tốt. Bạn đã đẩy nó tiến lên rồi.',
      };

    case 'resume_correction':
      return {
        en: 'Okay. Let’s clean up the same point once more.',
        vi: 'Được rồi. Mình làm sạch lại đúng điểm đó thêm một lần nữa nhé.',
      };

    case 'resume_review':
      return {
        en: 'Good. Let’s stay with this idea one more round.',
        vi: 'Tốt. Mình ở lại với ý này thêm một vòng nữa nhé.',
      };

    case 'resume_drill':
      return {
        en: 'Again. Same target, cleaner shape.',
        vi: 'Lại nào. Cùng mục tiêu, nhưng gọn hơn.',
      };

    case 'advance':
      return {
        en: 'Good. Now we can move one step further.',
        vi: 'Tốt. Giờ mình có thể tiến thêm một bước nữa.',
      };

    case 'steady_support':
      return {
        en: 'Alright. Let’s keep the thread and continue.',
        vi: 'Được rồi. Mình giữ mạch này và đi tiếp nhé.',
      };

    default:
      return undefined;
  }
}

export function getContinuityBridgeLine(
  suggestion: TeacherContinuitySuggestion
): { en: string; vi: string } | undefined {
  switch (suggestion.preferredBridge) {
    case 'one_more_try':
      return {
        en: 'One more try is enough here.',
        vi: 'Ở đây, thêm một lần thử nữa là đủ.',
      };

    case 'same_concept_retry':
      return {
        en: 'Stay with the same idea for one clear rep.',
        vi: 'Ở lại với cùng ý đó cho một lần làm thật rõ nhé.',
      };

    case 'lock_it_in':
      return {
        en: 'Let’s lock this in with one clean repetition.',
        vi: 'Mình khóa nó lại bằng một lần lặp thật gọn nhé.',
      };

    case 'step_forward':
      return {
        en: 'Now take the next clean step.',
        vi: 'Giờ hãy đi bước rõ ràng tiếp theo.',
      };

    case 'slow_down':
      return {
        en: 'Slow it down and keep only the important piece.',
        vi: 'Chậm lại và chỉ giữ phần quan trọng thôi.',
      };

    default:
      return undefined;
  }
}