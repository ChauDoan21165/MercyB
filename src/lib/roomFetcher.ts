// src/lib/roomFetcher.ts
/**
 * Secure room fetching.
 * - Single room JSON is loaded through the secure room loader.
 * - Room lists/summaries come from the database only.
 * - No PUBLIC_ROOM_MANIFEST fallback.
 * - No /data/*.json runtime fetch path.
 */

import { supabase } from "@/lib/supabaseClient";
import { ROOMS_TABLE } from "@/lib/constants/rooms";
import { loadRoomJson } from "./roomJsonResolver";

const LOG_PREFIX = "[roomFetcher]";

function normalizeRoomIdForCanonicalFile(input: string): string {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/\.json$/i, "")
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_");
}

export type RoomMeta = {
  id: string;
  tier?: string;
  title_en?: string;
  title_vi?: string;
  intro_en?: string;
  intro_vi?: string;
  path?: string;
};

export type RoomSummary = RoomMeta;

type AnyRoomJson = {
  id?: string;
  tier?: string;
  title?: { en?: string; vi?: string };
  intro?: { en?: string; vi?: string };
  name?: string;
  name_vi?: string;
  intro_text?: string;
  intro_vi?: string;
  description?: string;
  description_vi?: string;
};

type RoomSummaryRow = {
  id: string;
  tier: string | null;
  title_en: string | null;
  title_vi: string | null;
};

export type RoomAccessErrorCode =
  | "not_logged_in"
  | "adult_not_confirmed"
  | "not_entitled"
  | "missing_functions_url"
  | "signed_url_failed"
  | "private_room_fetch_failed"
  | "room_fetch_failed";

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

/**
 * Load a single room through the secure loader.
 * This is now the only runtime path for room JSON.
 */
export async function fetchRoomJsonByIdOrThrow(roomId: string): Promise<AnyRoomJson> {
  const canonicalRoomId = normalizeRoomIdForCanonicalFile(roomId);
  if (!canonicalRoomId) {
    throw new Error("room_fetch_failed");
  }

  const json = await loadRoomJson(canonicalRoomId);

  if (!isObject(json)) {
    throw new Error("room_fetch_failed");
  }

  return json as AnyRoomJson;
}

/**
 * Back-compat: returns null on failure.
 */
export async function fetchRoomJsonById(roomId: string): Promise<AnyRoomJson | null> {
  try {
    return await fetchRoomJsonByIdOrThrow(roomId);
  } catch (err: any) {
    console.warn(`${LOG_PREFIX} fetchRoomJsonById: could not load`, {
      roomId,
      canonicalRoomId: normalizeRoomIdForCanonicalFile(roomId),
      error: String(err?.message ?? err),
    });
    return null;
  }
}

async function fetchRoomSummaryRowsFromDb(): Promise<RoomSummaryRow[]> {
  const { data, error } = await supabase
    .from(ROOMS_TABLE)
    .select("id, tier, title_en, title_vi")
    .returns<RoomSummaryRow[]>();

  if (error) throw error;

  return (data || [])
    .filter((row) => String(row?.id || "").trim().length > 0)
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

/**
 * Build all room summaries from the database only.
 * This intentionally no longer derives room lists from any local manifest.
 */
export async function fetchAllRoomSummaries(): Promise<RoomSummary[]> {
  try {
    const rows = await fetchRoomSummaryRowsFromDb();

    return rows.map((row) => ({
      id: row.id,
      tier: row.tier || undefined,
      title_en: row.title_en || undefined,
      title_vi: row.title_vi || undefined,
    }));
  } catch (err) {
    console.warn(`${LOG_PREFIX} fetchAllRoomSummaries: DB load failed`, err);
    return [];
  }
}

/**
 * Optional background refresh hook.
 * Kept for back-compat but intentionally does nothing now.
 */
async function tryFetchRoomsFromSupabaseNonBlocking(): Promise<void> {
  return;
}

/**
 * Legacy-compatible export.
 */
export async function fetchAllRooms(): Promise<RoomSummary[]> {
  const summaries = await fetchAllRoomSummaries();
  void tryFetchRoomsFromSupabaseNonBlocking();
  return summaries;
}

/**
 * Required by some diagnostics code.
 */
export async function getAllRooms(): Promise<RoomSummary[]> {
  return fetchAllRooms();
}

/**
 * Required by tests/diagnostics.
 */
export async function getRoomList(): Promise<RoomMeta[]> {
  return fetchAllRooms();
}