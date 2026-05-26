// Upload a generated score card PNG to the `share-cards` Supabase
// Storage bucket and return a public URL Facebook can scrape.
//
// Bucket lifecycle:
//   - `share-cards` is created by the migration shipped in this PR
//     (supabase/migrations/<ts>_share_cards_bucket.sql) as PUBLIC read.
//   - Authenticated users can INSERT objects under their own user-id
//     prefix (RLS in the migration enforces this).
//
// Filename scheme: `<user_id>/<unix_ms>-<random>.png`. The user-id
// prefix scopes RLS without requiring auth.uid() in URL paths. Random
// suffix prevents collisions when the same user shares twice in the
// same millisecond (possible with debounce-bypassed re-clicks).

import { supabase } from "@/lib/supabaseClient";

const BUCKET = "share-cards";

export type ShareCardUploadResult =
  | { ok: true; publicUrl: string; path: string }
  | { ok: false; reason: "anon" | "upload_failed" | "url_failed"; error?: string };

/**
 * Upload a Blob to the share-cards bucket and return a public URL.
 * Returns `{ ok: false, reason }` instead of throwing so callers can
 * fall back gracefully (e.g. open Facebook sharer with the bare app
 * URL when upload fails).
 */
export async function uploadShareCard(blob: Blob): Promise<ShareCardUploadResult> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    return { ok: false, reason: "anon" };
  }

  const path = derivePath(user.id);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, {
      cacheControl: "604800", // 7 days; OG scrapers cache for ~1 day anyway
      contentType: "image/png",
      upsert: false,
    });

  if (uploadError) {
    console.warn("[uploadShareCard] upload failed:", uploadError.message);
    return { ok: false, reason: "upload_failed", error: uploadError.message };
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!urlData?.publicUrl) {
    return { ok: false, reason: "url_failed" };
  }

  return { ok: true, publicUrl: urlData.publicUrl, path };
}

/**
 * Build the storage path. Exported for tests; not used externally.
 *
 * Format: `<user-id>/<unix-ms>-<random>.png`
 *   - user-id prefix is the RLS gate (matches `auth.uid()` in policy)
 *   - timestamp gives natural ordering for cleanup queries
 *   - random suffix breaks ties on rapid re-shares
 */
export function derivePath(userId: string): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 10);
  return `${userId}/${ts}-${rand}.png`;
}
