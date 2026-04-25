// src/lib/feedback/__tests__/l1-rules-round5.test.ts
//
// Tests for the 25 Round-5 L1-interference rules (public IDs
// L1-036..L1-060). Each rule is covered by ≥2 positive cases and ≥1
// negative case. Negative cases assert either that the rule does not
// fire OR that a different tag wins — both are acceptable outcomes for
// a low-FP bias detector.
//
// Mirrors the helper shape of l1-error-detector.test.ts so a future
// merge is drama-free.

import { describe, expect, it } from 'vitest';
import {
  detectL1Error,
  type L1DetectionInput,
  type L1WeaknessTag,
} from '../l1-error-detector';

function run(
  user: string,
  expected: string,
  ctx?: L1DetectionInput['questionContext'],
) {
  return detectL1Error({ userAnswer: user, expectedAnswer: expected, questionContext: ctx });
}

function expectHit(user: string, expected: string, tag: L1WeaknessTag) {
  const r = run(user, expected);
  expect(r.matched, `expected ${tag} for "${user}" vs "${expected}", got ${r.weaknessTag ?? 'no match'}`).toBe(true);
  if (r.matched) {
    expect(r.weaknessTag).toBe(tag);
    expect(r.feedback).not.toBeNull();
    expect(r.feedback!.en.length).toBeGreaterThan(0);
    expect(r.feedback!.vi.length).toBeGreaterThan(0);
    expect(r.feedback!.en.includes(expected)).toBe(true);
  }
}

function expectMissOrDifferentTag(user: string, expected: string, notTag: L1WeaknessTag) {
  const r = run(user, expected);
  if (r.matched) {
    expect(r.weaknessTag, `expected tag != ${notTag} for "${user}" / "${expected}"`).not.toBe(notTag);
  }
}

function expectMiss(user: string, expected: string) {
  const r = run(user, expected);
  expect(r.matched, `expected NO match for "${user}" vs "${expected}", got ${r.weaknessTag ?? 'no match'}`).toBe(false);
}

// ── 37. vi_l1_present_perfect_vs_past (L1-036) ──────────────────────────
describe('round5 rule 37: vi_l1_present_perfect_vs_past', () => {
  it('positive cases', () => {
    expectHit(
      'i have eaten pho yesterday',
      'i ate pho yesterday',
      'vi_l1_present_perfect_vs_past',
    );
    expectHit(
      'she has visited paris last summer',
      'she visited paris last summer',
      'vi_l1_present_perfect_vs_past',
    );
  });
  it('negative case — present perfect without a past-time marker is fine', () => {
    expectMissOrDifferentTag(
      'i have eaten pho',
      'i have eaten pho',
      'vi_l1_present_perfect_vs_past',
    );
  });
});

// ── 38. vi_l1_subjunctive_were (L1-037) ─────────────────────────────────
describe('round5 rule 38: vi_l1_subjunctive_were', () => {
  it('positive cases', () => {
    expectHit('if i was you i would go', 'if i were you i would go', 'vi_l1_subjunctive_were');
    expectHit('i wish i was taller', 'i wish i were taller', 'vi_l1_subjunctive_were');
  });
  it('negative — real past with "was" is correct', () => {
    expectMiss('i was tired yesterday', 'i was tired yesterday');
  });
});

// ── 39. vi_l1_embedded_question_order (L1-038) ──────────────────────────
describe('round5 rule 39: vi_l1_embedded_question_order', () => {
  it('positive cases', () => {
    expectHit(
      "i don't know what is this",
      "i don't know what this is",
      'vi_l1_embedded_question_order',
    );
    expectHit(
      'tell me where does he live',
      'tell me where he lives',
      'vi_l1_embedded_question_order',
    );
  });
  it('negative — a real direct question keeps subject-aux inversion', () => {
    expectMissOrDifferentTag(
      'what is this?',
      'what is this?',
      'vi_l1_embedded_question_order',
    );
  });
});

// ── 40. vi_l1_do_support_3ps (L1-039) ───────────────────────────────────
describe('round5 rule 40: vi_l1_do_support_3ps', () => {
  it('positive cases', () => {
    expectHit("she don't know the answer", "she doesn't know the answer", 'vi_l1_do_support_3ps');
    expectHit("he don't like coffee", "he doesn't like coffee", 'vi_l1_do_support_3ps');
  });
  it('negative — plural subject takes "don\'t"', () => {
    expectMiss("they don't know", "they don't know");
  });
});

