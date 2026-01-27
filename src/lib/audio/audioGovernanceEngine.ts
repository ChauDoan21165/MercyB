/**
 * Audio Governance Engine v4.3
 * "Zero-Friction Audio Ecosystem"
 * 
 * THE GOVERNING AUTHORITY for all audio repairs.
 * Enforces global rules, approves/blocks repairs based on confidence,
 * prevents cross-room pollution, ensures EN/VI parity.
 */

import { 
  MIN_CONFIDENCE_FOR_AUTO_FIX,
  normalizeRoomId,
  normalizeEntrySlug,
  extractLanguage,
  getCanonicalAudioForRoom,
  getCanonicalAudioForEntireRoom,
  type GCERoomResult,
  type GCEOperation,
} from './globalConsistencyEngine';
import {
  buildIntegrityMap,
  generateIntegritySummary,
  type IntegrityMap,
  type IntegritySummary,
  type RoomData,
} from './integrityMap';
import { similarityScore } from './filenameValidator';

// ============================================
// Configuration
// ============================================

export interface GovernanceConfig {
  minSystemIntegrity: number;          // Minimum system-wide integrity (default: 98)
  autoApproveThreshold: number;        // Auto-approve confidence >= this (default: 0.90)
  requireApprovalThreshold: number;    // Require governance approval >= this (default: 0.70)
  blockThreshold: number;              // Block repairs below this (default: 0.50)
  enableAutopilot: boolean;            // Enable fully autonomous mode
  maxRepairsPerRun: number;            // Safety limit per run
  crossRoomProtection: boolean;        // Block cross-room reattachment
  enforceEnViParity: boolean;          // Enforce EN/VI file pairs
  twoKeySystemEnabled: boolean;        // Two-key safety system
}

const DEFAULT_GOVERNANCE_CONFIG: GovernanceConfig = {
  minSystemIntegrity: 98,
  autoApproveThreshold: 0.90,
  requireApprovalThreshold: 0.70,
  blockThreshold: 0.50,
  enableAutopilot: true,
  maxRepairsPerRun: 500,
  crossRoomProtection: true,
  enforceEnViParity: true,
  twoKeySystemEnabled: true,
};

let governanceConfig: GovernanceConfig = { ...DEFAULT_GOVERNANCE_CONFIG };

export function configureGovernance(config: Partial<GovernanceConfig>): void {
  governanceConfig = { ...governanceConfig, ...config };
}

export function getGovernanceConfig(): GovernanceConfig {
  return { ...governanceConfig };
}

// ============================================
// Types
// ============================================

export type DecisionType = 'auto-approve' | 'governance-approve' | 'block' | 'human-review';

export interface GovernanceDecision {
  changeId: string;
  operation: GovernanceOperation;
  decision: DecisionType;
  confidence: number;
  reason: string;
  violations: string[];
  canOverride: boolean;
}

export interface GovernanceOperation {
  type: 'rename' | 'update-json' | 'delete' | 'move' | 'attach-orphan' | 'resolve-duplicate';
  source: string;
  target: string;
  roomId?: string;
  entrySlug?: string;
  language?: 'en' | 'vi';
  metadata: Record<string, any>;
}

export interface ChangeSet {
  id: string;
  operations: GovernanceOperation[];
  timestamp: string;
  source: 'autopilot' | 'manual' | 'ci';
}

export interface GovernanceReport {
  timestamp: string;
  systemIntegrityBefore: number;
  systemIntegrityAfter: number;
  totalOperations: number;
  autoApproved: number;
  governanceApproved: number;
  blocked: number;
  humanReview: number;
  decisions: GovernanceDecision[];
  violations: GovernanceViolation[];
  passed: boolean;
}

export interface GovernanceViolation {
  code: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  operation?: GovernanceOperation;
  resolution?: string;
}

export interface AutopilotStatus {
  enabled: boolean;
  lastRun: string | null;
  lastRunResult: 'success' | 'partial' | 'failed' | null;
  repairsInLastRun: number;
  roomsAutoFixed: number;
  blockedRepairs: number;
  systemIntegrity: number;
}

// ============================================
// Core Governance Functions
// ============================================

/**
 * Evaluate a changeset and return governance decisions
 */
export function evaluateChangeSet(changeSet: ChangeSet): GovernanceDecision[] {
  const decisions: GovernanceDecision[] = [];
  
  for (const operation of changeSet.operations) {
    const decision = evaluateOperation(operation);
    decisions.push(decision);
  }
  
  return decisions;
}

