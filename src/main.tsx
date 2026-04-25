// src/main.tsx
// MB-BLUE-100.8 — 2026-04-08 (+0700)
//
// FIX (100.8):
// - ✅ Add one-time stale-chunk auto-recovery for dynamic import failures.
// - ✅ Show friendly reload UI instead of raw fatal dump for chunk mismatch.
// - ✅ Keep fatal overlay for real crashes — stack traces in DEV only.
// - ✅ Keep AuthProvider wrap.
// - ✅ Keep React.StrictMode OFF.
// - ✅ Keep service worker registration disabled while debugging stale-cache issues.

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AppRouter from "@/router/AppRouter";
import OfflineIndicator from "@/components/offline/OfflineIndicator";
import "@/index.css";
import { supabase } from "@/lib/supabaseClient";
import { AuthProvider } from "@/providers/AuthProvider";

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
  return "An unexpected error occurred.";
}

function getFriendlyChunkErrorMessage(): string {
  return [
    "A new version of Mercy Blade was deployed.",
    "Your browser is still holding an older app file, so this page could not load correctly.",
    "We'll refresh once automatically.",
  ].join(" ");
}

function looksLikeChunkLoadFailure(err: unknown): boolean {
  const message = asErrorMessage(err).toLowerCase();
  return (
    message.includes("failed to fetch dynamically imported module") ||
    message.includes("dynamically imported module") ||
    message.includes("importing a module script failed") ||
    message.includes("loading chunk") ||
    message.includes("chunkloaderror") ||
    message.includes("failed to import")
  );
}

function hasAlreadyAttemptedChunkRecovery(): boolean {
  try { return sessionStorage.getItem(CHUNK_RELOAD_SESSION_KEY) === "1"; }
  catch { return Boolean(window.__MB_CHUNK_RELOAD_ATTEMPTED__); }
}

function markChunkRecoveryAttempted(): void {
  try { sessionStorage.setItem(CHUNK_RELOAD_SESSION_KEY, "1"); }
  catch { window.__MB_CHUNK_RELOAD_ATTEMPTED__ = true; }
}

function clearChunkRecoveryAttempt(): void {
  try { sessionStorage.removeItem(CHUNK_RELOAD_SESSION_KEY); }
  catch { window.__MB_CHUNK_RELOAD_ATTEMPTED__ = false; }
}

function scheduleOneTimeChunkReload(): boolean {
  if (hasAlreadyAttemptedChunkRecovery()) return false;
  markChunkRecoveryAttempted();
  window.setTimeout(() => {
    try { window.location.reload(); } catch { /* ignore */ }
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
      title.textContent = "Refreshing Mercy Blade";
      Object.assign(title.style, { margin: "0", fontSize: "28px", lineHeight: "1.1", fontWeight: "900", color: "#111827" });

      const body = document.createElement("p");
      body.textContent = getFriendlyChunkErrorMessage();
      Object.assign(body.style, { margin: "12px 0 0", color: "#475569", lineHeight: "1.7", fontSize: "16px" });

      const actions = document.createElement("div");
      Object.assign(actions.style, { display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "18px" });

      const reloadBtn = document.createElement("button");
      reloadBtn.type = "button";
      reloadBtn.textContent = "Refresh now";
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
        : `Something went wrong.\n\n${asUserSafeErrorMessage(err)}`;

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
    handleGlobalFatal("[MB FATAL] window.error", e.error ?? e.message);
  });

  window.addEventListener("unhandledrejection", (e: PromiseRejectionEvent) => {
    if (window.__MB_FATAL_OVERLAY_SHOWN__) return;
    handleGlobalFatal("[MB FATAL] unhandledrejection", e.reason);
  });
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
  // intentionally disabled
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

(function clearChunkReloadMarkerAfterHealthyBoot() {
  window.setTimeout(() => { clearChunkRecoveryAttempt(); }, 8000);
})();

const root = document.getElementById("root");
if (!root) throw new Error("Root element #root not found");

const w = window;
if (!w.__MB_REACT_ROOT__ || w.__MB_REACT_ROOT_EL__ !== root) {
  w.__MB_REACT_ROOT__ = ReactDOM.createRoot(root);
  w.__MB_REACT_ROOT_EL__ = root;
}

w.__MB_REACT_ROOT__.render(
  <BrowserRouter>
    <AuthProvider>
      <OfflineIndicator />
      <AppRouter />
    </AuthProvider>
  </BrowserRouter>,
);