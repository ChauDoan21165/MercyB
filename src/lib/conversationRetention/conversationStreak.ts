// src/lib/conversationRetention/conversationStreak.ts
//
// Back-compat wrapper for Lane D conversation streak calls.
//
// Decision D1: conversations feed the existing general streak. No separate
// conversation counter is kept here. This module only applies the 5+ turn
// trigger and computes a return value using the shared streak math; the actual
// active-day write goes through recordActiveDay(), the same retention seam used
// by other production learner actions.

import {
  computeNewStreakState,
  formatLocalDate,
  type StreakState,
} from "@/lib/streakMath";
import { getCanonicalStreak } from "@/lib/streak/canonicalStreak";
import { recordActiveDay } from "@/lib/retention/recordActiveDay";

/** A completed conversation session is 5+ turns. */
export const MIN_TURNS_FOR_SESSION = 5;

const DEFAULT_TIME_ZONE = "Asia/Ho_Chi_Minh";

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
  const canonical = getCanonicalStreak();
  return {
    current: canonical.current,
    longest: canonical.longest,
    lastStudiedDate: canonical.lastStudiedDate,
  };
}

/** Read the current conversation streak without mutating anything. */
export function getConversationStreak(): StreakState {
  return readStreak();
}

/**
 * Record the end of a conversation session. Only 5+ turn sessions count.
 * Qualifying sessions emit the general active-day write; no conversation-owned
 * streak state is persisted.
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
        void recordActiveDay();
        return { counted: true, reason: "already_counted_today", streak: prev };
      case "noop_future_prev":
        return { counted: false, reason: "future_clock", streak: prev };
      case "increment":
        void recordActiveDay();
        return { counted: true, reason: "incremented", streak: computation.next };
      case "reset":
        void recordActiveDay();
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
  /* no-op: conversation streak state no longer exists */
}
