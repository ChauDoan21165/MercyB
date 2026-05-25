import { describe, it, expect, beforeEach } from "vitest";

import {
  HIGH_SEVERITY_DETECTOR_TAGS,
  SESSION_CAP,
  TAG_TO_NAME_EN,
  getDetectorHint,
  getShownCount,
  hasShownHint,
  markHintShown,
  _resetHintDedupForTesting,
} from "../detectorHint";
import { L1_VN_EXPLANATIONS } from "@/lib/feedback/l1-vn-explanations";
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

  it("returns chip content for every tag in HIGH_SEVERITY_DETECTOR_TAGS", () => {
    // v2 expansion: 6 high + 11 medium = 17 eligible tags. Iterates
    // the Set so the test stays correct if the Set is tuned later.
    expect(HIGH_SEVERITY_DETECTOR_TAGS.size).toBe(17);
    for (const tag of HIGH_SEVERITY_DETECTOR_TAGS) {
      _resetHintDedupForTesting(); // each tag tested independently of the cap
      const hint = getDetectorHint(matched(tag));
      expect(hint, tag).not.toBeNull();
      expect(hint?.nameEn.length, tag).toBeGreaterThan(0);
      expect(hint?.rationaleVi.length, tag).toBeGreaterThan(0);
      expect(hint?.rationaleVi.length, tag).toBeLessThanOrEqual(300);
    }
  });
});

describe("SESSION_CAP — session-wide cap across DIFFERENT tags", () => {
  it("returns chips for the first SESSION_CAP unique tags", () => {
    const tags: string[] = [
      "vi_l1_3rd_person_s",
      "vi_l1_past_ed",
      "vi_l1_missing_be",
    ];
    expect(tags.length).toBe(SESSION_CAP);
    for (const tag of tags) {
      const hint = getDetectorHint(matched(tag));
      expect(hint, tag).not.toBeNull();
      markHintShown(tag as Parameters<typeof markHintShown>[0]);
    }
    expect(getShownCount()).toBe(SESSION_CAP);
  });

  it("returns null for a fresh tag once the cap is reached", () => {
    markHintShown("vi_l1_3rd_person_s");
    markHintShown("vi_l1_past_ed");
    markHintShown("vi_l1_missing_be");
    // 3 tags shown — cap reached. A fresh tag must be filtered.
    expect(getDetectorHint(matched("vi_l1_plural_s"))).toBeNull();
    expect(getDetectorHint(matched("vi_l1_question_no_aux"))).toBeNull();
    expect(getDetectorHint(matched("vi_l1_missing_article"))).toBeNull();
  });

  it("still returns a hint for an ALREADY-shown tag after the cap (call-site dedup decides the no-op)", () => {
    // Cap exists to prevent FATIGUE across NEW tags. Re-emit of the
    // same tag passes the cap so the call site's per-tag dedup can
    // make the final decision without `getDetectorHint` going stale.
    markHintShown("vi_l1_3rd_person_s");
    markHintShown("vi_l1_past_ed");
    markHintShown("vi_l1_missing_be");
    const hint = getDetectorHint(matched("vi_l1_past_ed"));
    expect(hint).not.toBeNull();
    expect(hint?.tag).toBe("vi_l1_past_ed");
  });

  it("does NOT count detections that were filtered out before render", () => {
    // markHintShown is called from DetectorHintChip's useEffect, not
    // from getDetectorHint. A detection that gets through the cap
    // but is then suppressed at the call site (per-tag dedup) does
    // NOT bump the count.
    expect(getShownCount()).toBe(0);
    expect(getDetectorHint(matched("vi_l1_3rd_person_s"))).not.toBeNull();
    // No markHintShown — call site filtered it. Count must stay at 0.
    expect(getShownCount()).toBe(0);
  });
});

describe("TAG_TO_NAME_EN curated labels — v2 medium-severity expansion", () => {
  // Authoring contract for the 11 medium-severity tags surfaced by the
  // C5 recon. These tags become chip-eligible only once the gate
  // expansion lands (PR-A, already merged to main). The labels here
  // (PR-B) ensure the chip never falls back to a mechanical
  // "Missing Article" / "Vs With" type string in production.
  const MEDIUM_TAGS_V2 = [
    // article family (6)
    "vi_l1_missing_article",
    "vi_l1_a_vs_an_vowel",
    "vi_l1_geographical_article",
    "vi_l1_no_article_generic",
    "vi_l1_superlative_the",
    "vi_l1_generic_plural",
    // preposition family (3)
    "vi_l1_preposition_transfer",
    "vi_l1_time_expressions",
    "vi_l1_by_vs_with",
    // pronoun (1)
    "vi_l1_possessive_gender",
    // existential (1)
    "vi_l1_there_are_singular",
  ] as const;

  it("ships a curated English label for every medium v2 tag", () => {
    expect(MEDIUM_TAGS_V2.length).toBe(11);
    for (const tag of MEDIUM_TAGS_V2) {
      const label = TAG_TO_NAME_EN[tag];
      expect(label, tag).toBeTruthy();
      expect(label!.length, tag).toBeGreaterThan(0);
      // Chip badge budget (informal): 32 chars. Labels longer than
      // this can wrap or truncate on a 375px viewport.
      expect(label!.length, tag).toBeLessThanOrEqual(32);
    }
  });

  it("every medium v2 tag has a Vietnamese explanation under the 300-char chip budget", () => {
    for (const tag of MEDIUM_TAGS_V2) {
      const entry = L1_VN_EXPLANATIONS[tag];
      expect(entry, tag).toBeTruthy();
      expect(entry!.explanation_vi.length, tag).toBeGreaterThan(0);
      expect(entry!.explanation_vi.length, tag).toBeLessThanOrEqual(300);
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
