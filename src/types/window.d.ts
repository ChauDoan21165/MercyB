// src/types/window.d.ts
// MB-BLUE-WINDOW-TYPING-2 — 2026-01-03 (+0700)
//
// Purpose:
// - Eliminate loose Window casts
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
    /** TierIndex debug snapshot of the loaded tier-room list. */
    __MB_ALL_ROOMS__?: import("@/lib/tierRoomSource").TierRoom[];
    /** TierIndex debug snapshot of the hidden-room diagnostic report (write-only). */
    __MB_TIER_REPORT__?: unknown;
    /** Room-perf timing anchor (ms, set in ChatHub, read in RoomRenderer). */
    __mbRoomPerfT0?: number;
    /** Last repeat-target dispatch key for duplicate suppression. */
    __mb_last_repeat_key?: string;

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
