// src/lib/feedback/__tests__/l1-co-transfer.test.ts
//
// Focused unit coverage for `vi_l1_co_transfer` (rule 64).
// The detector is a combined rule that dispatches two distinct
// sub-patterns sharing one tag + explanation:
//
//   Sub-pattern A — locative-fronted `has` → `there is/are`
//     "In my house has three bedrooms." → "There are three bedrooms in my house."
//     Detection lives in detectLocativeHas (regex + token-position).
//
//   Sub-pattern B — `NP has + intensifier + adj` → `NP is + intensifier + adj`
//     "My city has very beautiful." → "My city is very beautiful."
//     Detection lives in detectHasAdjective (aligned-tokens diff).
//
// Coverage gap motivating this file: the rule shipped with eval-fixture
// coverage (vi-gram-120/121/122) but no dedicated unit tests. Two
// sub-patterns + two detection strategies = the highest blast radius
// of the Round-6 detector additions if either branch silently regressed.
//
// Mirrors the helper shape of l1-rules-round5.test.ts so a future
// merge into one consolidated detector test suite is drama-free.
// Tests-only: does not import or modify the detector module itself
// beyond the public detectL1Error entry point.

import { describe, expect, it } from 'vitest';
import {
  detectL1Error,
  type L1DetectionInput,
  type L1WeaknessTag,
} from '../index.js';

function run(
  user: string,
  expected: string,
  ctx?: L1DetectionInput['questionContext'],
) {
  return detectL1Error({ userAnswer: user, expectedAnswer: expected, questionContext: ctx });
}

function expectHit(user: string, expected: string, tag: L1WeaknessTag) {
  const r = run(user, expected);
  expect(
    r.matched,
    `expected ${tag} for "${user}" vs "${expected}", got ${r.weaknessTag ?? 'no match'}`,
  ).toBe(true);
  if (r.matched) {
    expect(r.weaknessTag).toBe(tag);
    expect(r.feedback).not.toBeNull();
    // Bilingual feedback present and non-empty.
    expect(r.feedback!.en.length).toBeGreaterThan(0);
    expect(r.feedback!.vi.length).toBeGreaterThan(0);
    // Replacement-text contract: the expected correction is woven into
    // the rendered explanation via {FIX}.
    expect(r.feedback!.en.includes(expected)).toBe(true);
    expect(r.feedback!.vi.includes(expected)).toBe(true);
  }
}

/**
 * Allow "no detector fires" OR "a different rule wins" — both are
 * acceptable negative outcomes for a low-FP-bias detector. The
 * assertion only forbids `vi_l1_co_transfer` from firing.
 */
