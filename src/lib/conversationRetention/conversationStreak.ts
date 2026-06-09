// src/lib/conversationRetention/conversationStreak.ts
//
// Conversation-specific streak (Lane D retention hook around Lane A's
// conversation engine). Tracks consecutive LOCAL days on which the learner
// completed at least one conversation SESSION — defined as 5+ turns.
//
// REUSE, not reinvent: the day-diff / consecutive / grace / reset math is the
// existing pure `computeNewStreakState` from @/lib/streakMath; the local-day
// formatting is `formatLocalDate`. This module only adds the conversation
// trigger (5+ turns) + a conversation-scoped local store, so the general
// activity streak (profiles.streak_current via canonicalStreak) is untouched.
//
// Client-side + deterministic; never throws (telemetry/streaks must never break
// a learner action). Storage is localStorage for now — a server column is a
// deliberate follow-up decision (see the D1 report), kept out so this lands
// with no migration and no Lane-B/infra surface.

import {
  computeNewStreakState,
  formatLocalDate,
  type StreakState,
} from "@/lib/streakMath";

/** A completed conversation session is 5+ turns. */
export const MIN_TURNS_FOR_SESSION = 5;

const STORAGE_KEY = "mb.conversation.streak.v1";
const DEFAULT_TIME_ZONE = "Asia/Ho_Chi_Minh";

const EMPTY_STREAK: StreakState = { current: 0, longest: 0, lastStudiedDate: null };

export type RecordSessionReason =
  | "too_short" // < MIN_TURNS_FOR_SESSION — not a completed session
  | "already_counted_today" // a session already counted this local day
  | "future_clock" // stored date is ahead of today (clock skew) — ignored
  | "incremented" // streak grew (consecutive or 1-day grace)
  | "reset"; // first ever, or a gap reset to 1

export type RecordSessionResult = {
  /** Whether this session counts toward today's streak day. */
  counted: boolean;
  reason: RecordSessionReason;
  streak: StreakState;
};

export type RecordSessionInput = {
  /** Total learner+tutor turns in the finished session. */
  turnCount: number;
  /** IANA timezone for local-day bucketing. Defaults to VN. */
  timeZone?: string;
  /** Injectable clock for tests. */
  now?: Date;
};

function readStreak(): StreakState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_STREAK };
    const parsed = JSON.parse(raw) as Partial<StreakState>;
    return {
      current: typeof parsed.current === "number" ? parsed.current : 0,
      longest: typeof parsed.longest === "number" ? parsed.longest : 0,
      lastStudiedDate:
        typeof parsed.lastStudiedDate === "string" ? parsed.lastStudiedDate : null,
    };
  } catch {
    return { ...EMPTY_STREAK };
  }
}

function writeStreak(next: StreakState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable (private mode / SSR) — degrade silently */
  }
}

/** Read the current conversation streak without mutating anything. */
export function getConversationStreak(): StreakState {
  return readStreak();
}

/**
 * Record the end of a conversation session. Only 5+ turn sessions count. The
 * first qualifying session of a local day advances (or resets) the streak via
 * the shared streak math; later sessions the same day are a no-op. Never throws.
 */
export function recordConversationSession(input: RecordSessionInput): RecordSessionResult {
  const prev = readStreak();
  try {
    if (!input || !Number.isFinite(input.turnCount) || input.turnCount < MIN_TURNS_FOR_SESSION) {
      return { counted: false, reason: "too_short", streak: prev };
    }
    const tz = input.timeZone || DEFAULT_TIME_ZONE;
    const todayLocal = formatLocalDate(input.now ?? new Date(), tz);
    const computation = computeNewStreakState(prev, todayLocal);

    switch (computation.action) {
      case "noop_same_day":
        return { counted: true, reason: "already_counted_today", streak: prev };
      case "noop_future_prev":
        return { counted: false, reason: "future_clock", streak: prev };
      case "increment":
        writeStreak(computation.next);
        return { counted: true, reason: "incremented", streak: computation.next };
      case "reset":
        writeStreak(computation.next);
        return { counted: true, reason: "reset", streak: computation.next };
      default:
        return { counted: false, reason: "future_clock", streak: prev };
    }
  } catch {
    // Never let a streak update break the conversation flow.
    return { counted: false, reason: "future_clock", streak: prev };
  }
}

/** Test-only: clear the stored conversation streak. */
export function __resetConversationStreakForTests(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
