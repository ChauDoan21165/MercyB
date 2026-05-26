// src/lib/roomJsonResolver.ts
// MB-BLUE-95.7 — 2025-12-27 (+0700)
// FIX: tolerate legacy roomId input that includes ".json" or "/data/" prefixes.
// RULE: Canonical roomId is snake_case WITHOUT ".json".
// Resolver remains the ONLY source of truth.

import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";
import { isOnline } from "@/lib/offline/offlineDetector";
import { getRoom } from "@/lib/offline/offlineDb";

export type RoomJsonResolverErrorKind =
  | "not_found"
  | "json_invalid"
  | "network"
  | "server"
  | "offline_unavailable";

function stripJsonSuffix(s: string): string {
  // Remove ONLY a trailing ".json" (case-insensitive)
  return s.replace(/\.json$/i, "");
}

function lastPathSegment(s: string): string {
  const cleaned = (s || "").trim();
  if (!cleaned) return "";
  const withoutQuery = cleaned.split("?")[0] || cleaned;
  const parts = withoutQuery.split("/").filter(Boolean);
  return parts.length ? parts[parts.length - 1] : withoutQuery;
}

export function canonicalizeRoomId(input: string): string {
  // Accept roomId like:
  // - "depression_support_vip1"
  // - "depression_support_vip1.json"
  // - "/data/depression_support_vip1.json"
  // - "data/depression_support_vip1.json"
  // - "/room/depression_support_vip1.json" (rare, but tolerate)
  const seg = lastPathSegment(String(input || ""));

  const noJson = stripJsonSuffix(seg)
    .replace(/^data_/i, "data_") // no-op, just clarity
    .replace(/^data$/i, "data") // no-op
    .replace(/^data\./i, "data.") // no-op
    .trim();

  // If someone pasted "data/xxx" as the segment (because lastPathSegment),
  // that would already be "xxx" — but keep safe:
  const normalized = noJson
    .replace(/^data_/, "data_") // no-op
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_");

  return normalized;
}

/**
 * Compatibility export (older code/scripts may import this name).
 * Keep it as an alias to the canonical behavior.
 */
export function normalizeRoomIdForCanonicalFile(input: string): string {
  return canonicalizeRoomId(input);
}

/**
 * Normalize an offline pack to the same room shape RoomRenderer consumes
 * online. A1's downloadRoomPack stores a RoomPackJson envelope:
 *
 *   { roomId, title, room, entries, keywords, audioUrls, downloadedAt }
 *
 * `pack.room` is the original room JSON. RoomRenderer derives keyword
 * chips from `room.keywords_en/vi` (top-level) AND from per-entry
 * `keywords_en/vi`. The online flow always has BOTH because the JSON
 * file ships both. When offline, we must guarantee the same: if the
 * envelope's stored `room` happens to be missing the top-level keyword
 * arrays — which can happen for older packs or DB-driven rooms whose
 * keywords live only per-entry — synthesize them from the entries so
 * RoomRenderer's `resolveKeywords` fallback chain has a hit.
 *
 * Returns null when the stored value isn't usable.
 */
export function normalizeOfflineRoom(stored: unknown): Record<string, unknown> | null {
  if (!stored || typeof stored !== "object") return null;
  const pack = stored as Record<string, unknown>;

  // Envelope vs flat: prefer pack.room when present.
  const inner = pack.room;
  const baseSource =
    inner && typeof inner === "object" ? (inner as Record<string, unknown>) : pack;

  // Shallow-clone so we don't mutate the IDB snapshot (structuredClone
  // already returned a copy, but stay defensive — RoomRenderer's
  // pre-processors may mutate in place).
  const room: Record<string, unknown> = { ...baseSource };

  // Backfill entries from the envelope if the inner room lost them.
  const innerEntries = Array.isArray(room.entries) ? (room.entries as unknown[]) : [];
  if (innerEntries.length === 0) {
    const envEntries = Array.isArray(pack.entries) ? (pack.entries as unknown[]) : [];
    if (envEntries.length > 0) {
      room.entries = envEntries;
    }
  }

  // Backfill room-level keywords_en/vi from entry-level keyword arrays
  // when the room itself doesn't carry them. Mirrors the online
  // experience where RoomRenderer's `resolveKeywords` reads top-level
  // arrays — without this backfill, offline rooms whose chips would
  // otherwise come from DB rows render with no chips at all.
  const hasKwEn =
    Array.isArray(room.keywords_en) && (room.keywords_en as unknown[]).length > 0;
  const hasKwVi =
    Array.isArray(room.keywords_vi) && (room.keywords_vi as unknown[]).length > 0;

  if (!hasKwEn || !hasKwVi) {
    const collected = collectEntryKeywords(
      Array.isArray(room.entries) ? (room.entries as unknown[]) : [],
    );
    if (!hasKwEn && collected.en.length > 0) {
      room.keywords_en = collected.en;
    }
    if (!hasKwVi && collected.vi.length > 0) {
      room.keywords_vi = collected.vi;
    }
  }

  return room;
}

