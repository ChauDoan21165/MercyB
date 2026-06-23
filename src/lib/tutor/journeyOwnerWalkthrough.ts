/**
 * Journey Owner Walkthrough Evidence — Step 116
 *
 * The CULMINATING module. Walks through a COMPLETE learner journey — from
 * placement to exit — and demonstrates that Teacher Mercy diagnoses, teaches,
 * remembers, adapts, self-checks, and proves learner improvement at EVERY
 * phase, like a strong human teacher.
 *
 * This is NOT another single-session gate. It validates the FULL JOURNEY
 * across 8 phases, integrating EVERY tutor subsystem built in Steps 1-115:
 *
 *   Phase 1 — Placement: CEFR baseline, weakness detection
 *   Phase 2 — First Contact: initial grammar correction session
 *   Phase 3 — Conversation Initiation: first speak session
 *   Phase 4 — Pattern Building: repeated practice, weakness tagging
 *   Phase 5 — Adaptation: difficulty/pacing/content adjustment
 *   Phase 6 — Self-Correction Growth: learner self-corrects
 *   Phase 7 — Mastery Evidence: measurable learning gain
 *   Phase 8 — Exit Readiness: learner reaches target level
 *
 * Each phase exercises all 6 teacher capabilities:
 *   Diagnose → Teach → Remember → Adapt → Self-check → Prove
 *
 * All pure functions — no I/O, no side effects, deterministic.
 * Vietnamese-first in all user-facing labels and summaries.
 *
 * Key APIs:
 *   buildFullJourneyWalkthrough(input)       — complete walkthrough
 *   walkJourneyPhase(phaseId, ctx, evidence) — walk a single phase
 *   collectJourneyEvidence(wt)              — aggregate all evidence
 *   generateJourneyWalkthroughVi(wt)        — Vietnamese summary
 *   getJourneyWalkthroughActionItems(wt)    — Chau action items
 *   validateJourneyWalkthrough(wt)          — completeness check
 *   compareJourneyWalkthroughs(prev, curr)  — cross-journey comparison
 *
 * Integrates with:
 *   - realProductProofGate (Step 110) — per-phase product validation
 *   - tutorFailureTaxonomy (Step 109) — failure detection
 *   - teacherIntelligenceDashboard (Step 108) — intelligence scoring
 *   - humanLearnerTestingChecklist (Step 107) — learner testing
 *   - chauReviewPacket (Step 106) — session review
 *   - learningGainRubric (Step 105) — gain measurement
 *   - learningGainEvidencePacket (Step 114) — gain evidence
 *   - safetyHumilityFinalAudit (Step 115) — safety & humility
 *   - teacherMercyContract — contract validation
 *   - teacherMercyRubric — quality evaluation
 *   - teacherMercySelfAuditGate — self-audit
 *   - overclaimGuard — overclaim prevention
 *   - correctionEngine — correction quality
 *   - conversationWarmth — warmth and tone
 *   - lessonSequenceGenerator — lesson planning
 *   - transcriptCorrectionCollector — correction proof
 *   - weaknessMemoryTags — weakness tracking
 *   - learnerHistoryProfile — history tracking
 *   - teacherDecisionEngine — decision quality
 *   - teachingDecisionEvaluationGate — decision evaluation
 *   - correctionTimingIntegration — timing decisions
 *   - followUpIntelligence — follow-up quality
 *   - hintLadderPolicy — scaffolding decisions
 *   - encouragementTimingPolicy — encouragement timing
 *   - learnerReadinessPolicy — readiness assessment
 *
 * Single command to run:
 *   npx vitest run src/lib/tutor/__tests__/journeyOwnerWalkthrough.test.ts
 */

import type { TutorTurn } from "./tutorTypes";
import type { TranscriptCorrectionEvent } from "./transcriptCorrectionTypes";
import type { CorrectionEngineResult } from "./correctionEngine";
import type { AuditResult } from "./teacherMercyAuditGate";
import type { RubricResult } from "./teacherMercyRubric";
import type { ContractRuleCheck } from "./teacherMercyContract";
import type { ChauMemorySnapshot, ChauReviewPacket } from "./chauReviewPacket";
import type { LearningGainResult } from "./learningGainRubric";
import type { HumanLearnerChecklistResult } from "./humanLearnerTestingChecklist";
import type { SelfAuditResult } from "./teacherMercySelfAuditGate";
import type { OverclaimGuardResult } from "./overclaimGuard";
import type { EvaluationResult } from "./teachingDecisionEvaluationGate";
import type { TeacherDecision } from "./teacherDecisionEngine";
import type {
  TeacherIntelligenceDimensionId,
  TeacherIntelligenceDashboard,
} from "./teacherIntelligenceDashboard";
import type { WeaknessTag } from "./weaknessMemoryTags";
import type { LearnerHistoryProfile } from "./learnerHistoryProfile";
import type { SafetyHumilityAuditResult } from "./safetyHumilityFinalAudit";
import type { SessionFailureScan } from "./tutorFailureTaxonomy";
import type { ProductProofVerdict } from "./realProductProofGate";

// ═══════════════════════════════════════════════════════════════════════════════
// Journey Owner Types
// ═══════════════════════════════════════════════════════════════════════════════

/** The 6 teacher capabilities we prove at every phase */
export type TeacherCapability =
  | "diagnose"
  | "teach"
  | "remember"
  | "adapt"
  | "self_check"
  | "prove";

export const TEACHER_CAPABILITIES: readonly TeacherCapability[] = [
  "diagnose",
  "teach",
  "remember",
  "adapt",
  "self_check",
  "prove",
] as const;

/** The 8 phases of a complete learner journey */
export type JourneyPhaseId =
  | "placement"
  | "first_contact"
  | "conversation_initiation"
  | "pattern_building"
  | "adaptation"
  | "self_correction_growth"
  | "mastery_evidence"
  | "exit_readiness";

export const JOURNEY_PHASES: readonly JourneyPhaseId[] = [
  "placement",
  "first_contact",
  "conversation_initiation",
  "pattern_building",
  "adaptation",
  "self_correction_growth",
  "mastery_evidence",
  "exit_readiness",
] as const;

/** Evidence that a teacher capability was exercised in a phase */
export interface CapabilityEvidence {
  /** Which capability */
  capability: TeacherCapability;
  /** Was this capability demonstrated? */
  demonstrated: boolean;
  /** Vietnamese description of what happened */
  descriptionVi: string;
  /** English description */
  descriptionEn: string;
  /** Score 0-3 for this capability in this phase */
  score: number;
  /** Source gates/modules that produced this evidence */
  sources: string[];
  /** Whether there was a failure in this capability */
  hasFailure: boolean;
  /** Failure ID if hasFailure */
  failureId?: string;
}

/** Result of a single journey phase */
export interface JourneyPhaseResult {
  /** Phase identifier */
  phaseId: JourneyPhaseId;
  /** Phase ordinal (1-8) */
  phaseOrdinal: number;
  /** Vietnamese phase label */
  labelVi: string;
  /** English phase label */
  labelEn: string;
  /** Number of sessions in this phase */
  sessionCount: number;
  /** Number of turns across all sessions */
  turnCount: number;
  /** Capability evidence for all 6 capabilities */
  capabilities: Record<TeacherCapability, CapabilityEvidence>;
  /** Overall phase score 0-100 */
  phaseScore: number;
  /** Whether this phase passed */
  phasePassed: boolean;
  /** Product proof verdict for this phase (if proof was run) */
  proofVerdict: ProductProofVerdict | null;
  /** Failure scan result */
  failureScan: SessionFailureScan | null;
  /** Learning gain for this phase */
  learningGain: LearningGainResult | null;
  /** Safety audit result */
  safetyAudit: SafetyHumilityAuditResult | null;
  /** Intelligence dashboard for this phase */
  intelligenceDashboard: TeacherIntelligenceDashboard | null;
  /** Checklist result for this phase */
  checklistResult: HumanLearnerChecklistResult | null;
  /** Chau review packet for this phase */
  reviewPacket: ChauReviewPacket | null;
  /** Weakness tags discovered in this phase */
  weaknessTags: WeaknessTag[];
  /** Learner history profile at end of phase */
  learnerHistoryProfile: LearnerHistoryProfile | null;
  /** Vietnamese summary of the phase */
  summaryVi: string;
}

/** Progress across the full journey */
export interface JourneyProgress {
  /** Current CEFR level (approximate) */
  cefrLevel: string;
  /** Target CEFR level */
  targetCefrLevel: string;
  /** Total sessions completed */
  totalSessions: number;
  /** Total turns across all phases */
  totalTurns: number;
  /** Total corrections made */
  totalCorrections: number;
  /** Total self-corrections by learner */
  totalSelfCorrections: number;
  /** Total weaknesses identified */
  totalWeaknessesTagged: number;
  /** Total weaknesses resolved */
  totalWeaknessesResolved: number;
  /** Cumulative learning gain score 0-100 */
  cumulativeGainScore: number;
  /** Vietnamese progress summary */
  progressVi: string;
}

