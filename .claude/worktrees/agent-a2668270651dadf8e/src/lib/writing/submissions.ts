// src/lib/writing/submissions.ts
//
// Thin Supabase wrappers for user_writing_submissions reads / writes.
// The session page calls `recordSubmission` after a successful AI
// feedback round-trip; the list page calls `listCompletedPromptIds` to
// mark prompts as done in the filter chip.

import { supabase } from "@/lib/supabaseClient";

import type { WritingFeedback, WritingSubmissionRow } from "./types";

export interface RecordSubmissionInput {
  userId: string;
  promptId: string;
  submissionText: string;
  feedback: WritingFeedback;
  timeSpentSeconds: number;
}

export async function recordSubmission(
  input: RecordSubmissionInput,
): Promise<WritingSubmissionRow | null> {
  try {
    const { data, error } = await supabase
      .from("user_writing_submissions")
      .insert({
        user_id: input.userId,
        prompt_id: input.promptId,
        submission_text: input.submissionText,
        ai_feedback: input.feedback,
        score: input.feedback.score,
        time_spent_seconds: Math.max(0, Math.round(input.timeSpentSeconds)),
      })
      .select("*")
      .maybeSingle();
    if (error) {
      console.warn("[writing] recordSubmission error", error);
      return null;
    }
    return (data as unknown as WritingSubmissionRow) ?? null;
  } catch (err) {
    console.warn("[writing] recordSubmission threw", err);
    return null;
  }
}

/**
 * Returns the set of prompt ids the calling user has at least one
 * submission for. Used by the list page to render a "✓ Đã làm / Done"
 * badge on completed prompts.
 */
export async function listCompletedPromptIds(
  userId: string,
): Promise<Set<string>> {
  try {
    const { data, error } = await supabase
      .from("user_writing_submissions")
      .select("prompt_id")
      .eq("user_id", userId);
    if (error || !Array.isArray(data)) return new Set();
    const ids = new Set<string>();
    for (const row of data as Array<{ prompt_id?: string }>) {
      if (typeof row.prompt_id === "string") ids.add(row.prompt_id);
    }
    return ids;
  } catch {
    return new Set();
  }
}
