// src/lib/feedback/__tests__/l1-topic-comment-fronting.test.ts
//
// Focused unit coverage for `vi_l1_topic_comment_fronting` (rule 63).
// Vietnamese is topic-prominent: learners front a topic NP with a
// comma and resume it later with a pronoun ("My family, they live in
// Hue" / "This job, I don't like it"). English prefers plain SVO.
//
// Coverage gap motivating this file: the detector ships with brief
// per-sub-shape coverage in l1-rules-round5.test.ts (3 positives per
// sub-shape, 6 negatives total) but the negative half samples only
// 3 of 16 `TCF_FRONTED_ADVERBIALS` and 2 of 14 `TCF_SUBORDINATORS` —
// the helpers responsible for the rule's false-positive defenses.
// This file fills in the lexicon coverage, adds the boundary-condition
// guards (mid-sentence comma, short topic span), and asserts the
// bilingual explanation/replacement-text contract.
//
// Mirrors the helper shape of l1-co-transfer.test.ts (#1187) and
// l1-no-aux-negation.test.ts (#1189). Tests only — does not import or
// modify the detector module beyond the public detectL1Error entry
// point. Part of the Round-6 coverage sweep:
//   - vi_l1_co_transfer       — covered by #1187
//   - vi_l1_no_aux_negation   — covered by #1189
//   - vi_l1_topic_comment_fronting — covered by THIS PR
//   - vi_l1_future_adverb_bare — existing coverage in l1-rules-round5
//   - vi_l1_subject_gender    — in-flight on #1169, defer until merged

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
 * Allow "no detector fires" OR "a different rule wins" — both are
 * acceptable negative outcomes. The assertion only forbids
 * `vi_l1_topic_comment_fronting` from firing.
 */
