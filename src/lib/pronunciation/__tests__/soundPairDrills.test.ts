// src/lib/pronunciation/__tests__/soundPairDrills.test.ts
//
// Covers the sound-pair drill library: category selection, deterministic
// shuffle via seed, the pure scoring heuristic, and the stubbed STT.
// Does not touch SpeechDrill or scorer.ts — that's scorer.test.ts'
// territory.

import { describe, it, expect } from 'vitest';

import {
  DRILL_CATEGORIES,
  getDrillByCategory,
  scoreDrillAttempt,
  scoreFromAudio,
} from '../soundPairDrills';
import {
  PROBLEM_PAIRS_ED_ENDINGS,
  PROBLEM_PAIRS_INTONATION,
  PROBLEM_PAIRS_R_L,
  PROBLEM_PAIRS_S_PLURALS,
  PROBLEM_PAIRS_STRESS,
  PROBLEM_PAIRS_TH_T,
} from '../vn-phoneme-map';

describe('DRILL_CATEGORIES', () => {
  it('exposes the six expected categories in a stable order', () => {
    expect([...DRILL_CATEGORIES]).toEqual([
      'th-t', 'r-l', 'ed', 's', 'stress', 'intonation',
    ]);
  });
});

describe('PROBLEM_PAIRS_* catalogs', () => {
  it('each set has at least 6 pairs (stress/intonation) or 8 (older sets)', () => {
    expect(PROBLEM_PAIRS_TH_T.length).toBeGreaterThanOrEqual(8);
    expect(PROBLEM_PAIRS_R_L.length).toBeGreaterThanOrEqual(8);
    expect(PROBLEM_PAIRS_ED_ENDINGS.length).toBeGreaterThanOrEqual(8);
    expect(PROBLEM_PAIRS_S_PLURALS.length).toBeGreaterThanOrEqual(8);
    expect(PROBLEM_PAIRS_STRESS.length).toBeGreaterThanOrEqual(6);
    expect(PROBLEM_PAIRS_INTONATION.length).toBeGreaterThanOrEqual(6);
  });

  it('each pair has a non-empty VN why-confused explanation', () => {
    const all = [
      ...PROBLEM_PAIRS_TH_T,
      ...PROBLEM_PAIRS_R_L,
      ...PROBLEM_PAIRS_ED_ENDINGS,
      ...PROBLEM_PAIRS_S_PLURALS,
      ...PROBLEM_PAIRS_STRESS,
      ...PROBLEM_PAIRS_INTONATION,
    ];
    for (const p of all) {
      expect(p.target.trim().length).toBeGreaterThan(0);
      expect(p.contrast.trim().length).toBeGreaterThan(0);
      expect(p.vnWhyConfused.trim().length).toBeGreaterThan(0);
    }
  });

  it('target and contrast differ in every pair', () => {
    const all = [
      ...PROBLEM_PAIRS_TH_T,
      ...PROBLEM_PAIRS_R_L,
      ...PROBLEM_PAIRS_ED_ENDINGS,
      ...PROBLEM_PAIRS_S_PLURALS,
      ...PROBLEM_PAIRS_STRESS,
      ...PROBLEM_PAIRS_INTONATION,
    ];
    for (const p of all) {
      expect(p.target.toLowerCase()).not.toBe(p.contrast.toLowerCase());
    }
  });

  it('stress pool uses phoneme="word-stress" and intonation pool uses phoneme="intonation"', () => {
    for (const p of PROBLEM_PAIRS_STRESS) expect(p.phoneme).toBe('word-stress');
    for (const p of PROBLEM_PAIRS_INTONATION) expect(p.phoneme).toBe('intonation');
  });
});

describe('getDrillByCategory', () => {
  it('returns up to `size` items, defaulting to 5', () => {
    const drill = getDrillByCategory('th-t', { seed: 1 });
    expect(drill.length).toBe(5);
  });

  it('caps size to the pool size', () => {
    const drill = getDrillByCategory('r-l', { size: 999, seed: 1 });
    expect(drill.length).toBe(PROBLEM_PAIRS_R_L.length);
  });

  it('is deterministic given the same seed', () => {
    const a = getDrillByCategory('ed', { seed: 42 });
    const b = getDrillByCategory('ed', { seed: 42 });
    expect(a.map((p) => p.target)).toEqual(b.map((p) => p.target));
  });

  it('produces different orderings for different seeds (non-trivial pool)', () => {
    const a = getDrillByCategory('s', { seed: 1, size: 10 });
    const b = getDrillByCategory('s', { seed: 2, size: 10 });
    // It's theoretically possible two random seeds land on identical
    // orderings; with a pool of 10 and these seeds it doesn't.
    expect(a.map((p) => p.target)).not.toEqual(b.map((p) => p.target));
  });

  it('does not mutate the underlying pool', () => {
    const before = PROBLEM_PAIRS_TH_T.map((p) => p.target);
    getDrillByCategory('th-t', { seed: 5, size: 5 });
    getDrillByCategory('th-t', { seed: 7, size: 5 });
    const after = PROBLEM_PAIRS_TH_T.map((p) => p.target);
    expect(after).toEqual(before);
  });

  it('returns an empty array when the pool is missing (defensive)', () => {
    // @ts-expect-error — exercising runtime guard
    expect(getDrillByCategory('nonsense')).toEqual([]);
  });
});

describe('scoreDrillAttempt', () => {
  it('returns 1.0 for an exact (case-insensitive) match', () => {
    expect(scoreDrillAttempt('three', 'three')).toBe(1);
    expect(scoreDrillAttempt('Three', 'THREE')).toBe(1);
    expect(scoreDrillAttempt('  worked  ', 'worked')).toBe(1);
  });

  it('returns 0 for empty input on either side', () => {
    expect(scoreDrillAttempt('', 'anything')).toBe(0);
    expect(scoreDrillAttempt('rice', '')).toBe(0);
  });

  it('returns a partial score for a close miss', () => {
    const score = scoreDrillAttempt('three', 'tree');
    expect(score).toBeGreaterThan(0.5);
    expect(score).toBeLessThan(1);
  });

  it('returns a low score for unrelated words', () => {
    const score = scoreDrillAttempt('three', 'banana');
    expect(score).toBeLessThan(0.5);
  });

  it('clamps output to [0, 1]', () => {
    const score = scoreDrillAttempt('a', 'zzzzzzzzzz');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });
});

describe('scoreFromAudio (STT stub)', () => {
  it('returns a stable mock confidence and a `mocked: true` marker', async () => {
    const result = await scoreFromAudio(null);
    expect(result.mocked).toBe(true);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
    expect(typeof result.transcript).toBe('string');
  });
});
