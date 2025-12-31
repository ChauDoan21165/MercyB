// src/main.tsx
// MB-BLUE-100.7 — 2025-12-31 (+0700)
//
// FIX (100.7):
// - ✅ Wrap app in <AuthProvider> so AdminRoute/useAuth never crashes.
// - Keep fatal overlay.
// - Keep React.StrictMode OFF (avoid dev double-mount confusion).

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AppRouter from "@/router/AppRouter";
import "@/index.css";

// ✅ AUTH PROVIDER (required for /admin)
// If this import path differs in your repo, change ONLY the import line.
import { AuthProvider } from "@/providers/AuthProvider";

// ✅ MB FATAL OVERLAY — shows runtime errors on screen
(function attachFatalErrorOverlay() {
  const mount = (title: string, err: any) => {
    try {
      const rootEl = document.getElementById("root");
      if (!rootEl) return;

      const msg =
        `${title}\n\n` +
        (err?.stack || err?.message || String(err)) +
        `\n\nURL: ${location.href}`;

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
      // ignore
    }
  };

  window.addEventListener("error", (e) =>
    mount("[MB FATAL] window.error", (e as any).error || e)
  );
  window.addEventListener("unhandledrejection", (e) =>
    mount("[MB FATAL] unhandledrejection", (e as any).reason || e)
  );
})();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </AuthProvider>
);

/** New thing to learn:
 * If a hook throws “must be used inside Provider”, the fix is always at app root, not inside the feature page. */
