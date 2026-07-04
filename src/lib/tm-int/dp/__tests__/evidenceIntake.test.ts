import { describe, expect, test } from "vitest";
import type { TeacherContext } from "../../runtime";
import { createValidRuntimeEvidenceBundle } from "../../runtimeReadiness";
import {
  dpTeacherContextReferenceFrom,
  type DpEvidenceBasedDecision,
} from "../decisionContract";
import { validateDpEvidenceIntake } from "../evidenceIntake";

function decisionFor(context: TeacherContext): DpEvidenceBasedDecision {
  return {
    schemaVersion: "tm-int-dp-decision-contract-v1",
    decisionId: "dp-evidence-intake-001",
    sourceTeacherContextRef: dpTeacherContextReferenceFrom(context),
    citedObservationIds: [context.observationSummary.packetId],
    citedLearningSignalIds: [],
    productIssueHandling: {
      productIssuePresent: true,
      issueTypes: ["product_failure_audio"],
      handledAsProductIssue: true,
      classifiedAsLearnerWeakness: false,
      rationale: "Teacher Context product issue evidence invalidates listening validity.",
    },
    learnerPerformanceClaims: [],
    confidenceLevel: "high",
    recommendation: {
      action: "exclude_listening_score_and_offer_retest",
      rationale: "Teacher Context evidence cites an audio product issue requiring a retest.",
    },
    pedAllowedToAct: true,
    explanation: "DP records product issue evidence only.",
  };
}

describe("validateDpEvidenceIntake", () => {
  test("passes when Teacher Context and DP decision both validate", () => {
    const bundle = createValidRuntimeEvidenceBundle();
    const result = validateDpEvidenceIntake(decisionFor(bundle.teacherContext), bundle.teacherContext, bundle);

    expect(result.pass).toBe(true);
    expect(result.teacherContextValidation.pass).toBe(true);
    expect(result.dpDecisionValidation.pass).toBe(true);
  });

  test("fails before DP trust when Teacher Context validation fails", () => {
    const bundle = createValidRuntimeEvidenceBundle();
    const invalidBundle = {
      ...bundle,
      teacherContext: {
        ...bundle.teacherContext,
        pendingRetests: [],
      },
    };

    const result = validateDpEvidenceIntake(
      decisionFor(invalidBundle.teacherContext),
      invalidBundle.teacherContext,
      invalidBundle,
    );

    expect(result.pass).toBe(false);
    expect(result.teacherContextValidation.failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "missing_pending_retest" })]),
    );
  });
});
