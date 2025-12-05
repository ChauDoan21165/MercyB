/**
 * Global Consistency Engine (GCE) v2.0
 * Phase 4: Full Pipeline Integration
 * 
 * THE SINGLE SOURCE OF TRUTH for canonical audio naming across:
 * - validator
 * - autoRepair
 * - JSON refresh
 * - storage rename
 * - manifest generation
 * - integrity mapping
 * - semantic matching
 */

import type { RoomEntry as IntegrityRoomEntry } from './integrityMap';
import { similarityScore } from './filenameValidator';

// ============================================
// Configuration
// ============================================

export interface GCEConfig {
  enforceRoomIdPrefix: boolean;
  enforceEntryMatch: boolean;
  autoRepairThreshold: number; // 0-1 confidence threshold
  orphanMatchThreshold: number;
  duplicateResolutionStrategy: 'keep-canonical' | 'keep-oldest' | 'keep-newest';
}

/** Shared threshold constant - used by all scripts */
export const MIN_CONFIDENCE_FOR_AUTO_FIX = 0.85;

const DEFAULT_CONFIG: GCEConfig = {
  enforceRoomIdPrefix: true,
  enforceEntryMatch: true,
  autoRepairThreshold: MIN_CONFIDENCE_FOR_AUTO_FIX,
  orphanMatchThreshold: MIN_CONFIDENCE_FOR_AUTO_FIX,
  duplicateResolutionStrategy: 'keep-canonical',
};

let currentConfig: GCEConfig = { ...DEFAULT_CONFIG };

