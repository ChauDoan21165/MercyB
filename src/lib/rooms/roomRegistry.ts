/**
 * File: roomRegistry.ts
 * Path: src/lib/rooms/roomRegistry.ts
 */

/**
 * Room Registry - Single Source of Truth for All Room Metadata
 *
 * Hybrid mode:
 * - In tests, prefers roomDataImports.roomDataMap (easy to mock, deterministic)
 * - In runtime, falls back to async roomFetcher
 *
 * Preserves:
 * - async cached registry + sync fallback
 * - domain + tags + counts helpers
 * - tolerant title/keyword field parsing
 * - id normalization (- -> _) so navigation/search/tests match
 * - tier inference via tierFromRoomId (VIP3II -> Level 3 collapse)
 */

import { getAllRooms as fetchAllRooms } from "@/lib/roomFetcher";
import { normalizeTier, TierId, ALL_TIER_IDS } from "@/lib/constants/tiers";
import { getDomainCategory, type DomainCategory } from "@/lib/teacher-mercy/domainMap";
import { tierFromRoomId } from "@/lib/tierFromRoomId";

// NOTE: Legacy roomDataImports.ts has been removed.
// The registry now bootstraps from roomFetcher (async) at runtime.
// Tests should mock fetchAllRooms instead of roomDataMap.

/**
 * Normalized room metadata for search and discovery
 */
export interface RoomMeta {
  id: string;
  tier: TierId;
  domain: DomainCategory;
  title_en: string;
  title_vi: string;
  keywords_en: string[];
  keywords_vi: string[];
  tags: string[];
  hasData: boolean;
}

type RawRoomEntry = {
  keywords_en?: unknown;
  keywords_vi?: unknown;
  keywordsEn?: unknown;
  keywordsVi?: unknown;
  tags?: unknown;
};

type RawRoomData = {
  id?: unknown;
  tier?: unknown;
  tierId?: unknown;
  accessTier?: unknown;
  domain?: string | null;
  title?: {
    en?: unknown;
    vi?: unknown;
  } | null;
  title_en?: unknown;
  title_vi?: unknown;
  titleEn?: unknown;
  titleVi?: unknown;
  name?: unknown;
  name_vi?: unknown;
  nameEn?: unknown;
  nameVi?: unknown;
  keywords?: unknown;
  keywords_en?: unknown;
  keywords_vi?: unknown;
  keywordsEn?: unknown;
  keywordsVi?: unknown;
  keywordMenu?: {
    en?: unknown;
    vi?: unknown;
  } | null;
  tags?: unknown;
  entries?: RawRoomEntry[] | null;
  hasData?: unknown;
  has_data?: unknown;
};

// Cache for room registry
let roomRegistryCache: RoomMeta[] | null = null;
let roomRegistryPromise: Promise<RoomMeta[]> | null = null;
let roomByIdCache: Map<string, RoomMeta> | null = null;

/**
 * Canonical room id in this repo uses underscores.
 * Accept hyphen inputs from URLs/navigation and normalize to underscore.
 */
const normalizeRoomId = (raw: string) =>
  String(raw ?? "")
    .trim()
    .replace(/-/g, "_")
    .replace(/__+/g, "_");

