import type { RuntimeReadinessJudgeResult } from "./judgeRubric";
import type { ReplayDeterminismResult } from "./replayDeterminism";
import type { TeacherContextValidationResult } from "./teacherContextValidator";

export type JudgeExplanationInput = {
  judgeResult: RuntimeReadinessJudgeResult;
  teacherContextValidation: TeacherContextValidationResult;
  replayDeterminism: ReplayDeterminismResult;
  runtimeDecisionChanged: boolean;
  evidenceSummary: {
    contractId: string;
    factCount: number;
    learningSignalCount: number;
    recommendationCount: number;
  };
};

export type JudgeExplanation = {
  pass: boolean;
  summary: string;
  reasons: string[];
};

export function explainRuntimeReadinessJudge(input: JudgeExplanationInput): JudgeExplanation {
  const reasons: string[] = [];

  reasons.push(
    `Evidence summary: contract=${input.evidenceSummary.contractId}, facts=${input.evidenceSummary.factCount}, ` +
      `learningSignals=${input.evidenceSummary.learningSignalCount}, recommendations=${input.evidenceSummary.recommendationCount}.`,
  );

  reasons.push(
    input.teacherContextValidation.pass
      ? "Teacher Context validation passed."
      : `Teacher Context validation failed: ${input.teacherContextValidation.failures.map((failure) => `${failure.code} at ${failure.path}`).join("; ")}.`,
  );

  reasons.push(
    input.replayDeterminism.pass
      ? "Replay determinism passed."
      : `Replay determinism failed: ${input.replayDeterminism.reasons.join("; ")}`,
  );

  reasons.push(
    input.runtimeDecisionChanged
      ? "Runtime decision changed because of Teacher Context."
      : "Runtime decision did not change because of Teacher Context.",
  );

  if (!input.judgeResult.pass) {
    for (const failure of input.judgeResult.failures) {
      reasons.push(`Failed invariant/stage: ${failure.code} at ${failure.path}: ${failure.reason}`);
    }
  }

  return {
    pass: input.judgeResult.pass,
    summary: input.judgeResult.pass
      ? "PASS: runtime readiness evidence satisfies Judge rubric."
      : "FAIL: runtime readiness evidence violates Judge rubric.",
    reasons,
  };
}
