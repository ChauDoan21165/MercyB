import { describe, expect, test } from "vitest";
import type { TeacherContext } from "../../runtime";
import type { DpEvidenceBasedDecision } from "../decisionContract";
import { validateDpDecision } from "../dpValidator";

function createTeacherContext(): TeacherContext {
  return {
    schemaVersion: "tm-int-teacher-context-v1",
    observationSummary: { packetId: "obs-packet-placement", factCount: 1, factTypes: ["AudioDurationZero"] },
    learningSignals: [
      {
        signal_key: "productive_hesitation",
        source_edu_id: "EDU-LS-000001",
        confidence: "medium",
        evidenceCount: 1,
        alternatives: ["question_too_easy"],
      },
    ],
    productIssues: [{ source: "TC-000001", issue: "product_failure_audio", affectedSkill: "listening", evidenceCount: 1 }],
    pendingRetests: [{ source: "TC-000001", skill: "listening", reason: "product_failure" }],
    recommendations: [
      {
        source: "TC-000001",
        reason: "product_failure_audio",
        action: "exclude_listening_score_and_offer_retest",
        confidence: "high",
        evidenceCount: 1,
      },
    ],
    confidenceSummary: { high: 1, medium: 1, low: 0 },
    replayTrace: [
      { stage: "OBS", source: "runtime", summary: "audio fact" },
      { stage: "DP", source: "TC-000001", summary: "product issue decision" },
    ],
  };
}

function createValidDecision(): DpEvidenceBasedDecision {
  return {
    schemaVersion: "tm-int-dp-decision-contract-v1",
    decisionId: "dp-decision-001",
    sourceTeacherContextRef: {
      schemaVersion: "tm-int-teacher-context-v1",
      observationPacketId: "obs-packet-placement",
    },
    citedObservationIds: ["obs-packet-placement"],
    citedLearningSignalIds: [],
    productIssueHandling: {
      productIssuePresent: true,
      issueTypes: ["product_failure_audio"],
      handledAsProductIssue: true,
      classifiedAsLearnerWeakness: false,
      rationale: "Audio evidence invalidates listening score without describing learner ability.",
    },
    learnerPerformanceClaims: [],
    confidenceLevel: "high",
    recommendation: {
      action: "exclude_listening_score_and_offer_retest",
      rationale: "Teacher Context cites an audio product issue affecting listening validity.",
    },
    pedAllowedToAct: true,
    explanation: "DP records product audio failure only and makes no ability claim.",
  };
}

describe("validateDpDecision", () => {
  test("PASS valid DP decision from Teacher Context", () => {
    expect(validateDpDecision(createValidDecision(), createTeacherContext()).pass).toBe(true);
  });

  test("FAIL missing Teacher Context reference", () => {
    const decision = createValidDecision();
    const { sourceTeacherContextRef: _sourceTeacherContextRef, ...withoutReference } = decision;

    expect(validateDpDecision(withoutReference, createTeacherContext()).failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "missing_teacher_context_reference" })]),
    );
  });

  test("FAIL no evidence citations", () => {
    const decision = { ...createValidDecision(), citedObservationIds: [], citedLearningSignalIds: [] };

    expect(validateDpDecision(decision, createTeacherContext()).failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "missing_evidence_citation" })]),
    );
  });

  test("FAIL product failure classified as learner weakness", () => {
    const decision: DpEvidenceBasedDecision = {
      ...createValidDecision(),
      productIssueHandling: {
        ...createValidDecision().productIssueHandling,
        classifiedAsLearnerWeakness: true,
      },
      explanation: "This product failure proves weak listening.",
    };

    expect(validateDpDecision(decision, createTeacherContext()).failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "product_failure_as_learner_weakness" })]),
    );
  });

  test("FAIL learner weakness claim without evidence", () => {
    const decision: DpEvidenceBasedDecision = {
      ...createValidDecision(),
      learnerPerformanceClaims: [
        {
          claimId: "claim-001",
          claimType: "learner_weakness",
          statement: "Needs listening support.",
          citedObservationIds: [],
          citedLearningSignalIds: [],
          rationale: "",
          supported: false,
        },
      ],
    };

    expect(validateDpDecision(decision, createTeacherContext()).failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "learner_weakness_without_evidence" })]),
    );
  });

  test("FAIL invalid confidence level", () => {
    const decision = {
      ...createValidDecision(),
      confidenceLevel: "certain",
    } as unknown as DpEvidenceBasedDecision;

    expect(validateDpDecision(decision, createTeacherContext()).failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "invalid_confidence_level" })]),
    );
  });

  test("FAIL PED allowed without rationale", () => {
    const decision = {
      ...createValidDecision(),
      recommendation: { action: "exclude_listening_score", rationale: "" },
      pedAllowedToAct: true,
    };

    expect(validateDpDecision(decision, createTeacherContext()).failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "ped_allowed_without_rationale" })]),
    );
  });

  test("FAIL unsupported inference", () => {
    const decision = {
      ...createValidDecision(),
      explanation: "The learner clearly is careless.",
    };

    expect(validateDpDecision(decision, createTeacherContext()).failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "unsupported_inference" })]),
    );
  });

  test("PASS product issue handled without blaming learner", () => {
    const result = validateDpDecision({
      ...createValidDecision(),
      explanation: "Audio duration was zero, so listening validity is invalid for product reasons only.",
    }, createTeacherContext());

    expect(result.failures.map((failure) => failure.code)).not.toContain("product_failure_as_learner_weakness");
    expect(result.pass).toBe(true);
  });
});