function expectNotTopicCommentFronting(user: string, expected: string) {
  const r = run(user, expected);
  if (r.matched) {
    expect(
      r.weaknessTag,
      `topic_comment_fronting should NOT fire on "${user}" / "${expected}", but it did`,
    ).not.toBe('vi_l1_topic_comment_fronting');
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Sub-shape A — subject doubling: "<NP>, <subj-pron> <verb> …"
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_topic_comment_fronting — sub-shape A (subject doubling)', () => {
  it('fires on the seed fixture cases (vi-gram-110, 112)', () => {
    expectHit(
      'My family, they live in Hue.',
      'My family lives in Hue.',
      'vi_l1_topic_comment_fronting',
    );
    expectHit(
      'My older brother, he works in Singapore now.',
      'My older brother works in Singapore now.',
      'vi_l1_topic_comment_fronting',
    );
  });

  it('fires when resumptive subject is "she" / "it" / "we"', () => {
    expectHit(
      'My sister, she studies medicine.',
      'My sister studies medicine.',
      'vi_l1_topic_comment_fronting',
    );
    expectHit(
      'This restaurant, it serves great pho.',
      'This restaurant serves great pho.',
      'vi_l1_topic_comment_fronting',
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Sub-shape B — object fronting: "<NP>, <subj> <verb> … <obj-pron>"
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_topic_comment_fronting — sub-shape B (object fronting)', () => {
  it('fires on the seed fixture case (vi-gram-111)', () => {
    expectHit(
      "This job, I don't like it.",
      "I don't like this job.",
      'vi_l1_topic_comment_fronting',
    );
  });

  it('fires when resumptive object is "him" / "her" / "them"', () => {
    expectHit(
      'My uncle, I visited him last week.',
      'I visited my uncle last week.',
      'vi_l1_topic_comment_fronting',
    );
    expectHit(
      'My grandmother, we called her yesterday.',
      'We called my grandmother yesterday.',
      'vi_l1_topic_comment_fronting',
    );
    expectHit(
      'These books, I bought them online.',
      'I bought these books online.',
      'vi_l1_topic_comment_fronting',
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Negatives — TCF_FRONTED_ADVERBIALS lexicon (existing coverage hits 3/16;
// this block samples one per semantic class so the helper stays guarded)
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_topic_comment_fronting — negatives: fronted-adverbial guard', () => {
  it('does NOT fire on time adverbs (yesterday / today / tomorrow / tonight)', () => {
    expectNotTopicCommentFronting('Tomorrow, I go home.', 'Tomorrow I will go home.');
    expectNotTopicCommentFronting('Today, she works.', 'Today she works.');
  });

  it('does NOT fire on temporal/sequence adverbs (now / then / soon / later)', () => {
    expectNotTopicCommentFronting('Now, we wait.', 'Now we wait.');
    expectNotTopicCommentFronting('Later, they will arrive.', 'Later they will arrive.');
  });

  it('does NOT fire on ordinal sequence adverbs (first / second / next / finally)', () => {
    expectNotTopicCommentFronting('First, we eat.', 'First we eat.');
    expectNotTopicCommentFronting('Next, she explained.', 'Next she explained.');
    expectNotTopicCommentFronting('Finally, they agreed.', 'Finally they agreed.');
  });

  it('does NOT fire on frequency adverbs (sometimes / often / always / never)', () => {
    expectNotTopicCommentFronting('Sometimes, I cook.', 'Sometimes I cook.');
    expectNotTopicCommentFronting('Never, he lies.', 'Never he lies.');
  });

  it('does NOT fire on stance/discourse adverbs (fortunately / actually / however / therefore)', () => {
    expectNotTopicCommentFronting('However, she stayed.', 'However she stayed.');
    expectNotTopicCommentFronting('Actually, I agree.', 'Actually I agree.');
    expectNotTopicCommentFronting('Fortunately, we survived.', 'Fortunately we survived.');
  });

  it('does NOT fire on connective adverbs (meanwhile / instead)', () => {
    expectNotTopicCommentFronting('Meanwhile, I waited.', 'Meanwhile I waited.');
    expectNotTopicCommentFronting('Instead, they ran.', 'Instead they ran.');
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Negatives — TCF_SUBORDINATORS lexicon (existing coverage hits 2/14;
// this block samples broadly across conditional / causal / temporal /
// contrast types)
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_topic_comment_fronting — negatives: subordinate-clause guard', () => {
  it('does NOT fire on conditional subordinators (if / unless)', () => {
    expectNotTopicCommentFronting(
      'If I go, I will tell you.',
      'If I go I will tell you.',
    );
    expectNotTopicCommentFronting(
      "Unless she calls, we wait.",
      "Unless she calls we wait.",
    );
  });

  it('does NOT fire on causal subordinators (because / since)', () => {
    expectNotTopicCommentFronting(
      'Because I was late, she left.',
      'Because I was late she left.',
    );
    expectNotTopicCommentFronting(
      'Since you asked, I will help.',
      'Since you asked I will help.',
    );
  });

  it('does NOT fire on temporal subordinators (when / while / before / until)', () => {
    expectNotTopicCommentFronting(
      'When she arrives, call me.',
      'When she arrives call me.',
    );
    expectNotTopicCommentFronting(
      'While I cook, he cleans.',
      'While I cook he cleans.',
    );
    expectNotTopicCommentFronting(
      'Until you arrive, we wait.',
      'Until you arrive we wait.',
    );
  });

  it('does NOT fire on concessive subordinators (although / though)', () => {
    expectNotTopicCommentFronting(
      "Although I tried, I failed.",
      "Although I tried I failed.",
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Negatives — structural guards (comma position, topic span size)
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_topic_comment_fronting — negatives: structural guards', () => {
  it('does NOT fire on a mid-sentence comma (comma past first-half threshold)', () => {
    // commaIdx > userText.length / 2 — the comma sits in the back
    // half of the sentence, so it's a clause-medial comma, not a
    // topic-fronting comma.
    expectNotTopicCommentFronting(
      "I really enjoy hiking in the mountains, especially during summer with my friends and family.",
      "I really enjoy hiking in the mountains, especially during summer with my friends and family.",
    );
  });

  it('does NOT fire on already-correct SVO without resumptive pronoun', () => {
    expectNotTopicCommentFronting(
      'My family lives in Hue.',
      'My family lives in Hue.',
    );
    expectNotTopicCommentFronting(
      "I don't like this job.",
      "I don't like this job.",
    );
  });

  it('does NOT fire when the expected correction keeps the topic-comma shape', () => {
    // If the comma+pronoun shape is the INTENDED final form (rare —
    // e.g. learner-acceptable colloquial repair), the detector must
    // not contradict by suggesting a rewrite. Rule checks that
    // expected starts with the NP followed by a space (not a comma);
    // identical input/expected satisfies that fail-fast guard.
    expectNotTopicCommentFronting(
      'My family, they live in Hue.',
      'My family, they live in Hue.',
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Cross-cutting — explanation/replacement-text contract
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_topic_comment_fronting — explanation template coverage', () => {
  it('emits bilingual feedback for sub-shape A (subject doubling)', () => {
    const r = run('My family, they live in Hue.', 'My family lives in Hue.');
    expect(r.matched).toBe(true);
    if (r.matched) {
      expect(r.feedback!.en.length).toBeGreaterThan(0);
      expect(r.feedback!.vi.length).toBeGreaterThan(0);
      // FIX template weaves the corrected sentence into both halves.
      expect(r.feedback!.en).toContain('My family lives in Hue.');
      expect(r.feedback!.vi).toContain('My family lives in Hue.');
    }
  });

  it('emits bilingual feedback for sub-shape B (object fronting)', () => {
    const r = run("This job, I don't like it.", "I don't like this job.");
    expect(r.matched).toBe(true);
    if (r.matched) {
      expect(r.feedback!.en.length).toBeGreaterThan(0);
      expect(r.feedback!.vi.length).toBeGreaterThan(0);
      expect(r.feedback!.en).toContain("I don't like this job.");
      expect(r.feedback!.vi).toContain("I don't like this job.");
    }
  });
});
