/**
 * Audio Filename Validator v3.0 - Full Expanded Version
 * Chief Automation Engineer: Complete Phase 2-4 Implementation
 *
 * Core Rules:
 * 1. All lowercase
 * 2. Hyphen-separated (no underscores or spaces)
 * 3. MUST start with roomId (CRITICAL)
 * 4. MUST match actual JSON entry (CRITICAL)
 * 5. Ends with -en.mp3 or -vi.mp3
 * 6. Detects duplicate normalized names
 * 7. Levenshtein-based orphan matching
 *
 * FIX (MB-BLUE-102.2y — 2026-01-15):
 * - Canonical filename generation matches current contract:
 *     roomId + "-" + slug + "-" + lang + ".mp3"
 *   Numeric slugs stay numeric ("2"), NOT "entry-2".
 * - Entry matching supports numeric slug tokens robustly:
 *   - Compare normalized forms consistently
 *   - Accept legacy patterns like "...-entry-0-en.mp3" by extracting the last numeric token
 *     before the language suffix and matching it to numeric entrySlugs.
 *
 * FIX (MB-BLUE-102.2z — 2026-01-15):
 * - normalizeFilename() MUST keep ".mp3" because tests expect it.
 * - Internal normalizeKey() strips extension and is used for comparisons/deduping.
 *
 * FIX (MB-BLUE-102.3a — 2026-01-22):
 * - RULE 4 is CRITICAL: when entryMatch fails, severity must become "critical".
 * - Add __mock export for vitest snapshot/unit tests.
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
  expectedCanonicalName?: string;
  severity: "ok" | "warning" | "critical";
}

export interface RoomAwareValidationResult extends ValidationResult {
  roomIdMatch: boolean;
  entryMatch: boolean;
  duplicateOf?: string;
  confidenceScore: number;
}

export interface DuplicateGroup {
  normalizedName: string;
  variants: string[];
  keepRecommendation: string;
}

export interface CrossRoomIssue {
  type: "collision" | "en-vi-mismatch" | "shared-name";
  filename: string;
  rooms: string[];
  description: string;
  severity: "warning" | "critical";
}

export interface RoomCompletenessScore {
  roomId: string;
  score: number; // 0-100
  breakdown: {
    audioCoverage: number; // 0-40 points
    namingCorrectness: number; // 0-30 points
    jsonConsistency: number; // 0-20 points
    noOrphans: number; // 0-10 points
  };
  issues: string[];
}

export interface FixReport {
  roomId: string;
  missingAudio: string[];
  wrongNames: { current: string; suggested: string; confidence: number }[];
  jsonErrors: string[];
  duplicates: string[];
  orphans: string[];
  recommendedFixes: string[];
  completenessScore: number;
}

/**
 * Levenshtein distance calculation for fuzzy matching
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Calculate similarity score (0-1) between two strings
 */
export function similarityScore(a: string, b: string): number {
  if (a === b) return 1;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshteinDistance(a, b) / maxLen;
}

/**
 * Basic filename validation (format only)
 */
