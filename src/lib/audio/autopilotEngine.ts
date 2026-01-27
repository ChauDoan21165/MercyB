/**
 * Autopilot Engine v4.4
 * "Full Autonomous Audio Autopilot"
 *
 * THE COMPLETE AUTONOMOUS CYCLE:
 * scan → repair → generate-missing → semantic-attach → rebuild manifest →
 * integrity-eval → governance-eval → report
 */

import {
  getCanonicalAudioForEntireRoom,
  extractLanguage,
  getCanonicalAudioForRoom,
  MIN_CONFIDENCE_FOR_AUTO_FIX,
  type GCERoomResult,
  type GCEOperation,
} from "./globalConsistencyEngine";
import {
  buildIntegrityMap,
  generateIntegritySummary,
  getLowestIntegrityRooms,
  type RoomData,
} from "./integrityMap";
import { batchMatchOrphans } from "./semanticMatcher";
import {
  evaluateOperation,
  shouldAutoApply,
  blockCriticalChanges,
  getSystemIntegrity,
  detectCrossRoomPollution,
  verifyEnViParity,
  type GovernanceDecision,
  type GovernanceOperation,
  type GovernanceViolation,
} from "./audioGovernanceEngine";

// ============================================
// Types
// ============================================

export interface AutopilotConfig {
  dryRun: boolean;
  maxOperationsPerRun: number;
  minIntegrityTarget: number;
  enableTtsGeneration: boolean;
  enableOrphanAttachment: boolean;
  enableCrossRoomProtection: boolean;
  verbose: boolean;
}

export const DEFAULT_AUTOPILOT_CONFIG: AutopilotConfig = {
  dryRun: false,
  maxOperationsPerRun: 500,
  minIntegrityTarget: 99,
  enableTtsGeneration: true,
  enableOrphanAttachment: true,
  enableCrossRoomProtection: true,
  verbose: true,
};

export interface AutopilotResult {
  success: boolean;
  cycleId: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  integrityBefore: number;
  integrityAfter: number;
  integrityDelta: number;
  stages: AutopilotStageResult[];
  totalOperations: number;
  appliedOperations: number;
  blockedOperations: number;
  governanceDecisions: GovernanceDecision[];
  changeSet: StructuredChangeSet;
  report: AutopilotReport;
}

export interface AutopilotStageResult {
  stage: AutopilotStage;
  status: "success" | "partial" | "failed" | "skipped";
  startedAt: string;
  completedAt: string;
  durationMs: number;
  operationsFound: number;
  operationsApplied: number;
  operationsBlocked: number;
  details: Record<string, any>;
}

export type AutopilotStage =
  | "scan"
  | "repair"
  | "generate-missing"
  | "semantic-attach"
  | "rebuild-manifest"
  | "integrity-eval"
  | "governance-eval"
  | "report";

export interface StructuredChangeSet {
  id: string;
  timestamp: string;
  categories: {
    critical: ChangeSetOperation[];
    structural: ChangeSetOperation[];
    lowConfidence: ChangeSetOperation[];
    blocked: ChangeSetOperation[];
    cleanup: ChangeSetOperation[];
  };
  summary: {
    total: number;
    critical: number;
    structural: number;
    lowConfidence: number;
    blocked: number;
    cleanup: number;
  };
}

export interface ChangeSetOperation {
  id: string;
  type: GCEOperation["type"];
  source: string;
  target: string;
  roomId?: string;
  confidence: number;
  reason: string;
  governanceDecision: GovernanceDecision["decision"];
  appliedAt?: string;
}

export interface AutopilotReport {
  cycleId: string;
  timestamp: string;
  summary: {
    integrityBefore: number;
    integrityAfter: number;
    integrityDelta: number;
    totalRooms: number;
    roomsFixed: number;
    totalOperations: number;
    appliedOperations: number;
    blockedOperations: number;
    passedGovernance: boolean;
  };
  stages: {
    name: AutopilotStage;
    status: string;
    duration: string;
    details: string;
  }[];
  lowestIntegrityRooms: { roomId: string; score: number }[];
  violations: GovernanceViolation[];
  recommendations: string[];
}

