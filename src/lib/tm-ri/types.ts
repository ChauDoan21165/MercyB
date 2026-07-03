export type TmRiRuntimeEventType =
  | "audio_unavailable"
  | "mic_unavailable"
  | "internal_text_visible"
  | "media_loaded"
  | "media_play_failed"
  | "assessment_scored"
  | "assessment_result_shown"
  | "fallback_input_used";

export type TmRiModality = "listening" | "speaking" | "reading" | "writing" | "mixed";
export type TmRiSeverity = "info" | "low" | "medium" | "high" | "critical";
export type TmRiEducationalSeverity = "none" | "minor" | "moderate" | "serious" | "critical";
export type TmRiVisibilityScope =
  | "learner_visible"
  | "admin_visible"
  | "dev_only"
  | "test_only"
  | "type_only"
  | "comment_only"
  | "unreachable_unknown";
export type TmRiReachabilitySurface =
  | "runtime_ui"
  | "crash_screen"
  | "admin_panel"
  | "test_fixture"
  | "type_definition"
  | "source_comment"
  | "unknown";

export type TmRiFindingCode =
  | "audio_unavailable"
  | "mic_unavailable"
  | "internal_text_visible"
  | "unplayable_media"
  | "degraded_evidence"
  | "invalid_scoring_risk"
  | "confidence_overclaim_risk"
  | "guessing_to_escape"
  | "shame_risk"
  | "frustration"
  | "self_blame"
  | "loss_of_trust"
  | "speaking_modality_degraded"
  | "product_trust_risk";

export type TmRiLearnerStage = "confident" | "confused" | "retrying" | "guessing" | "trust_lost" | "recovered";

export type TmRiHonestyRecommendation =
  | "show_result"
  | "lower_confidence"
  | "explain_degraded"
  | "retry_required"
  | "withhold_cefr";

export interface TmRiRuntimeEvent {
  readonly id: string;
  readonly type: TmRiRuntimeEventType;
  readonly timestampMs: number;
  readonly modality?: TmRiModality;
  readonly assessmentSkill?: TmRiModality;
  readonly playable?: boolean;
  readonly durationSeconds?: number;
  readonly inputMode?: "audio" | "text" | "none";
  readonly scoreShown?: boolean;
  readonly confidence?: number;
  readonly userFacingText?: string;
  readonly internalText?: string;
  readonly detail?: string;
}

export interface TmRiLearnerSignal {
  readonly id: string;
  readonly timestampMs: number;
  readonly text?: string;
  readonly action?: "start" | "retry" | "skip" | "guess" | "complete" | "complaint" | "recovery";
  readonly modality?: TmRiModality;
  readonly confidence?: number;
  readonly attempts?: number;
  readonly usedInputMode?: "audio" | "text" | "none";
}

export interface TmRiFinding {
  readonly code: TmRiFindingCode;
  readonly severity: TmRiSeverity;
  readonly educationalSeverity: TmRiEducationalSeverity;
  readonly modality?: TmRiModality;
  readonly title: string;
  readonly evidence: readonly string[];
  readonly impact: string;
  readonly confidence: number;
  readonly visibility?: TmRiVisibilityAssessment;
  readonly reachability?: TmRiReachabilityAssessment;
}

export interface TmRiVisibilityAssessment {
  readonly scope: TmRiVisibilityScope;
  readonly confidence: number;
  readonly reason: string;
}

export interface TmRiReachabilityAssessment {
  readonly surface: TmRiReachabilitySurface;
  readonly confidence: number;
  readonly reason: string;
}

export interface TmRiTimelinePoint {
  readonly timestampMs: number;
  readonly stage: TmRiLearnerStage;
  readonly confidence: number;
  readonly reason: string;
}

export interface TmRiReplayTimeline {
  readonly stages: readonly TmRiTimelinePoint[];
}

export interface TmRiTrustPoint {
  readonly timestampMs: number;
  readonly score: number;
  readonly reason: string;
}

export interface TmRiTrustCurve {
  readonly points: readonly TmRiTrustPoint[];
  readonly collapsePoint?: TmRiTrustPoint;
}

export interface TmRiEducationalFriction {
  readonly score: number;
  readonly reasons: readonly string[];
}

export interface TmRiAssessmentIntegrity {
  readonly degradedEvidence: boolean;
  readonly invalidScoringRisk: boolean;
  readonly confidenceOverclaimRisk: boolean;
  readonly speakingModalityDegraded: boolean;
  readonly listeningNotGradableAsWrong: boolean;
  readonly spokenEvidenceAvailable: boolean;
  readonly findings: readonly TmRiFinding[];
}

export interface TmRiEducationalHonestyDecision {
  readonly recommendations: readonly TmRiHonestyRecommendation[];
  readonly resultConfidence: "normal" | "lowered" | "withheld";
  readonly inputModeRecommendation?: "audio" | "text" | "retry";
}

export interface TmRiPsychologyProfile {
  readonly flags: readonly TmRiFindingCode[];
  readonly findings: readonly TmRiFinding[];
}

export interface TmRiObservationPacket {
  readonly summary: string;
  readonly learnerPsychology: readonly string[];
  readonly educationalImpact: readonly string[];
  readonly productTrust: {
    readonly score: number;
    readonly collapsed: boolean;
  };
  readonly recommendations: readonly TmRiHonestyRecommendation[];
  readonly findings: readonly Pick<TmRiFinding, "code" | "severity" | "educationalSeverity" | "title" | "impact">[];
}

export interface TmRiRepairPlanItem {
  readonly priority: 1 | 2 | 3 | 4 | 5;
  readonly risk: TmRiSeverity;
  readonly title: string;
  readonly testsNeeded: readonly string[];
  readonly suggestedFiles: readonly string[];
}

export interface TmRiRepairPlan {
  readonly items: readonly TmRiRepairPlanItem[];
}

export interface TmRiKnowledgeNode {
  readonly id: string;
  readonly kind: "observation" | "emotion" | "trust" | "pedagogy" | "repair";
  readonly label: string;
}

export interface TmRiKnowledgeEdge {
  readonly from: string;
  readonly to: string;
  readonly relation: "causes" | "reduces" | "requires" | "informs";
}

export interface TmRiObservationKnowledgeGraphSnapshot {
  readonly nodes: readonly TmRiKnowledgeNode[];
  readonly edges: readonly TmRiKnowledgeEdge[];
}

export interface TmRiReplayAnalysis {
  readonly runtimeFindings: readonly TmRiFinding[];
  readonly learnerTimeline: TmRiReplayTimeline;
  readonly friction: TmRiEducationalFriction;
  readonly assessmentIntegrity: TmRiAssessmentIntegrity;
  readonly honesty: TmRiEducationalHonestyDecision;
  readonly psychology: TmRiPsychologyProfile;
  readonly trust: TmRiTrustCurve;
  readonly observationPacket: TmRiObservationPacket;
  readonly repairPlan: TmRiRepairPlan;
  readonly knowledgeGraph: TmRiObservationKnowledgeGraphSnapshot;
}