/**
 * Evaluate a single operation
 */
export function evaluateOperation(operation: GovernanceOperation): GovernanceDecision {
  const violations: string[] = [];
  let confidence = operation.metadata.confidence || 0;
  const changeId = `${operation.type}-${operation.source}-${Date.now()}`;
  
  // Rule 1: RoomId prefix enforcement
  if (operation.roomId) {
    const normalizedRoomId = normalizeRoomId(operation.roomId);
    const normalizedTarget = operation.target.toLowerCase();
    
    if (operation.type === 'rename' || operation.type === 'attach-orphan') {
      if (!normalizedTarget.startsWith(normalizedRoomId + '-')) {
        violations.push('CRITICAL: Target filename must start with roomId prefix');
        confidence = Math.min(confidence, 0.3);
      }
    }
  }
  
  // Rule 2: Language suffix enforcement
  if (operation.type === 'rename' || operation.type === 'attach-orphan') {
    const lang = extractLanguage(operation.target);
    if (!lang) {
      violations.push('CRITICAL: Target must end with -en.mp3 or -vi.mp3');
      confidence = Math.min(confidence, 0.2);
    }
  }
  
  // Rule 3: Cross-room protection
  if (governanceConfig.crossRoomProtection && operation.type === 'attach-orphan') {
    const sourceLang = extractLanguage(operation.source);
    if (sourceLang && operation.roomId) {
      const sourceRoomId = extractRoomIdFromFilename(operation.source);
      if (sourceRoomId && sourceRoomId !== normalizeRoomId(operation.roomId)) {
        violations.push(`WARNING: Cross-room reattachment detected (${sourceRoomId} → ${operation.roomId})`);
        confidence = Math.min(confidence, governanceConfig.requireApprovalThreshold);
      }
    }
  }
  
  // Rule 4: EN/VI parity (two files per entry)
  if (governanceConfig.enforceEnViParity && operation.type === 'delete') {
    violations.push('WARNING: Deleting audio may break EN/VI parity');
  }
  
  // Rule 5: Canonical naming
  if (operation.roomId && operation.entrySlug) {
    const canonical = getCanonicalAudioForRoom(operation.roomId, operation.entrySlug);
    const lang = extractLanguage(operation.target);
    if (lang) {
      const expectedCanonical = canonical[lang];
      if (operation.target.toLowerCase() !== expectedCanonical.toLowerCase()) {
        violations.push(`Target should be canonical: ${expectedCanonical}`);
        // Calculate similarity to adjust confidence
        const sim = similarityScore(operation.target.toLowerCase(), expectedCanonical.toLowerCase());
        confidence = Math.min(confidence, sim);
      }
    }
  }
  
  // Determine decision based on confidence and violations
  let decision: DecisionType;
  let reason: string;
  
  const hasCriticalViolations = violations.some(v => v.startsWith('CRITICAL'));
  
  if (hasCriticalViolations || confidence < governanceConfig.blockThreshold) {
    decision = 'block';
    reason = `Blocked: ${hasCriticalViolations ? 'Critical violations' : 'Confidence too low'}`;
  } else if (confidence >= governanceConfig.autoApproveThreshold && violations.length === 0) {
    decision = 'auto-approve';
    reason = `Auto-approved: High confidence (${Math.round(confidence * 100)}%)`;
  } else if (confidence >= governanceConfig.requireApprovalThreshold) {
    decision = 'governance-approve';
    reason = `Governance approved: Medium confidence (${Math.round(confidence * 100)}%)`;
  } else {
    decision = 'human-review';
    reason = `Requires human review: Low confidence (${Math.round(confidence * 100)}%)`;
  }
  
  return {
    changeId,
    operation,
    decision,
    confidence,
    reason,
    violations,
    canOverride: !hasCriticalViolations,
  };
}

/**
 * Check if an operation should be auto-applied
 */