export interface AutopilotStatusStore {
  lastRun: string | null;
  lastCycleId: string | null;
  lastResult: "success" | "partial" | "failed" | null;
  fixesApplied: number;
  blockedChanges: number;
  integrityBefore: number;
  integrityAfter: number;
  governanceDecisions: GovernanceDecision[];
  autopilotCycleLengthMs: number;
  enabled: boolean;
  version: string;
}

// ============================================
// Autopilot Status Store
// ============================================

let autopilotStatusStore: AutopilotStatusStore = {
  lastRun: null,
  lastCycleId: null,
  lastResult: null,
  fixesApplied: 0,
  blockedChanges: 0,
  integrityBefore: 0,
  integrityAfter: 0,
  governanceDecisions: [],
  autopilotCycleLengthMs: 0,
  enabled: true,
  version: "4.4.0",
};

export function getAutopilotStatusStore(): AutopilotStatusStore {
  return { ...autopilotStatusStore };
}

export function updateAutopilotStatusStore(result: AutopilotResult): void {
  autopilotStatusStore = {
    lastRun: result.completedAt,
    lastCycleId: result.cycleId,
    lastResult: result.success
      ? "success"
      : result.integrityAfter > result.integrityBefore
        ? "partial"
        : "failed",
    fixesApplied: result.appliedOperations,
    blockedChanges: result.blockedOperations,
    integrityBefore: result.integrityBefore,
    integrityAfter: result.integrityAfter,
    governanceDecisions: result.governanceDecisions,
    autopilotCycleLengthMs: result.durationMs,
    enabled: autopilotStatusStore.enabled,
    version: "4.4.0",
  };
}

export function setAutopilotEnabled(enabled: boolean): void {
  autopilotStatusStore.enabled = enabled;
}

export function serializeAutopilotStatus(): string {
  return JSON.stringify(autopilotStatusStore, null, 2);
}

// ============================================
// Core Autopilot Functions
// ============================================

function safeNumber(v: any, fallback = 0): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Coerce entry slugs to string at subsystem boundaries.
 * This prevents TS/type drift when some data sources use numeric slugs.
 */
type AnyEntryLike = { slug?: unknown; id?: unknown; artifact_id?: unknown; audio?: unknown };
function coerceEntries<T extends AnyEntryLike>(entries: T[]): Array<T & { slug?: string }> {
  return (entries || []).map((e) => {
    const raw = (e as any).slug;
    const coerced =
      typeof raw === "number" ? String(raw) : typeof raw === "string" ? raw : undefined;
    return { ...(e as any), slug: coerced };
  });
}

/**
 * Run the complete autopilot cycle
 */