/** Lowercase + de-dupe + trim list */
function cleanList(values: unknown[]): string[] {
  return [
    ...new Set(
      values
        .map((v) => String(v ?? "").trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

function pickTitles(roomData: RawRoomData): { en: string; vi: string } {
  // Supports multiple formats:
  // 1) title: { en, vi }
  // 2) name + name_vi
  // 3) title_en/title_vi
  // 4) titleEn/titleVi
  // 5) nameEn/nameVi
  const en = String(
    roomData?.title?.en ??
      roomData?.title_en ??
      roomData?.titleEn ??
      roomData?.nameEn ??
      roomData?.name ??
      "",
  ).trim();

  const vi = String(
    roomData?.title?.vi ??
      roomData?.title_vi ??
      roomData?.titleVi ??
      roomData?.nameVi ??
      roomData?.name_vi ??
      "",
  ).trim();

  return { en, vi };
}

function toArray(v: unknown): unknown[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "string") return [v];
  return [];
}

function pickKeywords(roomData: RawRoomData): { en: string[]; vi: string[] } {
  // Room-level keyword variants:
  // - keywords_en / keywords_vi
  // - keywordsEn / keywordsVi
  // - keywordMenu: { en, vi }
  // - keywords: string[] (single list)
  const en: unknown[] = [];
  const vi: unknown[] = [];

  en.push(...toArray(roomData?.keywords_en));
  vi.push(...toArray(roomData?.keywords_vi));

  en.push(...toArray(roomData?.keywordsEn));
  vi.push(...toArray(roomData?.keywordsVi));

  en.push(...toArray(roomData?.keywordMenu?.en));
  vi.push(...toArray(roomData?.keywordMenu?.vi));

  // If only a single keywords list exists, include it in both (better than losing it)
  const flat = toArray(roomData?.keywords);
  if (flat.length) {
    en.push(...flat);
    vi.push(...flat);
  }

  // Entry-level keywords (old behavior)
  if (Array.isArray(roomData?.entries)) {
    for (const entry of roomData.entries) {
      en.push(...toArray(entry?.keywords_en));
      vi.push(...toArray(entry?.keywords_vi));
      en.push(...toArray(entry?.keywordsEn));
      vi.push(...toArray(entry?.keywordsVi));
    }
  }

  return { en: cleanList(en), vi: cleanList(vi) };
}

function pickTags(roomData: RawRoomData): string[] {
  const tags: unknown[] = [];

  // Entry-level tags (old behavior)
  if (Array.isArray(roomData?.entries)) {
    for (const entry of roomData.entries) {
      tags.push(...toArray(entry?.tags));
    }
  }

  // Some datasets might have room-level tags
  tags.push(...toArray(roomData?.tags));

  return cleanList(tags);
}

function inferTier(roomId: string, roomData: RawRoomData): TierId {
  // Prefer explicit tier if present, but normalize.
  // If missing/garbage, infer from ID (VIP3II -> Level 3 collapse handled in tierFromRoomId).
  const raw = roomData?.tier ?? roomData?.tierId ?? roomData?.accessTier ?? "";
  const normalized = normalizeTier(raw);
  if (normalized && normalized !== "level0") return normalized;

  // If normalized tier is "level0" but the id indicates VIP, trust the id.
  const inferred = tierFromRoomId(roomId);
  return inferred ?? "level0";
}

// Legacy sync bootstrap removed. Registry now loads async via roomFetcher.
// Callers that need rooms at import time should await getAllRoomsAsync().

/**
 * Build registry from roomFetcher (async).
 */
async function getRawRooms(): Promise<RawRoomData[]> {
  return fetchAllRooms();
}

/**
 * Build the room registry from fetched rooms (async runtime path)
 */
async function buildRegistryAsync(): Promise<RoomMeta[]> {
  const fetchedRooms = await getRawRooms();
  const rooms: RoomMeta[] = [];

  if (!Array.isArray(fetchedRooms) || fetchedRooms.length === 0) {
    console.warn("[RoomRegistry] No rooms found from source");
    return rooms;
  }

  for (const roomData of fetchedRooms) {
    try {
      const rawId = String(roomData?.id ?? "").trim();
      if (!rawId) continue;

      const id = normalizeRoomId(rawId);

      const { en: rawTitleEn, vi: rawTitleVi } = pickTitles(roomData);

      // Runtime path should stay tolerant too.
      // Do not drop rooms just because one title is missing in the summary row.
      const title_en = rawTitleEn || rawTitleVi || "";
      const title_vi = rawTitleVi || rawTitleEn || "";

      const tier = inferTier(id, roomData);
      const domain = getDomainCategory(id, roomData.domain);
      const { en: keywords_en, vi: keywords_vi } = pickKeywords(roomData);
      const tags = pickTags(roomData);

      rooms.push({
        id,
        tier,
        domain,
        title_en,
        title_vi,
        keywords_en,
        keywords_vi,
        tags,
        hasData: Boolean(roomData?.hasData ?? roomData?.has_data ?? true),
      });
    } catch (error) {
      console.error(
        `[RoomRegistry] Error processing room ${String(roomData?.id ?? "(unknown)")}:`,
        error,
      );
    }
  }

  return rooms.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Get all rooms from the registry (async, cached)
 */
export async function getAllRoomsAsync(): Promise<RoomMeta[]> {
  if (roomRegistryCache) return roomRegistryCache;

  if (!roomRegistryPromise) {
    roomRegistryPromise = buildRegistryAsync().then((rooms) => {
      roomRegistryCache = rooms;
      roomByIdCache = new Map(rooms.map((room) => [room.id, room]));
      return rooms;
    });
  }

  return roomRegistryPromise;
}

/**
 * Get all rooms (sync)
 */
export function getAllRooms(): RoomMeta[] {
  if (!roomRegistryCache) {
    // Trigger async load in background for runtime
    getAllRoomsAsync().catch(console.error);
    return [];
  }
  return roomRegistryCache;
}

/**
 * Get rooms filtered by tier (async)
 */
export async function getRoomsByTierAsync(tierId: TierId): Promise<RoomMeta[]> {
  const rooms = await getAllRoomsAsync();
  const t = normalizeTier(tierId);
  return rooms.filter((room) => room.tier === t);
}

/**
 * Get rooms filtered by tier (sync)
 */
export function getRoomsByTier(tierId: TierId): RoomMeta[] {
  const t = normalizeTier(tierId);
  return getAllRooms().filter((room) => room.tier === t);
}

/**
 * Get rooms filtered by domain
 */
export function getRoomsByDomain(domain: DomainCategory): RoomMeta[] {
  return getAllRooms().filter((room) => room.domain === domain);
}

/**
 * Get a room by ID (sync, cached lookup)
 */
export function getRoomById(id: string): RoomMeta | undefined {
  if (!roomByIdCache) {
    getAllRoomsAsync().catch(console.error);
    return undefined;
  }
  return roomByIdCache.get(normalizeRoomId(id));
}

/**
 * Get a room by ID (async)
 */
export async function getRoomByIdAsync(id: string): Promise<RoomMeta | undefined> {
  await getAllRoomsAsync();
  return roomByIdCache?.get(normalizeRoomId(id));
}

/**
 * Get room counts by tier
 */
export function getRoomCountsByTier(): Record<TierId, number> {
  const counts = Object.fromEntries(ALL_TIER_IDS.map((tier) => [tier, 0])) as Record<
    TierId,
    number
  >;

  for (const room of getAllRooms()) {
    if (counts[room.tier] !== undefined) counts[room.tier]++;
  }

  return counts;
}

/**
 * Get room counts by domain
 */
export function getRoomCountsByDomain(): Record<DomainCategory, number> {
  const counts: Record<DomainCategory, number> = {
    english: 0,
    health: 0,
    strategy: 0,
    kids: 0,
    martial: 0,
    other: 0,
  };

  for (const room of getAllRooms()) {
    counts[room.domain]++;
  }

  return counts;
}

/**
 * Refresh the registry cache (call after new rooms are added)
 */
export function refreshRegistry(): void {
  roomRegistryCache = null;
  roomByIdCache = null;
  roomRegistryPromise = null;
}

/**
 * Get total room count
 */
export function getTotalRoomCount(): number {
  return getAllRooms().length;
}

// Registry bootstraps lazily on first call to getAllRoomsAsync() / getAllRooms().
// No eager bootstrap — roomDataImports.ts has been removed.
