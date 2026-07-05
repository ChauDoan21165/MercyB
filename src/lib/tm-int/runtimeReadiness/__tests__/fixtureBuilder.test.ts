import { describe, expect, it } from "vitest";

import {
  checkReplayDeterminism,
  createInvalidMissingTeacherContextBundle,
  createProductFailureBundle,
  createReplayPair,
  createTeacherContextValidatorFixture,
  createValidCrossFlowReplayPackage,
  createValidRegressionPack,
  createValidRuntimeEvidenceBundle,
  judgeRuntimeReadinessEvidence,
  validateCrossFlowReplayPackage,
  validateRuntimeRegressionPack,
} from "../index";

describe("runtime readiness fixture builders", () => {
  it("creates a valid bundle that passes the Judge rubric", () => {
    const result = judgeRuntimeReadinessEvidence(createValidRuntimeEvidenceBundle(), "RR-001");

    expect(result).toEqual({ pass: true, contractId: "RR-001", failures: [] });
  });

  it("creates an invalid missing Teacher Context bundle that fails", () => {
    const result = judgeRuntimeReadinessEvidence(createInvalidMissingTeacherContextBundle(), "RR-001");

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "missing_field", path: "teacherContext" }));
  });

  it("creates a product failure bundle without learner weakness classification", () => {
    const bundle = createProductFailureBundle();
    const serialized = JSON.stringify({
      dpDecision: bundle.dpDecision,
      pedDecision: bundle.pedDecision,
      teacherContext: bundle.teacherContext,
    });

    expect(serialized).toContain("product_failure_audio");
    expect(serialized).not.toMatch(/weak listening|weak speaking|poor learner|low ability|lazy|careless/i);
  });

  it("creates an identical replay pair that passes determinism", () => {
    const pair = createReplayPair();

    expect(checkReplayDeterminism(pair.first, pair.second)).toEqual({
      pass: true,
      deterministic: true,
      mismatchStages: [],
      reasons: [],
    });
  });

  it("creates a replay pair with the requested mismatch stage", () => {
    const pair = createReplayPair({ mismatchStage: "teacherContext" });
    const result = checkReplayDeterminism(pair.first, pair.second);

    expect(result.pass).toBe(false);
    expect(result.mismatchStages).toEqual(["teacherContext"]);
  });

  it("creates replay mismatch fixtures without sharing nested evidence objects", () => {
    const pair = createReplayPair({ mismatchStage: "runtimeDecision" });

    pair.second.teacherContext.replayTrace.push({
      stage: "RUNTIME",
      source: "runtime",
      summary: "mutated second replay only",
    });
    pair.second.obsPacket.facts[0].message = "mutated second replay only";

    expect(pair.first.teacherContext.replayTrace).toHaveLength(6);
    expect(pair.first.obsPacket.facts[0].message).toBe("Audio duration was zero.");
  });

  it("creates a valid cross-flow package", () => {
    expect(validateCrossFlowReplayPackage(createValidCrossFlowReplayPackage())).toEqual({
      pass: true,
      failures: [],
    });
  });

  it("creates a valid regression pack", () => {
    expect(validateRuntimeRegressionPack(createValidRegressionPack())).toEqual({
      pass: true,
      failures: [],
    });
  });

  it("exposes fixture builders through the public export surface", () => {
    expect(createValidRuntimeEvidenceBundle().schemaVersion).toBe("tm-int-runtime-evidence-bundle-v1");
    expect(createTeacherContextValidatorFixture().teacherContext.schemaVersion).toBe("tm-int-teacher-context-v1");
    expect(createValidCrossFlowReplayPackage().schemaVersion).toBe("tm-int-cross-flow-replay-package-v1");
    expect(createValidRegressionPack().schemaVersion).toBe("tm-int-runtime-regression-pack-v1");
  });
});