function collectEntryKeywords(entries: unknown[]): { en: string[]; vi: string[] } {
  const en: string[] = [];
  const vi: string[] = [];
  const seenEn = new Set<string>();
  const seenVi = new Set<string>();

  for (const e of entries) {
    if (!e || typeof e !== "object") continue;
    const obj = e as Record<string, unknown>;
    const enArr = Array.isArray(obj.keywords_en) ? (obj.keywords_en as unknown[]) : [];
    for (const v of enArr) {
      const s = typeof v === "string" ? v.trim() : "";
      if (!s || seenEn.has(s)) continue;
      seenEn.add(s);
      en.push(s);
    }
    const viArr = Array.isArray(obj.keywords_vi) ? (obj.keywords_vi as unknown[]) : [];
    for (const v of viArr) {
      const s = typeof v === "string" ? v.trim() : "";
      if (!s || seenVi.has(s)) continue;
      seenVi.add(s);
      vi.push(s);
    }
  }

  return { en, vi };
}

export function resolveRoomJsonPath(roomIdRaw: string): string {
  const id = canonicalizeRoomId(roomIdRaw);

  // Manifest stores paths like "data/xxx.json"
  const fromManifest = PUBLIC_ROOM_MANIFEST[id];

  // If manifest exists, trust it.
  if (fromManifest) return fromManifest;

  // Otherwise default to canonical:
  return `data/${id}.json`;
}

/**
 * Offline fallback source: the explicit-download IDB pack written by
 * A1's downloadRoomPack. Consulted ONLY when the SW-served fetch in
 * loadRoomJson can't produce the room (genuine offline + the room was
 * never visited online, so the Workbox `lessons` SWR / 38-room precache
 * has no entry). Returns null on any miss.
 */
async function tryOfflinePack(
  id: string,
): Promise<Record<string, unknown> | null> {
  try {
    const cached = await getRoom(id);
    return normalizeOfflineRoom(cached?.json);
  } catch {
    // IDB unavailable / blocked
    return null;
  }
}

export async function loadRoomJson(roomIdRaw: string): Promise<any> {
  const id = canonicalizeRoomId(roomIdRaw);

  const manifestPath = resolveRoomJsonPath(id);

  // Always fetch from root ("/data/..."), never relative ("data/...")
  const baseUrl = manifestPath.startsWith("/") ? manifestPath : `/${manifestPath}`;

  // DEV ONLY: cache buster to avoid stale browser/Vite caching while
  // debugging. Production MUST stay query-less: the bare /data/<id>.json
  // URL is what matches the Workbox `lessons` StaleWhileRevalidate rule
  // (vite.config.ts  /\/(?:lessons|data)\/.*\.json$/), and that SW cache
  // is what serves a visited-then-offline room.
  const url = import.meta.env.DEV ? `${baseUrl}?t=${Date.now()}` : baseUrl;

  // Fetch-first, even when navigator.onLine is false. The service
  // worker's `lessons` SWR cache holds /data/<id>.json for every room
  // the user opened online (plus the ~38-room precache), so when offline
  // this fetch is answered from the SW cache with no network. Only when
  // the SW genuinely has nothing does fetch reject — then fall back to
  // the explicit-download IDB pack, then OFFLINE_UNAVAILABLE.
  //
  // Previously this short-circuited to the IDB pack whenever
  // !isOnline() and never issued the fetch, so the SW `lessons` cache
  // could never serve a "visited then offline" room — only the ~38
  // precached or explicitly-downloaded rooms worked offline.
  // (production-readiness sweep — Area 4 / Top-5 #5.)
  let res: Response;
  try {
    res = await fetch(url, import.meta.env.DEV ? { cache: "no-store" } : undefined);
  } catch {
    const offlinePack = await tryOfflinePack(id);
    if (offlinePack) return offlinePack;
    const online = isOnline();
    const err = new Error(online ? "NETWORK_ERROR" : "OFFLINE_UNAVAILABLE");
    (err as any).kind = (online
      ? "network"
      : "offline_unavailable") satisfies RoomJsonResolverErrorKind;
    throw err;
  }

  if (res.status === 404) {
    const err = new Error("ROOM_NOT_FOUND");
    (err as any).kind = "not_found" satisfies RoomJsonResolverErrorKind;
    throw err;
  }

  if (!res.ok) {
    const err = new Error(`HTTP_${res.status}`);
    (err as any).kind = "server" satisfies RoomJsonResolverErrorKind;
    throw err;
  }

  // ✅ Guard: Vercel SPA fallback can return 200 + HTML (index.html) for missing JSON
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  const text = await res.text();

  // If it's clearly HTML, treat as not_found so callers can fallback to DB
  if (!ct.includes("application/json") && /^\s*<!doctype html>|^\s*<html/i.test(text)) {
    const err = new Error("ROOM_NOT_FOUND");
    (err as any).kind = "not_found" satisfies RoomJsonResolverErrorKind;
    throw err;
  }

  try {
    return JSON.parse(text);
  } catch {
    const err = new Error("JSON_INVALID");
    (err as any).kind = "json_invalid" satisfies RoomJsonResolverErrorKind;
    throw err;
  }
}