function expectNotCoTransfer(user: string, expected: string) {
  const r = run(user, expected);
  if (r.matched) {
    expect(
      r.weaknessTag,
      `co_transfer should NOT fire on "${user}" / "${expected}", but it did`,
    ).not.toBe('vi_l1_co_transfer');
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Sub-pattern A — locative-fronted `has` → `there is/are`
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_co_transfer — sub-pattern A (locative-fronted has)', () => {
  it('fires on "in"-fronted existential with word-count head', () => {
    expectHit(
      'In my house has three bedrooms.',
      'There are three bedrooms in my house.',
      'vi_l1_co_transfer',
    );
    expectHit(
      'In my class has thirty students.',
      'There are thirty students in my class.',
      'vi_l1_co_transfer',
    );
  });

  it('fires on alternate locative prepositions (on / at / inside)', () => {
    expectHit(
      'On the desk has two books.',
      'There are two books on the desk.',
      'vi_l1_co_transfer',
    );
    expectHit(
      'At the office has many employees.',
      'There are many employees at the office.',
      'vi_l1_co_transfer',
    );
    expectHit(
      'Inside the bag has some money.',
      'There is some money in the bag.',
      'vi_l1_co_transfer',
    );
  });

  it('fires on numeric-literal count heads (not just word counts)', () => {
    expectHit(
      'In my room has 5 cats.',
      'There are 5 cats in my room.',
      'vi_l1_co_transfer',
    );
  });

  it('fires on quantifier count heads (many / several / few)', () => {
    expectHit(
      'In this city has many people.',
      'There are many people in this city.',
      'vi_l1_co_transfer',
    );
    expectHit(
      'In the room has several chairs.',
      'There are several chairs in the room.',
      'vi_l1_co_transfer',
    );
  });

  it('does NOT fire when input is already correct (no locative-fronted has)', () => {
    expectNotCoTransfer(
      'There are three bedrooms in my house.',
      'There are three bedrooms in my house.',
    );
  });

  it('does NOT fire when user starts with locative + has but no count head follows', () => {
    // "in my office has my desk" — has + noun, not has + count head.
    // Even if a learner wrote this, the expected correction isn't a
    // "there is/are" rewrite, so the detector must stay silent.
    expectNotCoTransfer(
      'In my office has my desk.',
      'In my office is my desk.',
    );
  });

  it('does NOT fire when the locative prep is missing (no fronting)', () => {
    expectNotCoTransfer(
      'My house has three bedrooms.',
      'My house has three bedrooms.',
    );
  });

  it('does NOT fire when expected does not front "there is/are"', () => {
    // User has the structural error but the expected correction takes
    // a different path (kept `has`) — rule must stay silent so the
    // FIX template doesn't contradict the actual correction.
    expectNotCoTransfer(
      'In my house has three bedrooms.',
      'My house contains three bedrooms.',
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Sub-pattern B — `NP has + intensifier + adj` → `NP is + intensifier + adj`
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_co_transfer — sub-pattern B (has-as-be with intensifier)', () => {
  it('fires on "very" intensifier (the seed fixture pattern)', () => {
    expectHit(
      'My city has very beautiful.',
      'My city is very beautiful.',
      'vi_l1_co_transfer',
    );
  });

  it('fires on alternate degree intensifiers (really / quite / so / too)', () => {
    expectHit(
      'She has really tired.',
      'She is really tired.',
      'vi_l1_co_transfer',
    );
    expectHit(
      'This car has quite expensive.',
      'This car is quite expensive.',
      'vi_l1_co_transfer',
    );
    expectHit(
      'He has so happy.',
      'He is so happy.',
      'vi_l1_co_transfer',
    );
    expectHit(
      'The room has too small.',
      'The room is too small.',
      'vi_l1_co_transfer',
    );
  });

  it('fires on "extremely" / "super" / "pretty" / "incredibly" intensifiers', () => {
    expectHit(
      'My job has extremely difficult.',
      'My job is extremely difficult.',
      'vi_l1_co_transfer',
    );
    expectHit(
      'The food has super delicious.',
      'The food is super delicious.',
      'vi_l1_co_transfer',
    );
    expectHit(
      'This book has pretty good.',
      'This book is pretty good.',
      'vi_l1_co_transfer',
    );
  });

  it('does NOT fire when "has" is correct possession (no intensifier follows)', () => {
    // "She has interesting hobbies" — has + adjective + noun is
    // possession. The next-token-is-intensifier gate keeps the rule
    // narrow and avoids false-positive on correct English possession.
    expectNotCoTransfer(
      'She has interesting hobbies.',
      'She has interesting hobbies.',
    );
  });

  it('does NOT fire when "has" is correct possession + intensifier on noun', () => {
    // "She has very nice eyes" — `very nice` modifies the noun `eyes`,
    // not a predicative adjective. Detector must not fire because
    // expected[i] is `has` (not `is`), so the user-vs-expected diff
    // doesn't match the rule's signature.
    expectNotCoTransfer(
      'She has very nice eyes.',
      'She has very nice eyes.',
    );
  });

  it('does NOT fire when user and expected match exactly (no error to surface)', () => {
    expectNotCoTransfer(
      'My city is very beautiful.',
      'My city is very beautiful.',
    );
  });

  it('does NOT fire when token-length differs (rule guards on equal length)', () => {
    // If the user dropped a word, this isn't the be-vs-has swap.
    expectNotCoTransfer(
      'My city has beautiful.',
      'My city is very beautiful.',
    );
  });

  it('does NOT fire when only "has" → "is" swaps without an intensifier follow', () => {
    // No degree word after `has` — falls outside the rule's narrow gate.
    expectNotCoTransfer(
      'She has nice.',
      'She is nice.',
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Cross-cutting — explanation template + replacement coverage
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_co_transfer — explanation template coverage', () => {
  it('emits the locative-existential exemplar in the rendered explanation (sub-pattern A)', () => {
    const r = run(
      'In my house has three bedrooms.',
      'There are three bedrooms in my house.',
    );
    expect(r.matched).toBe(true);
    if (r.matched) {
      // Explanation mentions the "There is / There are" prescription.
      expect(r.feedback!.en.toLowerCase()).toMatch(/there\s+(is|are)/);
      expect(r.feedback!.vi.toLowerCase()).toMatch(/there\s+(is|are)/);
    }
  });

  it('emits the predicative-be exemplar in the rendered explanation (sub-pattern B)', () => {
    const r = run(
      'My city has very beautiful.',
      'My city is very beautiful.',
    );
    expect(r.matched).toBe(true);
    if (r.matched) {
      // Explanation references the `is / are` prescription for
      // predicative adjectives. The bilingual entry mentions both
      // structures in one block so the same string suffices.
      expect(r.feedback!.en.toLowerCase()).toMatch(/\bis\b|\bare\b/);
      expect(r.feedback!.vi.toLowerCase()).toMatch(/\bis\b|\bare\b/);
    }
  });
});
