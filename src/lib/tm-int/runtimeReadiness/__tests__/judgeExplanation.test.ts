import { describe, expect, it } from "vitest";

import { explainRuntimeReadinessJudge } from "../judgeExplanation";

describe("explainRuntimeReadinessJudge", () => {
  it("includes PASS reasons", () => {
    const explanation = explainRuntimeReadinessJudge({
      judgeResult: { pass: true, contractId: "RR-001", failures: [] },
      teacherContextValidation: { pass: true, failures: [] },
      replayDeterminism: { pass: true, deterministic: true, mismatchStages: [], reasons: [] },
      runtimeDecisionChanged: true,
      evidenceSummary: {
        contractId: "RR-001",
        factCount: 5,
        learningSignalCount: 1,
        recommendationCount: 3,
      },
    });

    expect(explanation.pass).toBe(true);
    expect(explanation.summary).toContain("PASS");
    expect(explanation.reasons).toContain("Teacher Context validation passed.");
    expect(explanation.reasons).toContain("Replay determinism passed.");
    expect(explanation.reasons).toContain("Runtime decision changed because of Teacher Context.");
  });

  it("includes FAIL stage and reason", () => {
    const explanation = explainRuntimeReadinessJudge({
      judgeResult: {
        pass: false,
        contractId: "RR-001",
        failures: [
          {
            code: "ped_without_dp",
            path: "dpDecision",
            reason: "PED evidence cannot be accepted without a prior DP decision trace.",
          },
        ],
      },
      teacherContextValidation: { pass: true, failures: [] },
      replayDeterminism: { pass: true, deterministic: true, mismatchStages: [], reasons: [] },
      runtimeDecisionChanged: true,
      evidenceSummary: {
        contractId: "RR-001",
        factCount: 5,
        learningSignalCount: 1,
        recommendationCount: 3,
      },
    });

    expect(explanation.pass).toBe(false);
    expect(explanation.summary).toContain("FAIL");
    expect(explanation.reasons).toContain(
      "Failed invariant/stage: ped_without_dp at dpDecision: PED evidence cannot be accepted without a prior DP decision trace.",
    );
  });

  it("reports Teacher Context validator failures", () => {
    const explanation = explainRuntimeReadinessJudge({
      judgeResult: {
        pass: false,
        contractId: "RR-001",
        failures: [
          {
            code: "missing_replay_trace",
            path: "teacherContext.replayTrace",
            reason: "Teacher Context must include replay trace.",
          },
        ],
      },
      teacherContextValidation: {
        pass: false,
        failures: [
          {
            code: "missing_replay_trace",
            path: "teacherContext.replayTrace",
            reason: "Teacher Context must include replay trace.",
          },
        ],
      },
      replayDeterminism: {
        pass: false,
        deterministic: false,
        mismatchStages: ["teacherContext"],
        reasons: ["teacherContext mismatch between replay bundles."],
      },
      runtimeDecisionChanged: false,
      evidenceSummary: {
        contractId: "RR-001",
        factCount: 5,
        learningSignalCount: 0,
        recommendationCount: 0,
      },
    });

    expect(explanation.reasons.join("\n")).toContain(
      "Teacher Context validation failed: missing_replay_trace at teacherContext.replayTrace.",
    );
    expect(explanation.reasons.join("\n")).toContain("Replay determinism failed: teacherContext mismatch between replay bundles.");
    expect(explanation.reasons).toContain("Runtime decision did not change because of Teacher Context.");
  });
});
