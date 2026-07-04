import type { TeacherContext, TeacherContextLearningSignal } from "../runtime";
import { buildTeacherContext } from "../runtime";
import type { ObservationPacket } from "../obs";
import type { RuntimeEvidenceBundle } from "../runtimeReadiness";
import { validateTeacherContext, type TeacherContextValidationResult } from "../runtimeReadiness";
import type { DpEvidenceBasedDecision } from "./decisionContract";
import { dpTeacherContextReferenceFrom } from "./decisionContract";
import { validateDpDecision, type DpDecisionValidationResult } from "./dpValidator";

export type DpEvidenceIntakeValidationResult = {
  pass: boolean;
  teacherContextValidation: TeacherContextValidationResult;
  dpDecisionValidation: DpDecisionValidationResult;
};

export function validateDpEvidenceIntake(
  decision: DpEvidenceBasedDecision,
  teacherContext: TeacherContext,
  evidenceBundle: RuntimeEvidenceBundle,
): DpEvidenceIntakeValidationResult {
  const teacherContextValidation = validateTeacherContext(evidenceBundle);
  const dpDecisionValidation = validateDpDecision(decision, teacherContext);

  return {
    pass: teacherContextValidation.pass && dpDecisionValidation.pass,
    teacherContextValidation,
    dpDecisionValidation,
  };
}

export function buildDpTeacherContextFromObservationPacket(observationPacket: ObservationPacket): TeacherContext {
  return buildTeacherContext(observationPacket);
}

export function learningSignalsForDpEvidence(teacherContext: TeacherContext): readonly TeacherContextLearningSignal[] {
  return teacherContext.learningSignals.map((signal) => ({
    ...signal,
    alternatives: [...signal.alternatives],
  }));
}

export function observationPacketForDpEvidence(evidenceBundle: RuntimeEvidenceBundle): ObservationPacket {
  return evidenceBundle.obsPacket;
}

export function createDpDecisionFromRuntimeEvidenceBundle(
  evidenceBundle: RuntimeEvidenceBundle,
): DpEvidenceBasedDecision {
  const productIssueTypes = evidenceBundle.teacherContext.productIssues.map((issue) => issue.issue);
  const citedLearningSignalIds = evidenceBundle.teacherContext.learningSignals.map((signal) => signal.signal_key);

  return {
    schemaVersion: "tm-int-dp-decision-contract-v1",
    decisionId: `dp-from-${evidenceBundle.runtimeEvent.eventId}`,
    sourceTeacherContextRef: dpTeacherContextReferenceFrom(evidenceBundle.teacherContext),
    citedObservationIds: [evidenceBundle.teacherContext.observationSummary.packetId],
    citedLearningSignalIds,
    productIssueHandling: {
      productIssuePresent: productIssueTypes.length > 0,
      issueTypes: productIssueTypes,
      handledAsProductIssue: productIssueTypes.length > 0,
      classifiedAsLearnerWeakness: false,
      rationale: productIssueTypes.length > 0
        ? "Teacher Context product issue evidence is handled as product evidence."
        : "Teacher Context has no product issue evidence.",
    },
    learnerPerformanceClaims: [],
    confidenceLevel: evidenceBundle.teacherContext.confidenceSummary.high > 0 ? "high" : "medium",
    recommendation: {
      action: evidenceBundle.teacherContext.recommendations[0]?.action ?? "continue_without_dp_action",
      rationale: "Teacher Context evidence supplies the recommendation rationale for DP intake.",
    },
    pedAllowedToAct: evidenceBundle.teacherContext.recommendations.length > 0,
    explanation: "DP decision was created from runtime evidence bundle Teacher Context and keeps product evidence separate.",
  };
}
