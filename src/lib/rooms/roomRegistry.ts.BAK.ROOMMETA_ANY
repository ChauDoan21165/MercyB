/**
 * Room Registry - Single Source of Truth for All Room Metadata
 *
 * Uses async roomFetcher instead of static imports.
 * Provides typed, normalized access to room metadata for search and discovery.
 */

import { getAllRooms as fetchAllRooms } from "@/lib/roomFetcher";
import { normalizeTier, TierId, ALL_TIER_IDS } from "@/lib/constants/tiers";
import { getDomainCategory, type DomainCategory } from "@/lib/mercy-host/domainMap";

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

// Cache for room registry
let roomRegistryCache: RoomMeta[] | null = null;
let roomRegistryPromise: Promise<RoomMeta[]> | null = null;
let roomByIdCache: Map<string, RoomMeta> | null = null;

function cleanList(values: any[]): string[] {
  return [...new Set(values.map(v => String(v ?? "").trim().toLowerCase()).filter(Boolean))];
}

function pickTitles(roomData: any): { en: string; vi: string } {
  // Supports BOTH formats:
  // 1) title: { en, vi }
  // 2) name + name_vi
  const en = String(roomData?.title?.en ?? roomData?.name ?? "").trim();
  const vi = String(roomData?.title?.vi ?? roomData?.name_vi ?? "").trim();
  return { en, vi };
}

/**
 * Build the room registry from fetched rooms
 */
async function buildRegistryAsync(): Promise<RoomMeta[]> {
  const fetchedRooms = await fetchAllRooms();
  const rooms: RoomMeta[] = [];

  if (!Array.isArray(fetchedRooms) || fetchedRooms.length === 0) {
    console.warn("[RoomRegistry] No rooms found from fetcher");
    return rooms;
  }

  for (const roomData of fetchedRooms) {
    try {
      const id = String(roomData?.id ?? "").trim();
      if (!id) continue;

      const { en: title_en, vi: title_vi } = pickTitles(roomData);

      // If a room is missing titles, we don't crash — we just skip it
      // (or you can keep it with placeholders; skipping is cleaner for keyword UX)
      if (!title_en || !title_vi) {
        console.warn(`[RoomRegistry] Skipping room "${id}" (missing bilingual titles)`);
        continue;
      }

      // Normalize tier
      const tier = normalizeTier(roomData?.tier);

      // Domain category
      const domain = getDomainCategory(id, roomData?.domain);

      // Keywords
      const keywords_en: string[] = Array.isArray(roomData?.keywords_en) ? [...roomData.keywords_en] : [];
      const keywords_vi: string[] = Array.isArray(roomData?.keywords_vi) ? [...roomData.keywords_vi] : [];

      if (Array.isArray(roomData?.entries)) {
        for (const entry of roomData.entries) {
          if (Array.isArray(entry?.keywords_en)) keywords_en.push(...entry.keywords_en);
          if (Array.isArray(entry?.keywords_vi)) keywords_vi.push(...entry.keywords_vi);
        }
      }

      // Tags
      const tags: string[] = [];
      if (Array.isArray(roomData?.entries)) {
        for (const entry of roomData.entries) {
          if (Array.isArray(entry?.tags)) tags.push(...entry.tags);
        }
      }

      rooms.push({
        id,
        tier,
        domain,
        title_en,
        title_vi,
        keywords_en: cleanList(keywords_en),
        keywords_vi: cleanList(keywords_vi),
        tags: cleanList(tags),
        hasData: true,
      });
    } catch (error) {
      console.error(`[RoomRegistry] Error processing room ${String(roomData?.id ?? "(unknown)")}:`, error);
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
 * Get all rooms (sync - returns cached or empty)
 * @deprecated Use getAllRoomsAsync instead
 */
export function getAllRooms(): RoomMeta[] {
  if (!roomRegistryCache) {
    // Trigger async load in background
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
  return rooms.filter((room) => room.tier === tierId);
}

/**
 * Get rooms filtered by tier (sync)
 */
export function getRoomsByTier(tierId: TierId): RoomMeta[] {
  return getAllRooms().filter((room) => room.tier === tierId);
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
    // Trigger async load
    getAllRoomsAsync().catch(console.error);
    return undefined;
  }
  return roomByIdCache.get(id);
}

/**
 * Get a room by ID (async)
 */
export async function getRoomByIdAsync(id: string): Promise<RoomMeta | undefined> {
  await getAllRoomsAsync();
  return roomByIdCache?.get(id);
}

/**
 * Get room counts by tier
 */
export function getRoomCountsByTier(): Record<TierId, number> {
  const counts = Object.fromEntries(ALL_TIER_IDS.map((tier) => [tier, 0])) as Record<TierId, number>;

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
