import { describe, it, expect, beforeEach } from "vitest";

import {
  HIGH_SEVERITY_DETECTOR_TAGS,
  getDetectorHint,
  hasShownHint,
  markHintShown,
  _resetHintDedupForTesting,
} from "../detectorHint";
import type { L1DetectionResult } from "@/lib/feedback/l1-error-detector";

beforeEach(() => {
  _resetHintDedupForTesting();
});

const matched = (tag: string): L1DetectionResult =>
  ({
    matched: true,
    weaknessTag: tag as L1DetectionResult extends { weaknessTag: infer T } ? T : never,
    feedback: { en: "x", vi: "y" },
  }) as L1DetectionResult;

const unmatched: L1DetectionResult = {
  matched: false,
  weaknessTag: null,
  feedback: null,
};

describe("getDetectorHint", () => {
  it("returns null when the detector did not match", () => {
    expect(getDetectorHint(unmatched)).toBeNull();
  });

  it("returns null for a matched tag that is NOT high-severity", () => {
    // vi_l1_make_vs_do is a real tag but not in the high-severity set.
    expect(getDetectorHint(matched("vi_l1_make_vs_do"))).toBeNull();
  });

  it("returns chip content for a matched high-severity tag", () => {
    const hint = getDetectorHint(matched("vi_l1_3rd_person_s"));
    expect(hint).not.toBeNull();
    expect(hint?.tag).toBe("vi_l1_3rd_person_s");
    expect(hint?.nameEn).toBe("Third-person -s");
    // rationale is sourced from L1_VN_EXPLANATIONS — Vietnamese teacher voice.
    expect(hint?.rationaleVi.length).toBeGreaterThan(0);
    expect(hint?.rationaleVi.length).toBeLessThanOrEqual(300);
  });

  it("returns chip content for all 6 high-severity tags", () => {
    for (const tag of HIGH_SEVERITY_DETECTOR_TAGS) {
      const hint = getDetectorHint(matched(tag));
      expect(hint, tag).not.toBeNull();
      expect(hint?.nameEn.length, tag).toBeGreaterThan(0);
      expect(hint?.rationaleVi.length, tag).toBeGreaterThan(0);
    }
  });
});

describe("hasShownHint / markHintShown (session dedup)", () => {
  it("returns false before the tag is recorded", () => {
    expect(hasShownHint("vi_l1_3rd_person_s")).toBe(false);
  });

  it("returns true after markHintShown", () => {
    markHintShown("vi_l1_3rd_person_s");
    expect(hasShownHint("vi_l1_3rd_person_s")).toBe(true);
  });

  it("dedups by tag — recording one tag doesn't suppress another", () => {
    markHintShown("vi_l1_past_ed");
    expect(hasShownHint("vi_l1_past_ed")).toBe(true);
    expect(hasShownHint("vi_l1_plural_s")).toBe(false);
  });

  it("persists across multiple reads within the session", () => {
    markHintShown("vi_l1_missing_be");
    markHintShown("vi_l1_question_no_aux");
    expect(hasShownHint("vi_l1_missing_be")).toBe(true);
    expect(hasShownHint("vi_l1_question_no_aux")).toBe(true);
  });
});
