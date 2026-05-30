// tests/regression/correction-golden/correctionGolden.test.ts
//
// Lane-C golden-set regression harness for the beginner-English correction
// engine. This file locks the *observable* behavior of the six rules merged
// in the audit commit ad3641395 ("fix(tutor): tighten correction engine audit
// gaps") so Lane A can keep scaling the interference engine without silently
// regressing correction precision.
//
//   1. be-verb omission            (en-be-verb-omission)
//   2. time-expression placement   (en-time-expression-placement)
//   3. "go school" -> "go to school" (en-step5-preposition-pattern)
//   4. negation guard              (replaceVerbAfterSubject `(?!\s+not\b)`)
//   5. generalized hasPastTimeMarker (en-yesterday-irregular-beginner-past)
//   6. topic-comment word-order    (en-l4-topic-comment-word-order)
//
// We assert against the PUBLIC engine API (`correctWithTutorRules`) rather than
// poking at individual rule functions, so the golden expectations also lock the
// surrounding pipeline (whitespace normalization, first-letter capitalization,
// terminal punctuation, and the needs_ai gate). Each case pins:
//   - status        : "corrected" | "unchanged" | "needs_ai"
//   - corrected text : the exact string the engine returns
//   - rule ids       : which rule(s) must / must not have fired
//
// LANE BOUNDARY: this is a read-only consumer of Lane A source. It imports the
// engine; it never modifies src/lib/tutor/**. Per the brief, a behavior that
// looks wrong is LOCKED at its current value and flagged in the MR description
// (see "Bugs / gaps surfaced") — it is NOT fixed here. A golden test's job is to
// detect *change*, so it must encode what the engine does today, not what we
// wish it did.

import { describe, expect, it } from "vitest";

import {
  correctWithTutorRules,
  isClearlyWrongForTutor,
  AI_CORRECTION_REQUIRED_MESSAGE,
} from "@/lib/tutor/correctionEngine";

type GoldenCase = {
  /** Human-readable why-this-matters note. */
  name: string;
  input: string;
  /** Expected engine status. */
  status: "corrected" | "unchanged" | "needs_ai";
  /** Exact corrected string the engine must return. */
  corrected: string;
  /** Rule ids that MUST appear in appliedRuleIds (precision: the right rule fired). */
  mustFire?: string[];
  /** Rule ids that MUST NOT appear (precision: confusables don't trip the rule). */
  mustNotFire?: string[];
};

function run(c: GoldenCase): void {
  const result = correctWithTutorRules(c.input, "en");
  expect(result.status, `status for: ${c.input}`).toBe(c.status);
  expect(result.corrected, `corrected for: ${c.input}`).toBe(c.corrected);

  for (const id of c.mustFire ?? []) {
    expect(
      result.appliedRuleIds,
      `expected rule "${id}" to fire for: ${c.input}`,
    ).toContain(id);
  }
  for (const id of c.mustNotFire ?? []) {
    expect(
      result.appliedRuleIds,
      `expected rule "${id}" NOT to fire for: ${c.input}`,
    ).not.toContain(id);
  }

  if (c.status === "needs_ai") {
    expect(result.message, `needs_ai message for: ${c.input}`).toBe(
      AI_CORRECTION_REQUIRED_MESSAGE,
    );
  }
}

function table(cases: GoldenCase[]): void {
  for (const c of cases) {
    it(c.name, () => run(c));
  }
}

// ---------------------------------------------------------------------------
// 1. be-verb omission  (en-be-verb-omission)
//    "I very happy" -> "I am very happy". Inserts am/is/are by subject.
// ---------------------------------------------------------------------------
describe("rule: be-verb omission", () => {
  describe("positive — fires and inserts the right copula", () => {
    table([
      {
        name: "first person -> am",
        input: "i very happy today",
        status: "corrected",
        corrected: "I am very happy today.",
        mustFire: ["en-be-verb-omission"],
      },
      {
        name: "third person singular -> is",
        input: "he very tired",
        status: "corrected",
        corrected: "He is very tired.",
        mustFire: ["en-be-verb-omission"],
      },
      {
        name: "plural subject -> are",
        input: "they very busy today",
        status: "corrected",
        corrected: "They are very busy today.",
        mustFire: ["en-be-verb-omission"],
      },
    ]);
  });

  describe("negative — must NOT fire on confusable surfaces", () => {
    table([
      {
        // Already grammatical: subject is followed by "am", not "very".
        name: "already-correct copula sentence is left untouched",
        input: "i am very happy today",
        status: "unchanged",
        corrected: "I am very happy today.",
        mustNotFire: ["en-be-verb-omission"],
      },
      {
        // "very" here modifies "much", not an adjective in the {happy,sad,
        // tired,busy} set, so the omission pattern must not match.
        name: '"very much" is not a missing-copula adjective',
        input: "i very much enjoy reading",
        status: "unchanged",
        corrected: "I very much enjoy reading.",
        mustNotFire: ["en-be-verb-omission"],
      },
    ]);
  });
});

