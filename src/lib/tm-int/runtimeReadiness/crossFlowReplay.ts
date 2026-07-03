import type { RuntimeDecisionTraceStage } from "./decisionTrace";
import { generateCompleteRuntimeDecisionTrace } from "./decisionTrace";
import type { RuntimeEvidenceBundle } from "./evidenceBundle";
import { generateRuntimeReadinessReport, type RuntimeReadinessReportJson } from "./readinessReport";

export type CrossFlowType = "placement" | "tutor" | "speaking" | "listening";

export type TeacherContextCarryoverSummary = {
  explicit: boolean;
  summary: string;
  productFailureCarryover: boolean;
  learnerWeaknessFromPriorProductFailure: boolean;
};

export type CrossFlowReplayEntry = {
  flowId: string;
  flowType: CrossFlowType;
  evidenceBundle: RuntimeEvidenceBundle;
  sequenceIndex: number;
  timestamp?: string;
  previousFlowRef?: string;
  teacherContextCarryover: TeacherContextCarryoverSummary;
};

export type CrossFlowReplayPackage = {
  schemaVersion: "tm-int-cross-flow-replay-package-v1";
  packageId: string;
  flows: readonly CrossFlowReplayEntry[];
};

export type CrossFlowReplayValidationFailureCode =
  | "missing_required_flow"
  | "duplicate_sequence_index"
  | "non_deterministic_order"
  | "invalid_runtime_evidence_bundle"
  | "missing_teacher_context_carryover"
  | "prior_product_failure_as_learner_weakness";

export type CrossFlowReplayValidationFailure = {
  code: CrossFlowReplayValidationFailureCode;
  path: string;
  reason: string;
};

export type CrossFlowReplayValidationResult = {
  pass: boolean;
  failures: CrossFlowReplayValidationFailure[];
};

export type CrossFlowCombinedTrace = {
  deterministic: true;
  stages: RuntimeDecisionTraceStage[];
};

export type CrossFlowReadinessSummary = {
  packageId: string;
  verdict: "PASS" | "FAIL";
  flowReports: RuntimeReadinessReportJson[];
  validation: CrossFlowReplayValidationResult;
};

const REQUIRED_FLOW_TYPES: readonly CrossFlowType[] = ["placement", "tutor", "speaking", "listening"];

function hasRuntimeEvidenceBundle(bundle: RuntimeEvidenceBundle | undefined): boolean {
  return Boolean(
    bundle &&
      bundle.schemaVersion === "tm-int-runtime-evidence-bundle-v1" &&
      bundle.runtimeEvent &&
      bundle.obsPacket &&
      bundle.teacherContext &&
      bundle.dpDecision &&
      bundle.pedDecision &&
      bundle.runtimeDecision &&
      bundle.replay &&
      bundle.judgeReproduction,
  );
}

function sortedFlows(replayPackage: CrossFlowReplayPackage): CrossFlowReplayEntry[] {
  return [...replayPackage.flows].sort((a, b) => {
    if (a.sequenceIndex !== b.sequenceIndex) return a.sequenceIndex - b.sequenceIndex;
    return a.flowId.localeCompare(b.flowId);
  });
}

export function validateCrossFlowReplayPackage(replayPackage: CrossFlowReplayPackage): CrossFlowReplayValidationResult {
  const failures: CrossFlowReplayValidationFailure[] = [];
  const presentFlowTypes = new Set(replayPackage.flows.map((flow) => flow.flowType));

  for (const flowType of REQUIRED_FLOW_TYPES) {
    if (!presentFlowTypes.has(flowType)) {
      failures.push({
        code: "missing_required_flow",
        path: "flows",
        reason: `Missing required ${flowType} flow.`,
      });
    }
  }

  const sequenceCounts = new Map<number, number>();
  for (const flow of replayPackage.flows) {
    sequenceCounts.set(flow.sequenceIndex, (sequenceCounts.get(flow.sequenceIndex) ?? 0) + 1);
  }
  for (const [sequenceIndex, count] of sequenceCounts) {
    if (count > 1) {
      failures.push({
        code: "duplicate_sequence_index",
        path: "flows.sequenceIndex",
        reason: `Duplicate sequence index ${sequenceIndex}.`,
      });
    }
  }

  const sequence = replayPackage.flows.map((flow) => flow.sequenceIndex);
  const sortedSequence = [...sequence].sort((a, b) => a - b);
  if (sequence.some((value, index) => value !== sortedSequence[index])) {
    failures.push({
      code: "non_deterministic_order",
      path: "flows",
      reason: "Flows must be stored in deterministic sequence order.",
    });
  }

  replayPackage.flows.forEach((flow, index) => {
    if (!hasRuntimeEvidenceBundle(flow.evidenceBundle)) {
      failures.push({
        code: "invalid_runtime_evidence_bundle",
        path: `flows.${index}.evidenceBundle`,
        reason: `Flow ${flow.flowId} does not contain a valid RuntimeEvidenceBundle.`,
      });
    }

    if (!flow.teacherContextCarryover.explicit || !flow.teacherContextCarryover.summary.trim()) {
      failures.push({
        code: "missing_teacher_context_carryover",
        path: `flows.${index}.teacherContextCarryover`,
        reason: `Flow ${flow.flowId} must include explicit Teacher Context carryover.`,
      });
    }

    if (flow.teacherContextCarryover.learnerWeaknessFromPriorProductFailure) {
      failures.push({
        code: "prior_product_failure_as_learner_weakness",
        path: `flows.${index}.teacherContextCarryover`,
        reason: `Flow ${flow.flowId} converts prior product failure into learner weakness.`,
      });
    }
  });

  return { pass: failures.length === 0, failures };
}

export function generateCrossFlowCombinedTrace(replayPackage: CrossFlowReplayPackage): CrossFlowCombinedTrace {
  return {
    deterministic: true,
    stages: sortedFlows(replayPackage).flatMap((flow) =>
      generateCompleteRuntimeDecisionTrace(flow.evidenceBundle).stages.map((stage) => ({
        ...stage,
        evidenceReference: `${flow.flowId}:${stage.evidenceReference}`,
        summary: `${flow.flowType}#${flow.sequenceIndex}: ${stage.summary}`,
        timestamp: stage.timestamp ?? flow.timestamp,
      })),
    ),
  };
}

export function generateCrossFlowReadinessSummary(replayPackage: CrossFlowReplayPackage): CrossFlowReadinessSummary {
  const validation = validateCrossFlowReplayPackage(replayPackage);
  const flowReports = sortedFlows(replayPackage).map((flow) => generateRuntimeReadinessReport(flow.evidenceBundle).json);
  return {
    packageId: replayPackage.packageId,
    verdict: validation.pass && flowReports.every((report) => report.verdict === "PASS") ? "PASS" : "FAIL",
    flowReports,
    validation,
  };
}
