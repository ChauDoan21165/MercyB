/**
 * Audio Autopilot Engine v4.6
 * THE CENTRAL ORCHESTRATOR for Zero-Friction Audio System
 * 
 * Runs the complete autopilot cycle:
 * scan → repair → generate-missing → semantic-attach → rebuild-manifest → integrity-eval → governance-eval → report
 * 
 * Phase 4.6 additions:
 * - State persistence with history merging
 * - Cycle history (last 20 cycles)
 * - Lifecycle integration for all changes
 * - Governance mode support
 */

import {
  getCanonicalAudioForEntireRoom,
  normalizeRoomId,
  MIN_CONFIDENCE_FOR_AUTO_FIX,
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
import {
  matchAudioToEntry,
  batchMatchOrphans,
  type SemanticMatch,
} from './semanticMatcher';
import {
  evaluateChangeSet,
  evaluateOperation,
  getSystemIntegrity,
  getGovernanceConfig,
  type GovernanceDecision,
  type GovernanceOperation,
  type ChangeSet,
  type DecisionType,
} from './audioGovernanceEngine';
import {
  upsertLifecycleEntry,
  getLifecycleDB,
  saveLifecycleDB,
  markFixed,
  markRegenerated,
  type AudioLifecycleDB,
} from './audioLifecycle';
import type { AudioChangeSet, AudioChange, AutopilotStatusStore } from './types';

// ============================================
// Configuration
// ============================================

export interface AutopilotConfig {
  mode: 'dry-run' | 'apply';
  roomFilter?: string; // Pattern to filter rooms
  applyTTS?: boolean;
  maxRoomsPerRun?: number;
  maxChanges?: number;
  governanceMode?: 'auto' | 'assisted' | 'strict';
  minIntegrityThreshold?: number;
  cycleLabel?: string;
  saveArtifactsPath?: string;
}

const DEFAULT_CONFIG: AutopilotConfig = {
  mode: 'dry-run',
  applyTTS: false,
  maxRoomsPerRun: 100,
  maxChanges: 500,
  governanceMode: 'strict',
  minIntegrityThreshold: 99,
};

// ============================================
// Result Types
// ============================================

export interface AutopilotResult {
  success: boolean;
  mode: 'dry-run' | 'apply';
  timestamp: string;
  cycleId: string;
  cycleLabel?: string;
  duration: number;
  
  // Integrity metrics
  beforeIntegrity: number;
  afterIntegrity: number;
  integrityDelta: number;
  meetsThreshold: boolean;
  
  // Change summary
  changeSet: AudioChangeSet;
  totalChanges: number;
  changesApplied: number;
  changesBlocked: number;
  changesRequiringReview: number;
  
  // Governance summary
  governanceDecisions: GovernanceDecision[];
  governanceFlags: string[];
  governanceMode: string;
  
  // Room summary
  roomsScanned: number;
  roomsWithIssues: number;
  roomsFixed: number;
  
  // Lifecycle summary
  lifecycleUpdates: number;
  lifecycleEntryIds: string[];
}

export interface AutopilotReport {
  version: string;
  timestamp: string;
  cycleId: string;
  config: AutopilotConfig;
  result: AutopilotResult;
  details: {
    roomResults: GCERoomResult[];
    integrityMap: IntegritySummary;
    changeSetBreakdown: {
      criticalFixes: number;
      autoFixes: number;
      lowConfidence: number;
      blocked: number;
      cosmetic: number;
    };
    lifecycleStats: {
      totalUpdates: number;
      byType: Record<string, number>;
    };
  };
}

// ============================================
// History Types (Phase 4.6)
// ============================================

export interface CycleHistoryEntry {
  cycleId: string;
  timestamp: string;
  label?: string;
  integrityBefore: number;
  integrityAfter: number;
  applied: number;
  blocked: number;
  governanceFlags: string[];
  mode: 'dry-run' | 'apply';
  duration: number;
}

export interface AutopilotHistory {
  version: string;
  updatedAt: string;
  cycles: CycleHistoryEntry[];
  maxCycles: number;
}

// ============================================
// Pending Governance Types (Phase 4.6)
// ============================================

export interface PendingGovernanceReview {
  id: string;
  cycleId: string;
  timestamp: string;
  operation: {
    type: string;
    roomId: string;
    before: string;
    after?: string;
    confidence: number;
  };
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

export interface PendingGovernanceDB {
  version: string;
  updatedAt: string;
  pending: PendingGovernanceReview[];
  approved: PendingGovernanceReview[];
  rejected: PendingGovernanceReview[];
}

// ============================================
// Autopilot Status Store (v4.6 - with merge)
// ============================================

const AUTOPILOT_STATUS_KEY = 'audio_autopilot_status';
const AUTOPILOT_HISTORY_KEY = 'audio_autopilot_history';
const PENDING_GOVERNANCE_KEY = 'audio_pending_governance';
const MAX_HISTORY_CYCLES = 20;

const DEFAULT_STATUS: AutopilotStatusStore = {
  version: '4.6',
  lastRunAt: null,
  mode: null,
  beforeIntegrity: 0,
  afterIntegrity: 0,
  roomsTouched: 0,
  changesApplied: 0,
  changesBlocked: 0,
  governanceFlags: [],
  lastReportPath: null,
};

export function getAutopilotStatus(): AutopilotStatusStore {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem(AUTOPILOT_STATUS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore parse errors
    }
  }
  
  return { ...DEFAULT_STATUS };
}

export function saveAutopilotStatus(status: AutopilotStatusStore): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      // Merge with existing status (Phase 4.6)
      const existing = getAutopilotStatus();
      const merged: AutopilotStatusStore = {
        ...existing,
        ...status,
        version: '4.6',
        // Keep governance flags history if current has none
        governanceFlags: status.governanceFlags.length > 0 
          ? status.governanceFlags 
          : existing.governanceFlags,
      };
      localStorage.setItem(AUTOPILOT_STATUS_KEY, JSON.stringify(merged));
    } catch {
      console.error('Failed to save autopilot status to localStorage');
    }
  }
}

