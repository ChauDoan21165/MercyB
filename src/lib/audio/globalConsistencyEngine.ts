/**
 * Global Consistency Engine (GCE) v1.0
 * Phase 3: True Self-Healing Audio Intelligence
 * 
 * Single source of truth for canonical audio naming across:
 * - validator
 * - autoRepair
 * - JSON refresh
 * - storage rename
 * - manifest generation
 */

import type { IntegrityMap, RoomIntegrity } from './integrityMap';
import type { SemanticMatch } from './semanticMatcher';

export interface CanonicalAudioPair {
  en: string;
  vi: string;
}

export interface GCEConfig {
  enforceRoomIdPrefix: boolean;
  enforceEntryMatch: boolean;
  autoRepairThreshold: number; // 0-1 confidence threshold
  orphanMatchThreshold: number;
  duplicateResolutionStrategy: 'keep-canonical' | 'keep-oldest' | 'keep-newest';
}

export interface GCEValidationResult {
  isValid: boolean;
  canonical: CanonicalAudioPair;
  violations: string[];
  autoRepairable: boolean;
  confidence: number;
}

export interface GCERepairPlan {
  roomId: string;
  operations: GCEOperation[];
  estimatedImpact: {
    filesRenamed: number;
    jsonUpdates: number;
    orphansResolved: number;
    duplicatesRemoved: number;
  };
  confidence: number;
}

export interface GCEOperation {
  type: 'rename' | 'update-json' | 'delete' | 'move' | 'create-ref';
  source: string;
  target: string;
  metadata: {
    roomId?: string;
    entrySlug?: string;
    language?: 'en' | 'vi';
    reason: string;
    confidence: number;
    reversible: boolean;
  };
}

// Default configuration
const DEFAULT_CONFIG: GCEConfig = {
  enforceRoomIdPrefix: true,
  enforceEntryMatch: true,
  autoRepairThreshold: 0.85,
  orphanMatchThreshold: 0.85,
  duplicateResolutionStrategy: 'keep-canonical',
};

let currentConfig: GCEConfig = { ...DEFAULT_CONFIG };

/**
 * Configure the GCE
 */
