// PATH: src/lib/roomJsonResolver.ts
// File: roomJsonResolver.ts

import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";
import { supabase } from "@/lib/supabaseClient";

export type RoomJsonResolverErrorKind =
  | "not_found"
  | "json_invalid"
  | "network"
  | "server";

type ResolverError = Error & {
  kind?: RoomJsonResolverErrorKind;
  status?: number;
  payload?: unknown;
};

function createResolverError(
  message: string,
  kind: RoomJsonResolverErrorKind,
  extras?: Partial<ResolverError>,
): ResolverError {
  const err = new Error(message) as ResolverError;
  err.kind = kind;

  if (extras) {
    if (typeof extras.status === "number") err.status = extras.status;
    if ("payload" in extras) err.payload = extras.payload;
  }

  return err;
}

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

export function canonicalizeRoomId(input: string): string {
  const seg = lastPathSegment(String(input || ""));
  return underscoreVariant(sanitizeRoomIdKeepHyphen(seg)).replace(/^_+|_+$/g, "");
}

function uniqueStrings(values: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();

  for (const value of values) {
    const v = String(value || "").trim();
    if (!v) continue;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }

  return out;
}

/**
 * FAST CLIENT MODE:
 * - do not fan out aggressively on the client
 * - let secure-room-loader own the heavy candidate logic
 * - try at most raw + canonical
 */
function buildRoomIdCandidates(input: string): string[] {
  const rawSegment = stripJsonSuffix(lastPathSegment(String(input || ""))).trim();
  const canonical = canonicalizeRoomId(rawSegment);
  const safeRaw = sanitizeRoomIdKeepHyphen(rawSegment);
  const hyphenSafe = hyphenVariant(safeRaw);

  return uniqueStrings([
    rawSegment,
    canonical,
    safeRaw,
    hyphenSafe,
  ]);
}

function buildLocalRoomIdCandidates(input: string): string[] {
  const base = buildRoomIdCandidates(input);

  const expanded: string[] = [];
  for (const value of base) {
    const stripped = stripJsonSuffix(String(value || "")).trim();
    if (!stripped) continue;

    expanded.push(stripped);
    expanded.push(canonicalizeRoomId(stripped));
    expanded.push(underscoreVariant(stripped));
    expanded.push(hyphenVariant(stripped));
  }

  return uniqueStrings(
    expanded
      .map((s) => stripJsonSuffix(String(s || "")).trim())
      .map((s) => s.replace(/^[_-]+|[_-]+$/g, ""))
      .filter(Boolean),
  );
}

export function normalizeRoomIdForCanonicalFile(input: string): string {
  return canonicalizeRoomId(input);
}

function buildSecureRoomLoaderUrl(): string {
  const env = (import.meta as ImportMeta & {
    env?: Record<string, string | undefined>;
  })?.env;

  const functionsBase = String(env?.VITE_SUPABASE_FUNCTIONS_URL || "").trim();
  if (functionsBase) {
    return `${functionsBase.replace(/\/+$/, "")}/secure-room-loader`;
  }

  const supabaseUrl = String(env?.VITE_SUPABASE_URL || "").trim();
  if (supabaseUrl) {
    return `${supabaseUrl.replace(/\/+$/, "")}/functions/v1/secure-room-loader`;
  }

  return "/functions/v1/secure-room-loader";
}

function toPublicPath(path: string): string {
  const clean = String(path || "").trim().replace(/^\/+/, "");
  return clean ? `/${clean}` : "";
}

function buildLocalRoomJsonPaths(roomIdRaw: string): string[] {
  const ids = buildLocalRoomIdCandidates(roomIdRaw);
  const paths: string[] = [];

  for (const id of ids) {
    const manifestPath = String(PUBLIC_ROOM_MANIFEST?.[id] || "").trim();
    if (manifestPath) {
      paths.push(toPublicPath(manifestPath));
    }

    const canonical = canonicalizeRoomId(id);
    if (canonical) {
      paths.push(`/data/${canonical}.json`);
    }
  }

  return uniqueStrings(paths);
}

/**
 * Compatibility path resolver:
 * - prefer a concrete local JSON path when the manifest knows it
 * - otherwise return the secure loader endpoint
 *
 * NOTE:
 * - loadRoomJson() still prefers secure-room-loader first.
 * - local JSON is used as a fallback path when secure lookup cannot supply the room.
 */
export function resolveRoomJsonPath(roomIdRaw: string): string {
  const localPath = buildLocalRoomJsonPaths(roomIdRaw)[0];
  if (localPath) {
    return localPath;
  }

  return buildSecureRoomLoaderUrl();
}

function getAnonKey(): string {
  const env = (import.meta as ImportMeta & {
    env?: Record<string, string | undefined>;
  })?.env;

  return String(env?.VITE_SUPABASE_ANON_KEY || "").trim();
}

async function buildSecureLoaderHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const anonKey = getAnonKey();
  if (anonKey) {
    headers.apikey = anonKey;
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const accessToken = String(session?.access_token || "").trim();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
  } catch {
    // ignore; server will return 401 if needed
  }

  return headers;
}

