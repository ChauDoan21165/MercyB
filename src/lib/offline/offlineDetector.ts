// src/lib/offline/offlineDetector.ts
//
// Step 8 (Performance) — small online/offline detector built on top
// of `navigator.onLine` plus an optional reachability ping. Pure JS,
// no React, no Workbox dependency, so it works in both the running
// app and unit tests with a mocked `navigator`.
//
// Why both flags AND ping:
//   - `navigator.onLine` is fast but lies on captive-portal Wi-Fi
//     (returns true even when no real internet).
//   - A tiny HEAD request to a known endpoint cuts through the lie
//     when callers really need ground truth (lesson loader, audio
//     fetch fallback). Most callers can stick to the cheap flag.
//
// Subscription model:
//   - subscribeOnlineStatus(cb) → returns an unsubscribe function.
//   - Listeners are notified on every transition; the callback also
//     fires once with the current state right after subscribe so the
//     UI doesn't need its own initial-state read.

const PING_URL_DEFAULT = "/version.json";
const PING_TIMEOUT_MS = 3_000;

export type OnlineStatusCallback = (online: boolean) => void;

/**
 * Cheap synchronous "are we online?" check using `navigator.onLine`.
 * Returns true in non-browser environments (SSR / vitest jsdom without
 * navigator stub) so server-side renders never block on offline state.
 */
export function isOnline(): boolean {
  if (typeof navigator === "undefined") return true;
  if (typeof navigator.onLine !== "boolean") return true;
  return navigator.onLine;
}

/**
 * Ground-truth check: HEAD-pings an endpoint with a hard timeout.
 * Falls back to `isOnline()` if `fetch` is unavailable or the request
 * throws. Cheap enough to call on visibilitychange / route mount, but
 * don't poll it.
 */
export async function pingOnline(
  pingUrl: string = PING_URL_DEFAULT,
  timeoutMs: number = PING_TIMEOUT_MS,
): Promise<boolean> {
  if (!isOnline()) return false;
  if (typeof fetch === "undefined") return isOnline();

  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer =
    controller !== null
      ? setTimeout(() => controller.abort(), timeoutMs)
      : null;

  try {
    const res = await fetch(pingUrl, {
      method: "HEAD",
      cache: "no-store",
      signal: controller?.signal,
    });
    return res.ok || res.status === 0;
  } catch {
    return false;
  } finally {
    if (timer !== null) clearTimeout(timer);
  }
}

/**
 * Subscribe to online/offline transitions. The callback is invoked:
 *   1. once synchronously with the current state (so consumers don't
 *      need to read it themselves), and
 *   2. on every subsequent transition.
 * Returns an unsubscribe function.
 *
 * Safe to call in non-browser environments (returns a no-op unsubscribe).
 */
export function subscribeOnlineStatus(
  callback: OnlineStatusCallback,
): () => void {
  if (typeof window === "undefined") {
    callback(true);
    return () => {};
  }

  let lastReported = isOnline();
  callback(lastReported);

  const handleOnline = () => {
    if (lastReported) return;
    lastReported = true;
    callback(true);
  };
  const handleOffline = () => {
    if (!lastReported) return;
    lastReported = false;
    callback(false);
  };

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}
