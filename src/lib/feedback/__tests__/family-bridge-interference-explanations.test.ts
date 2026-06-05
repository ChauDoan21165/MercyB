import { describe, expect, it } from "vitest";

import { VN_L1_INTERFERENCE_PATTERNS } from "../../../data/placement/vnL1Interference.js";
import {
  VN_INTERFERENCE_FAMILY_BRIDGE_EXPLANATIONS,
  getVnInterferenceFamilyBridgeExplanation,
  listVnInterferenceFamilyBridgeExplanations,
} from "../family-bridge/interference-explanations.js";
import { FAMILY_BRIDGE_SUMMARY_MAX_CHARS } from "../family-bridge/types.js";

const INTERFERENCE_IDS = VN_L1_INTERFERENCE_PATTERNS.map(
  (pattern) => pattern.id
);

describe("VN_INTERFERENCE_FAMILY_BRIDGE_EXPLANATIONS", () => {
  it("covers all 37 Vietnamese L1 interference patterns", () => {
    expect(VN_INTERFERENCE_FAMILY_BRIDGE_EXPLANATIONS).toHaveLength(37);
    expect(
      VN_INTERFERENCE_FAMILY_BRIDGE_EXPLANATIONS.map((entry) => entry.tag)
    ).toEqual(INTERFERENCE_IDS);
  });

  it("keeps every entry draft-only until Chau validates it", () => {
    for (const entry of VN_INTERFERENCE_FAMILY_BRIDGE_EXPLANATIONS) {
      expect(entry.source).toBe("interference");
      expect(entry.validated).toBe(false);
      expect(entry.reviewStatus).toBe("draft");
    }
  });

  it("keeps parent summaries inside the mobile display budget", () => {
    const overBudget = VN_INTERFERENCE_FAMILY_BRIDGE_EXPLANATIONS.filter(
      (entry) => entry.parentSummaryVi.length > FAMILY_BRIDGE_SUMMARY_MAX_CHARS
    ).map((entry) => entry.tag);

    expect(overBudget).toEqual([]);
  });

  it("uses family-facing third-person copy, not direct child-address copy", () => {
    const disallowedPatterns = [
      { name: "standalone con", pattern: /(^|[^a-zà-ỹ])con([^a-zà-ỹ]|$)/i },
      { name: "direct bạn cần", pattern: /bạn cần/i },
      { name: "direct bạn nên", pattern: /bạn nên/i },
      { name: "direct bạn hãy", pattern: /bạn hãy/i },
    ];

    for (const entry of VN_INTERFERENCE_FAMILY_BRIDGE_EXPLANATIONS) {
      const text = [
        entry.patternNameVi,
        entry.parentSummaryVi,
        entry.whyVi,
        entry.howToHelpVi,
        entry.encouragementVi,
        entry.example.glossVi,
      ].join("\n");

      for (const { name, pattern } of disallowedPatterns) {
        expect(pattern.test(text), `${entry.tag} contains ${name}`).toBe(false);
      }
    }
  });

  it("frames pragmatics, calques, and idioms as context code-switching", () => {
    const tagsNeedingContextFrame = [
      "literal_vietnamese_calques",
      "idiom_literal_interpretation",
      "direct_request_transfer",
      "formality_calibration",
      "apology_explanation_before_responsibility",
      "refusal_softening_gap",
      "greeting_small_talk_transfer",
    ];

    for (const tag of tagsNeedingContextFrame) {
      const entry = getVnInterferenceFamilyBridgeExplanation(tag);
      expect(entry).not.toBeNull();

      const text = [
        entry?.whyVi,
        entry?.howToHelpVi,
        entry?.encouragementVi,
        entry?.reviewNote,
      ].join("\n");

      expect(text).toMatch(/ngữ cảnh|chuyển mã|mã tiếng Anh|mã ngôn ngữ/);
      expect(text).not.toMatch(
        /thiếu hiểu biết|kém|yếu|sai văn hóa|sai thái độ/i
      );
    }
  });

  it("exposes list and lookup helpers", () => {
    expect(listVnInterferenceFamilyBridgeExplanations()).toBe(
      VN_INTERFERENCE_FAMILY_BRIDGE_EXPLANATIONS
    );
    expect(
      getVnInterferenceFamilyBridgeExplanation("past_tense_unmarked")?.tag
    ).toBe("past_tense_unmarked");
    expect(getVnInterferenceFamilyBridgeExplanation("unknown")).toBeNull();
  });
});
