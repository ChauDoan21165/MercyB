// PATH: src/lib/roomIndex.ts
// File: roomIndex.ts

// Public static room discovery is intentionally disabled.
// Rooms must be resolved through the secure server-side / edge-function path.
//
// Why this file still exists:
// - to preserve imports while removing the old `/public/data` backdoor
// - to keep canonical room-id normalization in one place
//
// Any caller that still depends on `resolveRoomJsonPath()` returning `/data/...`
// is still on the legacy insecure path and should be migrated to the secure loader.

export type RoomIndexEntry = {
  id: string;
  urlPath: string;
};

let warned = false;

const toCanonicalId = (s: string) =>
  String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\.json$/i, "")
    .replace(/^\/?data\//i, "")
    .replace(/^\/?public\/data\//i, "")
    .replace(/["'`]+/g, "")
    .replace(/[^\w\s-]+/g, "_")
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

function toCoreRoomId(s: string): string {
  return toCanonicalId(s).replace(/_(vip[1-9]|free)$/i, "");
}

function getRoomIdCandidates(roomId: string): string[] {
  const canonical = toCanonicalId(roomId);
  const core = toCoreRoomId(canonical);
  return Array.from(new Set([canonical, core].filter(Boolean)));
}

function warnOnce() {
  if (warned) return;
  warned = true;

  if (typeof console !== "undefined") {
    console.warn(
      "[roomIndex] Static public room JSON lookup is disabled. " +
        "Use the secure room loader / edge-function path instead.",
    );
  }
}

export function getRoomIndex(): RoomIndexEntry[] {
  warnOnce();
  return [];
}

/**
 * Legacy compatibility only.
 * This intentionally does not return a public /data path anymore.
 * Callers should migrate to the secure loader path.
 */
export function resolveRoomJsonPath(roomId: string): string {
  void roomId;
  warnOnce();
  return "";
}

export function canonicalizeRoomId(roomId: string): string {
  return toCanonicalId(roomId);
}

/**
 * Migration helper for callers that need consistent canonical/core candidates
 * while moving off the old public JSON path.
 */
export function getCanonicalRoomIdCandidates(roomId: string): string[] {
  return getRoomIdCandidates(roomId);
}

/**
 * Migration helper for callers moving off the old public JSON path.
 */
export function resolveSecureRoomLoaderPath(roomId: string): string {
  const id = canonicalizeRoomId(roomId);
  if (!id) return "";

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