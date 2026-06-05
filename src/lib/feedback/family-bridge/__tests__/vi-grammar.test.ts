import { describe, expect, it } from "vitest";

// Extensionless import is deliberate: it (a) typechecks under Bundler
// resolution and (b) registers vi-grammar.ts as imported for the CI
// orphan guard (a `.js`-suffixed specifier would not — see
// scripts/ci/check-new-orphans.mjs).
import { VI_GRAMMAR_FAMILY_BRIDGE } from "../vi-grammar";
import {
  FAMILY_BRIDGE_SUMMARY_MAX_CHARS,
  type FamilyBridgeCefr,
} from "../types";

const CEFR: readonly FamilyBridgeCefr[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

/** VN prose fields that must follow the locked family-bridge voice. */
const PROSE_FIELDS = [
  "parentSummaryVi",
  "whyVi",
  "howToHelpVi",
  "encouragementVi",
] as const;

describe("VI_GRAMMAR_FAMILY_BRIDGE — A1–A2 locked pilot", () => {
  it("has 10 entries with unique vi_l1_* tags", () => {
    expect(VI_GRAMMAR_FAMILY_BRIDGE).toHaveLength(10);
    const tags = VI_GRAMMAR_FAMILY_BRIDGE.map((e) => e.tag);
    expect(new Set(tags).size).toBe(tags.length);
    for (const tag of tags) expect(tag.startsWith("vi_l1_")).toBe(true);
  });

  it("anchors every entry to the grammar_rule source with a valid CEFR band", () => {
    for (const e of VI_GRAMMAR_FAMILY_BRIDGE) {
      expect(e.source).toBe("grammar_rule");
      expect(CEFR).toContain(e.cefr);
    }
  });

  it("is fully validated/approved (voice LOCKED by Chau 2026-06-05)", () => {
    for (const e of VI_GRAMMAR_FAMILY_BRIDGE) {
      expect(e.validated).toBe(true);
      expect(e.reviewStatus).toBe("approved");
    }
  });

  it("keeps the parent summary within the mobile budget", () => {
    for (const e of VI_GRAMMAR_FAMILY_BRIDGE) {
      expect(e.parentSummaryVi.length).toBeLessThanOrEqual(
        FAMILY_BRIDGE_SUMMARY_MAX_CHARS,
      );
    }
  });

  it("has every required content field non-empty", () => {
    for (const e of VI_GRAMMAR_FAMILY_BRIDGE) {
      for (const f of [
        e.patternNameVi,
        e.patternLabelEn,
        e.parentSummaryVi,
        e.whyVi,
        e.howToHelpVi,
        e.encouragementVi,
        e.example.learnerSays,
        e.example.naturalForm,
        e.example.glossVi,
        e.version,
      ]) {
        expect(typeof f).toBe("string");
        expect(f.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("follows the locked voice: addresses the learner as 'bạn', never 'con'", () => {
    for (const e of VI_GRAMMAR_FAMILY_BRIDGE) {
      // The why always speaks to the learner directly.
      expect(e.whyVi).toContain("bạn");
      // No learner-addressing "con" in any prose field. "con số" (= the
      // number) is the one allowed standalone use; strip it before the check.
      for (const field of PROSE_FIELDS) {
        const cleaned = e[field].replace(/con số/g, "");
        expect(cleaned).not.toMatch(/\bcon\b/);
      }
    }
  });
});
