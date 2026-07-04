import { describe, expect, test } from "vitest";
import { buildTeacherContext, type TeacherContext } from "../../runtime";
import { createValidRuntimeEvidenceBundle } from "../../runtimeReadiness";
import {
  dpTeacherContextReferenceFrom,
  type DpEvidenceBasedDecision,
} from "../decisionContract";
import { validateDpEvidenceIntake } from "../evidenceIntake";
import {
  buildDpTeacherContextFromObservationPacket,
  createDpDecisionFromRuntimeEvidenceBundle,
  learningSignalsForDpEvidence,
  observationPacketForDpEvidence,
} from "../evidenceIntake";

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
  test("builds Teacher Context from the runtime context builder", () => {
    const bundle = createValidRuntimeEvidenceBundle();

    expect(buildDpTeacherContextFromObservationPacket(bundle.obsPacket)).toEqual(buildTeacherContext(bundle.obsPacket));
  });

  test("preserves runtime learning signals for DP evidence without mutation", () => {
    const bundle = createValidRuntimeEvidenceBundle();
    const teacherContext = {
      ...bundle.teacherContext,
      learningSignals: [
        {
          signal_key: "productive_hesitation",
          source_edu_id: "EDU-LS-000001",
          confidence: "medium",
          evidenceCount: 1,
          alternatives: ["question_too_easy"],
        } as const,
      ],
    };

    const signals = learningSignalsForDpEvidence(teacherContext);

    expect(signals).toEqual(teacherContext.learningSignals);
    expect(signals).not.toBe(teacherContext.learningSignals);
    expect(signals[0]?.alternatives).not.toBe(teacherContext.learningSignals[0]?.alternatives);
  });

  test("uses the runtime bundle ObservationPacket as DP source evidence", () => {
    const bundle = createValidRuntimeEvidenceBundle();

    expect(observationPacketForDpEvidence(bundle)).toBe(bundle.obsPacket);
    expect(observationPacketForDpEvidence(bundle).packetId).toBe(bundle.teacherContext.observationSummary.packetId);
  });

  test("creates a valid DP decision from the runtime evidence fixture", () => {
    const bundle = createValidRuntimeEvidenceBundle();
    const decision = createDpDecisionFromRuntimeEvidenceBundle(bundle);
    const result = validateDpEvidenceIntake(decision, bundle.teacherContext, bundle);

    expect(decision.sourceTeacherContextRef).toEqual(dpTeacherContextReferenceFrom(bundle.teacherContext));
    expect(result.pass).toBe(true);
  });

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