// ── 41. vi_l1_subject_relative_omit (L1-040) ────────────────────────────
describe('round5 rule 41: vi_l1_subject_relative_omit', () => {
  it('positive cases', () => {
    expectHit(
      'the man came yesterday is my uncle',
      'the man who came yesterday is my uncle',
      'vi_l1_subject_relative_omit',
    );
    expectHit(
      'the book is on the table is mine',
      'the book which is on the table is mine',
      'vi_l1_subject_relative_omit',
    );
  });
  it('negative — user already uses the relative', () => {
    expectMiss(
      'the man who came yesterday is my uncle',
      'the man who came yesterday is my uncle',
    );
  });
});

// ── 42. vi_l1_gerund_after_verb (L1-041) ────────────────────────────────
describe('round5 rule 42: vi_l1_gerund_after_verb', () => {
  it('positive cases', () => {
    expectHit('i enjoy to swim in the morning', 'i enjoy swimming in the morning', 'vi_l1_gerund_after_verb');
    expectHit('she avoids to eat sugar', 'she avoids eating sugar', 'vi_l1_gerund_after_verb');
  });
  it('negative — "want to swim" is the correct pattern', () => {
    expectMiss('i want to swim', 'i want to swim');
  });
});

// ── 43. vi_l1_modal_perfect (L1-042) ────────────────────────────────────
describe('round5 rule 43: vi_l1_modal_perfect', () => {
  it('positive cases', () => {
    expectHit('i should did it yesterday', 'i should have done it yesterday', 'vi_l1_modal_perfect');
    expectHit('he could went there earlier', 'he could have gone there earlier', 'vi_l1_modal_perfect');
  });
  it('negative — "should do" (present) is fine', () => {
    expectMiss('i should do it', 'i should do it');
  });
});

// ── 44. vi_l1_phrasal_pronoun_order (L1-043) ────────────────────────────
describe('round5 rule 44: vi_l1_phrasal_pronoun_order', () => {
  it('positive cases', () => {
    expectHit('i picked up him at noon', 'i picked him up at noon', 'vi_l1_phrasal_pronoun_order');
    expectHit('please turn off it', 'please turn it off', 'vi_l1_phrasal_pronoun_order');
  });
  it('negative — noun after particle is acceptable (non-pronoun)', () => {
    expectMiss('i picked up my friend', 'i picked up my friend');
  });
});

// ── 45. vi_l1_comparative_more_long (L1-044) ────────────────────────────
describe('round5 rule 45: vi_l1_comparative_more_long', () => {
  it('positive cases', () => {
    expectHit('this is beautifuler than that', 'this is more beautiful than that', 'vi_l1_comparative_more_long');
    expectHit('the test was difficulter this year', 'the test was more difficult this year', 'vi_l1_comparative_more_long');
  });
  it('negative — short adj comparative stays as -er', () => {
    expectMiss('she is taller than me', 'she is taller than me');
  });
});

// ── 46. vi_l1_many_with_uncount (L1-045) ────────────────────────────────
// The existing `vi_l1_countable_much` rule already handles the many↔much
// swap. When the patterns overlap, we let the existing rule win — both
// deliver accurate feedback. We assert only that *some* match fires.
describe('round5 rule 46: vi_l1_many_with_uncount', () => {
  it('positive cases — either many_with_uncount or countable_much is acceptable', () => {
    for (const [u, e] of [
      ['how many water do you drink', 'how much water do you drink'],
      ['i need many advice from you', 'i need much advice from you'],
    ]) {
      const r = run(u, e);
      expect(r.matched, `expected a match for "${u}"`).toBe(true);
      if (r.matched) {
        expect(
          r.weaknessTag === 'vi_l1_many_with_uncount' || r.weaknessTag === 'vi_l1_countable_much',
          `expected many_with_uncount or countable_much, got ${r.weaknessTag}`,
        ).toBe(true);
      }
    }
  });
  it('negative — "many" with a countable plural is correct', () => {
    expectMiss('i have many friends', 'i have many friends');
  });
});

// ── 47. vi_l1_geographical_article (L1-046) ─────────────────────────────
describe('round5 rule 47: vi_l1_geographical_article', () => {
  it('positive — extra "the" before a bare country', () => {
    expectHit('i live in the vietnam', 'i live in vietnam', 'vi_l1_geographical_article');
  });
  it('positive — missing "the" before a plural-sounding country', () => {
    expectHit(
      'she moved to philippines last year',
      'she moved to the philippines last year',
      'vi_l1_geographical_article',
    );
  });
  it('negative — correct country names without "the"', () => {
    expectMiss('i live in vietnam', 'i live in vietnam');
  });
});

