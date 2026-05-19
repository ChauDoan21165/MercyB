// src/main.tsx
// MB-BLUE-100.8 — 2026-04-08 (+0700)
//
// FIX (100.8):
// - ✅ Add one-time stale-chunk auto-recovery for dynamic import failures.
// - ✅ Show friendly reload UI instead of raw fatal dump for chunk mismatch.
// - ✅ Keep fatal overlay for real crashes — stack traces in DEV only.
// - ✅ Keep AuthProvider wrap.
// - ✅ Keep React.StrictMode OFF.
// - ✅ Service worker is now registered (Offline Lite v2). Manual
//      registration of /sw.js, prod-only, immediate-takeover mode
//      (skipWaiting:true, clientsClaim:true). See registerPwaServiceWorker
//      below and vite.config.ts workbox block.

// ── Polyfills for older browsers (Chrome 79, iOS 12) ──────────────────────
// Array.prototype.at() and String.prototype.at() shipped in Chrome 92 / ES2022.
// Some users on low-end Android devices run Chrome 79 which lacks .at().
// Adding minimal polyfills to prevent "TypeError: this.o.at is not a function".
if (!Array.prototype.at) {
  Array.prototype.at = function (index: number) {
    const i = index < 0 ? this.length + index : index;
    return this[i];
  };
}

if (!String.prototype.at) {
  String.prototype.at = function (index: number) {
    const i = index < 0 ? this.length + index : index;
    return this[i];
  };
}

// TypedArrays (Uint8Array, Float32Array, etc.) also lack .at() on the same browsers.
// Per-constructor assignment so each typed-array type gets the polyfill.
if (typeof Uint8Array !== "undefined" && !(Uint8Array.prototype as any).at) {
  const _at = Array.prototype.at;
  for (const Ctor of [
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array,
  ]) {
    try { (Ctor.prototype as any).at = _at; } catch { /* ignore */ }
  }
}

import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AppRouter from "@/router/AppRouter";
import { LanguageProgressProvider } from "@/store/languageProgress";
import { UiLanguageProvider } from "@/contexts/UiLanguageContext";
import { NativeLanguageProvider } from "@/contexts/NativeLanguageContext";
import OfflineIndicator from "@/components/offline/OfflineIndicator";
// Keyboard surfaces are only reached when the user actually presses a key
// (focus shortcuts, "?" help overlay). Lazy-loading them out of the critical
// path saves boot bytes without changing user-visible behaviour — Suspense
// renders nothing while they hydrate, which is exactly what an unpressed
// keyboard listener looks like anyway.
const ShortcutHelpOverlay = lazyWithRetry(() => import("@/components/keyboard/ShortcutHelpOverlay"));
const GlobalNavigationShortcuts = lazyWithRetry(() => import("@/components/keyboard/GlobalNavigationShortcuts"));
// Android hardware-Back handler (Cat-4 M1). Headless; no-op on web/iOS.
// Lazy for the same reason as the shortcuts above — a back listener that
// hasn't hydrated yet is indistinguishable from the OS default for the
// sub-paint window before the shell is interactive.
const AndroidBackButton = lazyWithRetry(() => import("@/components/native/AndroidBackButton"));
// App-level native deep-link / OAuth-callback listener (Cat-4 M2).
// Headless; no-op off native. Single owner — replaces LoginPage's
// page-scoped listener so callbacks resolving off /login aren't dropped.
// Composes with AndroidBackButton above — separate App.addListener calls.
const NativeDeepLinkListener = lazyWithRetry(() => import("@/components/native/NativeDeepLinkListener"));
// One-shot native UX bootstrap (Cat-4 N4): hide the splash after first
// commit, set the iOS status-bar style, lock the Android keyboard resize
// mode. Headless; hard no-op off native. Composes with the two listeners
// above — its plugin packages are dynamic-imported inside the native
// branch so they never enter the web bundle.
const NativeBootstrap = lazyWithRetry(() => import("@/components/native/NativeBootstrap"));
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SentryUserBinding } from "@/components/monitoring/SentryUserBinding";
// Toasters are passive surfaces that only paint once a toast actually fires.
// Lazy + fallback={null} keeps them out of first paint; the first useToast
// caller waits one microtask while the module loads.
const Toaster = lazyWithRetry(() =>
  import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })),
);
const AccessibleToaster = lazyWithRetry(() =>
  import("@/components/a11y/AccessibleToast").then((m) => ({ default: m.AccessibleToaster })),
);
import "@/index.css";
import { supabase } from "@/lib/supabaseClient";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queries/client";
import {
  initSentry,
  whenSentryReady,
  isSentryEnabled,
  getSentryModule,
  stringLooksLikeExternalNoise,
} from "@/lib/monitoring/sentryInit";
import { installBootErrorBuffer } from "@/lib/monitoring/bootErrorBuffer";
// runConfigHealthCheck and initializeWebVitals are imported dynamically
// from inside an idle-callback below — see `deferNonCriticalBootWork`. Both
// observe / report; neither is needed for first paint.
import { looksLikeChunkLoadFailure as sharedLooksLikeChunkLoadFailure } from "@/lib/chunkLoadError";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { attachPreloadFailureRecovery } from "@/lib/preloadRecovery";
import { unregisterAllServiceWorkers } from "@/lib/swRecovery";
import { cacheBustingReload, stripChunkCacheBustParam } from "@/lib/chunkReload";