export function shouldAutoApply(operation: GovernanceOperation): boolean {
  if (!governanceConfig.enableAutopilot) return false;
  
  const decision = evaluateOperation(operation);
  
  // Two-key system: certain operations always auto-approve
  if (governanceConfig.twoKeySystemEnabled) {
    // Auto-allow: high confidence
    if (decision.confidence >= governanceConfig.autoApproveThreshold) {
      return true;
    }
    
    // Auto-allow: EN/VI pairing fixes
    if (operation.type === 'update-json' && operation.metadata.reason?.includes('reversed')) {
      return true;
    }
    
    // Auto-allow: manifest regeneration
    if (operation.type === 'rename' && operation.metadata.reason?.includes('manifest')) {
      return true;
    }
    
    // Auto-allow: duplicate resolution
    if (operation.type === 'resolve-duplicate') {
      return decision.confidence >= governanceConfig.requireApprovalThreshold;
    }
    
    // Auto-allow: JSON reference correction
    if (operation.type === 'update-json' && decision.confidence >= governanceConfig.requireApprovalThreshold) {
      return true;
    }
  }
  
  return decision.decision === 'auto-approve' || decision.decision === 'governance-approve';
}

/**
 * Block critical changes
 */
export function blockCriticalChanges(operation: GovernanceOperation): { blocked: boolean; reason: string } {
  const decision = evaluateOperation(operation);
  
  if (decision.decision === 'block') {
    return { blocked: true, reason: decision.reason };
  }
  
  // Additional critical checks
  if (operation.type === 'delete' && !operation.metadata.isOrphan) {
    return { blocked: true, reason: 'Cannot delete non-orphan files without explicit confirmation' };
  }
  
  if (operation.type === 'attach-orphan' && decision.confidence < governanceConfig.requireApprovalThreshold) {
    return { blocked: true, reason: `Orphan attachment confidence too low (${Math.round(decision.confidence * 100)}%)` };
  }
  
  return { blocked: false, reason: '' };
}

// ============================================
// System Integrity Functions
// ============================================

/**
 * Calculate current system-wide integrity
 */
export function getSystemIntegrity(rooms: RoomData[], storageFiles: Set<string>): number {
  const integrityMap = buildIntegrityMap(rooms, storageFiles);
  const summary = generateIntegritySummary(integrityMap);
  return summary.averageScore;
}

/**
 * Check if system meets minimum integrity requirement
 */
export function meetsIntegrityThreshold(rooms: RoomData[], storageFiles: Set<string>): {
  meets: boolean;
  current: number;
  required: number;
  gap: number;
} {
  const current = getSystemIntegrity(rooms, storageFiles);
  const required = governanceConfig.minSystemIntegrity;
  
  return {
    meets: current >= required,
    current,
    required,
    gap: Math.max(0, required - current),
  };
}

/**
 * Detect cross-room audio pollution
 */
export function detectCrossRoomPollution(
  rooms: RoomData[],
  storageFiles: Set<string>
): GovernanceViolation[] {
  const violations: GovernanceViolation[] = [];
  const roomIds = new Set(rooms.map(r => normalizeRoomId(r.roomId)));
  
  for (const file of storageFiles) {
    const fileRoomId = extractRoomIdFromFilename(file);
    if (fileRoomId && !roomIds.has(fileRoomId)) {
      // File belongs to a room that doesn't exist
      violations.push({
        code: 'CROSS_ROOM_POLLUTION',
        severity: 'warning',
        message: `File "${file}" has roomId "${fileRoomId}" which doesn't exist`,
        resolution: 'Review file for orphan cleanup or room registration',
      });
    }
  }
  
  return violations;
}

/**
 * Verify EN/VI parity across all entries
 */
export function verifyEnViParity(rooms: RoomData[], storageFiles: Set<string>): GovernanceViolation[] {
  const violations: GovernanceViolation[] = [];
  const filesLower = new Set(Array.from(storageFiles).map(f => f.toLowerCase()));
  
  for (const room of rooms) {
    for (let i = 0; i < room.entries.length; i++) {
      const entry = room.entries[i];
      const slug = entry.slug || entry.artifact_id || entry.id || i;
      const canonical = getCanonicalAudioForRoom(room.roomId, slug);
      
      const hasEn = filesLower.has(canonical.en.toLowerCase());
      const hasVi = filesLower.has(canonical.vi.toLowerCase());
      
      if (hasEn !== hasVi) {
        violations.push({
          code: 'EN_VI_PARITY_MISMATCH',
          severity: 'warning',
          message: `Entry ${room.roomId}/${slug}: ${hasEn ? 'EN exists' : 'EN missing'}, ${hasVi ? 'VI exists' : 'VI missing'}`,
          resolution: hasEn ? `Create ${canonical.vi}` : `Create ${canonical.en}`,
        });
      }
    }
  }
  
  return violations;
}

// ============================================
// Multi-Pass Verification
// ============================================

