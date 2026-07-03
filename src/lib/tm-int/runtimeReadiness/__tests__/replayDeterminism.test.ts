import { describe, expect, it } from "vitest";

import type { TeacherContext } from "../../runtime";
import type { RuntimeEvidenceBundle } from "../evidenceBundle";
import { checkReplayDeterminism } from "../replayDeterminism";

const teacherContext: TeacherContext = {
  schemaVersion: "tm-int-teacher-context-v1",
  observationSummary: {
    packetId: "obs-packet-rr001",
    factCount: 2,
    factTypes: ["AudioDurationZero", "MicPermissionDenied"],
  },
  learningSignals: [],
  productIssues: [
    { source: "TC-000001", issue: "product_failure_audio", affectedSkill: "listening", evidenceCount: 1 },
  ],
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
    { stage: "OBS", source: "runtime", summary: "2 facts" },
    { stage: "DP", source: "TC-000001", summary: "audio evidence" },
    { stage: "PED", source: "TC-000001", summary: "listening decision" },
    { stage: "LM", source: "TC-000001", summary: "listening memory" },
    { stage: "RUNTIME", source: "runtime", summary: "1 recommendation" },
  ],
};

function bundle(overrides: Partial<RuntimeEvidenceBundle> = {}): RuntimeEvidenceBundle {
  return {
    schemaVersion: "tm-int-runtime-evidence-bundle-v1",
    contractId: "RR-001",
    runtimeEvent: {
      eventId: "runtime-event-rr001",
      route: "/placement/v3",
      eventType: "placement_runtime_decision",
      observedAt: "2026-07-03T00:00:00.000Z",
      observationIds: ["obs-packet-rr001"],
    },
    obsPacket: {
      schemaVersion: "tm-int-obs-packet-v1",
      packetId: "obs-packet-rr001",
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
        {
          capabilityId: "OBS-SPEECH-000001",
          factType: "MicPermissionDenied",
          severity: "warning",
          observedAt: "2026-07-03T00:00:00.000Z",
          context: { route: "/placement/v3", taskId: "speaking-a2-learning-goals-1" },
          message: "Microphone permission was denied.",
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
      observationIds: ["obs-packet-rr001"],
      signalKeys: [],
    },
    pedDecision: {
      stage: "PED",
      source: "TC-000001",
      action: "exclude_listening_score_and_offer_retest",
      evidenceCount: 1,
      productFailure: true,
      learnerWeakness: false,
      observationIds: ["obs-packet-rr001"],
      signalKeys: [],
    },
    runtimeDecision: {
      changed: true,
      changedBecauseOfTeacherContext: true,
      teacherContextUsed: true,
      learningSignalsUsed: true,
      summary: "exclude listening score",
      observationIds: ["obs-packet-rr001"],
      signalKeys: [],
    },
    replay: { deterministic: true, pass: true, failures: [] },
    judgeReproduction: { deterministic: true, pass: true, failures: [] },
    ...overrides,
  };
}

describe("checkReplayDeterminism", () => {
  it("passes identical replay bundles", () => {
    const result = checkReplayDeterminism(bundle(), bundle());

    expect(result).toEqual({ pass: true, deterministic: true, mismatchStages: [], reasons: [] });
  });

  it("fails mismatch at Teacher Context", () => {
    const result = checkReplayDeterminism(bundle(), bundle({
      teacherContext: {
        ...teacherContext,
        confidenceSummary: { high: 0, medium: 1, low: 0 },
      },
    }));

    expect(result.pass).toBe(false);
    expect(result.mismatchStages).toEqual(["teacherContext"]);
    expect(result.reasons).toContain("teacherContext mismatch between replay bundles.");
  });

  it("fails mismatch at DP decision", () => {
    const result = checkReplayDeterminism(bundle(), bundle({
      dpDecision: { ...bundle().dpDecision, evidenceCount: 2 },
    }));

    expect(result.pass).toBe(false);
    expect(result.mismatchStages).toEqual(["dpDecision"]);
  });

  it("fails mismatch at PED decision", () => {
    const result = checkReplayDeterminism(bundle(), bundle({
      pedDecision: { ...bundle().pedDecision, action: "different_action" },
    }));

    expect(result.pass).toBe(false);
    expect(result.mismatchStages).toEqual(["pedDecision"]);
  });

  it("fails mismatch at runtime decision", () => {
    const result = checkReplayDeterminism(bundle(), bundle({
      runtimeDecision: { ...bundle().runtimeDecision, changed: false },
    }));

    expect(result.pass).toBe(false);
    expect(result.mismatchStages).toEqual(["runtimeDecision"]);
  });
});
