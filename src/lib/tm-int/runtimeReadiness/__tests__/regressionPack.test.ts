import { describe, expect, it } from "vitest";

import type { TeacherContext } from "../../runtime";
import type { CrossFlowReplayEntry, CrossFlowReplayPackage, CrossFlowType } from "../crossFlowReplay";
import type { RuntimeEvidenceBundle } from "../evidenceBundle";
import type { RuntimeRegressionPack } from "../regressionPack";
import {
  generateRuntimeRegressionPackReportSummary,
  validateRuntimeRegressionPack,
} from "../regressionPack";

function teacherContext(packetId: string): TeacherContext {
  return {
    schemaVersion: "tm-int-teacher-context-v1",
    observationSummary: { packetId, factCount: 1, factTypes: ["AudioDurationZero"] },
    learningSignals: [],
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
    confidenceSummary: { high: 1, medium: 0, low: 0 },
    replayTrace: [
      { stage: "OBS", source: "runtime", summary: "1 fact" },
      { stage: "DP", source: "TC-000001", summary: "audio evidence" },
      { stage: "PED", source: "TC-000001", summary: "listening decision" },
      { stage: "LM", source: "TC-000001", summary: "memory" },
      { stage: "SIGNALS", source: "EDU-LS-SPRINT1", summary: "0 signals" },
      { stage: "RUNTIME", source: "runtime", summary: "runtime decision" },
    ],
  };
}

function evidenceBundle(flowType = "placement"): RuntimeEvidenceBundle {
  const packetId = `obs-packet-${flowType}`;
  return {
    schemaVersion: "tm-int-runtime-evidence-bundle-v1",
    contractId: "RR-001",
    runtimeEvent: {
      eventId: `runtime-event-${flowType}`,
      route: `/${flowType}`,
      eventType: `${flowType}_runtime_decision`,
      observedAt: "2026-07-03T00:00:00.000Z",
      observationIds: [packetId],
    },
    obsPacket: {
      schemaVersion: "tm-int-obs-packet-v1",
      packetId,
      createdAt: "2026-07-03T00:00:00.000Z",
      source: "tm-int-obs",
      facts: [
        {
          capabilityId: "OBS-AUDIO-000002",
          factType: "AudioDurationZero",
          severity: "failure",
          observedAt: "2026-07-03T00:00:00.000Z",
          context: { route: `/${flowType}`, taskId: `${flowType}-task-1` },
          message: "Audio duration was zero.",
        },
      ],
    },
    learningSignals: [],
    teacherContext: teacherContext(packetId),
    dpDecision: {
      stage: "DP",
      source: "TC-000001",
      reason: "product_failure_audio",
      evidenceCount: 1,
      productFailure: true,
      learnerWeakness: false,
      observationIds: [packetId],
      signalKeys: [],
    },
    pedDecision: {
      stage: "PED",
      source: "TC-000001",
      action: "exclude_listening_score_and_offer_retest",
      evidenceCount: 1,
      productFailure: true,
      learnerWeakness: false,
      observationIds: [packetId],
      signalKeys: [],
    },
    runtimeDecision: {
      changed: true,
      changedBecauseOfTeacherContext: true,
      teacherContextUsed: true,
      learningSignalsUsed: true,
      summary: `runtime decision for ${flowType}`,
      observationIds: [packetId],
      signalKeys: [],
    },
    replay: { deterministic: true, pass: true, failures: [] },
    judgeReproduction: { deterministic: true, pass: true, failures: [] },
  };
}

function flow(flowType: CrossFlowType, sequenceIndex: number, previousFlowRef?: string): CrossFlowReplayEntry {
  return {
    flowId: `${flowType}-flow`,
    flowType,
    evidenceBundle: evidenceBundle(flowType),
    sequenceIndex,
    timestamp: `2026-07-03T00:0${sequenceIndex}:00.000Z`,
    previousFlowRef,
    teacherContextCarryover: {
      explicit: true,
      summary: previousFlowRef ? `Carries context from ${previousFlowRef}.` : "Initial placement context.",
      productFailureCarryover: sequenceIndex > 0,
      learnerWeaknessFromPriorProductFailure: false,
    },
  };
}

function crossFlowPackage(): CrossFlowReplayPackage {
  return {
    schemaVersion: "tm-int-cross-flow-replay-package-v1",
    packageId: "cross-flow-regression",
    flows: [
      flow("placement", 0),
      flow("tutor", 1, "placement-flow"),
      flow("speaking", 2, "tutor-flow"),
      flow("listening", 3, "speaking-flow"),
    ],
  };
}