async function parseJsonResponse(res: Response): Promise<any> {
  const text = await res.text();
  const trimmed = text.trim();
  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  const looksLikeHtml = /^\s*<!doctype html>|^\s*<html/i.test(trimmed);

  let parsed: unknown = null;

  if (trimmed && !looksLikeHtml) {
    const looksJsonish =
      contentType.includes("application/json") ||
      trimmed.startsWith("{") ||
      trimmed.startsWith("[");

    if (looksJsonish) {
      try {
        parsed = JSON.parse(trimmed);
      } catch {
        parsed = null;
      }
    }
  }

  if (!res.ok) {
    if (res.status === 404 || looksLikeHtml) {
      throw createResolverError("ROOM_NOT_FOUND", "not_found", {
        status: 404,
        payload: parsed,
      });
    }

    throw createResolverError(`HTTP_${res.status}`, "server", {
      status: res.status,
      payload: parsed,
    });
  }

  if (!trimmed) {
    throw createResolverError("JSON_INVALID", "json_invalid", {
      status: res.status,
      payload: parsed,
    });
  }

  if (looksLikeHtml) {
    throw createResolverError("JSON_INVALID", "json_invalid", {
      status: res.status,
      payload: parsed,
    });
  }

  if (parsed !== null) {
    return parsed;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    throw createResolverError("JSON_INVALID", "json_invalid", {
      status: res.status,
    });
  }
}

function hasRenderableRoomShape(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;

  const obj = value as Record<string, unknown>;

  if (Array.isArray(obj.entries) && obj.entries.length > 0) return true;
  if (typeof obj.id === "string" && obj.id.trim()) return true;
  if (typeof obj.title_en === "string" && obj.title_en.trim()) return true;
  if (typeof obj.title_vi === "string" && obj.title_vi.trim()) return true;
  if (typeof obj.name_en === "string" && obj.name_en.trim()) return true;
  if (typeof obj.name_vi === "string" && obj.name_vi.trim()) return true;

  const title = obj.title as Record<string, unknown> | undefined;
  if (title && typeof title === "object") {
    const en = typeof title.en === "string" ? title.en.trim() : "";
    const vi = typeof title.vi === "string" ? title.vi.trim() : "";
    if (en || vi) return true;
  }

  const name = obj.name as Record<string, unknown> | undefined;
  if (name && typeof name === "object") {
    const en = typeof name.en === "string" ? name.en.trim() : "";
    const vi = typeof name.vi === "string" ? name.vi.trim() : "";
    if (en || vi) return true;
  }

  return false;
}

function isValidResolvedRoomPayload(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") return false;

  const obj = payload as Record<string, unknown>;

  if (hasRenderableRoomShape(obj)) return true;

  if (obj.room && typeof obj.room === "object" && hasRenderableRoomShape(obj.room)) {
    return true;
  }

  return false;
}

function errorRank(error: unknown): number {
  const kind = String((error as ResolverError | null | undefined)?.kind || "").trim();
  if (kind === "network") return 4;
  if (kind === "server") return 3;
  if (kind === "json_invalid") return 2;
  if (kind === "not_found") return 1;
  return 0;
}

function keepStrongerError(current: unknown, next: unknown): unknown {
  if (!current) return next;
  if (!next) return current;
  return errorRank(next) >= errorRank(current) ? next : current;
}

function shouldTryLocalFallback(error: unknown): boolean {
  const err = error as ResolverError | null | undefined;
  const kind = String(err?.kind || "").trim();
  const status = Number(err?.status || 0);

  if (kind === "not_found") return true;
  if (kind === "network") return true;
  if (kind === "json_invalid") return true;

  if (kind === "server") {
    if (status === 401 || status === 403) {
      return false;
    }
    return true;
  }

  return false;
}

async function tryFetchSecureJson(roomId: string): Promise<any> {
  const secureUrl = buildSecureRoomLoaderUrl();
  const headers = await buildSecureLoaderHeaders();

  let res: Response;
  try {
    res = await fetch(secureUrl, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({ roomId }),
    });
  } catch {
    throw createResolverError("NETWORK_ERROR", "network");
  }

  return await parseJsonResponse(res);
}

async function tryFetchLocalJson(roomId: string): Promise<any> {
  const paths = buildLocalRoomJsonPaths(roomId);

  if (paths.length === 0) {
    throw createResolverError("ROOM_NOT_FOUND", "not_found");
  }

  let lastError: unknown = null;

  for (const path of paths) {
    try {
      const res = await fetch(path, {
        method: "GET",
        credentials: "same-origin",
      });

      return await parseJsonResponse(res);
    } catch (error) {
      lastError = keepStrongerError(lastError, error);
    }
  }

  if (lastError && typeof lastError === "object" && "kind" in (lastError as object)) {
    throw lastError as ResolverError;
  }

  throw createResolverError("ROOM_NOT_FOUND", "not_found");
}

export async function loadRoomJson(roomIdRaw: string): Promise<any> {
  const candidates = buildRoomIdCandidates(roomIdRaw);

  if (candidates.length === 0) {
    throw createResolverError("ROOM_NOT_FOUND", "not_found");
  }

  let lastError: unknown = null;

  for (const roomId of candidates) {
    try {
      const payload = await tryFetchSecureJson(roomId);

      if (!isValidResolvedRoomPayload(payload)) {
        throw createResolverError("ROOM_PAYLOAD_INVALID", "json_invalid");
      }

      return payload;
    } catch (error) {
      lastError = keepStrongerError(lastError, error);

      if (!shouldTryLocalFallback(error)) {
        continue;
      }

      try {
        const payload = await tryFetchLocalJson(roomId);

        if (!isValidResolvedRoomPayload(payload)) {
          throw createResolverError("ROOM_PAYLOAD_INVALID", "json_invalid");
        }

        return payload;
      } catch (localError) {
        lastError = keepStrongerError(lastError, localError);
      }
    }
  }

  if (lastError && typeof lastError === "object" && "kind" in (lastError as object)) {
    throw lastError as ResolverError;
  }

  throw createResolverError("ROOM_NOT_FOUND", "not_found");
}