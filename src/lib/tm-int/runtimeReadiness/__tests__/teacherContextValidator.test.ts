import { describe, expect, it } from "vitest";

import type { TeacherContext } from "../../runtime";
import type { RuntimeEvidenceBundle } from "../evidenceBundle";
import { judgeRuntimeReadinessEvidence } from "../judgeRubric";
import { validateTeacherContext } from "../teacherContextValidator";

const learningSignal = {
  signal_key: "ProductiveHesitation",
  source_edu_id: "EDU-LS-000001",
  confidence: "medium",
  evidenceCount: 1,
  alternatives: ["question_too_easy"],
} as const;

const validTeacherContext: TeacherContext = {
  schemaVersion: "tm-int-teacher-context-v1",
  observationSummary: {
    packetId: "obs-packet-rr001",
    factCount: 3,
    factTypes: ["AudioDurationZero", "MicPermissionDenied", "AssessmentAnswerSubmitted"],
  },
  learningSignals: [learningSignal],
  productIssues: [
    {
      source: "TC-000001",
      issue: "product_failure_audio",
      affectedSkill: "listening",
      evidenceCount: 1,
    },
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
    { stage: "OBS", source: "runtime", summary: "3 facts" },
    { stage: "DP", source: "TC-000001", summary: "audio evidence" },
    { stage: "PED", source: "TC-000001", summary: "listening decision" },
    { stage: "LM", source: "TC-000001", summary: "listening memory" },
    { stage: "SIGNALS", source: "EDU-LS-SPRINT1", summary: "1 learning signal" },
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
        {
          capabilityId: "OBS-LEARNING-000004",
          factType: "AssessmentAnswerSubmitted",
          severity: "info",
          observedAt: "2026-07-03T00:00:00.000Z",
          context: { route: "/placement/v3", taskId: "reading-b1-work-email-1" },
          metrics: { responseTimeMs: 900, correct: 0 },
          message: "Assessment answer timing and correctness observed.",
        },
      ],
    },
    learningSignals: [learningSignal],
    teacherContext: validTeacherContext,
    dpDecision: {
      stage: "DP",
      source: "TC-000001",
      reason: "product_failure_audio",
      evidenceCount: 1,
      productFailure: true,
      learnerWeakness: false,
      observationIds: ["obs-packet-rr001"],
      signalKeys: ["ProductiveHesitation"],
    },
    pedDecision: {
      stage: "PED",
      source: "TC-000001",
      action: "exclude_listening_score_and_offer_retest",
      evidenceCount: 1,
      productFailure: true,
      learnerWeakness: false,
      observationIds: ["obs-packet-rr001"],
      signalKeys: ["ProductiveHesitation"],
    },
    runtimeDecision: {
      changed: true,
      changedBecauseOfTeacherContext: true,
      teacherContextUsed: true,
      learningSignalsUsed: true,
      summary: "exclude listening score",
      observationIds: ["obs-packet-rr001"],
      signalKeys: ["ProductiveHesitation"],
    },
    replay: { deterministic: true, pass: true, failures: [] },
    judgeReproduction: { deterministic: true, pass: true, failures: [] },
    ...overrides,
  };
}

function withTeacherContext(context: TeacherContext): RuntimeEvidenceBundle {
  return bundle({ teacherContext: context, learningSignals: context.learningSignals });
}

describe("validateTeacherContext", () => {
  it("passes a valid RR-001-style bundle", () => {
    expect(validateTeacherContext(bundle())).toEqual({ pass: true, failures: [] });
  });

  it("fails when Observation Summary is missing", () => {
    const result = validateTeacherContext(withTeacherContext({
      ...validTeacherContext,
      observationSummary: { packetId: "", factCount: 0, factTypes: [] },
    }));

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "missing_observation_summary" }));
  });

  it("fails when Learning Signals are missing", () => {
    const partial = bundle() as Partial<RuntimeEvidenceBundle>;
    partial.teacherContext = { ...validTeacherContext, learningSignals: undefined as never };
    partial.learningSignals = undefined;

    const result = validateTeacherContext(partial);

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "missing_learning_signals" }));
  });

  it("fails when product failure is classified as learner weakness", () => {
    const result = validateTeacherContext(bundle({
      dpDecision: {
        ...bundle().dpDecision,
        reason: "weak listening caused product failure",
        learnerWeakness: true,
      },
    }));

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "product_failure_as_learner_weakness" }));
  });

  it("fails when a product issue invalidates assessment without pending retest", () => {
    const result = validateTeacherContext(withTeacherContext({
      ...validTeacherContext,
      pendingRetests: [],
    }));

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "missing_pending_retest" }));
  });

  it("fails invalid confidence level shape", () => {
    const result = validateTeacherContext({
      ...bundle(),
      teacherContext: {
        ...validTeacherContext,
        confidenceSummary: { high: 1, medium: -1, low: 0 },
      },
    });

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "invalid_confidence_summary" }));
  });

  it("fails when Replay Trace is missing", () => {
    const result = validateTeacherContext(withTeacherContext({
      ...validTeacherContext,
      replayTrace: [],
    }));

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "missing_replay_trace" }));
  });

  it("fails when Teacher Context references an unknown observation id", () => {
    const result = validateTeacherContext(withTeacherContext({
      ...validTeacherContext,
      observationSummary: { ...validTeacherContext.observationSummary, packetId: "obs-packet-unknown" },
    }));

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "unknown_observation_reference" }));
  });

  it("surfaces Teacher Context validator failures through the Judge rubric", () => {
    const result = judgeRuntimeReadinessEvidence(withTeacherContext({
      ...validTeacherContext,
      replayTrace: [],
    }), "RR-001");

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "missing_replay_trace" }));
  });
});