export function configureGCE(config: Partial<GCEConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * Get current GCE configuration
 */
export function getGCEConfig(): GCEConfig {
  return { ...currentConfig };
}

/**
 * THE SINGLE SOURCE OF TRUTH: Generate canonical audio pair for a room entry
 * Every script MUST use this function.
 */
export function getCanonicalAudioForRoom(
  roomId: string,
  entrySlug: string | number
): CanonicalAudioPair {
  const normalizedRoomId = normalizeRoomId(roomId);
  const normalizedSlug = normalizeEntrySlug(entrySlug);
  
  return {
    en: `${normalizedRoomId}-${normalizedSlug}-en.mp3`,
    vi: `${normalizedRoomId}-${normalizedSlug}-vi.mp3`,
  };
}

/**
 * Normalize room ID to canonical format
 */
export function normalizeRoomId(roomId: string): string {
  return roomId
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Normalize entry slug to canonical format
 */
export function normalizeEntrySlug(slug: string | number): string {
  if (typeof slug === 'number') {
    return `entry-${slug}`;
  }
  
  return slug
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Validate a filename against GCE rules
 */
export function validateWithGCE(
  filename: string,
  roomId: string,
  entrySlug?: string | number
): GCEValidationResult {
  const violations: string[] = [];
  const normalizedFilename = filename.toLowerCase();
  const normalizedRoomId = normalizeRoomId(roomId);
  
  // Get canonical pair
  const canonical = entrySlug 
    ? getCanonicalAudioForRoom(roomId, entrySlug)
    : { en: '', vi: '' };
  
  // Rule 1: Must start with roomId
  if (currentConfig.enforceRoomIdPrefix) {
    if (!normalizedFilename.startsWith(normalizedRoomId + '-')) {
      violations.push(`CRITICAL: Must start with "${normalizedRoomId}-"`);
    }
  }
  
  // Rule 2: Must be lowercase
  if (filename !== filename.toLowerCase()) {
    violations.push('Must be all lowercase');
  }
  
  // Rule 3: Must use hyphens
  if (filename.includes('_') || filename.includes(' ')) {
    violations.push('Must use hyphens, not underscores or spaces');
  }
  
  // Rule 4: Must end with language suffix
  const hasLangSuffix = /-en\.mp3$/i.test(filename) || /-vi\.mp3$/i.test(filename);
  if (!hasLangSuffix) {
    violations.push('Must end with -en.mp3 or -vi.mp3');
  }
  
  // Rule 5: Must match entry if provided
  if (currentConfig.enforceEntryMatch && entrySlug) {
    const lang = extractLanguage(filename);
    if (lang) {
      const expectedCanonical = lang === 'en' ? canonical.en : canonical.vi;
      if (normalizedFilename !== expectedCanonical) {
        violations.push(`Should be "${expectedCanonical}"`);
      }
    }
  }
  
  // Calculate confidence
  let confidence = 100;
  confidence -= violations.length * 15;
  confidence = Math.max(0, confidence);
  
  return {
    isValid: violations.length === 0,
    canonical,
    violations,
    autoRepairable: confidence >= currentConfig.autoRepairThreshold * 100,
    confidence,
  };
}

/**
 * Extract language from filename
 */
export function extractLanguage(filename: string): 'en' | 'vi' | null {
  if (/-en\.mp3$/i.test(filename)) return 'en';
  if (/-vi\.mp3$/i.test(filename)) return 'vi';
  return null;
}

/**
 * Generate a complete repair plan for a room
 */
export function generateRoomRepairPlan(
  roomId: string,
  integrity: RoomIntegrity
): GCERepairPlan {
  const operations: GCEOperation[] = [];
  
  // Handle mismatched files (wrong names)
  for (const file of integrity.mismatchedLang) {
    const lang = extractLanguage(file);
    if (lang) {
      // Try to find matching entry by parsing filename
      const slug = extractSlugFromFilename(file, roomId);
      if (slug) {
        const canonical = getCanonicalAudioForRoom(roomId, slug);
        operations.push({
          type: 'rename',
          source: file,
          target: lang === 'en' ? canonical.en : canonical.vi,
          metadata: {
            roomId,
            entrySlug: slug,
            language: lang,
            reason: 'Rename to canonical format',
            confidence: 85,
            reversible: true,
          },
        });
      }
    }
  }
  
  // Handle orphans - try to match
  for (const orphan of integrity.orphans) {
    operations.push({
      type: 'move',
      source: orphan,
      target: `_orphans/${orphan}`,
      metadata: {
        roomId,
        reason: 'Orphan file - move to _orphans/',
        confidence: 60,
        reversible: true,
      },
    });
  }
  
  // Handle duplicates
  for (const dup of integrity.duplicates) {
    operations.push({
      type: 'move',
      source: dup,
      target: `_duplicates/${dup}`,
      metadata: {
        roomId,
        reason: 'Duplicate file - move to _duplicates/',
        confidence: 75,
        reversible: true,
      },
    });
  }
  
  // Handle missing - create JSON references
  for (const missing of integrity.missing) {
    operations.push({
      type: 'create-ref',
      source: '',
      target: missing,
      metadata: {
        roomId,
        reason: 'Missing audio file - needs generation',
        confidence: 90,
        reversible: false,
      },
    });
  }
  
  // Calculate estimated impact
  const estimatedImpact = {
    filesRenamed: operations.filter(o => o.type === 'rename').length,
    jsonUpdates: operations.filter(o => o.type === 'update-json').length,
    orphansResolved: integrity.orphans.length,
    duplicatesRemoved: integrity.duplicates.length,
  };
  
  // Calculate overall confidence
  const avgConfidence = operations.length > 0
    ? operations.reduce((sum, o) => sum + o.metadata.confidence, 0) / operations.length
    : 100;
  
  return {
    roomId,
    operations,
    estimatedImpact,
    confidence: Math.round(avgConfidence),
  };
}

/**
 * Extract entry slug from a filename
 */
function extractSlugFromFilename(filename: string, roomId: string): string | null {
  const normalizedRoomId = normalizeRoomId(roomId);
  const normalizedFilename = filename.toLowerCase();
  
  // Remove room prefix and language suffix
  const withoutRoom = normalizedFilename.replace(new RegExp(`^${normalizedRoomId}-?`), '');
  const withoutLang = withoutRoom.replace(/-(en|vi)\.mp3$/, '');
  
  if (withoutLang && withoutLang !== withoutRoom) {
    return withoutLang;
  }
  
  return null;
}

/**
 * Generate repair operations for all rooms
 */
export function generateGlobalRepairPlan(
  integrityMap: IntegrityMap
): GCERepairPlan[] {
  const plans: GCERepairPlan[] = [];
  
  for (const [roomId, integrity] of Object.entries(integrityMap)) {
    if (integrity.missing.length > 0 || 
        integrity.orphans.length > 0 || 
        integrity.duplicates.length > 0 ||
        integrity.mismatchedLang.length > 0 ||
        integrity.unrepairable.length > 0) {
      plans.push(generateRoomRepairPlan(roomId, integrity));
    }
  }
  
  // Sort by number of issues (most first)
  plans.sort((a, b) => b.operations.length - a.operations.length);
  
  return plans;
}

/**
 * Apply a repair plan (returns operations to execute)
 * Does NOT execute destructive operations - returns them for review
 */
export function applyRepairPlan(plan: GCERepairPlan): {
  safeOperations: GCEOperation[];
  destructiveOperations: GCEOperation[];
} {
  const safeOperations: GCEOperation[] = [];
  const destructiveOperations: GCEOperation[] = [];
  
  for (const op of plan.operations) {
    if (op.metadata.confidence >= currentConfig.autoRepairThreshold * 100) {
      if (op.type === 'delete' || op.type === 'move') {
        destructiveOperations.push(op);
      } else {
        safeOperations.push(op);
      }
    } else {
      destructiveOperations.push(op); // Low confidence = needs review
    }
  }
  
  return { safeOperations, destructiveOperations };
}

/**
 * Bidirectional reconciliation: JSON ↔ Audio folder
 */
export function reconcileRoom(
  roomId: string,
  entries: Array<{ slug: string | number; audio?: { en?: string; vi?: string } | string }>,
  storageFiles: Set<string>
): {
  jsonToUpdate: Array<{ entrySlug: string; newAudio: CanonicalAudioPair }>;
  filesToRename: Array<{ from: string; to: string }>;
  orphans: string[];
  missing: string[];
} {
  const jsonToUpdate: Array<{ entrySlug: string; newAudio: CanonicalAudioPair }> = [];
  const filesToRename: Array<{ from: string; to: string }> = [];
  const orphans: string[] = [];
  const missing: string[] = [];
  
  const expectedFiles = new Set<string>();
  
  // Process each entry
  for (const entry of entries) {
    const slug = typeof entry.slug === 'number' ? `entry-${entry.slug}` : entry.slug;
    const canonical = getCanonicalAudioForRoom(roomId, slug);
    
    expectedFiles.add(canonical.en.toLowerCase());
    expectedFiles.add(canonical.vi.toLowerCase());
    
    // Check if JSON needs update
    let needsUpdate = false;
    if (!entry.audio) {
      needsUpdate = true;
    } else if (typeof entry.audio === 'string') {
      needsUpdate = true; // Should be object with en/vi
    } else {
      if (entry.audio.en !== canonical.en || entry.audio.vi !== canonical.vi) {
        needsUpdate = true;
      }
    }
    
    if (needsUpdate) {
      jsonToUpdate.push({ entrySlug: slug, newAudio: canonical });
    }
    
    // Check if files exist
    if (!storageFiles.has(canonical.en.toLowerCase())) {
      missing.push(canonical.en);
    }
    if (!storageFiles.has(canonical.vi.toLowerCase())) {
      missing.push(canonical.vi);
    }
  }
  
  // Find orphans (files in storage not expected)
  const normalizedRoomId = normalizeRoomId(roomId);
  for (const file of storageFiles) {
    if (file.startsWith(normalizedRoomId + '-') && !expectedFiles.has(file)) {
      orphans.push(file);
    }
  }
  
  return { jsonToUpdate, filesToRename, orphans, missing };
}

// Re-export types
export type { IntegrityMap, RoomIntegrity } from './integrityMap';
export type { SemanticMatch } from './semanticMatcher';