export async function runAutopilotCycle(
  rooms: RoomData[],
  storageFiles: Set<string>,
  config: Partial<AutopilotConfig> = {}
): Promise<AutopilotResult> {
  const fullConfig = { ...DEFAULT_AUTOPILOT_CONFIG, ...config };
  const cycleId = `autopilot-${Date.now()}`;
  const startedAt = new Date().toISOString();

  // Safer for node/vitest (performance may exist, but Date.now is universal)
  const startTime = Date.now();

  const stages: AutopilotStageResult[] = [];
  const allOperations: GCEOperation[] = [];
  const appliedOperations: GCEOperation[] = [];
  const blockedOperations: GCEOperation[] = [];
  const governanceDecisions: GovernanceDecision[] = [];

  // Calculate initial integrity
  const integrityBefore = getSystemIntegrity(rooms, storageFiles);

  // Stage 1: SCAN
  const scanResult = await runScanStage(rooms, storageFiles, fullConfig);
  stages.push(scanResult);

  // Stage 2: REPAIR
  const repairResult = await runRepairStage(
    rooms,
    storageFiles,
    scanResult.details.roomResults || [],
    fullConfig
  );
  stages.push(repairResult);
  allOperations.push(...(repairResult.details.operations || []));

  // Process governance for repair operations
  for (const op of repairResult.details.operations || []) {
    const govOp: GovernanceOperation = {
      // governance engine should be prepared to receive core operation types used in this system
      type: op.type,
      source: op.source,
      target: op.target,
      roomId: op.metadata?.roomId,
      entrySlug: op.metadata?.entrySlug,
      language: op.metadata?.language,
      metadata: op.metadata || {},
    };

    const decision = evaluateOperation(govOp);
    governanceDecisions.push(decision);

    if (decision.decision === "block") {
      blockedOperations.push(op);
    } else if (!fullConfig.dryRun && shouldAutoApply(govOp)) {
      appliedOperations.push(op);
    }
  }

  // Stage 3: GENERATE MISSING (stub for now)
  const generateResult = await runGenerateMissingStage(
    rooms,
    storageFiles,
    scanResult.details.missingAudio || [],
    fullConfig
  );
  stages.push(generateResult);
  allOperations.push(...(generateResult.details.operations || []));

  // Stage 4: SEMANTIC ATTACH
  const attachResult = await runSemanticAttachStage(
    rooms,
    storageFiles,
    scanResult.details.orphans || [],
    fullConfig
  );
  stages.push(attachResult);
  allOperations.push(...(attachResult.details.operations || []));

  for (const op of attachResult.details.operations || []) {
    const govOp: GovernanceOperation = {
      // IMPORTANT: governance should evaluate intent; source/target carry the real rename/attach payload
      type: "attach-orphan",
      source: op.source,
      target: op.target,
      roomId: op.metadata?.roomId,
      entrySlug: op.metadata?.entrySlug,
      language: op.metadata?.language,
      metadata: op.metadata || {},
    };

    const decision = evaluateOperation(govOp);

    // Cross-room protection (avoid mutating possibly-readonly decision objects)
    let finalDecision = decision;
    if (fullConfig.enableCrossRoomProtection) {
      const blockCheck = blockCriticalChanges(govOp);
      if (blockCheck.blocked) {
        finalDecision = {
          ...decision,
          decision: "block",
          reason: blockCheck.reason,
        } as GovernanceDecision;
      }
    }

    governanceDecisions.push(finalDecision);

    if (finalDecision.decision === "block") {
      blockedOperations.push(op);
    } else if (!fullConfig.dryRun && shouldAutoApply(govOp)) {
      appliedOperations.push(op);
    }
  }

  // Stage 5: REBUILD MANIFEST
  const manifestResult = await runRebuildManifestStage(storageFiles, fullConfig);
  stages.push(manifestResult);

  // Stage 6: INTEGRITY EVAL
  const integrityResult = await runIntegrityEvalStage(rooms, storageFiles, fullConfig);
  stages.push(integrityResult);
  const integrityAfter = safeNumber(integrityResult.details.integrityScore, integrityBefore);

  // Stage 7: GOVERNANCE EVAL
  const governanceResult = await runGovernanceEvalStage(
    governanceDecisions,
    integrityBefore,
    integrityAfter,
    fullConfig
  );
  stages.push(governanceResult);

  // Stage 8: REPORT  ✅ FIX: correct argument order (applied, blocked, config)
  const reportResult = await runReportStage(
    cycleId,
    stages,
    governanceDecisions,
    integrityBefore,
    integrityAfter,
    rooms,
    storageFiles,
    appliedOperations.length,
    blockedOperations.length,
    fullConfig
  );
  stages.push(reportResult);

  const endTime = Date.now();
  const completedAt = new Date().toISOString();

  // Build structured changeset (only ops we evaluated)
  const changeSet = buildStructuredChangeSet(
    cycleId,
    [...appliedOperations, ...blockedOperations],
    governanceDecisions
  );

  // Build report
  const report = buildAutopilotReport(
    cycleId,
    stages,
    governanceDecisions,
    integrityBefore,
    integrityAfter,
    rooms,
    storageFiles,
    appliedOperations.length,
    blockedOperations.length
  );

  const result: AutopilotResult = {
    success: integrityAfter >= fullConfig.minIntegrityTarget,
    cycleId,
    startedAt,
    completedAt,
    durationMs: Math.round(endTime - startTime),
    integrityBefore,
    integrityAfter,
    integrityDelta: integrityAfter - integrityBefore,
    stages,
    totalOperations: allOperations.length,
    appliedOperations: appliedOperations.length,
    blockedOperations: blockedOperations.length,
    governanceDecisions,
    changeSet,
    report,
  };

  // Update status store
  updateAutopilotStatusStore(result);

  return result;
}