/**
 * Run multi-pass verification on the audio system
 */
export function runMultiPassVerification(
  rooms: RoomData[],
  storageFiles: Set<string>
): {
  passed: boolean;
  passResults: PassResult[];
  totalViolations: number;
  criticalViolations: number;
} {
  const passResults: PassResult[] = [];
  let totalViolations = 0;
  let criticalViolations = 0;
  
  // Pass 1: Filename correctness
  const filenameViolations = verifyFilenameCorrectness(storageFiles);
  passResults.push({
    name: 'Filename Correctness',
    passed: filenameViolations.length === 0,
    violations: filenameViolations,
  });
  totalViolations += filenameViolations.length;
  criticalViolations += filenameViolations.filter(v => v.severity === 'critical').length;
  
  // Pass 2: Slug correctness
  const slugViolations = verifySlugCorrectness(rooms, storageFiles);
  passResults.push({
    name: 'Slug Correctness',
    passed: slugViolations.length === 0,
    violations: slugViolations,
  });
  totalViolations += slugViolations.length;
  
  // Pass 3: Entry matching
  const entryViolations = verifyEntryMatching(rooms, storageFiles);
  passResults.push({
    name: 'Entry Matching',
    passed: entryViolations.length === 0,
    violations: entryViolations,
  });
  totalViolations += entryViolations.length;
  
  // Pass 4: Room matching
  const roomViolations = detectCrossRoomPollution(rooms, storageFiles);
  passResults.push({
    name: 'Room Matching',
    passed: roomViolations.length === 0,
    violations: roomViolations,
  });
  totalViolations += roomViolations.length;
  
  // Pass 5: EN/VI parity
  const parityViolations = verifyEnViParity(rooms, storageFiles);
  passResults.push({
    name: 'EN/VI Parity',
    passed: parityViolations.length === 0,
    violations: parityViolations,
  });
  totalViolations += parityViolations.length;
  
  const allPassed = passResults.every(p => p.passed);
  
  return {
    passed: allPassed && criticalViolations === 0,
    passResults,
    totalViolations,
    criticalViolations,
  };
}

interface PassResult {
  name: string;
  passed: boolean;
  violations: GovernanceViolation[];
}

function verifyFilenameCorrectness(storageFiles: Set<string>): GovernanceViolation[] {
  const violations: GovernanceViolation[] = [];
  
  for (const file of storageFiles) {
    const normalized = file.toLowerCase();
    
    // Check lowercase
    if (file !== normalized) {
      violations.push({
        code: 'FILENAME_NOT_LOWERCASE',
        severity: 'warning',
        message: `File "${file}" is not lowercase`,
        resolution: `Rename to "${normalized}"`,
      });
    }
    
    // Check for underscores
    if (file.includes('_')) {
      violations.push({
        code: 'FILENAME_HAS_UNDERSCORES',
        severity: 'warning',
        message: `File "${file}" contains underscores`,
        resolution: `Rename to "${file.replace(/_/g, '-')}"`,
      });
    }
    
    // Check language suffix
    const lang = extractLanguage(file);
    if (!lang) {
      violations.push({
        code: 'FILENAME_MISSING_LANG_SUFFIX',
        severity: 'critical',
        message: `File "${file}" missing language suffix (-en.mp3 or -vi.mp3)`,
      });
    }
  }
  
  return violations;
}

function verifySlugCorrectness(rooms: RoomData[], storageFiles: Set<string>): GovernanceViolation[] {
  const violations: GovernanceViolation[] = [];
  const expectedSlugs = new Set<string>();
  
  for (const room of rooms) {
    const normalizedRoomId = normalizeRoomId(room.roomId);
    for (let i = 0; i < room.entries.length; i++) {
      const entry = room.entries[i];
      const slug = normalizeEntrySlug(entry.slug || entry.artifact_id || entry.id || i);
      expectedSlugs.add(`${normalizedRoomId}-${slug}`);
    }
  }
  
  for (const file of storageFiles) {
    const normalized = file.toLowerCase().replace(/-(en|vi)\.mp3$/, '');
    const roomId = extractRoomIdFromFilename(file);
    
    if (roomId && !expectedSlugs.has(normalized)) {
      // Check if it's close to any expected
      let foundClose = false;
      for (const expected of expectedSlugs) {
        if (expected.startsWith(roomId + '-') && similarityScore(normalized, expected) > 0.8) {
          foundClose = true;
          break;
        }
      }
      
      if (!foundClose) {
        violations.push({
          code: 'SLUG_NOT_IN_ENTRIES',
          severity: 'info',
          message: `File "${file}" slug doesn't match any entry`,
        });
      }
    }
  }
  
  return violations;
}

