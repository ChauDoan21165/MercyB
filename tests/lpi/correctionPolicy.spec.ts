import { describe, expect, it } from "vitest";
import {
  applyCorrectionPolicyDecision,
  decideCorrection,
  type PolicyInput,
} from "@/services/lpi/correctionPolicy";

const baseInput: PolicyInput = {
  detectorTag: "vi_l1_missing_article",
  severity: "medium",
  recurrenceCount: 1,
  sessionErrorDensity: 0.2,
  consecutiveErrors: 1,
  correctionsThisBurst: 0,
};

function decide(overrides: Partial<PolicyInput>) {
  return decideCorrection({ ...baseInput, ...overrides });
}

describe("LPI correction suppression policy v1", () => {
  it("corrects the first occurrence even during high-density sessions", () => {
    expect(decide({
      recurrenceCount: 0,
      sessionErrorDensity: 0.9,
      severity: "low",
    })).toEqual({
      action: "correct_now",
      reason: "first_occurrence_teach_cause",
    });
  });

  it("allows one correction in a consecutive-error burst", () => {
    expect(decide({
      recurrenceCount: 1,
      consecutiveErrors: 4,
      correctionsThisBurst: 0,
    })).toEqual({
      action: "correct_now",
      reason: "burst_cap_one",
    });
  });

  it("defers after the burst cap has already been used", () => {
    expect(decide({
      recurrenceCount: 1,
      consecutiveErrors: 4,
      correctionsThisBurst: 1,
    })).toEqual({
      action: "defer_to_recap",
      reason: "burst_cap_exceeded",
    });
  });

  it("defers repeat tags without hammering the same correction", () => {
    expect(decide({ recurrenceCount: 2 })).toEqual({
      action: "defer_to_recap",
      reason: "repeat_tag_no_hammer",
    });
  });

  it("logs low-severity corrections silently during high-density sessions", () => {
    expect(decide({
      recurrenceCount: 1,
      sessionErrorDensity: 0.61,
      severity: "low",
    })).toEqual({
      action: "log_silently",
      reason: "density_low_severity",
    });
  });

  it("defers non-low severity corrections during high-density sessions", () => {
    expect(decide({
      recurrenceCount: 1,
      sessionErrorDensity: 0.61,
      severity: "medium",
    })).toEqual({
      action: "defer_to_recap",
      reason: "density_defer",
    });
  });

  it("uses correct_now as the default", () => {
    expect(decide({})).toEqual({
      action: "correct_now",
      reason: "default",
    });
  });

  it("defers high severity during high density and never silences it", () => {
    expect(decide({
      recurrenceCount: 1,
      sessionErrorDensity: 0.95,
      severity: "high",
    })).toEqual({
      action: "defer_to_recap",
      reason: "density_defer",
    });
  });

  it("keeps shadow mode render behavior unchanged at the wiring seam", () => {
    const decision = {
      action: "log_silently" as const,
      reason: "density_low_severity",
    };

    expect(applyCorrectionPolicyDecision("shadow", decision)).toEqual({
      shouldRenderCorrection: true,
      shouldQueueRecap: false,
      shouldLogSilently: false,
    });
  });
});
