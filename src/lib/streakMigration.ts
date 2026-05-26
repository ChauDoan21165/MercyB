/**
 * One-time localStorage → server streak migration (P0-2 Wave 2 Step 2).
 *
 * Runs once per user on first authenticated load after the server-streaks
 * feature flag is flipped on. Flow:
 *
 *   1. Collect local streak values from the 4 persistent locations
 *      documented in the Phase 1 audit (Wave 2 Step 2).
 *   2. Call `migrate_local_streak` RPC. Server does MAX-merge, stamps
 *      `profiles.streak_migrated_at` for idempotency.
 *   3. Persist the local guard `mb.streak.migrated` so the migration
 *      doesn't retry on every boot.
 *   4. Surgically delete the 3 standalone localStorage keys. Inside
 *      `mercy_host_memory`, delete ONLY the streak-specific fields —
 *      other fields (greetings, preferences) must be preserved.
 *   5. Log the attempt to `user_behavior_tracking` for telemetry.
 *
 * Safe to call multiple times — the server is idempotent via the flag,
 * and every step in this module is guarded.
 *
 * Companion: `writeBrowserTimezoneOnce` detects the browser's time zone
 * via Intl and writes it to `profiles.timezone` if still default. Runs
 * on the same boot path as the streak migration.
 */

import { supabase } from "@/lib/supabaseClient";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { setCachedStreak } from "@/lib/streakCache";

const LOCAL_GUARD_KEY = "mb.streak.migrated";
const POINTS_STREAK_KEY = "mb.points.streak";
const POINTS_LAST_DAILY_KEY = "mb.points.lastDaily";
const ROOM_PROGRESS_KEY = "room_progress";
const MERCY_HOST_MEMORY_KEY = "mercy_host_memory";

type MigrationResult =
  | { skipped: true; reason: "flag_off" | "already_local_guard" | "anon" }
  | { skipped: false; merged: { current: number; longest: number; lastDate: string | null }; alreadyMigrated: boolean }
  | { skipped: false; error: string };