/** Input to build a full journey walkthrough */
export interface JourneyWalkthroughInput {
  /** Learner identifier */
  learnerId: string;
  /** Learner's CEFR level at start */
  startingCefrLevel: string;
  /** Target CEFR level */
  targetCefrLevel: string;
  /** Product being used */
  productId: string;
  /** Target language */
  targetLanguage: string;
  /** UI / explain language */
  explainLanguage: string;
  /** ISO start timestamp */
  startTimestamp: string;
  /** Which phases to include (default: all 8) */
  phases?: JourneyPhaseId[];
  /** Session data per phase (keyed by phaseId) */
  phaseSessions?: Partial<Record<JourneyPhaseId, JourneyPhaseSessionData[]>>;
}

/** Session data for a phase */
export interface JourneyPhaseSessionData {
  /** Session identifier */
  sessionId: string;
  /** ISO session timestamp */
  sessionTimestamp: string;
  /** Tutor turns in this session */
  turns: TutorTurn[];
  /** Correction events captured */
  correctionEvents?: TranscriptCorrectionEvent[];
  /** Correction engine results */
  correctionResults?: CorrectionEngineResult[];
  /** Rubric evaluation results */
  rubricResults?: RubricResult[];
  /** Contract rule checks */
  contractChecks?: ContractRuleCheck[];
  /** Audit results */
  auditResults?: AuditResult[];
  /** Self-audit results */
  selfAuditResults?: SelfAuditResult[];
  /** Overclaim guard results */
  overclaimResults?: OverclaimGuardResult[];
  /** Decision evaluation results */
  evaluationResults?: EvaluationResult[];
  /** Teacher decisions */
  teacherDecisions?: TeacherDecision[];
  /** Memory snapshots */
  memorySnapshots?: ChauMemorySnapshot[];
  /** Learning gain result */
  learningGainResult?: LearningGainResult | null;
  /** Checklist result */
  checklistResult?: HumanLearnerChecklistResult | null;
  /** Review packet */
  reviewPacket?: ChauReviewPacket | null;
}

/** Complete journey walkthrough result */
export interface JourneyWalkthroughResult {
  /** Journey identifier */
  journeyId: string;
  /** Learner identifier */
  learnerId: string;
  /** Product identifier */
  productId: string;
  /** Target language */
  targetLanguage: string;
  /** Journey start timestamp */
  startTimestamp: string;
  /** Journey end timestamp (estimated or actual) */
  endTimestamp: string;
  /** Starting CEFR level */
  startingCefrLevel: string;
  /** Target CEFR level */
  targetCefrLevel: string;
  /** Phase results in order */
  phases: JourneyPhaseResult[];
  /** Overall journey progress */
  progress: JourneyProgress;
  /** Collected evidence across journey */
  evidence: JourneyEvidencePacket;
  /** Overall journey verdict */
  verdict: JourneyWalkthroughVerdict;
  /** Overall journey score 0-100 */
  overallScore: number;
  /** Vietnamese full walkthrough summary */
  walkthroughVi: string;
  /** Chau action items (prioritized) */
  actionItems: string[];
}

/** Aggregated evidence across the full journey */
export interface JourneyEvidencePacket {
  /** How many phases demonstrated each capability */
  capabilityCoverage: Record<TeacherCapability, number>;
  /** Total evidence items collected */
  totalEvidenceItems: number;
  /** Evidence timeline (phase-by-phase) */
  timeline: JourneyEvidenceTimelineEntry[];
  /** Weakness resolution tracking */
  weaknessTracking: JourneyWeaknessTracking;
  /** Learning gain trajectory */
  gainTrajectory: JourneyGainTrajectoryPoint[];
  /** Safety audit summary across journey */
  safetySummary: JourneySafetySummary;
  /** Vietnamese evidence summary */
  evidenceSummaryVi: string;
}

/** A single point in the evidence timeline */
export interface JourneyEvidenceTimelineEntry {
  /** Phase ID */
  phaseId: JourneyPhaseId;
  /** Phase ordinal */
  phaseOrdinal: number;
  /** Capabilities demonstrated in this phase */
  capabilitiesShown: TeacherCapability[];
  /** Capabilities NOT yet demonstrated by this phase */
  capabilitiesMissing: TeacherCapability[];
  /** Score at this point 0-100 */
  cumulativeScore: number;
}

/** Weakness tracking across the journey */
export interface JourneyWeaknessTracking {
  /** Total weaknesses identified */
  totalIdentified: number;
  /** Total weaknesses resolved */
  totalResolved: number;
  /** Resolution rate 0-1 */
  resolutionRate: number;
  /** Weakness tags with their resolution status */
  tags: JourneyWeaknessTagStatus[];
  /** Vietnamese summary */
  summaryVi: string;
}

/** Status of a specific weakness tag */
export interface JourneyWeaknessTagStatus {
  /** The weakness tag */
  tag: string;
  /** Phase when first identified */
  firstSeenPhase: JourneyPhaseId;
  /** Phase when resolved (if resolved) */
  resolvedPhase?: JourneyPhaseId;
  /** Is this weakness resolved? */
  resolved: boolean;
  /** Number of sessions where this weakness appeared */
  occurrenceCount: number;
}

/** A point in the learning gain trajectory */
export interface JourneyGainTrajectoryPoint {
  /** Phase ID */
  phaseId: JourneyPhaseId;
  /** Phase ordinal */
  phaseOrdinal: number;
  /** Cumulative gain score at this point */
  gainScore: number;
  /** Whether gain is measurable at this point */
  gainMeasurable: boolean;
  /** Whether gain is reportable at this point */
  gainReportable: boolean;
}

/** Safety summary across the full journey */
export interface JourneySafetySummary {
  /** Total safety audits performed */
  totalAudits: number;
  /** Audits that passed cleanly */
  cleanAudits: number;
  /** Audits that blocked */
  blockedAudits: number;
  /** Audits with findings */
  auditsWithFindings: number;
  /** Critical findings across all audits */
  criticalFindings: string[];
  /** Vietnamese summary */
  summaryVi: string;
}

/** Overall journey walkthrough verdict */
export type JourneyWalkthroughVerdict =
  | "JOURNEY_PROVEN"       // All phases pass, all capabilities demonstrated
  | "JOURNEY_ADEQUATE"     // Most phases pass, minor gaps
  | "JOURNEY_INCOMPLETE"   // Some phases missing evidence
  | "JOURNEY_FAILED";      // Critical failures, journey cannot proceed

// ═══════════════════════════════════════════════════════════════════════════════
// Phase Labels (Vietnamese-first)
// ═══════════════════════════════════════════════════════════════════════════════

const PHASE_LABELS: Record<JourneyPhaseId, { labelVi: string; labelEn: string }> = {
  placement: {
    labelVi: "Định vị trình độ",
    labelEn: "Placement",
  },
  first_contact: {
    labelVi: "Tiếp xúc đầu tiên",
    labelEn: "First Contact",
  },
  conversation_initiation: {
    labelVi: "Bắt đầu hội thoại",
    labelEn: "Conversation Initiation",
  },
  pattern_building: {
    labelVi: "Xây dựng thói quen",
    labelEn: "Pattern Building",
  },
  adaptation: {
    labelVi: "Thích ứng cá nhân",
    labelEn: "Adaptation",
  },
  self_correction_growth: {
    labelVi: "Tự sửa lỗi",
    labelEn: "Self-Correction Growth",
  },
  mastery_evidence: {
    labelVi: "Bằng chứng tiến bộ",
    labelEn: "Mastery Evidence",
  },
  exit_readiness: {
    labelVi: "Sẵn sàng tốt nghiệp",
    labelEn: "Exit Readiness",
  },
};

