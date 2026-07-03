import { describe, expect, it } from "vitest";

import { createValidRuntimeEvidenceBundle } from "../fixtureBuilder";
import type { RuntimeEvidenceBundle } from "../evidenceBundle";
import { generateRuntimeDecisionTrace, RUNTIME_DECISION_TRACE_ORDER } from "../decisionTrace";

describe("generateRuntimeDecisionTrace", () => {
  it("generates a passing decision trace", () => {
    const trace = generateRuntimeDecisionTrace(createValidRuntimeEvidenceBundle());

    expect(trace.missingStages).toEqual([]);
    expect(trace.stages.every((stage) => stage.pass)).toBe(true);
  });

  it("orders stages deterministically", () => {
    const trace = generateRuntimeDecisionTrace(createValidRuntimeEvidenceBundle());

    expect(trace.stages.map((stage) => stage.stageId)).toEqual(RUNTIME_DECISION_TRACE_ORDER);
    expect(generateRuntimeDecisionTrace(createValidRuntimeEvidenceBundle())).toEqual(trace);
  });

  it("detects missing stages", () => {
    const partial = createValidRuntimeEvidenceBundle() as Partial<RuntimeEvidenceBundle>;
    delete partial.pedDecision;

    const trace = generateRuntimeDecisionTrace(partial);

    expect(trace.missingStages).toEqual(["pedDecision"]);
    expect(trace.stages.find((stage) => stage.stageId === "pedDecision")).toMatchObject({
      pass: false,
      evidenceReference: "ped:missing",
    });
  });
});
