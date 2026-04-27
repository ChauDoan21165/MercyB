// src/lib/admin/markForReview.ts
//
// Helpers admins use to push content into the teacher review queue.
//
// Both functions UPSERT into `content_review_status`. RLS enforces that
// the caller is admin level >= 9 — the JS code does NOT do its own
// admin check; trusting RLS is the project pattern.
//
// `bulkMarkForReview` is a convenience wrapper that calls the single
// version per ID and counts new vs duplicate marks. We don't issue a
// single batched UPSERT because we want to distinguish "newly in_review"
// from "already in_review". That distinction matters for the admin UX:
// "Marked 12 new items, skipped 3 already in review" reads better than
// "Marked 15".

import { supabase } from "@/lib/supabaseClient";

export type ContentType =
  | "vstep"
  | "toeic"
  | "ielts"
  | "cultural"
  | "profession"
  | "room";

export type MarkForReviewResult =
  | { ok: true }
  | { ok: false; reason: string };

/**
 * Mark a single piece of content for teacher review.
 *
 * Behavior:
 *   - If no row exists for (content_id, content_type): INSERT with
 *     status = 'in_review', marked_for_review_at = now().
 *   - If a row exists with status = 'in_review' or 'needs_revision':
 *     leave it alone (idempotent — re-marking is a no-op).
 *   - If a row exists with any other status (approved/rejected/
 *     not_reviewed): re-set to 'in_review', refresh marked_for_review_at.
 *
 * Caller must be admin level >= 9 — RLS will reject otherwise.
 */
export async function markContentForReview(
  contentType: ContentType,
  contentId: string,
): Promise<MarkForReviewResult> {
  if (!contentId || !contentType) {
    return { ok: false, reason: "content_id and content_type are required" };
  }

  // Fetch current row (if any) so we can return precise feedback.
  const { data: existing, error: fetchError } = await supabase
    .from("content_review_status")
    .select("status")
    .eq("content_id", contentId)
    .eq("content_type", contentType)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, reason: fetchError.message };
  }

  const alreadyQueued =
    existing &&
    (existing.status === "in_review" || existing.status === "needs_revision");
  if (alreadyQueued) {
    return { ok: true };
  }

  const { error: upsertError } = await supabase
    .from("content_review_status")
    .upsert(
      {
        content_id: contentId,
        content_type: contentType,
        status: "in_review",
        marked_for_review_at: new Date().toISOString(),
      },
      { onConflict: "content_id,content_type" },
    );

  if (upsertError) {
    return { ok: false, reason: upsertError.message };
  }
  return { ok: true };
}

/**
 * Mark many items for review at once. Returns a {marked, skipped} pair
 * where `skipped` counts items already in the queue.
 */
export async function bulkMarkForReview(
  contentType: ContentType,
  contentIds: ReadonlyArray<string>,
): Promise<{ marked: number; skipped: number }> {
  let marked = 0;
  let skipped = 0;

  for (const id of contentIds) {
    // Look up existing status to disambiguate marked vs skipped.
    const { data: existing } = await supabase
      .from("content_review_status")
      .select("status")
      .eq("content_id", id)
      .eq("content_type", contentType)
      .maybeSingle();

    const alreadyQueued =
      existing &&
      (existing.status === "in_review" || existing.status === "needs_revision");

    if (alreadyQueued) {
      skipped++;
      continue;
    }

    const result = await markContentForReview(contentType, id);
    if (result.ok) {
      marked++;
    } else {
      // Treat row-level failures as skipped so the caller can keep going.
      skipped++;
    }
  }

  return { marked, skipped };
}
