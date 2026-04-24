// src/lib/apiBase.ts
//
// Resolves application API paths (e.g. "/api/mercy/grammar") into the
// fetch URL the runtime should actually use.
//
// Why this exists:
//   The Vercel-hosted serverless functions live at https://mercyblade.com/api/*.
//   On the web build, fetch('/api/foo') resolves correctly against the
//   page origin (mercyblade.com) — no work needed.
//   On iOS / Android Capacitor builds, the WebView serves the bundled
//   `dist/` folder from `capacitor://localhost`, which has NO API
//   functions. fetch('/api/foo') hits the SPA fallback and gets back
//   index.html (200 OK with HTML body). Calling JSON.parse on that
//   throws "Grammar help returned invalid JSON" — the bug Chau filed
//   against grammar help in TestFlight Build 7.
//
// Fix: when running on a Capacitor native platform, prefix the path
// with the production origin so the request hits the real backend.
//
// Override: VITE_API_BASE_URL — used in dev / staging to point native
// builds at a non-prod backend (e.g. preview deploy). Empty string or
// missing means "use prod default".
//
// Tested in src/lib/__tests__/apiBase.test.ts.

import { isNativePlatform } from "@/lib/platform";

const PROD_API_ORIGIN = "https://mercyblade.com";

function readEnvBaseUrl(): string {
  try {
    const raw = (import.meta as ImportMeta | undefined)?.env?.VITE_API_BASE_URL;
    return typeof raw === "string" ? raw.trim() : "";
  } catch {
    return "";
  }
}

/**
 * Strip a single trailing slash. We keep the input shape predictable so
 * resolveApiUrl can join with `path` (which always starts with `/`)
 * without producing `https://host//api/...`.
 */
function stripTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

/**
 * Returns the absolute origin to use for `/api/*` requests on native
 * builds. Prefers VITE_API_BASE_URL when set, falls back to prod.
 *
 * Exported only for tests — call sites should use {@link resolveApiUrl}.
 */
export function getNativeApiOrigin(): string {
  const override = readEnvBaseUrl();
  return stripTrailingSlash(override || PROD_API_ORIGIN);
}

/**
 * Convert a relative API path into the URL fetch() should hit.
 *
 * Rules:
 *   - Absolute URLs (http://… / https://…) are returned unchanged.
 *   - On web, relative paths are returned unchanged — fetch resolves
 *     them against the page origin, the existing behavior.
 *   - On Capacitor native, relative paths are prefixed with the prod
 *     (or VITE_API_BASE_URL-overridden) origin.
 *
 * Always pass paths starting with `/`. A path missing the leading slash
 * is repaired so call sites that forget can't accidentally produce a
 * relative-to-current-page URL like `https://host/foo/api/bar`.
 */
export function resolveApiUrl(path: string): string {
  if (typeof path !== "string" || path.length === 0) return path;

  if (/^https?:\/\//i.test(path)) return path;

  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (!isNativePlatform()) return normalized;

  return `${getNativeApiOrigin()}${normalized}`;
}
