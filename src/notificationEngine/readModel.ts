// src/notificationEngine/readModel.ts
//
// Builds the single HabitSnapshot the scheduler reasons over, from the live
// read seams. Streak-save eligibility is gated on SERVER_STREAKS_ENABLED and
// computed from server data in the user's IANA timezone — it NEVER reads the
// legacy localStorage LAST_DAILY_KEY and NEVER uses a UTC date fallback.

import { supabase } from "@/lib/supabaseClient";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { getStreakDays } from "@/services/pointsService";
import { isStreakAtRisk } from "@/lib/streak/canonicalStreak";
import {
  fetchDueCount,
  fetchNextScheduledAt,
} from "@/lib/vocabulary/repository";

import { getLocalStudyDates } from "./dateMath";
import type { HabitSnapshot } from "./types";

/** Normalize a date-ish column value to `YYYY-MM-DD` (or null). */
function toYmd(value: unknown): string | null {
  if (typeof value !== "string" || value.length < 10) return null;
  return value.slice(0, 10);
}

async function readProfile(
  userId: string,
): Promise<{ timezone: string | null; lastStudied: string | null }> {
  try {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    const row = (data ?? {}) as Record<string, unknown>;
    return {
      timezone: typeof row.timezone === "string" ? row.timezone : null,
      lastStudied: toYmd(row.streak_last_studied_date),
    };
  } catch {
    return { timezone: null, lastStudied: null };
  }
}

async function readDue(): Promise<{
  dueCount: number;
  nextScheduledAt: string | null;
}> {
  try {
    const [dueCount, nextScheduledAt] = await Promise.all([
      fetchDueCount(),
      fetchNextScheduledAt(),
    ]);
    return { dueCount, nextScheduledAt };
  } catch {
    return { dueCount: 0, nextScheduledAt: null };
  }
}

/** Build the read-model for a user. Pure-ish: all I/O is in the seams above. */
export async function buildHabitSnapshot(
  userId: string,
  now: Date = new Date(),
): Promise<HabitSnapshot> {
  const serverStreaksEnabled = FEATURE_FLAGS.SERVER_STREAKS_ENABLED;
  const { timezone, lastStudied } = await readProfile(userId);
  const { todayLocal, yesterdayLocal, timezone: resolvedTz } =
    getLocalStudyDates(timezone, now);
  const streakDays = getStreakDays();
  const { dueCount, nextScheduledAt } = await readDue();

  // At-risk computed via the single shared rule (canonicalStreak). lastStudied
  // is the AUTHORITATIVE server value from the profiles query above — the engine
  // context can't rely on the React-warmed client cache, so we pass it directly.
  const isAtRiskToday = isStreakAtRisk({
    serverStreaksEnabled,
    streakDays,
    lastStudiedDate: lastStudied,
    todayLocal,
    yesterdayLocal,
  });

  return {
    todayLocal,
    yesterdayLocal,
    timezone: resolvedTz,
    streakDays,
    serverStreaksEnabled,
    serverLastStudiedDate: lastStudied,
    isAtRiskToday,
    dueCount,
    nextScheduledAt,
  };
}
