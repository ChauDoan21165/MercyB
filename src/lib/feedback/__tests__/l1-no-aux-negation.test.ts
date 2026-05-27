// src/lib/feedback/__tests__/l1-no-aux-negation.test.ts
//
// Focused unit coverage for `vi_l1_no_aux_negation` (rule 62).
// Vietnamese transfers `không` directly onto the verb without
// do-support, producing "I no want coffee" / "He not come yesterday".
// The detector fires when the user has `<subject pronoun> + (no|not) +
// <verb>` at any aligned position and the expected answer has the
// same shape with do-support inserted (dont / doesnt / didnt).
//
// Re-lands the test PR (originally #1189) lost in the
// GitHub → GitLab migration. Detector code itself is on main
// (l1-error-detector.ts:2487, ruleNoAuxNegation; registered in
// rule-packs/vi/rules.ts) — only the test was lost.
//
// Mirrors the helper shape of l1-rules-round5.test.ts. Tests only —
// does not import or modify the detector module beyond the public
// detectL1Error entry point. Part of the §15 Axis 1 Bar #1
// maintenance (every Round-6 detector keeps its dedicated unit test).

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

/**
 * Allow "no detector fires" OR "different rule wins" — both are
 * acceptable negative outcomes. The assertion only forbids
 * `vi_l1_no_aux_negation` from firing.
 */
function expectNotNoAuxNegation(user: string, expected: string) {
  const r = run(user, expected);
  if (r.matched) {
    expect(
      r.weaknessTag,
      `no_aux_negation should NOT fire on "${user}" / "${expected}", but it did`,
    ).not.toBe('vi_l1_no_aux_negation');
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Positives — every subject pronoun + both negators + every contraction
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_no_aux_negation — seed fixtures', () => {
  it("fires on 'I no want coffee' → 'I don't want coffee' (vi-gram-142)", () => {
    expectHit('I no want coffee.', "I don't want coffee.", 'vi_l1_no_aux_negation');
  });

  it("fires on 'He not come yesterday' → 'He didn't come yesterday' (vi-gram-143)", () => {
    expectHit('He not come yesterday.', "He didn't come yesterday.", 'vi_l1_no_aux_negation');
  });
});

describe('vi_l1_no_aux_negation — subject pronoun coverage', () => {
  it('fires for 1st-person singular (I → dont)', () => {
    expectHit('I no like fish.', "I don't like fish.", 'vi_l1_no_aux_negation');
  });

  it('fires for 2nd-person (you → dont)', () => {
    expectHit('You no understand.', "You don't understand.", 'vi_l1_no_aux_negation');
  });

  it('fires for 3rd-person singular masc (he → doesnt)', () => {
    expectHit('He not eat breakfast.', "He doesn't eat breakfast.", 'vi_l1_no_aux_negation');
  });

  it('fires for 3rd-person singular fem (she → doesnt)', () => {
    expectHit('She no like fish.', "She doesn't like fish.", 'vi_l1_no_aux_negation');
  });

  it('fires for 3rd-person singular neuter (it → doesnt)', () => {
    expectHit('It no work today.', "It doesn't work today.", 'vi_l1_no_aux_negation');
  });

  it('fires for 1st-person plural (we → dont)', () => {
    expectHit('We not have time.', "We don't have time.", 'vi_l1_no_aux_negation');
  });

  it('fires for 3rd-person plural (they → dont)', () => {
    expectHit('They no come.', "They don't come.", 'vi_l1_no_aux_negation');
  });
});

describe('vi_l1_no_aux_negation — past-tense forms (didnt)', () => {
  it("fires on bare-not + past-time marker (He not come yesterday → He didn't)", () => {
    expectHit('He not come yesterday.', "He didn't come yesterday.", 'vi_l1_no_aux_negation');
  });

  it('fires on bare-no past tense (I no go last week)', () => {
    expectHit('I no go last week.', "I didn't go last week.", 'vi_l1_no_aux_negation');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Negatives — pattern-specific false-positive guards
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_no_aux_negation — negatives (false-positive guards)', () => {
  it('does NOT fire when input is already correct', () => {
    expectNotNoAuxNegation("I don't want coffee.", "I don't want coffee.");
    expectNotNoAuxNegation("He doesn't come yesterday.", "He doesn't come yesterday.");
  });

  it('does NOT fire when subject is a non-pronoun NP', () => {
    // "Mary" is not in NO_AUX_NEG_SUBJECTS — rule must skip.
    expectNotNoAuxNegation("Mary no like fish.", "Mary doesn't like fish.");
  });

  it('does NOT fire when "no" is sentence-initial (no preceding subject pronoun)', () => {
    // "No, I want coffee" — `no` is interjection, not the negator pattern.
    expectNotNoAuxNegation("No I want coffee.", "No, I want coffee.");
  });

  it('does NOT fire when token lengths differ (rule guards on equal length)', () => {
    // User dropped a word — this isn't a bare-no insertion. Even if
    // semantically similar, the rule deliberately stays narrow.
    expectNotNoAuxNegation("I no coffee.", "I don't want coffee.");
  });

  it('does NOT fire when verb after no/not does not match expected', () => {
    // user verb ≠ expected verb at the same position. Rule signature
    // requires the diff to be PURELY the negation insertion, not a
    // verb swap.
    expectNotNoAuxNegation("I no want coffee.", "I don't drink coffee.");
  });

  it("does NOT fire on 'not' inside an isn't/aren't expected (be-form, not do-form)", () => {
    // "She not nice" → "She isn't nice" uses be-negation, not do-support.
    // The expected[i+1] would be `isnt` (post-normalize), which isn't
    // in NO_AUX_NEG_DO_AUX. Rule must stay silent so the missing-be
    // rule (rule 4) can handle it instead.
    expectNotNoAuxNegation("She not nice.", "She isn't nice.");
  });

  it('does NOT fire on modal + not (will not, can not)', () => {
    // "I will not go" — modal + not is correct English; expected
    // wouldn't have do-support contractions, so rule stays silent.
    expectNotNoAuxNegation("I will not go.", "I will not go.");
  });

  it('does NOT fire when "not" is part of an idiomatic phrase (not only / not just)', () => {
    expectNotNoAuxNegation(
      "I not only want coffee, I want tea.",
      "I not only want coffee, I want tea.",
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Cross-cutting — explanation template emits the do-support prescription
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_no_aux_negation — explanation template coverage', () => {
  it('explanation surfaces the do-support prescription (do/does/did or contractions)', () => {
    const r = run("I no want coffee.", "I don't want coffee.");
    expect(r.matched).toBe(true);
    if (r.matched) {
      // Bilingual explanation references the do-family auxiliaries.
      // EN string mentions one of do/does/did or their contractions.
      const en = r.feedback!.en.toLowerCase();
      expect(en).toMatch(/\b(do|does|did|don't|doesn't|didn't)\b/);
      // VN string also surfaces the do-family prescription.
      const vi = r.feedback!.vi.toLowerCase();
      expect(vi).toMatch(/\b(do|does|did|don't|doesn't|didn't)\b/);
    }
  });
});
