// src/main.tsx
// MB-BLUE-100.7 — 2025-12-31 (+0700)
//
// FIX (100.7):
// - ✅ Wrap app in <AuthProvider> so AdminRoute/useAuth never crashes.
// - ✅ Remove all explicit `any` (lint clean).
// - Keep fatal overlay.
// - Keep React.StrictMode OFF (avoid dev double-mount confusion).

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AppRouter from "@/router/AppRouter";
import "@/index.css";

// ✅ AUTH PROVIDER (required for /admin)
import { AuthProvider } from "@/providers/AuthProvider";

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

      const msg =
        `${title}\n\n` +
        message +
        `\n\nURL: ${window.location.href}`;

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

  window.addEventListener(
    "unhandledrejection",
    (e: PromiseRejectionEvent) => {
      mount("[MB FATAL] unhandledrejection", e.reason);
    }
  );
})();

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element #root not found");
}

ReactDOM.createRoot(root).render(
  <AuthProvider>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </AuthProvider>
);

/**
 * New thing to learn:
 * Browser error events already have strong DOM types — using them avoids `any`
 * and gives safer, more debuggable crash handling.
 */
