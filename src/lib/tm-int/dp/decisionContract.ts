import type { TeacherContext } from "../runtime";

export type DpDecisionConfidenceLevel = "low" | "medium" | "high";
export type DpProductIssueType = TeacherContext["productIssues"][number]["issue"];

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
  claimType: "learner_weakness" | "learner_strength" | "learning_behavior" | "assessment_validity";
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
