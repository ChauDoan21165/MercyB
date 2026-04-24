// src/data/__tests__/speech-sentences.test.ts
//
// Integrity tests for the speech-sentences.json library. These run
// against the actual bundled file — if a future editor adds a
// sentence that violates any invariant, CI fails loudly.
//
// The schema itself is already enforced at module-import time by
// speechSentencesSchema.ts (zod.parse throws). These tests cover
// dataset-level invariants that the schema alone can't express:
// distribution, uniqueness, length bounds.

import { describe, it, expect } from 'vitest';

import {
  SPEECH_SENTENCES,
  SpeechSentencesFileSchema,
  SENTENCE_CEFR_LEVELS,
  SENTENCE_TOPICS,
  sentencesForCefr,
  parseCefrParam,
} from '../speechSentencesSchema';
import raw from '../speech-sentences.json';

// The L1-interference tag universe — must stay in lockstep with
// L1WeaknessTag in src/lib/feedback/l1-error-detector.ts. If a new rule
// ships, append it here and to the detector union in the same PR.
const L1_RULE_IDS = new Set<string>([
  'vi_l1_3rd_person_s',
  'vi_l1_past_ed',
  'vi_l1_plural_s',
  'vi_l1_missing_be',
  'vi_l1_question_no_aux',
  'vi_l1_missing_article',
  'vi_l1_possessive_gender',
  'vi_l1_preposition_transfer',
  'vi_l1_countable',
  'vi_l1_to_verb_confusion',
  'vi_l1_can_no_infinitive',
  'vi_l1_double_past',
  'vi_l1_possessive_s_missing',
  'vi_l1_comparative_double',
  'vi_l1_adjective_order',
  'vi_l1_very_much_placement',
  'vi_l1_there_are_singular',
  'vi_l1_everyone_plural',
  'vi_l1_make_vs_do',
  'vi_l1_tag_question',
  'vi_l1_past_perfect_missing',
  'vi_l1_reported_speech',
  'vi_l1_since_vs_for',
  'vi_l1_countable_much',
  'vi_l1_some_vs_any',
  'vi_l1_reflexive_missing',
  'vi_l1_conditional_mix',
  'vi_l1_to_infinitive_after_ing',
  'vi_l1_passive_missing_be',
  'vi_l1_relative_pronoun',
  'vi_l1_used_to_vs_be_used_to',
  'vi_l1_another_vs_other',
  'vi_l1_look_vs_see_vs_watch',
  'vi_l1_by_vs_with',
  'vi_l1_time_expressions',
]);

// Word-count bounds. Original 100 all sit in 6-14. Round-5 B2 sentences
// occasionally run longer to fit genuine B2 structures (inversion,
// past-perfect-conditional) — allowed up to 18 words.
const MIN_WORDS = 6;
const MAX_WORDS_DEFAULT = 14;
const MAX_WORDS_B2 = 18;

// Per-CEFR distribution after Round-5 CC1 merge (the original 25 per
// level plus this batch's 80 A2 + 100 B1 + 20 B2).
const EXPECTED_COUNTS = {
  A1: 25,
  A2: 105,
  B1: 125,
  B2: 45,
} as const;

