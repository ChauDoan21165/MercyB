import type { TeacherContext } from "../runtime";
import type { PartialRuntimeEvidenceBundle } from "./evidenceBundle";
import { observationIdsFromBundle, signalKeysFromBundle } from "./evidenceBundle";

export type TeacherContextValidationFailureCode =
  | "missing_observation_summary"
  | "missing_learning_signals"
  | "product_failure_as_learner_weakness"
  | "missing_pending_retest"
  | "missing_recommendations"
  | "invalid_confidence_summary"
  | "missing_replay_trace"
  | "missing_decision_evidence_reference"
  | "unknown_observation_reference"
  | "unknown_signal_reference";

export type TeacherContextValidationFailure = {
  code: TeacherContextValidationFailureCode;
  path: string;
  reason: string;
};

export type TeacherContextValidationResult = {
  pass: boolean;
  failures: TeacherContextValidationFailure[];
};

const LEARNER_WEAKNESS_PATTERN =
  /weak listening|weak speaking|poor learner|bad learner|bad comprehension|poor pronunciation|low ability|lazy|careless|learner weakness/i;

function hasObservationSummary(context: TeacherContext | undefined): boolean {
  return Boolean(
    context?.observationSummary &&
      context.observationSummary.packetId.trim() &&
      Array.isArray(context.observationSummary.factTypes) &&
      context.observationSummary.factTypes.length > 0,
  );
}

function hasConfidenceSummary(context: TeacherContext | undefined): boolean {
  const summary = context?.confidenceSummary;
  return Boolean(
    summary &&
      Number.isInteger(summary.high) &&
      Number.isInteger(summary.medium) &&
      Number.isInteger(summary.low) &&
      summary.high >= 0 &&
      summary.medium >= 0 &&
      summary.low >= 0 &&
      Object.keys(summary).every((key) => key === "high" || key === "medium" || key === "low"),
  );
}

function containsLearnerWeakness(value: unknown): boolean {
  return LEARNER_WEAKNESS_PATTERN.test(JSON.stringify(value));
}

function productIssuesInvalidateAssessment(context: TeacherContext): boolean {
  return context.productIssues.some((issue) => issue.affectedSkill === "listening" || issue.affectedSkill === "speaking");
}

type EvidenceReference = {
  id: string;
  path: string;
};

function referencedObservationIds(bundle: PartialRuntimeEvidenceBundle): readonly EvidenceReference[] {
  return [
    ...(bundle.runtimeEvent?.observationIds ?? []).map((id) => ({ id, path: "runtimeEvent.observationIds" })),
    ...(bundle.dpDecision?.observationIds ?? []).map((id) => ({ id, path: "dpDecision.observationIds" })),
    ...(bundle.pedDecision?.observationIds ?? []).map((id) => ({ id, path: "pedDecision.observationIds" })),
    ...(bundle.runtimeDecision?.observationIds ?? []).map((id) => ({ id, path: "runtimeDecision.observationIds" })),
    {
      id: bundle.teacherContext?.observationSummary?.packetId,
      path: "teacherContext.observationSummary.packetId",
    },
  ].filter((reference): reference is EvidenceReference =>
    typeof reference.id === "string" && reference.id.trim().length > 0,
  );
}

function referencedSignalKeys(bundle: PartialRuntimeEvidenceBundle): readonly EvidenceReference[] {
  return [
    ...(bundle.teacherContext?.learningSignals ?? []).map((signal) => ({
      id: signal.signal_key,
      path: "teacherContext.learningSignals",
    })),
    ...(bundle.dpDecision?.signalKeys ?? []).map((id) => ({ id, path: "dpDecision.signalKeys" })),
    ...(bundle.pedDecision?.signalKeys ?? []).map((id) => ({ id, path: "pedDecision.signalKeys" })),
    ...(bundle.runtimeDecision?.signalKeys ?? []).map((id) => ({ id, path: "runtimeDecision.signalKeys" })),
  ].filter((reference): reference is EvidenceReference =>
    typeof reference.id === "string" && reference.id.trim().length > 0,
  );
}

