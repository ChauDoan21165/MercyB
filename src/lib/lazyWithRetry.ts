import { lazy, type LazyExoticComponent } from "react";
import { ChunkLoadRecoveryError, looksLikeChunkLoadFailure } from "@/lib/chunkLoadError";
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
const SCOPED_RELOAD_PREFIX = `${RELOAD_SESSION_KEY}:`;
const RECENT_RECOVERY_PREFIX = `${RELOAD_SESSION_KEY}:recent:`;

type LazyComponent = Awaited<ReturnType<Parameters<typeof lazy>[0]>>["default"];

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
    // sessionStorage can throw in private mode / sandboxed iframes.
    // Best-effort: if writing fails the second reload still won't loop —
    // ErrorBoundary will catch it the second time around.
  }
}

function sessionRemove(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // nothing persisted to clear if sessionStorage is unavailable
  }
}

function hasAlreadyReloaded(storageKey: string): boolean {
  return sessionGet(storageKey) === "1";
}

function markReloaded(storageKey: string, factoryKey: string): void {
  sessionSet(storageKey, "1");
  sessionSet(recentRecoveryKey(factoryKey), storageKey);
}

function clearReloadMark(storageKey: string, factoryKey: string): void {
  sessionRemove(storageKey);
  const recentKey = recentRecoveryKey(factoryKey);
  if (sessionGet(recentKey) === storageKey) {
    sessionRemove(recentKey);
  }
}

function clearRecentReloadMarkForFactory(factoryKey: string): void {
  const recentKey = recentRecoveryKey(factoryKey);
  const storageKey = sessionGet(recentKey);
  if (storageKey) sessionRemove(storageKey);
  sessionRemove(recentKey);
}

function clearErrorBoundaryReloadMark(): void {
  clearChunkRecoveryMarks({ tier1: false, tier2: true });
}

function looksLikeLazyModuleResolutionFailure(err: unknown): boolean {
  if (!(err instanceof TypeError)) return false;
  const message = err.message.toLowerCase();
  return (
    message.includes("cannot read properties of undefined") &&
    message.includes("reading")
  );
}

function looksLikeRecoverableLazyImportFailure(err: unknown): boolean {
  return looksLikeChunkLoadFailure(err) || looksLikeLazyModuleResolutionFailure(err);
}

function recoveryStorageKey(componentImport: () => Promise<{ default: LazyComponent }>, err: unknown): string {
  const id = chunkIdentifier(err) ?? factoryIdentifier(componentImport);
  return `${SCOPED_RELOAD_PREFIX}${hashIdentifier(id)}`;
}

function recoveryFactoryKey(componentImport: () => Promise<{ default: LazyComponent }>): string {
  return hashIdentifier(factoryIdentifier(componentImport));
}

function recentRecoveryKey(factoryKey: string): string {
  return `${RECENT_RECOVERY_PREFIX}${factoryKey}`;
}

function chunkIdentifier(err: unknown): string | null {
  const message = errorText(err);
  const url = message.match(/https?:\/\/[^\s"'<>]+\/assets\/[A-Za-z0-9_.-]+\.js/)?.[0] ??
    message.match(/\/assets\/[A-Za-z0-9_.-]+\.js/)?.[0];
  if (url) return url;
  return null;
}

function factoryIdentifier(componentImport: () => Promise<{ default: LazyComponent }>): string {
  try {
    return componentImport.toString();
  } catch {
    return "unknown-lazy-import";
  }
}

function hashIdentifier(input: string): string {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function errorText(err: unknown): string {
  if (err instanceof Error) return `${err.name}: ${err.message}\n${err.stack ?? ""}`;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err) ?? String(err);
  } catch {
    return String(err);
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
export function createRetryLoader<T extends LazyComponent>(
  componentImport: () => Promise<{ default: T }>,
): () => Promise<{ default: T }> {
  return async () => {
    const factoryKey = recoveryFactoryKey(componentImport);
    try {
      const mod = await componentImport();
      clearRecentReloadMarkForFactory(factoryKey);
      clearErrorBoundaryReloadMark();
      return mod;
    } catch (error) {
      if (!looksLikeRecoverableLazyImportFailure(error)) {
        throw error;
      }
      const storageKey = recoveryStorageKey(componentImport, error);

      try {
        const mod = await componentImport();
        clearReloadMark(storageKey, factoryKey);
        clearErrorBoundaryReloadMark();
        return mod;
      } catch (retryError) {
        if (!looksLikeRecoverableLazyImportFailure(retryError)) {
          throw retryError;
        }

        if (!hasAlreadyReloaded(storageKey)) {
          markReloaded(storageKey, factoryKey);
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
        throw new ChunkLoadRecoveryError(
          "Mercy Blade could not load a route chunk after retrying the current deploy.",
          retryError,
        );
      }
    }
  };
}

// Drop-in replacement for React.lazy with stale-chunk recovery.
export function lazyWithRetry<T extends LazyComponent>(
  componentImport: () => Promise<{ default: T }>,
): LazyExoticComponent<T> {
  return lazy(createRetryLoader(componentImport));
}