// ---------------------------------------------------------------------------
// 2. time-expression placement  (en-time-expression-placement)
//    Narrow, audited surface: "I yesterday bought a hat" -> hat at the end.
// ---------------------------------------------------------------------------
describe("rule: time-expression placement", () => {
  describe("positive — fires on the audited surface", () => {
    table([
      {
        name: "moves a fronted 'yesterday' to the end",
        input: "i yesterday bought a hat",
        status: "corrected",
        corrected: "I bought a hat yesterday.",
        mustFire: ["en-time-expression-placement"],
      },
    ]);
  });

  describe("negative — narrow by design, must not over-reach", () => {
    table([
      {
        // The rule is anchored to the literal "...bought a hat" surface. The
        // "book" variant is intentionally out of scope (see MR: recall gap,
        // not a bug — no false positive risk).
        name: "does not fire on the un-audited 'book' variant",
        input: "i yesterday bought a book",
        status: "unchanged",
        corrected: "I yesterday bought a book.",
        mustNotFire: ["en-time-expression-placement"],
      },
    ]);
  });
});

// ---------------------------------------------------------------------------
// 3. "go school" -> "go to school"  (folded into en-step5-preposition-pattern)
// ---------------------------------------------------------------------------
describe("rule: go-school preposition insertion", () => {
  describe("positive — inserts the missing 'to'", () => {
    table([
      {
        name: "I go school -> I go to school",
        input: "i go school every day",
        status: "corrected",
        corrected: "I go to school every day.",
        mustFire: ["en-step5-preposition-pattern"],
      },
    ]);
  });

  describe("negative — must NOT fire when 'to' already present / school is not the object", () => {
    table([
      {
        name: "already-correct 'go to school' untouched",
        input: "i go to school every day",
        status: "unchanged",
        corrected: "I go to school every day.",
        mustNotFire: ["en-step5-preposition-pattern"],
      },
      {
        // "school" appears, but not immediately after the verb — it is the
        // head of a noun phrase ("the school festival").
        name: "'go to the school festival' is not a missing-preposition error",
        input: "we go to the school festival",
        status: "unchanged",
        corrected: "We go to the school festival.",
        mustNotFire: ["en-step5-preposition-pattern"],
      },
      {
        // Third-person already-conjugated + already-prepositioned sentence.
        name: "'she goes to school every day' is fully correct",
        input: "she goes to school every day",
        status: "unchanged",
        corrected: "She goes to school every day.",
        mustNotFire: ["en-step5-preposition-pattern"],
      },
    ]);
  });
});

// ---------------------------------------------------------------------------
// 4. negation guard  (replaceVerbAfterSubject `(?!\s+not\b)`)
//    The verb-swap must NOT fire when the verb is immediately negated. The
//    engine then conservatively defers to AI (needs_ai) rather than emitting a
//    naive "do" -> "did" rewrite.
// ---------------------------------------------------------------------------
describe("rule: negation guard on subject-verb swap", () => {
  describe("positive contrast — un-negated verb IS swapped", () => {
    table([
      {
        name: "'I go yesterday' -> 'I went yesterday'",
        input: "i go yesterday",
        status: "corrected",
        corrected: "I went yesterday.",
        mustFire: ["en-yesterday-irregular-beginner-past"],
      },
    ]);
  });

  describe("guard — negated verb is NOT swapped (engine defers to AI)", () => {
    table([
      {
        // Without the `(?!\s+not\b)` guard, "I do" would be rewritten to
        // "I did", producing "I did not go yesterday". The guard blocks the
        // swap; no rule changes the text, so the still-clearly-wrong input
        // routes to needs_ai instead of a naive correction.
        name: "'I do not go yesterday' does not become 'I did not...'",
        input: "i do not go yesterday",
        status: "needs_ai",
        corrected: "",
        mustNotFire: ["en-yesterday-irregular-beginner-past"],
      },
      {
        name: "'I do not eat yesterday' is also guarded -> needs_ai",
        input: "i do not eat yesterday",
        status: "needs_ai",
        corrected: "",
        mustNotFire: ["en-yesterday-irregular-beginner-past"],
      },
    ]);
  });
});

