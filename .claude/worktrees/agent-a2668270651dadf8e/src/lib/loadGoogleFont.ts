// src/lib/loadGoogleFont.ts
//
// Idempotent <link rel="stylesheet"> injector for Google Fonts.
//
// Replaces the previous mechanism: a Google Fonts CSS `@import` rendered
// *inside* a React `<style>` tag (RoomRendererUI / TierMapPage). That was
// the worst font-loading path:
//   (a) discovered only after the React chunk renders the component
//   (b) `@import` is request-chained — browser → googleapis CSS →
//       gstatic woff2: 2–3 serial round-trips
//   (c) no preconnect to the font hosts, so the TLS handshake is serial too
//   (d) the same <style> re-injected on every component render
//
// This injector fixes (b) and (d): a real <link rel="stylesheet"> is not
// request-chained behind a CSS file, and the module-level Set + a DOM
// query guard mean the link is appended exactly once per href (no
// per-render churn, HMR-safe). (c) is fixed by the two
// fonts.googleapis/gstatic <link rel="preconnect"> hints in index.html,
// so the connection is already warm when a route asks for its font CSS.
//
// Fonts stay *route-scoped* deliberately: the landing page uses the
// system font stack and must keep its zero-font-network main path — we
// do NOT globally <link> these families in index.html (only the
// zero-byte preconnect). `&display=swap` stays in every href so the
// fallback font paints immediately and there is no FOIT; Workbox
// runtime-caches the gstatic woff2 (see vite.config.ts fonts rule) so
// repeat / slow-network / offline-after-first-visit loads are instant.

const injected = new Set<string>();

export function loadGoogleFont(href: string): void {
  if (typeof document === "undefined") return; // SSR / non-DOM guard
  if (injected.has(href)) return;
  injected.add(href);
  // Guard a second mount, an HMR reload, or a prior injection that beat
  // the in-memory Set (e.g. across a fast-refresh module swap).
  if (
    document.querySelector(
      `link[data-mb-font][href="${href.replace(/"/g, '\\"')}"]`,
    )
  ) {
    return;
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.setAttribute("data-mb-font", "");
  document.head.appendChild(link);
}
