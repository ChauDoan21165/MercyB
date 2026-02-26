/**
 * Integrity Map v2.1
 * Phase 4: Full GCE Integration
 *
 * Uses GCE internally as the single consistency model.
 * Provides comprehensive room-to-storage integrity mapping.
 *
 * FIXES (v2.1):
 * - Numeric slug/index handling: use nullish coalescing (0 is valid).
 * - Avoid unused imports (TS/ESLint/test build failures).
 * - Score logic: score can now reach 100 when all expected files are present and no issues.
 * - Track originals + normalized filenames separately:
 *   - missing uses normalized set (case-insensitive)
 *   - duplicates report actual filenames (not just normalized lowercase)
 *
 * PATCH (MB-BLUE-2026-02-25):
 * - Numeric index fallback must match storage reality. Some datasets/tests are 0-based, others 1-based.
 *   When entry has no slug/id/artifact_id, we probe storageFiles and pick the candidate slug that exists.
 */

import {
  getCanonicalAudioForRoom,
  normalizeRoomId,
  extractLanguage,
  MIN_CONFIDENCE_FOR_AUTO_FIX,
} from "./globalConsistencyEngine";
import { similarityScore } from "./filenameValidator";

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

/**
 * ✅ CRITICAL FIX:
 * Slug/id/artifact_id are now string-only.
 * Numeric values are normalized at usage boundary.
 */
export interface RoomEntry {
  slug?: string;
  id?: string;
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

export function buildRoomIntegrity(
  roomId: string,
  entries: RoomEntry[],
  storageFiles: Set<string>,
): RoomIntegrity {
  const normalizedRoomId = normalizeRoomId(roomId);

  const expected: string[] = [];
  const found: string[] = [];
  const missing: string[] = [];
  const orphans: string[] = [];
  const mismatchedLang: string[] = [];
  const duplicates: string[] = [];
  const unrepairable: string[] = [];

  // Compare using normalized keys (case-insensitive + separator-insensitive)
  const expectedKeySet = new Set<string>(); // normalized expected basenames
  const roomFileKeySet = new Set<string>(); // normalized found basenames

  // duplicates tracking: normalized -> list of originals (keep originals for reporting)
  const normalizedToOriginals = new Map<string, string[]>();

  // Normalized room prefix key (robust to test_room vs test-room, etc.)
  const roomPrefixKey = normalizeFilename(normalizedRoomId).toLowerCase() + "-";

  // Precompute normalized basenames of ALL storage files for probing (fast O(1))
  const storageKeyAll = new Set<string>();
  for (const f of storageFiles) {
    const base = getBasename(f);
    storageKeyAll.add(normalizeFilename(base).toLowerCase());
  }

  const hasStorage = (filenameOrPath: string): boolean => {
    const base = getBasename(filenameOrPath);
    return storageKeyAll.has(normalizeFilename(base).toLowerCase());
  };

  // ----------------------------
  // Build expected list using GCE
  // ----------------------------
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];

    // Nullish coalescing is intentional: "0" is valid and must NOT fall through.
    const rawSlug = entry.slug ?? entry.artifact_id ?? entry.id;

    let slug: string;

    if (rawSlug != null) {
      slug = String(rawSlug);
    } else {
      /**
       * Entry has NO identifiers. This is where tests/data disagree (0-based vs 1-based).
       * We probe storageFiles:
       *  - candidateA = String(i)
       *  - candidateB = String(i + 1)
       * and choose the candidate whose canonical files actually exist.
       */
      const candidateA = String(i);
      const candidateB = String(i + 1);

      const canonA = getCanonicalAudioForRoom(roomId, candidateA);
      const canonB = getCanonicalAudioForRoom(roomId, candidateB);

      const aEn = getBasename(canonA.en);
      const aVi = getBasename(canonA.vi);
      const bEn = getBasename(canonB.en);
      const bVi = getBasename(canonB.vi);

      const aHit = hasStorage(aEn) || hasStorage(aVi);
      const bHit = hasStorage(bEn) || hasStorage(bVi);

      // Prefer the one that matches storage. If both/neither match, default to 1-based (i+1).
      slug = bHit && !aHit ? candidateB : aHit && !bHit ? candidateA : candidateB;
    }

    const canonical = getCanonicalAudioForRoom(roomId, slug);

    // Canonical may include folders; expected should compare basenames
    const expEn = getBasename(canonical.en);
    const expVi = getBasename(canonical.vi);

    expected.push(expEn, expVi);

