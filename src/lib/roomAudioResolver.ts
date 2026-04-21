/**
 * Phase 2 audio resolver — canonical key → playable URL pipeline.
 *
 * Public surface:
 *   toAudioKey(raw)                — sync, pure, idempotent. Normalize any input to a canonical key.
 *   tryResolveLocal(key)           — sync. Local URL for kids/music/absolute; null otherwise.
 *   resolveRoomAudioUrl(raw, opts) — async. Supabase signed URL for adult-room keys; local fallback on error.
 *
 * Invariant (hard rule): kids/* and music/* keys NEVER reach Supabase.
 * Enforced in resolveRoomAudioUrl by calling tryResolveLocal before any signing attempt.
 *
 * Caching: in-memory module-scoped Map keyed by canonical key, 1-hour TTL (matches signed URL expiry),
 * refreshes 5 minutes before expiry. Pass {bustCache: true} to drop the entry and re-sign atomically
 * (used by the hook's refresh() for 403 self-heal).
 */

import { supabase } from '@/lib/supabaseClient';
import { ROOM_AUDIO_BUCKET } from '@/lib/constants/rooms';

const SIGNED_URL_TTL_SECONDS = 60 * 60;
const CACHE_REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000;

export type ResolvedAudio = {
  /** Playable URL — Supabase signed URL or local fallback. Never empty. */
  url: string;
  /** True iff Supabase signing failed and we fell back to the local /audio/{key} URL. */
  fallback: boolean;
  /** The Supabase error. Present iff fallback === true. */
  error?: Error;
};

export type ResolveOpts = {
  /** Drop any cached signed URL for this key and re-sign fresh. */
  bustCache?: boolean;
};

type CacheEntry = { url: string; expiresAt: number };
const memoryCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<ResolvedAudio>>();

/**
 * Normalize any raw audio reference into a canonical key.
 *
 * Guarantee: idempotent. toAudioKey(toAudioKey(x)) === toAudioKey(x) for every input x.
 *
 *   "foo.mp3"                         → "foo.mp3"
 *   "audio/foo.mp3"                   → "foo.mp3"
 *   "/audio/foo.mp3"                  → "foo.mp3"
 *   "public/audio/foo.mp3"            → "foo.mp3"
 *   "/audio/audio/foo.mp3" (double)   → "foo.mp3"             (while-loop strip guarantees idempotence)
 *   "/audio/kids/airplane.mp3"        → "kids/airplane.mp3"   (keeps kids/ so tryResolveLocal routes local)
 *   "kids/airplane.mp3"               → "kids/airplane.mp3"
 *   "music/theme.mp3"                 → "music/theme.mp3"
 *   "https://cdn…/x.mp3"              → "https://cdn…/x.mp3"  (absolute passthrough)
 *   "private:foo.mp3"                 → "foo.mp3"             (legacy seam prefix stripped)
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
 * Return a local URL for keys that never need async signing.
 *   kids/*    → /audio/kids/...      (offline kids experience is non-negotiable)
 *   music/*   → /audio/music/...     (bundled atmospheric music)
 *   https://… → passthrough           (already-absolute URL)
 *   anything else (adult-room) → null (caller must use resolveRoomAudioUrl)
 *
 * Safe to call inside useState initializers — no loading flash for local-only keys.
 */
export function tryResolveLocal(key: string | null | undefined): string | null {
  if (!key) return null;
  if (/^https?:\/\//i.test(key)) return key;
  if (isLocalOnlyKey(key)) return `/audio/${key}`;
  return null;
}

async function signFromSupabase(filename: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(ROOM_AUDIO_BUCKET)
    .createSignedUrl(filename, SIGNED_URL_TTL_SECONDS);
  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? 'createSignedUrl returned no URL');
  }
  return data.signedUrl;
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
 *   - Adult-room filenames → Supabase signed `url`, `fallback: false` (or local on error, `fallback: true`).
 *
 * Pass `{ bustCache: true }` to drop any cached entry for this key and re-sign atomically.
 * Consumers should pass this from refresh() when an <audio> element observes a 403 playback error.
 */
export async function resolveRoomAudioUrl(
  rawPath: string | null | undefined,
  opts?: ResolveOpts,
): Promise<ResolvedAudio | null> {
  const key = toAudioKey(rawPath);
  if (!key) return null;

  const local = tryResolveLocal(key);
  if (local !== null) {
    return { url: local, fallback: false };
  }

  if (opts?.bustCache) {
    memoryCache.delete(key);
    inflight.delete(key);
  }

  const now = Date.now();
  const cached = memoryCache.get(key);
  if (cached && cached.expiresAt - CACHE_REFRESH_BEFORE_EXPIRY_MS > now) {
    return { url: cached.url, fallback: false };
  }

  const pending = inflight.get(key);
  if (pending) return pending;

  const request = (async (): Promise<ResolvedAudio> => {
    try {
      const signedUrl = await signFromSupabase(key);
      memoryCache.set(key, {
        url: signedUrl,
        expiresAt: now + SIGNED_URL_TTL_SECONDS * 1000,
      });
      return { url: signedUrl, fallback: false };
    } catch (err) {
      return localFallback(key, err);
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, request);
  return request;
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