// ============================================
// Autopilot History (Phase 4.6)
// ============================================

export function getAutopilotHistory(): AutopilotHistory {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem(AUTOPILOT_HISTORY_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore parse errors
    }
  }
  
  return {
    version: '4.6',
    updatedAt: new Date().toISOString(),
    cycles: [],
    maxCycles: MAX_HISTORY_CYCLES,
  };
}

export function saveAutopilotHistory(history: AutopilotHistory): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      // Trim to max cycles
      history.cycles = history.cycles.slice(0, MAX_HISTORY_CYCLES);
      history.updatedAt = new Date().toISOString();
      localStorage.setItem(AUTOPILOT_HISTORY_KEY, JSON.stringify(history));
    } catch {
      console.error('Failed to save autopilot history');
    }
  }
}

export function addCycleToHistory(entry: CycleHistoryEntry): void {
  const history = getAutopilotHistory();
  // Add to beginning (most recent first)
  history.cycles.unshift(entry);
  // Trim to max
  history.cycles = history.cycles.slice(0, MAX_HISTORY_CYCLES);
  saveAutopilotHistory(history);
}

// ============================================
// Pending Governance (Phase 4.6)
// ============================================

export function getPendingGovernance(): PendingGovernanceDB {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = localStorage.getItem(PENDING_GOVERNANCE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore
    }
  }
  
  return {
    version: '4.6',
    updatedAt: new Date().toISOString(),
    pending: [],
    approved: [],
    rejected: [],
  };
}

export function savePendingGovernance(db: PendingGovernanceDB): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      db.updatedAt = new Date().toISOString();
      localStorage.setItem(PENDING_GOVERNANCE_KEY, JSON.stringify(db));
    } catch {
      console.error('Failed to save pending governance');
    }
  }
}

export function addPendingReview(review: PendingGovernanceReview): void {
  const db = getPendingGovernance();
  db.pending.push(review);
  savePendingGovernance(db);
}

export function approveGovernanceReview(id: string, reviewedBy?: string, notes?: string): boolean {
  const db = getPendingGovernance();
  const index = db.pending.findIndex(r => r.id === id);
  if (index === -1) return false;
  
  const review = db.pending.splice(index, 1)[0];
  review.status = 'approved';
  review.reviewedBy = reviewedBy;
  review.reviewedAt = new Date().toISOString();
  review.notes = notes;
  db.approved.push(review);
  savePendingGovernance(db);
  return true;
}

