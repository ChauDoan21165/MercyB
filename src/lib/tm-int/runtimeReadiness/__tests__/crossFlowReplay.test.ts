import { describe, expect, it } from "vitest";

import {
  createValidCrossFlowReplayPackage,
  createValidRuntimeEvidenceBundle,
} from "../fixtureBuilder";
import type { CrossFlowReplayEntry, CrossFlowReplayPackage, CrossFlowType } from "../crossFlowReplay";
import {
  generateCrossFlowCombinedTrace,
  generateCrossFlowReadinessSummary,
  validateCrossFlowReplayPackage,
} from "../crossFlowReplay";

function packageWithFlows(flows: readonly CrossFlowReplayEntry[]): CrossFlowReplayPackage {
  return {
    ...createValidCrossFlowReplayPackage(),
    flows,
  };
}

function flow(flowType: CrossFlowType, sequenceIndex: number, previousFlowRef?: string): CrossFlowReplayEntry {
  return {
    flowId: `${flowType}-flow`,
    flowType,
    evidenceBundle: {
      ...createValidRuntimeEvidenceBundle(),
      runtimeEvent: {
        ...createValidRuntimeEvidenceBundle().runtimeEvent,
        eventId: `runtime-event-${flowType}`,
        route: `/${flowType}`,
        eventType: `${flowType}_runtime_decision`,
      },
      runtimeDecision: {
        ...createValidRuntimeEvidenceBundle().runtimeDecision,
        summary: `runtime decision for ${flowType}`,
      },
    },
    sequenceIndex,
    timestamp: `2026-07-03T00:0${sequenceIndex}:00.000Z`,
    previousFlowRef,
    teacherContextCarryover: {
      explicit: true,
      summary: previousFlowRef ? `Carries context from ${previousFlowRef}.` : "Initial placement context.",
      productFailureCarryover: sequenceIndex > 0,
      learnerWeaknessFromPriorProductFailure: false,
    },
  };
}

describe("validateCrossFlowReplayPackage", () => {
  it("passes a valid Placement to Tutor to Speaking to Listening package", () => {
    expect(validateCrossFlowReplayPackage(createValidCrossFlowReplayPackage())).toEqual({ pass: true, failures: [] });
  });

  it("fails when Tutor flow is missing", () => {
    const result = validateCrossFlowReplayPackage(packageWithFlows([
      flow("placement", 0),
      flow("speaking", 1, "placement-flow"),
      flow("listening", 2, "speaking-flow"),
    ]));

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "missing_required_flow" }));
  });

  it("fails duplicate sequence index", () => {
    const result = validateCrossFlowReplayPackage(packageWithFlows([
      flow("placement", 0),
      flow("tutor", 1, "placement-flow"),
      flow("speaking", 1, "tutor-flow"),
      flow("listening", 3, "speaking-flow"),
    ]));

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "duplicate_sequence_index" }));
  });

  it("fails non-deterministic order", () => {
    const result = validateCrossFlowReplayPackage(packageWithFlows([
      flow("placement", 0),
      flow("speaking", 2, "tutor-flow"),
      flow("tutor", 1, "placement-flow"),
      flow("listening", 3, "speaking-flow"),
    ]));

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "non_deterministic_order" }));
  });

  it("fails missing Teacher Context carryover", () => {
    const missingCarryover = {
      ...flow("tutor", 1, "placement-flow"),
      teacherContextCarryover: {
        explicit: false,
        summary: "",
        productFailureCarryover: true,
        learnerWeaknessFromPriorProductFailure: false,
      },
    };

    const result = validateCrossFlowReplayPackage(packageWithFlows([
      flow("placement", 0),
      missingCarryover,
      flow("speaking", 2, "tutor-flow"),
      flow("listening", 3, "speaking-flow"),
    ]));

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "missing_teacher_context_carryover" }));
  });

  it("fails prior product failure converted into learner weakness", () => {
    const unsafeCarryover = {
      ...flow("speaking", 2, "tutor-flow"),
      teacherContextCarryover: {
        explicit: true,
        summary: "Prior product failure means weak speaking.",
        productFailureCarryover: true,
        learnerWeaknessFromPriorProductFailure: true,
      },
    };

    const result = validateCrossFlowReplayPackage(packageWithFlows([
      flow("placement", 0),
      flow("tutor", 1, "placement-flow"),
      unsafeCarryover,
      flow("listening", 3, "speaking-flow"),
    ]));

    expect(result.pass).toBe(false);
    expect(result.failures).toContainEqual(expect.objectContaining({ code: "prior_product_failure_as_learner_weakness" }));
  });
});

describe("cross-flow replay outputs", () => {
  it("generates a combined trace", () => {
    const trace = generateCrossFlowCombinedTrace(createValidCrossFlowReplayPackage());

    expect(trace.deterministic).toBe(true);
    expect(trace.stages).toHaveLength(36);
    expect(trace.stages[0]).toMatchObject({
      evidenceReference: "placement-flow:runtime-event-placement",
      summary: "placement#0: placement_runtime_decision on /placement",
    });
  });

  it("generates a readiness summary", () => {
    const summary = generateCrossFlowReadinessSummary(createValidCrossFlowReplayPackage());

    expect(summary).toMatchObject({
      packageId: "fixture-cross-flow-package",
      verdict: "PASS",
      validation: { pass: true, failures: [] },
    });
    expect(summary.flowReports).toHaveLength(4);
  });
});
