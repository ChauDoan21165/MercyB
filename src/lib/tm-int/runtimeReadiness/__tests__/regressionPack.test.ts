import { describe, expect, it } from "vitest";

import {
  createValidCrossFlowReplayPackage,
  createValidRegressionPack,
  createValidRuntimeEvidenceBundle,
} from "../fixtureBuilder";
import type { RuntimeRegressionPack } from "../regressionPack";
import {
  generateRuntimeRegressionPackReportSummary,
  validateRuntimeRegressionPack,
} from "../regressionPack";

function regressionPack(overrides: Partial<RuntimeRegressionPack> = {}): RuntimeRegressionPack {
  return {
    ...createValidRegressionPack(),
    ...overrides,
  };
}

describe("validateRuntimeRegressionPack", () => {
  it("passes a valid RR-001 regression pack", () => {
    expect(validateRuntimeRegressionPack(regressionPack())).toEqual({ pass: true, failures: [] });
  });

  it("passes a valid cross-flow regression pack", () => {
    const result = validateRuntimeRegressionPack(regressionPack({
      packId: "cross-flow-regression-pack",
      sourceRuntimeGateId: "RR-005",
      evidenceBundles: [],
      crossFlowPackage: createValidCrossFlowReplayPackage(),
    }));

    expect(result).toEqual({ pass: true, failures: [] });
  });

  it("fails missing pack id", () => {
    const result = validateRuntimeRegressionPack(regressionPack({ packId: "" }));

    expect(result.failures).toContainEqual(expect.objectContaining({ code: "missing_pack_id" }));
  });

  it("fails missing source gate id", () => {
    const result = validateRuntimeRegressionPack(regressionPack({ sourceRuntimeGateId: "" as never }));

    expect(result.failures).toContainEqual(expect.objectContaining({ code: "missing_source_gate_id" }));
  });

  it("fails no evidence", () => {
    const result = validateRuntimeRegressionPack(regressionPack({ evidenceBundles: [], crossFlowPackage: undefined }));

    expect(result.failures).toContainEqual(expect.objectContaining({ code: "no_evidence" }));
  });

  it("fails invalid Judge verdict", () => {
    const result = validateRuntimeRegressionPack(regressionPack({ expectedJudgeVerdict: "MAYBE" as never }));

    expect(result.failures).toContainEqual(expect.objectContaining({ code: "invalid_judge_verdict" }));
  });

  it("fails unknown invariant", () => {
    const result = validateRuntimeRegressionPack(regressionPack({ requiredInvariants: ["unknown_invariant" as never] }));

    expect(result.failures).toContainEqual(expect.objectContaining({ code: "unknown_invariant" }));
  });

  it("fails determinism waived without reason", () => {
    const result = validateRuntimeRegressionPack(regressionPack({
      replayDeterminism: { required: false, waiverReason: "" },
    }));

    expect(result.failures).toContainEqual(expect.objectContaining({ code: "determinism_waived_without_reason" }));
  });

  it("fails invalid educational risk tag", () => {
    const result = validateRuntimeRegressionPack(regressionPack({ educationalRiskTags: ["unknown_tag" as never] }));

    expect(result.failures).toContainEqual(expect.objectContaining({ code: "invalid_educational_risk_tag" }));
  });

  it("fails product failure encoded as learner weakness", () => {
    const unsafe = createValidRuntimeEvidenceBundle();
    unsafe.dpDecision = {
      ...unsafe.dpDecision,
      learnerWeakness: true,
      reason: "weak listening caused product failure",
    };

    const result = validateRuntimeRegressionPack(regressionPack({ evidenceBundles: [unsafe] }));

    expect(result.failures).toContainEqual(expect.objectContaining({ code: "product_failure_as_learner_weakness" }));
  });
});

describe("generateRuntimeRegressionPackReportSummary", () => {
  it("generates a report summary", () => {
    const summary = generateRuntimeRegressionPackReportSummary(regressionPack());

    expect(summary).toMatchObject({
      packId: "fixture-regression-pack",
      verdict: "PASS",
      evidenceReportCount: 1,
    });
    expect(summary.reports[0].schemaVersion).toBe("tm-int-runtime-readiness-report-v1");
  });
});
