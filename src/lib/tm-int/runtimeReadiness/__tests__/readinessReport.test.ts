import { describe, expect, it } from "vitest";

import type { TeacherContext } from "../../runtime";
import type { RuntimeEvidenceBundle } from "../evidenceBundle";
import { generateRuntimeReadinessReport } from "../readinessReport";

const teacherContext: TeacherContext = {
  schemaVersion: "tm-int-teacher-context-v1",
  observationSummary: { packetId: "obs-packet-report", factCount: 1, factTypes: ["AudioDurationZero"] },
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

function bundle(overrides: Partial<RuntimeEvidenceBundle> = {}): RuntimeEvidenceBundle {
  return {
    schemaVersion: "tm-int-runtime-evidence-bundle-v1",
    contractId: "RR-001",
    runtimeEvent: {
      eventId: "runtime-event-report",
      route: "/placement/v3",
      eventType: "placement_runtime_decision",
      observedAt: "2026-07-03T00:00:00.000Z",
      observationIds: ["obs-packet-report"],
    },
    obsPacket: {
      schemaVersion: "tm-int-obs-packet-v1",
      packetId: "obs-packet-report",
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
      observationIds: ["obs-packet-report"],
      signalKeys: [],
    },
    pedDecision: {
      stage: "PED",
      source: "TC-000001",
      action: "exclude_listening_score_and_offer_retest",
      evidenceCount: 1,
      productFailure: true,
      learnerWeakness: false,
      observationIds: ["obs-packet-report"],
      signalKeys: [],
    },
    runtimeDecision: {
      changed: true,
      changedBecauseOfTeacherContext: true,
      teacherContextUsed: true,
      learningSignalsUsed: true,
      summary: "exclude listening score",
      observationIds: ["obs-packet-report"],
      signalKeys: [],
    },
    replay: { deterministic: true, pass: true, failures: [] },
    judgeReproduction: { deterministic: true, pass: true, failures: [] },
    ...overrides,
  };
}

describe("generateRuntimeReadinessReport", () => {
  it("generates a PASS JSON report", () => {
    const report = generateRuntimeReadinessReport(bundle());

    expect(report.json).toMatchObject({
      schemaVersion: "tm-int-runtime-readiness-report-v1",
      contractId: "RR-001",
      verdict: "PASS",
      dpPedSequence: { hasDpBeforePed: true },
    });
    expect(report.json.runtimeFlow.stages.map((stage) => stage.stageId)).toContain("teacherContext");
  });

  it("generates a FAIL JSON report", () => {
    const failed = bundle({
      runtimeDecision: {
        ...bundle().runtimeDecision,
        changed: false,
        changedBecauseOfTeacherContext: false,
      },
    });
    const report = generateRuntimeReadinessReport(failed);

    expect(report.json.verdict).toBe("FAIL");
    expect(report.json.educationalInvariants).toContainEqual(expect.objectContaining({ code: "runtime_decision_unchanged" }));
  });

  it("generates Markdown with Judge explanation", () => {
    const report = generateRuntimeReadinessReport(bundle());

    expect(report.markdown).toContain("# Runtime Readiness Report: RR-001");
    expect(report.markdown).toContain("## Judge Explanation");
    expect(report.markdown).toContain("PASS: runtime readiness evidence satisfies Judge rubric.");
  });

  it("includes Teacher Context and replay summaries", () => {
    const report = generateRuntimeReadinessReport(bundle());

    expect(report.markdown).toContain("## Teacher Context Validation");
    expect(report.markdown).toContain("## Replay Determinism");
    expect(report.json.teacherContextValidation.pass).toBe(true);
    expect(report.json.replayDeterminism.pass).toBe(true);
  });
});