// ============================================
// Stage Implementations
// ============================================

async function runScanStage(
  rooms: RoomData[],
  storageFiles: Set<string>,
  config: AutopilotConfig
): Promise<AutopilotStageResult> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  const roomResults: GCERoomResult[] = [];
  const missingAudio: { roomId: string; entrySlug: string; lang: "en" | "vi" }[] = [];
  const orphans: { roomId: string; file: string }[] = [];

  for (const room of rooms) {
    const result = getCanonicalAudioForEntireRoom(room.roomId, coerceEntries(room.entries as any), storageFiles);
    roomResults.push(result);

    // Collect missing audio
    for (const entry of result.entries) {
      if (!entry.storageMatchesEn) {
        missingAudio.push({
          roomId: room.roomId,
          entrySlug: entry.entrySlug,
          lang: "en",
        });
      }
      if (!entry.storageMatchesVi) {
        missingAudio.push({
          roomId: room.roomId,
          entrySlug: entry.entrySlug,
          lang: "vi",
        });
      }
    }

    // Collect orphans
    for (const issue of result.allIssues) {
      if (issue.type === "orphan-candidate" && issue.filename) {
        orphans.push({ roomId: room.roomId, file: issue.filename });
      }
    }
  }

  const endTime = Date.now();

  return {
    stage: "scan",
    status: "success",
    startedAt,
    completedAt: new Date().toISOString(),
    durationMs: Math.round(endTime - startTime),
    operationsFound: roomResults.reduce((sum, r) => sum + r.allIssues.length, 0),
    operationsApplied: 0,
    operationsBlocked: 0,
    details: {
      roomResults,
      // NOTE: scan does not emit operations; downstream stages create concrete ops
      operations: [],
      missingAudio,
      orphans,
      totalRooms: rooms.length,
      totalIssues: roomResults.reduce((sum, r) => sum + r.allIssues.length, 0),
    },
  };
}

async function runRepairStage(
  rooms: RoomData[],
  storageFiles: Set<string>,
  roomResults: GCERoomResult[],
  config: AutopilotConfig
): Promise<AutopilotStageResult> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  const operations: GCEOperation[] = [];

  for (const result of roomResults) {
    for (const issue of result.allIssues) {
      if (!issue.autoFixable) continue;

      const op: GCEOperation = {
        type:
          issue.type === "non-canonical" || issue.type === "reversed-lang"
            ? "update-json"
            : "rename",
        source: issue.filename || "",
        target: issue.suggestedFix || "",
        metadata: {
          roomId: result.roomId,
          reason: issue.description,
          confidence: issue.type === "reversed-lang" ? 95 : 85,
          reversible: true,
        },
      };

      operations.push(op);
    }
  }

  const endTime = Date.now();

  return {
    stage: "repair",
    status: operations.length > 0 ? "success" : "skipped",
    startedAt,
    completedAt: new Date().toISOString(),
    durationMs: Math.round(endTime - startTime),
    operationsFound: operations.length,
    operationsApplied: 0, // actual apply happens after governance (outside stage)
    operationsBlocked: 0, // actual blocking happens after governance (outside stage)
    details: {
      operations,
      repairsFound: operations.length,
    },
  };
}