function regressionPack(overrides: Partial<RuntimeRegressionPack> = {}): RuntimeRegressionPack {
  return {
    schemaVersion: "tm-int-runtime-regression-pack-v1",
    packId: "rr-001-regression-pack",
    version: "1.0.0",
    sourceRuntimeGateId: "RR-001",
    evidenceBundles: [evidenceBundle()],
    expectedJudgeVerdict: "PASS",
    expectedReadinessReportSummary: {
      verdict: "PASS",
      requiredSections: ["Runtime Flow", "Teacher Context Validation", "Replay Determinism"],
    },
    requiredInvariants: [
      "no_product_failure_as_learner_weakness",
      "no_ped_without_dp",
      "no_bypassing_teacher_context",
      "no_bypassing_learning_signals",
      "replay_deterministic",
      "runtime_decision_changed_by_teacher_context",
    ],
    replayDeterminism: { required: true },
    educationalRiskTags: ["product_failure", "assessment_validity", "replay_determinism"],
    fixtureMetadata: {
      fixtureId: "fixture-rr001",
      sourceCommit: "8ae4dd0f0",
      description: "RR-001 placement runtime regression fixture.",
    },
    ...overrides,
  };
}

describe("validateRuntimeRegressionPack", () => {
  it("passes a valid RR-001 regression pack", () => {
    expect(validateRuntimeRegressionPack(regressionPack())).toEqual({ pass: true, failures: [] });
  });

  it("passes a valid cross-flow regression pack", () => {
    const result = validateRuntimeRegressionPack(regressionPack({
      packId: "cross-flow-regression-pack",
      sourceRuntimeGateId: "RR-005",
      evidenceBundles: [],
      crossFlowPackage: crossFlowPackage(),
    }));

    expect(result).toEqual({ pass: true, failures: [] });
  });

  it("fails missing pack id", () => {
    const result = validateRuntimeRegressionPack(regressionPack({ packId: "" }));

    expect(result.failures).toContainEqual(expect.objectContaining({ code: "missing_pack_id" }));
  });

  it("fails missing source gate id", () => {
    const result = validateRuntimeRegressionPack(regressionPack({ sourceRuntimeGateId: "" as never }));

    expect(result.failures).toContainEqual(expect.objectContaining({ code: "missing_source_gate_id" }));
  });

  it("fails no evidence", () => {
    const result = validateRuntimeRegressionPack(regressionPack({ evidenceBundles: [], crossFlowPackage: undefined }));

    expect(result.failures).toContainEqual(expect.objectContaining({ code: "no_evidence" }));
  });

  it("fails invalid Judge verdict", () => {
    const result = validateRuntimeRegressionPack(regressionPack({ expectedJudgeVerdict: "MAYBE" as never }));

    expect(result.failures).toContainEqual(expect.objectContaining({ code: "invalid_judge_verdict" }));
  });

  it("fails unknown invariant", () => {
    const result = validateRuntimeRegressionPack(regressionPack({ requiredInvariants: ["unknown_invariant" as never] }));

    expect(result.failures).toContainEqual(expect.objectContaining({ code: "unknown_invariant" }));
  });

  it("fails determinism waived without reason", () => {
    const result = validateRuntimeRegressionPack(regressionPack({
      replayDeterminism: { required: false, waiverReason: "" },
    }));

    expect(result.failures).toContainEqual(expect.objectContaining({ code: "determinism_waived_without_reason" }));
  });

  it("fails invalid educational risk tag", () => {
    const result = validateRuntimeRegressionPack(regressionPack({ educationalRiskTags: ["unknown_tag" as never] }));

    expect(result.failures).toContainEqual(expect.objectContaining({ code: "invalid_educational_risk_tag" }));
  });

  it("fails product failure encoded as learner weakness", () => {
    const unsafe = evidenceBundle();
    unsafe.dpDecision = {
      ...unsafe.dpDecision,
      learnerWeakness: true,
      reason: "weak listening caused product failure",
    };

    const result = validateRuntimeRegressionPack(regressionPack({ evidenceBundles: [unsafe] }));

    expect(result.failures).toContainEqual(expect.objectContaining({ code: "product_failure_as_learner_weakness" }));
  });
});

describe("generateRuntimeRegressionPackReportSummary", () => {
  it("generates a report summary", () => {
    const summary = generateRuntimeRegressionPackReportSummary(regressionPack());

    expect(summary).toMatchObject({
      packId: "rr-001-regression-pack",
      verdict: "PASS",
      evidenceReportCount: 1,
    });
    expect(summary.reports[0].schemaVersion).toBe("tm-int-runtime-readiness-report-v1");
  });
});
