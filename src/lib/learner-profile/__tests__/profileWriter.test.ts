import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createLearnerProfileWriter,
  derivePatternCodeFromRuleIds,
  normalizePatternCode,
  type LearnerProfileWritePayload,
} from "../profileWriter";

describe("learner profile writer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.clear();
  });

  it("batches correction pattern events and writes no learner text", async () => {
    const payloads: LearnerProfileWritePayload[] = [];
    const writer = createLearnerProfileWriter({
      getSession: async () => ({ accessToken: "jwt" }),
      invoke: async (payload) => {
        payloads.push(payload);
        return { error: null };
      },
      readNativeLanguage: () => "vi",
    });

    writer.recordCorrection({ appliedRuleIds: ["en-yesterday-irregular-beginner-past"] });
    writer.recordCorrection({ patternCode: "missing be from Vietnamese transfer" });

    await vi.runOnlyPendingTimersAsync();

    expect(payloads).toHaveLength(1);
    expect(payloads[0].patterns).toEqual([
      {
        pattern_code: "tense-omission",
        l1: "vi",
        occurrence_count: 1,
        resolved_count: 0,
        example_unit_id: null,
        syntheticMonitoring: null,
      },
      {
        pattern_code: "zero-copula",
        l1: "vi",
        occurrence_count: 1,
        resolved_count: 0,
        example_unit_id: null,
        syntheticMonitoring: null,
      },
    ]);
    expect(JSON.stringify(payloads[0])).not.toMatch(/learnerText|correctedText|input_text|hello/i);
  });

  it("skips signed-out learners", async () => {
    const invoke = vi.fn(async () => ({ error: null }));
    const writer = createLearnerProfileWriter({
      getSession: async () => ({ accessToken: null }),
      invoke,
      readNativeLanguage: () => "vi",
    });

    writer.recordCorrection({ patternCode: "missing-article" });
    await vi.runOnlyPendingTimersAsync();

    expect(invoke).not.toHaveBeenCalled();
  });

  it("is fail-soft when the edge function rejects", async () => {
    const log = vi.fn();
    const writer = createLearnerProfileWriter({
      getSession: async () => ({ accessToken: "jwt" }),
      invoke: async () => {
        throw new Error("network down");
      },
      log,
      readNativeLanguage: () => "vi",
    });

    writer.recordCorrection({ patternCode: "missing-article" });
    await vi.runOnlyPendingTimersAsync();
    expect(log).toHaveBeenCalledWith("[learner-profile] write_failed", expect.any(Error));
  });

  it("reads the synthetic marker per emission inside one batch", async () => {
    const payloads: LearnerProfileWritePayload[] = [];
    let marker: string | null = null;
    const writer = createLearnerProfileWriter({
      getSession: async () => ({ accessToken: "jwt" }),
      invoke: async (payload) => {
        payloads.push(payload);
        return { error: null };
      },
      readNativeLanguage: () => "vi",
      readSyntheticMarker: () => marker,
    });

    writer.recordCorrection({ patternCode: "missing-article" });
    marker = "1";
    writer.recordCorrection({ patternCode: "tense-omission" });
    await vi.runOnlyPendingTimersAsync();

    expect(payloads[0].patterns.map((pattern) => pattern.syntheticMonitoring)).toEqual([null, "1"]);
  });

  it("maps only the existing tutor/weakness taxonomy", () => {
    expect(normalizePatternCode("article omission")).toBe("missing-article");
    expect(normalizePatternCode("subject verb agreement")).toBe("subj-verb-agreement");
    expect(normalizePatternCode("word choice")).toBe("word_choice");
    expect(derivePatternCodeFromRuleIds(["en-discuss-about-preposition"])).toBe("preposition-calque");
    expect(normalizePatternCode("brand-new-made-up-code")).toBeNull();
  });
});