async function runGenerateMissingStage(
  rooms: RoomData[],
  storageFiles: Set<string>,
  missingAudio: { roomId: string; entrySlug: string; lang: "en" | "vi" }[],
  config: AutopilotConfig
): Promise<AutopilotStageResult> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  // TTS generation is stubbed - will be implemented in Phase 5
  const operations: GCEOperation[] = [];

  if (config.enableTtsGeneration && missingAudio.length > 0) {
    for (const missing of missingAudio.slice(0, config.maxOperationsPerRun)) {
      const canonical = getCanonicalAudioForRoom(missing.roomId, missing.entrySlug);
      operations.push({
        type: "create-ref",
        source: "tts-stub",
        target: (canonical as any)[missing.lang],
        metadata: {
          roomId: missing.roomId,
          entrySlug: missing.entrySlug,
          language: missing.lang,
          reason: `Generate ${missing.lang.toUpperCase()} audio via TTS`,
          confidence: 100,
          reversible: false,
        },
      });
    }
  }

  const endTime = Date.now();

  return {
    stage: "generate-missing",
    status: config.enableTtsGeneration ? "success" : "skipped",
    startedAt,
    completedAt: new Date().toISOString(),
    durationMs: Math.round(endTime - startTime),
    operationsFound: missingAudio.length,
    operationsApplied: 0, // stubbed
    operationsBlocked: 0,
    details: {
      missingCount: missingAudio.length,
      operations,
      ttsEnabled: config.enableTtsGeneration,
      note: "TTS generation is stubbed - full implementation in Phase 5",
    },
  };
}

async function runSemanticAttachStage(
  rooms: RoomData[],
  storageFiles: Set<string>,
  orphans: { roomId: string; file: string }[],
  config: AutopilotConfig
): Promise<AutopilotStageResult> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  const operations: GCEOperation[] = [];
  let blocked = 0;

  if (config.enableOrphanAttachment) {
    // Group orphans by room
    const orphansByRoom = new Map<string, string[]>();
    for (const orphan of orphans) {
      const existing = orphansByRoom.get(orphan.roomId) || [];
      existing.push(orphan.file);
      orphansByRoom.set(orphan.roomId, existing);
    }

    // Match orphans for each room
    for (const room of rooms) {
      const roomOrphans = orphansByRoom.get(room.roomId) || [];
      if (roomOrphans.length === 0) continue;

      const { autoRepairs, humanReview } = batchMatchOrphans(
        roomOrphans,
        room.roomId,
        coerceEntries(room.entries as any)
      );

      for (const match of autoRepairs) {
        if (
          match.suggestedCanonical &&
          match.confidence >= MIN_CONFIDENCE_FOR_AUTO_FIX * 100
        ) {
          operations.push({
            type: "rename",
            source: match.filename,
            target: match.suggestedCanonical,
            metadata: {
              roomId: room.roomId,
              entrySlug: String((match.matchedEntry as any)?.slug ?? ""),
              language: extractLanguage(match.filename) || undefined,
              reason: `Semantic match (${match.matchType}) with ${match.confidence}% confidence`,
              confidence: match.confidence,
              reversible: true,
            },
          });
        }
      }

      // Count low-confidence matches (go to human review)
      blocked += humanReview.length;
    }
  }

  const endTime = Date.now();

  return {
    stage: "semantic-attach",
    status: config.enableOrphanAttachment ? "success" : "skipped",
    startedAt,
    completedAt: new Date().toISOString(),
    durationMs: Math.round(endTime - startTime),
    operationsFound: orphans.length,
    operationsApplied: 0, // apply happens after governance
    operationsBlocked: blocked, // informational: humanReview count
    details: {
      operations,
      orphansProcessed: orphans.length,
      autoAttached: operations.length,
      blocked,
    },
  };
}

