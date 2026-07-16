// src/lib/chunkReload.ts
//
// Cache-busting stale-deploy recovery navigation.
//
// Why this exists (Sentry MERCYBLADE-WEB-W /onboarding, MERCYBLADE-WEB-Z
// /room/...): the one-shot chunk recovery in `lazyWithRetry` and
// `scheduleOneTimeChunkReload` previously called a plain
// `window.location.reload()`. In embedded webviews — the Facebook in-app
// browser and Chrome Mobile iOS / WKWebView, both `pwa:no` on those
// events — a plain reload is served the SAME stale document from the
// webview's own HTTP cache; those engines do NOT honour the
// `Cache-Control: no-cache, must-revalidate` header `vercel.json` sets on
// `/index.html`. So: 1st chunk-404 → reload → stale HTML re-served → 2nd
// chunk-404 → one-shot guard already set → `createRetryLoader` rethrows →
// ErrorBoundary crash screen. Recovery exhausted, user stuck.
//
// Navigating to the SAME url with a fresh `_cb=<timestamp>` query param is
// a different HTTP cache key, so the document MUST be refetched from
// origin and picks up the new chunk hashes. A query param (not a hash
// fragment — FB-IAB strips fragments inconsistently) also survives the
// Vercel SPA rewrite `/((?!assets/).*) → /index.html` and the SW's
// network-first navigation route. `replace` (not `assign`) keeps the
// broken URL out of session history so Back doesn't return to it.
//
// Kept dependency-free + sync so it is trivially unit-testable, matching
// the swRecovery.ts / preloadRecovery.ts pattern in this codebase.

export const CHUNK_CACHE_BUST_PARAM = "_cb";

// Tier-1 one-shot: set by lazyWithRetry's createRetryLoader (React.lazy
// path) and main.tsx's scheduleOneTimeChunkReload (window.error /
// unhandledrejection / preload path). Value kept byte-identical to the
// historical literal so existing lazyWithRetry tests that assert the raw
// string keep passing.
export const CHUNK_RELOAD_KEY = "__mb_chunk_reload_once__";

// Tier-2 one-shot: set by the ErrorBoundary's chunk-aware branch. Reached
// only when Tier 1's cache-busting reload did NOT fix it and the loader
// rethrew into componentDidCatch. Distinct key so the ErrorBoundary gets
// its own single escalated attempt (SW-unregister + cache-bust) instead
// of being suppressed by Tier 1's spent guard.
export const CHUNK_EB_RELOAD_KEY = "__mb_chunk_eb_reload_once__";

function sessionGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function sessionSet(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* private mode / sandboxed iframe — best effort, loop protection
       still holds because a genuinely-gone chunk never resolves. */
  }
}

export function hasErrorBoundaryReloaded(): boolean {
  return sessionGet(CHUNK_EB_RELOAD_KEY) === "1";
}

export function markErrorBoundaryReloaded(): void {
  sessionSet(CHUNK_EB_RELOAD_KEY, "1");
}

// Cleared on the SUCCESS path of a lazy chunk load (any clean chunk proves
// HTML + deployed chunk hashes are consistent again). Re-arms BOTH tiers
// so a LATER deploy within the same long browser session gets its own
// single recovery instead of rethrowing into the crash screen — a session
// routinely spans ≥2 deploys at this repo's PR-per-deploy cadence. Loop
// protection is preserved: a chunk that is genuinely gone never resolves,
// so neither mark is ever cleared and the escalation terminates.
export function clearChunkRecoveryMarks(
  options: { tier1?: boolean; tier2?: boolean } = {},
): void {
  const clearTier1 = options.tier1 ?? true;
  const clearTier2 = options.tier2 ?? true;
  try {
    if (clearTier1) sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    if (clearTier2) sessionStorage.removeItem(CHUNK_EB_RELOAD_KEY);
  } catch {
    /* nothing persisted to clear if sessionStorage is unavailable */
  }
}

// Navigate to the current URL with a fresh cache-bust query param so the
// document cannot be served from the embedded-webview HTTP cache. Falls
// back to a plain reload only if URL/replace are unavailable (ancient
// webview) — strictly better than doing nothing.
export function cacheBustingReload(now: () => number = Date.now): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    url.searchParams.set(CHUNK_CACHE_BUST_PARAM, String(now()));
    window.location.replace(url.toString());
  } catch {
    try {
      window.location.reload();
    } catch {
      /* ignore — nothing more we can do */
    }
  }
}

// On the recovered load, drop the cache-bust param so the address bar and
// any URL the user copies/shares stay clean, and so the param does not
// linger across subsequent client-side navigations. Routing already
// ignores query strings for the affected routes (`/onboarding`,
// `/room/:id`), so this is cosmetic + hygiene. Safe no-op when absent.
export function stripChunkCacheBustParam(): void {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(CHUNK_CACHE_BUST_PARAM)) return;
    url.searchParams.delete(CHUNK_CACHE_BUST_PARAM);
    const next = `${url.pathname}${url.search}${url.hash}` || "/";
    window.history.replaceState(null, "", next);
  } catch {
    /* ignore */
  }
}
