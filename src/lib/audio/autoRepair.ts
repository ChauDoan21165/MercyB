/**
 * Auto Repair Engine for Audio Files
 * Phase 2: Automated correction and self-repair
 */

import { validateAudioFilename, generateCanonicalFilename, normalizeFilename, extractLanguage } from './filenameValidator';

export interface RepairOperation {
  type: 'rename' | 'update-json' | 'update-manifest' | 'delete-orphan';
  source: string;
  target: string;
  roomId?: string;
  entrySlug?: string;
  language?: 'en' | 'vi';
  confidence: number;
  reason: string;
}

export interface RepairBatch {
  operations: RepairOperation[];
  summary: {
    totalOperations: number;
    renameOps: number;
    jsonUpdateOps: number;
    manifestUpdateOps: number;
    orphanCleanupOps: number;
  };
  generatedAt: string;
}

export interface NamingViolation {
  filename: string;
  roomId?: string;
  entrySlug?: string;
  violations: string[];
  suggestedCanonical: string;
  confidence: number;
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

  return {
    type: 'rename',
    source: filename,
    target: canonical,
    roomId,
    entrySlug: String(entrySlug),
    language,
    confidence: calculateConfidence(filename, canonical, roomId, entrySlug),
    reason: validation.errors.join('; '),
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

  // Higher confidence if only case difference
  if (source.toLowerCase() === target.toLowerCase()) {
    score += 10;
  }

  // Higher confidence if similar length
  const lengthDiff = Math.abs(source.length - target.length);
  if (lengthDiff < 5) score += 5;

  return Math.min(score, 100);
}

/**
 * Generate a batch of repair operations from violations
 */
export function generateRepairBatch(
  violations: NamingViolation[]
): RepairBatch {
  const operations: RepairOperation[] = [];

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
      });
    }
  }

  return {
    operations,
    summary: {
      totalOperations: operations.length,
      renameOps: operations.filter(o => o.type === 'rename').length,
      jsonUpdateOps: operations.filter(o => o.type === 'update-json').length,
      manifestUpdateOps: operations.filter(o => o.type === 'update-manifest').length,
      orphanCleanupOps: operations.filter(o => o.type === 'delete-orphan').length,
    },
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

  // Check if filename starts with roomId
  const normalizedRoomId = roomId.toLowerCase().replace(/[_\s]/g, '-');
  const normalizedFilename = filename.toLowerCase();
  
  if (!normalizedFilename.startsWith(normalizedRoomId + '-')) {
    violations.push(`Filename must start with roomId: ${normalizedRoomId}`);
  }

  // Generate expected canonical filename
  const language = extractLanguage(filename);
  const suggestedCanonical = language && entrySlug
    ? generateCanonicalFilename(roomId, entrySlug, language)
    : normalizeFilename(filename);

  if (violations.length === 0) {
    return null;
  }

  return {
    filename,
    roomId,
    entrySlug: entrySlug ? String(entrySlug) : undefined,
    violations,
    suggestedCanonical,
    confidence: calculateConfidence(filename, suggestedCanonical, roomId, entrySlug),
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
          confidence: 90,
          reason: 'Rename propagation to JSON',
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
            confidence: 90,
            reason: 'Rename propagation to JSON (EN)',
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
            confidence: 90,
            reason: 'Rename propagation to JSON (VI)',
          });
        }
      }
    }
  }

  return operations;
}

/**
 * Detect orphan files (in storage but not referenced)
 */
export function detectOrphans(
  manifestFiles: string[],
  referencedFiles: Set<string>
): string[] {
  const orphans: string[] = [];
  
  for (const file of manifestFiles) {
    const normalized = file.toLowerCase();
    if (!referencedFiles.has(normalized)) {
      orphans.push(file);
    }
  }

  return orphans;
}

/**
 * Generate cleanup operations for orphans
 */
export function generateOrphanCleanupOps(orphans: string[]): RepairOperation[] {
  return orphans.map(file => ({
    type: 'delete-orphan' as const,
    source: file,
    target: '',
    confidence: 60, // Lower confidence for deletions
    reason: 'File not referenced in any room JSON',
  }));
}
