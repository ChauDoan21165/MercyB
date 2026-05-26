// src/types/window.d.ts
// MB-BLUE-WINDOW-TYPING-2 — 2026-01-03 (+0700)
//
// Purpose:
// - Eliminate all `(window as any)` casts
// - Centralize MercyB debug globals
// - Support Safari audio + React runtime inspection
// - Keep typings permissive but explicit

export {};

declare global {
  interface Window {
    /* ===============================
     * MercyB debug / diagnostics
     * =============================== */
    __MB_PERF?: unknown;
    __MB_LOG?: unknown;
    __MB_SESSION?: unknown;
    __MB_LOGGER?: unknown;
    __MB_RESTORE_CONSOLE?: unknown;

    /* ===============================
     * Runtime / observability hooks
     * =============================== */
    webVitals?: {
      getCLS?: () => number;
    };

    __REACT_ROUTER__?: unknown;

    /* ===============================
     * React (runtime inspection only)
     * =============================== */
    React?: {
      version?: string;
    };

    /* ===============================
     * Audio (Safari / legacy WebKit)
     * =============================== */
    webkitAudioContext?: typeof AudioContext;
  }
}
