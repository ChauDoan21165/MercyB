// src/services/listeningProgress.ts
//
// Read/write helpers for public.user_listening_progress.
//
// One row per (user, clip). Score and replays accumulate via UPSERT
// — re-attempting a clip overwrites the score and bumps the replays
// counter. RLS denies cross-user reads.

import { supabase } from "@/lib/supabaseClient";

export interface ListeningProgressRow {
  clip_id: string;
  completed_at: string;
  score: number;
  total_questions: number;
  replays: number;
}

export type SaveProgressInput = {
  clipId: string;
  score: number;
  totalQuestions: number;
  /** Total times the user replayed THIS attempt before submitting. */
  replays: number;
};

/**
 * Fetch the current user's listening progress. Returns an empty list
 * for anonymous sessions or when the table is unreachable — the
 * caller treats both as "no progress yet".
 */
export async function getUserListeningProgress(): Promise<ListeningProgressRow[]> {
  // user_listening_progress + listening_clips aren't in the generated
  // types yet (migration in this PR).
  type Sb = {
    auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> };
    from: (t: string) => {
      select: (cols: string) => {
        eq: (col: string, val: string) => {
          order: (col: string, opts?: { ascending: boolean }) => Promise<{
            data: ListeningProgressRow[] | null;
            error: { message?: string } | null;
          }>;
        };
      };
    };
  };
  const sb = supabase as unknown as Sb;

  const { data: userResult } = await sb.auth.getUser();
  const userId = userResult.user?.id ?? null;
  if (!userId) return [];

  const { data, error } = await sb
    .from("user_listening_progress")
    .select("clip_id, completed_at, score, total_questions, replays")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });
  if (error) {
    console.warn("[listeningProgress] read failed:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * UPSERT one row per (user, clip). Re-completing a clip refreshes
 * the score / completed_at and bumps the replays count.
 */
export async function saveListeningProgress(
  input: SaveProgressInput,
): Promise<{ ok: boolean; error?: string }> {
  type Sb = {
    auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> };
    from: (t: string) => {
      upsert: (
        row: Record<string, unknown>,
        opts?: { onConflict?: string },
      ) => Promise<{ error: { message?: string } | null }>;
    };
  };
  const sb = supabase as unknown as Sb;

  const { data: userResult } = await sb.auth.getUser();
  const userId = userResult.user?.id ?? null;
  if (!userId) return { ok: false, error: "not_authenticated" };

  const row = {
    user_id: userId,
    clip_id: input.clipId,
    score: Math.max(0, Math.min(input.totalQuestions, Math.round(input.score))),
    total_questions: Math.max(1, Math.round(input.totalQuestions)),
    replays: Math.max(0, Math.round(input.replays)),
    completed_at: new Date().toISOString(),
  };
  const { error } = await sb
    .from("user_listening_progress")
    .upsert(row, { onConflict: "user_id,clip_id" });
  if (error) {
    console.warn("[listeningProgress] save failed:", error.message);
    return { ok: false, error: error.message ?? "save_failed" };
  }
  return { ok: true };
}

/**
 * Convenience: return the set of clip IDs the current user has ever
 * completed. The Library uses this to render checkmarks; the Home
 * suggestion card uses it to pick the next clip in the most-recent
 * category.
 */
export async function getCompletedClipIds(): Promise<Set<string>> {
  const rows = await getUserListeningProgress();
  return new Set(rows.map((r) => r.clip_id));
}
