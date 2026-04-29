// src/lib/certificates/snapshot.ts
//
// Builds the MilestoneSnapshot the observer feeds into checkMilestones.
// In the mock phase, counters live in localStorage so the gallery can
// reflect progress immediately. A1's real implementation will read
// these aggregates from server-side views; the snapshot shape stays
// stable across the swap.

import type { MilestoneSnapshot } from "./types";
import type { XPEventType } from "@/lib/xp/eventTypes";

const COUNTER_PREFIX = "mb:certificates:counters:v1:";

export interface PersistedCounters {
  rooms_completed: number;
  vocab_mastered: number;
  pronunciation_drills: number;
  writing_submissions: number;
  streak_days: number;
}

const ZERO: PersistedCounters = {
  rooms_completed: 0,
  vocab_mastered: 0,
  pronunciation_drills: 0,
  writing_submissions: 0,
  streak_days: 0,
};

function counterKey(userId: string): string {
  return `${COUNTER_PREFIX}${userId}`;
}

export function readCounters(userId: string): PersistedCounters {
  if (!userId || typeof window === "undefined" || !window.localStorage) {
    return { ...ZERO };
  }
  try {
    const raw = window.localStorage.getItem(counterKey(userId));
    if (!raw) return { ...ZERO };
    const parsed = JSON.parse(raw) as Partial<PersistedCounters>;
    return {
      rooms_completed: Number(parsed.rooms_completed ?? 0) || 0,
      vocab_mastered: Number(parsed.vocab_mastered ?? 0) || 0,
      pronunciation_drills: Number(parsed.pronunciation_drills ?? 0) || 0,
      writing_submissions: Number(parsed.writing_submissions ?? 0) || 0,
      streak_days: Number(parsed.streak_days ?? 0) || 0,
    };
  } catch {
    return { ...ZERO };
  }
}

function writeCounters(userId: string, counters: PersistedCounters): void {
  if (!userId || typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(counterKey(userId), JSON.stringify(counters));
  } catch {
    // Best effort.
  }
}

/**
 * Map an XP event type onto the counter it advances. Returns `null`
 * for events that don't correspond to a tracked milestone field
 * (e.g. perfect_score_lesson is a bonus and shouldn't double-count).
 */
function counterFieldFor(eventType: XPEventType): keyof PersistedCounters | null {
  switch (eventType) {
    case "lesson_complete":
    case "first_time_in_category":
      return "rooms_completed";
    case "drill_complete":
      return "pronunciation_drills";
    case "vocabulary_review_5_words":
      return "vocab_mastered";
    case "streak_day_continued":
    case "streak_week_continued":
      return "streak_days";
    case "listening_clip_complete":
      // Listening clips count toward writing_submissions only when
      // accompanied by a transcript task; for now treat as rooms.
      return "rooms_completed";
    case "challenge_complete":
    case "perfect_score_lesson":
      return null;
    default:
      return null;
  }
}

/** Increment the counter that matches an XP event. Idempotency is
 *  enforced server-side by the XP RPC; the local counter is a
 *  best-effort mirror until A1 wires real aggregates. */
export function bumpCountersFromXPEvent(
  userId: string,
  eventType: XPEventType,
): PersistedCounters {
  const counters = readCounters(userId);
  const field = counterFieldFor(eventType);
  if (field === "streak_days") {
    // Streak comes from the XP detail's day/week event; the counter
    // is the *current* streak, not a cumulative add. We re-read from
    // the streak hook's localStorage if present, otherwise keep the
    // last observed value. This is conservative for the mock phase.
    return counters;
  }
  if (field) {
    counters[field] += 1;
    writeCounters(userId, counters);
  }
  return counters;
}

/** Set the streak directly from the latest known value. Called when
 *  the observer sees a streak XP event with a known day count. */
export function setStreakDays(userId: string, days: number): PersistedCounters {
  const counters = readCounters(userId);
  if (Number.isFinite(days) && days >= 0 && days !== counters.streak_days) {
    counters.streak_days = Math.floor(days);
    writeCounters(userId, counters);
  }
  return counters;
}

/** Build the full snapshot from latest XP event data + persisted
 *  counters. `total_xp` always comes straight off the XP event detail
 *  to stay in lockstep with the server. */
export function buildSnapshot(
  totalXp: number,
  counters: PersistedCounters,
): MilestoneSnapshot {
  return {
    total_xp: Number.isFinite(totalXp) ? totalXp : 0,
    streak_days: counters.streak_days,
    rooms_completed: counters.rooms_completed,
    vocab_mastered: counters.vocab_mastered,
    pronunciation_drills: counters.pronunciation_drills,
    writing_submissions: counters.writing_submissions,
  };
}
