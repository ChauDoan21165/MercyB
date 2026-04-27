// Story-card photo upload — reuses the existing `share-cards` bucket
// so we don't need a new RLS migration. Path scheme is
// `<user_id>/stories/<unix_ms>-<random>.<ext>` so it slots into the
// share_cards_owner_insert RLS policy (which checks
// (storage.foldername(name))[1] == auth.uid()) without modification.
//
// Public read is already on for the bucket — Facebook's OG scraper
// needs that for share cards, and the same property is fine for
// avatar-style photos on a public stories page.
//
// Returns `{ ok: false, reason }` on failure so the form can fall back
// to "no photo" instead of throwing.

import { supabase } from "@/lib/supabaseClient";

const BUCKET = "share-cards";

export type StoryPhotoUploadResult =
  | { ok: true; publicUrl: string; path: string }
  | { ok: false; reason: "anon" | "upload_failed" | "url_failed" | "bad_blob"; error?: string };

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB; Resend / OG scrapers don't care about more

export async function uploadStoryPhoto(
  blob: Blob,
): Promise<StoryPhotoUploadResult> {
  if (!ALLOWED_TYPES.includes(blob.type)) {
    return { ok: false, reason: "bad_blob", error: `unsupported type ${blob.type}` };
  }
  if (blob.size > MAX_BYTES) {
    return { ok: false, reason: "bad_blob", error: `file too large (${blob.size} > ${MAX_BYTES})` };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) return { ok: false, reason: "anon" };

  const ext = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
  const path = `${user.id}/stories/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, {
      cacheControl: "604800",
      contentType: blob.type,
      upsert: false,
    });

  if (uploadError) {
    console.warn("[uploadStoryPhoto] upload failed:", uploadError.message);
    return { ok: false, reason: "upload_failed", error: uploadError.message };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!data?.publicUrl) {
    return { ok: false, reason: "url_failed" };
  }
  return { ok: true, publicUrl: data.publicUrl, path };
}
