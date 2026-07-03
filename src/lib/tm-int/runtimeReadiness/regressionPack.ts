import { RUNTIME_GATE_CONTRACTS, REQUIRED_RUNTIME_INVARIANTS, type RuntimeGateId, type RuntimeReadinessInvariant } from "./contracts";
import type { CrossFlowReplayPackage } from "./crossFlowReplay";
import { generateCrossFlowReadinessSummary } from "./crossFlowReplay";
import type { RuntimeEvidenceBundle } from "./evidenceBundle";
import { generateRuntimeReadinessReport, type RuntimeReadinessReportJson } from "./readinessReport";

export type RuntimeRegressionJudgeVerdict = "PASS" | "FAIL";

export type RuntimeRegressionEducationalRiskTag =
  | "product_failure"
  | "permission_block"
  | "assessment_validity"
  | "learner_weakness_safety"
  | "replay_determinism"
  | "teacher_context_integrity";

export type RuntimeRegressionFixtureMetadata = {
  fixtureId: string;
  sourceCommit?: string;
  description: string;
};

export type RuntimeRegressionDeterminismRequirement =
  | { required: true }
  | { required: false; waiverReason: string };

export type RuntimeRegressionExpectedReportSummary = {
  verdict: RuntimeRegressionJudgeVerdict;
  requiredSections: readonly string[];
};

export type RuntimeRegressionPack = {
  schemaVersion: "tm-int-runtime-regression-pack-v1";
  packId: string;
  version: string;
  sourceRuntimeGateId: RuntimeGateId;
  evidenceBundles: readonly RuntimeEvidenceBundle[];
  crossFlowPackage?: CrossFlowReplayPackage;
  expectedJudgeVerdict: RuntimeRegressionJudgeVerdict;
  expectedReadinessReportSummary: RuntimeRegressionExpectedReportSummary;
  requiredInvariants: readonly RuntimeReadinessInvariant[];
  replayDeterminism: RuntimeRegressionDeterminismRequirement;
  educationalRiskTags: readonly RuntimeRegressionEducationalRiskTag[];
  fixtureMetadata: RuntimeRegressionFixtureMetadata;
};

export type RuntimeRegressionPackFailureCode =
  | "missing_pack_id"
  | "missing_source_gate_id"
  | "no_evidence"
  | "invalid_judge_verdict"
  | "unknown_invariant"
  | "determinism_waived_without_reason"
  | "invalid_educational_risk_tag"
  | "product_failure_as_learner_weakness"
  | "report_summary_unavailable";

export type RuntimeRegressionPackFailure = {
  code: RuntimeRegressionPackFailureCode;
  path: string;
  reason: string;
};

export type RuntimeRegressionPackValidationResult = {
  pass: boolean;
  failures: RuntimeRegressionPackFailure[];
};

export type RuntimeRegressionPackReportSummary = {
  packId: string;
  verdict: RuntimeRegressionJudgeVerdict;
  evidenceReportCount: number;
  crossFlowVerdict?: RuntimeRegressionJudgeVerdict;
  reports: RuntimeReadinessReportJson[];
  validation: RuntimeRegressionPackValidationResult;
};

const KNOWN_GATE_IDS = new Set<string>(RUNTIME_GATE_CONTRACTS.map((contract) => contract.gateId));
const KNOWN_INVARIANTS = new Set<string>(REQUIRED_RUNTIME_INVARIANTS);
const KNOWN_RISK_TAGS = new Set<string>([
  "product_failure",
  "permission_block",
  "assessment_validity",
  "learner_weakness_safety",
  "replay_determinism",
  "teacher_context_integrity",
]);

const LEARNER_WEAKNESS_PATTERN =
  /weak listening|weak speaking|poor learner|bad learner|bad comprehension|poor pronunciation|low ability|lazy|careless|learner weakness/i;

function hasEvidence(pack: RuntimeRegressionPack): boolean {
  return pack.evidenceBundles.length > 0 || Boolean(pack.crossFlowPackage);
}