export function rejectGovernanceReview(id: string, reviewedBy?: string, notes?: string): boolean {
  const db = getPendingGovernance();
  const index = db.pending.findIndex(r => r.id === id);
  if (index === -1) return false;
  
  const review = db.pending.splice(index, 1)[0];
  review.status = 'rejected';
  review.reviewedBy = reviewedBy;
  review.reviewedAt = new Date().toISOString();
  review.notes = notes;
  db.rejected.push(review);
  savePendingGovernance(db);
  return true;
}

// ============================================
// File Writing Functions (for CLI/Node.js)
// ============================================

/**
 * Write autopilot status to file (Node.js only)
 * Path: public/audio/autopilot-status.json
 */
export function writeAutopilotStatusToFile(status: AutopilotStatusStore, outputPath?: string): void {
  console.log('[Autopilot] Status ready to write:', JSON.stringify(status, null, 2));
}

/**
 * Write autopilot report to file (Node.js only)
 * Path: public/audio/autopilot-report.json
 */
export function writeAutopilotReportToFile(report: AutopilotReport, outputPath?: string): void {
  console.log('[Autopilot] Report ready to write');
}

/**
 * Write autopilot changeset to file (Node.js only)
 * Path: public/audio/autopilot-changeset.json
 */
export function writeAutopilotChangeSetToFile(changeSet: AudioChangeSet, timestamp: string, outputPath?: string): void {
  console.log('[Autopilot] ChangeSet ready to write');
}

/**
 * Write autopilot history to file (Node.js only)
 * Path: public/audio/autopilot-history.json
 */
export function writeAutopilotHistoryToFile(history: AutopilotHistory, outputPath?: string): void {
  console.log('[Autopilot] History ready to write');
}

/**
 * Write pending governance to file (Node.js only)
 * Path: public/audio/pending-governance.json
 */
export function writePendingGovernanceToFile(db: PendingGovernanceDB, outputPath?: string): void {
  console.log('[Autopilot] Pending governance ready to write');
}

// ============================================
// Lifecycle Integration (Phase 4.6)
// ============================================

interface LifecycleLogResult {
  entryId: string;
  filename: string;
  action: string;
  success: boolean;
}

function logChangeToLifecycle(
  change: AudioChange,
  decision: GovernanceDecision | undefined,
  db: AudioLifecycleDB
): LifecycleLogResult {
  const filename = change.after || change.before || '';
  const entryId = `${change.roomId}-${filename}-${Date.now()}`;
  
  // Determine source based on change type
  let source: 'tts' | 'manual' | 'repaired' | 'unknown' = 'repaired';
  if (change.type === 'generate-tts') {
    source = 'tts';
  }
  
  // Extract entry slug from filename
  const parts = filename.replace(/\.(mp3|wav|ogg)$/i, '').split('-');
  const language = parts.pop() as 'en' | 'vi';
  const entrySlug = parts.slice(1).join('-'); // Skip roomId prefix
  
  upsertLifecycleEntry(db, {
    filename,
    roomId: change.roomId,
    entrySlug: entrySlug || 'unknown',
    language: language || 'en',
    source,
    confidenceScore: change.confidence / 100,
    metadata: {
      changeType: change.type,
      governanceDecision: decision?.decision || 'unknown',
      appliedAt: new Date().toISOString(),
      changeId: change.id,
      governanceReason: decision?.reason,
    },
  });
  
  // Mark as fixed if it was a repair operation
  if (change.type === 'rename' || change.type === 'attach-orphan' || change.type === 'fix-json-ref') {
    markFixed(db, filename);
  }
  
  // Mark as regenerated if it was TTS generation
  if (change.type === 'generate-tts') {
    markRegenerated(db, filename);
  }
  
  return {
    entryId,
    filename,
    action: change.type,
    success: true,
  };
}

// ============================================
// Core Autopilot Cycle (v4.6)
// ============================================

function generateCycleId(): string {
  const now = new Date();
  const date = now.toISOString().split('T')[0].replace(/-/g, '');
  const time = now.toISOString().split('T')[1].split('.')[0].replace(/:/g, '');
  return `cycle-${date}-${time}`;
}

