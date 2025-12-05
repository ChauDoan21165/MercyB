/**
 * Integrity Map v2.0
 * Phase 4: Full GCE Integration
 * 
 * Uses GCE internally as the single consistency model.
 * Provides comprehensive room-to-storage integrity mapping.
 */

import { 
  getCanonicalAudioForRoom, 
  getCanonicalAudioForEntireRoom,
  normalizeRoomId, 
  extractLanguage,
  MIN_CONFIDENCE_FOR_AUTO_FIX,
  type GCERoomResult,
} from './globalConsistencyEngine';
import { similarityScore } from './filenameValidator';

// ============================================
// Types
// ============================================

export interface RoomIntegrity {
  roomId: string;
  expected: string[];
  found: string[];
  missing: string[];
  orphans: string[];
  mismatchedLang: string[];
  duplicates: string[];
  unrepairable: string[];
  score: number;
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
  slug?: string | number;
  id?: string | number;
  artifact_id?: string;
  audio?: { en?: string; vi?: string } | string;
}

export interface RoomData {
  roomId: string;
  entries: RoomEntry[];
}

// ============================================
// Core Functions
// ============================================

/**
 * Build integrity map for a single room using GCE
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
  
  // Build expected list using GCE
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const slug = entry.slug || entry.artifact_id || entry.id || i;
    const canonical = getCanonicalAudioForRoom(roomId, slug);
    
    expected.push(canonical.en, canonical.vi);
    expectedSet.add(canonical.en.toLowerCase());
    expectedSet.add(canonical.vi.toLowerCase());
  }
  
  // Check storage files
  for (const file of storageFiles) {
    const normalizedFile = file.toLowerCase();
    
    if (!normalizedFile.startsWith(normalizedRoomId + '-')) {
      continue;
    }
    
    foundForRoom.add(normalizedFile);
    
    if (expectedSet.has(normalizedFile)) {
      found.push(file);
    } else {
      const lang = extractLanguage(file);
      if (lang) {
        const potentialMatch = findBestMatch(file, expected);
        if (potentialMatch && potentialMatch.confidence > MIN_CONFIDENCE_FOR_AUTO_FIX) {
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
  
  // Detect duplicates
  const normalizedMap = new Map<string, string[]>();
  for (const file of foundForRoom) {
    const normalized = normalizeFilename(file);
    const existing = normalizedMap.get(normalized) || [];
    existing.push(file);
    normalizedMap.set(normalized, existing);
  }
  
  for (const [, files] of normalizedMap) {
    if (files.length > 1) {
      duplicates.push(...files.slice(1));
    }
  }
  
  // Calculate score
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
 * Get integrity map - main accessor function
 */
export function getIntegrityMap(
  rooms: RoomData[],
  storageFiles: Set<string>
): IntegrityMap {
  return buildIntegrityMap(rooms, storageFiles);
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

// ============================================
// Helper Functions
// ============================================

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
  
  const coverageScore = (metrics.found / metrics.expected) * 60;
  const missingPenalty = (metrics.missing / metrics.expected) * 20;
  const orphanPenalty = Math.min(10, metrics.orphans * 2);
  const duplicatePenalty = Math.min(5, metrics.duplicates * 1);
  const unrepairablePenalty = Math.min(5, metrics.unrepairable * 2);
  
  const score = 100 - (100 - coverageScore) - missingPenalty - orphanPenalty - duplicatePenalty - unrepairablePenalty;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9\-\.]/g, '')
    .replace(/-+/g, '-');
}

// ============================================
// Query Functions
// ============================================

export function getLowestIntegrityRooms(
  map: IntegrityMap,
  count: number = 10
): RoomIntegrity[] {
  return Object.values(map)
    .sort((a, b) => a.score - b.score)
    .slice(0, count);
}

export function getRoomsWithIssues(
  map: IntegrityMap,
  issueType: 'missing' | 'orphans' | 'duplicates' | 'unrepairable' | 'mismatchedLang'
): RoomIntegrity[] {
  return Object.values(map).filter(room => room[issueType].length > 0);
}

// ============================================
// Export Functions
// ============================================

export function exportIntegrityMapJSON(map: IntegrityMap): string {
  return JSON.stringify({
    summary: generateIntegritySummary(map),
    rooms: map,
  }, null, 2);
}

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
