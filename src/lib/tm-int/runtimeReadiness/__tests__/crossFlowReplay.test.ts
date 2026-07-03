import { describe, expect, it } from "vitest";

import type { TeacherContext } from "../../runtime";
import type { RuntimeEvidenceBundle } from "../evidenceBundle";
import type { CrossFlowReplayEntry, CrossFlowReplayPackage, CrossFlowType } from "../crossFlowReplay";
import {
  generateCrossFlowCombinedTrace,
  generateCrossFlowReadinessSummary,
  validateCrossFlowReplayPackage,
} from "../crossFlowReplay";

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

function evidenceBundle(flowType: CrossFlowType): RuntimeEvidenceBundle {
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

function replayPackage(flows: readonly CrossFlowReplayEntry[] = [
  flow("placement", 0),
  flow("tutor", 1, "placement-flow"),
  flow("speaking", 2, "tutor-flow"),
  flow("listening", 3, "speaking-flow"),
]): CrossFlowReplayPackage {
  return {
    schemaVersion: "tm-int-cross-flow-replay-package-v1",
    packageId: "cross-flow-rr005-seed",
    flows,
  };
}

describe("validateCrossFlowReplayPackage", () => {
  it("passes a valid Placement to Tutor to Speaking to Listening package", () => {
    expect(validateCrossFlowReplayPackage(replayPackage())).toEqual({ pass: true, failures: [] });
  });

  it("fails when Tutor flow is missing", () => {
    const result = validateCrossFlowReplayPackage(replayPackage([
      flow("placement", 0),
      flow("speaking", 1, "placement-flow"),
      flow("listening", 2, "speaking-flow"),
    ]));

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "missing_required_flow" }));
  });

  it("fails duplicate sequence index", () => {
    const result = validateCrossFlowReplayPackage(replayPackage([
      flow("placement", 0),
      flow("tutor", 1, "placement-flow"),
      flow("speaking", 1, "tutor-flow"),
      flow("listening", 3, "speaking-flow"),
    ]));

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "duplicate_sequence_index" }));
  });

  it("fails non-deterministic order", () => {
    const result = validateCrossFlowReplayPackage(replayPackage([
      flow("placement", 0),
      flow("speaking", 2, "tutor-flow"),
      flow("tutor", 1, "placement-flow"),
      flow("listening", 3, "speaking-flow"),
    ]));

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "non_deterministic_order" }));
  });

  it("fails missing Teacher Context carryover", () => {
    const missingCarryover = {
      ...flow("tutor", 1, "placement-flow"),
      teacherContextCarryover: {
        explicit: false,
        summary: "",
        productFailureCarryover: true,
        learnerWeaknessFromPriorProductFailure: false,
      },
    };

    const result = validateCrossFlowReplayPackage(replayPackage([
      flow("placement", 0),
      missingCarryover,
      flow("speaking", 2, "tutor-flow"),
      flow("listening", 3, "speaking-flow"),
    ]));

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "missing_teacher_context_carryover" }));
  });

  it("fails prior product failure converted into learner weakness", () => {
    const unsafeCarryover = {
      ...flow("speaking", 2, "tutor-flow"),
      teacherContextCarryover: {
        explicit: true,
        summary: "Prior product failure means weak speaking.",
        productFailureCarryover: true,
        learnerWeaknessFromPriorProductFailure: true,
      },
    };

    const result = validateCrossFlowReplayPackage(replayPackage([
      flow("placement", 0),
      flow("tutor", 1, "placement-flow"),
      unsafeCarryover,
      flow("listening", 3, "speaking-flow"),
    ]));

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "prior_product_failure_as_learner_weakness" }));
  });
});

describe("cross-flow replay outputs", () => {
  it("generates a combined trace", () => {
    const trace = generateCrossFlowCombinedTrace(replayPackage());

    expect(trace.deterministic).toBe(true);
    expect(trace.stages).toHaveLength(36);
    expect(trace.stages[0]).toMatchObject({
      evidenceReference: "placement-flow:runtime-event-placement",
      summary: "placement#0: placement_runtime_decision on /placement",
    });
  });

  it("generates a readiness summary", () => {
    const summary = generateCrossFlowReadinessSummary(replayPackage());

    expect(summary).toMatchObject({
      packageId: "cross-flow-rr005-seed",
      verdict: "PASS",
      validation: { pass: true, failures: [] },
    });
    expect(summary.flowReports).toHaveLength(4);
  });
});
