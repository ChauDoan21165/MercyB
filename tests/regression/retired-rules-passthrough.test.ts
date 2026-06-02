// tests/regression/retired-rules-passthrough.test.ts
//
// Retirement pass-through locks for stub correction rules that Lane A has
// RETIRED. A retired rule has no positives, so it cannot form a Pattern-B
// golden fixture (the golden harness requires >=3 positives). Instead we lock
// the retirement directly: each former trigger input must now be returned
// UNCHANGED by correctWithTutorRules, with NO rule firing — i.e. the rule is
// gone and nothing else picked up its inputs.
//
// Every expectation here was captured from the live engine on current main.
// Add a new describe block per rule the instant Lane A retires it (re-probe
// first to confirm pass-through + that no other rule now fires).

import { describe, expect, it } from "vitest";
import { correctWithTutorRules } from "@/lib/tutor/correctionEngine";

/** Assert the input is returned verbatim and no correction rule fired. */
function expectPassThrough(input: string): void {
  const r = correctWithTutorRules(input, "en");
  expect(r.corrected, `"${input}" must pass through unchanged`).toBe(input);
  expect(r.status, `"${input}" status`).toBe("unchanged");
  expect(
    r.appliedRuleIds,
    `"${input}" must fire no rule; got [${r.appliedRuleIds.join(", ")}]`,
  ).toEqual([]);
}

describe("retired-rule pass-through — en-hat-biking-summer-runon (retired !324/!326)", () => {
  // This stub over-fired and FABRICATED content (a bike input became a hat
  // sentence). Post-retirement these three must pass through untouched.
  it.each([
    "I bought a bike yesterday, summer is hot.",
    "They bought a bicycle yesterday in Canada.",
    "I bought a hat yesterday because it is sunny.",
  ])("passes through unchanged: %s", (input) => {
    expectPassThrough(input);
  });
});

// NOTE: en-step6-morning-routine-subject-carryover and
// en-runon-morning-routine-punctuation are RETIRE-recommended but still LIVE
// (they fire today). Their pass-through locks are STAGED in
// golden-set/_pending-guards/staged-lock-fixtures.md and move here the moment
// Lane A retires them.