function productFailureAsLearnerWeakness(pack: RuntimeRegressionPack): boolean {
  return /product_failure|product_or_permission_block|AudioUnavailable|AudioDurationZero|AudioPlaybackFailed|MicPermissionDenied/i.test(JSON.stringify(pack)) &&
    LEARNER_WEAKNESS_PATTERN.test(JSON.stringify(pack));
}

export function validateRuntimeRegressionPack(pack: RuntimeRegressionPack): RuntimeRegressionPackValidationResult {
  const failures: RuntimeRegressionPackFailure[] = [];

  if (!pack.packId.trim()) {
    failures.push({
      code: "missing_pack_id",
      path: "packId",
      reason: "Regression pack id is required.",
    });
  }

  if (!pack.sourceRuntimeGateId || !KNOWN_GATE_IDS.has(pack.sourceRuntimeGateId)) {
    failures.push({
      code: "missing_source_gate_id",
      path: "sourceRuntimeGateId",
      reason: "Regression pack source runtime gate id must reference a known gate.",
    });
  }

  if (!hasEvidence(pack)) {
    failures.push({
      code: "no_evidence",
      path: "evidenceBundles",
      reason: "Regression pack must include at least one RuntimeEvidenceBundle or CrossFlowReplayPackage.",
    });
  }

  if (pack.expectedJudgeVerdict !== "PASS" && pack.expectedJudgeVerdict !== "FAIL") {
    failures.push({
      code: "invalid_judge_verdict",
      path: "expectedJudgeVerdict",
      reason: "Expected Judge verdict must be PASS or FAIL.",
    });
  }

  for (const invariant of pack.requiredInvariants) {
    if (!KNOWN_INVARIANTS.has(invariant)) {
      failures.push({
        code: "unknown_invariant",
        path: "requiredInvariants",
        reason: `Unknown invariant ${invariant}.`,
      });
    }
  }

  if (pack.replayDeterminism.required === false && !pack.replayDeterminism.waiverReason.trim()) {
    failures.push({
      code: "determinism_waived_without_reason",
      path: "replayDeterminism.waiverReason",
      reason: "Replay determinism waiver must include a reason.",
    });
  }

  for (const tag of pack.educationalRiskTags) {
    if (!KNOWN_RISK_TAGS.has(tag)) {
      failures.push({
        code: "invalid_educational_risk_tag",
        path: "educationalRiskTags",
        reason: `Unknown educational risk tag ${tag}.`,
      });
    }
  }

  if (productFailureAsLearnerWeakness(pack)) {
    failures.push({
      code: "product_failure_as_learner_weakness",
      path: "educationalRiskTags",
      reason: "Regression pack encodes product failure as learner weakness.",
    });
  }

  try {
    generateRuntimeRegressionPackReportSummary(pack);
  } catch (error) {
    failures.push({
      code: "report_summary_unavailable",
      path: "expectedReadinessReportSummary",
      reason: error instanceof Error ? error.message : "Readiness report summary could not be generated.",
    });
  }

  return { pass: failures.length === 0, failures };
}

export function generateRuntimeRegressionPackReportSummary(pack: RuntimeRegressionPack): RuntimeRegressionPackReportSummary {
  if (!hasEvidence(pack)) throw new Error("No evidence available for report summary.");

  const reports = pack.evidenceBundles.map((bundle) => generateRuntimeReadinessReport(bundle).json);
  const crossFlowSummary = pack.crossFlowPackage ? generateCrossFlowReadinessSummary(pack.crossFlowPackage) : undefined;
  const validation: RuntimeRegressionPackValidationResult = { pass: true, failures: [] };
  const allReportsPass = reports.every((report) => report.verdict === "PASS");
  const crossFlowPass = !crossFlowSummary || crossFlowSummary.verdict === "PASS";

  return {
    packId: pack.packId,
    verdict: allReportsPass && crossFlowPass ? "PASS" : "FAIL",
    evidenceReportCount: reports.length,
    crossFlowVerdict: crossFlowSummary?.verdict,
    reports,
    validation,
  };
}