declare global {
  interface Window {
    supabase?: typeof supabase;
    __mbResolveAudioSrc?: (srcKey: string) => Promise<string | null> | string | null;
    __MB_REACT_ROOT__?: ReactDOM.Root;
    __MB_REACT_ROOT_EL__?: HTMLElement;
    __MB_FATAL_OVERLAY_EL__?: HTMLDivElement;
    __MB_FATAL_OVERLAY_SHOWN__?: boolean;
    __MB_ENTRY_VERSION__?: string;
    __MB_CHUNK_RELOAD_ATTEMPTED__?: boolean;
  }
}

const MB_ENTRY_VERSION = "2026-04-08-main-chunk-recovery-v1";
const CHUNK_RELOAD_SESSION_KEY = "__mb_chunk_reload_once__";

try { window.__MB_ENTRY_VERSION__ = MB_ENTRY_VERSION; } catch { /* ignore */ }

// Sentry init is DEFERRED into requestIdleCallback (deferNonCriticalBootWork
// below) so the ~156 KB @sentry/react chunk stops competing with the LCP
// critical path on Slow 4G (mobile-Lighthouse LCP −1.35 s / FCP −0.5 s).
// Deferring would otherwise lose any error thrown during boot — the most
// diagnostically valuable kind. This bounded buffer, installed FIRST (before
// every boot IIFE) so its window.error/unhandledrejection capture-phase
// listeners are the earliest possible, holds those errors and replays them
// through Sentry once whenSentryReady() settles (or console.error if Sentry
// is disabled / never inits — never a silent drop). User-facing fatal
// handling is independent (attachFatalErrorOverlay below) and unaffected.
const bootErrors = installBootErrorBuffer({
  maxEntries: 50,
  isEnabled: isSentryEnabled,
  getCapture: () => {
    const sdk = getSentryModule() as
      | { captureException?: (e: unknown) => void }
      | null;
    return sdk && typeof sdk.captureException === "function"
      ? sdk.captureException.bind(sdk)
      : null;
  },
});

// Defer non-critical boot work out of the synchronous path:
//   - initSentry: pulls the ~156 KB @sentry/react chunk; deferring it is
//     the LCP/FCP win this change exists for.
//   - runConfigHealthCheck: probes external services and reports to Sentry.
//   - initializeWebVitals: subscribes to LCP/FID/CLS/TTFB/FCP/INP observers.
// All are observability / reporting concerns; none affect what the user
// sees on first paint. Pushing them into requestIdleCallback (with a
// setTimeout fallback for Safari < 16.4 / older Firefox) saves their
// bundled cost from the critical path AND frees the main thread during
// hydration. They still run — just after the user can already interact.
(function deferNonCriticalBootWork() {
  const run = () => {
    initSentry();
    // Flush the boot-error buffer on whichever fires first:
    //   - whenSentryReady(): Sentry reached a terminal state (up OR
    //     permanently disabled) — replay-or-drop now with a correct verdict.
    //   - 10 s hard cap: a wedged dynamic import must not pin errors in
    //     memory forever; flush (→ console, since Sentry isn't up) and
    //     stop buffering. flush() is idempotent so the race is safe.
    void whenSentryReady().then(() => bootErrors.flush());
    setTimeout(() => bootErrors.flush(), 10000);

    void import("@/lib/configHealth")
      .then((m) => m.runConfigHealthCheck())
      .catch(() => {});
    void import("@/lib/perf/webVitalsTracking")
      .then((m) => m.initializeWebVitals())
      .catch(() => {});
  };
  // `requestIdleCallback` exists in Chrome/Edge/Firefox; Safari shipped
  // it in 16.4. setTimeout(1) is the universal fallback — still off the
  // critical path even if not strictly idle.
  if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(run, { timeout: 2000 });
  } else {
    setTimeout(run, 1);
  }
})();

