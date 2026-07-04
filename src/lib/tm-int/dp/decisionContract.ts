import type { TeacherContext } from "../runtime";

export type DpDecisionConfidenceLevel = "low" | "medium" | "high";
export const DP_DECISION_CONFIDENCE_LEVELS = ["low", "medium", "high"] as const satisfies readonly DpDecisionConfidenceLevel[];
export type DpProductIssueType = TeacherContext["productIssues"][number]["issue"];
export type DpLearnerPerformanceClaimType =
  | "learner_weakness"
  | "learner_strength"
  | "learning_behavior"
  | "assessment_validity";

export type DpTeacherContextReference = {
  schemaVersion: TeacherContext["schemaVersion"];
  observationPacketId: string;
};

export type DpProductIssueHandling = {
  productIssuePresent: boolean;
  issueTypes: readonly DpProductIssueType[];
  handledAsProductIssue: boolean;
  classifiedAsLearnerWeakness: boolean;
  rationale: string;
};

export type DpLearnerPerformanceClaim = {
  claimId: string;
  claimType: DpLearnerPerformanceClaimType;
  statement: string;
  citedObservationIds: readonly string[];
  citedLearningSignalIds: readonly string[];
  rationale: string;
  supported: boolean;
};

export type DpRecommendation = {
  action: string;
  rationale: string;
};

export type DpEvidenceBasedDecision = {
  schemaVersion: "tm-int-dp-decision-contract-v1";
  decisionId: string;
  sourceTeacherContextRef?: DpTeacherContextReference;
  citedObservationIds: readonly string[];
  citedLearningSignalIds: readonly string[];
  productIssueHandling: DpProductIssueHandling;
  learnerPerformanceClaims: readonly DpLearnerPerformanceClaim[];
  confidenceLevel: DpDecisionConfidenceLevel;
  recommendation: DpRecommendation;
  pedAllowedToAct: boolean;
  explanation: string;
};

export function dpTeacherContextReferenceFrom(context: TeacherContext): DpTeacherContextReference {
  return {
    schemaVersion: context.schemaVersion,
    observationPacketId: context.observationSummary.packetId,
  };
}

export function isDpDecisionConfidenceLevel(value: string): value is DpDecisionConfidenceLevel {
  return DP_DECISION_CONFIDENCE_LEVELS.includes(value as DpDecisionConfidenceLevel);
}

export function dpAllowsPedAction(decision: DpEvidenceBasedDecision): boolean {
  return (
    decision.pedAllowedToAct &&
    decision.recommendation.action.trim().length > 0 &&
    decision.recommendation.rationale.trim().length > 0
  );
}

export function dpRecommendationHasEvidenceRationale(decision: DpEvidenceBasedDecision): boolean {
  const rationale = decision.recommendation.rationale.trim();
  if (!rationale) return false;
  if (decision.citedObservationIds.length === 0 && decision.citedLearningSignalIds.length === 0) return false;
  return /teacher context|observation|learning signal|evidence|product issue|validity|retest|fallback|follow-up/i.test(rationale);
}
