// src/lib/swRecovery.ts
//
// Unregister every active Service Worker for this origin.
//
// Used by main.tsx's `scheduleOneTimeChunkReload` immediately before
// the recovery reload. The Service Worker — when present — intercepts
// the navigation and serves its precached `index.html`, which after
// a deploy still references the OLD chunk hashes the user just
// 404'd on. Unregistering the SW first means the recovery reload
// hits origin directly and picks up the current shell. The SW
// re-registers on the next page load via `registerPwaServiceWorker`
// in main.tsx, so this is a one-tab-lifetime trade.
//
// Always best-effort: the unregister call may legitimately fail
// (browser doesn't support SWs, registration was already removed,
// scoped quota errors, etc.) and we must never block the reload on
// it. Callers should `await` for ordering then proceed regardless.
//
// See reports/a9-route-recovery-diagnosis.md for the full failure
// trace this addresses.

export async function unregisterAllServiceWorkers(): Promise<number> {
  if (typeof navigator === "undefined") return 0;
  if (!("serviceWorker" in navigator)) return 0;
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    if (!registrations || registrations.length === 0) return 0;
    const results = await Promise.all(
      registrations.map((r) =>
        r.unregister().catch(() => false),
      ),
    );
    // Returned count is informational — used by tests + Sentry breadcrumbs.
    return results.filter(Boolean).length;
  } catch {
    return 0;
  }
}