const devLog = (...args: unknown[]) => {
  if (import.meta.env.DEV) console.log(...args);
};

function asErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return `${err.name}: ${err.message}${err.stack ? `\n\n${err.stack}` : ""}`;
  }
  if (typeof err === "string") return err;
  try { return JSON.stringify(err, null, 2); } catch { return String(err); }
}

function asUserSafeErrorMessage(err: unknown): string {
  // Never expose stack traces or internal paths to users in production
  if (err instanceof Error) return `${err.name}: ${err.message}`;
  if (typeof err === "string") return err.split("\n")[0] ?? err;
  return "Đã xảy ra lỗi không mong muốn.";
}

function getFriendlyChunkErrorMessage(): string {
  return [
    "Mercy Blade vừa có bản mới.",
    "Trình duyệt vẫn đang giữ tệp ứng dụng cũ nên trang chưa tải đúng.",
    "Trang sẽ tự làm mới một lần.",
  ].join(" ");
}

// Re-exposed as a local name so the rest of this file keeps its existing
// call sites unchanged. Single source of truth lives in chunkLoadError.ts
// so main.tsx (window.error path) and lazyWithRetry.ts (React.lazy path)
// stay aligned on what counts as a stale-chunk failure.
const looksLikeChunkLoadFailure = sharedLooksLikeChunkLoadFailure;

function hasAlreadyAttemptedChunkRecovery(): boolean {
  try { return sessionStorage.getItem(CHUNK_RELOAD_SESSION_KEY) === "1"; }
  catch { return Boolean(window.__MB_CHUNK_RELOAD_ATTEMPTED__); }
}

function markChunkRecoveryAttempted(): void {
  try { sessionStorage.setItem(CHUNK_RELOAD_SESSION_KEY, "1"); }
  catch { window.__MB_CHUNK_RELOAD_ATTEMPTED__ = true; }
}

function scheduleOneTimeChunkReload(): boolean {
  if (hasAlreadyAttemptedChunkRecovery()) return false;
  markChunkRecoveryAttempted();
  // Defer 900 ms so any chained chunk errors collapse into a single
  // recovery cycle, then unregister the SW before reloading. The SW
  // — if installed from a prior deploy — would otherwise intercept
  // the reload navigation and serve the same stale precached
  // index.html, leaving the page blank because the one-shot session
  // gate above prevents a second recovery attempt. See
  // reports/a9-route-recovery-diagnosis.md for the full failure
  // trace this addresses. The SW re-registers on the next page load
  // via the existing `registerPwaServiceWorker` IIFE below, so this
  // only kills it for the recovery reload — healthy users never
  // reach this code path.
  window.setTimeout(async () => {
    try {
      await unregisterAllServiceWorkers();
    } catch { /* never block reload on unregister failure */ }
    // Cache-busting nav, NOT window.location.reload(): embedded webviews
    // (FB in-app browser, iOS Chrome/WKWebView) re-serve the stale
    // document on a plain reload even with the SW gone, because they
    // ignore the `no-cache` header on /index.html. See chunkReload.ts.
    try { cacheBustingReload(); } catch { /* ignore */ }
  }, 900);
  return true;
}