function verifyEntryMatching(rooms: RoomData[], storageFiles: Set<string>): GovernanceViolation[] {
  const violations: GovernanceViolation[] = [];
  const filesLower = new Set(Array.from(storageFiles).map(f => f.toLowerCase()));
  
  for (const room of rooms) {
    let totalExpected = 0;
    let totalFound = 0;
    
    for (let i = 0; i < room.entries.length; i++) {
      const entry = room.entries[i];
      const slug = entry.slug || entry.artifact_id || entry.id || i;
      const canonical = getCanonicalAudioForRoom(room.roomId, slug);
      
      totalExpected += 2;
      if (filesLower.has(canonical.en.toLowerCase())) totalFound++;
      if (filesLower.has(canonical.vi.toLowerCase())) totalFound++;
    }
    
    const coverage = totalExpected > 0 ? (totalFound / totalExpected) * 100 : 100;
    
    if (coverage < 50) {
      violations.push({
        code: 'LOW_ENTRY_COVERAGE',
        severity: 'warning',
        message: `Room "${room.roomId}" has only ${Math.round(coverage)}% audio coverage`,
        resolution: `Generate missing audio files (${totalExpected - totalFound} files needed)`,
      });
    }
  }
  
  return violations;
}

// ============================================
// Autopilot Functions
// ============================================

let autopilotStatus: AutopilotStatus = {
  enabled: governanceConfig.enableAutopilot,
  lastRun: null,
  lastRunResult: null,
  repairsInLastRun: 0,
  roomsAutoFixed: 0,
  blockedRepairs: 0,
  systemIntegrity: 100,
};

export function getAutopilotStatus(): AutopilotStatus {
  return { ...autopilotStatus };
}

export function updateAutopilotStatus(update: Partial<AutopilotStatus>): void {
  autopilotStatus = { ...autopilotStatus, ...update };
}

export function setAutopilotEnabled(enabled: boolean): void {
  governanceConfig.enableAutopilot = enabled;
  autopilotStatus.enabled = enabled;
}

/**
 * Generate a governance report from decisions
 */
export function generateGovernanceReport(
  decisions: GovernanceDecision[],
  integrityBefore: number,
  integrityAfter: number
): GovernanceReport {
  const violations: GovernanceViolation[] = [];
  
  for (const decision of decisions) {
    if (decision.violations.length > 0) {
      for (const v of decision.violations) {
        violations.push({
          code: v.startsWith('CRITICAL') ? 'CRITICAL_VIOLATION' : 'VIOLATION',
          severity: v.startsWith('CRITICAL') ? 'critical' : 'warning',
          message: v,
          operation: decision.operation,
        });
      }
    }
  }
  
  return {
    timestamp: new Date().toISOString(),
    systemIntegrityBefore: integrityBefore,
    systemIntegrityAfter: integrityAfter,
    totalOperations: decisions.length,
    autoApproved: decisions.filter(d => d.decision === 'auto-approve').length,
    governanceApproved: decisions.filter(d => d.decision === 'governance-approve').length,
    blocked: decisions.filter(d => d.decision === 'block').length,
    humanReview: decisions.filter(d => d.decision === 'human-review').length,
    decisions,
    violations,
    passed: integrityAfter >= governanceConfig.minSystemIntegrity,
  };
}

// ============================================
// Helper Functions
// ============================================

function extractRoomIdFromFilename(filename: string): string | null {
  const normalized = filename.toLowerCase();
  // Pattern: roomid-slug-en.mp3 or roomid-slug-vi.mp3
  const match = normalized.match(/^([a-z0-9-]+)-[a-z0-9-]+-(en|vi)\.mp3$/);
  if (match) {
    // The first capture group minus the last part (which is the slug)
    const parts = match[1].split('-');
    // Try to find where the room ID ends and slug begins
    // Heuristic: room IDs typically have consistent patterns
    // For now, return the first part as a simple heuristic
    // This can be enhanced with actual room ID lookups
    return parts.slice(0, -1).join('-') || parts[0];
  }
  return null;
}

// ============================================
// Exports
// ============================================

export {
  DEFAULT_GOVERNANCE_CONFIG,
  MIN_CONFIDENCE_FOR_AUTO_FIX,
};
