// src/lib/offline/audioCache.ts
//
// Offline Lite v1 — Cache API wrapper for room audio.
// Stores Response objects keyed by URL so the audio element can
// play directly from cache while offline.
//
// Why Cache API and not IndexedDB:
//   - Cache API is purpose-built for Response/Request pairs, plays
//     well with `<audio src>` via blob URLs, and is what Workbox
//     already uses for the runtime cache. Using the same primitive
//     keeps mental model + DevTools tooling simple.
//
// Hard rules (see CLAUDE.md "Audio resolution pipeline"):
//   - kids/* and music/* never reach Supabase. This wrapper is fine
//     to use for them too — they're just static URLs — but routing
//     decisions belong upstream in roomAudioResolver.ts.
//   - Anything we cache here is best-effort. The resolver still
//     falls back to /audio/{key} on miss.
//
// SSR / non-browser safety: every public function returns a sane
// default when `caches` is unavailable, so importing the module
// never crashes.

const CACHE_NAME = "mb-audio-v1";

function hasCacheApi(): boolean {
  return typeof caches !== "undefined";
}

async function openCache(): Promise<Cache | null> {
  if (!hasCacheApi()) return null;
  try {
    return await caches.open(CACHE_NAME);
  } catch {
    return null;
  }
}

/**
 * Fetch + store a single audio URL. Returns true if the response
 * was cached, false if the fetch failed or the Cache API isn't
 * available. Network errors are swallowed by design — caching is
 * always opportunistic.
 */
export async function put(url: string): Promise<boolean> {
  const cache = await openCache();
  if (!cache) return false;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return false;
    await cache.put(url, res.clone());
    return true;
  } catch {
    return false;
  }
}

/**
 * Store a Response object directly (e.g. one we already have in hand).
 * Used by callers that already fetched the audio for some other reason
 * and want to seed the cache without a second network round-trip.
 */
export async function putResponse(url: string, response: Response): Promise<boolean> {
  const cache = await openCache();
  if (!cache) return false;
  try {
    await cache.put(url, response.clone());
    return true;
  } catch {
    return false;
  }
}

/**
 * Look up a cached Response. Returns undefined when the Cache API
 * is unavailable or the URL isn't cached.
 */
export async function match(url: string): Promise<Response | undefined> {
  const cache = await openCache();
  if (!cache) return undefined;
  return (await cache.match(url)) ?? undefined;
}

/**
 * True if a URL is in the cache. Cheaper than reading the body.
 */
export async function has(url: string): Promise<boolean> {
  const res = await match(url);
  return res !== undefined;
}

export async function remove(url: string): Promise<boolean> {
  const cache = await openCache();
  if (!cache) return false;
  try {
    return await cache.delete(url);
  } catch {
    return false;
  }
}

/**
 * List every URL in the cache as a string array.
 */
export async function keys(): Promise<string[]> {
  const cache = await openCache();
  if (!cache) return [];
  try {
    const requests = await cache.keys();
    return requests.map((req) => req.url);
  } catch {
    return [];
  }
}

/**
 * Drop every entry. Used by logout cleanup and contentVersion bumps.
 */
export async function clearAll(): Promise<boolean> {
  if (!hasCacheApi()) return false;
  try {
    return await caches.delete(CACHE_NAME);
  } catch {
    return false;
  }
}

export interface CacheUsageEstimate {
  /** Approximate bytes used by THIS cache. May be undefined if not measurable. */
  bytes: number | undefined;
  /** Number of entries currently cached. */
  entryCount: number;
  /** Browser-wide usage, when StorageManager.estimate() is available. */
  storageManager:
    | {
        usage: number | undefined;
        quota: number | undefined;
      }
    | undefined;
}

/**
 * Best-effort usage estimate. The Cache API has no per-cache size
 * accessor, so we approximate by reading each Response's
 * `Content-Length` header. Falls back to undefined bytes when the
 * header is missing.
 */
export async function estimateUsage(): Promise<CacheUsageEstimate> {
  const cache = await openCache();
  if (!cache) {
    return { bytes: undefined, entryCount: 0, storageManager: undefined };
  }

  let entryCount = 0;
  let bytes: number | undefined = 0;
  try {
    const requests = await cache.keys();
    entryCount = requests.length;
    for (const req of requests) {
      const res = await cache.match(req);
      const lenHeader = res?.headers.get("content-length");
      if (lenHeader === null || lenHeader === undefined) {
        bytes = undefined;
        break;
      }
      const parsed = Number.parseInt(lenHeader, 10);
      if (Number.isNaN(parsed)) {
        bytes = undefined;
        break;
      }
      bytes = (bytes ?? 0) + parsed;
    }
  } catch {
    bytes = undefined;
  }

  let storageManager: CacheUsageEstimate["storageManager"];
  if (
    typeof navigator !== "undefined" &&
    typeof navigator.storage !== "undefined" &&
    typeof navigator.storage.estimate === "function"
  ) {
    try {
      const est = await navigator.storage.estimate();
      storageManager = { usage: est.usage, quota: est.quota };
    } catch {
      storageManager = undefined;
    }
  }

  return { bytes, entryCount, storageManager };
}

export const __INTERNAL__ = {
  CACHE_NAME,
  hasCacheApi,
};