export function configureGCE(config: Partial<GCEConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

export function getGCEConfig(): GCEConfig {
  return { ...currentConfig };
}

// ============================================
// Core Types
// ============================================

export interface CanonicalAudioPair {
  en: string;
  vi: string;
}

export interface GCEEntryResult {
  entrySlug: string;
  expectedEn: string;
  expectedVi: string;
  jsonRefsEn: string | null;
  jsonRefsVi: string | null;
  storageMatchesEn: boolean;
  storageMatchesVi: boolean;
  issues: GCEIssue[];
}

export interface GCEIssue {
  type: 'missing' | 'duplicate' | 'non-canonical' | 'reversed-lang' | 'orphan-candidate' | 'json-mismatch';
  filename?: string;
  description: string;
  severity: 'warning' | 'critical';
  autoFixable: boolean;
  suggestedFix?: string;
}

export interface GCERoomResult {
  roomId: string;
  entries: GCEEntryResult[];
  roomIntegrityScore: number;
  summary: {
    totalEntries: number;
    missing: number;
    orphans: number;
    namingIssues: number;
    duplicates: number;
    reversals: number;
  };
  allIssues: GCEIssue[];
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

// ============================================
// Normalization Functions
// ============================================

export function normalizeRoomId(roomId: string): string {
  return roomId
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function normalizeEntrySlug(slug: string | number): string {
  if (typeof slug === 'number') {
    return `entry-${slug}`;
  }
  
  return String(slug)
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function extractLanguage(filename: string): 'en' | 'vi' | null {
  if (/-en\.mp3$/i.test(filename)) return 'en';
  if (/-vi\.mp3$/i.test(filename)) return 'vi';
  if (/_en\.mp3$/i.test(filename)) return 'en';
  if (/_vi\.mp3$/i.test(filename)) return 'vi';
  return null;
}

// ============================================
// THE SINGLE SOURCE OF TRUTH
// ============================================

/**
 * Generate canonical audio pair for a room entry.
 * EVERY script MUST use this function.
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
 * Get complete canonical audio information for an entire room.
 * This is the primary function for scripts to use.
 */
export function getCanonicalAudioForEntireRoom(
  roomId: string,
  entries: Array<{ slug?: string; id?: string | number; artifact_id?: string; index?: number; audio?: any }>,
  storageFiles: Set<string>,
  jsonAudioRefs?: Map<number, { en?: string; vi?: string }>
): GCERoomResult {
  const normalizedRoomId = normalizeRoomId(roomId);
  const entryResults: GCEEntryResult[] = [];
  const allIssues: GCEIssue[] = [];
  
  let missing = 0;
  let orphans = 0;
  let namingIssues = 0;
  let duplicates = 0;
  let reversals = 0;

  // Process each entry
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const entrySlug = String(entry.slug || entry.artifact_id || entry.id || `entry-${i}`);
    const canonical = getCanonicalAudioForRoom(roomId, entrySlug);
    
    // Get JSON refs for this entry
    const jsonRefs = jsonAudioRefs?.get(i);
    const jsonRefEn = jsonRefs?.en || (typeof entry.audio === 'object' ? entry.audio?.en : null);
    const jsonRefVi = jsonRefs?.vi || (typeof entry.audio === 'object' ? entry.audio?.vi : null);
    
    // Check storage
    const storageMatchesEn = storageFiles.has(canonical.en.toLowerCase());
    const storageMatchesVi = storageFiles.has(canonical.vi.toLowerCase());
    
    const issues: GCEIssue[] = [];
    
    // Check for missing files
    if (!storageMatchesEn) {
      missing++;
      issues.push({
        type: 'missing',
        filename: canonical.en,
        description: `Missing EN audio: ${canonical.en}`,
        severity: 'critical',
        autoFixable: false,
      });
    }
    
    if (!storageMatchesVi) {
      missing++;
      issues.push({
        type: 'missing',
        filename: canonical.vi,
        description: `Missing VI audio: ${canonical.vi}`,
        severity: 'critical',
        autoFixable: false,
      });
    }
    
    // Check JSON references
    if (jsonRefEn && jsonRefEn.toLowerCase() !== canonical.en) {
      namingIssues++;
      issues.push({
        type: 'non-canonical',
        filename: jsonRefEn,
        description: `JSON EN ref "${jsonRefEn}" should be "${canonical.en}"`,
        severity: 'warning',
        autoFixable: true,
        suggestedFix: canonical.en,
      });
    }
    
    if (jsonRefVi && jsonRefVi.toLowerCase() !== canonical.vi) {
      namingIssues++;
      issues.push({
        type: 'non-canonical',
        filename: jsonRefVi,
        description: `JSON VI ref "${jsonRefVi}" should be "${canonical.vi}"`,
        severity: 'warning',
        autoFixable: true,
        suggestedFix: canonical.vi,
      });
    }
    
    // Check for reversed EN/VI
    if (jsonRefEn && jsonRefVi) {
      const enLang = extractLanguage(jsonRefEn);
      const viLang = extractLanguage(jsonRefVi);
      if (enLang === 'vi' && viLang === 'en') {
        reversals++;
        issues.push({
          type: 'reversed-lang',
          description: `EN/VI references are swapped: en="${jsonRefEn}", vi="${jsonRefVi}"`,
          severity: 'critical',
          autoFixable: true,
          suggestedFix: `Swap: en="${jsonRefVi}", vi="${jsonRefEn}"`,
        });
      }
    }
    
    entryResults.push({
      entrySlug,
      expectedEn: canonical.en,
      expectedVi: canonical.vi,
      jsonRefsEn: jsonRefEn || null,
      jsonRefsVi: jsonRefVi || null,
      storageMatchesEn,
      storageMatchesVi,
      issues,
    });
    
    allIssues.push(...issues);
  }
  
  // Detect orphans (files in storage not expected by any entry)
  const expectedFiles = new Set<string>();
  for (const entry of entryResults) {
    expectedFiles.add(entry.expectedEn.toLowerCase());
    expectedFiles.add(entry.expectedVi.toLowerCase());
  }
  
  for (const file of storageFiles) {
    const normalizedFile = file.toLowerCase();
    if (normalizedFile.startsWith(normalizedRoomId + '-') && !expectedFiles.has(normalizedFile)) {
      orphans++;
      allIssues.push({
        type: 'orphan-candidate',
        filename: file,
        description: `Orphan file: ${file} (not expected by any entry)`,
        severity: 'warning',
        autoFixable: false,
      });
    }
  }
  
  // Calculate integrity score
  const totalExpected = entries.length * 2; // EN + VI per entry
  const totalFound = entryResults.filter(e => e.storageMatchesEn).length + 
                     entryResults.filter(e => e.storageMatchesVi).length;
  
  const coverageScore = totalExpected > 0 ? (totalFound / totalExpected) * 60 : 60;
  const namingPenalty = Math.min(20, namingIssues * 3);
  const orphanPenalty = Math.min(10, orphans * 2);
  const duplicatePenalty = Math.min(5, duplicates * 1);
  const reversalPenalty = Math.min(5, reversals * 2);
  
  const roomIntegrityScore = Math.max(0, Math.min(100, Math.round(
    coverageScore + 40 - namingPenalty - orphanPenalty - duplicatePenalty - reversalPenalty
  )));
  
  return {
    roomId,
    entries: entryResults,
    roomIntegrityScore,
    summary: {
      totalEntries: entries.length,
      missing,
      orphans,
      namingIssues,
      duplicates,
      reversals,
    },
    allIssues,
  };
}

// ============================================
// Validation Functions
// ============================================

export function validateWithGCE(
  filename: string,
  roomId: string,
  entrySlug?: string | number
): GCEValidationResult {
  const violations: string[] = [];
  const normalizedFilename = filename.toLowerCase();
  const normalizedRoomId = normalizeRoomId(roomId);
  
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

// ============================================
// Repair Plan Generation
// ============================================

export function generateRoomRepairPlan(
  roomResult: GCERoomResult
): GCERepairPlan {
  const operations: GCEOperation[] = [];
  
  for (const issue of roomResult.allIssues) {
    if (!issue.autoFixable) continue;
    
    switch (issue.type) {
      case 'non-canonical':
        if (issue.filename && issue.suggestedFix) {
          operations.push({
            type: 'update-json',
            source: issue.filename,
            target: issue.suggestedFix,
            metadata: {
              roomId: roomResult.roomId,
              reason: issue.description,
              confidence: 90,
              reversible: true,
            },
          });
        }
        break;
        
      case 'reversed-lang':
        operations.push({
          type: 'update-json',
          source: 'en/vi refs',
          target: 'swapped',
          metadata: {
            roomId: roomResult.roomId,
            reason: issue.description,
            confidence: 95,
            reversible: true,
          },
        });
        break;
    }
  }
  
  const estimatedImpact = {
    filesRenamed: 0,
    jsonUpdates: operations.filter(o => o.type === 'update-json').length,
    orphansResolved: 0,
    duplicatesRemoved: 0,
  };
  
  const avgConfidence = operations.length > 0
    ? operations.reduce((sum, o) => sum + o.metadata.confidence, 0) / operations.length
    : 100;
  
  return {
    roomId: roomResult.roomId,
    operations,
    estimatedImpact,
    confidence: Math.round(avgConfidence),
  };
}

export function generateGlobalRepairPlan(
  roomResults: GCERoomResult[]
): GCERepairPlan[] {
  return roomResults
    .filter(r => r.allIssues.length > 0)
    .map(r => generateRoomRepairPlan(r))
    .filter(p => p.operations.length > 0)
    .sort((a, b) => b.operations.length - a.operations.length);
}

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
      destructiveOperations.push(op);
    }
  }
  
  return { safeOperations, destructiveOperations };
}

// ============================================
// Bidirectional Reconciliation
// ============================================

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
  const normalizedRoomId = normalizeRoomId(roomId);
  
  for (const entry of entries) {
    const slug = typeof entry.slug === 'number' ? `entry-${entry.slug}` : entry.slug;
    const canonical = getCanonicalAudioForRoom(roomId, slug);
    
    expectedFiles.add(canonical.en.toLowerCase());
    expectedFiles.add(canonical.vi.toLowerCase());
    
    let needsUpdate = false;
    if (!entry.audio) {
      needsUpdate = true;
    } else if (typeof entry.audio === 'string') {
      needsUpdate = true;
    } else {
      if (entry.audio.en?.toLowerCase() !== canonical.en || 
          entry.audio.vi?.toLowerCase() !== canonical.vi) {
        needsUpdate = true;
      }
    }
    
    if (needsUpdate) {
      jsonToUpdate.push({ entrySlug: slug, newAudio: canonical });
    }
    
    if (!storageFiles.has(canonical.en.toLowerCase())) {
      missing.push(canonical.en);
    }
    if (!storageFiles.has(canonical.vi.toLowerCase())) {
      missing.push(canonical.vi);
    }
  }
  
  for (const file of storageFiles) {
    if (file.startsWith(normalizedRoomId + '-') && !expectedFiles.has(file)) {
      orphans.push(file);
    }
  }
  
  return { jsonToUpdate, filesToRename, orphans, missing };
}

// Re-export types
export type { IntegrityRoomEntry as RoomEntry };
