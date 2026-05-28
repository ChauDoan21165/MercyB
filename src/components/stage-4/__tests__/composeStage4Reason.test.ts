/**
 * Stage 4 (L4) — reason composer tests (Q5=B).
 *
 * The composer turns a STRUCTURED `TriggerReason` into VI/EN copy. These
 * tests assert it resolves labels through the taxonomy (never raw tags),
 * handles every reason kind, and stays within the no-gamification /
 * no-shame copy contract.
 */

import { describe, expect, it } from "vitest";

import {
  FORBIDDEN_PHRASES,
  FORBIDDEN_REGEXES,
} from "@/lib/stage-3b/suggestionEngine";
import { describeL1Tag } from "@/lib/stage-3a/taxonomy";
import type { TriggerReason } from "@/lib/stage-4/types";

import { composeStage4Reason } from "../composeStage4Reason";

describe("composeStage4Reason", () => {
  it("composes VI/EN copy from a repeated_l1_pattern reason via the taxonomy", () => {
    const reason: TriggerReason = {
      kind: "repeated_l1_pattern",
      tag: "vi_l1_past_ed",
      count: 3,
    };
    const out = composeStage4Reason(reason);
    const label = describeL1Tag("vi_l1_past_ed");
    expect(out.vi).toContain(label.shortVi);
    expect(out.en).toContain(label.shortEn);
    // Never leak the raw engineer tag into learner-facing copy.
    expect(out.vi).not.toContain("vi_l1_past_ed");
    expect(out.en).not.toContain("vi_l1_past_ed");
  });

  it("handles a high_severity_placement reason", () => {
    const out = composeStage4Reason({
      kind: "high_severity_placement",
      tag: "past_tense_unmarked",
    });
    expect(out.vi.length).toBeGreaterThan(0);
    expect(out.en.length).toBeGreaterThan(0);
  });

  it("handles a high_error_phoneme reason", () => {
    const out = composeStage4Reason({
      kind: "high_error_phoneme",
      axis: "TH_T",
      errorRate: 0.6,
    });
    expect(out.vi.length).toBeGreaterThan(0);
    expect(out.en.length).toBeGreaterThan(0);
  });

  it("emits no gamification / shame / daily-requirement language", () => {
    const reasons: TriggerReason[] = [
      { kind: "repeated_l1_pattern", tag: "vi_l1_past_ed", count: 5 },
      { kind: "high_severity_placement", tag: "past_tense_unmarked" },
      { kind: "high_error_phoneme", axis: "TH_T", errorRate: 0.7 },
    ];
    for (const reason of reasons) {
      const { vi, en } = composeStage4Reason(reason);
      const haystack = `${vi} ${en}`.toLowerCase();
      for (const phrase of FORBIDDEN_PHRASES) {
        expect(haystack).not.toContain(phrase.toLowerCase());
      }
      for (const re of FORBIDDEN_REGEXES) {
        expect(re.test(haystack)).toBe(false);
      }
    }
  });
});
