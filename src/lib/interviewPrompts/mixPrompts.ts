// Pure deterministic mixer — combines hardcoded mock-interview prompts
// with community-curated ones based on a user-controlled ratio.
//
// Contract (the surgical change in MockInterviewRoom relies on this
// exactly):
//   - communityRatio is clamped to [0, 1].
//   - 0  → returns hardcoded only.
//   - 1  → returns community only (graceful fallback to hardcoded if
//          community is empty).
//   - 0 < ratio < 1 → mixes via a deterministic round-robin so the
//          same seed always produces the same order.
//   - If community is empty at any non-zero ratio, returns hardcoded
//          (a separate isFallback flag is exposed via mixPromptsResult
//          so the UI can show the "no community prompts yet" notice).
//
// The output length equals the number of slots from the hardcoded set —
// we don't grow the interview just because the user enabled community
// mode. Community items consumed = round(ratio * total).

export interface MixedPromptResult<T> {
  items: T[];
  /**
   * True when the caller asked for any community ratio but no community
   * prompts existed; we fell back to 100% hardcoded. Lets the UI show
   * a small notice instead of silently doing nothing.
   */
  fallback: boolean;
}

/**
 * Tiny deterministic PRNG (mulberry32). Cheap, no deps, good enough for
 * shuffling a 10-element interview deck. Same seed → same sequence.
 */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Stable Fisher-Yates with a seeded RNG. Returns a NEW array; doesn't
 * mutate input.
 */
export function shuffleSeeded<T>(items: ReadonlyArray<T>, seed: number): T[] {
  const out = items.slice();
  const rand = mulberry32(seed || 1);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function clampRatio(ratio: number): number {
  if (!Number.isFinite(ratio)) return 0;
  if (ratio < 0) return 0;
  if (ratio > 1) return 1;
  return ratio;
}

/**
 * Round-robin merge — deterministic alternation for the mixed case.
 * Given counts {community: c, hardcoded: h} we step through a virtual
 * timeline: at step i, take from community if (i / total) crosses the
 * next community boundary, else hardcoded. This produces the
 * "alternating items" property required by the test spec for a 50/50
 * split.
 */
function roundRobinMerge<T>(
  community: ReadonlyArray<T>,
  hardcoded: ReadonlyArray<T>,
  communityCount: number,
  hardcodedCount: number,
): T[] {
  const out: T[] = [];
  const total = communityCount + hardcodedCount;
  let cIdx = 0;
  let hIdx = 0;
  let cTaken = 0;
  let hTaken = 0;
  for (let i = 0; i < total; i++) {
    // Idealised position: how many community items "should" we have
    // by step i+1?
    const expectedC = Math.round(((i + 1) * communityCount) / total);
    if (cTaken < expectedC && cIdx < community.length) {
      out.push(community[cIdx++]);
      cTaken++;
    } else if (hIdx < hardcoded.length) {
      out.push(hardcoded[hIdx++]);
      hTaken++;
    } else if (cIdx < community.length) {
      out.push(community[cIdx++]);
      cTaken++;
    }
  }
  return out;
}

/**
 * Main entrypoint. See module-level comment for the full contract.
 *
 * @param community  Community prompts, ideally already sorted by
 *                   upvotes_count desc by the caller.
 * @param hardcoded  The room's existing prompt deck (canonical order).
 * @param communityRatio  0..1 fraction of slots filled from community.
 * @param seed       Optional reproducible shuffle seed. When provided,
 *                   community is shuffled deterministically before
 *                   slicing — useful for "same room, same order" UX.
 */
export function mixPrompts<T>(
  community: ReadonlyArray<T>,
  hardcoded: ReadonlyArray<T>,
  communityRatio: number,
  seed?: number,
): T[] {
  return mixPromptsWithFallback(community, hardcoded, communityRatio, seed)
    .items;
}

/**
 * Same logic as mixPrompts but also returns the fallback flag for the
 * UI notice.
 */
export function mixPromptsWithFallback<T>(
  community: ReadonlyArray<T>,
  hardcoded: ReadonlyArray<T>,
  communityRatio: number,
  seed?: number,
): MixedPromptResult<T> {
  const ratio = clampRatio(communityRatio);
  const total = hardcoded.length;

  if (total === 0) return { items: [], fallback: false };
  if (ratio === 0) return { items: hardcoded.slice(), fallback: false };
  if (community.length === 0) {
    return { items: hardcoded.slice(), fallback: true };
  }

  const shuffledCommunity =
    seed != null ? shuffleSeeded(community, seed) : community.slice();

  const wantedCommunity = Math.round(ratio * total);
  const cCount = Math.min(wantedCommunity, shuffledCommunity.length);
  const hCount = total - cCount;

  if (cCount === 0) return { items: hardcoded.slice(0, hCount), fallback: false };
  if (hCount === 0) {
    return { items: shuffledCommunity.slice(0, cCount), fallback: false };
  }

  const merged = roundRobinMerge(
    shuffledCommunity.slice(0, cCount),
    hardcoded.slice(0, hCount),
    cCount,
    hCount,
  );
  return { items: merged, fallback: false };
}
