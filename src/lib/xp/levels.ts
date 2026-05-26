// src/lib/xp/levels.ts
//
// Pure level-curve math. Mirrors the SQL helper public.xp_level_for_total
// in migration 20260609000000_xp_system.sql — keep them in sync.
//
// Formula (per A9 brief):
//   cumulative XP for level N (N >= 1):
//     level 1 = 0
//     level N = round(125 * (1.4^(N-1) - 1))
//
// Verifies: L2 = 50, L3 = 120, L4 = 218, L5 = 343 — all match the brief.
// Cap at level 100 to prevent runaway numbers; the curve hits ~24M XP
// at L100 which is generous enough that nobody will reach it before
// the curve gets retuned.

export const MAX_LEVEL = 100;

/** Cumulative XP required to reach the start of the given level.
 *  L1 = 0. L2 = 50. L3 = 120. */
export function cumulativeXPForLevel(level: number): number {
  if (!Number.isFinite(level) || level <= 1) return 0;
  const capped = Math.min(MAX_LEVEL, Math.floor(level));
  return Math.round(125 * (1.4 ** (capped - 1) - 1));
}

/** XP needed to advance from level N to level N+1. */
export function xpToNextLevel(level: number): number {
  if (level >= MAX_LEVEL) return 0;
  return cumulativeXPForLevel(level + 1) - cumulativeXPForLevel(level);
}

/** The level the user is currently at given their total XP. */
export function levelForXP(totalXP: number): number {
  if (Number.isNaN(totalXP) || totalXP <= 0) return 1;
  if (totalXP === Number.POSITIVE_INFINITY) return MAX_LEVEL;
  // Linear scan is fine — at most 100 iterations, no I/O.
  let level = 1;
  for (let n = 2; n <= MAX_LEVEL; n += 1) {
    if (totalXP < cumulativeXPForLevel(n)) {
      return level;
    }
    level = n;
  }
  return MAX_LEVEL;
}

/** Progress toward the next level as { current, next, into, span, fraction }.
 *  - current: current level
 *  - next: next level (or current if at MAX_LEVEL)
 *  - into: XP earned past the current level threshold
 *  - span: XP needed from current level to next (0 at MAX_LEVEL)
 *  - fraction: into / span, clamped [0, 1]; 1 at MAX_LEVEL */
export function levelProgress(totalXP: number): {
  current: number;
  next: number;
  into: number;
  span: number;
  fraction: number;
} {
  const current = levelForXP(totalXP);
  if (current >= MAX_LEVEL) {
    return { current, next: current, into: 0, span: 0, fraction: 1 };
  }
  const start = cumulativeXPForLevel(current);
  const end = cumulativeXPForLevel(current + 1);
  const into = Math.max(0, totalXP - start);
  const span = end - start;
  const fraction = span > 0 ? Math.min(1, into / span) : 0;
  return { current, next: current + 1, into, span, fraction };
}