export function validateAudioFilename(filename: string): ValidationResult {
  const errors: string[] = [];
  const suggestions: string[] = [];
  let severity: "ok" | "warning" | "critical" = "ok";

  // Must be .mp3
  if (!filename.toLowerCase().endsWith(".mp3")) {
    errors.push("Must end with .mp3");
    severity = "critical";
  }

  // Must be lowercase
  if (filename !== filename.toLowerCase()) {
    errors.push("Must be all lowercase");
    suggestions.push(`Rename to: ${filename.toLowerCase()}`);
    severity = severity === "ok" ? "warning" : severity;
  }

  // No spaces
  if (filename.includes(" ")) {
    errors.push("Must not contain spaces");
    suggestions.push(`Replace spaces with hyphens`);
    severity = "critical";
  }

  // No underscores (prefer hyphens)
  if (filename.includes("_")) {
    errors.push("Should use hyphens instead of underscores");
    suggestions.push(`Rename to: ${filename.replace(/_/g, "-")}`);
    severity = severity === "ok" ? "warning" : severity;
  }

  // Must end with language suffix
  const hasLangSuffix = /-en\.mp3$/i.test(filename) || /-vi\.mp3$/i.test(filename);
  if (!hasLangSuffix) {
    errors.push("Must end with -en.mp3 or -vi.mp3");
    severity = "critical";
  }

  // No special characters except hyphen and dot
  const invalidChars = filename.replace(/[a-z0-9\-\.]/gi, "");
  if (invalidChars.length > 0) {
    errors.push(`Contains invalid characters: ${invalidChars}`);
    severity = "critical";
  }

  // No leading/trailing quotes or special chars
  if (/^[\"']/.test(filename)) {
    errors.push("Starts with quote character (corrupted)");
    severity = "critical";
  }

  // Generate expected canonical name (normalized display form; keeps .mp3)
  const expectedCanonicalName = normalizeFilename(filename);

  return {
    isValid: errors.length === 0,
    errors,
    suggestions,
    expectedCanonicalName,
    severity,
  };
}

/**
 * Room-aware validation (Phase 2+ requirement)
 * Validates filename against room context with all three core rules
 */
export function validateWithRoomContext(
  filename: string,
  roomId: string,
  entrySlugs?: (string | number)[],
  allFilenames?: string[]
): RoomAwareValidationResult {
  const baseValidation = validateAudioFilename(filename);
  const errors = [...baseValidation.errors];
  const suggestions = [...baseValidation.suggestions];
  let severity = baseValidation.severity;
  let roomIdMatch = false;
  let entryMatch = false;
  let duplicateOf: string | undefined;
  let confidenceScore = 50;

  const normalizedFilename = String(filename || "").toLowerCase();
  const normalizedRoomId = normalizeRoomIdToHyphen(roomId);

  // RULE 1: Filename MUST start with roomId (CRITICAL)
  if (normalizedFilename.startsWith(normalizedRoomId + "-")) {
    roomIdMatch = true;
    confidenceScore += 20;
  } else {
    errors.push(`CRITICAL: Filename must start with roomId: ${normalizedRoomId}-`);
    severity = "critical";

    // Suggest correct prefix
    const lang = extractLanguage(filename);
    if (lang) {
      const corrected =
        normalizedRoomId +
        "-" +
        normalizedFilename.replace(/^[a-z0-9\-]+?-/, "");
      suggestions.push(`Add roomId prefix: ${corrected}`);
    }
  }

  // RULE 2: Filename MUST match an actual JSON entry (CRITICAL)
  if (entrySlugs && entrySlugs.length > 0) {
    const lang = extractLanguage(filename);
    if (lang) {
      // normalizeKey strips extension; stable for comparisons across sources
      const filenameKey = normalizeKey(filename);

      for (const slug of entrySlugs) {
        const expectedName = generateCanonicalFilename(roomId, slug, lang);
        const expectedKey = normalizeKey(expectedName);

        // Compare BOTH raw canonical and key-normalized forms
        if (normalizedFilename === expectedName || filenameKey === expectedKey) {
          entryMatch = true;
          confidenceScore += 20;
          break;
        }
      }

      // Numeric token fallback: accept legacy "...-entry-0-en.mp3"
      if (!entryMatch) {
        const numericToken = extractNumericTokenFromFilename(filename);
        if (numericToken != null) {
          const n = parseInt(numericToken, 10);
          const hasNumericSlug = entrySlugs.some((s) => {
            if (typeof s === "number") return s === n;
            const t = String(s).trim();
            return isPureNumberToken(t) && parseInt(t, 10) === n;
          });

          if (hasNumericSlug) {
            entryMatch = true;
            confidenceScore += 18;
          }
        }
      }

      if (!entryMatch) {
        // Try fuzzy match using similarity score
        const { slug: closestSlug, score } = findClosestEntrySlugWithScore(
          filename,
          roomId,
          entrySlugs,
          lang
        );

        if (closestSlug != null) {
          const suggestedName = generateCanonicalFilename(roomId, closestSlug, lang);
          if (score > 0.7) {
            suggestions.push(`Close match (${Math.round(score * 100)}%): ${suggestedName}`);
            confidenceScore += Math.round(score * 10);
          } else {
            errors.push(`CRITICAL: Filename does not match any entry in room JSON`);
            severity = "critical";
          }
        } else {
          errors.push(`CRITICAL: Filename does not match any entry in room JSON`);
          severity = "critical";
        }
      }
    }
  }

  // RULE 3: Detect duplicate normalized names (CRITICAL)
  if (allFilenames && allFilenames.length > 0) {
    const myKey = normalizeKey(filename);
    for (const other of allFilenames) {
      if (other !== filename && normalizeKey(other) === myKey) {
        duplicateOf = other;
        errors.push(`DUPLICATE: Normalizes to same as: ${other}`);
        severity = "critical";
        confidenceScore -= 20;
        break;
      }
    }
  }

  // Generate expected canonical (best guess)
  const lang = extractLanguage(filename);
  let expectedCanonicalName = baseValidation.expectedCanonicalName;

  if (lang && entrySlugs && entrySlugs.length > 0) {
    const { slug: closestSlug } = findClosestEntrySlugWithScore(
      filename,
      roomId,
      entrySlugs,
      lang
    );
    if (closestSlug != null) {
      expectedCanonicalName = generateCanonicalFilename(roomId, closestSlug, lang);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    suggestions,
    expectedCanonicalName,
    severity,
    roomIdMatch,
    entryMatch,
    duplicateOf,
    confidenceScore: Math.max(0, Math.min(100, confidenceScore)),
  };
}

/**
 * Find closest entry slug with similarity score
 */
function findClosestEntrySlugWithScore(
  filename: string,
  roomId: string,
  entrySlugs: (string | number)[],
  lang: "en" | "vi"
): { slug: string | number | null; score: number } {
  const filenameKey = normalizeKey(filename);
  let bestMatch: { slug: string | number | null; score: number } = {
    slug: null,
    score: 0,
  };

  for (const slug of entrySlugs) {
    const expected = generateCanonicalFilename(roomId, slug, lang);
    const score = similarityScore(filenameKey, normalizeKey(expected));

    if (score > bestMatch.score) {
      bestMatch = { slug, score };
    }
  }

  return bestMatch;
}

/**
 * Detect duplicate normalized filenames in a list
 */
export function detectDuplicates(filenames: string[]): DuplicateGroup[] {
  const groups = new Map<string, string[]>();

  for (const filename of filenames) {
    const normalized = normalizeKey(filename);
    const existing = groups.get(normalized) || [];
    existing.push(filename);
    groups.set(normalized, existing);
  }

  const duplicates: DuplicateGroup[] = [];
  for (const [normalizedName, variants] of groups) {
    if (variants.length > 1) {
      const canonical = variants.find((v) => normalizeKey(v) === normalizedName) || variants[0];
      duplicates.push({
        normalizedName,
        variants,
        keepRecommendation: canonical,
      });
    }
  }

  return duplicates;
}

/**
 * Detect cross-room inconsistencies
 */
export function detectCrossRoomIssues(
  roomsData: Array<{ roomId: string; audioFiles: string[] }>
): CrossRoomIssue[] {
  const issues: CrossRoomIssue[] = [];
  const fileToRooms = new Map<string, string[]>();

  // Map files to rooms
  for (const room of roomsData) {
    for (const file of room.audioFiles) {
      const normalized = normalizeKey(file);
      const rooms = fileToRooms.get(normalized) || [];
      rooms.push(room.roomId);
      fileToRooms.set(normalized, rooms);
    }
  }

  // Detect collisions (same file in multiple rooms)
  for (const [file, rooms] of fileToRooms) {
    if (rooms.length > 1) {
      issues.push({
        type: "collision",
        filename: file,
        rooms,
        description: `File "${file}" is referenced by multiple rooms: ${rooms.join(", ")}`,
        severity: "critical",
      });
    }
  }

  // Detect EN/VI mismatches (EN exists but VI missing or vice versa)
  for (const room of roomsData) {
    const enFiles = room.audioFiles.filter((f) => f.endsWith("-en.mp3"));
    const viFiles = room.audioFiles.filter((f) => f.endsWith("-vi.mp3"));

    for (const enFile of enFiles) {
      const viEquivalent = enFile.replace(/-en\.mp3$/, "-vi.mp3");
      if (!viFiles.includes(viEquivalent)) {
        issues.push({
          type: "en-vi-mismatch",
          filename: enFile,
          rooms: [room.roomId],
          description: `EN file "${enFile}" has no VI counterpart in room "${room.roomId}"`,
          severity: "warning",
        });
      }
    }

    for (const viFile of viFiles) {
      const enEquivalent = viFile.replace(/-vi\.mp3$/, "-en.mp3");
      if (!enFiles.includes(enEquivalent)) {
        issues.push({
          type: "en-vi-mismatch",
          filename: viFile,
          rooms: [room.roomId],
          description: `VI file "${viFile}" has no EN counterpart in room "${room.roomId}"`,
          severity: "warning",
        });
      }
    }
  }

  return issues;
}

/**
 * Calculate room completeness score (0-100)
 */
export function calculateRoomCompletenessScore(
  roomId: string,
  totalEntries: number,
  presentEn: number,
  presentVi: number,
  namingViolations: number,
  orphanCount: number,
  jsonErrors: number
): RoomCompletenessScore {
  const issues: string[] = [];

  // Audio coverage (40 points)
  const expectedAudio = totalEntries * 2; // EN + VI for each entry
  const actualAudio = presentEn + presentVi;
  const audioCoverage =
    expectedAudio > 0 ? Math.round((actualAudio / expectedAudio) * 40) : 40;

  if (audioCoverage < 40) {
    issues.push(`Missing ${expectedAudio - actualAudio} audio files`);
  }

  // Naming correctness (30 points)
  const namingCorrectness = Math.max(0, 30 - namingViolations * 5);
  if (namingViolations > 0) {
    issues.push(`${namingViolations} naming violations`);
  }

  // JSON consistency (20 points)
  const jsonConsistency = Math.max(0, 20 - jsonErrors * 10);
  if (jsonErrors > 0) {
    issues.push(`${jsonErrors} JSON errors`);
  }

  // No orphans (10 points)
  const noOrphans = orphanCount === 0 ? 10 : Math.max(0, 10 - orphanCount * 2);
  if (orphanCount > 0) {
    issues.push(`${orphanCount} orphan files`);
  }

  return {
    roomId,
    score: audioCoverage + namingCorrectness + jsonConsistency + noOrphans,
    breakdown: {
      audioCoverage,
      namingCorrectness,
      jsonConsistency,
      noOrphans,
    },
    issues,
  };
}

/**
 * Generate fix report for a room
 */
export function generateRoomFixReport(
  roomId: string,
  missingEn: string[],
  missingVi: string[],
  namingViolations: Array<{ current: string; suggested: string }>,
  jsonErrors: string[],
  duplicates: string[],
  orphans: string[],
  completenessScore: number
): FixReport {
  const recommendedFixes: string[] = [];

  if (missingEn.length > 0 || missingVi.length > 0) {
    recommendedFixes.push(`Generate ${missingEn.length + missingVi.length} missing audio files`);
  }
  if (namingViolations.length > 0) {
    recommendedFixes.push(`Rename ${namingViolations.length} files to canonical format`);
  }
  if (duplicates.length > 0) {
    recommendedFixes.push(`Resolve ${duplicates.length} duplicate files (move to _duplicates/)`);
  }
  if (orphans.length > 0) {
    recommendedFixes.push(`Clean up ${orphans.length} orphan files`);
  }
  if (jsonErrors.length > 0) {
    recommendedFixes.push(`Fix ${jsonErrors.length} JSON reference errors`);
  }

  return {
    roomId,
    missingAudio: [...missingEn, ...missingVi],
    wrongNames: namingViolations.map((v) => ({
      current: v.current,
      suggested: v.suggested,
      confidence: 85,
    })),
    jsonErrors,
    duplicates,
    orphans,
    recommendedFixes,
    completenessScore,
  };
}

/**
 * Generate a canonical filename from room ID, entry slug, and language
 */
export function generateCanonicalFilename(
  roomId: string,
  entrySlug: string | number,
  language: "en" | "vi"
): string {
  const cleanRoomId = normalizeRoomIdToHyphen(roomId);

  const cleanSlug =
    typeof entrySlug === "number"
      ? String(entrySlug)
      : String(entrySlug ?? "")
          .toLowerCase()
          .replace(/[_\s]+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-+|-+$/g, "");

  return `${cleanRoomId}-${cleanSlug}-${language}.mp3`;
}

export function getCanonicalAudioPair(
  roomId: string,
  entrySlug: string | number
): { en: string; vi: string } {
  return {
    en: generateCanonicalFilename(roomId, entrySlug, "en"),
    vi: generateCanonicalFilename(roomId, entrySlug, "vi"),
  };
}

/**
 * Normalize an existing filename to canonical-like format.
 * IMPORTANT: Tests expect the normalized value to KEEP ".mp3".
 */
export function normalizeFilename(filename: string): string {
  let s = String(filename || "")
    .toLowerCase()
    .trim()
    .replace(/^[\"']+/, "");

  const hasMp3 = /\.mp3$/i.test(s) || s.includes(".mp3");

  // strip any .mp3 occurrences; we will add exactly one back if needed
  s = s.replace(/\.mp3/gi, "");

  s = s
    .replace(/\s+/g, "-")
    .replace(/_/g, "-")
    .replace(/--+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();

  return hasMp3 ? `${s}.mp3` : s;
}

/**
 * Internal comparison key:
 * - normalized like normalizeFilename()
 * - but WITHOUT ".mp3"
 */
function normalizeKey(filename: string): string {
  const n = normalizeFilename(filename);
  return n.replace(/\.mp3$/i, "");
}

function normalizeRoomIdToHyphen(roomId: string): string {
  return String(roomId || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractLanguage(filename: string): "en" | "vi" | null {
  if (/_en\.mp3$/i.test(filename) || /-en\.mp3$/i.test(filename)) return "en";
  if (/_vi\.mp3$/i.test(filename) || /-vi\.mp3$/i.test(filename)) return "vi";
  return null;
}

/**
 * Extract numeric token before language suffix.
 * Supports:
 *   ...-0-en.mp3
 *   ...-entry-0-en.mp3
 *   ..._0_en.mp3
 */
function extractNumericTokenFromFilename(filename: string): string | null {
  const s = String(filename || "").trim().toLowerCase();

  const m = s.match(/[-_]+(\d+)[-_]+(en|vi)\.mp3$/i);
  if (m && m[1]) return m[1];

  const m2 = s.match(/[-_]+(\d+)(en|vi)\.mp3$/i);
  if (m2 && m2[1]) return m2[1];

  return null;
}

function isPureNumberToken(s: string): boolean {
  return /^[0-9]+$/.test(String(s || "").trim());
}

/**
 * Find best orphan match using similarity score
 */
export function findOrphanMatch(
  orphanFile: string,
  roomEntries: Array<{ roomId: string; slug: string | number }>
): { roomId: string; slug: string | number; confidence: number } | null {
  const lang = extractLanguage(orphanFile);
  if (!lang) return null;

  let bestMatch: { roomId: string; slug: string | number; confidence: number } | null =
    null;

  for (const entry of roomEntries) {
    const canonical = generateCanonicalFilename(entry.roomId, entry.slug, lang);
    const score = similarityScore(normalizeKey(orphanFile), normalizeKey(canonical));

    if (score > 0.85 && (!bestMatch || score > bestMatch.confidence)) {
      bestMatch = {
        roomId: entry.roomId,
        slug: entry.slug,
        confidence: score,
      };
    }
  }

  return bestMatch;
}

/**
 * Batch validate all filenames with duplicate detection
 */
export function batchValidate(
  filenames: string[],
  roomId?: string,
  entrySlugs?: (string | number)[]
): {
  results: Map<string, ValidationResult | RoomAwareValidationResult>;
  duplicates: DuplicateGroup[];
  summary: {
    total: number;
    valid: number;
    warnings: number;
    critical: number;
    duplicateGroups: number;
    averageConfidence: number;
  };
} {
  const results = new Map<string, ValidationResult | RoomAwareValidationResult>();
  const duplicates = detectDuplicates(filenames);

  let valid = 0;
  let warnings = 0;
  let critical = 0;
  let totalConfidence = 0;

  for (const filename of filenames) {
    const result = roomId
      ? validateWithRoomContext(filename, roomId, entrySlugs, filenames)
      : validateAudioFilename(filename);

    results.set(filename, result);

    if (result.isValid) valid++;
    else if (result.severity === "warning") warnings++;
    else if (result.severity === "critical") critical++;

    if ("confidenceScore" in result) {
      totalConfidence += result.confidenceScore;
    } else {
      totalConfidence += result.isValid ? 100 : 50;
    }
  }

  return {
    results,
    duplicates,
    summary: {
      total: filenames.length,
      valid,
      warnings,
      critical,
      duplicateGroups: duplicates.length,
      averageConfidence: filenames.length > 0 ? Math.round(totalConfidence / filenames.length) : 0,
    },
  };
}

/**
 * TEST HOOK (Vitest):
 * Some snapshot/unit tests import { __mock } from this module.
 * Keep it tiny and stable; do NOT add runtime behavior.
 */
export const __mock = {
  levenshteinDistance,
  similarityScore,
  validateAudioFilename,
  validateWithRoomContext,
  detectDuplicates,
  detectCrossRoomIssues,
  calculateRoomCompletenessScore,
  generateRoomFixReport,
  generateCanonicalFilename,
  getCanonicalAudioPair,
  normalizeFilename,
  extractLanguage,
  findOrphanMatch,
  batchValidate,
};
