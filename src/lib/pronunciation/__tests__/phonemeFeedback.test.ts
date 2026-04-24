// src/lib/pronunciation/__tests__/phonemeFeedback.test.ts
//
// Covers the new phonemeFeedback surface on ScoreResult. CC1's existing
// scorer tests still live in scorer.test.ts — this file focuses on the
// tip-selection heuristic, the 85+ suppression, the 3-tip cap, and the
// wrong-before-close ordering.

import { describe, it, expect } from 'vitest';

import { scorePronunciation } from '../scorer';
import {
  inferPhonemeForWord,
  PHONEME_TIPS,
} from '../vn-phoneme-map';

describe('phonemeFeedback gating', () => {
  it('is empty when overallScore >= 85', () => {
    // Exact match → 100 → no tips.
    const result = scorePronunciation({
      target: 'I think she is fine.',
      recognized: 'I think she is fine.',
    });
    expect(result.overallScore).toBeGreaterThanOrEqual(85);
    expect(result.phonemeFeedback).toEqual([]);
  });

  it('is empty for scores >= 85 even with one close substitution', () => {
    // One -s drop at 85% credit on a multi-word target → still high.
    const result = scorePronunciation({
      target: 'She likes apples and books.',
      recognized: 'She likes apples and book.', // dropped plural on 'books'
    });
    // Exact bands depend on scorer internals — check the invariant rather
    // than a magic number: if the scorer places us in the 85+ band, no tips.
    if (result.overallScore >= 85) {
      expect(result.phonemeFeedback).toEqual([]);
    }
  });

  it('populates tips when the overall score drops below 85 with wrong words', () => {
    const result = scorePronunciation({
      target: 'I think this is three free things.',
      recognized: 'I tink dis is tree free tings.',
    });
    expect(result.overallScore).toBeLessThan(85);
    expect(result.phonemeFeedback.length).toBeGreaterThan(0);
    // Should include at least one th-variant tip.
    const phonemes = result.phonemeFeedback.map((t) => t.phoneme);
    expect(phonemes.some((p) => p.startsWith('th-'))).toBe(true);
  });

  it('caps phonemeFeedback at 3 tips even with many distinct errors', () => {
    const result = scorePronunciation({
      target: 'She thinks very carefully about three different things.',
      recognized: 'garbage garbage garbage garbage garbage garbage garbage garbage.',
    });
    expect(result.phonemeFeedback.length).toBeLessThanOrEqual(3);
  });

  it('deduplicates tips by phoneme key', () => {
    // Many th-words → should still surface one th tip, not several.
    const result = scorePronunciation({
      target: 'I think three thoughts. Think thin things.',
      recognized: 'I tink tree tots. Tink tin tings.',
    });
    const phonemes = result.phonemeFeedback.map((t) => t.phoneme);
    const unique = new Set(phonemes);
    expect(unique.size).toBe(phonemes.length);
  });
});

describe('inferPhonemeForWord', () => {
  it('maps known th-words to th-voiceless', () => {
    expect(inferPhonemeForWord('think')?.phoneme).toBe('th-voiceless');
    expect(inferPhonemeForWord('three')?.phoneme).toBe('th-voiceless');
  });

  it('maps known voiced-th words to th-voiced', () => {
    expect(inferPhonemeForWord('the')?.phoneme).toBe('th-voiced');
    expect(inferPhonemeForWord('this')?.phoneme).toBe('th-voiced');
  });

  it('maps v-words to v-vs-b', () => {
    expect(inferPhonemeForWord('very')?.phoneme).toBe('v-vs-b');
    expect(inferPhonemeForWord('love')?.phoneme).toBe('v-vs-b');
  });

  it('maps sh-words to sh', () => {
    expect(inferPhonemeForWord('she')?.phoneme).toBe('sh');
    expect(inferPhonemeForWord('ship')?.phoneme).toBe('sh');
  });

  it('detects final -ed past-tense pattern', () => {
    expect(inferPhonemeForWord('walked')?.phoneme).toBe('final-ed');
    expect(inferPhonemeForWord('talked')?.phoneme).toBe('final-ed');
  });

  it('detects final -s plural pattern (but not short -is/-us/-as)', () => {
    expect(inferPhonemeForWord('books')?.phoneme).toBe('final-s');
    expect(inferPhonemeForWord('cats')?.phoneme).toBe('final-s');
    // Short -us/-is endings shouldn't trigger final-s (too many false positives).
    expect(inferPhonemeForWord('bus')?.phoneme).not.toBe('final-s');
  });

  it('detects initial clusters for novel words', () => {
    expect(inferPhonemeForWord('street')?.phoneme).toBe('cluster-initial');
    expect(inferPhonemeForWord('bread')?.phoneme).toBe('cluster-initial');
  });

  it('returns null when no heuristic matches', () => {
    expect(inferPhonemeForWord('apple')).toBeNull();
    expect(inferPhonemeForWord('')).toBeNull();
  });

  it('falls back to v-vs-b when the heard word swapped v for b', () => {
    // "give" doesn't match any per-word entry, has no initial cluster,
    // no final -s/-ed — so the v/b heard-swap heuristic is the fallback
    // that should fire.
    const tip = inferPhonemeForWord('give', 'gib');
    expect(tip?.phoneme).toBe('v-vs-b');
  });
});

describe('PHONEME_TIPS catalog', () => {
  it('has a dozen or so entries', () => {
    expect(PHONEME_TIPS.length).toBeGreaterThanOrEqual(10);
    expect(PHONEME_TIPS.length).toBeLessThanOrEqual(20);
  });

  it('every tip has bilingual articulation copy', () => {
    for (const t of PHONEME_TIPS) {
      expect(t.articulation.en.trim().length).toBeGreaterThan(0);
      expect(t.articulation.vi.trim().length).toBeGreaterThan(0);
    }
  });

  it('every tip has at least 3 practice words', () => {
    for (const t of PHONEME_TIPS) {
      expect(t.practiceWords.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('every tip has at least one common error listed', () => {
    for (const t of PHONEME_TIPS) {
      expect(t.commonErrors.length).toBeGreaterThan(0);
    }
  });

  it('phoneme keys are unique across the catalog', () => {
    const keys = PHONEME_TIPS.map((t) => t.phoneme);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
