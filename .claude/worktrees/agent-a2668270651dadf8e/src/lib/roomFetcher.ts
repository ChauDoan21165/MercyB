/**
 * Path: src/lib/roomFetcher.ts
 * File: roomFetcher.ts
 */

// PATH: src/lib/roomFetcher.ts
// File: roomFetcher.ts

/**
 * Secure room fetching.
 * - Single room JSON is loaded through the secure room loader.
 * - Room lists/summaries come from the database only.
 * - No PUBLIC_ROOM_MANIFEST fallback.
 * - No /data/*.json runtime fetch path.
 *
 * PATCH (2026-04-11):
 * - Align room-id candidate generation with roomJsonResolver.
 * - Do not narrow room ids too early in this layer.
 * - Preserve compatibility for underscore / hyphen / suffix-level0 room ids.
 *
 * PATCH (2026-04-12):
 * - Prioritize the most likely successful room-id candidate first.
 * - Cache the last successful candidate per logical room id.
 * - Deduplicate concurrent fetches for the same logical room id.
 * - Preserve the full fallback ladder for safety.
 */

import { supabase } from "@/lib/supabaseClient";
import { ROOMS_TABLE } from "@/lib/constants/rooms";
import { canonicalizeRoomId, loadRoomJson } from "./roomJsonResolver";

const LOG_PREFIX = "[roomFetcher]";
const successfulCandidateCache = new Map<string, string>();
const inFlightRoomRequests = new Map<string, Promise<AnyRoomJson>>();

function stripJsonSuffix(s: string): string {
  return String(s || "").replace(/\.json$/i, "");
}

function lastPathSegment(s: string): string {
  const cleaned = String(s || "").trim();
  if (!cleaned) return "";

  const withoutQuery = cleaned.split("?")[0] || cleaned;
  const withoutHash = withoutQuery.split("#")[0] || withoutQuery;
  const parts = withoutHash.split("/").filter(Boolean);

  return parts.length ? parts[parts.length - 1] : withoutHash;
}

