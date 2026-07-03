import {
  getRuntimeGateContract,
  REQUIRED_RUNTIME_EVIDENCE_FIELDS,
  type RuntimeEvidenceField,
  type RuntimeGateId,
  type RuntimeReadinessEvidenceBundle,
} from "./contracts";

export type RuntimeReadinessFailureCode =
  | "missing_field"
  | "contract_mismatch"
  | "product_failure_as_learner_weakness"
  | "ped_without_dp"
  | "teacher_context_bypassed"
  | "learning_signals_bypassed"
  | "replay_not_deterministic"
  | "runtime_decision_unchanged";

export type RuntimeReadinessFailure = {
  code: RuntimeReadinessFailureCode;
  path: string;
  reason: string;
};

export type RuntimeReadinessJudgeResult = {
  pass: boolean;
  contractId: RuntimeGateId;
  failures: RuntimeReadinessFailure[];
};

type PartialRuntimeReadinessEvidenceBundle = Partial<RuntimeReadinessEvidenceBundle> & {
  contractId?: RuntimeGateId | string;
};

const LEARNER_WEAKNESS_PATTERN =
  /weak listening|weak speaking|poor learner|bad learner|bad comprehension|poor pronunciation|low ability|lazy|careless|learner weakness/i;

function hasOwn(value: object, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function addMissingFieldFailures(
  bundle: PartialRuntimeReadinessEvidenceBundle,
  requiredFields: readonly RuntimeEvidenceField[],
): RuntimeReadinessFailure[] {
  return requiredFields
    .filter((field) => !hasOwn(bundle, field) || bundle[field] === null || typeof bundle[field] === "undefined")
    .map((field) => ({
      code: "missing_field" as const,
      path: field,
      reason: `Runtime evidence bundle is missing required field ${field}.`,
    }));
}

function hasProductFailure(bundle: PartialRuntimeReadinessEvidenceBundle): boolean {
  const serialized = JSON.stringify({
    obsPacket: bundle.obsPacket,
    teacherContext: bundle.teacherContext,
    dpDecision: bundle.dpDecision,
    pedDecision: bundle.pedDecision,
  });
  return /product_failure|product_or_permission_block|AudioUnavailable|AudioDurationZero|AudioPlaybackFailed|MicPermissionDenied/i.test(serialized);
}

function containsLearnerWeakness(value: unknown): boolean {
  return LEARNER_WEAKNESS_PATTERN.test(JSON.stringify(value));
}

function hasStageTrace(bundle: PartialRuntimeReadinessEvidenceBundle, stage: "DP" | "PED"): boolean {
  return Boolean(bundle.teacherContext?.replayTrace?.some((step) => step.stage === stage));
}

function hasTeacherContextShape(bundle: PartialRuntimeReadinessEvidenceBundle): boolean {
  const context = bundle.teacherContext;
  return Boolean(
    context &&
      context.schemaVersion === "tm-int-teacher-context-v1" &&
      context.observationSummary &&
      Array.isArray(context.learningSignals) &&
      Array.isArray(context.productIssues) &&
      Array.isArray(context.pendingRetests) &&
      Array.isArray(context.recommendations) &&
      context.confidenceSummary &&
      Array.isArray(context.replayTrace),
  );
}

function hasLearningSignalsShape(bundle: PartialRuntimeReadinessEvidenceBundle): boolean {
  return Array.isArray(bundle.learningSignals) && Array.isArray(bundle.teacherContext?.learningSignals);
}

export function judgeRuntimeReadinessEvidence(
  bundle: PartialRuntimeReadinessEvidenceBundle,
  expectedContractId: RuntimeGateId = bundle.contractId as RuntimeGateId,
): RuntimeReadinessJudgeResult {
  const contract = getRuntimeGateContract(expectedContractId);
  const failures: RuntimeReadinessFailure[] = [];

  if (bundle.contractId !== expectedContractId) {
    failures.push({
      code: "contract_mismatch",
      path: "contractId",
      reason: `Evidence contractId ${String(bundle.contractId)} did not match expected ${expectedContractId}.`,
    });
  }

  failures.push(...addMissingFieldFailures(bundle, contract.requiredEvidenceFields));

  if (failures.some((failure) => failure.code === "missing_field")) {
    return { pass: false, contractId: expectedContractId, failures };
  }

  if (!hasTeacherContextShape(bundle) || bundle.runtimeDecision?.teacherContextUsed !== true) {
    failures.push({
      code: "teacher_context_bypassed",
      path: "teacherContext",
      reason: "Runtime evidence must include a complete Teacher Context and show it was used by runtimeDecision.",
    });
  }

  if (!hasLearningSignalsShape(bundle) || bundle.runtimeDecision?.learningSignalsUsed !== true) {
    failures.push({
      code: "learning_signals_bypassed",
      path: "learningSignals",
      reason: "Runtime evidence must include Learning Signals and show they were consumed through Teacher Context.",
    });
  }

  if (!bundle.dpDecision || (bundle.pedDecision && !bundle.dpDecision) || !hasStageTrace(bundle, "DP")) {
    failures.push({
      code: "ped_without_dp",
      path: "dpDecision",
      reason: "PED evidence cannot be accepted without a prior DP decision trace.",
    });
  }

  if (bundle.pedDecision && !hasStageTrace(bundle, "PED")) {
    failures.push({
      code: "ped_without_dp",
      path: "teacherContext.replayTrace",
      reason: "Teacher Context replayTrace must show PED after DP before runtime decisions are trusted.",
    });
  }

  if (hasProductFailure(bundle) && (
    bundle.dpDecision?.learnerWeakness === true ||
    bundle.pedDecision?.learnerWeakness === true ||
    containsLearnerWeakness(bundle)
  )) {
    failures.push({
      code: "product_failure_as_learner_weakness",
      path: "dpDecision",
      reason: "Product failure evidence was classified or described as learner weakness.",
    });
  }

  if (bundle.replay?.deterministic !== true || bundle.judgeReproduction?.deterministic !== true) {
    failures.push({
      code: "replay_not_deterministic",
      path: "replay",
      reason: "Runtime replay and Judge reproduction must both be deterministic.",
    });
  }

  if (
    bundle.runtimeDecision?.changed !== true ||
    bundle.runtimeDecision?.changedBecauseOfTeacherContext !== true
  ) {
    failures.push({
      code: "runtime_decision_unchanged",
      path: "runtimeDecision",
      reason: "Runtime decision must change because of Teacher Context.",
    });
  }

  return {
    pass: failures.length === 0,
    contractId: expectedContractId,
    failures,
  };
}

export function requiredRuntimeEvidenceFields(): readonly RuntimeEvidenceField[] {
  return REQUIRED_RUNTIME_EVIDENCE_FIELDS;
}