function wordCount(sentence: string): number {
  return sentence.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Round-5 sentence IDs start at 026 within each CEFR level. The original
 * 100 records occupy 001-025. Tests that assert Round-5 invariants filter
 * on this predicate rather than on context label, because a handful of
 * legacy records already used the string "daily" or "shopping" as a free-
 * form context and would otherwise be swept into the Round-5 checks.
 */
function isRound5Id(id: string): boolean {
  const match = /^s_[a-z]\d_(\d{3})$/.exec(id);
  if (!match) return false;
  return Number.parseInt(match[1], 10) >= 26;
}

describe('speech-sentences.json', () => {
  it('raw JSON parses cleanly through the schema (redundant with import-time check, kept for explicitness)', () => {
    const parsed = SpeechSentencesFileSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
  });

  it('contains at least 100 sentences', () => {
    expect(SPEECH_SENTENCES.length).toBeGreaterThanOrEqual(100);
  });

  it('matches the expected per-CEFR count after Round-5 CC1 merge', () => {
    for (const level of SENTENCE_CEFR_LEVELS) {
      const forLevel = SPEECH_SENTENCES.filter((s) => s.cefr === level);
      expect(forLevel.length, `level ${level}`).toBe(EXPECTED_COUNTS[level]);
    }
  });

  it('has unique ids across the whole dataset', () => {
    const seen = new Set<string>();
    const dupes: string[] = [];
    for (const s of SPEECH_SENTENCES) {
      if (seen.has(s.id)) dupes.push(s.id);
      seen.add(s.id);
    }
    expect(dupes, `duplicate ids: ${dupes.join(', ')}`).toEqual([]);
  });

  it('has ids that start with the matching cefr prefix', () => {
    const mismatches: string[] = [];
    for (const s of SPEECH_SENTENCES) {
      const expectedPrefix = `s_${s.cefr.toLowerCase()}_`;
      if (!s.id.startsWith(expectedPrefix)) {
        mismatches.push(`${s.id} is marked ${s.cefr}`);
      }
    }
    expect(mismatches).toEqual([]);
  });

  it('has no duplicate target_en strings (case-insensitive, whitespace-normalized)', () => {
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const s of SPEECH_SENTENCES) {
      const normalized = s.target_en.trim().toLowerCase().replace(/\s+/g, ' ');
      const prior = seen.get(normalized);
      if (prior) {
        dupes.push(`"${s.target_en}" — also at ${prior}`);
      } else {
        seen.set(normalized, s.id);
      }
    }
    expect(dupes, `duplicates: ${dupes.join(' | ')}`).toEqual([]);
  });

  it('every target_en has between MIN_WORDS and per-CEFR max', () => {
    const bad: string[] = [];
    for (const s of SPEECH_SENTENCES) {
      const count = wordCount(s.target_en);
      const max = s.cefr === 'B2' ? MAX_WORDS_B2 : MAX_WORDS_DEFAULT;
      if (count < MIN_WORDS || count > max) {
        bad.push(`${s.id} (${s.cefr}): ${count} words — "${s.target_en}"`);
      }
    }
    expect(bad, bad.join('\n')).toEqual([]);
  });

  it('every sentence has a non-empty Vietnamese translation', () => {
    const bad: string[] = [];
    for (const s of SPEECH_SENTENCES) {
      if (!s.target_vi || s.target_vi.trim().length === 0) bad.push(s.id);
    }
    expect(bad).toEqual([]);
  });

  it('every sentence has a non-empty context label', () => {
    const bad: string[] = [];
    for (const s of SPEECH_SENTENCES) {
      if (!s.context || s.context.trim().length === 0) bad.push(s.id);
    }
    expect(bad).toEqual([]);
  });

  it('difficulty_hints is always an array (default [] when absent)', () => {
    for (const s of SPEECH_SENTENCES) {
      expect(Array.isArray(s.difficulty_hints)).toBe(true);
    }
  });

  it('every context value is in the allow-listed SENTENCE_TOPICS set', () => {
    const allowed = new Set<string>(SENTENCE_TOPICS);
    const bad: string[] = [];
    for (const s of SPEECH_SENTENCES) {
      if (!allowed.has(s.context)) {
        bad.push(`${s.id}: context="${s.context}"`);
      }
    }
    expect(bad, bad.join('\n')).toEqual([]);
  });

  it('every l1_rule_ids entry references a known detector tag', () => {
    const bad: string[] = [];
    for (const s of SPEECH_SENTENCES) {
      if (!s.l1_rule_ids) continue;
      for (const tag of s.l1_rule_ids) {
        if (!L1_RULE_IDS.has(tag)) bad.push(`${s.id}: unknown tag "${tag}"`);
      }
    }
    expect(bad, bad.join('\n')).toEqual([]);
  });

  it('every Round-5 CC1 record has 1-3 l1_rule_ids', () => {
    // Round-5 CC1 records are identified by numeric suffix >= 26 — the
    // original 100 pre-date the L1 detector and intentionally leave the
    // field absent. New records must tag 1-3 rules so analytics can
    // measure per-rule coverage.
    const bad: string[] = [];
    for (const s of SPEECH_SENTENCES) {
      if (!isRound5Id(s.id)) continue;
      const len = s.l1_rule_ids?.length ?? 0;
      if (len < 1 || len > 3) {
        bad.push(`${s.id}: ${len} rule ids (expected 1-3)`);
      }
    }
    expect(bad, bad.join('\n')).toEqual([]);
  });

  it('Round-5 CC1 topic distribution matches the spec', () => {
    const expected: Record<string, number> = {
      work: 45,
      daily: 45,
      texting: 35,
      email: 30,
      shopping: 25,
      money: 20,
    };
    const actual: Record<string, number> = {};
    for (const s of SPEECH_SENTENCES) {
      if (!isRound5Id(s.id)) continue;
      actual[s.context] = (actual[s.context] ?? 0) + 1;
    }
    expect(actual).toEqual(expected);
  });
});

describe('sentencesForCefr', () => {
  it('returns all sentences for "ALL"', () => {
    expect(sentencesForCefr('ALL').length).toBe(SPEECH_SENTENCES.length);
  });

  it('returns only matching-level sentences', () => {
    for (const level of SENTENCE_CEFR_LEVELS) {
      const filtered = sentencesForCefr(level);
      expect(filtered.length).toBe(EXPECTED_COUNTS[level]);
      expect(filtered.every((s) => s.cefr === level)).toBe(true);
    }
  });
});

describe('parseCefrParam', () => {
  it('returns "ALL" for null, undefined, or empty', () => {
    expect(parseCefrParam(null)).toBe('ALL');
    expect(parseCefrParam(undefined)).toBe('ALL');
    expect(parseCefrParam('')).toBe('ALL');
  });

  it('accepts valid CEFR values case-insensitively', () => {
    expect(parseCefrParam('A1')).toBe('A1');
    expect(parseCefrParam('a2')).toBe('A2');
    expect(parseCefrParam('b1')).toBe('B1');
    expect(parseCefrParam('B2')).toBe('B2');
  });

  it('falls back to "ALL" for invalid values', () => {
    expect(parseCefrParam('C1')).toBe('ALL');
    expect(parseCefrParam('garbage')).toBe('ALL');
    expect(parseCefrParam('A3')).toBe('ALL');
  });
});