const CAPABILITY_LABELS: Record<TeacherCapability, { labelVi: string; labelEn: string }> = {
  diagnose: {
    labelVi: "Chẩn đoán lỗi",
    labelEn: "Diagnose",
  },
  teach: {
    labelVi: "Giảng dạy",
    labelEn: "Teach",
  },
  remember: {
    labelVi: "Ghi nhớ",
    labelEn: "Remember",
  },
  adapt: {
    labelVi: "Thích ứng",
    labelEn: "Adapt",
  },
  self_check: {
    labelVi: "Tự kiểm tra",
    labelEn: "Self-check",
  },
  prove: {
    labelVi: "Chứng minh tiến bộ",
    labelEn: "Prove",
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// Capability Thresholds
// ═══════════════════════════════════════════════════════════════════════════════

/** How many phases must demonstrate each capability for a passing verdict */
const CAPABILITY_PHASE_THRESHOLDS: Record<TeacherCapability, { pass: number; strong: number }> = {
  diagnose: { pass: 6, strong: 8 },
  teach: { pass: 6, strong: 8 },
  remember: { pass: 5, strong: 7 },
  adapt: { pass: 4, strong: 6 },
  self_check: { pass: 5, strong: 7 },
  prove: { pass: 4, strong: 6 },
};

/** Minimum overall score for each verdict level */
const VERDICT_THRESHOLDS = {
  JOURNEY_PROVEN: 80,
  JOURNEY_ADEQUATE: 60,
  JOURNEY_INCOMPLETE: 40,
  // below 40 = JOURNEY_FAILED
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// Core: Build Full Journey Walkthrough
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Build a complete journey walkthrough from placement to exit.
 * This is the main entry point.
 */
export function buildFullJourneyWalkthrough(
  input: JourneyWalkthroughInput,
): JourneyWalkthroughResult {
  const phases = input.phases ?? [...JOURNEY_PHASES];
  const journeyId = `journey-${input.learnerId}-${Date.now()}`;

  // Build phase results
  const phaseResults: JourneyPhaseResult[] = [];
  let cumulativeScore = 0;
  let totalSessions = 0;
  let totalTurns = 0;
  let totalCorrections = 0;
  let totalSelfCorrections = 0;
  let totalWeaknessesTagged = 0;
  let totalWeaknessesResolved = 0;

  const capabilityCoverage: Record<TeacherCapability, number> = {
    diagnose: 0,
    teach: 0,
    remember: 0,
    adapt: 0,
    self_check: 0,
    prove: 0,
  };

  const timeline: JourneyEvidenceTimelineEntry[] = [];
  const allWeaknessTags: Map<string, JourneyWeaknessTagStatus> = new Map();
  const gainTrajectory: JourneyGainTrajectoryPoint[] = [];
  const allCriticalFindings: string[] = [];

  for (let i = 0; i < phases.length; i++) {
    const phaseId = phases[i];
    const ordinal = i + 1;
    const sessionData = input.phaseSessions?.[phaseId] ?? [];

    // Build phase result
    const phaseResult = buildPhaseResult(
      phaseId,
      ordinal,
      sessionData,
      input,
    );

    phaseResults.push(phaseResult);

    // Accumulate stats
    totalSessions += phaseResult.sessionCount;
    totalTurns += phaseResult.turnCount;
    totalWeaknessesTagged += phaseResult.weaknessTags.length;

    // Count corrections
    for (const session of sessionData) {
      totalCorrections += session.turns.filter(
        (t) => t.mode === "correction",
      ).length;
      totalSelfCorrections += session.correctionEvents?.filter(
        (e) => e.learnerAcknowledged === true && e.wasSurfaced,
      ).length ?? 0;
    }

    // Update capability coverage
    for (const cap of TEACHER_CAPABILITIES) {
      if (phaseResult.capabilities[cap].demonstrated) {
        capabilityCoverage[cap] += 1;
      }
    }

    // Track weaknesses
    for (const wt of phaseResult.weaknessTags) {
      const key = wt.category;
      const existing = allWeaknessTags.get(key);
      if (!existing) {
        allWeaknessTags.set(key, {
          tag: key,
          firstSeenPhase: phaseId,
          resolved: false,
          occurrenceCount: 1,
        });
      } else {
        existing.occurrenceCount += 1;
      }
    }

    // Update resolved weaknesses from phase result
    if (phaseResult.learningGain) {
      const resolvedCount = phaseResult.learningGain.improvingDimensions ?? 0;
      totalWeaknessesResolved += resolvedCount;
    }

    // Track critical findings
    if (phaseResult.safetyAudit?.findings) {
      for (const finding of phaseResult.safetyAudit.findings) {
        if (finding.severity === "critical") {
          allCriticalFindings.push(
            `[${phaseId}] ${finding.titleVi || finding.reasonCode}`,
          );
        }
      }
    }

    // Update cumulative score
    cumulativeScore = Math.round(
      phaseResults.reduce((sum, p) => sum + p.phaseScore, 0) / phaseResults.length,
    );

    // Timeline entry
    timeline.push({
      phaseId,
      phaseOrdinal: ordinal,
      capabilitiesShown: TEACHER_CAPABILITIES.filter(
        (c) => phaseResult.capabilities[c].demonstrated,
      ),
      capabilitiesMissing: TEACHER_CAPABILITIES.filter(
        (c) => !phaseResult.capabilities[c].demonstrated,
      ),
      cumulativeScore,
    });

    // Gain trajectory
    const lg = phaseResult.learningGain;
    gainTrajectory.push({
      phaseId,
      phaseOrdinal: ordinal,
      gainScore: learningGainToScore(lg),
      gainMeasurable: lg != null && lg.sufficientData && lg.improvingDimensions >= 2,
      gainReportable: lg != null && (lg.classification === "significant_gain" || lg.classification === "moderate_gain"),
    });
  }

  // Build progress
  const progress: JourneyProgress = buildJourneyProgress(
    input,
    totalSessions,
    totalTurns,
    totalCorrections,
    totalSelfCorrections,
    totalWeaknessesTagged,
    totalWeaknessesResolved,
    cumulativeScore,
  );

  // Build evidence packet
  const evidence: JourneyEvidencePacket = buildJourneyEvidencePacket(
    capabilityCoverage,
    timeline,
    allWeaknessTags,
    gainTrajectory,
    allCriticalFindings,
    phaseResults,
  );

  // Determine verdict
  const verdict = determineWalkthroughVerdict(
    phaseResults,
    capabilityCoverage,
    cumulativeScore,
  );

  // Build Vietnamese summary
  const walkthroughVi = buildWalkthroughVietnamese(
    input,
    phaseResults,
    progress,
    evidence,
    verdict,
  );

  // Build action items
  const actionItems = buildWalkthroughActionItems(
    phaseResults,
    capabilityCoverage,
    evidence,
    verdict,
  );

  return {
    journeyId,
    learnerId: input.learnerId,
    productId: input.productId,
    targetLanguage: input.targetLanguage,
    startTimestamp: input.startTimestamp,
    endTimestamp: determineEndTimestamp(phaseResults),
    startingCefrLevel: input.startingCefrLevel,
    targetCefrLevel: input.targetCefrLevel,
    phases: phaseResults,
    progress,
    evidence,
    verdict,
    overallScore: cumulativeScore,
    walkthroughVi,
    actionItems,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Build Phase Result
// ═══════════════════════════════════════════════════════════════════════════════

function buildPhaseResult(
  phaseId: JourneyPhaseId,
  ordinal: number,
  sessionData: JourneyPhaseSessionData[],
  input: JourneyWalkthroughInput,
): JourneyPhaseResult {
  const labels = PHASE_LABELS[phaseId];
  const sessionCount = sessionData.length;
  const turnCount = sessionData.reduce((sum, s) => sum + s.turns.length, 0);

  // Build capability evidence
  const capabilities = buildCapabilityEvidence(phaseId, sessionData, input);

  // Compute phase score
  const capabilityScores = Object.values(capabilities).map((c) => c.score);
  const phaseScore = Math.round(
    (capabilityScores.reduce((a, b) => a + b, 0) / (capabilityScores.length * 3)) * 100,
  );

  const phasePassed = phaseScore >= 50;

  // Collect weakness tags from sessions
  const weaknessTags = extractWeaknessTagsFromSessions(sessionData);

  // Build Vietnamese summary
  const summaryVi = buildPhaseSummaryVietnamese(
    phaseId,
    ordinal,
    capabilities,
    phaseScore,
    sessionCount,
    turnCount,
  );

  // Try to build learning gain from sessions
  const learningGain = aggregateSessionLearningGain(sessionData);

  // Try to get safety audit from last session
  const safetyAudit = sessionData.length > 0 ? null : null; // built from safetyHumilityFinalAudit when available

  return {
    phaseId,
    phaseOrdinal: ordinal,
    labelVi: labels.labelVi,
    labelEn: labels.labelEn,
    sessionCount,
    turnCount,
    capabilities,
    phaseScore,
    phasePassed,
    proofVerdict: null,
    failureScan: null,
    learningGain,
    safetyAudit,
    intelligenceDashboard: null,
    checklistResult: null,
    reviewPacket: null,
    weaknessTags,
    learnerHistoryProfile: null,
    summaryVi,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Build Capability Evidence
// ═══════════════════════════════════════════════════════════════════════════════

function buildCapabilityEvidence(
  phaseId: JourneyPhaseId,
  sessionData: JourneyPhaseSessionData[],
  input: JourneyWalkthroughInput,
): Record<TeacherCapability, CapabilityEvidence> {
  const hasSessions = sessionData.length > 0;
  const hasCorrections = sessionData.some(
    (s) => (s.correctionEvents?.length ?? 0) > 0 || s.turns.some((t) => t.mode === "correction"),
  );
  const hasConversations = sessionData.some(
    (s) => s.turns.some((t) => t.mode === "conversation"),
  );
  const hasAudits = sessionData.some(
    (s) => (s.auditResults?.length ?? 0) > 0 || (s.selfAuditResults?.length ?? 0) > 0,
  );
  const hasDecisions = sessionData.some(
    (s) => (s.teacherDecisions?.length ?? 0) > 0,
  );
  const hasLearningGain = sessionData.some(
    (s) => s.learningGainResult != null,
  );
  const hasRubricResults = sessionData.some(
    (s) => (s.rubricResults?.length ?? 0) > 0,
  );
  const hasContractChecks = sessionData.some(
    (s) => (s.contractChecks?.length ?? 0) > 0,
  );
  const hasEvaluations = sessionData.some(
    (s) => (s.evaluationResults?.length ?? 0) > 0,
  );

  // DIAGNOSE — shown when corrections or rubric results exist
  const diagnoseScore = computeDiagnoseScore(phaseId, hasSessions, hasCorrections, hasRubricResults, sessionData);
  const diagnose: CapabilityEvidence = {
    capability: "diagnose",
    demonstrated: diagnoseScore >= 1,
    descriptionVi: buildDiagnoseDescriptionVi(phaseId, diagnoseScore, hasCorrections),
    descriptionEn: buildDiagnoseDescriptionEn(phaseId, diagnoseScore, hasCorrections),
    score: diagnoseScore,
    sources: collectSources("diagnose", hasCorrections, hasRubricResults, false),
    hasFailure: diagnoseScore === 0,
    failureId: diagnoseScore === 0 ? `JW-DIAGNOSE-${phaseId}` : undefined,
  };

  // TEACH — shown when corrections and contract checks exist
  const teachScore = computeTeachScore(phaseId, hasSessions, hasCorrections, hasContractChecks, sessionData);
  const teach: CapabilityEvidence = {
    capability: "teach",
    demonstrated: teachScore >= 1,
    descriptionVi: buildTeachDescriptionVi(phaseId, teachScore, hasCorrections, hasConversations),
    descriptionEn: buildTeachDescriptionEn(phaseId, teachScore, hasCorrections, hasConversations),
    score: teachScore,
    sources: collectSources("teach", hasCorrections, false, hasConversations),
    hasFailure: teachScore === 0,
    failureId: teachScore === 0 ? `JW-TEACH-${phaseId}` : undefined,
  };

  // REMEMBER — shown when sessions have decisions or memory snapshots
  const rememberScore = computeRememberScore(phaseId, hasSessions, hasDecisions, sessionData);
  const remember: CapabilityEvidence = {
    capability: "remember",
    demonstrated: rememberScore >= 1,
    descriptionVi: buildRememberDescriptionVi(phaseId, rememberScore, hasDecisions),
    descriptionEn: buildRememberDescriptionEn(phaseId, rememberScore, hasDecisions),
    score: rememberScore,
    sources: collectSources("remember", false, false, false),
    hasFailure: rememberScore === 0 && phaseId !== "placement",
    failureId: rememberScore === 0 && phaseId !== "placement"
      ? `JW-REMEMBER-${phaseId}`
      : undefined,
  };

  // ADAPT — shown when evaluations exist (decisions adapting to learner)
  const adaptScore = computeAdaptScore(phaseId, hasSessions, hasEvaluations, sessionData);
  const adapt: CapabilityEvidence = {
    capability: "adapt",
    demonstrated: adaptScore >= 1,
    descriptionVi: buildAdaptDescriptionVi(phaseId, adaptScore, hasDecisions),
    descriptionEn: buildAdaptDescriptionEn(phaseId, adaptScore, hasDecisions),
    score: adaptScore,
    sources: collectSources("adapt", false, false, false),
    hasFailure: adaptScore === 0 && phaseId !== "placement" && phaseId !== "first_contact",
    failureId: adaptScore === 0 && phaseId !== "placement" && phaseId !== "first_contact"
      ? `JW-ADAPT-${phaseId}`
      : undefined,
  };

  // SELF_CHECK — shown when audits exist
  const selfCheckScore = computeSelfCheckScore(phaseId, hasSessions, hasAudits, sessionData);
  const selfCheck: CapabilityEvidence = {
    capability: "self_check",
    demonstrated: selfCheckScore >= 1,
    descriptionVi: buildSelfCheckDescriptionVi(phaseId, selfCheckScore, hasAudits),
    descriptionEn: buildSelfCheckDescriptionEn(phaseId, selfCheckScore, hasAudits),
    score: selfCheckScore,
    sources: collectSources("self_check", false, false, false),
    hasFailure: selfCheckScore === 0 && phaseId !== "placement",
    failureId: selfCheckScore === 0 && phaseId !== "placement"
      ? `JW-SELFCHECK-${phaseId}`
      : undefined,
  };

  // PROVE — shown when learning gain exists
  const proveScore = computeProveScore(phaseId, hasSessions, hasLearningGain, sessionData);
  const prove: CapabilityEvidence = {
    capability: "prove",
    demonstrated: proveScore >= 1,
    descriptionVi: buildProveDescriptionVi(phaseId, proveScore, hasLearningGain),
    descriptionEn: buildProveDescriptionEn(phaseId, proveScore, hasLearningGain),
    score: proveScore,
    sources: collectSources("prove", false, false, false),
    hasFailure: false,
  };

  return { diagnose, teach, remember, adapt, self_check: selfCheck, prove };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Capability Score Computation
// ═══════════════════════════════════════════════════════════════════════════════

function computeDiagnoseScore(
  phaseId: JourneyPhaseId,
  hasSessions: boolean,
  hasCorrections: boolean,
  hasRubricResults: boolean,
  sessionData: JourneyPhaseSessionData[],
): number {
  if (!hasSessions) return phaseId === "placement" ? 2 : 0;
  if (hasCorrections && hasRubricResults) return 3;
  if (hasCorrections) return 2;
  if (hasRubricResults) return 2;
  // For placement phase, even without sessions, we know CEFR baseline is set
  if (phaseId === "placement") return 1;
  return 0;
}

function computeTeachScore(
  phaseId: JourneyPhaseId,
  hasSessions: boolean,
  hasCorrections: boolean,
  hasContractChecks: boolean,
  sessionData: JourneyPhaseSessionData[],
): number {
  if (!hasSessions) return phaseId === "placement" ? 1 : 0;
  if (hasCorrections && hasContractChecks) return 3;
  if (hasCorrections) return 2;
  const hasConversationTurns = sessionData.some((s) =>
    s.turns.some((t) => t.mode === "conversation" && t.naturalReply),
  );
  if (hasConversationTurns) return 2;
  return 1;
}

function computeRememberScore(
  phaseId: JourneyPhaseId,
  hasSessions: boolean,
  hasDecisions: boolean,
  sessionData: JourneyPhaseSessionData[],
): number {
  if (!hasSessions) return 0;
  const hasMemorySnapshots = sessionData.some(
    (s) => (s.memorySnapshots?.length ?? 0) > 0,
  );
  if (hasDecisions && hasMemorySnapshots) return 3;
  if (hasDecisions || hasMemorySnapshots) return 2;
  return 1; // Sessions exist, some memory is implied
}

function computeAdaptScore(
  phaseId: JourneyPhaseId,
  hasSessions: boolean,
  hasEvaluations: boolean,
  sessionData: JourneyPhaseSessionData[],
): number {
  if (!hasSessions) return 0;
  if (hasEvaluations) return 3;
  const hasMultipleSessions = sessionData.length >= 2;
  if (hasMultipleSessions) return 2;
  return phaseId === "placement" ? 0 : 1;
}

function computeSelfCheckScore(
  phaseId: JourneyPhaseId,
  hasSessions: boolean,
  hasAudits: boolean,
  sessionData: JourneyPhaseSessionData[],
): number {
  if (!hasSessions) return phaseId === "placement" ? 1 : 0;
  if (hasAudits) return 3;
  const hasOverclaimResults = sessionData.some(
    (s) => (s.overclaimResults?.length ?? 0) > 0,
  );
  if (hasOverclaimResults) return 2;
  return 1;
}

function computeProveScore(
  phaseId: JourneyPhaseId,
  hasSessions: boolean,
  hasLearningGain: boolean,
  sessionData: JourneyPhaseSessionData[],
): number {
  if (!hasSessions) return 0;
  if (hasLearningGain) return 3;
  const hasCorrectionEvidence = sessionData.some(
    (s) => (s.correctionEvents?.length ?? 0) >= 4,
  );
  if (hasCorrectionEvidence) return 2;
  const hasEnoughTurns = sessionData.reduce((sum, s) => sum + s.turns.length, 0) >= 6;
  if (hasEnoughTurns) return 1;
  return 0;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Capability Description Builders (Vietnamese-first)
// ═══════════════════════════════════════════════════════════════════════════════

function buildDiagnoseDescriptionVi(
  phaseId: JourneyPhaseId,
  score: number,
  hasCorrections: boolean,
): string {
  if (score >= 3) return `Phát hiện và phân loại lỗi chính xác, áp dụng rubric đánh giá.`;
  if (score >= 2) return `Phát hiện lỗi người học và đưa ra sửa lỗi phù hợp.`;
  if (score >= 1) return phaseId === "placement"
    ? `Xác định trình độ CEFR ban đầu của người học.`
    : `Bắt đầu quan sát và ghi nhận lỗi cơ bản.`;
  return `Chưa có dữ liệu chẩn đoán lỗi.`;
}

function buildDiagnoseDescriptionEn(
  phaseId: JourneyPhaseId,
  score: number,
  hasCorrections: boolean,
): string {
  if (score >= 3) return `Accurately detects and classifies errors with rubric evaluation.`;
  if (score >= 2) return `Detects learner errors and provides appropriate corrections.`;
  if (score >= 1) return phaseId === "placement"
    ? `Establishes baseline CEFR level for the learner.`
    : `Begins observing and noting basic errors.`;
  return `No diagnostic data available.`;
}

function buildTeachDescriptionVi(
  phaseId: JourneyPhaseId,
  score: number,
  hasCorrections: boolean,
  hasConversations: boolean,
): string {
  if (score >= 3) return `Dạy hiệu quả qua sửa lỗi, hội thoại, và kiểm tra hợp đồng giảng dạy.`;
  if (score >= 2) return hasConversations
    ? `Dạy qua hội thoại tự nhiên với phản hồi phù hợp.`
    : `Dạy qua sửa lỗi chính xác và giải thích rõ ràng.`;
  if (score >= 1) return `Bắt đầu tương tác giảng dạy với người học.`;
  return `Chưa có hoạt động giảng dạy.`;
}

function buildTeachDescriptionEn(
  phaseId: JourneyPhaseId,
  score: number,
  hasCorrections: boolean,
  hasConversations: boolean,
): string {
  if (score >= 3) return `Teaches effectively through corrections, conversation, and contract checks.`;
  if (score >= 2) return hasConversations
    ? `Teaches through natural conversation with appropriate feedback.`
    : `Teaches through accurate corrections and clear explanations.`;
  if (score >= 1) return `Begins teaching interaction with the learner.`;
  return `No teaching activity yet.`;
}

function buildRememberDescriptionVi(
  phaseId: JourneyPhaseId,
  score: number,
  hasDecisions: boolean,
): string {
  if (score >= 3) return `Ghi nhớ đầy đủ điểm yếu, lịch sử, và quyết định của người học.`;
  if (score >= 2) return `Có ghi nhớ một số điểm yếu và lịch sử học tập.`;
  if (score >= 1) return `Bắt đầu lưu trữ thông tin phiên học.`;
  return `Chưa có dữ liệu ghi nhớ.`;
}

function buildRememberDescriptionEn(
  phaseId: JourneyPhaseId,
  score: number,
  hasDecisions: boolean,
): string {
  if (score >= 3) return `Fully remembers learner weaknesses, history, and decisions.`;
  if (score >= 2) return `Remembers some weaknesses and learning history.`;
  if (score >= 1) return `Begins storing session information.`;
  return `No memory data available.`;
}

function buildAdaptDescriptionVi(
  phaseId: JourneyPhaseId,
  score: number,
  hasDecisions: boolean,
): string {
  if (score >= 3) return `Thích ứng đầy đủ: điều chỉnh độ khó, nhịp độ, và nội dung theo người học.`;
  if (score >= 2) return `Có điều chỉnh một phần nội dung và cách dạy.`;
  if (score >= 1) return `Bắt đầu quan sát để thích ứng với người học.`;
  return `Chưa có bằng chứng thích ứng.`;
}

function buildAdaptDescriptionEn(
  phaseId: JourneyPhaseId,
  score: number,
  hasDecisions: boolean,
): string {
  if (score >= 3) return `Fully adapts: adjusts difficulty, pacing, and content to the learner.`;
  if (score >= 2) return `Partially adjusts content and teaching approach.`;
  if (score >= 1) return `Begins observing to adapt to the learner.`;
  return `No adaptation evidence yet.`;
}

function buildSelfCheckDescriptionVi(
  phaseId: JourneyPhaseId,
  score: number,
  hasAudits: boolean,
): string {
  if (score >= 3) return `Tự kiểm tra toàn diện: audit, overclaim guard, safety check.`;
  if (score >= 2) return `Có một số kiểm tra (overclaim guard hoặc audit).`;
  if (score >= 1) return `Có cơ chế tự kiểm tra cơ bản.`;
  return `Chưa có cơ chế tự kiểm tra.`;
}

function buildSelfCheckDescriptionEn(
  phaseId: JourneyPhaseId,
  score: number,
  hasAudits: boolean,
): string {
  if (score >= 3) return `Comprehensive self-check: audit, overclaim guard, safety check.`;
  if (score >= 2) return `Some checking (overclaim guard or audit).`;
  if (score >= 1) return `Basic self-check mechanisms in place.`;
  return `No self-check mechanisms yet.`;
}

function buildProveDescriptionVi(
  phaseId: JourneyPhaseId,
  score: number,
  hasLearningGain: boolean,
): string {
  if (score >= 3) return `Chứng minh được tiến bộ học tập với dữ liệu đo lường rõ ràng.`;
  if (score >= 2) return `Có bằng chứng ban đầu về sự tiến bộ.`;
  if (score >= 1) return `Có đủ dữ liệu để bắt đầu đo lường tiến bộ.`;
  return `Chưa đủ dữ liệu để chứng minh tiến bộ.`;
}

function buildProveDescriptionEn(
  phaseId: JourneyPhaseId,
  score: number,
  hasLearningGain: boolean,
): string {
  if (score >= 3) return `Proves learning improvement with clear measurement data.`;
  if (score >= 2) return `Initial evidence of improvement available.`;
  if (score >= 1) return `Sufficient data to begin measuring progress.`;
  return `Insufficient data to prove improvement.`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Source Collection
// ═══════════════════════════════════════════════════════════════════════════════

function collectSources(
  capability: TeacherCapability,
  hasCorrections: boolean,
  hasRubricResults: boolean,
  hasConversations: boolean,
): string[] {
  const sources: string[] = [];
  switch (capability) {
    case "diagnose":
      if (hasCorrections) sources.push("correctionEngine", "transcriptCorrectionCollector");
      if (hasRubricResults) sources.push("teacherMercyRubric");
      sources.push("weaknessMemoryTags");
      break;
    case "teach":
      if (hasCorrections) sources.push("correctionEngine", "teacherMercyContract");
      if (hasConversations) sources.push("conversationWarmth", "conversationTurnPolicy");
      sources.push("teacherDecisionEngine");
      break;
    case "remember":
      sources.push("weaknessMemoryTags", "learnerHistoryProfile", "chauReviewPacket");
      break;
    case "adapt":
      sources.push("teacherDecisionEngine", "teachingDecisionEvaluationGate");
      sources.push("hintLadderPolicy", "learnerReadinessPolicy", "lessonSequenceGenerator");
      break;
    case "self_check":
      sources.push("teacherMercySelfAuditGate", "overclaimGuard");
      sources.push("safetyHumilityFinalAudit", "teacherMercyAuditGate");
      break;
    case "prove":
      sources.push("learningGainRubric", "learningGainEvidencePacket");
      sources.push("realProductProofGate", "tutorFailureTaxonomy");
      break;
  }
  return sources;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Weakness Tag Extraction
// ═══════════════════════════════════════════════════════════════════════════════

function extractWeaknessTagsFromSessions(
  sessionData: JourneyPhaseSessionData[],
): WeaknessTag[] {
  const seen = new Set<string>();
  const now = Date.now();
  const tags: WeaknessTag[] = [];
  for (const session of sessionData) {
    for (const turn of session.turns) {
      if (turn.mode === "correction" && turn.correctedText && turn.userText) {
        // Generate tags based on what was corrected
        const category = deriveWeaknessCategoryFromCorrection(turn.userText, turn.correctedText);
        if (category && !seen.has(category)) {
          seen.add(category);
          tags.push({
            category,
            labelVi: deriveWeaknessLabelVi(category),
            labelEn: deriveWeaknessLabelEn(category),
            count: 1,
            firstSeenAt: now,
            lastSeenAt: now,
            exemplarPattern: `${turn.userText.trim()} → ${turn.correctedText.trim()}`,
          });
        }
      }
    }
  }
  return tags;
}

const WEAKNESS_LABELS_VI: Record<string, string> = {
  "tense-past": "Thiếu thì quá khứ",
  "missing-article": "Thiếu mạo từ",
  "subj-verb-agreement": "Sai hòa hợp chủ-vị",
  "preposition-calque": "Sai giới từ (dịch từ tiếng Việt)",
  "double-negation": "Phủ định kép",
  "word-order": "Sai trật tự từ",
  "zero-copula": "Thiếu động từ nối (copula)",
  "general-correction": "Lỗi chung",
};

const WEAKNESS_LABELS_EN: Record<string, string> = {
  "tense-past": "Past tense omission",
  "missing-article": "Missing article",
  "subj-verb-agreement": "Subject-verb agreement",
  "preposition-calque": "Preposition calque from Vietnamese",
  "double-negation": "Double negation",
  "word-order": "Word order error",
  "zero-copula": "Zero copula",
  "general-correction": "General correction",
};

function deriveWeaknessCategoryFromCorrection(
  userText: string,
  correctedText: string,
): string | null {
  const userLower = userText.toLowerCase().trim().replace(/[.!?]$/, "");
  const correctedLower = correctedText.toLowerCase().trim().replace(/[.!?]$/, "");

  if (userLower === correctedLower) return null;

  if (userLower.includes("go ") && correctedLower.includes("went ")) return "tense-past";
  if (/\b(a|an|the)\b/.test(correctedLower) && !/\b(a|an|the)\b/.test(userLower)) return "missing-article";
  if (/\bis\b/.test(correctedLower) && /\bare\b/.test(userLower)) return "subj-verb-agreement";
  if (/\bare\b/.test(correctedLower) && /\bis\b/.test(userLower)) return "subj-verb-agreement";
  if (/\bwas\b/.test(correctedLower) && /\bwere\b/.test(userLower)) return "subj-verb-agreement";
  if (/\bhas\b/.test(correctedLower) && /\bhave\b/.test(userLower)) return "subj-verb-agreement";
  if (/\bat\b.*\bmorning\b/.test(correctedLower) && /\bin\b.*\bmorning\b/.test(userLower)) return "preposition-calque";
  if (/\bno\b.*don['']?t\b/i.test(userLower) || /\bdon['']?t\b.*\bno\b/i.test(userLower)) return "double-negation";

  return "general-correction";
}

function deriveWeaknessLabelVi(category: string): string {
  return WEAKNESS_LABELS_VI[category] ?? `Lỗi: ${category}`;
}

function deriveWeaknessLabelEn(category: string): string {
  return WEAKNESS_LABELS_EN[category] ?? `Error: ${category}`;
}


// ═══════════════════════════════════════════════════════════════════════════════
// Learning Gain Aggregation
// ═══════════════════════════════════════════════════════════════════════════════

function aggregateSessionLearningGain(
  sessionData: JourneyPhaseSessionData[],
): LearningGainResult | null {
  const gainResults = sessionData
    .map((s) => s.learningGainResult)
    .filter((g): g is LearningGainResult => g != null);

  if (gainResults.length === 0) return null;

  // Use the best (last) gain result as the representative
  const bestGain = gainResults[gainResults.length - 1];
  return bestGain;
}

/**
 * Convert a LearningGainResult classification to a numeric score (0-100).
 */
function learningGainToScore(result: LearningGainResult | null): number {
  if (!result) return 0;
  switch (result.classification) {
    case "significant_gain": return 90;
    case "moderate_gain": return 70;
    case "minimal_gain": return 40;
    case "no_measurable_gain": return 10;
    default: return 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// Journey Progress Builder
// ═══════════════════════════════════════════════════════════════════════════════

function buildJourneyProgress(
  input: JourneyWalkthroughInput,
  totalSessions: number,
  totalTurns: number,
  totalCorrections: number,
  totalSelfCorrections: number,
  totalWeaknessesTagged: number,
  totalWeaknessesResolved: number,
  cumulativeScore: number,
): JourneyProgress {
  const progressVi = totalSessions === 0
    ? `Hành trình chưa bắt đầu. Người học ${input.learnerId} ở trình độ ${input.startingCefrLevel}, mục tiêu ${input.targetCefrLevel}.`
    : `Hành trình đã có ${totalSessions} buổi học, ${totalTurns} lượt tương tác, ${totalCorrections} lần sửa lỗi, ${totalSelfCorrections} lần tự sửa. Đã gắn thẻ ${totalWeaknessesTagged} điểm yếu, giải quyết ${totalWeaknessesResolved}/${totalWeaknessesTagged}. Điểm tích lũy: ${cumulativeScore}/100.`;

  return {
    cefrLevel: input.startingCefrLevel,
    targetCefrLevel: input.targetCefrLevel,
    totalSessions,
    totalTurns,
    totalCorrections,
    totalSelfCorrections,
    totalWeaknessesTagged,
    totalWeaknessesResolved,
    cumulativeGainScore: cumulativeScore,
    progressVi,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Evidence Packet Builder
// ═══════════════════════════════════════════════════════════════════════════════

function buildJourneyEvidencePacket(
  capabilityCoverage: Record<TeacherCapability, number>,
  timeline: JourneyEvidenceTimelineEntry[],
  allWeaknessTags: Map<string, JourneyWeaknessTagStatus>,
  gainTrajectory: JourneyGainTrajectoryPoint[],
  allCriticalFindings: string[],
  phaseResults: JourneyPhaseResult[],
): JourneyEvidencePacket {
  const totalPhases = phaseResults.length;

  // Build weakness tracking
  const weaknessTags = Array.from(allWeaknessTags.values());
  const totalIdentified = weaknessTags.length;
  const totalResolved = weaknessTags.filter((t) => t.resolved).length;
  const resolutionRate = totalIdentified > 0 ? totalResolved / totalIdentified : 0;

  const weaknessTracking: JourneyWeaknessTracking = {
    totalIdentified,
    totalResolved,
    resolutionRate,
    tags: weaknessTags,
    summaryVi: totalIdentified === 0
      ? `Chưa phát hiện điểm yếu nào.`
      : `Đã phát hiện ${totalIdentified} điểm yếu, giải quyết ${totalResolved}/${totalIdentified} (${Math.round(resolutionRate * 100)}%).`,
  };

  // Build safety summary
  const safetySummary: JourneySafetySummary = {
    totalAudits: phaseResults.filter((p) => p.safetyAudit != null).length,
    cleanAudits: phaseResults.filter(
      (p) => p.safetyAudit != null && p.safetyAudit.verdict === "PASS",
    ).length,
    blockedAudits: phaseResults.filter(
      (p) => p.safetyAudit != null && p.safetyAudit.verdict === "BLOCK",
    ).length,
    auditsWithFindings: phaseResults.filter(
      (p) => p.safetyAudit != null && (p.safetyAudit.findings?.length ?? 0) > 0,
    ).length,
    criticalFindings: allCriticalFindings,
    summaryVi: allCriticalFindings.length === 0
      ? `Không có phát hiện an toàn nghiêm trọng nào trong toàn bộ hành trình.`
      : `${allCriticalFindings.length} phát hiện an toàn nghiêm trọng: ${allCriticalFindings.slice(0, 3).join("; ")}...`,
  };

  // Build evidence summary
  const allCapabilitiesShown = TEACHER_CAPABILITIES.filter(
    (c) => capabilityCoverage[c] >= totalPhases * 0.5,
  );

  const evidenceSummaryVi = allCapabilitiesShown.length === 6
    ? `Tất cả 6 năng lực giáo viên đã được chứng minh trong hành trình.`
    : `Đã chứng minh ${allCapabilitiesShown.length}/6 năng lực giáo viên. Thiếu: ${TEACHER_CAPABILITIES.filter((c) => !allCapabilitiesShown.includes(c)).map((c) => CAPABILITY_LABELS[c].labelVi).join(", ")}.`;

  return {
    capabilityCoverage,
    totalEvidenceItems: timeline.reduce(
      (sum, t) => sum + t.capabilitiesShown.length,
      0,
    ),
    timeline,
    weaknessTracking,
    gainTrajectory,
    safetySummary,
    evidenceSummaryVi,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Verdict Determination
// ═══════════════════════════════════════════════════════════════════════════════

function determineWalkthroughVerdict(
  phaseResults: JourneyPhaseResult[],
  capabilityCoverage: Record<TeacherCapability, number>,
  overallScore: number,
): JourneyWalkthroughVerdict {
  const totalPhases = phaseResults.length;

  // Check critical failures
  const hasCriticalFailure = phaseResults.some(
    (p) => (p.failureScan?.bySeverity?.critical?.length ?? 0) > 0,
  );

  if (hasCriticalFailure) return "JOURNEY_FAILED";

  // Count capabilities that meet thresholds
  const capabilitiesMet = TEACHER_CAPABILITIES.filter((cap) => {
    const threshold = CAPABILITY_PHASE_THRESHOLDS[cap];
    return capabilityCoverage[cap] >= threshold.pass;
  }).length;

  // Count phases that passed
  const phasesPassed = phaseResults.filter((p) => p.phasePassed).length;

  if (overallScore >= VERDICT_THRESHOLDS.JOURNEY_PROVEN && capabilitiesMet >= 6) {
    return "JOURNEY_PROVEN";
  }
  if (overallScore >= VERDICT_THRESHOLDS.JOURNEY_ADEQUATE && capabilitiesMet >= 4) {
    return "JOURNEY_ADEQUATE";
  }
  if (overallScore >= VERDICT_THRESHOLDS.JOURNEY_INCOMPLETE) {
    return "JOURNEY_INCOMPLETE";
  }
  return "JOURNEY_FAILED";
}

// ═══════════════════════════════════════════════════════════════════════════════
// Vietnamese Walkthrough Summary Builder
// ═══════════════════════════════════════════════════════════════════════════════

function buildWalkthroughVietnamese(
  input: JourneyWalkthroughInput,
  phaseResults: JourneyPhaseResult[],
  progress: JourneyProgress,
  evidence: JourneyEvidencePacket,
  verdict: JourneyWalkthroughVerdict,
): string {
  const verdictLabel: Record<JourneyWalkthroughVerdict, string> = {
    JOURNEY_PROVEN: "ĐÃ CHỨNG MINH",
    JOURNEY_ADEQUATE: "ĐẠT YÊU CẦU",
    JOURNEY_INCOMPLETE: "CHƯA HOÀN THIỆN",
    JOURNEY_FAILED: "THẤT BẠI",
  };

  const lines: string[] = [
    `=== HÀNH TRÌNH HỌC TẬP CỦA ${input.learnerId} ===`,
    ``,
    `Sản phẩm: ${input.productId}`,
    `Ngôn ngữ: ${input.targetLanguage}`,
    `Trình độ: ${input.startingCefrLevel} → ${input.targetCefrLevel}`,
    `Kết quả: ${verdictLabel[verdict]}`,
    `Điểm tổng: ${progress.cumulativeGainScore}/100`,
    ``,
    `--- TIẾN ĐỘ ---`,
    `${progress.progressVi}`,
    ``,
    `--- BẰNG CHỨNG THEO GIAI ĐOẠN ---`,
  ];

  for (const phase of phaseResults) {
    const status = phase.phasePassed ? "✓" : "✗";
    lines.push(
      `${status} Giai đoạn ${phase.phaseOrdinal}: ${phase.labelVi} (${phase.phaseScore}/100)`,
    );
    lines.push(`   ${phase.summaryVi}`);

    for (const cap of TEACHER_CAPABILITIES) {
      const ce = phase.capabilities[cap];
      const capLabel = CAPABILITY_LABELS[cap].labelVi;
      const icon = ce.demonstrated ? "✓" : ce.hasFailure ? "✗" : "—";
      lines.push(`   ${icon} ${capLabel}: ${ce.descriptionVi}`);
    }
    lines.push("");
  }

  lines.push(`--- BẰNG CHỨNG TỔNG HỢP ---`);
  lines.push(evidence.evidenceSummaryVi);
  lines.push(`Theo dõi điểm yếu: ${evidence.weaknessTracking.summaryVi}`);
  lines.push(`An toàn: ${evidence.safetySummary.summaryVi}`);

  const trajectorySummary = evidence.gainTrajectory
    .filter((p) => p.gainReportable)
    .map((p) => `GĐ${p.phaseOrdinal}: ${p.gainScore}/100`)
    .join(" → ");
  if (trajectorySummary) {
    lines.push(`Quỹ đạo tiến bộ: ${trajectorySummary}`);
  }

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════════════════════════
// Phase Summary Builder (Vietnamese)
// ═══════════════════════════════════════════════════════════════════════════════

function buildPhaseSummaryVietnamese(
  phaseId: JourneyPhaseId,
  ordinal: number,
  capabilities: Record<TeacherCapability, CapabilityEvidence>,
  phaseScore: number,
  sessionCount: number,
  turnCount: number,
): string {
  const demonstrated = TEACHER_CAPABILITIES.filter(
    (c) => capabilities[c].demonstrated,
  );
  const missing = TEACHER_CAPABILITIES.filter(
    (c) => !capabilities[c].demonstrated && capabilities[c].hasFailure,
  );

  let summary = `Giai đoạn ${ordinal} (${PHASE_LABELS[phaseId].labelVi}): `;
  summary += `${sessionCount} buổi, ${turnCount} lượt. `;
  summary += `Điểm ${phaseScore}/100. `;

  if (demonstrated.length > 0) {
    summary += `Đã thể hiện: ${demonstrated.map((c) => CAPABILITY_LABELS[c].labelVi).join(", ")}. `;
  }

  if (missing.length > 0) {
    summary += `Cần cải thiện: ${missing.map((c) => CAPABILITY_LABELS[c].labelVi).join(", ")}.`;
  }

  if (phaseScore >= 80) summary += ` Đạt xuất sắc.`;
  else if (phaseScore >= 60) summary += ` Đạt yêu cầu.`;
  else if (phaseScore >= 40) summary += ` Cần cải thiện.`;
  else summary += ` Chưa đạt.`;

  return summary;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Walkthrough Action Items Builder
// ═══════════════════════════════════════════════════════════════════════════════

function buildWalkthroughActionItems(
  phaseResults: JourneyPhaseResult[],
  capabilityCoverage: Record<TeacherCapability, number>,
  evidence: JourneyEvidencePacket,
  verdict: JourneyWalkthroughVerdict,
): string[] {
  const items: string[] = [];

  // Check overall verdict
  if (verdict === "JOURNEY_FAILED" || verdict === "JOURNEY_INCOMPLETE") {
    items.push("[KHẨN] Hành trình chưa đạt yêu cầu. Xem lại các giai đoạn bị trượt.");
  }

  // Check failed phases
  for (const phase of phaseResults) {
    if (!phase.phasePassed) {
      items.push(`[CẦN XEM] Giai đoạn ${phase.phaseOrdinal} (${phase.labelVi}) không đạt. Điểm: ${phase.phaseScore}/100.`);
    }
  }

  // Check capability gaps
  for (const cap of TEACHER_CAPABILITIES) {
    const threshold = CAPABILITY_PHASE_THRESHOLDS[cap];
    if (capabilityCoverage[cap] < threshold.pass) {
      items.push(
        `[CẦN XEM] Năng lực "${CAPABILITY_LABELS[cap].labelVi}" chưa đủ pha chứng minh (${capabilityCoverage[cap]}/${threshold.pass}).`,
      );
    }
  }

  // Check safety
  if (evidence.safetySummary.criticalFindings.length > 0) {
    items.push(
      `[KHẨN] ${evidence.safetySummary.criticalFindings.length} phát hiện an toàn nghiêm trọng. Kiểm tra ngay.`,
    );
  }

  // Check weakness resolution
  if (evidence.weaknessTracking.totalIdentified > 0 && evidence.weaknessTracking.resolutionRate < 0.5) {
    items.push(
      `[CẦN XEM] Tỉ lệ giải quyết điểm yếu thấp (${Math.round(evidence.weaknessTracking.resolutionRate * 100)}%). Cần theo dõi sát hơn.`,
    );
  }

  // No failures — all good
  if (items.length === 0 && verdict === "JOURNEY_PROVEN") {
    items.push("[OK] Hành trình đã được chứng minh đầy đủ. Có thể triển khai.");
  }

  return items;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Helper: Determine End Timestamp
// ═══════════════════════════════════════════════════════════════════════════════

function determineEndTimestamp(
  phaseResults: JourneyPhaseResult[],
): string {
  return new Date().toISOString();
}

// ═══════════════════════════════════════════════════════════════════════════════
// Public API: Walk a Single Phase
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Walk through a single journey phase and return the phase result.
 * Useful for incremental walkthrough building.
 */
export function walkJourneyPhase(
  phaseId: JourneyPhaseId,
  ordinal: number,
  sessionData: JourneyPhaseSessionData[],
  input: JourneyWalkthroughInput,
): JourneyPhaseResult {
  return buildPhaseResult(phaseId, ordinal, sessionData, input);
}

// ═══════════════════════════════════════════════════════════════════════════════
// Public API: Collect Journey Evidence
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Collect and aggregate evidence from a walkthrough result.
 */
export function collectJourneyEvidence(
  walkthrough: JourneyWalkthroughResult,
): JourneyEvidencePacket {
  return walkthrough.evidence;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Public API: Generate Vietnamese Walkthrough Summary
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate a Vietnamese-language summary of the full journey walkthrough.
 */
export function generateJourneyWalkthroughVi(
  walkthrough: JourneyWalkthroughResult,
): string {
  return walkthrough.walkthroughVi;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Public API: Get Walkthrough Action Items
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get prioritized Chau action items from the walkthrough.
 */
export function getJourneyWalkthroughActionItems(
  walkthrough: JourneyWalkthroughResult,
): string[] {
  return walkthrough.actionItems;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Public API: Validate Journey Walkthrough
// ═══════════════════════════════════════════════════════════════════════════════

/** Validation result for a journey walkthrough */
export interface JourneyWalkthroughValidation {
  /** Is the walkthrough valid? */
  valid: boolean;
  /** Number of phases present */
  phaseCount: number;
  /** Required phases that are missing */
  missingPhases: JourneyPhaseId[];
  /** Whether all 6 capabilities are covered somewhere */
  allCapabilitiesCovered: boolean;
  /** Capabilities not covered */
  missingCapabilities: TeacherCapability[];
  /** Vietnamese validation summary */
  summaryVi: string;
}

/**
 * Validate that a journey walkthrough is complete and correct.
 */
export function validateJourneyWalkthrough(
  walkthrough: JourneyWalkthroughResult,
): JourneyWalkthroughValidation {
  const presentPhases = new Set(walkthrough.phases.map((p) => p.phaseId));
  const missingPhases = JOURNEY_PHASES.filter((p) => !presentPhases.has(p));

  const capabilityPresence = new Map<TeacherCapability, boolean>();
  for (const cap of TEACHER_CAPABILITIES) {
    capabilityPresence.set(cap, false);
  }
  for (const phase of walkthrough.phases) {
    for (const cap of TEACHER_CAPABILITIES) {
      if (phase.capabilities[cap].demonstrated) {
        capabilityPresence.set(cap, true);
      }
    }
  }

  const missingCapabilities = TEACHER_CAPABILITIES.filter(
    (c) => !capabilityPresence.get(c),
  );

  const valid = missingPhases.length === 0 && missingCapabilities.length === 0;

  const summaryVi = valid
    ? `Hành trình hợp lệ: đủ ${walkthrough.phases.length} giai đoạn, tất cả 6 năng lực được chứng minh.`
    : `Hành trình chưa hợp lệ. Thiếu ${missingPhases.length} giai đoạn: ${missingPhases.map((p) => PHASE_LABELS[p].labelVi).join(", ") || "không"}. Thiếu ${missingCapabilities.length} năng lực: ${missingCapabilities.map((c) => CAPABILITY_LABELS[c].labelVi).join(", ") || "không"}.`;

  return {
    valid,
    phaseCount: walkthrough.phases.length,
    missingPhases,
    allCapabilitiesCovered: missingCapabilities.length === 0,
    missingCapabilities,
    summaryVi,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Public API: Compare Two Journey Walkthroughs
// ═══════════════════════════════════════════════════════════════════════════════

/** Comparison of two journey walkthroughs */
export interface JourneyWalkthroughComparison {
  /** The two walkthrough IDs */
  previousId: string;
  currentId: string;
  /** Score delta (current - previous) */
  scoreDelta: number;
  /** Phases that improved */
  improvedPhases: JourneyPhaseId[];
  /** Phases that regressed */
  regressedPhases: JourneyPhaseId[];
  /** Capabilities that improved */
  improvedCapabilities: TeacherCapability[];
  /** Capabilities that regressed */
  regressedCapabilities: TeacherCapability[];
  /** Overall trend */
  trend: "improving" | "stable" | "declining";
  /** Vietnamese comparison summary */
  comparisonVi: string;
}

/**
 * Compare two journey walkthroughs to detect trends.
 */
export function compareJourneyWalkthroughs(
  previous: JourneyWalkthroughResult,
  current: JourneyWalkthroughResult,
): JourneyWalkthroughComparison {
  const scoreDelta = current.overallScore - previous.overallScore;

  const improvedPhases: JourneyPhaseId[] = [];
  const regressedPhases: JourneyPhaseId[] = [];

  const prevPhaseMap = new Map(previous.phases.map((p) => [p.phaseId, p]));
  for (const currentPhase of current.phases) {
    const prevPhase = prevPhaseMap.get(currentPhase.phaseId);
    if (!prevPhase) continue;
    if (currentPhase.phaseScore > prevPhase.phaseScore + 5) {
      improvedPhases.push(currentPhase.phaseId);
    } else if (currentPhase.phaseScore < prevPhase.phaseScore - 5) {
      regressedPhases.push(currentPhase.phaseId);
    }
  }

  const improvedCapabilities: TeacherCapability[] = [];
  const regressedCapabilities: TeacherCapability[] = [];

  for (const cap of TEACHER_CAPABILITIES) {
    const prevTotal = previous.evidence.capabilityCoverage[cap];
    const currTotal = current.evidence.capabilityCoverage[cap];
    if (currTotal > prevTotal) improvedCapabilities.push(cap);
    else if (currTotal < prevTotal) regressedCapabilities.push(cap);
  }

  const trend =
    scoreDelta > 10 ? "improving" : scoreDelta < -10 ? "declining" : "stable";

  const comparisonVi =
    trend === "improving"
      ? `Hành trình đang tiến bộ (+${scoreDelta} điểm). Cải thiện ở ${improvedPhases.length} giai đoạn, ${improvedCapabilities.length} năng lực.`
      : trend === "declining"
        ? `Hành trình đang giảm sút (${scoreDelta} điểm). Tụt ở ${regressedPhases.length} giai đoạn. Cần can thiệp.`
        : `Hành trình ổn định (${scoreDelta >= 0 ? "+" : ""}${scoreDelta} điểm).`;

  return {
    previousId: previous.journeyId,
    currentId: current.journeyId,
    scoreDelta,
    improvedPhases,
    regressedPhases,
    improvedCapabilities,
    regressedCapabilities,
    trend,
    comparisonVi,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Public API: Convenience Helpers
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Quick check: is this walkthrough proven complete?
 */
export function isJourneyProven(
  walkthrough: JourneyWalkthroughResult,
): boolean {
  return walkthrough.verdict === "JOURNEY_PROVEN";
}

/**
 * Quick check: is this walkthrough at least adequate?
 */
export function isJourneyAdequate(
  walkthrough: JourneyWalkthroughResult,
): boolean {
  return (
    walkthrough.verdict === "JOURNEY_PROVEN" ||
    walkthrough.verdict === "JOURNEY_ADEQUATE"
  );
}

/**
 * Get a compact one-line Vietnamese summary suitable for dashboards.
 */
export function getJourneyCompactVi(
  walkthrough: JourneyWalkthroughResult,
): string {
  const verdictMap: Record<JourneyWalkthroughVerdict, string> = {
    JOURNEY_PROVEN: "ĐẠT",
    JOURNEY_ADEQUATE: "ĐẠT (NHẸ)",
    JOURNEY_INCOMPLETE: "THIẾU",
    JOURNEY_FAILED: "TRƯỢT",
  };
  return `${walkthrough.learnerId} | ${verdictMap[walkthrough.verdict]} | ${walkthrough.overallScore}/100 | ${walkthrough.phases.length} GĐ`;
}

/**
 * Get the capability coverage ratio for a specific capability.
 */
export function getCapabilityCoverageRatio(
  walkthrough: JourneyWalkthroughResult,
  capability: TeacherCapability,
): number {
  const totalPhases = walkthrough.phases.length;
  if (totalPhases === 0) return 0;
  return walkthrough.evidence.capabilityCoverage[capability] / totalPhases;
}

/**
 * Create a minimal journey walkthrough input for testing.
 */
export function createMinimalJourneyInput(
  overrides?: Partial<JourneyWalkthroughInput>,
): JourneyWalkthroughInput {
  return {
    learnerId: "learner-test-001",
    startingCefrLevel: "A1",
    targetCefrLevel: "B1",
    productId: "aiTutor",
    targetLanguage: "en",
    explainLanguage: "vi",
    startTimestamp: new Date().toISOString(),
    ...overrides,
  };
}
