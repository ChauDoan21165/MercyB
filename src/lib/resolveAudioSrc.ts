// src/lib/resolveAudioSrc.ts
// MB-SAFE: seam for future private audio. No behavior change unless "private:" is used.

export type ResolveAudioSrcOptions = {
  // in the future, you can inject a signer function here if you want
};

export function isPrivateAudioRef(s: string) {
  return typeof s === "string" && s.startsWith("private:");
}

/**
 * Raw audio values commonly seen in this repo:
 * - "foo.mp3"
 * - "audio/foo.mp3"
 * - "/audio/foo.mp3"
 * - "https://..." (already absolute)
 * - "private:vip/3/foo.mp3" (future)
 */
export function resolveAudioSrc(raw: unknown): string | null {
  if (!raw || typeof raw !== "string") return null;

  const s = raw.trim();
  if (!s) return null;

  // already absolute
  if (/^https?:\/\//i.test(s)) return s;

  // future private marker — do NOT break today, just return null for now
  if (isPrivateAudioRef(s)) {
    // Later: return signed URL (async) via Edge Function.
    // For now, return null so you can detect & wire it explicitly.
    return null;
  }

  // normalize: remove leading slash
  const cleaned = s.replace(/^\/+/, "");

  // if already includes "audio/", keep it relative from site root
  if (cleaned.startsWith("audio/")) return `/${cleaned}`;

  // default: treat as filename in /audio/
  return `/audio/${cleaned}`;
}
