// PATH: src/lib/roomFetcher.ts
// File: roomFetcher.ts

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
    .replace(/["'`]+/g, "")
    .replace(/[^\w\s-]+/g, "_")
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function coreRoomIdFromCanonical(input: string): string {
  return normalizeRoomIdForCanonicalFile(input).replace(/_(vip[1-9]|free)$/i, "");
}

function buildRoomIdCandidates(roomId: string): string[] {
  const canonical = normalizeRoomIdForCanonicalFile(roomId);
  const core = coreRoomIdFromCanonical(canonical);

  const candidates = [canonical, core].filter(Boolean);
  return Array.from(new Set(candidates));
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
  title_en?: string;
  title_vi?: string;
  intro_en?: string;
  path?: string;
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

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toOptionalText(value: unknown): string | undefined {
  const cleaned = cleanText(value);
  return cleaned || undefined;
}

function isValidRoomAccessErrorCode(value: unknown): value is RoomAccessErrorCode {
  return (
    value === "not_logged_in" ||
    value === "adult_not_confirmed" ||
    value === "not_entitled" ||
    value === "missing_functions_url" ||
    value === "signed_url_failed" ||
    value === "private_room_fetch_failed" ||
    value === "room_fetch_failed"
  );
}

function normalizeRoomSummaryRow(row: unknown): RoomSummaryRow | null {
  if (!isObject(row)) return null;

  const id = cleanText(row.id);
  if (!id) return null;

  return {
    id,
    tier: toOptionalText(row.tier) ?? null,
    title_en: toOptionalText(row.title_en) ?? null,
    title_vi: toOptionalText(row.title_vi) ?? null,
  };
}

function normalizeRoomSummary(row: RoomSummaryRow): RoomSummary {
  return {
    id: row.id,
    tier: row.tier || undefined,
    title_en: row.title_en || undefined,
    title_vi: row.title_vi || undefined,
  };
}

function normalizeRoomJson(roomId: string, json: AnyRoomJson): AnyRoomJson {
  const normalizedId = cleanText(json?.id) || normalizeRoomIdForCanonicalFile(roomId);

  return {
    ...json,
    id: normalizedId,
  };
}

function summarizeRoomJson(roomId: string, json: AnyRoomJson): RoomSummary {
  return {
    id: cleanText(json?.id) || normalizeRoomIdForCanonicalFile(roomId),
    tier: toOptionalText(json?.tier),
    title_en: toOptionalText(json?.title?.en) ?? toOptionalText(json?.title_en) ?? toOptionalText(json?.name),
    title_vi: toOptionalText(json?.title?.vi) ?? toOptionalText(json?.title_vi) ?? toOptionalText(json?.name_vi),
    intro_en:
      toOptionalText(json?.intro?.en) ??
      toOptionalText(json?.intro_en) ??
      toOptionalText(json?.intro_text) ??
      toOptionalText(json?.description),
    intro_vi:
      toOptionalText(json?.intro?.vi) ??
      toOptionalText(json?.intro_vi) ??
      toOptionalText(json?.description_vi),
    path: undefined,
  };
}

function toRoomFetchErrorCode(error: unknown): RoomAccessErrorCode {
  const message = cleanText(
    error instanceof Error ? error.message : typeof error === "string" ? error : "",
  );

  if (isValidRoomAccessErrorCode(message)) {
    return message;
  }

  return "room_fetch_failed";
}

/**
 * Load a single room through the secure loader.
 * This is now the only runtime path for room JSON.
 *
 * Hardening:
 * - first try the requested canonical room id
 * - then try the suffix-free core room id for compatibility
 */
export async function fetchRoomJsonByIdOrThrow(roomId: string): Promise<AnyRoomJson> {
  const candidates = buildRoomIdCandidates(roomId);
  if (candidates.length === 0) {
    throw new Error("room_fetch_failed");
  }

  let lastError: unknown = null;

  for (const candidate of candidates) {
    try {
      const json = await loadRoomJson(candidate);

      if (!isObject(json)) {
        throw new Error("room_fetch_failed");
      }

      return normalizeRoomJson(candidate, json as AnyRoomJson);
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(toRoomFetchErrorCode(lastError));
}

/**
 * Back-compat: returns null on failure.
 */
export async function fetchRoomJsonById(roomId: string): Promise<AnyRoomJson | null> {
  try {
    return await fetchRoomJsonByIdOrThrow(roomId);
  } catch (err: unknown) {
    console.warn(`${LOG_PREFIX} fetchRoomJsonById: could not load`, {
      roomId,
      candidates: buildRoomIdCandidates(roomId),
      error: toRoomFetchErrorCode(err),
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

  const seen = new Set<string>();

  return (Array.isArray(data) ? data : [])
    .map(normalizeRoomSummaryRow)
    .filter((row): row is RoomSummaryRow => Boolean(row))
    .filter((row) => {
      const id = normalizeRoomIdForCanonicalFile(row.id);
      if (!id) return false;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Build all room summaries from the database only.
 * This intentionally no longer derives room lists from any local manifest.
 */
export async function fetchAllRoomSummaries(): Promise<RoomSummary[]> {
  try {
    const rows = await fetchRoomSummaryRowsFromDb();
    return rows.map(normalizeRoomSummary);
  } catch (err) {
    console.warn(`${LOG_PREFIX} fetchAllRoomSummaries: DB load failed`, err);
    return [];
  }
}

/**
 * Optional helper for callers that already have room JSON and want a summary shape.
 * Does not alter the DB-only policy for room lists.
 */
export function roomJsonToSummary(roomId: string, json: AnyRoomJson): RoomSummary {
  return summarizeRoomJson(roomId, json);
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