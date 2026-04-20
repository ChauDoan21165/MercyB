/**
 * Phase 2 audio resolver — returns a playable URL for a room audio filename.
 *
 * Strategy:
 *  - Adult room audio (top-level filenames like `ef06_01_en.mp3`) → signed URL
 *    from Supabase Storage bucket `room-audio`, cached in-memory for the session.
 *  - Kids (`kids/…`) and music (`music/…`) stay local — short-circuit to `/audio/{path}`.
 *  - Any Supabase failure falls back to the local `/audio/{filename}` path so the
 *    app keeps working while the bundled copies are still shipping (rollout safety).
 *
 * This file is the single place URLs are produced. Everything that used to build
 * `/audio/${path}` inline should call resolveRoomAudioUrl instead.
 */

import { supabase } from '@/lib/supabaseClient';

const BUCKET = 'room-audio';
const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour
const CACHE_REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000; // refresh 5 min before expiry

type CacheEntry = { url: string; expiresAt: number };
const memoryCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<string>>();

function stripAudioPrefix(raw: string): string {
  return raw
    .trim()
    .replace(/^\/+/, '')
    .replace(/^public\//, '')
    .replace(/^audio\//, '');
}

function isLocalOnly(path: string): boolean {
  return path.startsWith('kids/') || path.startsWith('music/');
}

function localUrl(path: string): string {
  return `/audio/${path}`;
}

async function signFromSupabase(filename: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(filename, SIGNED_URL_TTL_SECONDS);
  if (error || !data?.signedUrl) {
    throw new Error(error?.message ?? 'createSignedUrl returned no URL');
  }
  return data.signedUrl;
}

export async function resolveRoomAudioUrl(rawPath: string | null | undefined): Promise<string | null> {
  if (!rawPath) return null;
  const path = stripAudioPrefix(rawPath);
  if (!path) return null;

  if (isLocalOnly(path)) {
    return localUrl(path);
  }

  const now = Date.now();
  const cached = memoryCache.get(path);
  if (cached && cached.expiresAt - CACHE_REFRESH_BEFORE_EXPIRY_MS > now) {
    return cached.url;
  }

  const pending = inflight.get(path);
  if (pending) return pending;

  const request = (async (): Promise<string> => {
    try {
      const signedUrl = await signFromSupabase(path);
      memoryCache.set(path, {
        url: signedUrl,
        expiresAt: now + SIGNED_URL_TTL_SECONDS * 1000,
      });
      return signedUrl;
    } catch (err) {
      if (typeof console !== 'undefined') {
        console.warn('[roomAudioResolver] falling back to local for', path, err);
      }
      return localUrl(path);
    } finally {
      inflight.delete(path);
    }
  })();

  inflight.set(path, request);
  return request;
}

/**
 * Sync variant — always returns the local URL. Use when you cannot await.
 * After Phase 2 is fully verified in prod and local files are removed,
 * call sites that still use this will need to be migrated to the async version.
 */
export function resolveRoomAudioUrlSync(rawPath: string | null | undefined): string | null {
  if (!rawPath) return null;
  const path = stripAudioPrefix(rawPath);
  if (!path) return null;
  return localUrl(path);
}
