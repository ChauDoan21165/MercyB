// Eligibility for submitting a community interview prompt.
//
// Rules:
//   1. User must have completed >= 3 mock interviews. The data source
//      is `mock_interview_sessions` rows where status='completed' for
//      this user (introduced in 20260519000000_mock_interview_rate_limit.sql).
//   2. User cannot have submitted >= 10 prompts in the last 30 days
//      (anti-spam cap; submitted_at on user_interview_prompts).
//
// Pure helpers (`hasReachedMonthlyLimit`, `countCompletedSessions`) are
// exported separately for unit tests so the Supabase mock surface stays
// small. Mirrors the user_stories eligibility module.
//
// TODO before deploy: confirm `mock_interview_sessions.status` always
// flips to 'completed' on session end. If a meaningful chunk of
// real-world finishes leaves rows at 'active'/'abandoned', soften the
// gate to count any session row instead.

import { supabase } from "@/lib/supabaseClient";

import { INTERVIEW_PROMPT_LIMITS } from "./types";

export type SubmitEligibility =
  | { eligible: true }
  | { eligible: false; reason: string; reasonVi: string };

const DAY_MS = 86_400_000;

/**
 * Pure check: given an array of submission timestamps and "now", return
 * true if the user has already submitted MAX_SUBMISSIONS_PER_30_DAYS in
 * the last 30 days. Exported for tests.
 */
export function hasReachedMonthlyLimit(
  submissions: ReadonlyArray<Date>,
  now: Date = new Date(),
): boolean {
  const cutoff = now.getTime() - 30 * DAY_MS;
  const recent = submissions.filter((d) => d.getTime() >= cutoff);
  return recent.length >= INTERVIEW_PROMPT_LIMITS.MAX_SUBMISSIONS_PER_30_DAYS;
}

/**
 * Count this user's completed mock-interview sessions. Wraps the
 * `mock_interview_sessions` query so the eligibility caller can stay
 * declarative and tests can mock just this function in isolation if
 * preferred.
 */
export async function countCompletedSessions(
  userId: string,
): Promise<{ count: number; error: string | null }> {
  const { count, error } = await supabase
    .from("mock_interview_sessions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "completed");

  if (error) {
    return { count: 0, error: error.message };
  }
  return { count: count ?? 0, error: null };
}

/**
 * Count this user's prompt submissions in the last 30 days.
 */
export async function countRecentSubmissions(
  userId: string,
): Promise<{ count: number; error: string | null }> {
  const since = new Date(Date.now() - 30 * DAY_MS).toISOString();
  const { count, error } = await supabase
    .from("user_interview_prompts")
    .select("id", { count: "exact", head: true })
    .eq("submitter_user_id", userId)
    .gte("submitted_at", since);

  if (error) {
    return { count: 0, error: error.message };
  }
  return { count: count ?? 0, error: null };
}

/**
 * The full eligibility check. Returns `{ eligible: true }` or
 * `{ eligible: false, reason, reasonVi }`. UIs should display
 * `reasonVi`. Order is cheapest-first: completions → submissions cap.
 */
export async function canSubmitInterviewPrompt(
  userId: string,
): Promise<SubmitEligibility> {
  if (!userId) {
    return {
      eligible: false,
      reason: "missing user id",
      reasonVi: "Vui lòng đăng nhập để gửi câu hỏi.",
    };
  }

  // 1. Completed sessions — the "earned the right to contribute" gate.
  const { count: completed, error: countError } =
    await countCompletedSessions(userId);

  if (countError) {
    return {
      eligible: false,
      reason: `mock_interview_sessions count failed: ${countError}`,
      reasonVi: "Không tải được lịch sử phỏng vấn. Vui lòng thử lại sau.",
    };
  }

  if (completed < INTERVIEW_PROMPT_LIMITS.MIN_COMPLETIONS_TO_SUBMIT) {
    return {
      eligible: false,
      reason: `mock_interview_sessions completed < ${INTERVIEW_PROMPT_LIMITS.MIN_COMPLETIONS_TO_SUBMIT}`,
      reasonVi: `Hãy hoàn thành ít nhất ${INTERVIEW_PROMPT_LIMITS.MIN_COMPLETIONS_TO_SUBMIT} phỏng vấn thử trước khi đóng góp câu hỏi cho cộng đồng.`,
    };
  }

  // 2. Monthly submission cap.
  const { count: recent, error: subError } =
    await countRecentSubmissions(userId);

  if (subError) {
    return {
      eligible: false,
      reason: `user_interview_prompts count failed: ${subError}`,
      reasonVi: "Không tải được số câu hỏi đã gửi. Vui lòng thử lại sau.",
    };
  }

  if (recent >= INTERVIEW_PROMPT_LIMITS.MAX_SUBMISSIONS_PER_30_DAYS) {
    return {
      eligible: false,
      reason: `submissions in last 30 days >= ${INTERVIEW_PROMPT_LIMITS.MAX_SUBMISSIONS_PER_30_DAYS}`,
      reasonVi: `Bạn đã gửi tối đa ${INTERVIEW_PROMPT_LIMITS.MAX_SUBMISSIONS_PER_30_DAYS} câu hỏi trong 30 ngày. Hãy quay lại sau.`,
    };
  }

  return { eligible: true };
}
