// src/lib/roomTierIndex.ts
// MB-BLUE-103.0 — 2026-01-01 (+0700)
//
// ROOM TIER INDEX (RUNTIME, NO FETCH, NO FS)
//
// PURPOSE (LOCKED):
// - Tier truth for UI comes from room id / filename (NOT json.tier)
// - Build a stable Tier -> roomIds index from the generated PUBLIC_ROOM_MANIFEST
//
// NOTES:
// - Tier7 / Tier8 may be intentionally empty -> OK
// - Unknown tier (no vip/free token in id) is tracked under "unknown"
//
// Exports:
// - ALL_TIER_KEYS
// - TierKey
// - inferTierFromRoomId
// - buildRoomTierIndex
// - ROOM_IDS_BY_TIER (computed once at import)
// - ROOM_COUNTS_BY_TIER

import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";

export const ALL_TIER_KEYS = [
  "free",
  "vip1",
  "vip2",
  "vip3",
  "vip4",
  "vip5",
  "vip6",
  "vip7",
  "vip8",
  "vip9",
  "unknown",
] as const;

export type TierKey = (typeof ALL_TIER_KEYS)[number];

export type RoomTierIndex = Record<TierKey, string[]>;

function normalizeIdLike(v: string): string {
  return String(v || "")
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_");
}

/**
 * Infers tier from a room id / filename:
 * - ..._vip9... => vip9
 * - ..._free... => free
 * Returns null if not found.
 */
export function inferTierFromRoomId(roomIdOrFilename: string): TierKey | null {
  const t = normalizeIdLike(roomIdOrFilename);

  const mVip = t.match(/(^|_)vip([1-9])(_|$)/);
  if (mVip) return `vip${Number(mVip[2])}` as TierKey;

  const mFree = t.match(/(^|_)free(_|$)/);
  if (mFree) return "free";

  return null;
}

function emptyIndex(): RoomTierIndex {
  return {
    free: [],
    vip1: [],
    vip2: [],
    vip3: [],
    vip4: [],
    vip5: [],
    vip6: [],
    vip7: [],
    vip8: [],
    vip9: [],
    unknown: [],
  };
}

/**
 * Extract room IDs from PUBLIC_ROOM_MANIFEST safely.
 * We do not assume the exact shape beyond "it contains room ids somewhere".
 */
function extractRoomIdsFromManifest(manifest: unknown): string[] {
  if (!manifest) return [];

  // Most common: Record<roomId, "/data/room.json">
  if (typeof manifest === "object" && !Array.isArray(manifest)) {
    return Object.keys(manifest as Record<string, unknown>);
  }

  // Sometimes: Array<{ id: string, ... }>
  if (Array.isArray(manifest)) {
    const ids: string[] = [];
    for (const item of manifest) {
      const id = (item as any)?.id;
      if (typeof id === "string" && id.trim()) ids.push(id.trim());
    }
    return ids;
  }

  return [];
}

/**
 * Builds Tier -> roomIds index from manifest.
 * Sorting: alphabetical by normalized id (stable display baseline).
 */
export function buildRoomTierIndex(manifest: unknown = PUBLIC_ROOM_MANIFEST): RoomTierIndex {
  const idx = emptyIndex();

  const ids = extractRoomIdsFromManifest(manifest);

  for (const idRaw of ids) {
    const id = String(idRaw || "").trim();
    if (!id) continue;

    const inferred = inferTierFromRoomId(id);
    const bucket: TierKey = inferred || "unknown";
    idx[bucket].push(id);
  }

  // stable sort
  for (const k of ALL_TIER_KEYS) {
    idx[k].sort((a, b) => {
      const A = normalizeIdLike(a);
      const B = normalizeIdLike(b);
      if (A < B) return -1;
      if (A > B) return 1;
      return 0;
    });
  }

  return idx;
}

/**
 * Computed once at module import (fast, deterministic).
 */
export const ROOM_IDS_BY_TIER: RoomTierIndex = buildRoomTierIndex(PUBLIC_ROOM_MANIFEST);

export const ROOM_COUNTS_BY_TIER: Record<TierKey, number> = ALL_TIER_KEYS.reduce(
  (acc, k) => {
    acc[k] = ROOM_IDS_BY_TIER[k].length;
    return acc;
  },
  {} as Record<TierKey, number>
);

/**
 * Convenience helpers (optional)
 */
export function getRoomsForTier(tier: TierKey): string[] {
  return ROOM_IDS_BY_TIER[tier] || [];
}

export function getAllRoomIdsSorted(): string[] {
  return Object.values(ROOM_IDS_BY_TIER)
    .flat()
    .sort((a, b) => {
      const A = normalizeIdLike(a);
      const B = normalizeIdLike(b);
      if (A < B) return -1;
      if (A > B) return 1;
      return 0;
    });
}
