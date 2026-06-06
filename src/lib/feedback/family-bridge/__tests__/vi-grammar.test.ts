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

/** The A1–A2 pilot — voice LOCKED + approved by Chau (2026-06-05). */
const PILOT_APPROVED_TAGS = [
  "vi_l1_3rd_person_s",
  "vi_l1_past_ed",
  "vi_l1_plural_s",
  "vi_l1_missing_be",
  "vi_l1_question_no_aux",
  "vi_l1_missing_article",
  "vi_l1_can_no_infinitive",
  "vi_l1_to_verb_confusion",
  "vi_l1_adjective_order",
  "vi_l1_no_aux_negation",
] as const;

/** Batches 2a + 2b — appended at validated:false, awaiting Chau's sign-off. */
const PENDING_TAGS = [
  // 2a
  "vi_l1_there_are_singular",
  "vi_l1_a_vs_an_vowel",
  "vi_l1_possessive_gender",
  "vi_l1_preposition_transfer",
  "vi_l1_countable",
  "vi_l1_double_past",
  "vi_l1_possessive_s_missing",
  "vi_l1_comparative_double",
  "vi_l1_comparative_more_long",
  "vi_l1_many_with_uncount",
  "vi_l1_countable_much",
  "vi_l1_some_vs_any",
  "vi_l1_do_support_3ps",
  // 2b
  "vi_l1_generic_plural",
  "vi_l1_double_negative",
  "vi_l1_adverb_before_subject",
  "vi_l1_too_vs_very",
  "vi_l1_no_article_generic",
  "vi_l1_superlative_the",
  "vi_l1_subject_gender",
  "vi_l1_future_adverb_bare",
  "vi_l1_co_transfer",
  "vi_l1_everyone_plural",
  "vi_l1_time_expressions",
  "vi_l1_another_vs_other",
  "vi_l1_by_vs_with",
] as const;

/** VN prose fields that must follow the locked family-bridge voice. */
const PROSE_FIELDS = [
  "parentSummaryVi",
  "whyVi",
  "howToHelpVi",
  "encouragementVi",
] as const;

const byTag = (tag: string) =>
  VI_GRAMMAR_FAMILY_BRIDGE.find((e) => e.tag === tag);

describe("VI_GRAMMAR_FAMILY_BRIDGE", () => {
  it("has unique vi_l1_* tags", () => {
    const tags = VI_GRAMMAR_FAMILY_BRIDGE.map((e) => e.tag);
    expect(new Set(tags).size).toBe(tags.length);
    for (const tag of tags) expect(tag.startsWith("vi_l1_")).toBe(true);
  });

  it("anchors every entry to grammar_rule with a valid CEFR band", () => {
    for (const e of VI_GRAMMAR_FAMILY_BRIDGE) {
      expect(e.source).toBe("grammar_rule");
      expect(CEFR).toContain(e.cefr);
    }
  });

  it("keeps validated and reviewStatus consistent", () => {
    for (const e of VI_GRAMMAR_FAMILY_BRIDGE) {
      expect(e.validated).toBe(e.reviewStatus === "approved");
    }
  });

  it("keeps the pilot approved and batch 2a pending Chau", () => {
    for (const tag of PILOT_APPROVED_TAGS) {
      const e = byTag(tag);
      expect(e, `missing pilot tag ${tag}`).toBeDefined();
      expect(e?.validated).toBe(true);
      expect(e?.reviewStatus).toBe("approved");
    }
    for (const tag of PENDING_TAGS) {
      const e = byTag(tag);
      expect(e, `missing pending tag ${tag}`).toBeDefined();
      expect(e?.validated).toBe(false);
      expect(e?.reviewStatus).toBe("needs_chau");
    }
  });

  it("keeps every parent summary within the mobile budget", () => {
    for (const e of VI_GRAMMAR_FAMILY_BRIDGE) {
      expect(
        e.parentSummaryVi.length,
        `summary too long for ${e.tag}`,
      ).toBeLessThanOrEqual(FAMILY_BRIDGE_SUMMARY_MAX_CHARS);
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
      expect(e.whyVi, `whyVi must address bạn in ${e.tag}`).toContain("bạn");
      // No learner-addressing "con" in any prose field. "con số" (= the
      // number) is the one allowed standalone use; strip it before the check.
      for (const field of PROSE_FIELDS) {
        const cleaned = e[field].replace(/con số/g, "");
        expect(cleaned, `learner 'con' found in ${e.tag}.${field}`).not.toMatch(
          /\bcon\b/,
        );
      }
    }
  });
});
