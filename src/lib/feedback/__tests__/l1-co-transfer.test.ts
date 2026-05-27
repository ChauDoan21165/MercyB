// src/lib/feedback/__tests__/l1-co-transfer.test.ts
//
// Focused unit coverage for `vi_l1_co_transfer` (rule 64) — re-land
// of the test file lost in the GitHub→GitLab migration (originally
// shipped as PR #1187). The detector code itself survived the
// migration; only this test file was lost.
//
// Vietnamese `có` is multivalent — it serves possession, existence,
// and (in spoken/written colloquial) descriptive predicates. Learners
// over-map all three meanings onto English `has`, producing two
// distinct structural errors with one shared L1 root. Both sub-
// patterns share the `vi_l1_co_transfer` tag + explanation. The
// detector lives at src/lib/feedback/l1-error-detector.ts:2506-2586
// and is registered in rule-packs/vi/rules.ts:183.
//
// Sub-pattern coverage:
//   - A (locative-fronted existential): "In my house has three
//     bedrooms." → "There are three bedrooms in my house."
//     Gated on: user starts with locative prep + NP + has + count
//     head; expected starts with "there is/are".
//   - B (has-instead-of-be predicative): "My city has very beautiful."
//     → "My city is very beautiful." Gated on: user[i]=has where
//     expected[i]=is, same length, all other indices align, next
//     token after has/is is a degree intensifier.
//
// Mirrors the helper shape of l1-topic-comment-fronting.test.ts so
// future Round-6+ coverage additions stay consistent across the
// detector test suite.

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
    expect(r.feedback!.en.length).toBeGreaterThan(0);
    expect(r.feedback!.vi.length).toBeGreaterThan(0);
    // Replacement-text contract: expected correction is woven into
    // the rendered explanation via {FIX}.
    expect(r.feedback!.en.includes(expected)).toBe(true);
    expect(r.feedback!.vi.includes(expected)).toBe(true);
  }
}

function expectMiss(user: string, expected: string) {
  const r = run(user, expected);
  expect(
    r.matched,
    `expected NO L1 match for "${user}" vs "${expected}" — got ${r.weaknessTag ?? 'no tag'}`,
  ).toBe(false);
}

function expectMissOrDifferentTag(
  user: string,
  expected: string,
  notTag: L1WeaknessTag,
) {
  const r = run(user, expected);
  if (r.matched) {
    expect(
      r.weaknessTag,
      `expected tag != ${notTag} for "${user}" / "${expected}"`,
    ).not.toBe(notTag);
  }
}

describe('rule 64: vi_l1_co_transfer', () => {
  describe('sub-pattern A — locative-fronted existential (has → there is/are)', () => {
    it('"In my house has three bedrooms" → "There are three bedrooms in my house"', () => {
      expectHit(
        'In my house has three bedrooms.',
        'There are three bedrooms in my house.',
        'vi_l1_co_transfer',
      );
    });

    it('"On this street has many shops" → "There are many shops on this street"', () => {
      expectHit(
        'On this street has many shops.',
        'There are many shops on this street.',
        'vi_l1_co_transfer',
      );
    });

    it('"At the school has five hundred students" → "There are five hundred students at the school"', () => {
      expectHit(
        'At the school has five hundred students.',
        'There are five hundred students at the school.',
        'vi_l1_co_transfer',
      );
    });

    it('"Inside the box has some cookies" → "There are some cookies inside the box"', () => {
      expectHit(
        'Inside the box has some cookies.',
        'There are some cookies inside the box.',
        'vi_l1_co_transfer',
      );
    });

    it('also fires when the count is a numeric digit, not a word ("5")', () => {
      // detector's isCountHead() accepts any Number.isFinite(n) && n >= 1.
      expectHit(
        'In the room has 5 chairs.',
        'There are 5 chairs in the room.',
        'vi_l1_co_transfer',
      );
    });
  });

  describe('sub-pattern B — has-instead-of-be predicative', () => {
    it('"My city has very beautiful" → "My city is very beautiful"', () => {
      expectHit(
        'My city has very beautiful.',
        'My city is very beautiful.',
        'vi_l1_co_transfer',
      );
    });

    it('"This restaurant has really good" → "This restaurant is really good"', () => {
      expectHit(
        'This restaurant has really good.',
        'This restaurant is really good.',
        'vi_l1_co_transfer',
      );
    });

    it('"The weather has quite cold" → "The weather is quite cold"', () => {
      expectHit(
        'The weather has quite cold.',
        'The weather is quite cold.',
        'vi_l1_co_transfer',
      );
    });
  });

  describe('negative cases — correct English does not fire', () => {
    it('"He has interesting hobbies" is correct possessive — sub-pattern B requires a degree intensifier', () => {
      // Next token after `has` is "interesting" (an adjective but not a
      // degree intensifier), so the predicative-adjective gate blocks
      // false-positive firing on a perfectly correct possessive.
      expectMissOrDifferentTag(
        'He has interesting hobbies.',
        'He has interesting hobbies.',
        'vi_l1_co_transfer',
      );
    });

    it('"She has three books" — possessive with count head but NO locative front, no fire', () => {
      // Sub-pattern A requires a locative preposition at index 0
      // (in/on/at/inside). "She" is a subject pronoun → A's gate
      // rejects.
      expectMissOrDifferentTag(
        'She has three books.',
        'She has three books.',
        'vi_l1_co_transfer',
      );
    });

    it('"There are three bedrooms in my house" — the corrected form does not re-fire', () => {
      // Same user + expected → detector contract returns no match.
      // Belt-and-braces: confirms the corrected canonical form is
      // never itself flagged.
      expectMiss(
        'There are three bedrooms in my house.',
        'There are three bedrooms in my house.',
      );
    });
  });
});
