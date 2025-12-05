/**
 * Auto Repair Engine v3.0 - Full Expanded Version
 * Phase 2-4: Complete self-healing audio system
 * 
 * Features:
 * - Auto-rename with full propagation (storage, JSON, manifest)
 * - Levenshtein-based orphan matching
 * - Cross-room inconsistency detection
 * - Room completeness scoring
 * - Auto-generated fix reports
 */

import { 
  validateAudioFilename, 
  generateCanonicalFilename, 
  normalizeFilename, 
  extractLanguage,
  similarityScore,
  getCanonicalAudioPair,
  calculateRoomCompletenessScore,
  generateRoomFixReport,
  detectCrossRoomIssues,
  type RoomCompletenessScore,
  type FixReport,
  type CrossRoomIssue
} from './filenameValidator';

export interface RepairOperation {
  type: 'rename' | 'update-json' | 'update-manifest' | 'delete-orphan' | 'move-duplicate' | 'create-reference';
  source: string;
  target: string;
  roomId?: string;
  entrySlug?: string;
  language?: 'en' | 'vi';
  confidence: number;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface RepairBatch {
  operations: RepairOperation[];
  summary: {
    totalOperations: number;
    renameOps: number;
    jsonUpdateOps: number;
    manifestUpdateOps: number;
    orphanCleanupOps: number;
    duplicateOps: number;
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
  };
  crossRoomIssues: CrossRoomIssue[];
  roomScores: RoomCompletenessScore[];
  fixReports: FixReport[];
  generatedAt: string;
}

export interface NamingViolation {
  filename: string;
  roomId?: string;
  entrySlug?: string;
  violations: string[];
  suggestedCanonical: string;
  confidence: number;
  severity: 'warning' | 'critical';
}

export interface RoomAudioData {
  roomId: string;
  entries: Array<{
    slug: string | number;
    audio?: { en?: string; vi?: string } | string;
  }>;
  audioFiles: string[];
}

/**
 * Analyze a filename and generate repair operations
 */
export function analyzeAndRepair(
  filename: string,
  roomId?: string,
  entrySlug?: string | number
): RepairOperation | null {
  const validation = validateAudioFilename(filename);
  
  if (validation.isValid) {
    return null;
  }

  const language = extractLanguage(filename);
  if (!language) {
    return null; // Cannot determine language, skip
  }

  const canonical = roomId && entrySlug
    ? generateCanonicalFilename(roomId, entrySlug, language)
    : normalizeFilename(filename);

  if (canonical === filename.toLowerCase()) {
    return null; // Already correct after normalization
  }

  const confidence = calculateConfidence(filename, canonical, roomId, entrySlug);
  
  return {
    type: 'rename',
    source: filename,
    target: canonical,
    roomId,
    entrySlug: String(entrySlug),
    language,
    confidence,
    reason: validation.errors.join('; '),
    priority: confidence >= 85 ? 'high' : confidence >= 70 ? 'medium' : 'low',
  };
}

/**
 * Calculate confidence score for a repair operation
 */
function calculateConfidence(
  source: string,
  target: string,
  roomId?: string,
  entrySlug?: string | number
): number {
  let score = 50; // Base score

  // Higher confidence if we have room context
  if (roomId) score += 20;
  if (entrySlug) score += 15;

  // Use similarity score
  const similarity = similarityScore(normalizeFilename(source), target);
  score += Math.round(similarity * 15);

  return Math.min(score, 100);
}

/**
 * Generate a comprehensive batch of repair operations
 */
export function generateRepairBatch(
  violations: NamingViolation[],
  roomsData?: RoomAudioData[]
): RepairBatch {
  const operations: RepairOperation[] = [];
  const crossRoomIssues: CrossRoomIssue[] = [];
  const roomScores: RoomCompletenessScore[] = [];
  const fixReports: FixReport[] = [];

  // Process violations
  for (const violation of violations) {
    if (violation.confidence >= 70) {
      operations.push({
        type: 'rename',
        source: violation.filename,
        target: violation.suggestedCanonical,
        roomId: violation.roomId,
        entrySlug: violation.entrySlug,
        language: extractLanguage(violation.filename) || undefined,
        confidence: violation.confidence,
        reason: violation.violations.join('; '),
        priority: violation.confidence >= 85 ? 'high' : violation.confidence >= 70 ? 'medium' : 'low',
      });
    }
  }

  // Cross-room analysis if data provided
  if (roomsData && roomsData.length > 0) {
    const issues = detectCrossRoomIssues(roomsData);
    crossRoomIssues.push(...issues);
  }

  return {
    operations,
    summary: {
      totalOperations: operations.length,
      renameOps: operations.filter(o => o.type === 'rename').length,
      jsonUpdateOps: operations.filter(o => o.type === 'update-json').length,
      manifestUpdateOps: operations.filter(o => o.type === 'update-manifest').length,
      orphanCleanupOps: operations.filter(o => o.type === 'delete-orphan').length,
      duplicateOps: operations.filter(o => o.type === 'move-duplicate').length,
      highPriority: operations.filter(o => o.priority === 'high').length,
      mediumPriority: operations.filter(o => o.priority === 'medium').length,
      lowPriority: operations.filter(o => o.priority === 'low').length,
    },
    crossRoomIssues,
    roomScores,
    fixReports,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Validate filename against room context
 */
export function validateWithRoomContext(
  filename: string,
  roomId: string,
  entrySlug?: string | number
): NamingViolation | null {
  const violations: string[] = [];
  const baseValidation = validateAudioFilename(filename);
  
  violations.push(...baseValidation.errors);

  // Check if filename starts with roomId (CRITICAL RULE)
  const normalizedRoomId = roomId.toLowerCase().replace(/[_\s]/g, '-');
  const normalizedFilename = filename.toLowerCase();
  
  if (!normalizedFilename.startsWith(normalizedRoomId + '-')) {
    violations.push(`CRITICAL: Must start with roomId: ${normalizedRoomId}-`);
  }

  // Generate expected canonical filename
  const language = extractLanguage(filename);
  const suggestedCanonical = language && entrySlug
    ? generateCanonicalFilename(roomId, entrySlug, language)
    : normalizeFilename(filename);

  if (violations.length === 0) {
    return null;
  }

  const confidence = calculateConfidence(filename, suggestedCanonical, roomId, entrySlug);

  return {
    filename,
    roomId,
    entrySlug: entrySlug ? String(entrySlug) : undefined,
    violations,
    suggestedCanonical,
    confidence,
    severity: violations.some(v => v.includes('CRITICAL')) ? 'critical' : 'warning',
  };
}

/**
 * Generate JSON update operations for a room
 */
export function generateJsonUpdateOperations(
  roomId: string,
  entries: Array<{ audio?: { en?: string; vi?: string } | string; slug?: string; id?: string | number }>,
  renames: Map<string, string>
): RepairOperation[] {
  const operations: RepairOperation[] = [];

  for (const entry of entries) {
    if (!entry.audio) continue;

    const entrySlug = entry.slug || entry.id;
    
    if (typeof entry.audio === 'string') {
      const newFilename = renames.get(entry.audio);
      if (newFilename) {
        operations.push({
          type: 'update-json',
          source: entry.audio,
          target: newFilename,
          roomId,
          entrySlug: String(entrySlug),
          confidence: 95,
          reason: 'Rename propagation to JSON',
          priority: 'high',
        });
      }
    } else {
      if (entry.audio.en) {
        const newFilename = renames.get(entry.audio.en);
        if (newFilename) {
          operations.push({
            type: 'update-json',
            source: entry.audio.en,
            target: newFilename,
            roomId,
            entrySlug: String(entrySlug),
            language: 'en',
            confidence: 95,
            reason: 'Rename propagation to JSON (EN)',
            priority: 'high',
          });
        }
      }
      if (entry.audio.vi) {
        const newFilename = renames.get(entry.audio.vi);
        if (newFilename) {
          operations.push({
            type: 'update-json',
            source: entry.audio.vi,
            target: newFilename,
            roomId,
            entrySlug: String(entrySlug),
            language: 'vi',
            confidence: 95,
            reason: 'Rename propagation to JSON (VI)',
            priority: 'high',
          });
        }
      }
    }
  }

  return operations;
}

/**
 * Generate operations to fix missing audio references in JSON
 */
export function generateMissingAudioFixOps(
  roomId: string,
  entries: Array<{ slug?: string; id?: string | number; audio?: any }>
): RepairOperation[] {
  const operations: RepairOperation[] = [];

  entries.forEach((entry, index) => {
    const entrySlug = entry.slug || entry.id || index;
    const canonical = getCanonicalAudioPair(roomId, entrySlug);

    if (!entry.audio) {
      // No audio at all - create reference
      operations.push({
        type: 'create-reference',
        source: '',
        target: JSON.stringify(canonical),
        roomId,
        entrySlug: String(entrySlug),
        confidence: 90,
        reason: 'Missing audio reference - creating canonical pair',
        priority: 'high',
      });
    } else if (typeof entry.audio === 'object') {
      // Check for reversed EN/VI
      if (entry.audio.en && entry.audio.vi) {
        const enLang = extractLanguage(entry.audio.en);
        const viLang = extractLanguage(entry.audio.vi);
        
        if (enLang === 'vi' && viLang === 'en') {
          operations.push({
            type: 'update-json',
            source: `${entry.audio.en}|${entry.audio.vi}`,
            target: `${entry.audio.vi}|${entry.audio.en}`,
            roomId,
            entrySlug: String(entrySlug),
            confidence: 95,
            reason: 'EN/VI audio references are reversed',
            priority: 'high',
          });
        }
      }
    }
  });

  return operations;
}

/**
 * Detect orphan files with Levenshtein-based matching
 */
export function detectOrphansWithMatching(
  manifestFiles: string[],
  referencedFiles: Set<string>,
  roomEntries: Array<{ roomId: string; slug: string | number }>
): { orphans: string[]; potentialMatches: Map<string, { roomId: string; slug: string | number; confidence: number }> } {
  const orphans: string[] = [];
  const potentialMatches = new Map<string, { roomId: string; slug: string | number; confidence: number }>();
  
  for (const file of manifestFiles) {
    const normalized = file.toLowerCase();
    if (!referencedFiles.has(normalized)) {
      orphans.push(file);
      
      // Try to find a match using Levenshtein
      const lang = extractLanguage(file);
      if (lang) {
        let bestMatch: { roomId: string; slug: string | number; confidence: number } | null = null;
        
        for (const entry of roomEntries) {
          const canonical = generateCanonicalFilename(entry.roomId, entry.slug, lang);
          const score = similarityScore(normalizeFilename(file), canonical);
          
          if (score > 0.85 && (!bestMatch || score > bestMatch.confidence)) {
            bestMatch = {
              roomId: entry.roomId,
              slug: entry.slug,
              confidence: score
            };
          }
        }
        
        if (bestMatch) {
          potentialMatches.set(file, bestMatch);
        }
      }
    }
  }

  return { orphans, potentialMatches };
}

/**
 * Generate cleanup operations for orphans
 */
export function generateOrphanCleanupOps(
  orphans: string[],
  potentialMatches?: Map<string, { roomId: string; slug: string | number; confidence: number }>
): RepairOperation[] {
  return orphans.map(file => {
    const match = potentialMatches?.get(file);
    
    if (match && match.confidence > 0.85) {
      // High confidence match - rename instead of delete
      const lang = extractLanguage(file);
      const canonical = lang 
        ? generateCanonicalFilename(match.roomId, match.slug, lang)
        : file;
      
      return {
        type: 'rename' as const,
        source: file,
        target: canonical,
        roomId: match.roomId,
        entrySlug: String(match.slug),
        language: lang || undefined,
        confidence: Math.round(match.confidence * 100),
        reason: `Orphan matched to entry (${Math.round(match.confidence * 100)}% confidence)`,
        priority: 'medium' as const,
      };
    }
    
    // No match - move to _orphans folder
    return {
      type: 'delete-orphan' as const,
      source: file,
      target: `_orphans/${file}`,
      confidence: 60,
      reason: 'File not referenced in any room JSON - move to _orphans/',
      priority: 'low' as const,
    };
  });
}

/**
 * Generate duplicate resolution operations
 */
export function generateDuplicateResolutionOps(
  duplicates: Array<{ normalizedName: string; variants: string[]; keepRecommendation: string }>
): RepairOperation[] {
  const operations: RepairOperation[] = [];
  
  for (const dup of duplicates) {
    for (const variant of dup.variants) {
      if (variant !== dup.keepRecommendation) {
        operations.push({
          type: 'move-duplicate',
          source: variant,
          target: `_duplicates/${variant}`,
          confidence: 80,
          reason: `Duplicate of ${dup.keepRecommendation} - move to _duplicates/`,
          priority: 'medium',
        });
      }
    }
  }
  
  return operations;
}

/**
 * Generate complete fix report for all rooms
 */
export function generateCompleteFixReports(
  roomsData: RoomAudioData[],
  storageFiles: Set<string>,
  orphanFiles: string[]
): FixReport[] {
  const reports: FixReport[] = [];
  
  for (const room of roomsData) {
    const missingEn: string[] = [];
    const missingVi: string[] = [];
    const wrongNames: Array<{ current: string; suggested: string }> = [];
    const jsonErrors: string[] = [];
    
    for (const entry of room.entries) {
      const slug = entry.slug;
      const canonical = getCanonicalAudioPair(room.roomId, slug);
      
      // Check for missing audio
      if (!storageFiles.has(canonical.en.toLowerCase())) {
        missingEn.push(canonical.en);
      }
      if (!storageFiles.has(canonical.vi.toLowerCase())) {
        missingVi.push(canonical.vi);
      }
      
      // Check for wrong names
      if (entry.audio) {
        if (typeof entry.audio === 'object') {
          if (entry.audio.en && entry.audio.en !== canonical.en) {
            const validation = validateAudioFilename(entry.audio.en);
            if (!validation.isValid) {
              wrongNames.push({ current: entry.audio.en, suggested: canonical.en });
            }
          }
          if (entry.audio.vi && entry.audio.vi !== canonical.vi) {
            const validation = validateAudioFilename(entry.audio.vi);
            if (!validation.isValid) {
              wrongNames.push({ current: entry.audio.vi, suggested: canonical.vi });
            }
          }
        }
      } else {
        jsonErrors.push(`Entry ${slug} has no audio reference`);
      }
    }
    
    // Calculate completeness score
    const score = calculateRoomCompletenessScore(
      room.roomId,
      room.entries.length,
      room.entries.length - missingEn.length,
      room.entries.length - missingVi.length,
      wrongNames.length,
      0, // orphans calculated separately
      jsonErrors.length
    );
    
    reports.push(generateRoomFixReport(
      room.roomId,
      missingEn,
      missingVi,
      wrongNames,
      jsonErrors,
      [], // duplicates
      orphanFiles.filter(f => f.toLowerCase().startsWith(room.roomId.toLowerCase())),
      score.score
    ));
  }
  
  // Sort by completeness score (lowest first)
  return reports.sort((a, b) => a.completenessScore - b.completenessScore);
}

// Re-export types
export type { RoomCompletenessScore, FixReport, CrossRoomIssue };
