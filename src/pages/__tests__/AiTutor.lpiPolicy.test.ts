import { describe, expect, it } from "vitest";

import {
  buildLpiPolicyInput,
  createLpiSessionTracker,
  resolveCorrectionSeverity,
  updateLpiTurnDensity,
} from "../AiTutor";
import { decideCorrection } from "@/services/lpi/correctionPolicy";

describe("AiTutor LPI policy input wiring", () => {
  it("does not allow high-density policy rules on the first observed error turn", () => {
    const tracker = createLpiSessionTracker();
    const rawDensity = updateLpiTurnDensity(tracker, true);
    const input = buildLpiPolicyInput(tracker, "generic-form-slip", rawDensity);

    expect(rawDensity).toBe(1);
    expect(tracker.recentErrorTurns).toHaveLength(1);
    expect(input).toMatchObject({
      severity: "form",
      sessionErrorDensity: 0,
      recurrenceCount: 0,
      consecutiveErrors: 1,
    });
    expect(decideCorrection(input)).toEqual({
      action: "defer_to_recap",
      reason: "form_first_or_low_recurrence_defer",
    });
  });

  it("allows high-density policy rules after three observed turns with majority errors", () => {
    const tracker = createLpiSessionTracker();
    updateLpiTurnDensity(tracker, true);
    updateLpiTurnDensity(tracker, false);
    const rawDensity = updateLpiTurnDensity(tracker, true);
    tracker.tagCounts.set("generic-form-slip", 1);
    const input = buildLpiPolicyInput(tracker, "generic-form-slip", rawDensity);

    expect(rawDensity).toBeCloseTo(2 / 3);
    expect(tracker.recentErrorTurns).toHaveLength(3);
    expect(input).toMatchObject({
      severity: "form",
      sessionErrorDensity: rawDensity,
      recurrenceCount: 1,
    });
    expect(decideCorrection(input)).toEqual({
      action: "log_silently",
      reason: "density_form_low_recurrence_silent",
    });
  });

  it("maps first-turn flagship missing-be errors to target-form correction", () => {
    const tracker = createLpiSessionTracker();
    const rawDensity = updateLpiTurnDensity(tracker, true);
    const input = buildLpiPolicyInput(tracker, "vi_l1_missing_be", rawDensity);

    expect(resolveCorrectionSeverity("vi_l1_missing_be")).toBe("target_form");
    expect(input).toMatchObject({
      severity: "target_form",
      sessionErrorDensity: 0,
      recurrenceCount: 0,
    });
    expect(decideCorrection(input)).toEqual({
      action: "correct_now",
      reason: "target_form_teach_now",
    });
  });

  it("maps shipped vi-to-en L1 rule ids to target form", () => {
    expect(resolveCorrectionSeverity("vi_l1_past_ed")).toBe("target_form");
    expect(resolveCorrectionSeverity("en-vn-copula-be-adjective")).toBe("target_form");
    expect(resolveCorrectionSeverity("en-vn-past-marker-regular-verb")).toBe("target_form");
  });
});