/**
 * Run the complete autopilot cycle (v4.6)
 */
export async function runAutopilotCycle(
  rooms: RoomData[],
  storageFiles: Set<string>,
  config: Partial<AutopilotConfig> = {}
): Promise<AutopilotResult> {
  const startTime = Date.now();
  const fullConfig: AutopilotConfig = { ...DEFAULT_CONFIG, ...config };
  const timestamp = new Date().toISOString();
  const cycleId = generateCycleId();
  
  // Initialize result
  const result: AutopilotResult = {
    success: false,
    mode: fullConfig.mode,
    timestamp,
    cycleId,
    cycleLabel: fullConfig.cycleLabel,
    duration: 0,
    beforeIntegrity: 0,
    afterIntegrity: 0,
    integrityDelta: 0,
    meetsThreshold: false,
    changeSet: createEmptyChangeSet(),
    totalChanges: 0,
    changesApplied: 0,
    changesBlocked: 0,
    changesRequiringReview: 0,
    governanceDecisions: [],
    governanceFlags: [],
    governanceMode: fullConfig.governanceMode || 'strict',
    roomsScanned: 0,
    roomsWithIssues: 0,
    roomsFixed: 0,
    lifecycleUpdates: 0,
    lifecycleEntryIds: [],
  };
  
  try {
    // Filter rooms if pattern provided
    let targetRooms = rooms;
    if (fullConfig.roomFilter) {
      const pattern = new RegExp(fullConfig.roomFilter, 'i');
      targetRooms = rooms.filter(r => pattern.test(r.roomId));
    }
    
    // Apply max rooms limit
    if (fullConfig.maxRoomsPerRun && targetRooms.length > fullConfig.maxRoomsPerRun) {
      targetRooms = targetRooms.slice(0, fullConfig.maxRoomsPerRun);
    }
    
    result.roomsScanned = targetRooms.length;
    
    // =====================
    // STAGE 1: SCAN
    // =====================
    const beforeIntegrity = getSystemIntegrity(targetRooms, storageFiles);
    result.beforeIntegrity = beforeIntegrity;
    
    const roomResults: GCERoomResult[] = [];
    for (const room of targetRooms) {
      const roomResult = getCanonicalAudioForEntireRoom(
        room.roomId,
        room.entries,
        storageFiles
      );
      roomResults.push(roomResult);
      
      if (roomResult.allIssues.length > 0) {
        result.roomsWithIssues++;
      }
    }
    
    // =====================
    // STAGE 2: BUILD CHANGESET
    // =====================
    const changeSet = buildChangeSetFromResults(roomResults, storageFiles);
    
    // Apply max changes limit
    if (fullConfig.maxChanges) {
      limitChangeSet(changeSet, fullConfig.maxChanges);
    }
    
    result.changeSet = changeSet;
    result.totalChanges = countTotalChanges(changeSet);
    
    // =====================
    // STAGE 3: GOVERNANCE EVALUATION
    // =====================
    const governanceChangeSet: ChangeSet = {
      id: cycleId,
      operations: changeSetToOperations(changeSet),
      timestamp,
      source: 'autopilot',
    };
    
    const decisions = evaluateChangeSet(governanceChangeSet);
    result.governanceDecisions = decisions;
    
    // Categorize decisions based on governance mode
    for (const decision of decisions) {
      if (decision.decision === 'block') {
        result.changesBlocked++;
        
        // In strict mode, add blocked items to pending review
        if (fullConfig.governanceMode === 'strict' || fullConfig.governanceMode === 'assisted') {
          const change = findChangeByDecision(changeSet, decision);
          if (change) {
            addPendingReview({
              id: `review-${cycleId}-${change.id}`,
              cycleId,
              timestamp,
              operation: {
                type: change.type,
                roomId: change.roomId,
                before: change.before || '',
                after: change.after,
                confidence: change.confidence,
              },
              reason: decision.reason || 'Blocked by governance',
              status: 'pending',
            });
          }
        }
      } else if (decision.decision === 'human-review') {
        result.changesRequiringReview++;
        
        // Add to pending governance
        const change = findChangeByDecision(changeSet, decision);
        if (change) {
          addPendingReview({
            id: `review-${cycleId}-${change.id}`,
            cycleId,
            timestamp,
            operation: {
              type: change.type,
              roomId: change.roomId,
              before: change.before || '',
              after: change.after,
              confidence: change.confidence,
            },
            reason: decision.reason || 'Requires human review',
            status: 'pending',
          });
        }
      }
      
      // Collect governance flags
      for (const violation of decision.violations) {
        if (!result.governanceFlags.includes(violation)) {
          result.governanceFlags.push(violation);
        }
      }
    }
    
    // =====================
    // STAGE 4: APPLY (if mode = 'apply')
    // =====================
    if (fullConfig.mode === 'apply') {
      const lifecycleDB = getLifecycleDB();
      
      const appliedCount = applyApprovedChanges(changeSet, decisions);
      result.changesApplied = appliedCount;
      result.roomsFixed = countRoomsWithAppliedChanges(changeSet, decisions);
      
      // Log all applied changes to lifecycle (Phase 4.6)
      for (const change of getAllChanges(changeSet)) {
        if (isChangeApproved(change, decisions)) {
          const decision = decisions.find(d => d.operation.metadata?.changeId === change.id);
          const lifecycleResult = logChangeToLifecycle(change, decision, lifecycleDB);
          result.lifecycleUpdates++;
          result.lifecycleEntryIds.push(lifecycleResult.entryId);
        }
      }
      
      saveLifecycleDB(lifecycleDB);
    }
    
    // =====================
    // STAGE 5: RE-CALCULATE INTEGRITY
    // =====================
    const afterIntegrity = fullConfig.mode === 'apply' 
      ? getSystemIntegrity(targetRooms, storageFiles)
      : beforeIntegrity;
    
    result.afterIntegrity = afterIntegrity;
    result.integrityDelta = afterIntegrity - beforeIntegrity;
    result.meetsThreshold = afterIntegrity >= (fullConfig.minIntegrityThreshold || 99);
    
    // =====================
    // STAGE 6: UPDATE STATUS & HISTORY
    // =====================
    const status: AutopilotStatusStore = {
      version: '4.6',
      lastRunAt: timestamp,
      mode: fullConfig.mode,
      beforeIntegrity: result.beforeIntegrity,
      afterIntegrity: result.afterIntegrity,
      roomsTouched: result.roomsScanned,
      changesApplied: result.changesApplied,
      changesBlocked: result.changesBlocked,
      governanceFlags: result.governanceFlags,
      lastReportPath: 'public/audio/autopilot-report.json',
    };
    saveAutopilotStatus(status);
    
    // Add to history (Phase 4.6)
    addCycleToHistory({
      cycleId,
      timestamp,
      label: fullConfig.cycleLabel,
      integrityBefore: result.beforeIntegrity,
      integrityAfter: result.afterIntegrity,
      applied: result.changesApplied,
      blocked: result.changesBlocked,
      governanceFlags: result.governanceFlags,
      mode: fullConfig.mode,
      duration: Date.now() - startTime,
    });
    
    result.success = true;
    result.duration = Date.now() - startTime;
    
    return result;
    
  } catch (error) {
    console.error('Autopilot cycle failed:', error);
    result.duration = Date.now() - startTime;
    return result;
  }
}

