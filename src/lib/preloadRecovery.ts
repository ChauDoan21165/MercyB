// src/lib/preloadRecovery.ts
//
// Stale-deploy recovery — second layer of defence beneath the
// `Cache-Control: no-cache, must-revalidate` headers on `/` and
// `/index.html` in vercel.json.
//
// When Vercel deploys, the new index.html references newly-hashed
// chunk filenames. A browser holding a cached index.html from the
// previous deploy will request chunks at the OLD hashes, which 404
// because Vercel removed them — and the page renders blank. The
// Vercel headers are the primary fix; this listener is the safety
// net for edge cases where the header doesn't take effect (proxies,
// CDN misconfig, browser bugs, an old Service Worker still serving
// precached index.html).
//
// Why a separate listener instead of folding into the existing
// `window.error` handler in main.tsx:
//   1. Resource errors (modulepreload 404, script 404, link 404) do
//      NOT fire on `window` in the bubble phase — they only fire on
//      the element itself. Catching them on `window` requires
//      `capture: true` AND inspecting `event.target` (which the
//      existing fatal-overlay handler doesn't do).
//   2. The existing handler triggers the "fatal overlay" UI — wrong
//      UX for a stale-deploy case. We want to silently reload, not
//      show a scary modal.
//
// The hosting code (main.tsx) passes in the actual reload callback
// — typically `scheduleOneTimeChunkReload` — so this module stays
// dependency-free and trivially unit-testable.

export function attachPreloadFailureRecovery(
  onChunkLoad404: () => void,
): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (event: Event) => {
    const target = event.target;
    if (!target || target === window) return;
    if (
      target instanceof HTMLLinkElement &&
      target.rel === "modulepreload"
    ) {
      onChunkLoad404();
      return;
    }
    if (
      target instanceof HTMLScriptElement &&
      target.type === "module"
    ) {
      onChunkLoad404();
      return;
    }
  };

  try {
    window.addEventListener("error", handler, true); // capture — resource errors don't bubble
  } catch {
    return () => {};
  }
  return () => {
    try {
      window.removeEventListener("error", handler, true);
    } catch { /* swallow */ }
  };
}
