// Voting helpers for community interview prompts.
//
// Two operations: upvote and flag. Both INSERT a row into
// `user_interview_prompt_votes`. The trigger
// `user_interview_prompt_votes_block_self_upvote` enforces no
// self-upvote at the DB layer; we pre-check here for a nicer error.
//
// Daily-cap pre-check: a single user can submit at most 30 votes per
// 24h window (sum across upvote + flag). Exceeding it returns
// `{ ok: false, reason: 'daily_cap' }` without an INSERT attempt. The
// DB has no enforcement for this — it lives entirely in the app layer.
// Mass-flagging is the abuse vector worth blocking; downstream the
// trigger still auto-pulls at 5 flags from distinct users.

import { supabase } from "@/lib/supabaseClient";

import { INTERVIEW_PROMPT_LIMITS } from "./types";

export type VoteResult =
  | { ok: true }
  | { ok: false; reason: VoteFailureReason };

export type VoteFailureReason =
  | "daily_cap"
  | "already_voted"
  | "self_upvote"
  | "missing_user"
  | "missing_prompt"
  | "db_error";

const DAY_MS = 86_400_000;

/**
 * Returns the number of vote rows inserted by this user in the last
 * 24h. Used to enforce the daily cap before an INSERT.
 */
export async function countDailyVotes(userId: string): Promise<{
  count: number;
  error: string | null;
}> {
  const since = new Date(Date.now() - DAY_MS).toISOString();
  const { count, error } = await supabase
    .from("user_interview_prompt_votes")
    .select("user_id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("voted_at", since);
  if (error) return { count: 0, error: error.message };
  return { count: count ?? 0, error: null };
}

/**
 * Returns true if the user already cast a vote of this type on this
 * prompt. Cheap pre-check so the UI can show "already voted" without
 * tripping the PK error.
 */
export async function hasExistingVote(
  promptId: string,
  userId: string,
  voteType: "up" | "flag",
): Promise<{ exists: boolean; error: string | null }> {
  const { data, error } = await supabase
    .from("user_interview_prompt_votes")
    .select("user_id")
    .eq("prompt_id", promptId)
    .eq("user_id", userId)
    .eq("vote_type", voteType)
    .maybeSingle();
  if (error) return { exists: false, error: error.message };
  return { exists: !!data, error: null };
}

async function castVote(
  promptId: string,
  userId: string,
  voteType: "up" | "flag",
): Promise<VoteResult> {
  if (!userId) return { ok: false, reason: "missing_user" };
  if (!promptId) return { ok: false, reason: "missing_prompt" };

  // Daily cap.
  const { count, error: capError } = await countDailyVotes(userId);
  if (capError) return { ok: false, reason: "db_error" };
  if (count >= INTERVIEW_PROMPT_LIMITS.MAX_VOTES_PER_24H) {
    return { ok: false, reason: "daily_cap" };
  }

  // Already-voted pre-check (nicer UX than the PK 23505).
  const { exists, error: existsError } = await hasExistingVote(
    promptId,
    userId,
    voteType,
  );
  if (existsError) return { ok: false, reason: "db_error" };
  if (exists) return { ok: false, reason: "already_voted" };

  const { error: insertError } = await supabase
    .from("user_interview_prompt_votes")
    .insert({
      prompt_id: promptId,
      user_id: userId,
      vote_type: voteType,
    });

  if (insertError) {
    // The trigger raises "cannot upvote your own prompt" with sqlstate
    // 42501 — surface that distinctly so the UI can hide its button.
    if (
      insertError.message?.toLowerCase().includes("upvote your own") ||
      (insertError as { code?: string }).code === "42501"
    ) {
      return { ok: false, reason: "self_upvote" };
    }
    return { ok: false, reason: "db_error" };
  }
  return { ok: true };
}

export async function upvotePrompt(
  promptId: string,
  userId: string,
): Promise<VoteResult> {
  return castVote(promptId, userId, "up");
}

export async function flagPrompt(
  promptId: string,
  userId: string,
): Promise<VoteResult> {
  return castVote(promptId, userId, "flag");
}
