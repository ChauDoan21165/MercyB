/**
 * Sửa câu leniency contract tests — pins the boundary between:
 *   (a) acceptable variants that MUST NOT be rewritten (pass-through)
 *   (b) real errors that MUST be corrected
 *   (c) fragments / broken input that MUST be routed to AI (needs_ai), never silently approved
 *
 * Regression case Q1 (Chau prod finding 2026-06-10):
 *   "a good mother yesterday and invited her..." was shown as "câu của bạn đã rõ" — a clear
 *   fragment silently approved. The fragment detector and the buildGrammarExplanation guard
 *   added in this MR prevent recurrence.
 */
import { describe, expect, it } from "vitest";
import { correctWithTutorRules } from "@/lib/tutor/correctionEngine";

// ─── (A) Acceptable variants — MUST NOT be rewritten ─────────────────────────
// These are grammatically valid sentences a Vietnamese learner might write.
// The rule engine must NOT change them (status: unchanged or corrected with same text after
// normalisation). Strictly: result.corrected.toLowerCase().replace(/[.!?]$/, "")
// === input.toLowerCase().replace(/[.!?]$/, "")  OR  status === "unchanged".
describe("Sửa câu contract — (A) acceptable variants must pass through", () => {
  it.each([
    // Simple correct present-tense sentences
    ["I go to school every day.", "correct present-tense routine"],
    ["She speaks English well.", "correct third-person present"],
    ["He bought a new car last week.", "correct past tense"],
    ["We are happy today.", "correct be-verb"],
    ["I am interested in this job.", "correct 'interested in' prep phrase"],
    ["They have two children.", "correct plural + have"],
    ["My mother cooks rice every morning.", "correct present routine"],
    ["I study English because I want a good job.", "correct compound sentence"],
    // Sentences with time markers that ARE correctly formed
    ["I went to the market yesterday.", "correct past with 'went'"],
    ["She worked hard last week.", "correct past regular"],
  ])("%s (%s) → must not be rewritten", (input) => {
    const result = correctWithTutorRules(input, "en");
    if (result.status === "corrected") {
      // If a rule fires, the corrected text must not be identical to input (that would be a
      // no-op correction — a separate bug). But more importantly it should not CHANGE a correct
      // sentence. For these cases we assert no rule fires (unchanged) as the primary signal.
      // If a future rule accidentally fires here, this test catches it.
      expect(result.status, `rule fired unexpectedly on "${input}"`).toBe("unchanged");
    } else {
      expect(result.status).toBe("unchanged");
    }
  });
});

// ─── (B) Real errors — MUST be corrected (status: corrected) or routed to AI ─
describe("Sửa câu contract — (B) real errors must be corrected or routed to AI", () => {
  it.each([
    // Past-tense markers with wrong verb form
    ["I go to school yesterday.", "past with present tense verb"],
    ["She eat rice last night.", "past with bare verb"],
    ["He have a test yesterday.", "past with 'have'"],
    // Subject-verb agreement
    ["She go to work every day.", "third-person present missing -s"],
    ["He eat lunch every day.", "third-person present bare verb"],
    // Note: "they was → they were" (was/were agreement) is outside current rule coverage —
    // that path goes to AI via needs_ai fallback rather than a deterministic rule fix.
    // Missing article
    ["She is teacher.", "missing article before profession"],
    // Missing preposition
    ["I go school.", "missing 'to' before school"],
  ])("%s (%s) → must be corrected or routed to AI, never unchanged", (input) => {
    const result = correctWithTutorRules(input, "en");
    // A real error must NEVER pass through as unchanged — it must be corrected or sent to AI.
    expect(
      result.status,
      `"${input}" should be corrected or needs_ai, not unchanged`,
    ).not.toBe("unchanged");
  });
});

// ─── (C) Fragments / broken input — MUST route to AI (needs_ai), never approved ─
// Q1 regression: article-initiated noun phrases with no finite verb in the first clause.
describe("Sửa câu contract — (C) fragments must route to AI, never silently approved", () => {
  it.each([
    // Q1 named regression case (Chau prod finding 2026-06-10)
    [
      "a good mother yesterday and invited her",
      "Q1 regression — article NP, no verb before 'and'",
    ],
    // Other clear article-initiated fragments
    ["a beautiful day and no school", "article NP + conj, no verb"],
    ["a hardworking student and never late", "article NP + conj + adverb, no verb"],
    ["an old man yesterday and helped me", "article NP + time adverb + conj, no verb"],
    ["a big problem and nobody solved it", "article NP + conj, no verb in first clause"],
  ])("%s (%s) → must be needs_ai, never unchanged", (input) => {
    const result = correctWithTutorRules(input, "en");
    expect(
      result.status,
      `fragment "${input}" was silently approved — must route to AI`,
    ).toBe("needs_ai");
  });
});
