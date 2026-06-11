// src/lib/pronunciation/__tests__/f5MinimalPairAdapter.test.ts
//
// Tests for:
//   1. Adapter output shape — F5DrillItem satisfies ProblemPair + has all extensions
//   2. Picker filtering — pickF5ByDifficulty returns only the requested level
//   3. Corpus count — total adapted pairs == 100 (50 wave1 + 50 wave2)

import { describe, it, expect } from 'vitest';
import {
  adaptF5Pair,
  loadF5Corpus,
  isF5DrillItem,
  type F5DrillItem,
} from '../f5MinimalPairAdapter';
import {
  groupF5ByDifficulty,
  pickF5ByDifficulty,
  pickF5All,
} from '../f5MinimalPairPicker';

// ── 1. Adapter shape ──────────────────────────────────────────────────────

describe('adaptF5Pair', () => {
  const raw = {
    id: 'f5w1-001',
    category: 'final_consonants',
    pair: { target: 'bit', contrast: 'bid' },
    ipa: { target: '/bɪt/', contrast: '/bɪd/' },
    vi: 'Lý do VN nhầm.',
    examples: {
      target: 'I took one small bit of cake.',
      contrast: 'She made a fair bid for the car.',
    },
    difficulty: 'easy',
  };

  it('maps ProblemPair base fields correctly', () => {
    const item = adaptF5Pair(raw);
    expect(item.target).toBe('bit');
    expect(item.contrast).toBe('bid');
    expect(item.phoneme).toBe('final_consonants');
    expect(item.audioTarget).toBeNull();
    expect(item.audioContrast).toBeNull();
    expect(item.vnWhyConfused).toBe('Lý do VN nhầm.');
  });

  it('carries IPA for both words', () => {
    const item = adaptF5Pair(raw);
    expect(item.ipaTarget).toBe('/bɪt/');
    expect(item.ipaContrast).toBe('/bɪd/');
  });

  it('carries per-word example sentences', () => {
    const item = adaptF5Pair(raw);
    expect(item.exampleTarget).toBe('I took one small bit of cake.');
    expect(item.exampleContrast).toBe('She made a fair bid for the car.');
  });

  it('carries difficulty and corpus id', () => {
    const item = adaptF5Pair(raw);
    expect(item.difficulty).toBe('easy');
    expect(item.f5Id).toBe('f5w1-001');
    expect(item.f5Category).toBe('final_consonants');
  });
});

// ── 2. Type guard ─────────────────────────────────────────────────────────

describe('isF5DrillItem', () => {
  it('returns true for an F5DrillItem', () => {
    const all = loadF5Corpus();
    expect(isF5DrillItem(all[0])).toBe(true);
  });

  it('returns false for a plain ProblemPair', () => {
    const plain = {
      target: 'three',
      contrast: 'tree',
      phoneme: 'th-voiceless',
      audioTarget: null,
      audioContrast: null,
      vnWhyConfused: 'Không có âm "th" trong tiếng Việt.',
    };
    expect(isF5DrillItem(plain)).toBe(false);
  });
});

// ── 3. Corpus count ───────────────────────────────────────────────────────

describe('loadF5Corpus', () => {
  it('returns exactly 100 pairs (50 wave1 + 50 wave2)', () => {
    const all = loadF5Corpus();
    expect(all).toHaveLength(100);
  });

  it('all entries are valid F5DrillItems', () => {
    const all = loadF5Corpus();
    for (const item of all) {
      expect(item.f5Id).toMatch(/^f5w[12]-\d{3}$/);
      expect(item.target).toBeTruthy();
      expect(item.contrast).toBeTruthy();
      expect(item.ipaTarget).toMatch(/^\/.+\/$/);
      expect(item.ipaContrast).toMatch(/^\/.+\/$/);
      expect(item.exampleTarget).toBeTruthy();
      expect(item.exampleContrast).toBeTruthy();
      expect(['easy', 'medium', 'hard']).toContain(item.difficulty);
    }
  });

  it('ids are unique across both waves', () => {
    const all = loadF5Corpus();
    const ids = all.map((p) => p.f5Id);
    expect(new Set(ids).size).toBe(100);
  });
});

// ── 4. Picker filtering ───────────────────────────────────────────────────

describe('groupF5ByDifficulty', () => {
  it('every group contains only the correct difficulty', () => {
    const groups = groupF5ByDifficulty();
    for (const item of groups.easy) expect(item.difficulty).toBe('easy');
    for (const item of groups.medium) expect(item.difficulty).toBe('medium');
    for (const item of groups.hard) expect(item.difficulty).toBe('hard');
  });

  it('groups partition the full corpus — union equals 100', () => {
    const groups = groupF5ByDifficulty();
    const total = groups.easy.length + groups.medium.length + groups.hard.length;
    expect(total).toBe(100);
  });

  it('each difficulty level has at least one pair', () => {
    const groups = groupF5ByDifficulty();
    expect(groups.easy.length).toBeGreaterThan(0);
    expect(groups.medium.length).toBeGreaterThan(0);
    expect(groups.hard.length).toBeGreaterThan(0);
  });
});

describe('pickF5ByDifficulty', () => {
  it('returns only pairs of the requested difficulty', () => {
    const result = pickF5ByDifficulty('easy', { size: 10, seed: 1 });
    for (const item of result) expect(item.difficulty).toBe('easy');
  });

  it('respects the size option', () => {
    const result = pickF5ByDifficulty('medium', { size: 3, seed: 42 });
    expect(result).toHaveLength(3);
  });

  it('returns a stable order for a given seed', () => {
    const a = pickF5ByDifficulty('hard', { size: 5, seed: 7 });
    const b = pickF5ByDifficulty('hard', { size: 5, seed: 7 });
    expect(a.map((p) => p.f5Id)).toEqual(b.map((p) => p.f5Id));
  });

  it('returns a different order for a different seed', () => {
    const a = pickF5ByDifficulty('easy', { size: 10, seed: 1 });
    const b = pickF5ByDifficulty('easy', { size: 10, seed: 2 });
    // With 10 of the same pool the chance they match by accident is negligible.
    expect(a.map((p) => p.f5Id)).not.toEqual(b.map((p) => p.f5Id));
  });
});

describe('pickF5All', () => {
  it('returns at most size items', () => {
    const result = pickF5All({ size: 7, seed: 99 });
    expect(result).toHaveLength(7);
  });

  it('returns all 100 when no size given', () => {
    const result = pickF5All({ seed: 0 });
    expect(result).toHaveLength(100);
  });
});

// ── 5. F5DrillItem structure check (no ProblemPair fields missing) ────────

describe('F5DrillItem structural completeness', () => {
  it('each adapted pair satisfies the full F5DrillItem contract', () => {
    const corpus = loadF5Corpus();
    const REQUIRED_PROBLEM_PAIR_KEYS = [
      'target',
      'contrast',
      'phoneme',
      'audioTarget',
      'audioContrast',
      'vnWhyConfused',
    ] as const;
    const REQUIRED_F5_KEYS: (keyof F5DrillItem)[] = [
      'f5Id',
      'f5Category',
      'ipaTarget',
      'ipaContrast',
      'exampleTarget',
      'exampleContrast',
      'difficulty',
    ];
    for (const item of corpus) {
      for (const key of REQUIRED_PROBLEM_PAIR_KEYS) {
        expect(item).toHaveProperty(key);
      }
      for (const key of REQUIRED_F5_KEYS) {
        expect(item).toHaveProperty(key);
      }
    }
  });
});
