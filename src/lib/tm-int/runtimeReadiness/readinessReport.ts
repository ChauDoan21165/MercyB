import type { RuntimeEvidenceBundle } from "./evidenceBundle";
import { explainRuntimeReadinessJudge, type JudgeExplanation } from "./judgeExplanation";
import { judgeRuntimeReadinessEvidence, type RuntimeReadinessJudgeResult } from "./judgeRubric";
import { checkReplayDeterminism, type ReplayDeterminismResult } from "./replayDeterminism";
import { generateCompleteRuntimeDecisionTrace, type RuntimeDecisionTrace } from "./decisionTrace";
import { validateTeacherContext, type TeacherContextValidationResult } from "./teacherContextValidator";

export type RuntimeReadinessReportJson = {
  schemaVersion: "tm-int-runtime-readiness-report-v1";
  contractId: string;
  verdict: "PASS" | "FAIL";
  runtimeFlow: RuntimeDecisionTrace;
  teacherContextValidation: TeacherContextValidationResult;
  replayDeterminism: ReplayDeterminismResult;
  educationalInvariants: RuntimeReadinessJudgeResult["failures"];
  dpPedSequence: {
    hasDpBeforePed: boolean;
    dpSource: string;
    pedSource: string;
  };
  runtimeDecision: RuntimeEvidenceBundle["runtimeDecision"];
  judgeExplanation: JudgeExplanation;
};

export type RuntimeReadinessReport = {
  json: RuntimeReadinessReportJson;
  markdown: string;
};

function hasDpBeforePed(bundle: RuntimeEvidenceBundle): boolean {
  const dpIndex = bundle.teacherContext.replayTrace.findIndex((step) => step.stage === "DP");
  const pedIndex = bundle.teacherContext.replayTrace.findIndex((step) => step.stage === "PED");
  return dpIndex >= 0 && pedIndex > dpIndex;
}

function markdownVerdict(report: RuntimeReadinessReportJson): string {
  return [
    `# Runtime Readiness Report: ${report.contractId}`,
    "",
    `Overall verdict: ${report.verdict}`,
    "",
    "## Runtime Flow",
    ...report.runtimeFlow.stages.map((stage) =>
      `- ${stage.stageId}: ${stage.pass ? "PASS" : "FAIL"} - ${stage.summary} (${stage.evidenceReference})`,
    ),
    "",
    "## Teacher Context Validation",
    ...(report.teacherContextValidation.pass
      ? ["- PASS"]
      : report.teacherContextValidation.failures.map((failure) => `- FAIL ${failure.code}: ${failure.reason}`)),
    "",
    "## Replay Determinism",
    report.replayDeterminism.pass
      ? "- PASS deterministic replay"
      : `- FAIL ${report.replayDeterminism.reasons.join("; ")}`,
    "",
    "## DP/PED Sequence",
    `- ${report.dpPedSequence.hasDpBeforePed ? "PASS" : "FAIL"} DP=${report.dpPedSequence.dpSource} PED=${report.dpPedSequence.pedSource}`,
    "",
    "## Runtime Decision",
    `- ${report.runtimeDecision.summary}`,
    `- changed=${report.runtimeDecision.changed}`,
    `- changedBecauseOfTeacherContext=${report.runtimeDecision.changedBecauseOfTeacherContext}`,
    "",
    "## Judge Explanation",
    `- ${report.judgeExplanation.summary}`,
    ...report.judgeExplanation.reasons.map((reason) => `- ${reason}`),
  ].join("\n");
}

export function generateRuntimeReadinessReport(
  first: RuntimeEvidenceBundle,
  second: RuntimeEvidenceBundle = first,
): RuntimeReadinessReport {
  const teacherContextValidation = validateTeacherContext(first);
  const replayDeterminism = checkReplayDeterminism(first, second);
  const judgeResult = judgeRuntimeReadinessEvidence(first, first.contractId);
  const runtimeFlow = generateCompleteRuntimeDecisionTrace(first);
  const judgeExplanation = explainRuntimeReadinessJudge({
    judgeResult,
    teacherContextValidation,
    replayDeterminism,
    runtimeDecisionChanged: first.runtimeDecision.changed && first.runtimeDecision.changedBecauseOfTeacherContext,
    evidenceSummary: {
      contractId: first.contractId,
      factCount: first.obsPacket.facts.length,
      learningSignalCount: first.learningSignals.length,
      recommendationCount: first.teacherContext.recommendations.length,
    },
  });

  const json: RuntimeReadinessReportJson = {
    schemaVersion: "tm-int-runtime-readiness-report-v1",
    contractId: first.contractId,
    verdict: judgeResult.pass && teacherContextValidation.pass && replayDeterminism.pass ? "PASS" : "FAIL",
    runtimeFlow,
    teacherContextValidation,
    replayDeterminism,
    educationalInvariants: judgeResult.failures,
    dpPedSequence: {
      hasDpBeforePed: hasDpBeforePed(first),
      dpSource: first.dpDecision.source,
      pedSource: first.pedDecision.source,
    },
    runtimeDecision: first.runtimeDecision,
    judgeExplanation,
  };

  return {
    json,
    markdown: markdownVerdict(json),
  };
}
