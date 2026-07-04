import { describe, expect, test } from "vitest";
import type { TeacherContext } from "../../runtime";
import { dpTeacherContextReferenceFrom, type DpEvidenceBasedDecision } from "../decisionContract";
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
    sourceTeacherContextRef: dpTeacherContextReferenceFrom(createTeacherContext()),
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

  test("FAIL missing Teacher Context object", () => {
    expect(validateDpDecision(createValidDecision()).failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "missing_teacher_context" })]),
    );
  });

  test("FAIL no evidence citations", () => {
    const decision = { ...createValidDecision(), citedObservationIds: [], citedLearningSignalIds: [] };

    expect(validateDpDecision(decision, createTeacherContext()).failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "missing_evidence_citation" })]),
    );
  });

  test("FAIL unknown observation citation", () => {
    const decision = { ...createValidDecision(), citedObservationIds: ["unknown-observation"] };

    expect(validateDpDecision(decision, createTeacherContext()).failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "unknown_observation_citation" })]),
    );
  });

  test("FAIL unknown learning signal citation", () => {
    const decision = { ...createValidDecision(), citedObservationIds: [], citedLearningSignalIds: ["unknown_signal"] };

    expect(validateDpDecision(decision, createTeacherContext()).failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "unknown_learning_signal_citation" })]),
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

  test("FAIL product issue present without issue type", () => {
    const decision: DpEvidenceBasedDecision = {
      ...createValidDecision(),
      productIssueHandling: {
        ...createValidDecision().productIssueHandling,
        issueTypes: [],
      },
    };

    expect(validateDpDecision(decision, createTeacherContext()).failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "invalid_product_issue_handling" })]),
    );
  });

  test("FAIL product issue present without rationale", () => {
    const decision: DpEvidenceBasedDecision = {
      ...createValidDecision(),
      productIssueHandling: {
        ...createValidDecision().productIssueHandling,
        rationale: "",
      },
    };

    expect(validateDpDecision(decision, createTeacherContext()).failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "invalid_product_issue_handling" })]),
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

  test("FAIL claim observation citation not declared on DP decision", () => {
    const decision: DpEvidenceBasedDecision = {
      ...createValidDecision(),
      learnerPerformanceClaims: [
        {
          claimId: "claim-001",
          claimType: "learning_behavior",
          statement: "Learner repaired the answer after a pause.",
          citedObservationIds: ["obs-packet-placement"],
          citedLearningSignalIds: ["productive_hesitation"],
          rationale: "The cited learning signal is present in Teacher Context.",
          supported: true,
        },
      ],
    };

    expect(validateDpDecision(decision, createTeacherContext()).failures).toEqual(
      expect.arrayContaining([expect.objectContaining({ code: "claim_learning_signal_not_declared" })]),
    );
  });

  test("PASS learner claim citations declared and known", () => {
    const decision: DpEvidenceBasedDecision = {
      ...createValidDecision(),
      citedLearningSignalIds: ["productive_hesitation"],
      learnerPerformanceClaims: [
        {
          claimId: "claim-001",
          claimType: "learning_behavior",
          statement: "Learner showed productive hesitation.",
          citedObservationIds: ["obs-packet-placement"],
          citedLearningSignalIds: ["productive_hesitation"],
          rationale: "Teacher Context contains the cited observation packet and learning signal.",
          supported: true,
        },
      ],
    };

    expect(validateDpDecision(decision, createTeacherContext()).pass).toBe(true);
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