function hasReferences(value: readonly string[] | undefined): boolean {
  return Array.isArray(value) && value.some((id) => id.trim().length > 0);
}

function hasLearningSignalEvidence(bundle: PartialRuntimeEvidenceBundle): boolean {
  return Boolean(bundle.learningSignals?.length || bundle.teacherContext?.learningSignals?.length);
}

export function validateTeacherContext(bundle: PartialRuntimeEvidenceBundle): TeacherContextValidationResult {
  const context = bundle.teacherContext;
  const failures: TeacherContextValidationFailure[] = [];

  if (!hasObservationSummary(context)) {
    failures.push({
      code: "missing_observation_summary",
      path: "teacherContext.observationSummary",
      reason: "Teacher Context must include an Observation Summary with packet id and fact types.",
    });
  }

  if (!Array.isArray(context?.learningSignals)) {
    failures.push({
      code: "missing_learning_signals",
      path: "teacherContext.learningSignals",
      reason: "Teacher Context must include the Learning Signals collection, even when no signals were emitted.",
    });
  }

  if (context?.productIssues?.length && containsLearnerWeakness({
    productIssues: context.productIssues,
    dpDecision: bundle.dpDecision,
    pedDecision: bundle.pedDecision,
    recommendations: context.recommendations,
  })) {
    failures.push({
      code: "product_failure_as_learner_weakness",
      path: "teacherContext.productIssues",
      reason: "Product issues must remain separate from learner weakness language.",
    });
  }

  if (context && productIssuesInvalidateAssessment(context) && context.pendingRetests.length === 0) {
    failures.push({
      code: "missing_pending_retest",
      path: "teacherContext.pendingRetests",
      reason: "Product issues affecting assessment validity must create a pending retest.",
    });
  }

  if (!Array.isArray(context?.recommendations) || context.recommendations.length === 0) {
    failures.push({
      code: "missing_recommendations",
      path: "teacherContext.recommendations",
      reason: "Teacher Context must include recommendations.",
    });
  }

  if (!hasConfidenceSummary(context)) {
    failures.push({
      code: "invalid_confidence_summary",
      path: "teacherContext.confidenceSummary",
      reason: "Teacher Context confidence summary must contain non-negative high, medium, and low counts only.",
    });
  }

  if (!Array.isArray(context?.replayTrace) || context.replayTrace.length === 0) {
    failures.push({
      code: "missing_replay_trace",
      path: "teacherContext.replayTrace",
      reason: "Teacher Context must include replay trace.",
    });
  }

  for (const [path, decision] of [
    ["dpDecision", bundle.dpDecision],
    ["pedDecision", bundle.pedDecision],
    ["runtimeDecision", bundle.runtimeDecision],
  ] as const) {
    if (decision && !hasReferences(decision.observationIds)) {
      failures.push({
        code: "missing_decision_evidence_reference",
        path: `${path}.observationIds`,
        reason: "DP, PED, and runtime decisions must cite OBS evidence before downstream output changes.",
      });
    }

    if (decision && hasLearningSignalEvidence(bundle) && !hasReferences(decision.signalKeys)) {
      failures.push({
        code: "missing_decision_evidence_reference",
        path: `${path}.signalKeys`,
        reason: "DP, PED, and runtime decisions must cite Learning Signal evidence when signals are present.",
      });
    }
  }

  const knownObservationIds = observationIdsFromBundle(bundle);
  for (const observation of referencedObservationIds(bundle)) {
    if (!knownObservationIds.has(observation.id)) {
      failures.push({
        code: "unknown_observation_reference",
        path: observation.path,
        reason: `Runtime evidence referenced unknown observation id ${observation.id}.`,
      });
    }
  }

  const knownSignalKeys = signalKeysFromBundle(bundle);
  for (const signal of referencedSignalKeys(bundle)) {
    if (!knownSignalKeys.has(signal.id)) {
      failures.push({
        code: "unknown_signal_reference",
        path: signal.path,
        reason: `Runtime evidence referenced unknown learning signal ${signal.id}.`,
      });
    }
  }

  return {
    pass: failures.length === 0,
    failures,
  };
}
