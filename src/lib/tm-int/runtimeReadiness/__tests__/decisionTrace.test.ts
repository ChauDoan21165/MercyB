import { describe, expect, it } from "vitest";

import type { TeacherContext } from "../../runtime";
import type { RuntimeEvidenceBundle } from "../evidenceBundle";
import { generateRuntimeDecisionTrace, RUNTIME_DECISION_TRACE_ORDER } from "../decisionTrace";

const teacherContext: TeacherContext = {
  schemaVersion: "tm-int-teacher-context-v1",
  observationSummary: { packetId: "obs-packet-trace", factCount: 1, factTypes: ["AudioDurationZero"] },
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
    { stage: "RUNTIME", source: "runtime", summary: "runtime decision" },
  ],
};

function bundle(): RuntimeEvidenceBundle {
  return {
    schemaVersion: "tm-int-runtime-evidence-bundle-v1",
    contractId: "RR-001",
    runtimeEvent: {
      eventId: "runtime-event-trace",
      route: "/placement/v3",
      eventType: "placement_runtime_decision",
      observedAt: "2026-07-03T00:00:00.000Z",
      observationIds: ["obs-packet-trace"],
    },
    obsPacket: {
      schemaVersion: "tm-int-obs-packet-v1",
      packetId: "obs-packet-trace",
      createdAt: "2026-07-03T00:00:00.000Z",
      source: "tm-int-obs",
      facts: [
        {
          capabilityId: "OBS-AUDIO-000002",
          factType: "AudioDurationZero",
          severity: "failure",
          observedAt: "2026-07-03T00:00:00.000Z",
          context: { route: "/placement/v3", taskId: "listening-a2-class-delay-1" },
          message: "Audio duration was zero.",
        },
      ],
    },
    learningSignals: [],
    teacherContext,
    dpDecision: {
      stage: "DP",
      source: "TC-000001",
      reason: "product_failure_audio",
      evidenceCount: 1,
      productFailure: true,
      learnerWeakness: false,
      observationIds: ["obs-packet-trace"],
      signalKeys: [],
    },
    pedDecision: {
      stage: "PED",
      source: "TC-000001",
      action: "exclude_listening_score_and_offer_retest",
      evidenceCount: 1,
      productFailure: true,
      learnerWeakness: false,
      observationIds: ["obs-packet-trace"],
      signalKeys: [],
    },
    runtimeDecision: {
      changed: true,
      changedBecauseOfTeacherContext: true,
      teacherContextUsed: true,
      learningSignalsUsed: true,
      summary: "exclude listening score",
      observationIds: ["obs-packet-trace"],
      signalKeys: [],
    },
    replay: { deterministic: true, pass: true, failures: [] },
    judgeReproduction: { deterministic: true, pass: true, failures: [] },
  };
}

describe("generateRuntimeDecisionTrace", () => {
  it("generates a passing decision trace", () => {
    const trace = generateRuntimeDecisionTrace(bundle());

    expect(trace.missingStages).toEqual([]);
    expect(trace.stages.every((stage) => stage.pass)).toBe(true);
  });

  it("orders stages deterministically", () => {
    const trace = generateRuntimeDecisionTrace(bundle());

    expect(trace.stages.map((stage) => stage.stageId)).toEqual(RUNTIME_DECISION_TRACE_ORDER);
    expect(generateRuntimeDecisionTrace(bundle())).toEqual(trace);
  });

  it("detects missing stages", () => {
    const partial = bundle() as Partial<RuntimeEvidenceBundle>;
    delete partial.pedDecision;

    const trace = generateRuntimeDecisionTrace(partial);

    expect(trace.missingStages).toEqual(["pedDecision"]);
    expect(trace.stages.find((stage) => stage.stageId === "pedDecision")).toMatchObject({
      pass: false,
      evidenceReference: "ped:missing",
    });
  });
});
