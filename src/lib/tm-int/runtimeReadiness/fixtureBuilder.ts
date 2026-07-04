import type { TeacherContext } from "../runtime";
import type { CrossFlowReplayEntry, CrossFlowReplayPackage, CrossFlowType } from "./crossFlowReplay";
import type { RuntimeEvidenceBundle } from "./evidenceBundle";
import type { ReplayDeterminismStage } from "./replayDeterminism";
import type { RuntimeRegressionPack } from "./regressionPack";

const FIXTURE_TIME = "2026-07-03T00:00:00.000Z";

export type ReplayPairOptions = {
  mismatchStage?: ReplayDeterminismStage;
};

export type RuntimeEvidenceReplayPair = {
  first: RuntimeEvidenceBundle;
  second: RuntimeEvidenceBundle;
};

export type TeacherContextValidatorFixtureKind = "complete" | "product_failure_as_learner_weakness";

const TEACHER_CONTEXT_VALIDATOR_SIGNAL = {
  signal_key: "productive_hesitation",
  source_edu_id: "EDU-LS-000001",
  confidence: "medium",
  evidenceCount: 1,
  alternatives: ["question_too_easy", "audio_prompt_replayed"],
  evidenceReferences: ["obs-packet-placement"],
} as const;

function packetIdFor(flowType: string): string {
  return `obs-packet-${flowType}`;
}

function cloneRuntimeEvidenceBundle(bundle: RuntimeEvidenceBundle): RuntimeEvidenceBundle {
  return structuredClone(bundle);
}