(function attachFatalErrorOverlay() {
  const getOverlayRoot = (): HTMLDivElement | null => {
    try {
      if (typeof document === "undefined" || !document.body) return null;
      if (window.__MB_FATAL_OVERLAY_EL__ && document.body.contains(window.__MB_FATAL_OVERLAY_EL__)) {
        return window.__MB_FATAL_OVERLAY_EL__;
      }
      const existing = document.querySelector<HTMLDivElement>('[data-mb-fatal-overlay="1"]');
      if (existing) { window.__MB_FATAL_OVERLAY_EL__ = existing; return existing; }
      const el = document.createElement("div");
      el.setAttribute("data-mb-fatal-overlay", "1");
      document.body.appendChild(el);
      window.__MB_FATAL_OVERLAY_EL__ = el;
      return el;
    } catch { return null; }
  };

  const mountFriendlyChunkRecoveryOverlay = (err: unknown) => {
    try {
      const overlayRoot = getOverlayRoot();
      if (!overlayRoot) return;
      overlayRoot.innerHTML = "";

      const wrap = document.createElement("div");
      Object.assign(wrap.style, {
        position: "fixed", inset: "0", zIndex: "2147483647",
        background: "rgba(255,255,255,0.98)", color: "#0f172a",
        padding: "24px", fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
        display: "flex", alignItems: "center", justifyContent: "center",
      });

      const card = document.createElement("div");
      Object.assign(card.style, {
        width: "100%", maxWidth: "640px",
        border: "1px solid rgba(15,23,42,0.08)", borderRadius: "20px",
        background: "linear-gradient(180deg,#f8fafc 0%, #eefbf7 100%)",
        boxShadow: "0 10px 30px rgba(15,23,42,0.08)", padding: "24px",
      });

      const title = document.createElement("h1");
      title.textContent = "Đang cập nhật Mercy Blade";
      Object.assign(title.style, { margin: "0", fontSize: "28px", lineHeight: "1.1", fontWeight: "900", color: "#111827" });

      const body = document.createElement("p");
      body.textContent = getFriendlyChunkErrorMessage();
      Object.assign(body.style, { margin: "12px 0 0", color: "#475569", lineHeight: "1.7", fontSize: "16px" });

      const actions = document.createElement("div");
      Object.assign(actions.style, { display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "18px" });

      const reloadBtn = document.createElement("button");
      reloadBtn.type = "button";
      reloadBtn.textContent = "Tải lại";
      reloadBtn.onclick = () => window.location.reload();
      Object.assign(reloadBtn.style, {
        borderRadius: "14px", minHeight: "46px", padding: "12px 16px",
        border: "1px solid rgba(15,23,42,0.12)", background: "#0f172a",
        color: "#fff", fontWeight: "900", cursor: "pointer",
      });
      actions.appendChild(reloadBtn);

      card.appendChild(title);
      card.appendChild(body);
      card.appendChild(actions);

      // Debug details only in dev
      if (import.meta.env.DEV) {
        const debug = document.createElement("pre");
        debug.textContent = asErrorMessage(err);
        Object.assign(debug.style, {
          whiteSpace: "pre-wrap", margin: "18px 0 0", padding: "12px 14px",
          borderRadius: "14px", border: "1px solid rgba(15,23,42,0.08)",
          background: "rgba(255,255,255,0.88)", color: "#334155",
          fontSize: "12px", lineHeight: "1.5", overflow: "auto",
        });
        card.appendChild(debug);
      }

      wrap.appendChild(card);
      overlayRoot.appendChild(wrap);
      window.__MB_FATAL_OVERLAY_SHOWN__ = true;
    } catch { /* ignore overlay failures */ }
  };

  const mountFatalOverlay = (title: string, err: unknown) => {
    try {
      const overlayRoot = getOverlayRoot();
      if (!overlayRoot) return;

      // In production show only safe message — no stack traces, no internal paths
      const message = import.meta.env.DEV
        ? `${title}\n\n${asErrorMessage(err)}\n\nURL: ${window.location.href}`
        : `Đã xảy ra lỗi.\n\n${asUserSafeErrorMessage(err)}`;

      overlayRoot.innerHTML = "";

      const wrap = document.createElement("div");
      Object.assign(wrap.style, {
        position: "fixed", inset: "0", zIndex: "2147483647",
        background: "rgba(255,255,255,0.98)", color: "rgba(0,0,0,0.88)",
        padding: "16px",
        fontFamily: import.meta.env.DEV
          ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
          : 'Inter, ui-sans-serif, system-ui, sans-serif',
        fontSize: "12px", lineHeight: "1.5", overflow: "auto",
      });

      const pre = document.createElement("pre");
      pre.style.whiteSpace = "pre-wrap";
      pre.style.margin = "0";
      pre.textContent = message;
      wrap.appendChild(pre);
      overlayRoot.appendChild(wrap);
      window.__MB_FATAL_OVERLAY_SHOWN__ = true;
    } catch { /* ignore overlay failures */ }
  };

  const handleGlobalFatal = (title: string, err: unknown) => {
    if (looksLikeChunkLoadFailure(err)) {
      mountFriendlyChunkRecoveryOverlay(err);
      const scheduled = scheduleOneTimeChunkReload();
      if (!scheduled) mountFatalOverlay(`${title} (chunk reload already attempted)`, err);
      return;
    }
    mountFatalOverlay(title, err);
  };

  window.addEventListener("error", (e: ErrorEvent) => {
    if (window.__MB_FATAL_OVERLAY_SHOWN__) return;
    // Suppress fatal overlay for external injection noise (Zalo IAB,
    // browser extensions, third-party trackers). These errors don't
    // originate in our code and we can't fix them — showing a fatal
    // overlay to the user would be misleading and disruptive.
    const errorHaystack = [
      e.message || "",
      e.filename || "",
      e.error ? asErrorMessage(e.error) : "",
    ].join(" ");
    if (stringLooksLikeExternalNoise(errorHaystack)) return;
    handleGlobalFatal("[MB FATAL] window.error", e.error ?? e.message);
  });

  window.addEventListener("unhandledrejection", (e: PromiseRejectionEvent) => {
    if (window.__MB_FATAL_OVERLAY_SHOWN__) return;
    handleGlobalFatal("[MB FATAL] unhandledrejection", e.reason);
  });
})();

