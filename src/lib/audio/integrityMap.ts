/**
 * Integrity Map v1.0
 * Phase 3: Room-to-Storage Integrity Mapping
 * 
 * Provides comprehensive mapping between:
 * - Expected canonical audio filenames
 * - Found storage filenames
 * - Missing files
 * - Orphan files
 * - Language mismatches
 * - Duplicates
 * - Unrepairable issues
 */

import { getCanonicalAudioForRoom, normalizeRoomId, extractLanguage } from './globalConsistencyEngine';
import { similarityScore } from './filenameValidator';

export interface RoomIntegrity {
  roomId: string;
  expected: string[];
  found: string[];
  missing: string[];
  orphans: string[];
  mismatchedLang: string[];
  duplicates: string[];
  unrepairable: string[];
  score: number; // 0-100 integrity score
  lastChecked: string;
}

export interface IntegrityMap {
  [roomId: string]: RoomIntegrity;
}

export interface IntegritySummary {
  totalRooms: number;
  healthyRooms: number;
  roomsWithIssues: number;
  totalExpected: number;
  totalFound: number;
  totalMissing: number;
  totalOrphans: number;
  totalDuplicates: number;
  totalUnrepairable: number;
  averageScore: number;
  generatedAt: string;
}

export interface RoomEntry {
  slug: string | number;
  audio?: { en?: string; vi?: string } | string;
}

export interface RoomData {
  roomId: string;
  entries: RoomEntry[];
}

/**
 * Build integrity map for a single room
 */
export function buildRoomIntegrity(
  roomId: string,
  entries: RoomEntry[],
  storageFiles: Set<string>
): RoomIntegrity {
  const normalizedRoomId = normalizeRoomId(roomId);
  const expected: string[] = [];
  const found: string[] = [];
  const missing: string[] = [];
  const orphans: string[] = [];
  const mismatchedLang: string[] = [];
  const duplicates: string[] = [];
  const unrepairable: string[] = [];
  
  const expectedSet = new Set<string>();
  const foundForRoom = new Set<string>();
  
  // Build expected list from entries
  for (const entry of entries) {
    const slug = typeof entry.slug === 'number' ? `entry-${entry.slug}` : entry.slug;
    const canonical = getCanonicalAudioForRoom(roomId, slug);
    
    expected.push(canonical.en, canonical.vi);
    expectedSet.add(canonical.en.toLowerCase());
    expectedSet.add(canonical.vi.toLowerCase());
  }
  
  // Check storage files against room
  for (const file of storageFiles) {
    const normalizedFile = file.toLowerCase();
    
    // Only consider files that belong to this room
    if (!normalizedFile.startsWith(normalizedRoomId + '-')) {
      continue;
    }
    
    foundForRoom.add(normalizedFile);
    
    if (expectedSet.has(normalizedFile)) {
      found.push(file);
    } else {
      // Potential orphan - check if it's a naming issue
      const lang = extractLanguage(file);
      if (lang) {
        // Try to match to an expected file
        const potentialMatch = findBestMatch(file, expected);
        if (potentialMatch && potentialMatch.confidence > 0.8) {
          mismatchedLang.push(file);
        } else {
          orphans.push(file);
        }
      } else {
        unrepairable.push(file);
      }
    }
  }
  
  // Find missing files
  for (const exp of expected) {
    if (!foundForRoom.has(exp.toLowerCase())) {
      missing.push(exp);
    }
  }
  
  // Detect duplicates (files that normalize to same canonical)
  const normalizedMap = new Map<string, string[]>();
  for (const file of foundForRoom) {
    const normalized = normalizeFilename(file);
    const existing = normalizedMap.get(normalized) || [];
    existing.push(file);
    normalizedMap.set(normalized, existing);
  }
  
  for (const [, files] of normalizedMap) {
    if (files.length > 1) {
      // Keep the first one (canonical), mark others as duplicates
      duplicates.push(...files.slice(1));
    }
  }
  
  // Calculate integrity score
  const score = calculateIntegrityScore({
    expected: expected.length,
    found: found.length,
    missing: missing.length,
    orphans: orphans.length,
    mismatchedLang: mismatchedLang.length,
    duplicates: duplicates.length,
    unrepairable: unrepairable.length,
  });
  
  return {
    roomId,
    expected,
    found,
    missing,
    orphans,
    mismatchedLang,
    duplicates,
    unrepairable,
    score,
    lastChecked: new Date().toISOString(),
  };
}

/**
 * Build integrity map for all rooms
 */