// ── 48. vi_l1_generic_plural (L1-047) ───────────────────────────────────
// NOTE: This test is tolerant — plural_s (existing rule 3) may win on
// the same pattern. Both outcomes are accepted. What must NOT happen is
// zero match on a classic "I like dog" sentence.
describe('round5 rule 48: vi_l1_generic_plural', () => {
  it('positive cases — either generic_plural or existing plural_s is acceptable', () => {
    for (const [u, e] of [
      ['i like dog', 'i like dogs'],
      ['they love book', 'they love books'],
    ]) {
      const r = run(u, e);
      expect(r.matched, `expected a match for "${u}"`).toBe(true);
      if (r.matched) {
        expect(
          r.weaknessTag === 'vi_l1_generic_plural' || r.weaknessTag === 'vi_l1_plural_s',
          `expected generic_plural or plural_s, got ${r.weaknessTag}`,
        ).toBe(true);
      }
    }
  });
  it('negative — "I like dogs" (already plural) must not fire', () => {
    expectMiss('i like dogs', 'i like dogs');
  });
});

// ── 49. vi_l1_double_negative (L1-048) ──────────────────────────────────
describe('round5 rule 49: vi_l1_double_negative', () => {
  it('positive cases', () => {
    expectHit("i don't have no money", "i don't have any money", 'vi_l1_double_negative');
    expectHit("she doesn't know nothing", "she doesn't know anything", 'vi_l1_double_negative');
  });
  it('negative — single negative is correct', () => {
    expectMiss("i don't have any money", "i don't have any money");
  });
});

// ── 50. vi_l1_negative_inversion (L1-049) ───────────────────────────────
describe('round5 rule 50: vi_l1_negative_inversion', () => {
  it('positive cases', () => {
    expectHit('never i have seen such a view', 'never have i seen such a view', 'vi_l1_negative_inversion');
    expectHit('seldom he is late for work', 'seldom is he late for work', 'vi_l1_negative_inversion');
  });
  it('negative — normal SVO without a negative adverbial', () => {
    expectMiss('i have seen such a view', 'i have seen such a view');
  });
});

// ── 51. vi_l1_adverb_before_subject (L1-050) ────────────────────────────
describe('round5 rule 51: vi_l1_adverb_before_subject', () => {
  it('positive cases', () => {
    expectHit('always i go to school by bus', 'i always go to school by bus', 'vi_l1_adverb_before_subject');
    expectHit('usually we eat dinner at seven', 'we usually eat dinner at seven', 'vi_l1_adverb_before_subject');
  });
  it('negative — adverb correctly placed after subject', () => {
    expectMiss('i always go to school by bus', 'i always go to school by bus');
  });
});

// ── 52. vi_l1_make_let_bare (L1-051) ────────────────────────────────────
describe('round5 rule 52: vi_l1_make_let_bare', () => {
  it('positive cases', () => {
    expectHit('she made me to cry', 'she made me cry', 'vi_l1_make_let_bare');
    expectHit('let me to help you', 'let me help you', 'vi_l1_make_let_bare');
  });
  it('negative — "allow me to help" (allow takes to, correctly)', () => {
    expectMiss('allow me to help you', 'allow me to help you');
  });
});

// ── 53. vi_l1_too_vs_very (L1-052) ──────────────────────────────────────
describe('round5 rule 53: vi_l1_too_vs_very', () => {
  it('positive cases', () => {
    expectHit('i am too happy to see you', 'i am very happy to see you', 'vi_l1_too_vs_very');
    expectHit('this dress is too beautiful', 'this dress is very beautiful', 'vi_l1_too_vs_very');
  });
  it('negative — "too tired to walk" (excess, correct)', () => {
    expectMiss('i am too tired to walk home', 'i am too tired to walk home');
  });
});

// ── 54. vi_l1_a_vs_an_vowel (L1-053) ────────────────────────────────────
describe('round5 rule 54: vi_l1_a_vs_an_vowel', () => {
  it('positive cases', () => {
    expectHit('i ate a apple for lunch', 'i ate an apple for lunch', 'vi_l1_a_vs_an_vowel');
    expectHit('he bought an book today', 'he bought a book today', 'vi_l1_a_vs_an_vowel');
  });
  it('negative — correct pairing', () => {
    expectMiss('i ate an apple for lunch', 'i ate an apple for lunch');
  });
});