// ---------------------------------------------------------------------------
// 5. generalized hasPastTimeMarker  (en-yesterday-irregular-beginner-past)
//    Broadened from /\byesterday\b/ to also accept "last <unit>" and
//    "<n> <unit> ago". This is the FP-prone change — stressed hardest below.
// ---------------------------------------------------------------------------
describe("rule: generalized hasPastTimeMarker (FP-prone — stressed)", () => {
  describe("positive — every past-marker branch triggers the past-verb swap", () => {
    table([
      {
        name: "yesterday branch",
        input: "i go yesterday",
        status: "corrected",
        corrected: "I went yesterday.",
        mustFire: ["en-yesterday-irregular-beginner-past"],
      },
      {
        name: "last <unit> branch — last week",
        input: "i go last week",
        status: "corrected",
        corrected: "I went last week.",
        mustFire: ["en-yesterday-irregular-beginner-past"],
      },
      {
        name: "last <unit> branch — last night",
        input: "i eat last night",
        status: "corrected",
        corrected: "I ate last night.",
        mustFire: ["en-yesterday-irregular-beginner-past"],
      },
      {
        name: "<n words> <unit> ago branch — two weeks ago",
        input: "they buy two weeks ago",
        status: "corrected",
        corrected: "They bought two weeks ago.",
        mustFire: ["en-yesterday-irregular-beginner-past"],
      },
      {
        name: "<digits> <unit> ago branch — 3 days ago",
        input: "i go 3 days ago",
        status: "corrected",
        corrected: "I went 3 days ago.",
        mustFire: ["en-yesterday-irregular-beginner-past"],
      },
      {
        name: "last <unit> with third-person subject — last year",
        input: "she go last year",
        status: "corrected",
        corrected: "She went last year.",
        mustFire: ["en-yesterday-irregular-beginner-past"],
      },
    ]);
  });

  describe("negative — confusables that look like past markers but are NOT", () => {
    table([
      {
        // "ago" is a substring of "Chicago" — must not be read as the
        // "<n> <unit> ago" past marker.
        // NB: the engine only capitalizes the first character (no proper-noun
        // casing), so "chicago" stays lowercase in the passthrough output.
        name: '"ago" inside "Chicago" is not a past marker',
        input: "i go to chicago",
        status: "unchanged",
        corrected: "I go to chicago.",
        mustNotFire: ["en-yesterday-irregular-beginner-past"],
      },
      {
        // "a day" without a trailing "ago" is not a past marker.
        name: '"a day off" is not "<n> day ago"',
        input: "i want a day off",
        status: "unchanged",
        corrected: "I want a day off.",
        mustNotFire: ["en-yesterday-irregular-beginner-past"],
      },
      {
        // "last lesson" — "last" + a non-time noun must not match the
        // "last <unit>" branch.
        name: '"last lesson" is not "last <time-unit>"',
        input: "we go to the last lesson",
        status: "unchanged",
        corrected: "We go to the last lesson.",
        mustNotFire: ["en-yesterday-irregular-beginner-past"],
      },
      {
        // Number + a non-time, non-empty noun: neither a past marker nor a
        // missing-article/plural error.
        name: '"three apples" (number + non-time noun) is not a past marker',
        input: "i buy three apples",
        status: "unchanged",
        corrected: "I buy three apples.",
        mustNotFire: ["en-yesterday-irregular-beginner-past"],
      },
      {
        // Future marker — only "last", never "next", counts as past.
        // Passthrough only capitalizes the first char, so the mid-sentence
        // "i" stays lowercase — confirming no rule rewrote the sentence.
        name: '"next week" (future) is not a past marker',
        input: "next week i go",
        status: "unchanged",
        corrected: "Next week i go.",
        mustNotFire: ["en-yesterday-irregular-beginner-past"],
      },
    ]);
  });
});