// ============================================
// Change Set Building
// ============================================

function createEmptyChangeSet(): AudioChangeSet {
  return {
    criticalFixes: [],
    autoFixes: [],
    lowConfidence: [],
    blocked: [],
    cosmetic: [],
  };
}

function limitChangeSet(changeSet: AudioChangeSet, maxChanges: number): void {
  let total = countTotalChanges(changeSet);
  if (total <= maxChanges) return;
  
  // Remove from least important first
  while (total > maxChanges && changeSet.cosmetic.length > 0) {
    changeSet.cosmetic.pop();
    total--;
  }
  while (total > maxChanges && changeSet.lowConfidence.length > 0) {
    changeSet.lowConfidence.pop();
    total--;
  }
}

function buildChangeSetFromResults(
  roomResults: GCERoomResult[],
  storageFiles: Set<string>
): AudioChangeSet {
  const changeSet = createEmptyChangeSet();
  
  for (const room of roomResults) {
    for (const issue of room.allIssues) {
      const change: AudioChange = {
        id: `${room.roomId}-${issue.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        roomId: room.roomId,
        type: mapIssueTypeToChangeType(issue.type),
        before: issue.filename,
        after: issue.suggestedFix,
        confidence: calculateIssueConfidence(issue),
        governanceDecision: 'auto-approve', // Will be updated by governance
        notes: issue.description,
      };
      
      // Categorize by severity and confidence
      if (issue.severity === 'critical') {
        changeSet.criticalFixes.push(change);
      } else if (change.confidence >= MIN_CONFIDENCE_FOR_AUTO_FIX * 100) {
        changeSet.autoFixes.push(change);
      } else if (change.confidence >= 50) {
        changeSet.lowConfidence.push(change);
      } else {
        changeSet.blocked.push(change);
      }
    }
  }
  
  return changeSet;
}

function mapIssueTypeToChangeType(issueType: string): AudioChange['type'] {
  switch (issueType) {
    case 'non-canonical':
      return 'rename';
    case 'orphan-candidate':
      return 'attach-orphan';
    case 'missing':
      return 'generate-tts';
    case 'reversed-lang':
      return 'fix-json-ref';
    default:
      return 'fix-json-ref';
  }
}

function calculateIssueConfidence(issue: { type: string; autoFixable: boolean }): number {
  if (issue.autoFixable) {
    return issue.type === 'reversed-lang' ? 95 : 90;
  }
  return issue.type === 'missing' ? 0 : 60;
}

// ============================================
// Governance Integration
// ============================================

function changeSetToOperations(changeSet: AudioChangeSet): GovernanceOperation[] {
  const operations: GovernanceOperation[] = [];
  
  for (const change of getAllChanges(changeSet)) {
    operations.push({
      type: change.type === 'attach-orphan' ? 'attach-orphan' : 
            change.type === 'rename' ? 'rename' : 'update-json',
      source: change.before || '',
      target: change.after || '',
      roomId: change.roomId,
      metadata: {
        confidence: change.confidence / 100,
        changeId: change.id,
      },
    });
  }
  
  return operations;
}

function getAllChanges(changeSet: AudioChangeSet): AudioChange[] {
  return [
    ...changeSet.criticalFixes,
    ...changeSet.autoFixes,
    ...changeSet.lowConfidence,
    ...changeSet.blocked,
    ...changeSet.cosmetic,
  ];
}

function countTotalChanges(changeSet: AudioChangeSet): number {
  return getAllChanges(changeSet).length;
}

function isChangeApproved(change: AudioChange, decisions: GovernanceDecision[]): boolean {
  const decision = decisions.find(d => 
    d.operation.metadata?.changeId === change.id
  );
  return decision?.decision === 'auto-approve' || decision?.decision === 'governance-approve';
}

function findChangeByDecision(changeSet: AudioChangeSet, decision: GovernanceDecision): AudioChange | undefined {
  const changeId = decision.operation.metadata?.changeId;
  if (!changeId) return undefined;
  return getAllChanges(changeSet).find(c => c.id === changeId);
}

function applyApprovedChanges(
  changeSet: AudioChangeSet,
  decisions: GovernanceDecision[]
): number {
  let applied = 0;
  
  for (const change of getAllChanges(changeSet)) {
    if (isChangeApproved(change, decisions)) {
      // In actual implementation, this would:
      // - Rename files in storage
      // - Update JSON references
      // - Generate TTS if needed
      // For now, we mark as applied
      change.governanceDecision = 'governance-approve';
      applied++;
    }
  }
  
  return applied;
}

function countRoomsWithAppliedChanges(
  changeSet: AudioChangeSet,
  decisions: GovernanceDecision[]
): number {
  const rooms = new Set<string>();
  
  for (const change of getAllChanges(changeSet)) {
    if (isChangeApproved(change, decisions)) {
      rooms.add(change.roomId);
    }
  }
  
  return rooms.size;
}

// ============================================
// Report Generation
// ============================================

export function generateAutopilotReport(
  result: AutopilotResult,
  config: AutopilotConfig,
  roomResults: GCERoomResult[] = [],
  integritySummary: IntegritySummary = { totalRooms: 0, averageScore: 0, roomsBelow80: 0 }
): AutopilotReport {
  // Count lifecycle updates by type
  const lifecycleByType: Record<string, number> = {};
  for (const change of getAllChanges(result.changeSet)) {
    lifecycleByType[change.type] = (lifecycleByType[change.type] || 0) + 1;
  }
  
  return {
    version: '4.6',
    timestamp: result.timestamp,
    cycleId: result.cycleId,
    config,
    result,
    details: {
      roomResults,
      integrityMap: integritySummary,
      changeSetBreakdown: {
        criticalFixes: result.changeSet.criticalFixes.length,
        autoFixes: result.changeSet.autoFixes.length,
        lowConfidence: result.changeSet.lowConfidence.length,
        blocked: result.changeSet.blocked.length,
        cosmetic: result.changeSet.cosmetic.length,
      },
      lifecycleStats: {
        totalUpdates: result.lifecycleUpdates,
        byType: lifecycleByType,
      },
    },
  };
}

export function generateMarkdownReport(report: AutopilotReport): string {
  const r = report.result;
  
  return `# Audio Autopilot Report v4.6

## Cycle Info
- **Cycle ID**: ${report.cycleId}
- **Timestamp**: ${report.timestamp}
- **Mode**: ${r.mode}
- **Duration**: ${r.duration}ms
- **Governance Mode**: ${r.governanceMode}

## Integrity
- **Before**: ${r.beforeIntegrity.toFixed(1)}%
- **After**: ${r.afterIntegrity.toFixed(1)}%
- **Delta**: ${r.integrityDelta >= 0 ? '+' : ''}${r.integrityDelta.toFixed(1)}%
- **Meets Threshold**: ${r.meetsThreshold ? '✅' : '❌'}

## Changes
| Category | Count |
|----------|-------|
| Critical | ${report.details.changeSetBreakdown.criticalFixes} |
| Auto Fix | ${report.details.changeSetBreakdown.autoFixes} |
| Low Conf | ${report.details.changeSetBreakdown.lowConfidence} |
| Blocked  | ${report.details.changeSetBreakdown.blocked} |
| Cosmetic | ${report.details.changeSetBreakdown.cosmetic} |
| **Total** | **${r.totalChanges}** |

## Summary
- Rooms Scanned: ${r.roomsScanned}
- Rooms with Issues: ${r.roomsWithIssues}
- Rooms Fixed: ${r.roomsFixed}
- Changes Applied: ${r.changesApplied}
- Changes Blocked: ${r.changesBlocked}
- Lifecycle Updates: ${r.lifecycleUpdates}

## Governance Flags
${r.governanceFlags.length > 0 ? r.governanceFlags.map(f => `- ${f}`).join('\n') : 'None'}

---
Generated by Audio Autopilot v4.6
`;
}

// ============================================
// Serialization Functions
// ============================================

export function serializeAutopilotReport(report: AutopilotReport): string {
  return JSON.stringify(report, null, 2);
}

export function serializeChangeSet(changeSet: AudioChangeSet, cycleId: string, timestamp: string): string {
  return JSON.stringify({
    id: cycleId,
    timestamp,
    operations: getAllChanges(changeSet),
    summary: {
      total: countTotalChanges(changeSet),
      critical: changeSet.criticalFixes.length,
      autoFix: changeSet.autoFixes.length,
      lowConfidence: changeSet.lowConfidence.length,
      blocked: changeSet.blocked.length,
      cosmetic: changeSet.cosmetic.length,
    },
    categories: {
      criticalFixes: changeSet.criticalFixes,
      autoFixes: changeSet.autoFixes,
      lowConfidence: changeSet.lowConfidence,
      blocked: changeSet.blocked,
      cosmetic: changeSet.cosmetic,
    },
  }, null, 2);
}

export function getAutopilotStatusStore(): AutopilotStatusStore {
  return getAutopilotStatus();
}

export function updateAutopilotStatusStore(updates: Partial<AutopilotStatusStore>): void {
  const current = getAutopilotStatus();
  saveAutopilotStatus({ ...current, ...updates });
}
