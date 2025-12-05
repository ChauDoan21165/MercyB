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
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  suggestions: string[];
  expectedCanonicalName?: string;
  severity: 'ok' | 'warning' | 'critical';
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
  type: 'collision' | 'en-vi-mismatch' | 'shared-name';
  filename: string;
  rooms: string[];
  description: string;
  severity: 'warning' | 'critical';
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
  let severity: 'ok' | 'warning' | 'critical' = 'ok';

  // Must be .mp3
  if (!filename.toLowerCase().endsWith('.mp3')) {
    errors.push('Must end with .mp3');
    severity = 'critical';
  }

  // Must be lowercase
  if (filename !== filename.toLowerCase()) {
    errors.push('Must be all lowercase');
    suggestions.push(`Rename to: ${filename.toLowerCase()}`);
    severity = severity === 'ok' ? 'warning' : severity;
  }

  // No spaces
  if (filename.includes(' ')) {
    errors.push('Must not contain spaces');
    suggestions.push(`Replace spaces with hyphens`);
    severity = 'critical';
  }

  // No underscores (prefer hyphens)
  if (filename.includes('_')) {
    errors.push('Should use hyphens instead of underscores');
    suggestions.push(`Rename to: ${filename.replace(/_/g, '-')}`);
    severity = severity === 'ok' ? 'warning' : severity;
  }

  // Must end with language suffix
  const hasLangSuffix = /-en\.mp3$/i.test(filename) || /-vi\.mp3$/i.test(filename);
  if (!hasLangSuffix) {
    errors.push('Must end with -en.mp3 or -vi.mp3');
    severity = 'critical';
  }

  // No special characters except hyphen and dot
  const invalidChars = filename.replace(/[a-z0-9\-\.]/gi, '');
  if (invalidChars.length > 0) {
    errors.push(`Contains invalid characters: ${invalidChars}`);
    severity = 'critical';
  }

  // No leading/trailing quotes or special chars
  if (/^[\"']/.test(filename)) {
    errors.push('Starts with quote character (corrupted)');
    severity = 'critical';
  }

  // Generate expected canonical name
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

  const normalizedFilename = filename.toLowerCase();
  const normalizedRoomId = roomId.toLowerCase().replace(/[_\\s]/g, '-');

  // RULE 1: Filename MUST start with roomId (CRITICAL)
  if (normalizedFilename.startsWith(normalizedRoomId + '-')) {
    roomIdMatch = true;
    confidenceScore += 20;
  } else {
    errors.push(`CRITICAL: Filename must start with roomId: ${normalizedRoomId}-`);
    severity = 'critical';
    
    // Suggest correct prefix
    const lang = extractLanguage(filename);
    if (lang) {
      const corrected = normalizedRoomId + '-' + normalizedFilename.replace(/^[a-z0-9\-]+?-/, '');
      suggestions.push(`Add roomId prefix: ${corrected}`);
    }
  }

  // RULE 2: Filename MUST match an actual JSON entry (CRITICAL)
  if (entrySlugs && entrySlugs.length > 0) {
    const lang = extractLanguage(filename);
    if (lang) {
      for (const slug of entrySlugs) {
        const expectedName = generateCanonicalFilename(roomId, slug, lang);
        if (normalizedFilename === expectedName || 
            normalizeFilename(filename) === expectedName) {
          entryMatch = true;
          confidenceScore += 20;
          break;
        }
      }
      
      if (!entryMatch) {
        // Try fuzzy match using Levenshtein
        const { slug: closestSlug, score } = findClosestEntrySlugWithScore(filename, roomId, entrySlugs, lang);
        if (closestSlug) {
          const suggestedName = generateCanonicalFilename(roomId, closestSlug, lang);
          if (score > 0.7) {
            suggestions.push(`Close match (${Math.round(score * 100)}%): ${suggestedName}`);
            confidenceScore += Math.round(score * 10);
          } else {
            errors.push(`WARNING: Filename does not match any entry in room JSON`);
          }
        }
      }
    }
  }

  // RULE 3: Detect duplicate normalized names (CRITICAL)
  if (allFilenames && allFilenames.length > 0) {
    const myNormalized = normalizeFilename(filename);
    for (const other of allFilenames) {
      if (other !== filename && normalizeFilename(other) === myNormalized) {
        duplicateOf = other;
        errors.push(`DUPLICATE: Normalizes to same as: ${other}`);
        severity = 'critical';
        confidenceScore -= 20;
        break;
      }
    }
  }

  // Generate expected canonical
  const lang = extractLanguage(filename);
  let expectedCanonicalName = baseValidation.expectedCanonicalName;
  
  if (lang && entrySlugs && entrySlugs.length > 0) {
    const { slug: closestSlug } = findClosestEntrySlugWithScore(filename, roomId, entrySlugs, lang);
    if (closestSlug) {
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
  lang: 'en' | 'vi'
): { slug: string | number | null; score: number } {
  const normalizedFilename = normalizeFilename(filename);
  let bestMatch: { slug: string | number | null; score: number } = { slug: null, score: 0 };
  
  for (const slug of entrySlugs) {
    const expected = generateCanonicalFilename(roomId, slug, lang);
    const score = similarityScore(normalizedFilename, expected);
    
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
    const normalized = normalizeFilename(filename);
    const existing = groups.get(normalized) || [];
    existing.push(filename);
    groups.set(normalized, existing);
  }

  const duplicates: DuplicateGroup[] = [];
  for (const [normalizedName, variants] of groups) {
    if (variants.length > 1) {
      // Recommend keeping the one that's already in canonical format
      const canonical = variants.find(v => v === normalizedName) || variants[0];
      duplicates.push({ 
        normalizedName, 
        variants,
        keepRecommendation: canonical
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
      const normalized = normalizeFilename(file);
      const rooms = fileToRooms.get(normalized) || [];
      rooms.push(room.roomId);
      fileToRooms.set(normalized, rooms);
    }
  }
  
  // Detect collisions (same file in multiple rooms)
  for (const [file, rooms] of fileToRooms) {
    if (rooms.length > 1) {
      issues.push({
        type: 'collision',
        filename: file,
        rooms,
        description: `File "${file}" is referenced by multiple rooms: ${rooms.join(', ')}`,
        severity: 'critical'
      });
    }
  }
  
  // Detect EN/VI mismatches (EN exists but VI missing or vice versa)
  for (const room of roomsData) {
    const enFiles = room.audioFiles.filter(f => f.endsWith('-en.mp3'));
    const viFiles = room.audioFiles.filter(f => f.endsWith('-vi.mp3'));
    
    for (const enFile of enFiles) {
      const viEquivalent = enFile.replace(/-en\.mp3$/, '-vi.mp3');
      if (!viFiles.includes(viEquivalent)) {
        issues.push({
          type: 'en-vi-mismatch',
          filename: enFile,
          rooms: [room.roomId],
          description: `EN file "${enFile}" has no VI counterpart in room "${room.roomId}"`,
          severity: 'warning'
        });
      }
    }
    
    for (const viFile of viFiles) {
      const enEquivalent = viFile.replace(/-vi\.mp3$/, '-en.mp3');
      if (!enFiles.includes(enEquivalent)) {
        issues.push({
          type: 'en-vi-mismatch',
          filename: viFile,
          rooms: [room.roomId],
          description: `VI file "${viFile}" has no EN counterpart in room "${room.roomId}"`,
          severity: 'warning'
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
  const audioCoverage = expectedAudio > 0 
    ? Math.round((actualAudio / expectedAudio) * 40) 
    : 40;
  
  if (audioCoverage < 40) {
    issues.push(`Missing ${expectedAudio - actualAudio} audio files`);
  }
  
  // Naming correctness (30 points)
  const namingCorrectness = Math.max(0, 30 - (namingViolations * 5));
  if (namingViolations > 0) {
    issues.push(`${namingViolations} naming violations`);
  }
  
  // JSON consistency (20 points)
  const jsonConsistency = Math.max(0, 20 - (jsonErrors * 10));
  if (jsonErrors > 0) {
    issues.push(`${jsonErrors} JSON errors`);
  }
  
  // No orphans (10 points)
  const noOrphans = orphanCount === 0 ? 10 : Math.max(0, 10 - (orphanCount * 2));
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
      noOrphans
    },
    issues
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
  
  // Generate recommended fixes
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
    wrongNames: namingViolations.map(v => ({
      current: v.current,
      suggested: v.suggested,
      confidence: 85
    })),
    jsonErrors,
    duplicates,
    orphans,
    recommendedFixes,
    completenessScore
  };
}

/**
 * Generate a canonical filename from room ID, entry slug, and language
 */
export function generateCanonicalFilename(
  roomId: string,
  entrySlug: string | number,
  language: 'en' | 'vi'
): string {
  const cleanRoomId = roomId.toLowerCase().replace(/[_\\s]/g, '-');
  const cleanSlug = typeof entrySlug === 'number' 
    ? `entry-${entrySlug}` 
    : entrySlug.toLowerCase().replace(/[_\\s]/g, '-');
  
  return `${cleanRoomId}-${cleanSlug}-${language}.mp3`;
}

/**
 * Get canonical audio pair for an entry
 */
export function getCanonicalAudioPair(
  roomId: string,
  entrySlug: string | number
): { en: string; vi: string } {
  return {
    en: generateCanonicalFilename(roomId, entrySlug, 'en'),
    vi: generateCanonicalFilename(roomId, entrySlug, 'vi')
  };
}

/**
 * Normalize an existing filename to canonical format
 */
export function normalizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .replace(/--+/g, '-')
    .replace(/^[\"']+/, '')
    .trim();
}

/**
 * Extract language from filename
 */
export function extractLanguage(filename: string): 'en' | 'vi' | null {
  if (/_en\.mp3$/i.test(filename) || /-en\.mp3$/i.test(filename)) return 'en';
  if (/_vi\.mp3$/i.test(filename) || /-vi\.mp3$/i.test(filename)) return 'vi';
  return null;
}

/**
 * Find best orphan match using Levenshtein distance
 */
export function findOrphanMatch(
  orphanFile: string,
  roomEntries: Array<{ roomId: string; slug: string | number }>
): { roomId: string; slug: string | number; confidence: number } | null {
  const lang = extractLanguage(orphanFile);
  if (!lang) return null;
  
  let bestMatch: { roomId: string; slug: string | number; confidence: number } | null = null;
  
  for (const entry of roomEntries) {
    const canonical = generateCanonicalFilename(entry.roomId, entry.slug, lang);
    const score = similarityScore(normalizeFilename(orphanFile), canonical);
    
    if (score > 0.85 && (!bestMatch || score > bestMatch.confidence)) {
      bestMatch = {
        roomId: entry.roomId,
        slug: entry.slug,
        confidence: score
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
    else if (result.severity === 'warning') warnings++;
    else if (result.severity === 'critical') critical++;
    
    if ('confidenceScore' in result) {
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