function createTeacherContext(flowType = "placement"): TeacherContext {
  const packetId = packetIdFor(flowType);
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

function createFlowBundle(flowType: CrossFlowType | "placement" = "placement"): RuntimeEvidenceBundle {
  const packetId = packetIdFor(flowType);
  return {
    schemaVersion: "tm-int-runtime-evidence-bundle-v1",
    contractId: "RR-001",
    runtimeEvent: {
      eventId: `runtime-event-${flowType}`,
      route: `/${flowType}`,
      eventType: `${flowType}_runtime_decision`,
      observedAt: FIXTURE_TIME,
      observationIds: [packetId],
    },
    obsPacket: {
      schemaVersion: "tm-int-obs-packet-v1",
      packetId,
      createdAt: FIXTURE_TIME,
      source: "tm-int-obs",
      facts: [
        {
          capabilityId: "OBS-AUDIO-000002",
          factType: "AudioDurationZero",
          severity: "failure",
          observedAt: FIXTURE_TIME,
          context: { route: `/${flowType}`, taskId: `${flowType}-task-1` },
          message: "Audio duration was zero.",
        },
      ],
    },
    learningSignals: [],
    teacherContext: createTeacherContext(flowType),
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

export function createTeacherContextValidatorFixture(
  kind: TeacherContextValidatorFixtureKind = "complete",
): RuntimeEvidenceBundle {
  const bundle = createFlowBundle("placement");
  const signal = {
    ...TEACHER_CONTEXT_VALIDATOR_SIGNAL,
    evidenceReferences: [bundle.obsPacket.packetId],
  };

  bundle.obsPacket.facts = [
    bundle.obsPacket.facts[0],
    {
      capabilityId: "OBS-SPEECH-000001",
      factType: "MicPermissionDenied",
      severity: "warning",
      observedAt: FIXTURE_TIME,
      context: { route: "/placement", taskId: "placement-speaking-task-1" },
      message: "Microphone permission was denied.",
    },
    {
      capabilityId: "OBS-LEARNING-000004",
      factType: "AssessmentAnswerSubmitted",
      severity: "info",
      observedAt: FIXTURE_TIME,
      context: { route: "/placement", taskId: "placement-reading-task-1" },
      metrics: { responseTimeMs: 900, correct: 0 },
      message: "Assessment answer timing and correctness observed.",
    },
  ];
  bundle.learningSignals = [signal];
  bundle.teacherContext = {
    ...bundle.teacherContext,
    observationSummary: {
      packetId: bundle.obsPacket.packetId,
      factCount: 3,
      factTypes: ["AudioDurationZero", "MicPermissionDenied", "AssessmentAnswerSubmitted"],
      factTypeCounts: {
        AudioDurationZero: 1,
        MicPermissionDenied: 1,
        AssessmentAnswerSubmitted: 1,
      },
    },
    learningSignals: [signal],
    productIssues: [
      {
        source: "TC-000001",
        issue: "product_failure_audio",
        affectedSkill: "listening",
        evidenceCount: 1,
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
      { source: "TC-000002", skill: "speaking", reason: "permission_block" },
    ],
    recommendations: [
      {
        source: "TC-000001",
        reason: "product_failure_audio",
        action: "exclude_listening_score_and_offer_retest",
        confidence: "high",
        evidenceCount: 1,
      },
      {
        source: "TC-000002",
        reason: "product_or_permission_block",
        action: "offer_speaking_retest_after_permission_fix",
        confidence: "medium",
        evidenceCount: 1,
      },
    ],
    confidenceSummary: { high: 1, medium: 1, low: 0 },
    replayTrace: [
      { stage: "OBS", source: "runtime", summary: "3 facts" },
      { stage: "DP", source: "TC-000001", summary: "audio and permission evidence" },
      { stage: "PED", source: "TC-000002", summary: "assessment validity protected" },
      { stage: "LM", source: "TC-000001", summary: "product issue retained separately" },
      { stage: "SIGNALS", source: "EDU-LS-SPRINT1", summary: "1 learning signal with alternatives" },
      { stage: "RUNTIME", source: "runtime", summary: "2 recommendations" },
    ],
  };
  bundle.dpDecision = {
    ...bundle.dpDecision,
    evidenceCount: 2,
    observationIds: [bundle.obsPacket.packetId],
    signalKeys: [signal.signal_key],
  };
  bundle.pedDecision = {
    ...bundle.pedDecision,
    evidenceCount: 2,
    observationIds: [bundle.obsPacket.packetId],
    signalKeys: [signal.signal_key],
  };
  bundle.runtimeDecision = {
    ...bundle.runtimeDecision,
    observationIds: [bundle.obsPacket.packetId],
    signalKeys: [signal.signal_key],
  };

  if (kind === "product_failure_as_learner_weakness") {
    bundle.dpDecision = {
      ...bundle.dpDecision,
      reason: "weak listening caused product failure",
      learnerWeakness: true,
    };
  }

  return bundle;
}

function createCrossFlowEntry(flowType: CrossFlowType, sequenceIndex: number, previousFlowRef?: string): CrossFlowReplayEntry {
  return {
    flowId: `${flowType}-flow`,
    flowType,
    evidenceBundle: createFlowBundle(flowType),
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

function withReplayMismatch(bundle: RuntimeEvidenceBundle, mismatchStage: ReplayDeterminismStage): RuntimeEvidenceBundle {
  if (mismatchStage === "runtimeEvent") {
    return { ...bundle, runtimeEvent: { ...bundle.runtimeEvent, eventId: `${bundle.runtimeEvent.eventId}-mismatch` } };
  }
  if (mismatchStage === "obsPacket") {
    return { ...bundle, obsPacket: { ...bundle.obsPacket, packetId: `${bundle.obsPacket.packetId}-mismatch` } };
  }
  if (mismatchStage === "learningSignals") {
    return {
      ...bundle,
      learningSignals: [{
        signal_key: "productive_hesitation",
        source_edu_id: "EDU-LS-000001",
        confidence: "medium",
        evidenceCount: 1,
        alternatives: ["question_too_easy"],
      }],
    };
  }
  if (mismatchStage === "teacherContext") {
    return { ...bundle, teacherContext: { ...bundle.teacherContext, confidenceSummary: { high: 0, medium: 1, low: 0 } } };
  }
  if (mismatchStage === "dpDecision") {
    return { ...bundle, dpDecision: { ...bundle.dpDecision, evidenceCount: 2 } };
  }
  if (mismatchStage === "pedDecision") {
    return { ...bundle, pedDecision: { ...bundle.pedDecision, action: "different_action" } };
  }
  if (mismatchStage === "runtimeDecision") {
    return { ...bundle, runtimeDecision: { ...bundle.runtimeDecision, summary: "different runtime decision" } };
  }
  return { ...bundle, replay: { deterministic: false, pass: false, failures: ["Replay output changed."] } };
}

export function createValidRuntimeEvidenceBundle(): RuntimeEvidenceBundle {
  return createFlowBundle("placement");
}

export function createInvalidMissingTeacherContextBundle(): Partial<RuntimeEvidenceBundle> {
  const bundle = createValidRuntimeEvidenceBundle();
  const { teacherContext: _teacherContext, ...withoutTeacherContext } = bundle;
  return withoutTeacherContext;
}

export function createProductFailureBundle(): RuntimeEvidenceBundle {
  return createValidRuntimeEvidenceBundle();
}

export function createReplayPair(options: ReplayPairOptions = {}): RuntimeEvidenceReplayPair {
  const first = createValidRuntimeEvidenceBundle();
  return {
    first,
    second: options.mismatchStage
      ? withReplayMismatch(cloneRuntimeEvidenceBundle(first), options.mismatchStage)
      : createValidRuntimeEvidenceBundle(),
  };
}

export function createValidCrossFlowReplayPackage(): CrossFlowReplayPackage {
  return {
    schemaVersion: "tm-int-cross-flow-replay-package-v1",
    packageId: "fixture-cross-flow-package",
    flows: [
      createCrossFlowEntry("placement", 0),
      createCrossFlowEntry("tutor", 1, "placement-flow"),
      createCrossFlowEntry("speaking", 2, "tutor-flow"),
      createCrossFlowEntry("listening", 3, "speaking-flow"),
    ],
  };
}

export function createValidRegressionPack(): RuntimeRegressionPack {
  return {
    schemaVersion: "tm-int-runtime-regression-pack-v1",
    packId: "fixture-regression-pack",
    version: "1.0.0",
    sourceRuntimeGateId: "RR-001",
    evidenceBundles: [createValidRuntimeEvidenceBundle()],
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
      fixtureId: "fixture-runtime-readiness",
      sourceCommit: "bf30427a5",
      description: "Deterministic Runtime Readiness fixture pack.",
    },
  };
}