async function runRebuildManifestStage(
  storageFiles: Set<string>,
  config: AutopilotConfig
): Promise<AutopilotStageResult> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  // Manifest rebuild is handled by external script
  const endTime = Date.now();

  return {
    stage: "rebuild-manifest",
    status: "success",
    startedAt,
    completedAt: new Date().toISOString(),
    durationMs: Math.round(endTime - startTime),
    operationsFound: 1,
    operationsApplied: config.dryRun ? 0 : 1,
    operationsBlocked: 0,
    details: {
      filesInManifest: storageFiles.size,
      note: "Manifest rebuild delegated to generate-audio-manifest.js",
    },
  };
}

async function runIntegrityEvalStage(
  rooms: RoomData[],
  storageFiles: Set<string>,
  config: AutopilotConfig
): Promise<AutopilotStageResult> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  const integrityMap = buildIntegrityMap(rooms, storageFiles);
  const summary = generateIntegritySummary(integrityMap);
  const lowestRooms = getLowestIntegrityRooms(integrityMap, 10);
  const crossRoomViolations = detectCrossRoomPollution(rooms, storageFiles);
  const parityViolations = verifyEnViParity(rooms, storageFiles);

  const endTime = Date.now();

  return {
    stage: "integrity-eval",
    status: summary.averageScore >= config.minIntegrityTarget ? "success" : "partial",
    startedAt,
    completedAt: new Date().toISOString(),
    durationMs: Math.round(endTime - startTime),
    operationsFound: 0,
    operationsApplied: 0,
    operationsBlocked: 0,
    details: {
      integrityScore: summary.averageScore,
      summary,
      lowestRooms: lowestRooms.map((r) => ({ roomId: r.roomId, score: r.score })),
      crossRoomViolations: crossRoomViolations.length,
      parityViolations: parityViolations.length,
    },
  };
}

async function runGovernanceEvalStage(
  decisions: GovernanceDecision[],
  integrityBefore: number,
  integrityAfter: number,
  config: AutopilotConfig
): Promise<AutopilotStageResult> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  const approved = decisions.filter(
    (d) => d.decision === "auto-approve" || d.decision === "governance-approve"
  );
  const blocked = decisions.filter((d) => d.decision === "block");
  const humanReview = decisions.filter((d) => d.decision === "human-review");

  const passed = blocked.length === 0 && integrityAfter >= config.minIntegrityTarget;

  const endTime = Date.now();

  return {
    stage: "governance-eval",
    status: passed ? "success" : blocked.length > 0 ? "partial" : "failed",
    startedAt,
    completedAt: new Date().toISOString(),
    durationMs: Math.round(endTime - startTime),
    operationsFound: decisions.length,
    operationsApplied: approved.length,
    operationsBlocked: blocked.length,
    details: {
      totalDecisions: decisions.length,
      autoApproved: decisions.filter((d) => d.decision === "auto-approve").length,
      governanceApproved: decisions.filter((d) => d.decision === "governance-approve").length,
      blocked: blocked.length,
      humanReview: humanReview.length,
      passed,
    },
  };
}

async function runReportStage(
  cycleId: string,
  stages: AutopilotStageResult[],
  decisions: GovernanceDecision[],
  integrityBefore: number,
  integrityAfter: number,
  rooms: RoomData[],
  storageFiles: Set<string>,
  applied: number,
  blocked: number,
  config?: AutopilotConfig
): Promise<AutopilotStageResult> {
  const startedAt = new Date().toISOString();
  const startTime = Date.now();

  const integrityMap = buildIntegrityMap(rooms, storageFiles);
  const lowestRooms = getLowestIntegrityRooms(integrityMap, 5);

  const endTime = Date.now();

  return {
    stage: "report",
    status: "success",
    startedAt,
    completedAt: new Date().toISOString(),
    durationMs: Math.round(endTime - startTime),
    operationsFound: 0,
    operationsApplied: 0,
    operationsBlocked: 0,
    details: {
      cycleId,
      integrityBefore,
      integrityAfter,
      integrityDelta: integrityAfter - integrityBefore,
      totalStages: stages.length,
      appliedOperations: applied,
      blockedOperations: blocked,
      lowestRooms: lowestRooms.map((r) => ({ roomId: r.roomId, score: r.score })),
    },
  };
}

