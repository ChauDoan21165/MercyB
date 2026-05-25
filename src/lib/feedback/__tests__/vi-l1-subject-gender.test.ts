// src/lib/feedback/__tests__/vi-l1-subject-gender.test.ts
//
// Focused unit coverage for `vi_l1_subject_gender` (rule 66, shipped
// in #1169). Vietnamese third-person pronouns distinguish by social
// relation (anh / chị / em / ông / bà …) rather than biological
// gender; learners default to a single pronoun across consecutive
// sentences and produce mismatches like "My mother is a teacher.
// He works at a primary school."
//
// Two sub-patterns (the two return sites in ruleSubjectGender):
//   A. Female antecedent + user "he…" + expected "she…"  → flip he→she
//   B. Male antecedent   + user "she…" + expected "he…"  → flip she→he
//
// Cross-sentence detection — userText.split(/\.\s+/) then adjacent-
// pair scan with detectSentenceGender (lexicons SUBJECT_GENDER_FEMALE
// + SUBJECT_GENDER_MALE, 9 nouns each).
//
// Fixtures referenced as ground-truth shape:
//   vi-gram-072 / 073 / 074 (pronoun-gender-confusion family,
//   already passing in baseline).
//
// Mirrors helper shape of l1-co-transfer.test.ts (#1187),
// l1-no-aux-negation.test.ts (#1189), l1-topic-comment-fronting.test.ts
// (#1192). Tests only — does not import or modify the detector beyond
// the public detectL1Error entry point.

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
    // FIX template weaves the corrected sentence into both halves.
    expect(r.feedback!.en.includes(expected)).toBe(true);
    expect(r.feedback!.vi.includes(expected)).toBe(true);
  }
}

/**
 * Allow "no rule fires" OR "different rule wins" — both are acceptable
 * negative outcomes. The assertion only forbids `vi_l1_subject_gender`
 * from firing.
 */
