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

// Exported for unit tests. Wraps an import() factory so a stale-chunk
// failure after a deploy triggers a one-time index.html reload — the
// only thing that picks up the new chunk hashes from the new manifest.
// Retrying the same chunk URL will not help because the file is gone.
export function createRetryLoader<T extends ComponentType<any>>(
  componentImport: () => Promise<{ default: T }>,
): () => Promise<{ default: T }> {
  return async () => {
    try {
      return await componentImport();
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
