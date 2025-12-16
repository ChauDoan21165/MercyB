/**
 * Room Registry - Single Source of Truth for All Room Metadata
 *
 * Uses async roomFetcher instead of static imports.
 * Defensive against mixed / legacy room schemas.
 */

import {
  getAllRooms as fetchAllRooms,
  type RoomMeta as FetcherRoomMeta,
} from '@/lib/roomFetcher';
import { normalizeTier, TierId, ALL_TIER_IDS } from '@/lib/constants/tiers';
import { getDomainCategory, type DomainCategory } from '@/lib/mercy-host/domainMap';

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

// Caches
let roomRegistryCache: RoomMeta[] | null = null;
let roomRegistryPromise: Promise<RoomMeta[]> | null = null;
let roomByIdCache: Map<string, RoomMeta> | null = null;

/**
 * Safe helpers
 */
function pickLang(
  value: any,
  lang: 'en' | 'vi',
  fallback = ''
): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && typeof value[lang] === 'string') {
    return value[lang];
  }
  return fallback;
}

function pickKeywords(value: any): string[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object' && Array.isArray(value.en)) return value.en;
  return [];
}

/**
 * Build the room registry
 */
async function buildRegistryAsync(): Promise<RoomMeta[]> {
  const fetchedRooms = await fetchAllRooms();
  const rooms: RoomMeta[] = [];

  if (!Array.isArray(fetchedRooms) || fetchedRooms.length === 0) {
    console.warn('[RoomRegistry] No rooms found');
    return rooms;
  }

  for (const roomData of fetchedRooms as FetcherRoomMeta[]) {
    try {
      const tier = normalizeTier(roomData.tier);
      const domain = getDomainCategory(roomData.id, roomData.domain);

      // --- Titles (defensive) ---
      const title_en = pickLang(roomData.title, 'en');
      const title_vi = pickLang(roomData.title, 'vi', title_en);

      // --- Keywords ---
      const keywords_en: string[] = [];
      const keywords_vi: string[] = [];

      keywords_en.push(...pickKeywords(roomData.keywords_en));
      keywords_vi.push(...pickKeywords(roomData.keywords_vi));

      // From entries
      if (Array.isArray(roomData.entries)) {
        for (const entry of roomData.entries) {
          if (Array.isArray(entry.keywords_en)) keywords_en.push(...entry.keywords_en);
          if (Array.isArray(entry.keywords_vi)) keywords_vi.push(...entry.keywords_vi);
        }
      }

      // --- Tags ---
      const tags: string[] = [];
      if (Array.isArray(roomData.entries)) {
        for (const entry of roomData.entries) {
          if (Array.isArray(entry.tags)) tags.push(...entry.tags);
        }
      }

      rooms.push({
        id: roomData.id,
        tier,
        domain,
        title_en,
        title_vi,
        keywords_en: [...new Set(keywords_en.map(k => String(k).trim().toLowerCase()).filter(Boolean))],
        keywords_vi: [...new Set(keywords_vi.map(k => String(k).trim().toLowerCase()).filter(Boolean))],
        tags: [...new Set(tags.map(t => String(t).trim().toLowerCase()).filter(Boolean))],
        hasData: true,
      });
    } catch (error) {
      console.error(`[RoomRegistry] Error processing room ${roomData?.id}`, error);
    }
  }

  return rooms.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Public APIs
 */

export async function getAllRoomsAsync(): Promise<RoomMeta[]> {
  if (roomRegistryCache) return roomRegistryCache;

  if (!roomRegistryPromise) {
    roomRegistryPromise = buildRegistryAsync().then(rooms => {
      roomRegistryCache = rooms;
      roomByIdCache = new Map(rooms.map(r => [r.id, r]));
      return rooms;
    });
  }

  return roomRegistryPromise;
}

export function getAllRooms(): RoomMeta[] {
  if (!roomRegistryCache) {
    getAllRoomsAsync().catch(console.error);
    return [];
  }
  return roomRegistryCache;
}

export async function getRoomsByTierAsync(tierId: TierId): Promise<RoomMeta[]> {
  const rooms = await getAllRoomsAsync();
  return rooms.filter(r => r.tier === tierId);
}

export function getRoomsByTier(tierId: TierId): RoomMeta[] {
  return getAllRooms().filter(r => r.tier === tierId);
}

export function getRoomsByDomain(domain: DomainCategory): RoomMeta[] {
  return getAllRooms().filter(r => r.domain === domain);
}

export function getRoomById(id: string): RoomMeta | undefined {
  if (!roomByIdCache) {
    getAllRoomsAsync().catch(console.error);
    return undefined;
  }
  return roomByIdCache.get(id);
}

export async function getRoomByIdAsync(id: string): Promise<RoomMeta | undefined> {
  await getAllRoomsAsync();
  return roomByIdCache?.get(id);
}

export function getRoomCountsByTier(): Record<TierId, number> {
  const counts = Object.fromEntries(
    ALL_TIER_IDS.map(t => [t, 0])
  ) as Record<TierId, number>;

  for (const room of getAllRooms()) {
    counts[room.tier]++;
  }
  return counts;
}

export function getRoomCountsByDomain(): Record<DomainCategory, number> {
  return {
    english: getAllRooms().filter(r => r.domain === 'english').length,
    health: getAllRooms().filter(r => r.domain === 'health').length,
    strategy: getAllRooms().filter(r => r.domain === 'strategy').length,
    kids: getAllRooms().filter(r => r.domain === 'kids').length,
    martial: getAllRooms().filter(r => r.domain === 'martial').length,
    other: getAllRooms().filter(r => r.domain === 'other').length,
  };
}

export function refreshRegistry(): void {
  roomRegistryCache = null;
  roomByIdCache = null;
  roomRegistryPromise = null;
}

export function getTotalRoomCount(): number {
  return getAllRooms().length;
}