// ============================================
// Change Set Builder
// ============================================

function buildStructuredChangeSet(
  cycleId: string,
  operations: GCEOperation[],
  decisions: GovernanceDecision[]
): StructuredChangeSet {
  const categories: StructuredChangeSet["categories"] = {
    critical: [],
    structural: [],
    lowConfidence: [],
    blocked: [],
    cleanup: [],
  };

  // Best-effort mapping: include a few keys so rename-vs-attach decisions still map.
  const decisionMap = new Map<string, GovernanceDecision>();
  for (const d of decisions) {
    const type = String(d.operation.type || "");
    const src = String(d.operation.source || "");
    const tgt = String(d.operation.target || "");
    const roomId = String((d.operation as any).roomId || "");
    decisionMap.set(`${type}|${src}`, d);
    decisionMap.set(`${type}|${tgt}`, d);
    if (roomId) {
      decisionMap.set(`${roomId}|${src}`, d);
      decisionMap.set(`${roomId}|${tgt}`, d);
    }
  }

  for (const op of operations) {
    const roomId = String(op.metadata?.roomId || "");
    const decision =
      decisionMap.get(`${op.type}|${op.source}`) ||
      decisionMap.get(`${op.type}|${op.target}`) ||
      (roomId ? decisionMap.get(`${roomId}|${op.source}`) : undefined) ||
      (roomId ? decisionMap.get(`${roomId}|${op.target}`) : undefined);

    const confidence = safeNumber(op.metadata?.confidence, 0);
    const reason = String(op.metadata?.reason || "");

    const changeOp: ChangeSetOperation = {
      id: `${op.type}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      type: op.type,
      source: op.source,
      target: op.target,
      roomId: op.metadata?.roomId,
      confidence,
      reason,
      governanceDecision: decision?.decision || "auto-approve",
    };

    if (decision?.decision === "block") {
      categories.blocked.push(changeOp);
    } else if (confidence > 0 && confidence < 70) {
      categories.lowConfidence.push(changeOp);
    } else if (op.type === "update-json" && reason.includes("reversed")) {
      categories.critical.push(changeOp);
    } else if (op.type === "rename" || op.type === "update-json") {
      categories.structural.push(changeOp);
    } else {
      categories.cleanup.push(changeOp);
    }
  }

  return {
    id: cycleId,
    timestamp: new Date().toISOString(),
    categories,
    summary: {
      total: operations.length,
      critical: categories.critical.length,
      structural: categories.structural.length,
      lowConfidence: categories.lowConfidence.length,
      blocked: categories.blocked.length,
      cleanup: categories.cleanup.length,
    },
  };
}

// ============================================
// Report Builder
// ============================================

function buildAutopilotReport(
  cycleId: string,
  stages: AutopilotStageResult[],
  decisions: GovernanceDecision[],
  integrityBefore: number,
  integrityAfter: number,
  rooms: RoomData[],
  storageFiles: Set<string>,
  applied: number,
  blocked: number
): AutopilotReport {
  const integrityMap = buildIntegrityMap(rooms, storageFiles);
  const lowestRooms = getLowestIntegrityRooms(integrityMap, 10);
  const violations: GovernanceViolation[] = [];

  for (const d of decisions) {
    if (d.violations.length > 0) {
      violations.push({
        code: "GOVERNANCE_VIOLATION",
        severity: d.decision === "block" ? "critical" : "warning",
        message: d.violations.join("; "),
        operation: d.operation,
        resolution: d.reason,
      });
    }
  }

  // NOTE: stages don't actually apply ops; applied count is tracked at cycle level
  const roomsFixed = stages
    .filter((s) => s.stage === "repair" || s.stage === "semantic-attach")
    .reduce((sum, s) => sum + safeNumber(s.operationsApplied, 0), 0);

  const recommendations: string[] = [];

  if (integrityAfter < 99) {
    recommendations.push(`System integrity (${integrityAfter}%) is below 99% target`);
  }

  if (blocked > 0) {
    recommendations.push(`${blocked} operations were blocked by governance - review manually`);
  }

  if (lowestRooms.some((r) => r.score < 80)) {
    recommendations.push("Some rooms have critically low integrity scores - prioritize these");
  }

  return {
    cycleId,
    timestamp: new Date().toISOString(),
    summary: {
      integrityBefore,
      integrityAfter,
      integrityDelta: integrityAfter - integrityBefore,
      totalRooms: rooms.length,
      roomsFixed,
      totalOperations: applied + blocked,
      appliedOperations: applied,
      blockedOperations: blocked,
      passedGovernance: blocked === 0,
    },
    stages: stages.map((s) => ({
      name: s.stage,
      status: s.status,
      duration: `${s.durationMs}ms`,
      details: JSON.stringify(s.details).slice(0, 200),
    })),
    lowestIntegrityRooms: lowestRooms.map((r) => ({ roomId: r.roomId, score: r.score })),
    violations,
    recommendations,
  };
}

// ============================================
// Export helpers for CI
// ============================================

export function serializeChangeSet(changeSet: StructuredChangeSet): string {
  return JSON.stringify(changeSet, null, 2);
}

export function serializeAutopilotReport(report: AutopilotReport): string {
  return JSON.stringify(report, null, 2);
}

export function generateMarkdownReport(report: AutopilotReport): string {
  const lines: string[] = [
    `# Autopilot Report: ${report.cycleId}`,
    "",
    `Generated: ${report.timestamp}`,
    "",
    "## Summary",
    "",
    `| Metric | Value |`,
    `|--------|-------|`,
    `| Integrity Before | ${report.summary.integrityBefore}% |`,
    `| Integrity After | ${report.summary.integrityAfter}% |`,
    `| Delta | ${report.summary.integrityDelta >= 0 ? "+" : ""}${report.summary.integrityDelta}% |`,
    `| Total Rooms | ${report.summary.totalRooms} |`,
    `| Rooms Fixed | ${report.summary.roomsFixed} |`,
    `| Operations Applied | ${report.summary.appliedOperations} |`,
    `| Operations Blocked | ${report.summary.blockedOperations} |`,
    `| Passed Governance | ${report.summary.passedGovernance ? "✅" : "❌"} |`,
    "",
    "## Stages",
    "",
  ];

  for (const stage of report.stages) {
    lines.push(`### ${stage.name}`);
    lines.push(`- Status: ${stage.status}`);
    lines.push(`- Duration: ${stage.duration}`);
    lines.push("");
  }

  if (report.lowestIntegrityRooms.length > 0) {
    lines.push("## Lowest Integrity Rooms");
    lines.push("");
    lines.push("| Room ID | Score |");
    lines.push("|---------|-------|");
    for (const room of report.lowestIntegrityRooms) {
      lines.push(`| ${room.roomId} | ${room.score}% |`);
    }
    lines.push("");
  }

  if (report.violations.length > 0) {
    lines.push("## Violations");
    lines.push("");
    for (const v of report.violations) {
      lines.push(`- **${v.severity.toUpperCase()}**: ${v.message}`);
    }
    lines.push("");
  }

  if (report.recommendations.length > 0) {
    lines.push("## Recommendations");
    lines.push("");
    for (const r of report.recommendations) {
      lines.push(`- ${r}`);
    }
  }

  return lines.join("\n");
}
