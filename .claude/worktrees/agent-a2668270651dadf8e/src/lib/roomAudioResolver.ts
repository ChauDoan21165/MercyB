/**
 * Audio resolver — canonical key → playable URL pipeline.
 *
 * Public surface:
 *   toAudioKey(raw)                — sync, pure, idempotent. Normalize any input to a canonical key.
 *   tryResolveLocal(key)           — sync. Local URL for absolute http(s) keys only; null otherwise.
 *   resolveRoomAudioUrl(raw, opts) — async. Supabase public URL; local fallback on error.
 *
 * All audio (adult-room, kids/*, music/*) now flows through the Supabase `room-audio`
 * public bucket. The PWA service worker caches responses so offline playback works
 * after first play. This violates the earlier "kids stays local" invariant — required
 * to fit under Google Play's 200 MB base-module limit.
 *
 * Public URLs do not expire, so this module has no cache/TTL/inflight machinery.
 * The opts.bustCache parameter is preserved for call-site compatibility but has no effect.
 */

import { supabase } from '@/lib/supabaseClient';
import { ROOM_AUDIO_BUCKET } from '@/lib/constants/rooms';

export type ResolvedAudio = {
  /** Playable URL — Supabase public URL or local fallback. Never empty. */
  url: string;
  /** True iff Supabase resolution failed and we fell back to the local /audio/{key} URL. */
  fallback: boolean;
  /** The Supabase error. Present iff fallback === true. */
  error?: Error;
};

export type ResolveOpts = {
  /** Retained for call-site compatibility; has no effect for public URLs. */
  bustCache?: boolean;
};

/**
 * Normalize any raw audio reference into a canonical key.
 *
 * Guarantee: idempotent. toAudioKey(toAudioKey(x)) === toAudioKey(x) for every input x.
 *
 *   "foo.mp3"                         → "foo.mp3"
 *   "audio/foo.mp3"                   → "foo.mp3"
 *   "/audio/foo.mp3"                  → "foo.mp3"
 *   "public/audio/foo.mp3"            → "foo.mp3"
 *   "/audio/audio/foo.mp3" (double)   → "foo.mp3"
 *   "/audio/kids/airplane.mp3"        → "kids/airplane.mp3"
 *   "kids/airplane.mp3"               → "kids/airplane.mp3"
 *   "music/theme.mp3"                 → "music/theme.mp3"
 *   "https://cdn…/x.mp3"              → "https://cdn…/x.mp3"
 *   "private:foo.mp3"                 → "foo.mp3"
 *   null | "" | "   " | non-string    → null
 */
export function toAudioKey(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  let s = trimmed;
  if (s.startsWith('private:')) s = s.slice('private:'.length);

  s = s.replace(/^\/+/, '').replace(/^public\//, '');

  while (s.startsWith('audio/')) s = s.slice('audio/'.length);

  return s || null;
}

/**
 * Return a URL for keys that don't need Supabase resolution:
 *   - absolute http(s) URLs (passthrough)
 *   - `images/…` paths (kids page-3 audio lives in /images/mercy-kids-page-N/
 *     next to the images — still bundled locally, not migrated to Supabase)
 *
 * Previously also short-circuited kids/* and music/* to local /audio/ paths;
 * those now go through Supabase so they can be removed from the app bundle.
 */
export function tryResolveLocal(key: string | null | undefined): string | null {
  if (!key) return null;
  if (/^https?:\/\//i.test(key)) return key;
  if (key.startsWith('images/')) return `/${key}`;
  return null;
}

function getPublicFromSupabase(filename: string): string {
  const { data } = supabase.storage
    .from(ROOM_AUDIO_BUCKET)
    .getPublicUrl(filename);
  if (!data?.publicUrl) {
    throw new Error('getPublicUrl returned no URL');
  }
  return data.publicUrl;
}

function localFallback(key: string, err: unknown): ResolvedAudio {
  const error = err instanceof Error ? err : new Error(String(err));
  if (typeof console !== 'undefined') {
    console.warn('[roomAudioResolver] falling back to local for', key, error);
  }
  return { url: `/audio/${key}`, fallback: true, error };
}

/**
 * Resolve a raw audio reference to a playable URL.
 *
 * Returns null iff rawPath is null/undefined/empty/whitespace.
 * Otherwise always returns a ResolvedAudio with a playable `url`.
 *   - Absolute http(s) URLs → passed through, `fallback: false`, no Supabase call.
 *   - Every other key (foo.mp3, kids/x.mp3, kids/josh/x.mp3, music/x.mp3) →
 *     Supabase public `url`, `fallback: false` (or local /audio/{key} on error, `fallback: true`).
 *     The local fallback will 404 for kids/music once those files are deleted from the bundle;
 *     it exists only to preserve the adult-room fallback behavior during rollout.
 */
export async function resolveRoomAudioUrl(
  rawPath: string | null | undefined,
  _opts?: ResolveOpts,
): Promise<ResolvedAudio | null> {
  const key = toAudioKey(rawPath);
  if (!key) return null;

  const local = tryResolveLocal(key);
  if (local !== null) {
    return { url: local, fallback: false };
  }

  try {
    const url = getPublicFromSupabase(key);
    return { url, fallback: false };
  } catch (err) {
    return localFallback(key, err);
  }
}

/**
 * Sync variant — always returns the local URL for any key.
 * Kept for callers that cannot await. Deprecated once Phase 2 consumer migration is complete.
 */
export function resolveRoomAudioUrlSync(rawPath: string | null | undefined): string | null {
  const key = toAudioKey(rawPath);
  if (!key) return null;
  return `/audio/${key}`;
}
