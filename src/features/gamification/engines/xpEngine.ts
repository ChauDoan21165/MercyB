// src/features/gamification/engines/xpEngine.ts
//
// Lane F — F2: the XP engine. PURE reducer over XpState.
//
// Level curve (quadratic, gentle early, steeper later):
//
//   xpForLevel(L) = 100 * (L - 1)^2     // cumulative XP floor to REACH level L
//     L1 = 0, L2 = 100, L3 = 400, L4 = 900, L5 = 1600, …
//
//   levelForXp(totalXp) = floor(sqrt(max(0, totalXp) / 100)) + 1
//
// These are exact inverses at the boundaries:
//   xpForLevel(L)         -> levelForXp gives L     (floor lands exactly on L)
//   xpForLevel(L+1) - 1   -> levelForXp gives L     (just below the next floor)
//
// No mutation of input state — every method returns fresh objects.

import type {
  XpAward,
  XpEngine,
  XpLevelProgress,
  XpReason,
  XpState,
} from "../types";

/** Cumulative XP floor required to BE at `level`. xpForLevel(1) === 0. */
function xpForLevel(level: number): number {
  // Levels below 1 are nonsensical; clamp so the floor never goes negative.
  const L = Math.max(1, Math.floor(level));
  return 100 * (L - 1) * (L - 1);
}

/** Level reached at a given lifetime XP. Monotonic non-decreasing. */
function levelForXp(totalXp: number): number {
  const xp = Math.max(0, totalXp);
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

function clamp01(n: number): number {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

export const xpEngine: XpEngine = {
  xpForLevel,
  levelForXp,

  award(state: XpState, amount: number, _reason: XpReason): XpAward {
    // Negative awards are ignored (XP is monotonic; never decreases).
    const add = amount > 0 ? amount : 0;
    const totalXp = state.totalXp + add;

    // Recompute oldLevel from totalXp so a stale cached `state.level` can't
    // produce a bogus leveledUp/levelsGained. Consistent on both sides.
    const oldLevel = levelForXp(state.totalXp);
    const newLevel = levelForXp(totalXp);

    return {
      state: { totalXp, level: newLevel },
      leveledUp: newLevel > oldLevel,
      newLevel,
      levelsGained: Math.max(0, newLevel - oldLevel),
    };
  },

  progress(totalXp: number): XpLevelProgress {
    const level = levelForXp(totalXp);
    const floor = xpForLevel(level);
    const next = xpForLevel(level + 1);
    const intoLevel = totalXp - floor;
    const neededForNext = next - floor;
    const ratio =
      neededForNext > 0 ? clamp01(intoLevel / neededForNext) : 0;
    return { level, intoLevel, neededForNext, ratio };
  },
};
