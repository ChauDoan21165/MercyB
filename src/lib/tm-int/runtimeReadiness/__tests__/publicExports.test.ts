import { describe, expect, it } from "vitest";

import {
  checkReplayDeterminism,
  generateRuntimeDecisionTrace,
  getRuntimeGateContract,
  judgeRuntimeReadinessEvidence,
  requiredRuntimeEvidenceFields,
  RUNTIME_DECISION_TRACE_ORDER,
  validateRuntimeRegressionPack,
  validateTeacherContext,
  type RuntimeEvidenceBundle,
  type RuntimeRegressionPack,
} from "../index";

describe("runtimeReadiness public exports", () => {
  it("exposes representative public APIs through the barrel", () => {
    expect(getRuntimeGateContract("RR-001").gateId).toBe("RR-001");
    expect(requiredRuntimeEvidenceFields()).toContain("teacherContext");
    expect(RUNTIME_DECISION_TRACE_ORDER).toContain("runtimeDecision");
    expect(typeof checkReplayDeterminism).toBe("function");
    expect(typeof generateRuntimeDecisionTrace).toBe("function");
    expect(typeof judgeRuntimeReadinessEvidence).toBe("function");
    expect(typeof validateTeacherContext).toBe("function");
    expect(typeof validateRuntimeRegressionPack).toBe("function");
  });

  it("exports public schema types", () => {
    const bundle = { schemaVersion: "tm-int-runtime-evidence-bundle-v1" } as RuntimeEvidenceBundle;
    const pack = { schemaVersion: "tm-int-runtime-regression-pack-v1" } as RuntimeRegressionPack;

    expect(bundle.schemaVersion).toBe("tm-int-runtime-evidence-bundle-v1");
    expect(pack.schemaVersion).toBe("tm-int-runtime-regression-pack-v1");
  });
});