(function wirePreloadFailureRecovery() {
  // Stale-deploy recovery — second layer of defence beneath the
  // vercel.json `Cache-Control: no-cache, must-revalidate` headers
  // on `/` and `/index.html`. See src/lib/preloadRecovery.ts for the
  // full rationale. Catches silent modulepreload / module-script
  // 404s that don't surface to the existing window.error handler.
  attachPreloadFailureRecovery(() => {
    scheduleOneTimeChunkReload();
  });
})();

(function cleanChunkCacheBustParam() {
  // The cache-busting recovery nav lands here with `?_cb=<ts>` on the
  // URL. Strip it before the router mounts so the address bar and any
  // shared/copied URL stay clean and the param doesn't linger across
  // client-side navigations. No-op on a normal (non-recovered) load.
  try { stripChunkCacheBustParam(); } catch { /* ignore */ }
})();

(function normalizeLegacyPaths() {
  try {
    const path = window.location.pathname || "/";
    if (path === "/upgrade") {
      window.history.replaceState(null, "",
        `/pricing${window.location.search || ""}${window.location.hash || ""}`);
    }
  } catch { /* ignore */ }
})();

// A9 — capture ?ref=ABC234 before any auth round-trip eats the URL.
// Stashes the code in sessionStorage; AuthProvider auto-applies it on
// the first verified login. Idempotent — safe on every boot.
(function captureReferralCodeOnBoot() {
  try {
    void import("@/lib/referral/referralClient").then((mod) => {
      mod.capturePendingReferralFromUrl();
    });
  } catch { /* ignore */ }
})();

(function restoreDeepLinkFromSessionStorage() {
  try {
    const redirect = sessionStorage.getItem("redirect");
    if (!redirect) return;
    sessionStorage.removeItem("redirect");
    const url = new URL(redirect);
    let next = `${url.pathname}${url.search}${url.hash}`;
    if (url.pathname === "/upgrade") next = `/pricing${url.search}${url.hash}`;
    if (window.location.pathname + window.location.search + window.location.hash !== next) {
      window.history.replaceState(null, "", next);
    }
  } catch { /* ignore */ }
})();

(function registerPwaServiceWorker() {
  // Register the Workbox-built /sw.js. The SW's job:
  //   - Network-first HTML so the latest shell ships on every deploy.
  //   - Cache-first hashed JS/CSS chunks for instant repeat loads.
  //   - Runtime caches for audio / room JSON / kids assets.
  //
  // Deploy propagation: workbox builds /sw.js with skipWaiting:true +
  // clientsClaim:true. On a new deploy, the browser fetches /sw.js,
  // installs the new SW, then (because of the message handlers below)
  // tells it to skipWaiting immediately. clientsClaim makes the new SW
  // take ownership of the open tab. `controllerchange` then fires once,
  // and we reload exactly once so the page itself runs the new bundle
  // instead of just having its future fetches served by the new SW.
  //
  // Skipped in dev so HMR + the grammar-server proxy aren't intercepted.
  try {
    if (!import.meta.env.PROD) return;
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    // Snapshot whether the page was loaded under an existing controller.
    // If yes, a later `controllerchange` event means "the new SW just
    // took over from the old one" — we should reload to pick up the
    // matching HTML+JS. If no, the page is a fresh visitor and the
    // first controllerchange is the initial activation, NOT an update
    // — we must NOT reload in that case (would loop on first visit).
    const hadInitialController = Boolean(navigator.serviceWorker.controller);
    let didReload = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!hadInitialController) return;
      if (didReload) return;
      didReload = true;
      try { window.location.reload(); } catch { /* ignore */ }
    });

    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // When a new SW finishes installing AND an old SW is still
          // the controller, force the new one to skip waiting. The new
          // SW (built with skipWaiting:true) already listens for this
          // message via workbox-build; postMessage triggers it.
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                try { newWorker.postMessage({ type: "SKIP_WAITING" }); }
                catch { /* ignore */ }
              }
            });
          });
        })
        .catch((err) => devLog("[MB SW] register failed", err));
    });
  } catch { /* never block boot on SW registration */ }
})();

