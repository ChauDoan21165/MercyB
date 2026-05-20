import { describe, expect, it } from "vitest";
import { classifyEnduranceFailure } from "../../../src/lib/placement/v3/classifyEnduranceFailures";

describe("placement v3 endurance failure classifier", () => {
  it("clusters retry storms", () => {
    expect(classifyEnduranceFailure({ retries: 6 }).category).toBe("retry_storm");
  });

  it("escalates large retry storms", () => {
    expect(classifyEnduranceFailure({ retries: 12 }).severity).toBe("high");
  });

  it("clusters timeout text", () => {
    expect(classifyEnduranceFailure({ message: "Writing grader timed out" }).category).toBe("timeout_cluster");
  });

  it("clusters timeout counts", () => {
    expect(classifyEnduranceFailure({ timeouts: 3 }).category).toBe("timeout_cluster");
  });

  it("clusters invalid state transitions", () => {
    expect(classifyEnduranceFailure({ code: "invalid_transition" }).category).toBe("state_corruption");
  });

  it("clusters session not found as state corruption", () => {
    expect(classifyEnduranceFailure({ code: "session_not_found" }).category).toBe("state_corruption");
  });

  it("clusters memory growth", () => {
    expect(classifyEnduranceFailure({ memoryGrowthMb: 64 }).category).toBe("memory_growth");
  });

  it("escalates severe memory growth", () => {
    expect(classifyEnduranceFailure({ memoryGrowthMb: 120 }).severity).toBe("high");
  });

  it("clusters duplicate submissions", () => {
    expect(classifyEnduranceFailure({ duplicateSubmissions: 1 }).category).toBe("duplicate_submission");
  });

  it("clusters replay text as duplicate submission", () => {
    expect(classifyEnduranceFailure({ message: "replayed submission" }).category).toBe("duplicate_submission");
  });

  it("clusters persistence failures", () => {
    expect(classifyEnduranceFailure({ persistenceErrors: 1 }).category).toBe("persistence_failure");
  });

  it("clusters recommendation failures", () => {
    expect(classifyEnduranceFailure({ recommendationErrors: 1 }).category).toBe("recommendation_failure");
  });

  it("clusters UI degradation", () => {
    expect(classifyEnduranceFailure({ uiErrors: 1 }).category).toBe("ui_degradation");
  });

  it("clusters slow sessions relative to baseline", () => {
    expect(classifyEnduranceFailure({ durationMs: 3000, baselineDurationMs: 1000 }).category).toBe("ui_degradation");
  });

  it("returns unknown for unrecognized low-signal failures", () => {
    expect(classifyEnduranceFailure({ message: "misc" }).category).toBe("unknown");
  });
});
