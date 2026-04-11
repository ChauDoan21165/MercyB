// PATH: src/lib/roomJsonResolver.ts
// File: roomJsonResolver.ts

export type RoomJsonResolverErrorKind =
  | "not_found"
  | "json_invalid"
  | "network"
  | "server";

type ResolverError = Error & { kind?: RoomJsonResolverErrorKind };

function createResolverError(
  message: string,
  kind: RoomJsonResolverErrorKind,
): ResolverError {
  const err = new Error(message) as ResolverError;
  err.kind = kind;
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

function coreRoomIdVariant(input: string): string {
  return String(input || "").replace(
    /(?:[_-](?:vip[1-9]|free|kids[_-]?[123]|kidslevel[123]|kids_l[123]|vip3[_-]?ii))$/i,
    "",
  );
}

export function canonicalizeRoomId(input: string): string {
  const seg = lastPathSegment(String(input || ""));
  return underscoreVariant(sanitizeRoomIdKeepHyphen(seg)).replace(/^_+|_+$/g, "");
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

export function normalizeRoomIdForCanonicalFile(input: string): string {
  return canonicalizeRoomId(input);
}

/**
 * Secure runtime only.
 * Room JSON is no longer resolved through PUBLIC_ROOM_MANIFEST or /data/*.json.
 */
export function resolveRoomJsonPath(roomIdRaw: string): string {
  const id = canonicalizeRoomId(roomIdRaw);
  return buildSecureRoomLoaderUrl(id);
}

function buildSecureRoomLoaderUrl(_roomId: string): string {
  const envBase = String(
    (import.meta as ImportMeta & {
      env?: Record<string, string | undefined>;
    })?.env?.VITE_SUPABASE_FUNCTIONS_URL || "",
  ).trim();

  if (envBase) {
    return `${envBase.replace(/\/+$/, "")}/secure-room-loader`;
  }

  return "/functions/v1/secure-room-loader";
}

async function parseJsonResponse(res: Response): Promise<any> {
  if (res.status === 404) {
    throw createResolverError("ROOM_NOT_FOUND", "not_found");
  }

  const text = await res.text();
  const trimmed = text.trim();
  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  const looksLikeHtml = /^\s*<!doctype html>|^\s*<html/i.test(trimmed);

  if (!res.ok) {
    if (res.status === 404) {
      throw createResolverError("ROOM_NOT_FOUND", "not_found");
    }

    if (looksLikeHtml) {
      throw createResolverError("ROOM_NOT_FOUND", "not_found");
    }

    throw createResolverError(`HTTP_${res.status}`, "server");
  }

  if (!trimmed) {
    throw createResolverError("JSON_INVALID", "json_invalid");
  }

  if (looksLikeHtml) {
    throw createResolverError("JSON_INVALID", "json_invalid");
  }

  if (!contentType.includes("application/json")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      throw createResolverError("JSON_INVALID", "json_invalid");
    }
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    throw createResolverError("JSON_INVALID", "json_invalid");
  }
}

async function tryFetchSecureJson(roomId: string): Promise<any> {
  const secureUrl = buildSecureRoomLoaderUrl(roomId);

  let res: Response;
  try {
    res = await fetch(secureUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ roomId }),
    });
  } catch {
    throw createResolverError("NETWORK_ERROR", "network");
  }

  return parseJsonResponse(res);
}

export async function loadRoomJson(roomIdRaw: string): Promise<any> {
  const candidates = buildRoomIdCandidates(roomIdRaw);

  if (candidates.length === 0) {
    throw createResolverError("ROOM_NOT_FOUND", "not_found");
  }

  let lastError: unknown = null;

  for (const roomId of candidates) {
    try {
      return await tryFetchSecureJson(roomId);
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError && typeof lastError === "object" && "kind" in (lastError as object)) {
    throw lastError as ResolverError;
  }

  throw createResolverError("ROOM_NOT_FOUND", "not_found");
}