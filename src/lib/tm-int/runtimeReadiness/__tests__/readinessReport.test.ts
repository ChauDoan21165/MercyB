import { describe, expect, it } from "vitest";

import { createValidRuntimeEvidenceBundle } from "../fixtureBuilder";
import { generateRuntimeReadinessReport } from "../readinessReport";

describe("generateRuntimeReadinessReport", () => {
  it("generates a PASS JSON report", () => {
    const report = generateRuntimeReadinessReport(createValidRuntimeEvidenceBundle());

    expect(report.json).toMatchObject({
      schemaVersion: "tm-int-runtime-readiness-report-v1",
      contractId: "RR-001",
      verdict: "PASS",
      dpPedSequence: { hasDpBeforePed: true },
    });
    expect(report.json.runtimeFlow.stages.map((stage) => stage.stageId)).toContain("teacherContext");
  });

  it("generates a FAIL JSON report", () => {
    const valid = createValidRuntimeEvidenceBundle();
    const failed = {
      ...valid,
      runtimeDecision: {
        ...valid.runtimeDecision,
        changed: false,
        changedBecauseOfTeacherContext: false,
      },
    };
    const report = generateRuntimeReadinessReport(failed);

    expect(report.json.verdict).toBe("FAIL");
    expect(report.json.educationalInvariants).toContainEqual(expect.objectContaining({ code: "runtime_decision_unchanged" }));
  });

  it("generates Markdown with Judge explanation", () => {
    const report = generateRuntimeReadinessReport(createValidRuntimeEvidenceBundle());

    expect(report.markdown).toContain("# Runtime Readiness Report: RR-001");
    expect(report.markdown).toContain("## Judge Explanation");
    expect(report.markdown).toContain("PASS: runtime readiness evidence satisfies Judge rubric.");
  });

  it("includes Teacher Context and replay summaries", () => {
    const report = generateRuntimeReadinessReport(createValidRuntimeEvidenceBundle());

    expect(report.markdown).toContain("## Teacher Context Validation");
    expect(report.markdown).toContain("## Replay Determinism");
    expect(report.json.teacherContextValidation.pass).toBe(true);
    expect(report.json.replayDeterminism.pass).toBe(true);
  });
});