function sanitizeRoomIdKeepHyphen(input: string): string {
  return stripJsonSuffix(String(input || ""))
    .trim()
    .toLowerCase()
    .replace(/["'`]+/g, "")
    .replace(/[^\w\s-]+/g, "_")
    .replace(/[\s]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/-+/g, "-")
    .replace(/^[_-]+|[_-]+$/g, "");
}

function hyphenVariant(input: string): string {
  return String(input || "").replace(/_+/g, "-").replace(/-+/g, "-");
}

function underscoreVariant(input: string): string {
  return String(input || "").replace(/-+/g, "_").replace(/_+/g, "_");
}

function coreRoomIdVariant(input: string): string {
  return String(input || "").replace(
    /(?:[_-](?:level[1-9]|level0|kids[_-]?[123]|kidslevel[123]|kids_l[123]|level3[_-]?ii))$/i,
    "",
  );
}

function normalizeRoomIdForCanonicalFile(input: string): string {
  return canonicalizeRoomId(input);
}

function toRoomRequestCacheKey(input: string): string {
  const rawSegment = stripJsonSuffix(lastPathSegment(String(input || ""))).trim();
  const canonical = normalizeRoomIdForCanonicalFile(rawSegment);
  if (canonical) return canonical;

  const safeRaw = sanitizeRoomIdKeepHyphen(rawSegment);
  if (safeRaw) return safeRaw;

  return stripJsonSuffix(String(input || "")).trim().toLowerCase();
}

function buildRoomIdCandidates(input: string): string[] {
  const rawSegment = stripJsonSuffix(lastPathSegment(String(input || ""))).trim();
  const safeRaw = sanitizeRoomIdKeepHyphen(rawSegment);
  const canonical = canonicalizeRoomId(rawSegment);
  const hyphenSafe = hyphenVariant(safeRaw);
  const hyphenFromCanonical = hyphenVariant(canonical);
  const lowerRaw = stripJsonSuffix(rawSegment).trim().toLowerCase();

  const ordered = [
    rawSegment,
    lowerRaw,
    safeRaw,
    hyphenSafe,
    canonical,
    hyphenFromCanonical,

    coreRoomIdVariant(rawSegment),
    coreRoomIdVariant(lowerRaw),
    coreRoomIdVariant(safeRaw),
    coreRoomIdVariant(hyphenSafe),
    coreRoomIdVariant(canonical),
    coreRoomIdVariant(hyphenFromCanonical),

    underscoreVariant(coreRoomIdVariant(hyphenSafe)),
    hyphenVariant(coreRoomIdVariant(canonical)),
  ];

  const seen = new Set<string>();
  const out: string[] = [];

  for (const value of ordered) {
    const v = String(value || "").trim();
    if (!v) continue;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }

  return out;
}

function buildPrioritizedRoomIdCandidates(input: string): string[] {
  const requestKey = toRoomRequestCacheKey(input);
  const cachedCandidate = successfulCandidateCache.get(requestKey);
  const canonical = normalizeRoomIdForCanonicalFile(input);
  const generated = buildRoomIdCandidates(input);

  const ordered = [cachedCandidate, canonical, ...generated];
  const seen = new Set<string>();
  const out: string[] = [];

  for (const value of ordered) {
    const v = String(value || "").trim();
    if (!v) continue;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }

  return out;
}

function rememberSuccessfulCandidate(requestKey: string, requestedRoomId: string, candidate: string): void {
  const keys = [
    requestKey,
    toRoomRequestCacheKey(requestedRoomId),
    toRoomRequestCacheKey(candidate),
  ];

  for (const key of keys) {
    const normalized = String(key || "").trim();
    if (!normalized) continue;
    successfulCandidateCache.set(normalized, candidate);
  }
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
  entries?: unknown[];
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
  const normalizedId =
    cleanText(json?.id) || cleanText(lastPathSegment(roomId)) || normalizeRoomIdForCanonicalFile(roomId);

  return {
    ...json,
    id: normalizedId,
  };
}

function summarizeRoomJson(roomId: string, json: AnyRoomJson): RoomSummary {
  return {
    id: cleanText(json?.id) || normalizeRoomIdForCanonicalFile(roomId),
    tier: toOptionalText(json?.tier),
    title_en:
      toOptionalText(json?.title?.en) ?? toOptionalText(json?.title_en) ?? toOptionalText(json?.name),
    title_vi:
      toOptionalText(json?.title?.vi) ?? toOptionalText(json?.title_vi) ?? toOptionalText(json?.name_vi),
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
  if (isObject(error)) {
    const kind = cleanText(error.kind);
    if (kind === "network") return "private_room_fetch_failed";
    if (kind === "server") return "private_room_fetch_failed";
  }

  const message = cleanText(
    error instanceof Error ? error.message : typeof error === "string" ? error : "",
  );

  if (isValidRoomAccessErrorCode(message)) {
    return message;
  }

  return "room_fetch_failed";
}

function unwrapLoadedRoomPayload(payload: unknown): AnyRoomJson | null {
  if (!isObject(payload)) return null;

  const wrappedRoom = payload.room;
  if (isObject(wrappedRoom)) {
    return wrappedRoom as AnyRoomJson;
  }

  return payload as AnyRoomJson;
}

function hasUsableRoomPayload(json: AnyRoomJson | null): json is AnyRoomJson {
  if (!json || !isObject(json)) return false;

  if (Array.isArray(json.entries) && json.entries.length > 0) return true;
  if (cleanText(json.id)) return true;
  if (cleanText(json.title_en)) return true;
  if (cleanText(json.title_vi)) return true;
  if (cleanText(json.name)) return true;
  if (cleanText(json.name_vi)) return true;
  if (cleanText(json.intro_en)) return true;
  if (cleanText(json.intro_vi)) return true;
  if (cleanText(json.description)) return true;
  if (cleanText(json.description_vi)) return true;

  const title = isObject(json.title) ? json.title : null;
  if (title && (cleanText(title.en) || cleanText(title.vi))) return true;

  const intro = isObject(json.intro) ? json.intro : null;
  if (intro && (cleanText(intro.en) || cleanText(intro.vi))) return true;

  return false;
}

/**
 * Load a single room through the secure loader.
 * This is now the only runtime path for room JSON.
 *
 * Hardening:
 * - try raw / hyphen / underscore / suffix-level0 variants
 * - let roomJsonResolver keep the final say on secure fetch candidates
 *
 * Speed:
 * - prefer the last known successful candidate first
 * - dedupe concurrent loads for the same logical room id
 */
export async function fetchRoomJsonByIdOrThrow(roomId: string): Promise<AnyRoomJson> {
  const requestKey =
    toRoomRequestCacheKey(roomId) || sanitizeRoomIdKeepHyphen(roomId) || String(roomId || "").trim();

  if (!requestKey) {
    throw new Error("room_fetch_failed");
  }

  const existingRequest = inFlightRoomRequests.get(requestKey);
  if (existingRequest) {
    return existingRequest;
  }

  const fetchPromise = (async (): Promise<AnyRoomJson> => {
    const candidates = buildPrioritizedRoomIdCandidates(roomId);
    if (candidates.length === 0) {
      throw new Error("room_fetch_failed");
    }

    let lastError: unknown = null;

    for (const candidate of candidates) {
      try {
        const payload = await loadRoomJson(candidate);
        const json = unwrapLoadedRoomPayload(payload);

        if (!hasUsableRoomPayload(json)) {
          throw new Error("room_fetch_failed");
        }

        const normalized = normalizeRoomJson(candidate, json);
        rememberSuccessfulCandidate(requestKey, roomId, candidate);
        return normalized;
      } catch (error) {
        lastError = error;
      }
    }

    throw new Error(toRoomFetchErrorCode(lastError));
  })();

  inFlightRoomRequests.set(requestKey, fetchPromise);

  try {
    return await fetchPromise;
  } finally {
    if (inFlightRoomRequests.get(requestKey) === fetchPromise) {
      inFlightRoomRequests.delete(requestKey);
    }
  }
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
      candidates: buildPrioritizedRoomIdCandidates(roomId),
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