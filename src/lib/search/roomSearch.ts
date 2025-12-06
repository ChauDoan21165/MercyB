/**
 * Room Search Engine
 * 
 * Provides fast, ranked search across all rooms with EN/VI support.
 * Uses the roomRegistry as the single source of truth.
 */

import { getAllRooms, type RoomMeta } from '@/lib/rooms/roomRegistry';
import type { TierId } from '@/lib/constants/tiers';
import type { DomainCategory } from '@/lib/mercy-host/domainMap';

/**
 * Search result with relevance score
 */
export interface RoomSearchResult extends RoomMeta {
  score: number;
}

/**
 * Search options
 */
export interface SearchOptions {
  tier?: TierId;           // Boost rooms from this tier
  domain?: DomainCategory; // Filter to specific domain
  limit?: number;          // Max results (default 30)
  language?: 'en' | 'vi';  // Preferred language (affects ranking)
}

/**
 * Normalize search query
 * - Lowercase
 * - Trim whitespace
 * - Remove diacritics for Vietnamese (basic normalization)
 */
function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics for matching
    .replace(/đ/g, 'd')              // Vietnamese đ -> d
    .replace(/\s+/g, ' ');           // Normalize spaces
}

/**
 * Normalize text for matching (same normalization as query)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ');
}

/**
 * Calculate match score for a room against a query
 */
function calculateScore(
  room: RoomMeta,
  query: string,
  normalizedQuery: string,
  options: SearchOptions
): number {
  let score = 0;
  
  const titleEnNorm = normalizeText(room.title_en);
  const titleViNorm = normalizeText(room.title_vi);
  const idNorm = normalizeText(room.id);
  
  // Title prefix match (highest priority)
  if (titleEnNorm.startsWith(normalizedQuery)) {
    score += 5;
  } else if (titleViNorm.startsWith(normalizedQuery)) {
    score += 5;
  }
  
  // Title contains match
  if (titleEnNorm.includes(normalizedQuery)) {
    score += 3;
  }
  if (titleViNorm.includes(normalizedQuery)) {
    score += 3;
  }
  
  // ID match (useful for exact searches like "adhd-support")
  if (idNorm.includes(normalizedQuery)) {
    score += 2;
  }
  
  // Keyword matches
  const keywordMatchEn = room.keywords_en.some(k => 
    normalizeText(k).includes(normalizedQuery)
  );
  const keywordMatchVi = room.keywords_vi.some(k => 
    normalizeText(k).includes(normalizedQuery)
  );
  
  if (keywordMatchEn) score += 1;
  if (keywordMatchVi) score += 1;
  
  // Tag matches
  const tagMatch = room.tags.some(t => 
    normalizeText(t).includes(normalizedQuery)
  );
  if (tagMatch) score += 1;
  
  // Domain label match
  if (room.domain.includes(normalizedQuery)) {
    score += 1;
  }
  
  // Tier boost if searching within a specific tier
  if (options.tier && room.tier === options.tier) {
    score += 1;
  }
  
  // Prefer rooms with data
  if (room.hasData) {
    score += 0.5;
  }
  
  return score;
}

/**
 * Search rooms by query
 * 
 * @param query - Search query (EN or VI)
 * @param options - Search options
 * @returns Array of rooms sorted by relevance score
 */
export function searchRooms(
  query: string,
  options: SearchOptions = {}
): RoomSearchResult[] {
  const { tier, domain, limit = 30 } = options;
  
  // Empty query returns empty results
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }
  
  const normalizedQuery = normalizeQuery(trimmedQuery);
  
  // Get all rooms
  let rooms = getAllRooms();
  
  // Filter by domain if specified
  if (domain) {
    rooms = rooms.filter(r => r.domain === domain);
  }
  
  // Calculate scores and filter out non-matches
  const scoredRooms: RoomSearchResult[] = [];
  
  for (const room of rooms) {
    const score = calculateScore(room, trimmedQuery, normalizedQuery, options);
    
    if (score > 0) {
      scoredRooms.push({ ...room, score });
    }
  }
  
  // Sort by score (descending), then tier order, then title
  scoredRooms.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    
    // Same score: prefer current tier if specified
    if (tier) {
      if (a.tier === tier && b.tier !== tier) return -1;
      if (b.tier === tier && a.tier !== tier) return 1;
    }
    
    // Finally sort by title alphabetically
    return a.title_en.localeCompare(b.title_en);
  });
  
  // Apply limit
  return scoredRooms.slice(0, limit);
}

/**
 * Get search suggestions based on partial query
 * Returns room titles that match the prefix
 */
export function getSearchSuggestions(
  prefix: string,
  limit: number = 5
): string[] {
  if (!prefix.trim()) return [];
  
  const normalizedPrefix = normalizeQuery(prefix);
  const suggestions: Set<string> = new Set();
  
  for (const room of getAllRooms()) {
    if (suggestions.size >= limit) break;
    
    const titleEnNorm = normalizeText(room.title_en);
    const titleViNorm = normalizeText(room.title_vi);
    
    if (titleEnNorm.startsWith(normalizedPrefix)) {
      suggestions.add(room.title_en);
    } else if (titleViNorm.startsWith(normalizedPrefix)) {
      suggestions.add(room.title_vi);
    }
  }
  
  return Array.from(suggestions).slice(0, limit);
}

/**
 * Check if a query would return any results (fast check)
 */
export function hasSearchResults(query: string): boolean {
  if (!query.trim()) return false;
  
  const normalizedQuery = normalizeQuery(query);
  
  return getAllRooms().some(room => {
    const titleEnNorm = normalizeText(room.title_en);
    const titleViNorm = normalizeText(room.title_vi);
    const idNorm = normalizeText(room.id);
    
    return (
      titleEnNorm.includes(normalizedQuery) ||
      titleViNorm.includes(normalizedQuery) ||
      idNorm.includes(normalizedQuery)
    );
  });
}
