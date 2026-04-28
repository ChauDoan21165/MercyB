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
//
// Phase 2 (PR #218) adds getPromptsForInterview() at the bottom of this
// file — the I/O wrapper that loads community rows from Supabase, mixes
// them with caller-provided hardcoded prompts via the helpers above, and
// returns a typed InterviewSessionPrompt[] with attribution metadata.

import { trackCommunityPromptFallback } from "./telemetry";
import type { InterviewPromptProfession } from "./types";

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

// ──────────────────────────────────────────────────────────────────────
// Phase 2 — getPromptsForInterview()
//
// I/O wrapper. Pulls top-voted approved community prompts from
// `user_interview_prompts`, joins to `profiles.display_name` for
// attribution (suppressed when the submitter chose anonymity), then
// mixes with caller-supplied hardcoded prompts via mixPrompts above.
//
// On Supabase error or empty community result, falls back to
// all-hardcoded silently. The interview must never break because
// community is unreachable.
// ──────────────────────────────────────────────────────────────────────

export interface InterviewSessionPrompt {
  source: "hardcoded" | "community";
  text: string;
  /** Optional Vietnamese translation surfaced by the room when present. */
  textVi?: string;
  /** Only set when source === 'community'. */
  communityPromptId?: string;
  /** null = "Anonymous" (either the submitter opted in to anonymity, or
   *  the join couldn't resolve a name). */
  submitterDisplayName?: string | null;
  /** e.g. "Hỏi tại Wells Fargo, San Jose, 2024-11" */
  context?: string | null;
}

export interface HardcodedPromptInput {
  text: string;
  textVi?: string;
}

export interface GetPromptsParams {
  profession: InterviewPromptProfession;
  hardcodedPrompts: ReadonlyArray<HardcodedPromptInput>;
  hardcodedCount: number;
  communityCount: number;
  seed?: number;
}

/**
 * Internal shape of the joined Supabase row. Kept narrow — we only
 * read the columns the UI needs.
 */
interface CommunityPromptRow {
  id: string;
  question_text_en: string;
  question_text_vi: string | null;
  context: string | null;
  submitter_anonymous: boolean;
  upvotes_count: number;
  published_at: string | null;
  profiles?: { display_name: string | null } | null;
}

function rowToCommunityPrompt(row: CommunityPromptRow): InterviewSessionPrompt {
  const submitterDisplayName = row.submitter_anonymous
    ? null
    : row.profiles?.display_name ?? null;
  return {
    source: "community",
    text: row.question_text_en,
    textVi: row.question_text_vi ?? undefined,
    communityPromptId: row.id,
    submitterDisplayName,
    context: row.context,
  };
}

function hardcodedToSessionPrompt(
  h: HardcodedPromptInput,
): InterviewSessionPrompt {
  return {
    source: "hardcoded",
    text: h.text,
    textVi: h.textVi,
  };
}

/**
 * Load community prompts for a profession, mix with the caller's
 * hardcoded deck, return a unified ordered list. Always returns
 * hardcodedCount + communityCount items (or fewer if hardcoded is
 * shorter); on error, returns all-hardcoded.
 */
export async function getPromptsForInterview(
  params: GetPromptsParams,
): Promise<InterviewSessionPrompt[]> {
  const {
    profession,
    hardcodedPrompts,
    hardcodedCount,
    communityCount,
    seed,
  } = params;

  const totalSlots = hardcodedCount + communityCount;
  const allHardcoded = hardcodedPrompts
    .slice(0, totalSlots)
    .map(hardcodedToSessionPrompt);

  if (communityCount <= 0) {
    return allHardcoded;
  }

  // Fetch top-voted published community prompts for this profession.
  // The join string mirrors PostgREST: profiles!user_interview_prompts_submitter_user_id_fkey
  // would be the explicit form; the alias below relies on the FK being
  // unambiguous, which it is for this table.
  //
  // Lazy import so the pure mixer above stays free of Supabase deps;
  // pure-mixer tests don't need to mock the client.
  let rows: CommunityPromptRow[] = [];
  try {
    const { supabase } = await import("@/lib/supabaseClient");
    const { data, error } = await supabase
      .from("user_interview_prompts")
      .select(
        "id, question_text_en, question_text_vi, context, submitter_anonymous, upvotes_count, published_at, profiles:submitter_user_id(display_name)",
      )
      .eq("status", "published")
      .eq("profession", profession)
      .order("upvotes_count", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(communityCount);
    if (error) {
      // Silent fallback — interview must keep working.
      // eslint-disable-next-line no-console
      console.warn(
        "[getPromptsForInterview] supabase error, falling back to hardcoded",
        error.message,
      );
      return allHardcoded;
    }
    rows = (data ?? []) as unknown as CommunityPromptRow[];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(
      "[getPromptsForInterview] supabase threw, falling back to hardcoded",
      err,
    );
    return allHardcoded;
  }

  if (rows.length === 0) {
    trackCommunityPromptFallback({
      profession,
      reason: "no_community_rows",
      requested: communityCount,
      received: 0,
    });
    return allHardcoded;
  }

  // Underflow case — community returned fewer rows than requested.
  // Pad missing slots from hardcoded so the interview length is
  // preserved. We log via telemetry so we know the cohort is thin.
  if (rows.length < communityCount) {
    trackCommunityPromptFallback({
      profession,
      reason: "underflow",
      requested: communityCount,
      received: rows.length,
    });
  }

  const communityPrompts =
    seed != null
      ? shuffleSeeded(rows.map(rowToCommunityPrompt), seed)
      : rows.map(rowToCommunityPrompt);

  // Pad hardcoded slots to fill the gap if community underflowed.
  const hardcodedSlots = hardcodedCount + (communityCount - communityPrompts.length);
  const hardcodedSession = hardcodedPrompts
    .slice(0, hardcodedSlots)
    .map(hardcodedToSessionPrompt);

  if (communityPrompts.length === 0) return hardcodedSession;
  if (hardcodedSession.length === 0) return communityPrompts;

  return roundRobinMerge(
    communityPrompts,
    hardcodedSession,
    communityPrompts.length,
    hardcodedSession.length,
  );
}

