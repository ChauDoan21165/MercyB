// MB-BLUE-100.7 — 2025-12-31 (+0700)
//
// FIX (100.7):
// - ✅ Wrap app in <AuthProvider> so AdminRoute/useAuth never crashes.
// - ✅ Remove all explicit `any` (lint clean).
// - Keep fatal overlay.
// - Keep React.StrictMode OFF (avoid dev double-mount confusion).
//
// ✅ SPA Deep-Link Handoff (Vercel 404 fallback):
// - If host served / (or 404.html redirected), restore the intended path from sessionStorage.redirect
// - This pairs with public/404.html that saves location.href then refreshes to "/"
//
// ✅ DEV DEBUG (2026-01-18):
// - Expose Supabase client for console debugging:
//   window.supabase.auth.getSession()
//   window.supabase.from("community_messages").select("*").limit(3)
//
// ✅ PATCH (2026-03-02):
// - Canonical pricing route is /pricing.
// - /upgrade is deprecated: hard-normalize it to /pricing BEFORE React Router mounts.
//   (This avoids 404 loops if any code/edge redirects still send users to /upgrade.)
//
// ✅ PERF PATCH (2026-03-08):
// - Remove eager supabase import from the main entry.
// - DEV-only Supabase console exposure is now dynamic-imported.
// - Private audio resolver installer is also dynamic-imported.
// - This reduces initial-path pressure and avoids pulling extra supabase/debug code into startup here.

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AppRouter from "@/router/AppRouter";
import "@/index.css";

// ✅ AUTH PROVIDER (required for /admin)
import { AuthProvider } from "@/providers/AuthProvider";

type SupabaseModule = typeof import("@/lib/supabaseClient");

declare global {
  interface Window {
    supabase?: SupabaseModule["supabase"];

    // ✅ Optional private-audio resolver hook (TalkingFacePlayButton seam)
    // Installed by installDefaultPrivateAudioResolver().
    __mbResolveAudioSrc?: (srcKey: string) => Promise<string | null> | string | null;

    // ✅ HMR-safe singleton root (prevents double createRoot → removeChild NotFoundError)
    __MB_REACT_ROOT__?: ReactDOM.Root;
    __MB_REACT_ROOT_EL__?: HTMLElement;

    // ✅ Fatal overlay singleton state (prevents DOM races + duplicate overlays)
    __MB_FATAL_OVERLAY_EL__?: HTMLDivElement;
    __MB_FATAL_OVERLAY_SHOWN__?: boolean;

    // ✅ Optional entry truth beacon (helps debug which bundle is running)
    __MB_ENTRY_VERSION__?: string;
  }
}

// ✅ ENTRY TRUTH BEACON (debug)
const MB_ENTRY_VERSION = "2026-03-08-main-lazy-debug-v1";
try {
  window.__MB_ENTRY_VERSION__ = MB_ENTRY_VERSION;
} catch {
  // ignore
}

/** ✅ DEV-only logger (keeps production console clean) */
const devLog = (...args: unknown[]) => {
  if (import.meta.env.DEV) console.log(...args);
};

