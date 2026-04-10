// src/lib/roomIndex.ts
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
    .replace(/[^\w]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

function warnOnce() {
  if (warned) return;
  warned = true;

  if (typeof console !== "undefined") {
    console.warn(
      "[roomIndex] Static public room JSON lookup is disabled. " +
        "Use the secure room loader / edge-function path instead."
    );
  }
}

export function getRoomIndex(): RoomIndexEntry[] {
  warnOnce();
  return [];
}

export function resolveRoomJsonPath(roomId: string): string | null {
  void roomId;
  warnOnce();
  return null;
}

export function canonicalizeRoomId(roomId: string): string {
  return toCanonicalId(roomId);
}