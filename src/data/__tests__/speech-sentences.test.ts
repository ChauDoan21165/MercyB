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
  sentencesForCefr,
  parseCefrParam,
} from '../speechSentencesSchema';
import raw from '../speech-sentences.json';

const MIN_WORDS = 6;
const MAX_WORDS = 14;
const PER_LEVEL_TARGET = 25;

function wordCount(sentence: string): number {
  return sentence.trim().split(/\s+/).filter(Boolean).length;
}

describe('speech-sentences.json', () => {
  it('raw JSON parses cleanly through the schema (redundant with import-time check, kept for explicitness)', () => {
    const parsed = SpeechSentencesFileSchema.safeParse(raw);
    expect(parsed.success).toBe(true);
  });

  it('contains at least 100 sentences', () => {
    expect(SPEECH_SENTENCES.length).toBeGreaterThanOrEqual(100);
  });

  it('distributes exactly 25 sentences per CEFR level', () => {
    for (const level of SENTENCE_CEFR_LEVELS) {
      const forLevel = SPEECH_SENTENCES.filter((s) => s.cefr === level);
      expect(forLevel.length, `level ${level}`).toBe(PER_LEVEL_TARGET);
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

  it(`every target_en has between ${MIN_WORDS} and ${MAX_WORDS} words`, () => {
    const bad: string[] = [];
    for (const s of SPEECH_SENTENCES) {
      const count = wordCount(s.target_en);
      if (count < MIN_WORDS || count > MAX_WORDS) {
        bad.push(`${s.id}: ${count} words — "${s.target_en}"`);
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
});

describe('sentencesForCefr', () => {
  it('returns all sentences for "ALL"', () => {
    expect(sentencesForCefr('ALL').length).toBe(SPEECH_SENTENCES.length);
  });

  it('returns only matching-level sentences', () => {
    for (const level of SENTENCE_CEFR_LEVELS) {
      const filtered = sentencesForCefr(level);
      expect(filtered.length).toBe(PER_LEVEL_TARGET);
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
