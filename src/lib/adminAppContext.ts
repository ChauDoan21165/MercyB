// src/lib/adminAppContext.ts
// MB-BLUE-101.5 — 2026-01-01 (+0700)
//
// ADMIN APP CONTEXT (LOCKED):
// - Multi-app admin console selects app_id.
// - Priority:
//   1) URL query param ?app=
//   2) localStorage key "mb_admin_app_id"
//   3) default "mercy_blade"
// - No dependencies on React/router (safe to import anywhere).

export const ADMIN_APP_ID_KEY = "mb_admin_app_id";

export function getAdminAppId(defaultId = "mercy_blade"): string {
  // 1) URL param
  try {
    const url = new URL(window.location.href);
    const q = (url.searchParams.get("app") || "").trim();
    if (q) return q;
  } catch {
    // ignore
  }

  // 2) localStorage
  try {
    const saved = (localStorage.getItem(ADMIN_APP_ID_KEY) || "").trim();
    if (saved) return saved;
  } catch {
    // ignore
  }

  // 3) default
  return defaultId;
}

export function setAdminAppId(appId: string) {
  const cleaned = (appId || "").trim();
  if (!cleaned) return;

  // localStorage
  try {
    localStorage.setItem(ADMIN_APP_ID_KEY, cleaned);
  } catch {
    // ignore
  }

  // URL reflect (shareable)
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("app", cleaned);
    window.history.replaceState({}, "", url.toString());
  } catch {
    // ignore
  }
}

// Read app id from a router search string (e.g. useLocation().search).
export function getAppFromSearch(search: string): string {
  try {
    return (new URLSearchParams(search).get("app") || "").trim();
  } catch {
    return "";
  }
}

// Read app id from localStorage only (no URL/default fallback).
export function getAppFromStorage(): string {
  try {
    return (localStorage.getItem(ADMIN_APP_ID_KEY) || "").trim();
  } catch {
    return "";
  }
}

// Append ?app=<appId> to a href, preserving existing query params.
export function withApp(href: string, appId: string): string {
  const cleaned = (appId || "").trim();
  if (!cleaned) return href;
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}app=${encodeURIComponent(cleaned)}`;
}