function safeParseInt(v: unknown, fallback = 0): number {
  if (typeof v === "number") return Number.isFinite(v) ? Math.floor(v) : fallback;
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function safeGetItem(key: string): string | null {
  try {
    return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem(key, value);
  } catch {
    /* ignore quota / private-mode errors */
  }
}

function safeRemoveItem(key: string): void {
  try {
    if (typeof localStorage !== "undefined") localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/**
 * Collect the 3 persistent streak values from localStorage.
 * `mercy_host_memory` also contains non-streak data — we read its
 * streak fields but don't remove the whole blob here.
 */
export function collectLocalStreakValues(): {
  current: number;
  longest: number;
  lastStudiedDate: string | null;
} {
  const current = safeParseInt(safeGetItem(POINTS_STREAK_KEY), 0);
  const lastStudiedDate = safeGetItem(POINTS_LAST_DAILY_KEY); // YYYY-MM-DD per pointsService

  let longest = 0;
  const mercyRaw = safeGetItem(MERCY_HOST_MEMORY_KEY);
  if (mercyRaw) {
    try {
      const parsed = JSON.parse(mercyRaw);
      longest = Math.max(
        longest,
        safeParseInt(parsed?.longestStreak, 0),
        safeParseInt(parsed?.streakDays, 0),
      );
    } catch {
      /* corrupt JSON — skip */
    }
  }

  // Also consider the room-visit streak as a candidate value — useRoomProgress
  // computed it on the fly but the last-known value is preserved in the blob.
  const roomProgressRaw = safeGetItem(ROOM_PROGRESS_KEY);
  if (roomProgressRaw) {
    try {
      const parsed = JSON.parse(roomProgressRaw);
      longest = Math.max(longest, safeParseInt(parsed?.streak, 0));
    } catch {
      /* ignore */
    }
  }

  longest = Math.max(longest, current);
  return { current, longest, lastStudiedDate };
}

/**
 * Remove the 3 standalone streak keys + surgically strip streak fields
 * from `mercy_host_memory` (preserving all other memory). Called only
 * after the server confirms the migration succeeded.
 */
export function clearLocalStreakKeys(): void {
  safeRemoveItem(POINTS_STREAK_KEY);
  safeRemoveItem(POINTS_LAST_DAILY_KEY);
  safeRemoveItem(ROOM_PROGRESS_KEY);

  const raw = safeGetItem(MERCY_HOST_MEMORY_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      delete parsed.streakDays;
      delete parsed.longestStreak;
      safeSetItem(MERCY_HOST_MEMORY_KEY, JSON.stringify(parsed));
    }
  } catch {
    /* corrupt JSON — leave it; nothing we can safely remove */
  }
}

async function logTelemetry(
  userId: string,
  success: boolean,
  data: Record<string, unknown>,
): Promise<void> {
  try {
    await supabase.from("user_behavior_tracking").insert({
      user_id: userId,
      interaction_type: "streak_migration_attempt",
      interaction_data: { success, ...data },
    });
  } catch {
    /* telemetry is best-effort */
  }
}

/**
 * Main entry. Safe to call on every boot — guarded by the feature flag,
 * local storage sentinel, and server-side `streak_migrated_at` flag.
 */
export async function migrateLocalStreakOnce(): Promise<MigrationResult> {
  if (!FEATURE_FLAGS.SERVER_STREAKS_ENABLED) {
    return { skipped: true, reason: "flag_off" };
  }
  if (safeGetItem(LOCAL_GUARD_KEY) === "true") {
    return { skipped: true, reason: "already_local_guard" };
  }

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return { skipped: true, reason: "anon" };

  const local = collectLocalStreakValues();

  const { data, error } = await supabase.rpc("migrate_local_streak", {
    p_local_current: local.current,
    p_local_longest: local.longest,
    p_local_last_studied_date: local.lastStudiedDate,
  });

  if (error) {
    await logTelemetry(userId, false, {
      stage: "rpc_call",
      message: error.message,
      local,
    });
    return { skipped: false, error: error.message };
  }

  const payload = (data ?? {}) as {
    already_migrated?: boolean;
    current?: number;
    longest?: number;
    last_date?: string | null;
  };
  const merged = {
    current: payload.current ?? 0,
    longest: payload.longest ?? 0,
    lastDate: payload.last_date ?? null,
  };
  const alreadyMigrated = payload.already_migrated === true;

  // Warm the cache so the next `pointsService.getStreakDays()` serves
  // the migrated value without waiting for useServerStreak to fetch.
  setCachedStreak({
    current: merged.current,
    longest: merged.longest,
    lastStudiedDate: merged.lastDate,
    updatedAt: Date.now(),
  });

  // Only delete localStorage keys if the server round-tripped a
  // real confirmation. Double-safety: the server flag prevents any
  // re-applying even if this local deletion fails.
  clearLocalStreakKeys();
  safeSetItem(LOCAL_GUARD_KEY, "true");

  await logTelemetry(userId, true, {
    stage: "done",
    already_migrated: alreadyMigrated,
    merged,
    local,
  });

  return { skipped: false, merged, alreadyMigrated };
}

/**
 * Detect the browser's timezone and push it to `profiles.timezone` when
 * the stored value is still the Vietnam default. Runs once per user;
 * subsequent travel doesn't auto-update (that would reset streaks on
 * every flight — hostile UX). User-facing timezone override is a
 * future P2 setting.
 */
export async function writeBrowserTimezoneOnce(): Promise<void> {
  if (!FEATURE_FLAGS.SERVER_STREAKS_ENABLED) return;
  try {
    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!browserTz || browserTz === "Asia/Ho_Chi_Minh") return;

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    const { data, error: selectError } = await supabase
      .from("profiles")
      .select("timezone")
      .eq("id", userId)
      .maybeSingle();
    if (selectError) return;

    const currentTz = (data as { timezone?: string } | null)?.timezone;
    // Only overwrite if still at default (meaning the user never set it).
    if (currentTz && currentTz !== "Asia/Ho_Chi_Minh") return;

    await supabase
      .from("profiles")
      .update({ timezone: browserTz })
      .eq("id", userId);
  } catch {
    /* timezone detection is best-effort; don't block boot */
  }
}
