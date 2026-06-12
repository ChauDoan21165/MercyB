/**
 * GF-5 echo-regression guard — correction step must not echo input.
 *
 * The gate ran 5/5 green while the Sửa câu correction surface was broken
 * (engine returning the input unchanged). This suite prevents that class of
 * regression from ever passing the gate again.
 *
 * Strategy: feed known-bad inputs that well-established rules MUST correct,
 * and assert:
 *   1. corrected (normalized) !== input (normalized) — no echo
 *   2. appliedRuleIds is non-empty — an explanation rule fired
 *
 * Intentionally NOT asserting any exact corrected string — the assertions are
 * resilient to legitimate phrasing variation in the correction output.
 */
import { describe, it, expect } from "vitest";
import { correctWithTutorRules } from "../../../src/lib/tutor/correctionEngine";

function normalize(s: string): string {
  return s.replace(/\s+/g, " ").trim().toLowerCase().replace(/[.!?]+$/, "");
}

const KNOWN_BAD_INPUTS = [
  {
    id: "echo-guard-past-tense-yesterday",
    input: "yesterday I go to school",
    notes: "past-time-marker: 'go' must become 'went'",
  },
  {
    id: "echo-guard-past-tense-last-week",
    input: "last week I buy a book",
    notes: "past-time-marker: 'buy' must become 'bought'",
  },
  {
    id: "echo-guard-sv-agreement",
    input: "She go to the market every day.",
    notes: "third-person-s: 'go' must become 'goes'",
  },
];

describe("GF-5 correction-echo guard — engine must not echo known-bad input", () => {
  for (const fixture of KNOWN_BAD_INPUTS) {
    it(`${fixture.id}: ${fixture.notes}`, () => {
      const result = correctWithTutorRules(fixture.input, "en");

      expect(
        result.status,
        `${fixture.id}: engine returned 'needs_ai' for a rule-handled input — correction step is broken`,
      ).not.toBe("needs_ai");

      expect(
        normalize(result.corrected),
        `${fixture.id}: corrected output echoed the input — echo regression detected`,
      ).not.toBe(normalize(fixture.input));

      expect(
        result.appliedRuleIds.length,
        `${fixture.id}: no rules fired — explanation would be empty`,
      ).toBeGreaterThan(0);
    });
  }
});
