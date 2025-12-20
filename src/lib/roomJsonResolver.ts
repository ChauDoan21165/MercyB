// src/lib/roomJsonResolver.ts
// MB-BLUE-15.1 — 2025-12-20 — Canonical resolver + compat exports + DEV-only cache bust

/**
 * Room JSON Resolver (Canonical)
 * Single source of truth for resolving + loading room JSON from /public/data
 *
 * Runtime fetch path: /data/{roomId}.json (or PUBLIC_ROOM_MANIFEST override)
 *
 * Rules:
 * - Canonical roomId is snake_case
 * - Prefer PUBLIC_ROOM_MANIFEST mapping when present
 * - No guessing beyond canonicalization
 */

import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";

export type RoomJsonResolverErrorKind =
  | "not_found"
  | "json_invalid"
  | "network"
  | "server";

export function canonicalizeRoomId(input: string): string {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_");
}

/**
 * Compatibility export (older code/scripts may import this name).
 * Keep it as an alias to the canonical behavior.
 */
export function normalizeRoomIdForCanonicalFile(input: string): string {
  return canonicalizeRoomId(input);
}

export function resolveRoomJsonPath(roomIdRaw: string): string {
  const id = canonicalizeRoomId(roomIdRaw);
  // Manifest stores paths like "data/xxx.json"
  return PUBLIC_ROOM_MANIFEST[id] || `data/${id}.json`;
}

export async function loadRoomJson(roomIdRaw: string): Promise<any> {
  const id = canonicalizeRoomId(roomIdRaw);
  const manifestPath = resolveRoomJsonPath(id);

  // Always fetch from root ("/data/..."), never relative ("data/...")
  const baseUrl = manifestPath.startsWith("/") ? manifestPath : `/${manifestPath}`;

  // DEV ONLY: cache buster to avoid stale browser/Vite caching while debugging
  const url = import.meta.env.DEV ? `${baseUrl}?t=${Date.now()}` : baseUrl;

  let res: Response;
  try {
    res = await fetch(url, import.meta.env.DEV ? { cache: "no-store" } : undefined);
  } catch {
    const err = new Error("NETWORK_ERROR");
    (err as any).kind = "network" satisfies RoomJsonResolverErrorKind;
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

  try {
    return await res.json();
  } catch {
    const err = new Error("JSON_INVALID");
    (err as any).kind = "json_invalid" satisfies RoomJsonResolverErrorKind;
    throw err;
  }
}
