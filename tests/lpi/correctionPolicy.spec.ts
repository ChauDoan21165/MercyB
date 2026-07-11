import { describe, expect, it } from "vitest";
import {
  applyCorrectionPolicyDecision,
  decideCorrection,
  type PolicyInput,
} from "@/services/lpi/correctionPolicy";

const baseInput: PolicyInput = {
  detectorTag: "vi_l1_missing_article",
  severity: "form",
  recurrenceCount: 1,
  sessionErrorDensity: 0.2,
  consecutiveErrors: 1,
  correctionsThisBurst: 0,
};

function decide(overrides: Partial<PolicyInput>) {
  return decideCorrection({ ...baseInput, ...overrides });
}

describe("LPI correction suppression policy v2", () => {
  it("corrects meaning-blocking errors even during high-density bursts", () => {
    expect(decide({
      detectorTag: "wrong-keyword",
      severity: "meaning_blocking",
      recurrenceCount: 4,
      sessionErrorDensity: 0.9,
      consecutiveErrors: 5,
      correctionsThisBurst: 2,
    })).toEqual({
      action: "correct_now",
      reason: "meaning_blocking_repair",
    });
  });

  it("keeps negation reversals correct-now as a confusable-negative class", () => {
    expect(decide({
      detectorTag: "negation-reversal",
      severity: "meaning_blocking",
      recurrenceCount: 2,
      sessionErrorDensity: 1,
      consecutiveErrors: 4,
    })).toEqual({
      action: "correct_now",
      reason: "meaning_blocking_repair",
    });
  });

  it("keeps wrong-keyword meaning substitutions correct-now as a confusable-negative class", () => {
    expect(decide({
      detectorTag: "wrong-keyword",
      severity: "meaning_blocking",
      recurrenceCount: 1,
      sessionErrorDensity: 1,
      consecutiveErrors: 3,
    })).toEqual({
      action: "correct_now",
      reason: "meaning_blocking_repair",
    });
  });

  it("defers target forms in a consecutive-error burst", () => {
    expect(decide({
      severity: "target_form",
      recurrenceCount: 2,
      consecutiveErrors: 4,
    })).toEqual({
      action: "defer_to_recap",
      reason: "burst_form_defer",
    });
  });

  it("logs fluency noise silently in a consecutive-error burst", () => {
    expect(decide({
      severity: "fluency",
      recurrenceCount: 5,
      consecutiveErrors: 4,
    })).toEqual({
      action: "log_silently",
      reason: "burst_low_severity_silent",
    });
  });

  it("logs first and low-recurrence minor issues silently", () => {
    expect(decide({
      recurrenceCount: 1,
      severity: "minor",
    })).toEqual({
      action: "log_silently",
      reason: "low_severity_flow_first",
    });
  });

  it("defers repeated minor issues as recap patterns outside bursts", () => {
    expect(decide({
      recurrenceCount: 3,
      severity: "minor",
    })).toEqual({
      action: "defer_to_recap",
      reason: "low_severity_repeated_pattern",
    });
  });

  it("corrects persistent form patterns in calm sessions", () => {
    expect(decide({
      severity: "form",
      recurrenceCount: 3,
      sessionErrorDensity: 0.4,
      consecutiveErrors: 1,
    })).toEqual({
      action: "correct_now",
      reason: "persistent_form_calm_correct",
    });
  });

  it("defers low-recurrence form issues instead of interrupting", () => {
    expect(decide({
      severity: "form",
      recurrenceCount: 0,
      sessionErrorDensity: 0.2,
      consecutiveErrors: 0,
    })).toEqual({
      action: "defer_to_recap",
      reason: "form_first_or_low_recurrence_defer",
    });
  });

  it("logs low-recurrence form errors silently in high-density moments", () => {
    expect(decide({
      severity: "form",
      recurrenceCount: 1,
      sessionErrorDensity: 1,
      consecutiveErrors: 3,
    })).toEqual({
      action: "log_silently",
      reason: "density_form_low_recurrence_silent",
    });
  });

  it("corrects target forms in calm sessions", () => {
    expect(decide({
      severity: "target_form",
      recurrenceCount: 1,
      sessionErrorDensity: 0.4,
      consecutiveErrors: 1,
    })).toEqual({
      action: "correct_now",
      reason: "target_form_teach_now",
    });
  });

  it("keeps shadow mode render behavior unchanged at the wiring seam", () => {
    const decision = {
      action: "log_silently" as const,
      reason: "low_severity_flow_first",
    };

    expect(applyCorrectionPolicyDecision("shadow", decision)).toEqual({
      shouldRenderCorrection: true,
      shouldQueueRecap: false,
      shouldLogSilently: false,
    });
  });
});
