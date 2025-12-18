// MB-BLUE-14.7 — 2025-12-18
/**
 * Room JSON Resolver (Canonical)
 * Single source of truth for resolving and loading room JSON from /public/data
 * Runtime fetch path: /data/{roomId}.json
 *
 * Rules:
 * - Canonical roomId is snake_case
 * - Prefer PUBLIC_ROOM_MANIFEST mapping when present
 * - No guessing, no kebab/underscore swapping beyond canonicalization
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

export async function resolveRoomJsonPath(roomIdRaw: string): Promise<string> {
  const id = canonicalizeRoomId(roomIdRaw);
  // Manifest stores paths like "data/xxx.json"
  return PUBLIC_ROOM_MANIFEST[id] || `data/${id}.json`;
}

export async function loadRoomJson(roomIdRaw: string): Promise<any> {
  const id = canonicalizeRoomId(roomIdRaw);
  const manifestPath = await resolveRoomJsonPath(id);

  // cache buster to avoid stale CDN when debugging
  const url = `/${manifestPath}?t=${Date.now()}`;

  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch (e) {
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
  } catch (e) {
    const err = new Error("JSON_INVALID");
    (err as any).kind = "json_invalid" satisfies RoomJsonResolverErrorKind;
    throw err;
  }
}