// ---------------------------------------------------------------------------
// 6. topic-comment word-order  (en-l4-topic-comment-word-order)
//    Three audited, anchored surfaces. FP-prone in the broadening direction —
//    stressed hardest with grammatical look-alikes that MUST stay untouched.
// ---------------------------------------------------------------------------
describe("rule: topic-comment word-order (FP-prone — stressed)", () => {
  describe("positive — each audited surface re-orders correctly", () => {
    table([
      {
        name: "'This book I like' -> 'I like this book'",
        input: "this book i like",
        status: "corrected",
        corrected: "I like this book.",
        mustFire: ["en-l4-topic-comment-word-order"],
      },
      {
        name: "'English I study every day' -> 'I study English every day'",
        input: "english i study every day",
        status: "corrected",
        corrected: "I study English every day.",
        mustFire: ["en-l4-topic-comment-word-order"],
      },
      {
        name: "'In my family, my mother I love very much' re-orders",
        input: "in my family, my mother i love very much",
        status: "corrected",
        corrected: "In my family, I love my mother very much.",
        mustFire: ["en-l4-topic-comment-word-order"],
      },
      {
        name: "comma after 'family' is optional",
        input: "in my family my mother i love very much",
        status: "corrected",
        corrected: "In my family, I love my mother very much.",
        mustFire: ["en-l4-topic-comment-word-order"],
      },
      {
        name: "trailing period on the input is absorbed",
        input: "this book i like.",
        status: "corrected",
        corrected: "I like this book.",
        mustFire: ["en-l4-topic-comment-word-order"],
      },
    ]);
  });

  describe("negative — grammatical look-alikes must stay untouched (no false positive)", () => {
    table([
      {
        name: "already-correct 'I like this book' is untouched",
        input: "i like this book",
        status: "unchanged",
        corrected: "I like this book.",
        mustNotFire: ["en-l4-topic-comment-word-order"],
      },
      {
        // A longer, correct sentence that merely contains the trigger words —
        // firing here would mangle valid English.
        name: "'This book is the one I like' is correct, not topic-comment",
        input: "this book is the one i like",
        status: "unchanged",
        corrected: "This book is the one i like.",
        mustNotFire: ["en-l4-topic-comment-word-order"],
      },
      {
        // Extra trailing words break the anchored match — must not partial-fire.
        name: "'This book I like a lot' (extra words) does not fire",
        input: "this book i like a lot",
        status: "unchanged",
        corrected: "This book i like a lot.",
        mustNotFire: ["en-l4-topic-comment-word-order"],
      },
      {
        name: "'English is what I study every day' is correct English",
        input: "english is what i study every day",
        status: "unchanged",
        corrected: "English is what i study every day.",
        mustNotFire: ["en-l4-topic-comment-word-order"],
      },
      {
        // The third surface is hardcoded to "my mother". The "father" variant
        // is out of scope (see MR: recall gap, not a bug — no FP risk).
        name: "'my father' variant is out of scope (does not fire)",
        input: "in my family, my father i love very much",
        status: "unchanged",
        corrected: "In my family, my father i love very much.",
        mustNotFire: ["en-l4-topic-comment-word-order"],
      },
      {
        // Requires the "in my family" prefix; the bare clause must not fire.
        name: "'My mother I love very much' (no prefix) does not fire",
        input: "my mother i love very much",
        status: "unchanged",
        corrected: "My mother i love very much.",
        mustNotFire: ["en-l4-topic-comment-word-order"],
      },
    ]);
  });
});

// ---------------------------------------------------------------------------
// Cross-cutting precision invariants. These lock engine-level guarantees the
// six rules depend on, independent of any single rule's regex.
// ---------------------------------------------------------------------------
describe("cross-cutting precision invariants", () => {
  it("isClearlyWrongForTutor flags a guarded-but-still-wrong input", () => {
    // Mirrors the needs_ai negation-guard cases: the input is detected as
    // wrong even though no rule will safely rewrite it.
    expect(isClearlyWrongForTutor("i do not go yesterday", "en")).toBe(true);
  });

  it("isClearlyWrongForTutor does NOT flag clean English", () => {
    expect(isClearlyWrongForTutor("I go to school every day.", "en")).toBe(false);
    expect(isClearlyWrongForTutor("I bought a hat yesterday.", "en")).toBe(false);
  });

  it("empty / whitespace-only input is a no-op unchanged result", () => {
    const r = correctWithTutorRules("   ", "en");
    expect(r.status).toBe("unchanged");
    expect(r.corrected).toBe("");
    expect(r.appliedRuleIds).toEqual([]);
  });
});
