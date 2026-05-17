import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import { looksLikeChunkLoadFailure } from "@/lib/chunkLoadError";

const RELOAD_SESSION_KEY = "__mb_chunk_reload_once__";

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
  try {
    sessionStorage.removeItem(RELOAD_SESSION_KEY);
  } catch {
    // Mirror markReloaded()'s best-effort stance — if sessionStorage is
    // unavailable there was nothing persisted to clear anyway.
  }
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
      if (looksLikeChunkLoadFailure(error) && !hasAlreadyReloaded()) {
        markReloaded();
        if (typeof window !== "undefined") {
          window.location.reload();
        }
        // Halt rendering while the reload is in flight. Suspense keeps
        // showing the fallback; React never sees the error.
        return new Promise<{ default: T }>(() => {});
      }
      throw error;
    }
  };
}

// Drop-in replacement for React.lazy with stale-chunk recovery.
export function lazyWithRetry<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
): LazyExoticComponent<T> {
  return lazy(createRetryLoader(componentImport));
}
