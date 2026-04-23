/**
 * user_room_progress writer (P0-3).
 *
 * Why this file exists: for months, nothing in the app wrote to
 * `user_room_progress`, so the Home page's "recent rooms" card silently
 * showed nothing. See `docs/audit-history-phase-1.md`.
 *
 * Contract:
 *  - Idempotent upsert keyed by (user_id, app_id, room_id).
 *  - `trackRoomEntry` is throttled: consecutive entries within
 *    `ENTRY_DEDUP_WINDOW_MS` bump only `last_seen_at`, not `repeat_count`.
 *  - `progress_pct` is monotonic — we never decrease a value once set.
 *  - Failures attempt one in-memory retry after `RETRY_DELAY_MS` then
 *    log + swallow. (A full offline outbox is tracked as P1-5.)
 *
 * Column note: the underlying column is `last_seen_at`. The Home view
 * `v_user_progress_current` re-exposes it as `last_study_at`.
 */

import { supabase } from "@/lib/supabaseClient";

/** Matches the APP_ID the reader hook (`useUserProgress`) filters on. */
export const ROOM_PROGRESS_APP_ID = "mercy_blade";

/** Repeat-count bump only fires if last entry was this long ago. */
const ENTRY_DEDUP_WINDOW_MS = 30 * 60 * 1000; // 30 min

/** One retry, one backoff. Full outbox is P1-5 scope. */
const RETRY_DELAY_MS = 1500;

export type TrackRoomEntryOptions = {
  /** Optional first-visible keyword; stored as `last_keyword_en`. */
  keywordEn?: string | null;
  /** Optional entry row id (for deep-linking back). */
  entryId?: string | null;
  /** Override the global APP_ID (used only by tests). */
  appId?: string;
};

export type UpdateRoomProgressOptions = {
  /** 0..100 — will be clamped. */
  progressPct?: number;
  keywordEn?: string | null;
  entryId?: string | null;
  /** Override the global APP_ID (used only by tests). */
  appId?: string;
};

export type UpsertRoomProgressResult =
  | { ok: true; action: "inserted" | "updated" | "throttled" }
  | { ok: false; error: string };

// ─── internal helpers ─────────────────────────────────────────────────────

type RowSnapshot = {
  progress_pct: number | null;
  repeat_count: number | null;
  last_seen_at: string | null;
};

async function fetchExisting(
  userId: string,
  appId: string,
  roomId: string,
): Promise<RowSnapshot | null> {
  const { data, error } = await supabase
    .from("user_room_progress")
    .select("progress_pct, repeat_count, last_seen_at")
    .eq("user_id", userId)
    .eq("app_id", appId)
    .eq("room_id", roomId)
    .maybeSingle();

  if (error) {
    // Surface the error to the caller; retry layer decides what to do.
    throw error;
  }
  return (data as RowSnapshot | null) ?? null;
}

function clampPct(pct: number | undefined | null): number | null {
  if (pct === undefined || pct === null || Number.isNaN(pct)) return null;
  if (pct < 0) return 0;
  if (pct > 100) return 100;
  return Math.round(pct);
}

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object") {
    const anyErr = err as Record<string, unknown>;
    if (typeof anyErr.message === "string") return anyErr.message;
  }
  return String(err);
}

async function withOneRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    return await fn();
  }
}

// ─── public API ──────────────────────────────────────────────────────────

/**
 * Called when a user enters a room.
 *
 * First entry → INSERT with repeat_count=1.
 * Entry within 30 min of last → UPDATE last_seen_at only.
 * Entry after 30+ min → UPDATE last_seen_at + repeat_count+=1.
 *
 * Safe to call even for anon (no `userId`) — returns `ok: true`, no-op.
 */