function expectNotSubjectGender(user: string, expected: string) {
  const r = run(user, expected);
  if (r.matched) {
    expect(
      r.weaknessTag,
      `subject_gender should NOT fire on "${user}" / "${expected}", but it did`,
    ).not.toBe('vi_l1_subject_gender');
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Seed fixtures — vi-gram-072 / 073 / 074 (baseline-passing on main)
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_subject_gender — seed fixtures', () => {
  it('fires on vi-gram-072 (mother → He → She)', () => {
    expectHit(
      'My mother is a teacher. He works at a primary school.',
      'My mother is a teacher. She works at a primary school.',
      'vi_l1_subject_gender',
    );
  });

  it('fires on vi-gram-073 (older brother → She → He)', () => {
    expectHit(
      'My older brother is married. She has two children.',
      'My older brother is married. He has two children.',
      'vi_l1_subject_gender',
    );
  });

  it('fires on vi-gram-074 (wife → He → She)', () => {
    expectHit(
      'My wife is from Da Nang. He likes the beach.',
      'My wife is from Da Nang. She likes the beach.',
      'vi_l1_subject_gender',
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Sub-pattern A — female antecedent + wrong "he" → "she"
// Lexicon coverage: SUBJECT_GENDER_FEMALE (9 nouns)
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_subject_gender — sub-pattern A (female antecedent → he→she)', () => {
  it('fires on mother + He', () => {
    expectHit(
      'My mother loves cooking. He makes great pho.',
      'My mother loves cooking. She makes great pho.',
      'vi_l1_subject_gender',
    );
  });

  it('fires on sister + He', () => {
    expectHit(
      'My sister teaches English. He works in Hanoi.',
      'My sister teaches English. She works in Hanoi.',
      'vi_l1_subject_gender',
    );
  });

  it('fires on daughter + He', () => {
    expectHit(
      'My daughter studies abroad. He calls every Sunday.',
      'My daughter studies abroad. She calls every Sunday.',
      'vi_l1_subject_gender',
    );
  });

  it('fires on aunt + He', () => {
    expectHit(
      'My aunt sells flowers. He owns a small shop.',
      'My aunt sells flowers. She owns a small shop.',
      'vi_l1_subject_gender',
    );
  });

  it('fires on grandmother + He', () => {
    expectHit(
      'My grandmother is ninety. He still walks every day.',
      'My grandmother is ninety. She still walks every day.',
      'vi_l1_subject_gender',
    );
  });

  it('fires on woman + He (non-relational female lexicon entry)', () => {
    expectHit(
      'The woman next door is friendly. He always smiles.',
      'The woman next door is friendly. She always smiles.',
      'vi_l1_subject_gender',
    );
  });

  it('fires on niece + He', () => {
    expectHit(
      'My niece won a prize. He is very smart.',
      'My niece won a prize. She is very smart.',
      'vi_l1_subject_gender',
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Sub-pattern B — male antecedent + wrong "she" → "he"
// Lexicon coverage: SUBJECT_GENDER_MALE (9 nouns)
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_subject_gender — sub-pattern B (male antecedent → she→he)', () => {
  it('fires on father + She', () => {
    expectHit(
      'My father drives a taxi. She works long hours.',
      'My father drives a taxi. He works long hours.',
      'vi_l1_subject_gender',
    );
  });

  it('fires on husband + She', () => {
    expectHit(
      'My husband is a chef. She cooks every weekend.',
      'My husband is a chef. He cooks every weekend.',
      'vi_l1_subject_gender',
    );
  });

  it('fires on son + She', () => {
    expectHit(
      'My son plays football. She is the team captain.',
      'My son plays football. He is the team captain.',
      'vi_l1_subject_gender',
    );
  });

  it('fires on uncle + She', () => {
    expectHit(
      'My uncle owns a farm. She raises chickens.',
      'My uncle owns a farm. He raises chickens.',
      'vi_l1_subject_gender',
    );
  });

  it('fires on grandfather + She', () => {
    expectHit(
      'My grandfather served in the army. She is now retired.',
      'My grandfather served in the army. He is now retired.',
      'vi_l1_subject_gender',
    );
  });

  it('fires on man + She (non-relational male lexicon entry)', () => {
    expectHit(
      'The man over there is my boss. She is very strict.',
      'The man over there is my boss. He is very strict.',
      'vi_l1_subject_gender',
    );
  });

  it('fires on nephew + She', () => {
    expectHit(
      'My nephew loves dinosaurs. She knows every species.',
      'My nephew loves dinosaurs. He knows every species.',
      'vi_l1_subject_gender',
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Negatives — false-positive guards (≥3 per sub-pattern)
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_subject_gender — sub-pattern A negatives (female antecedent)', () => {
  it('does NOT fire when pronoun already matches (mother + She)', () => {
    expectNotSubjectGender(
      'My mother is a teacher. She works at a primary school.',
      'My mother is a teacher. She works at a primary school.',
    );
  });

  it('does NOT fire when sentence 2 starts with they/we (non-he/she pronoun)', () => {
    expectNotSubjectGender(
      'My mother is a teacher. They went shopping.',
      'My mother is a teacher. They went shopping.',
    );
  });

  it('does NOT fire when antecedent is non-gendered (teacher/student/doctor)', () => {
    // Occupation/role nouns are intentionally NOT in the lexicon —
    // the rule targets family/relational nouns Vietnamese speakers
    // carry over without gendered-pronoun reflexes. Detector skips.
    expectNotSubjectGender(
      'My teacher is kind. He helps everyone.',
      'My teacher is kind. He helps everyone.',
    );
  });
});

describe('vi_l1_subject_gender — sub-pattern B negatives (male antecedent)', () => {
  it('does NOT fire when pronoun already matches (brother + He)', () => {
    expectNotSubjectGender(
      'My older brother is married. He has two children.',
      'My older brother is married. He has two children.',
    );
  });

  it('does NOT fire when sentence 2 does not start with he/she at all', () => {
    expectNotSubjectGender(
      'My father drives a taxi. The car is old.',
      'My father drives a taxi. The car is old.',
    );
  });

  it('does NOT fire on single-sentence input (cross-sentence required)', () => {
    // Detector requires ≥2 sentences after splitting on /\.\s+/.
    // A single sentence with both noun + pronoun won't trigger.
    expectNotSubjectGender(
      'My brother said he is coming.',
      'My brother said he is coming.',
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Structural guards — sentence-count mismatch, multi-sentence scan
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_subject_gender — structural guards', () => {
  it('does NOT fire when user/expected sentence counts differ', () => {
    // Defensive: detector requires userSents.length === expSents.length
    // to avoid misaligned indices. User has 2 sentences; expected
    // merged into 1 — rule must skip.
    expectNotSubjectGender(
      'My mother is a teacher. He works hard.',
      'My mother is a teacher who works hard.',
    );
  });

  it('fires on the first valid adjacent-pair mismatch in a 3-sentence input', () => {
    // Adjacent-pair scan finds the (sentence 2, sentence 3) pair
    // where the gendered noun in 2 mismatches the pronoun in 3.
    expectHit(
      'I love my family. My mother is a teacher. He works hard.',
      'I love my family. My mother is a teacher. She works hard.',
      'vi_l1_subject_gender',
    );
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Cross-cutting — bilingual explanation + FIX template
// ────────────────────────────────────────────────────────────────────────────

describe('vi_l1_subject_gender — explanation template coverage', () => {
  it('emits bilingual feedback referencing the he/she prescription', () => {
    const r = run(
      'My mother is a teacher. He works at a primary school.',
      'My mother is a teacher. She works at a primary school.',
    );
    expect(r.matched).toBe(true);
    if (r.matched) {
      // EN explanation references he/she pronoun prescription.
      expect(r.feedback!.en.toLowerCase()).toMatch(/\bhe\b|\bshe\b/);
      // VN explanation also surfaces the he/she contrast.
      expect(r.feedback!.vi.toLowerCase()).toMatch(/\bhe\b|\bshe\b/);
    }
  });

  it('weaves the corrected sentence into both EN and VN feedback (FIX template)', () => {
    const r = run(
      'My father drives a taxi. She works long hours.',
      'My father drives a taxi. He works long hours.',
    );
    expect(r.matched).toBe(true);
    if (r.matched) {
      expect(r.feedback!.en).toContain('My father drives a taxi. He works long hours.');
      expect(r.feedback!.vi).toContain('My father drives a taxi. He works long hours.');
    }
  });
});
