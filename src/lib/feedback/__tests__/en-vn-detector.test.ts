/**
 * Barrel-level end-to-end tests for `detectEnVnError(input)`.
 *
 * These tests exercise the public adapter that AiTutor.tsx (and any
 * future consumer site) calls — proving the full detector pipeline
 * works end-to-end for EN→VN inputs:
 *   userText → normalizeContractions → tokenize → rule registry
 *   → first match → feedback template fill → L1DetectionResult.
 *
 * The rule-pack-level tests in
 *   src/lib/feedback/rule-packs/en-vn/__tests__/rules.test.ts
 * verify the rule functions themselves against fixtures. These tests
 * verify the BARREL — the same public API the consumer site sees.
 */

import { describe, expect, it } from "vitest";

import { detectEnVnError } from "../index.js";

describe("detectEnVnError — barrel adapter end-to-end", () => {
  it("fires en_l1_copula_la_adj on \"Tôi là vui\" (copula + adjective)", () => {
    const result = detectEnVnError({
      userAnswer: "Tôi là vui.",
      expectedAnswer: "Tôi vui.",
    });
    expect(result.matched).toBe(true);
    if (result.matched) {
      expect(result.weaknessTag).toBe("en_l1_copula_la_adj");
      expect(result.feedback.en).toContain("adjective");
      expect(result.feedback.vi.length).toBeGreaterThan(0);
    }
  });

  it("fires en_l1_classifier_omission on \"Tôi mua một sách\" (numeral + bare noun)", () => {
    const result = detectEnVnError({
      userAnswer: "Tôi mua một sách.",
      expectedAnswer: "Tôi mua một cuốn sách.",
    });
    expect(result.matched).toBe(true);
    if (result.matched) {
      expect(result.weaknessTag).toBe("en_l1_classifier_omission");
      // Template fills {NOUN} = "sách" and {NUMERAL} = "một".
      expect(result.feedback.en).toContain("sách");
    }
  });

  it("fires en_l1_aspect_overuse_stative on \"đang muốn\" (progressive + stative)", () => {
    const result = detectEnVnError({
      userAnswer: "Tôi đang muốn ăn phở.",
      expectedAnswer: "Tôi muốn ăn phở.",
    });
    expect(result.matched).toBe(true);
    if (result.matched) {
      expect(result.weaknessTag).toBe("en_l1_aspect_overuse_stative");
      // Template fills {VERB} = "muốn".
      expect(result.feedback.en).toContain("muốn");
    }
  });

  it("returns matched=false when learner input matches expected exactly", () => {
    const result = detectEnVnError({
      userAnswer: "Tôi vui.",
      expectedAnswer: "Tôi vui.",
    });
    expect(result.matched).toBe(false);
  });

  it("returns matched=false on empty input (defensive)", () => {
    const result = detectEnVnError({
      userAnswer: "",
      expectedAnswer: "Tôi vui.",
    });
    expect(result.matched).toBe(false);
  });

  it("isolated from the VN pack — VN-L1 input does not fire EN→VN rules", () => {
    // "She walk to school" is a canonical vi_l1_3rd_person_s case.
    // The EN→VN adapter must NOT fire on it (different rule namespace
    // entirely). Returns matched=false because none of the 8 EN→VN
    // rules match English text.
    const result = detectEnVnError({
      userAnswer: "She walk to school.",
      expectedAnswer: "She walks to school.",
    });
    expect(result.matched).toBe(false);
  });
});
