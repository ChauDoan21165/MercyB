import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { looksLikeChunkLoadFailure } from "@/lib/chunkLoadError";
import {
  CHUNK_RELOAD_KEY,
  cacheBustingReload,
  clearChunkRecoveryMarks,
} from "@/lib/chunkReload";
import { unregisterAllServiceWorkers } from "@/lib/swRecovery";

// Value is byte-identical to the historical literal — kept as a local
// alias so the rest of this file (and its tests, which assert the raw
// string) stay unchanged.
const RELOAD_SESSION_KEY = CHUNK_RELOAD_KEY;

function hasAlreadyReloaded(): boolean {
  try {
    return sessionStorage.getItem(RELOAD_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markReloaded(): void {
  try {
    sessionStorage.setItem(RELOAD_SESSION_KEY, "1");
  } catch {
    // sessionStorage can throw in private mode / sandboxed iframes.
    // Best-effort: if writing fails the second reload still won't loop —
    // ErrorBoundary will catch it the second time around.
  }
}

function clearReloadMark(): void {
  // Clears BOTH the Tier-1 (this module) and Tier-2 (ErrorBoundary) marks
  // so a clean chunk load re-arms the whole recovery ladder for a later
  // deploy in the same session. Internally best-effort (own try/catch).
  clearChunkRecoveryMarks();
}

// Exported for unit tests. Wraps an import() factory so a stale-chunk
// failure after a deploy triggers a one-time index.html reload — the
// only thing that picks up the new chunk hashes from the new manifest.
// Retrying the same chunk URL will not help because the file is gone.
//
// The one-shot reload mark is cleared on the SUCCESS path: a chunk that
// loads cleanly proves the live HTML and the deployed chunk hashes are
// consistent again, so any earlier recovery fully succeeded. Clearing it
// lets a *later* deploy within the same browser session get its own
// single reload instead of rethrowing into the ErrorBoundary crash
// screen (the steady-state Sentry tail: a session spans ≥2 deploys at a
// PR-per-deploy cadence). Loop protection is preserved — a chunk that is
// genuinely gone never resolves, so the mark is never cleared and the
// second failure still rethrows. This replaces main.tsx's old
// wall-clock `clearChunkReloadMarkerAfterHealthyBoot` timer, which mobile
// webviews (Facebook in-app browser) throttled to a silent no-op when the
// post-reload page was backgrounded, defeating the reset entirely.
export function createRetryLoader<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
): () => Promise<{ default: T }> {
  return async () => {
    try {
      const mod = await componentImport();
      clearReloadMark();
      return mod;
    } catch (error) {
      if (!looksLikeChunkLoadFailure(error)) {
        throw error;
      }

      try {
        const mod = await componentImport();
        clearReloadMark();
        return mod;
      } catch (retryError) {
        if (!looksLikeChunkLoadFailure(retryError)) {
          throw retryError;
        }

        if (!hasAlreadyReloaded()) {
          markReloaded();
          if (typeof window !== "undefined") {
            // Cache-busting nav, NOT a plain reload: embedded webviews
            // (FB in-app browser, iOS Chrome/WKWebView) re-serve the stale
            // document on reload(). Remove any old SW first so recovery
            // cannot be intercepted by a stale cached app shell.
            void unregisterAllServiceWorkers()
              .catch(() => 0)
              .then(() => cacheBustingReload());
          }
          // Halt rendering while the reload is in flight. Suspense keeps
          // showing the fallback; React never sees the error.
          return new Promise<{ default: T }>(() => {});
        }
        throw retryError;
      }
    }
  };
}

// Drop-in replacement for React.lazy with stale-chunk recovery.
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
): LazyExoticComponent<T> {
  return lazy(createRetryLoader(componentImport));
}
