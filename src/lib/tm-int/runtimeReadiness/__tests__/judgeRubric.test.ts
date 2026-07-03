import { describe, expect, it } from "vitest";

import type { TeacherContext } from "../../runtime";
import type { RuntimeReadinessEvidenceBundle } from "../contracts";
import { RUNTIME_GATE_CONTRACTS } from "../contracts";
import { judgeRuntimeReadinessEvidence, requiredRuntimeEvidenceFields } from "../judgeRubric";

const teacherContext: TeacherContext = {
  schemaVersion: "tm-int-teacher-context-v1",
  observationSummary: {
    packetId: "obs-packet-rr001",
    factCount: 5,
    factTypes: [
      "AudioDurationZero",
      "AudioPlaybackFailed",
      "MicPermissionDenied",
      "AssessmentAnswerSubmitted",
      "AssessmentAnswerSubmitted",
    ],
  },
  learningSignals: [],
  productIssues: [
    {
      source: "TC-000001",
      issue: "product_failure_audio",
      affectedSkill: "listening",
      evidenceCount: 2,
    },
    {
      source: "TC-000002",
      issue: "product_or_permission_block",
      affectedSkill: "speaking",
      evidenceCount: 1,
    },
  ],
  pendingRetests: [
    { source: "TC-000001", skill: "listening", reason: "product_failure" },
    { source: "TC-000002", skill: "speaking", reason: "mic_permission_or_device_block" },
  ],
  recommendations: [
    {
      source: "TC-000001",
      reason: "product_failure_audio",
      action: "exclude_listening_score_and_offer_retest",
      confidence: "high",
      evidenceCount: 2,
    },
    {
      source: "TC-000002",
      reason: "product_or_permission_block",
      action: "exclude_speaking_score_offer_text_fallback_and_mic_retry",
      confidence: "high",
      evidenceCount: 1,
    },
    {
      source: "TC-000003",
      reason: "possible_rapid_guessing",
      action: "pause_assessment_ask_confidence_check_and_do_not_lower_placement",
      confidence: "medium",
      evidenceCount: 2,
    },
  ],
  confidenceSummary: { high: 2, medium: 1, low: 0 },
  replayTrace: [
    { stage: "OBS", source: "runtime", summary: "5 facts" },
    { stage: "DP", source: "TC-000001", summary: "audio evidence" },
    { stage: "PED", source: "TC-000001", summary: "listening decisions" },
    { stage: "LM", source: "TC-000001", summary: "listening memory" },
    { stage: "DP", source: "TC-000002", summary: "speech evidence" },
    { stage: "PED", source: "TC-000002", summary: "speaking decisions" },
    { stage: "LM", source: "TC-000002", summary: "speaking memory" },
    { stage: "DP", source: "TC-000003", summary: "rapid guessing evidence" },
    { stage: "PED", source: "TC-000003", summary: "assessment decisions" },
    { stage: "LM", source: "TC-000003", summary: "behavior memory" },
    { stage: "SIGNALS", source: "EDU-LS-SPRINT1", summary: "0 learning signals" },
    { stage: "RUNTIME", source: "runtime", summary: "3 recommendations" },
  ],
};

function rr001Bundle(overrides: Partial<RuntimeReadinessEvidenceBundle> = {}): RuntimeReadinessEvidenceBundle {
  return {
    contractId: "RR-001",
    runtimeEvent: {
      route: "/placement/v3",
      eventType: "placement_runtime_decision",
    },
    obsPacket: {
      schemaVersion: "tm-int-obs-packet-v1",
      packetId: "obs-packet-rr001",
      facts: [
        { factType: "AudioDurationZero" },
        { factType: "AudioPlaybackFailed" },
        { factType: "MicPermissionDenied" },
        { factType: "AssessmentAnswerSubmitted" },
        { factType: "AssessmentAnswerSubmitted" },
      ],
    },
    learningSignals: [],
    teacherContext,
    dpDecision: {
      stage: "DP",
      source: "TC-000001/TC-000002/TC-000003",
      reason: "product_failure_audio/product_or_permission_block/possible_rapid_guessing",
      evidenceCount: 5,
      productFailure: true,
      learnerWeakness: false,
    },
    pedDecision: {
      stage: "PED",
      source: "TC-000001/TC-000002/TC-000003",
      action: "exclude_scores_offer_retest_fallback_and_followup",
      evidenceCount: 5,
      productFailure: true,
      learnerWeakness: false,
    },
    runtimeDecision: {
      changed: true,
      changedBecauseOfTeacherContext: true,
      teacherContextUsed: true,
      learningSignalsUsed: true,
      summary: "exclude listening, exclude speaking, mark placement questionable",
    },
    replay: { deterministic: true, pass: true, failures: [] },
    judgeReproduction: { deterministic: true, pass: true, failures: [] },
    ...overrides,
  };
}

describe("runtime readiness contracts", () => {
  it("defines RA-1 and RR-001 through RR-006 contracts with required evidence fields", () => {
    expect(RUNTIME_GATE_CONTRACTS.map((contract) => contract.gateId)).toEqual([
      "RA-1",
      "RR-001",
      "RR-002",
      "RR-003",
      "RR-004",
      "RR-005",
      "RR-006",
    ]);
    expect(requiredRuntimeEvidenceFields()).toEqual([
      "runtimeEvent",
      "obsPacket",
      "learningSignals",
      "teacherContext",
      "dpDecision",
      "pedDecision",
      "runtimeDecision",
      "replay",
      "judgeReproduction",
    ]);
  });
});

describe("judgeRuntimeReadinessEvidence", () => {
  it("passes the RR-001 sample evidence bundle", () => {
    const result = judgeRuntimeReadinessEvidence(rr001Bundle(), "RR-001");

    expect(result).toEqual({ pass: true, contractId: "RR-001", failures: [] });
  });

  it("fails when Teacher Context is missing", () => {
    const bundle = rr001Bundle() as Partial<RuntimeReadinessEvidenceBundle>;
    delete bundle.teacherContext;

    const result = judgeRuntimeReadinessEvidence(bundle, "RR-001");

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "missing_field", path: "teacherContext" }));
  });

  it("fails when PED appears without DP", () => {
    const bundle = rr001Bundle({
      teacherContext: {
        ...teacherContext,
        replayTrace: teacherContext.replayTrace.filter((step) => step.stage !== "DP"),
      },
    });

    const result = judgeRuntimeReadinessEvidence(bundle, "RR-001");

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "ped_without_dp" }));
  });

  it("fails when product failure is misclassified as learner weakness", () => {
    const result = judgeRuntimeReadinessEvidence(
      rr001Bundle({
        dpDecision: {
          stage: "DP",
          source: "TC-000001",
          reason: "weak listening caused audio failure",
          evidenceCount: 2,
          productFailure: true,
          learnerWeakness: true,
        },
      }),
      "RR-001",
    );

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "product_failure_as_learner_weakness" }));
  });

  it("fails when replay is non-deterministic", () => {
    const result = judgeRuntimeReadinessEvidence(
      rr001Bundle({
        replay: { deterministic: false, pass: false, failures: ["Replay output changed."] },
      }),
      "RR-001",
    );

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "replay_not_deterministic" }));
  });

  it("fails when runtime decision does not change", () => {
    const result = judgeRuntimeReadinessEvidence(
      rr001Bundle({
        runtimeDecision: {
          changed: false,
          changedBecauseOfTeacherContext: false,
          teacherContextUsed: true,
          learningSignalsUsed: true,
          summary: "no runtime effect",
        },
      }),
      "RR-001",
    );

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "runtime_decision_unchanged" }));
  });
});