export function buildIntegrityMap(
  rooms: RoomData[],
  storageFiles: Set<string>
): IntegrityMap {
  const map: IntegrityMap = {};
  
  for (const room of rooms) {
    map[room.roomId] = buildRoomIntegrity(room.roomId, room.entries, storageFiles);
  }
  
  return map;
}

/**
 * Generate summary from integrity map
 */
export function generateIntegritySummary(map: IntegrityMap): IntegritySummary {
  const rooms = Object.values(map);
  
  let totalExpected = 0;
  let totalFound = 0;
  let totalMissing = 0;
  let totalOrphans = 0;
  let totalDuplicates = 0;
  let totalUnrepairable = 0;
  let totalScore = 0;
  let healthyRooms = 0;
  
  for (const room of rooms) {
    totalExpected += room.expected.length;
    totalFound += room.found.length;
    totalMissing += room.missing.length;
    totalOrphans += room.orphans.length;
    totalDuplicates += room.duplicates.length;
    totalUnrepairable += room.unrepairable.length;
    totalScore += room.score;
    
    if (room.score === 100) {
      healthyRooms++;
    }
  }
  
  return {
    totalRooms: rooms.length,
    healthyRooms,
    roomsWithIssues: rooms.length - healthyRooms,
    totalExpected,
    totalFound,
    totalMissing,
    totalOrphans,
    totalDuplicates,
    totalUnrepairable,
    averageScore: rooms.length > 0 ? Math.round(totalScore / rooms.length) : 100,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Find best matching expected filename for a misnamed file
 */
function findBestMatch(
  filename: string,
  expectedFiles: string[]
): { file: string; confidence: number } | null {
  const normalizedFilename = normalizeFilename(filename);
  let best: { file: string; confidence: number } | null = null;
  
  for (const expected of expectedFiles) {
    const score = similarityScore(normalizedFilename, expected.toLowerCase());
    if (!best || score > best.confidence) {
      best = { file: expected, confidence: score };
    }
  }
  
  return best;
}

/**
 * Calculate integrity score (0-100)
 */
function calculateIntegrityScore(metrics: {
  expected: number;
  found: number;
  missing: number;
  orphans: number;
  mismatchedLang: number;
  duplicates: number;
  unrepairable: number;
}): number {
  if (metrics.expected === 0) return 100;
  
  // Base score from coverage
  const coverageScore = (metrics.found / metrics.expected) * 60;
  
  // Penalty for issues
  const missingPenalty = (metrics.missing / metrics.expected) * 20;
  const orphanPenalty = Math.min(10, metrics.orphans * 2);
  const duplicatePenalty = Math.min(5, metrics.duplicates * 1);
  const unrepairablePenalty = Math.min(5, metrics.unrepairable * 2);
  
  const score = 100 - (100 - coverageScore) - missingPenalty - orphanPenalty - duplicatePenalty - unrepairablePenalty;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Normalize filename for comparison
 */
function normalizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[_\\s]+/g, '-')
    .replace(/[^a-z0-9\\-\\.]/g, '')
    .replace(/-+/g, '-');
}

/**
 * Get rooms with lowest integrity scores
 */
export function getLowestIntegrityRooms(
  map: IntegrityMap,
  count: number = 10
): RoomIntegrity[] {
  return Object.values(map)
    .sort((a, b) => a.score - b.score)
    .slice(0, count);
}

/**
 * Get rooms with specific issue types
 */
export function getRoomsWithIssues(
  map: IntegrityMap,
  issueType: 'missing' | 'orphans' | 'duplicates' | 'unrepairable' | 'mismatchedLang'
): RoomIntegrity[] {
  return Object.values(map).filter(room => room[issueType].length > 0);
}

/**
 * Export integrity map as JSON
 */
export function exportIntegrityMapJSON(map: IntegrityMap): string {
  return JSON.stringify({
    summary: generateIntegritySummary(map),
    rooms: map,
  }, null, 2);
}

/**
 * Export integrity map as CSV
 */
export function exportIntegrityMapCSV(map: IntegrityMap): string {
  const headers = [
    'roomId',
    'score',
    'expectedCount',
    'foundCount',
    'missingCount',
    'orphanCount',
    'duplicateCount',
    'unrepairableCount',
    'missingFiles',
    'orphanFiles',
    'lastChecked',
  ];
  
  const rows = Object.values(map).map(room => [
    room.roomId,
    room.score.toString(),
    room.expected.length.toString(),
    room.found.length.toString(),
    room.missing.length.toString(),
    room.orphans.length.toString(),
    room.duplicates.length.toString(),
    room.unrepairable.length.toString(),
    room.missing.join(';'),
    room.orphans.join(';'),
    room.lastChecked,
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')),
  ].join('\n');
}
