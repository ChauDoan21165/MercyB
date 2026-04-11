// PATH: src/lib/roomTierIndex.ts
// MB-BLUE-103.1 — 2026-04-10
//
// ROOM TIER INDEX (RUNTIME, DB/SECURE SOURCE)
//
// PURPOSE:
// - Tier truth for UI comes from room id / explicit DB tier metadata,
//   not from public/data manifests.
// - Build and cache a Tier -> roomIds index from loadRoomsForTiers().
//
// NOTES:
// - Tier7 / Tier8 may be intentionally empty -> OK
// - Unknown tier (no explicit tier signal) is tracked under "unknown"
//
// Exports:
// - ALL_TIER_KEYS
// - TierKey
// - inferTierFromRoomId
// - buildRoomTierIndexFromIds
// - buildRoomTierIndexFromRooms
// - refreshRoomTierIndex
// - ensureRoomTierIndexLoaded
// - ROOM_IDS_BY_TIER (mutable runtime cache)
// - ROOM_COUNTS_BY_TIER (mutable runtime cache)
// - getRoomsForTier
// - getAllRoomIdsSorted

import { loadRoomsForTiers, type TierRoom } from "@/lib/tierRoomSource";

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

let loadPromise: Promise<RoomTierIndex> | null = null;

function normalizeIdLike(v: string): string {
  return String(v || "")
    .trim()
    .toLowerCase()
    .replace(/\.json$/i, "")
    .replace(/["'`]+/g, "")
    .replace(/[^\w\s-]+/g, "_")
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
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

function isTierKey(value: string): value is TierKey {
  return (ALL_TIER_KEYS as readonly string[]).includes(value);
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

function sortIndex(idx: RoomTierIndex): RoomTierIndex {
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
 * Legacy-compatible pure builder from raw ids.
 * Useful in tests or callers that already have room ids.
 */
export function buildRoomTierIndexFromIds(ids: string[]): RoomTierIndex {
  const idx = emptyIndex();

  for (const idRaw of ids || []) {
    const id = String(idRaw || "").trim();
    if (!id) continue;

    const inferred = inferTierFromRoomId(id);
    const bucket: TierKey = inferred || "unknown";
    idx[bucket].push(id);
  }

  return sortIndex(idx);
}

/**
 * Preferred builder from TierRoom rows loaded via the secure tier source.
 */
export function buildRoomTierIndexFromRooms(rooms: TierRoom[]): RoomTierIndex {
  const idx = emptyIndex();

  for (const room of rooms || []) {
    const id = String(room?.id || "").trim();
    if (!id) continue;

    const explicitTier = String(room?.tier || "").trim().toLowerCase();
    const inferred = inferTierFromRoomId(id);

    let bucket: TierKey = "unknown";
    if (isTierKey(explicitTier)) bucket = explicitTier;
    else if (inferred) bucket = inferred;

    idx[bucket].push(id);
  }

  return sortIndex(idx);
}

function overwriteIndex(target: RoomTierIndex, source: RoomTierIndex): void {
  for (const key of ALL_TIER_KEYS) {
    target[key].splice(0, target[key].length, ...source[key]);
  }
}

function overwriteCounts(
  target: Record<TierKey, number>,
  source: RoomTierIndex
): void {
  for (const key of ALL_TIER_KEYS) {
    target[key] = source[key].length;
  }
}

/**
 * Mutable runtime cache.
 * Starts empty until ensureRoomTierIndexLoaded()/refreshRoomTierIndex() runs.
 */
export const ROOM_IDS_BY_TIER: RoomTierIndex = emptyIndex();

export const ROOM_COUNTS_BY_TIER: Record<TierKey, number> = ALL_TIER_KEYS.reduce(
  (acc, k) => {
    acc[k] = 0;
    return acc;
  },
  {} as Record<TierKey, number>
);

/**
 * Force-refresh the tier index from the DB/secure tier source.
 */
export async function refreshRoomTierIndex(): Promise<RoomTierIndex> {
  const result = await loadRoomsForTiers();
  const nextIndex = buildRoomTierIndexFromRooms(result.rooms);

  overwriteIndex(ROOM_IDS_BY_TIER, nextIndex);
  overwriteCounts(ROOM_COUNTS_BY_TIER, nextIndex);

  return ROOM_IDS_BY_TIER;
}

/**
 * Load the runtime cache once.
 * Safe to call repeatedly.
 */
export async function ensureRoomTierIndexLoaded(): Promise<RoomTierIndex> {
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = refreshRoomTierIndex().finally(() => {
    loadPromise = null;
  });

  return loadPromise;
}

/**
 * Convenience helpers.
 * These return the current runtime snapshot.
 * Call ensureRoomTierIndexLoaded() first if you need populated values.
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