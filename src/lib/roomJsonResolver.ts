// src/lib/roomJsonResolver.ts
// MB-BLUE-95.7a — 2026-01-22 (+0700)
// FIX: tolerate legacy roomId input that includes ".json" or "/data/" prefixes.
// RULE: Canonical roomId is snake_case WITHOUT ".json".
// Resolver remains the ONLY source of truth.
//
// TEST FIX (95.7a):
// - Export __mock for vitest snapshot tests that import it.
// - NO runtime behavior changes.

import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";

export type RoomJsonResolverErrorKind =
  | "not_found"
  | "json_invalid"
  | "network"
  | "server";

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

export function resolveRoomJsonPath(roomIdRaw: string): string {
  const id = canonicalizeRoomId(roomIdRaw);

  // Manifest stores paths like "data/xxx.json"
  const fromManifest = PUBLIC_ROOM_MANIFEST[id];

  // If manifest exists, trust it.
  if (fromManifest) return fromManifest;

  // Otherwise default to canonical:
  return `data/${id}.json`;
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

/**
 * TEST HOOK (Vitest):
 * Some snapshot/unit tests import { __mock } from this module.
 * Keep it tiny and stable.
 */
export const __mock = {
  canonicalizeRoomId,
  normalizeRoomIdForCanonicalFile,
  resolveRoomJsonPath,
  loadRoomJson,
};
