/**
 * Room Registry - Single Source of Truth for All Room Metadata
 * 
 * Loads all room data from roomDataImports (auto-generated from JSON files)
 * and provides typed, normalized access to room metadata for search and discovery.
 */

import { roomDataMap } from '@/lib/roomDataImports';
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

// Cache for room registry
let roomRegistryCache: RoomMeta[] | null = null;
let roomByIdCache: Map<string, RoomMeta> | null = null;

/**
 * Extract keywords from room data
 */
function extractKeywords(roomData: any): { en: string[]; vi: string[] } {
  const en: string[] = [];
  const vi: string[] = [];
  
  try {
    // Extract from keywords object
    if (roomData.keywords) {
      if (Array.isArray(roomData.keywords)) {
        en.push(...roomData.keywords.filter((k: any) => typeof k === 'string'));
      } else if (typeof roomData.keywords === 'object') {
        Object.values(roomData.keywords).forEach((keywordGroup: any) => {
          if (keywordGroup?.en) en.push(...(Array.isArray(keywordGroup.en) ? keywordGroup.en : [keywordGroup.en]));
          if (keywordGroup?.vi) vi.push(...(Array.isArray(keywordGroup.vi) ? keywordGroup.vi : [keywordGroup.vi]));
        });
      }
    }
    
    // Extract from keywords_en/keywords_vi arrays
    if (Array.isArray(roomData.keywords_en)) {
      en.push(...roomData.keywords_en.filter((k: any) => typeof k === 'string'));
    }
    if (Array.isArray(roomData.keywords_vi)) {
      vi.push(...roomData.keywords_vi.filter((k: any) => typeof k === 'string'));
    }
    
    // Extract from entries if available
    if (Array.isArray(roomData.entries)) {
      roomData.entries.forEach((entry: any) => {
        if (Array.isArray(entry.keywords_en)) en.push(...entry.keywords_en);
        if (Array.isArray(entry.keywords_vi)) vi.push(...entry.keywords_vi);
        if (entry.keywords) {
          if (Array.isArray(entry.keywords)) en.push(...entry.keywords);
          else if (typeof entry.keywords === 'string') en.push(entry.keywords);
        }
      });
    }
  } catch (error) {
    console.warn(`[RoomRegistry] Error extracting keywords for room:`, error);
  }
  
  // Deduplicate and clean
  return {
    en: [...new Set(en.map(k => k.trim().toLowerCase()).filter(Boolean))],
    vi: [...new Set(vi.map(k => k.trim().toLowerCase()).filter(Boolean))],
  };
}

/**
 * Extract tags from room data
 */
function extractTags(roomData: any): string[] {
  const tags: string[] = [];
  
  try {
    if (Array.isArray(roomData.tags)) {
      tags.push(...roomData.tags.filter((t: any) => typeof t === 'string'));
    }
    
    // Extract from entries
    if (Array.isArray(roomData.entries)) {
      roomData.entries.forEach((entry: any) => {
        if (Array.isArray(entry.tags)) {
          tags.push(...entry.tags.filter((t: any) => typeof t === 'string'));
        }
      });
    }
  } catch (error) {
    console.warn(`[RoomRegistry] Error extracting tags:`, error);
  }
  
  return [...new Set(tags.map(t => t.trim().toLowerCase()).filter(Boolean))];
}

/**
 * Build the room registry from roomDataMap
 */
function buildRegistry(): RoomMeta[] {
  const rooms: RoomMeta[] = [];
  const entries = Object.entries(roomDataMap);
  
  if (entries.length === 0) {
    console.warn('[RoomRegistry] No rooms found in roomDataMap');
    return rooms;
  }
  
  for (const [roomId, roomData] of entries) {
    try {
      if (!roomData) continue;
      
      const data = roomData as any;
      
      // Normalize tier from room ID or data
      let tier: TierId = 'free';
      if (data.tier) {
        tier = normalizeTier(data.tier);
      } else {
        // Extract from room ID
        const tierMatch = roomId.match(/(vip\d+|free|kids_l?\d)/i);
        if (tierMatch) {
          tier = normalizeTier(tierMatch[1]);
        }
      }
      
      // Get domain category
      const domain = getDomainCategory(roomId, data.domain);
      
      // Extract titles
      const title_en = data.nameEn || data.name || data.title?.en || roomId;
      const title_vi = data.nameVi || data.name_vi || data.title?.vi || title_en;
      
      // Extract keywords
      const keywords = extractKeywords(data);
      
      // Extract tags
      const tags = extractTags(data);
      
      rooms.push({
        id: roomId,
        tier,
        domain,
        title_en: String(title_en).trim(),
        title_vi: String(title_vi).trim(),
        keywords_en: keywords.en,
        keywords_vi: keywords.vi,
        tags,
        hasData: data.hasData ?? true,
      });
    } catch (error) {
      console.error(`[RoomRegistry] Error processing room ${roomId}:`, error);
      // Skip invalid room but continue processing others
    }
  }
  
  return rooms.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Get all rooms from the registry (cached)
 */
export function getAllRooms(): RoomMeta[] {
  if (!roomRegistryCache) {
    roomRegistryCache = buildRegistry();
  }
  return roomRegistryCache;
}

/**
 * Get rooms filtered by tier
 */
export function getRoomsByTier(tierId: TierId): RoomMeta[] {
  return getAllRooms().filter(room => room.tier === tierId);
}

/**
 * Get rooms filtered by domain
 */
export function getRoomsByDomain(domain: DomainCategory): RoomMeta[] {
  return getAllRooms().filter(room => room.domain === domain);
}

/**
 * Get a room by ID (cached lookup)
 */
export function getRoomById(id: string): RoomMeta | undefined {
  if (!roomByIdCache) {
    roomByIdCache = new Map(getAllRooms().map(room => [room.id, room]));
  }
  return roomByIdCache.get(id);
}

/**
 * Get room counts by tier
 */
export function getRoomCountsByTier(): Record<TierId, number> {
  const counts = Object.fromEntries(ALL_TIER_IDS.map(tier => [tier, 0])) as Record<TierId, number>;
  
  for (const room of getAllRooms()) {
    if (counts[room.tier] !== undefined) {
      counts[room.tier]++;
    }
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
}

/**
 * Get total room count
 */
export function getTotalRoomCount(): number {
  return getAllRooms().length;
}
