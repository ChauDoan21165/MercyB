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

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AppRouter from "@/router/AppRouter";
import "@/index.css";

// ✅ AUTH PROVIDER (required for /admin)
import { AuthProvider } from "@/providers/AuthProvider";

// ✅ Supabase client (DEV console debugging)
import { supabase } from "@/lib/supabaseClient";

declare global {
  interface Window {
    supabase?: typeof supabase;
  }
}

// ✅ MB FATAL OVERLAY — shows runtime errors on screen
(function attachFatalErrorOverlay() {
  const mount = (title: string, err: unknown) => {
    try {
      const rootEl = document.getElementById("root");
      if (!rootEl) return;

      const message =
        err instanceof Error
          ? err.stack || err.message
          : typeof err === "string"
            ? err
            : JSON.stringify(err, null, 2);

      const msg = `${title}\n\n` + message + `\n\nURL: ${window.location.href}`;

      // Clear existing UI so overlay is visible even if CSS is broken
      rootEl.innerHTML = "";

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
      rootEl.appendChild(wrap);
    } catch {
      // ignore overlay failures
    }
  };

  window.addEventListener("error", (e: ErrorEvent) => {
    mount("[MB FATAL] window.error", e.error ?? e.message);
  });

  window.addEventListener("unhandledrejection", (e: PromiseRejectionEvent) => {
    mount("[MB FATAL] unhandledrejection", e.reason);
  });
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
    const next = `${url.pathname}${url.search}${url.hash}`;

    // Avoid looping if already at the same path
    if (window.location.pathname + window.location.search + window.location.hash !== next) {
      window.history.replaceState(null, "", next);
    }
  } catch {
    // ignore
  }
})();

// ✅ DEV: expose supabase to window for console debugging
(function exposeSupabaseForDebug() {
  try {
    if (!import.meta.env.DEV) return;
    window.supabase = supabase;
  } catch {
    // ignore
  }
})();

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element #root not found");
}

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </BrowserRouter>,
);

/**
 * New thing to learn:
 * When debugging RLS, putting your client on window lets you test SELECT/INSERT
 * from the same authenticated session as the UI.
 */