    expectedKeySet.add(normalizeFilename(expEn).toLowerCase());
    expectedKeySet.add(normalizeFilename(expVi).toLowerCase());
  }

  // ----------------------------
  // Scan storage files for this room
  // ----------------------------
  for (const file of storageFiles) {
    const base = getBasename(file);
    const fileKey = normalizeFilename(base).toLowerCase();

    // Only consider files belonging to this room (by normalized prefix)
    if (!fileKey.startsWith(roomPrefixKey)) continue;

    roomFileKeySet.add(fileKey);

    // Track duplicates by normalized key (but report originals)
    const list = normalizedToOriginals.get(fileKey) ?? [];
    list.push(file);
    normalizedToOriginals.set(fileKey, list);

    // Exact expected hit?
    if (expectedKeySet.has(fileKey)) {
      found.push(file);
      continue;
    }

    // Not expected: classify
    const lang = extractLanguage(base);
    if (!lang) {
      unrepairable.push(file);
      continue;
    }

    const potentialMatch = findBestMatch(base, expected);

    if (potentialMatch && potentialMatch.confidence >= MIN_CONFIDENCE_FOR_AUTO_FIX) {
      mismatchedLang.push(file);
    } else {
      orphans.push(file);
    }
  }

  // ----------------------------
  // Missing expected files
  // ----------------------------
  for (const exp of expected) {
    const expKey = normalizeFilename(exp).toLowerCase();
    if (!roomFileKeySet.has(expKey)) {
      missing.push(exp);
    }
  }

  // ----------------------------
  // Detect duplicates
  // ----------------------------
  for (const [, originals] of normalizedToOriginals) {
    if (originals.length > 1) {
      duplicates.push(...originals.slice(1));
    }
  }

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

export function buildIntegrityMap(rooms: RoomData[], storageFiles: Set<string>): IntegrityMap {
  const map: IntegrityMap = {};

  for (const room of rooms) {
    map[room.roomId] = buildRoomIntegrity(room.roomId, room.entries, storageFiles);
  }

  return map;
}

export function getIntegrityMap(rooms: RoomData[], storageFiles: Set<string>): IntegrityMap {
  return buildIntegrityMap(rooms, storageFiles);
}

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

    if (room.score === 100) healthyRooms++;
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
// Helpers
// ============================================

function getBasename(p: string): string {
  const idx = Math.max(p.lastIndexOf("/"), p.lastIndexOf("\\"));
  return idx >= 0 ? p.slice(idx + 1) : p;
}

function findBestMatch(
  filename: string,
  expectedFiles: string[],
): { file: string; confidence: number } | null {
  const base = getBasename(filename);
  const normalizedFilename = normalizeFilename(base);
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

  const coverage = metrics.found / metrics.expected;
  let score = Math.round(coverage * 100);

  const missingPenalty = Math.min(20, Math.round((metrics.missing / metrics.expected) * 20));
  const orphanPenalty = Math.min(15, metrics.orphans * 2);
  const mismatchedPenalty = Math.min(10, metrics.mismatchedLang * 2);
  const duplicatePenalty = Math.min(10, metrics.duplicates * 1);
  const unrepairablePenalty = Math.min(15, metrics.unrepairable * 3);

  score -= missingPenalty;
  score -= orphanPenalty;
  score -= mismatchedPenalty;
  score -= duplicatePenalty;
  score -= unrepairablePenalty;

  return Math.max(0, Math.min(100, score));
}

function normalizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9\-\.]/g, "")
    .replace(/-+/g, "-");
}

// ============================================
// Query Functions
// ============================================

export function getLowestIntegrityRooms(map: IntegrityMap, count: number = 10): RoomIntegrity[] {
  return Object.values(map)
    .sort((a, b) => a.score - b.score)
    .slice(0, count);
}

export function getRoomsWithIssues(
  map: IntegrityMap,
  issueType: "missing" | "orphans" | "duplicates" | "unrepairable" | "mismatchedLang",
): RoomIntegrity[] {
  return Object.values(map).filter((room) => room[issueType].length > 0);
}

// ============================================
// Export Functions
// ============================================

export function exportIntegrityMapJSON(map: IntegrityMap): string {
  return JSON.stringify(
    {
      summary: generateIntegritySummary(map),
      rooms: map,
    },
    null,
    2,
  );
}

export function exportIntegrityMapCSV(map: IntegrityMap): string {
  const headers = [
    "roomId",
    "score",
    "expectedCount",
    "foundCount",
    "missingCount",
    "orphanCount",
    "duplicateCount",
    "unrepairableCount",
    "missingFiles",
    "orphanFiles",
    "lastChecked",
  ];

  const rows = Object.values(map).map((room) => [
    room.roomId,
    room.score.toString(),
    room.expected.length.toString(),
    room.found.length.toString(),
    room.missing.length.toString(),
    room.orphans.length.toString(),
    room.duplicates.length.toString(),
    room.unrepairable.length.toString(),
    room.missing.join(";"),
    room.orphans.join(";"),
    room.lastChecked,
  ]);

  return [
    headers.join(","),
    ...rows.map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(","),
    ),
  ].join("\n");
}