export async function trackRoomEntry(
  userId: string | null | undefined,
  roomId: string | null | undefined,
  options: TrackRoomEntryOptions = {},
): Promise<UpsertRoomProgressResult> {
  if (!userId || !roomId) return { ok: true, action: "throttled" };
  const appId = options.appId ?? ROOM_PROGRESS_APP_ID;

  try {
    return await withOneRetry(async () => {
      const existing = await fetchExisting(userId, appId, roomId);
      const nowIso = new Date().toISOString();

      if (!existing) {
        const { error } = await supabase
          .from("user_room_progress")
          .insert({
            user_id: userId,
            app_id: appId,
            room_id: roomId,
            last_seen_at: nowIso,
            last_keyword_en: options.keywordEn ?? null,
            last_entry_id: options.entryId ?? null,
            progress_pct: 0,
            repeat_count: 1,
          });
        if (error) throw error;
        return { ok: true, action: "inserted" } as const;
      }

      const lastSeenMs = existing.last_seen_at
        ? Date.parse(existing.last_seen_at)
        : 0;
      const sinceLastMs = Date.now() - lastSeenMs;
      const bumpRepeat = sinceLastMs >= ENTRY_DEDUP_WINDOW_MS;

      const patch: Record<string, unknown> = {
        last_seen_at: nowIso,
      };
      if (options.keywordEn !== undefined) patch.last_keyword_en = options.keywordEn;
      if (options.entryId !== undefined) patch.last_entry_id = options.entryId;
      if (bumpRepeat) {
        patch.repeat_count = (existing.repeat_count ?? 0) + 1;
      }

      const { error } = await supabase
        .from("user_room_progress")
        .update(patch)
        .eq("user_id", userId)
        .eq("app_id", appId)
        .eq("room_id", roomId);
      if (error) throw error;

      return {
        ok: true,
        action: bumpRepeat ? "updated" : "throttled",
      } as const;
    });
  } catch (err) {
    const message = extractErrorMessage(err);
    if (typeof console !== "undefined") {
      console.warn("[roomProgress] trackRoomEntry failed:", message);
    }
    return { ok: false, error: message };
  }
}

/**
 * Called when the user's in-room state changes in a way the history
 * should reflect — a new keyword is active, or progress advances.
 *
 * `progress_pct` is monotonic: we never decrease it.
 */
export async function updateRoomProgress(
  userId: string | null | undefined,
  roomId: string | null | undefined,
  options: UpdateRoomProgressOptions = {},
): Promise<UpsertRoomProgressResult> {
  if (!userId || !roomId) return { ok: true, action: "throttled" };
  const appId = options.appId ?? ROOM_PROGRESS_APP_ID;
  const nextPct = clampPct(options.progressPct);

  try {
    return await withOneRetry(async () => {
      const existing = await fetchExisting(userId, appId, roomId);
      const nowIso = new Date().toISOString();

      if (!existing) {
        // Row gets created lazily — updateRoomProgress should not be the
        // first write. Fall back to inserting a partial row rather than
        // losing the update.
        const { error } = await supabase
          .from("user_room_progress")
          .insert({
            user_id: userId,
            app_id: appId,
            room_id: roomId,
            last_seen_at: nowIso,
            last_keyword_en: options.keywordEn ?? null,
            last_entry_id: options.entryId ?? null,
            progress_pct: nextPct ?? 0,
            repeat_count: 1,
          });
        if (error) throw error;
        return { ok: true, action: "inserted" } as const;
      }

      const monotonicPct =
        nextPct === null
          ? existing.progress_pct ?? 0
          : Math.max(existing.progress_pct ?? 0, nextPct);

      const patch: Record<string, unknown> = {
        last_seen_at: nowIso,
        progress_pct: monotonicPct,
      };
      if (options.keywordEn !== undefined) patch.last_keyword_en = options.keywordEn;
      if (options.entryId !== undefined) patch.last_entry_id = options.entryId;

      const { error } = await supabase
        .from("user_room_progress")
        .update(patch)
        .eq("user_id", userId)
        .eq("app_id", appId)
        .eq("room_id", roomId);
      if (error) throw error;

      return { ok: true, action: "updated" } as const;
    });
  } catch (err) {
    const message = extractErrorMessage(err);
    if (typeof console !== "undefined") {
      console.warn("[roomProgress] updateRoomProgress failed:", message);
    }
    return { ok: false, error: message };
  }
}
