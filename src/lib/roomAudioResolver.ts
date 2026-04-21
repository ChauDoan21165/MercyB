/**
 * Phase 2 audio resolver — canonical key → playable URL pipeline.
 *
 * Public surface:
 *   toAudioKey(raw)                — sync, pure, idempotent. Normalize any input to a canonical key.
 *   tryResolveLocal(key)           — sync. Local URL for kids/music/absolute; null otherwise.
 *   resolveRoomAudioUrl(raw, opts) — async. Supabase public URL for adult-room keys; local fallback on error.
 *
 * Invariant (hard rule): kids/* and music/* keys NEVER reach Supabase.
 * Enforced in resolveRoomAudioUrl by calling tryResolveLocal before any remote resolution.
 *
 * The room-audio bucket is PUBLIC. Public URLs do not expire, so this module has no
 * cache/TTL/inflight machinery. The opts.bustCache parameter is preserved for
 * call-site compatibility but has no effect.
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

function isLocalOnlyKey(key: string): boolean {
  return key.startsWith('kids/') || key.startsWith('music/');
}

/**
 * Return a local URL for keys that never need remote resolution.
 */
export function tryResolveLocal(key: string | null | undefined): string | null {
  if (!key) return null;
  if (/^https?:\/\//i.test(key)) return key;
  if (isLocalOnlyKey(key)) return `/audio/${key}`;
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
 *   - Kids, music, or absolute URLs → local `url`, `fallback: false`, no Supabase call (invariant).
 *   - Adult-room filenames → Supabase public `url`, `fallback: false` (or local on error, `fallback: true`).
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
