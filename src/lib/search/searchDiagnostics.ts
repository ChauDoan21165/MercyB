/**
 * Search Diagnostics
 * 
 * Dev-only helpers to debug and validate search functionality
 */

import { getAllRooms } from '@/lib/rooms/roomRegistry';
import { searchRooms, type RoomSearchResult } from './roomSearch';

export interface SearchDebugResult {
  query: string;
  totalRoomsInRegistry: number;
  matchCount: number;
  topResults: Array<{
    id: string;
    title_en: string;
    tier: string;
    score: number;
    domain: string;
  }>;
  searchTime: number;
}

/**
 * Debug search with detailed logging (dev only)
 */
export function debugSearch(query: string, limit: number = 5): SearchDebugResult {
  const startTime = performance.now();
  
  const allRooms = getAllRooms();
  const results = searchRooms(query, { limit: 50 }); // Get more for full count
  
  const searchTime = performance.now() - startTime;
  
  const debugResult: SearchDebugResult = {
    query,
    totalRoomsInRegistry: allRooms.length,
    matchCount: results.length,
    topResults: results.slice(0, limit).map(r => ({
      id: r.id,
      title_en: r.title_en,
      tier: r.tier,
      score: r.score,
      domain: r.domain
    })),
    searchTime
  };
  
  // Log in dev mode
  if (import.meta.env.DEV) {
    console.group(`[Search Debug] "${query}"`);
    console.log(`Registry size: ${debugResult.totalRoomsInRegistry} rooms`);
    console.log(`Matches found: ${debugResult.matchCount}`);
    console.log(`Search time: ${debugResult.searchTime.toFixed(2)}ms`);
    console.log(`Top ${limit} results:`);
    debugResult.topResults.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.title_en} (${r.id}) [${r.tier}] score=${r.score}`);
    });
    console.groupEnd();
  }
  
  return debugResult;
}

/**
 * Validate that known rooms are searchable
 */
export function validateKnownRooms(roomQueries: string[]): {
  query: string;
  found: boolean;
  topMatch?: string;
}[] {
  return roomQueries.map(query => {
    const results = searchRooms(query, { limit: 1 });
    return {
      query,
      found: results.length > 0,
      topMatch: results[0]?.id
    };
  });
}

/**
 * Get search coverage stats
 */
export function getSearchCoverageStats(): {
  totalRooms: number;
  roomsWithTitles: number;
  roomsWithKeywords: number;
  roomsWithTags: number;
  byTier: Record<string, number>;
  byDomain: Record<string, number>;
} {
  const rooms = getAllRooms();
  
  const byTier: Record<string, number> = {};
  const byDomain: Record<string, number> = {};
  
  let withTitles = 0;
  let withKeywords = 0;
  let withTags = 0;
  
  for (const room of rooms) {
    if (room.title_en && room.title_en !== room.id) withTitles++;
    if (room.keywords_en.length > 0 || room.keywords_vi.length > 0) withKeywords++;
    if (room.tags.length > 0) withTags++;
    
    byTier[room.tier] = (byTier[room.tier] || 0) + 1;
    byDomain[room.domain] = (byDomain[room.domain] || 0) + 1;
  }
  
  return {
    totalRooms: rooms.length,
    roomsWithTitles: withTitles,
    roomsWithKeywords: withKeywords,
    roomsWithTags: withTags,
    byTier,
    byDomain
  };
}