(function exposeSupabaseForDebug() {
  try {
    if (!import.meta.env.DEV) return;
    window.supabase = supabase;
    devLog("[MB DEV] window.supabase attached");
  } catch { /* ignore */ }
})();

(function installPrivateAudioSeam() {
  try {
    void import("@/lib/privateAudioResolver")
      .then((mod) => { mod.installDefaultPrivateAudioResolver(); })
      .catch(() => { /* never block boot */ });
  } catch { /* never block boot */ }
})();

(function initIapOnNative() {
  // Lazy-load so the web bundle does not include the RevenueCat module.
  // initRevenueCat() is internally a no-op on non-iOS platforms, but the
  // import itself only runs here. Never block boot.
  try {
    void import("@/lib/iap")
      .then((mod) => { void mod.initRevenueCat(); })
      .catch(() => { /* never block boot */ });
  } catch { /* never block boot */ }
})();

(function bootMarketingTracking() {
  // UTM capture + Facebook Pixel + GA4. Lazy import so the consent-off
  // / no-env-vars path never even pulls the loader code into the
  // initial bundle. Never block boot — if anything throws we just
  // skip tracking. See src/services/behaviorTrackingFlag.ts.
  try {
    void import("@/services/behaviorTrackingFlag")
      .then((mod) => mod.initMarketingTracking())
      .catch(() => { /* never block boot on a tracker failure */ });
  } catch { /* ignore */ }
})();

// The one-shot chunk-reload mark (CHUNK_RELOAD_SESSION_KEY) is now cleared
// event-driven on the SUCCESS path of lazyWithRetry's loader — the moment
// any lazy chunk loads cleanly, proving the recovery worked. That replaces
// the old wall-clock `clearChunkReloadMarkerAfterHealthyBoot` setTimeout,
// which mobile webviews (Facebook in-app browser) throttled to a silent
// no-op whenever the post-reload page was backgrounded, leaving the mark
// stuck for the rest of the session and crashing the *next* deploy into
// the ErrorBoundary. See src/lib/lazyWithRetry.ts.

const root = document.getElementById("root");
if (!root) throw new Error("Root element #root not found");

const w = window;
if (!w.__MB_REACT_ROOT__ || w.__MB_REACT_ROOT_EL__ !== root) {
  w.__MB_REACT_ROOT__ = ReactDOM.createRoot(root);
  w.__MB_REACT_ROOT_EL__ = root;
}

w.__MB_REACT_ROOT__.render(
  <ErrorBoundary>
    <BrowserRouter>
      {/* QueryClientProvider sits OUTSIDE AuthProvider so auth-dependent
          queries (entitlement, profile, gift subscription, etc.) can read
          the auth context. Behavior change for this PR: none — feature
          code is migrated to useQuery in follow-ups (A2–A6). */}
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SentryUserBinding />
          <OfflineIndicator />
          {/* Keyboard surfaces + toasters are lazy-loaded out of the critical
              path. fallback={null} is correct: a keyboard listener that
              hasn't loaded yet is indistinguishable from an unpressed key,
              and a toaster that hasn't loaded yet has nothing to render. */}
          <Suspense fallback={null}>
            <GlobalNavigationShortcuts />
            <AndroidBackButton />
            <NativeDeepLinkListener />
            <NativeBootstrap />
            <ShortcutHelpOverlay />
            <Toaster />
            <AccessibleToaster />
          </Suspense>
          <LanguageProgressProvider>
            {/* UiLanguageProvider wraps the router so the global VI/EN
                toggle in AppHeroShell and every routed language surface
                share one reactive state (default "vi").
                NativeLanguageProvider is the distinct *native-language*
                (pedagogy L1) axis — Phase 2 / Option C plumbing. Inert
                today (no consumer until PR-A2; default "vi" ⇒ no behavior
                change); mounted here so the eventual repoint is a pure
                swap. See RECON-schema-generalize-phase2.md. */}
            <UiLanguageProvider>
              <NativeLanguageProvider>
                <AppRouter />
              </NativeLanguageProvider>
            </UiLanguageProvider>
          </LanguageProgressProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </ErrorBoundary>,
);