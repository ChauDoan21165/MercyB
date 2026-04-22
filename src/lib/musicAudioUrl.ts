// Construct a public URL for a music file in the `music` Supabase Storage
// bucket. The bucket is public-read, service-role-write. See
// supabase/migrations and the README note in scripts/upload-music-to-supabase.ts.
//
// Only filenames belong in track lists; URL shape belongs here.

const MUSIC_BUCKET = "music";

const SUPABASE_URL = String(
  (import.meta as ImportMeta & { env?: Record<string, string> }).env
    ?.VITE_SUPABASE_URL ?? "",
).trim();

export function getPublicAudioUrl(filename: string): string {
  const clean = String(filename ?? "").trim().replace(/^\/+/, "");
  if (!clean) return "";
  if (/^https?:\/\//i.test(clean)) return clean;
  if (!SUPABASE_URL) {
    // Fall back to a local path so dev without VITE_SUPABASE_URL still boots,
    // but warn once so the misconfiguration is visible.
    console.warn("[musicAudioUrl] VITE_SUPABASE_URL missing — audio will fail");
    return `/${clean}`;
  }
  return `${SUPABASE_URL}/storage/v1/object/public/${MUSIC_BUCKET}/${clean}`;
}