// ✅ MB FATAL OVERLAY — shows runtime errors on screen
(function attachFatalErrorOverlay() {
  const getOverlayRoot = (): HTMLDivElement | null => {
    try {
      if (typeof document === "undefined" || !document.body) return null;

      if (
        window.__MB_FATAL_OVERLAY_EL__ &&
        document.body.contains(window.__MB_FATAL_OVERLAY_EL__)
      ) {
        return window.__MB_FATAL_OVERLAY_EL__;
      }

      const existing = document.querySelector<HTMLDivElement>(
        '[data-mb-fatal-overlay="1"]'
      );
      if (existing) {
        window.__MB_FATAL_OVERLAY_EL__ = existing;
        return existing;
      }

      const el = document.createElement("div");
      el.setAttribute("data-mb-fatal-overlay", "1");
      document.body.appendChild(el);
      window.__MB_FATAL_OVERLAY_EL__ = el;
      return el;
    } catch {
      return null;
    }
  };

  const mount = (title: string, err: unknown) => {
    try {
      const overlayRoot = getOverlayRoot();
      if (!overlayRoot) return;

      const message =
        err instanceof Error
          ? err.stack || err.message
          : typeof err === "string"
            ? err
            : JSON.stringify(err, null, 2);

      const msg = `${title}\n\n${message}\n\nURL: ${window.location.href}`;

      overlayRoot.innerHTML = "";

      const wrap = document.createElement("div");
      wrap.style.position = "fixed";
      wrap.style.inset = "0";
      wrap.style.zIndex = "2147483647";
      wrap.style.background = "rgba(255,255,255,0.98)";
      wrap.style.color = "rgba(0,0,0,0.88)";
      wrap.style.padding = "16px";
      wrap.style.fontFamily =
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';
      wrap.style.fontSize = "12px";
      wrap.style.lineHeight = "1.5";
      wrap.style.overflow = "auto";

      const pre = document.createElement("pre");
      pre.style.whiteSpace = "pre-wrap";
      pre.style.margin = "0";
      pre.textContent = msg;

      wrap.appendChild(pre);
      overlayRoot.appendChild(wrap);

      window.__MB_FATAL_OVERLAY_SHOWN__ = true;
    } catch {
      // ignore overlay failures
    }
  };

  window.addEventListener("error", (e: ErrorEvent) => {
    if (window.__MB_FATAL_OVERLAY_SHOWN__) return;
    mount("[MB FATAL] window.error", e.error ?? e.message);
  });

  window.addEventListener("unhandledrejection", (e: PromiseRejectionEvent) => {
    if (window.__MB_FATAL_OVERLAY_SHOWN__) return;
    mount("[MB FATAL] unhandledrejection", e.reason);
  });
})();

/**
 * ✅ Canonicalize legacy paths BEFORE router mounts.
 * - /upgrade is deprecated -> /pricing
 */
(function normalizeLegacyPaths() {
  try {
    const path = window.location.pathname || "/";
    if (path === "/upgrade") {
      const next = `/pricing${window.location.search || ""}${window.location.hash || ""}`;
      window.history.replaceState(null, "", next);
    }
  } catch {
    // ignore
  }
})();

/**
 * ✅ SPA deep-link restore:
 * If public/404.html set sessionStorage.redirect to the original deep URL,
 * restore it before React Router mounts.
 */
(function restoreDeepLinkFromSessionStorage() {
  try {
    const redirect = sessionStorage.getItem("redirect");
    if (!redirect) return;

    sessionStorage.removeItem("redirect");

    const url = new URL(redirect);
    let next = `${url.pathname}${url.search}${url.hash}`;

    if (url.pathname === "/upgrade") {
      next = `/pricing${url.search}${url.hash}`;
    }

    if (window.location.pathname + window.location.search + window.location.hash !== next) {
      window.history.replaceState(null, "", next);
    }
  } catch {
    // ignore
  }
})();

// ✅ DEV: expose supabase to window for console debugging
// PERF: dynamic import so main entry does not eagerly pull supabase here.
(function exposeSupabaseForDebug() {
  try {
    if (!import.meta.env.DEV) return;

    void import("@/lib/supabaseClient")
      .then((mod) => {
        window.supabase = mod.supabase;
        devLog("[MB DEV] window.supabase attached");
      })
      .catch(() => {
        // ignore
      });
  } catch {
    // ignore
  }
})();

// ✅ Install private-audio resolver seam (safe / optional)
// PERF: dynamic import so it does not weigh on first parse unless needed.
(function installPrivateAudioSeam() {
  try {
    void import("@/lib/privateAudioResolver")
      .then((mod) => {
        mod.installDefaultPrivateAudioResolver();
      })
      .catch(() => {
        // never block boot
      });
  } catch {
    // never block boot
  }
})();

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element #root not found");
}

// ✅ HMR-safe singleton root
const w = window;

if (!w.__MB_REACT_ROOT__ || w.__MB_REACT_ROOT_EL__ !== root) {
  w.__MB_REACT_ROOT__ = ReactDOM.createRoot(root);
  w.__MB_REACT_ROOT_EL__ = root;
}

w.__MB_REACT_ROOT__.render(
  <BrowserRouter>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </BrowserRouter>,
);