// ── 55. vi_l1_one_of_the_singular (L1-054) ──────────────────────────────
describe('round5 rule 55: vi_l1_one_of_the_singular', () => {
  it('positive cases', () => {
    expectHit(
      'she is one of the student in my class',
      'she is one of the students in my class',
      'vi_l1_one_of_the_singular',
    );
    expectHit(
      'this is one of my book',
      'this is one of my books',
      'vi_l1_one_of_the_singular',
    );
  });
  it('negative — already plural', () => {
    expectMiss(
      'she is one of the students in my class',
      'she is one of the students in my class',
    );
  });
});

// ── 56. vi_l1_each_singular (L1-055) ────────────────────────────────────
describe('round5 rule 56: vi_l1_each_singular', () => {
  it('positive cases', () => {
    expectHit('each students are happy', 'each student is happy', 'vi_l1_each_singular');
    expectHit('every children likes music', 'every child likes music', 'vi_l1_each_singular');
  });
  it('negative — correct singular after each', () => {
    expectMiss('each student is happy', 'each student is happy');
  });
});

// ── 57. vi_l1_been_vs_gone (L1-056) ─────────────────────────────────────
describe('round5 rule 57: vi_l1_been_vs_gone', () => {
  it('positive cases', () => {
    expectHit(
      'he has gone to paris three times',
      'he has been to paris three times',
      'vi_l1_been_vs_gone',
    );
    expectHit(
      'have you ever gone to japan before',
      'have you ever been to japan before',
      'vi_l1_been_vs_gone',
    );
  });
  it('negative — "has gone" with a present/ongoing context is correct', () => {
    expectMiss('she has gone to the market', 'she has gone to the market');
  });
});

// ── 58. vi_l1_tag_polarity (L1-057) ─────────────────────────────────────
describe('round5 rule 58: vi_l1_tag_polarity', () => {
  it('positive cases', () => {
    expectHit("you like it, do you?", "you like it, don't you?", 'vi_l1_tag_polarity');
    expectHit("she isn't here, isn't she?", "she isn't here, is she?", 'vi_l1_tag_polarity');
  });
  it('negative — correct opposite-polarity tag', () => {
    expectMiss("you like it, don't you?", "you like it, don't you?");
  });
});

// ── 59. vi_l1_no_article_generic (L1-058) ───────────────────────────────
describe('round5 rule 59: vi_l1_no_article_generic', () => {
  it('positive cases', () => {
    expectHit('the life is hard sometimes', 'life is hard sometimes', 'vi_l1_no_article_generic');
    expectHit('the music helps me focus', 'music helps me focus', 'vi_l1_no_article_generic');
  });
  it('negative — "the music from that movie" (specific, correct)', () => {
    expectMiss('the music from that movie is wonderful', 'the music from that movie is wonderful');
  });
});

// ── 60. vi_l1_superlative_the (L1-059) ──────────────────────────────────
describe('round5 rule 60: vi_l1_superlative_the', () => {
  it('positive cases', () => {
    expectHit('she is best student in our class', 'she is the best student in our class', 'vi_l1_superlative_the');
    expectHit('this is tallest building in the city', 'this is the tallest building in the city', 'vi_l1_superlative_the');
  });
  it('negative — "the best" is already correct', () => {
    expectMiss('she is the best student in our class', 'she is the best student in our class');
  });
});

// ── 61. vi_l1_if_will (L1-060) ──────────────────────────────────────────
// The existing `vi_l1_conditional_mix` rule already fires on "if + will".
// We accept either tag — both produce the correct teaching message.
describe('round5 rule 61: vi_l1_if_will', () => {
  it('positive cases — either if_will or conditional_mix is acceptable', () => {
    for (const [u, e] of [
      ['if i will go tomorrow i will tell you', 'if i go tomorrow i will tell you'],
      ['if he will come we will start', 'if he comes we will start'],
    ]) {
      const r = run(u, e);
      expect(r.matched, `expected a match for "${u}"`).toBe(true);
      if (r.matched) {
        expect(
          r.weaknessTag === 'vi_l1_if_will' || r.weaknessTag === 'vi_l1_conditional_mix',
          `expected if_will or conditional_mix, got ${r.weaknessTag}`,
        ).toBe(true);
      }
    }
  });
  it('negative — first conditional without "will" in the if-clause', () => {
    expectMiss('if i go tomorrow i will tell you', 'if i go tomorrow i will tell you');
  });
});
