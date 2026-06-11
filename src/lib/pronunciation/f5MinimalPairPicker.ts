/**
 * Pair-picker for the F5 minimal-pairs corpus.
 *
 * Groups the 100 adapted pairs by difficulty tag and returns shuffled
 * slices. The same Fisher-Yates + Mulberry32 helpers used in
 * soundPairDrills.ts keep the seeded-shuffle contract consistent.
 */

import { loadF5Corpus, type F5DrillItem, type F5Difficulty } from './f5MinimalPairAdapter';

export type F5PickerOptions = {
  /** How many pairs to return. Defaults to 5; capped by pool size. */
  size?: number;
  /**
   * Deterministic seed for the shuffle. Omit in production (Math.random);
   * pass a number in tests so assertions are stable.
   */
  seed?: number;
};

/** Return all 100 pairs split by difficulty tag. */
export function groupF5ByDifficulty(): Record<F5Difficulty, F5DrillItem[]> {
  const all = loadF5Corpus();
  return {
    easy: all.filter((p) => p.difficulty === 'easy'),
    medium: all.filter((p) => p.difficulty === 'medium'),
    hard: all.filter((p) => p.difficulty === 'hard'),
  };
}

/** Return a shuffled slice of pairs for a given difficulty level. */
export function pickF5ByDifficulty(
  difficulty: F5Difficulty,
  opts?: F5PickerOptions,
): F5DrillItem[] {
  const groups = groupF5ByDifficulty();
  const pool = groups[difficulty];
  if (!pool.length) return [];
  const size = Math.max(1, Math.min(opts?.size ?? 5, pool.length));
  const rand = opts?.seed === undefined ? Math.random : mulberry32(opts.seed);
  return fisherYates(pool.slice(), rand).slice(0, size);
}

/** Return a shuffled slice across all difficulties. */
export function pickF5All(opts?: F5PickerOptions): F5DrillItem[] {
  const all = loadF5Corpus();
  if (!all.length) return [];
  const size = Math.max(1, Math.min(opts?.size ?? all.length, all.length));
  const rand = opts?.seed === undefined ? Math.random : mulberry32(opts?.seed ?? 0);
  return fisherYates(all.slice(), rand).slice(0, size);
}

// ─── helpers (mirrors soundPairDrills.ts; kept local to avoid coupling) ───

function fisherYates<T>(arr: T[], rand: () => number): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
