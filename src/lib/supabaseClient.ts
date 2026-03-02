/**
 * MercyBlade Blue — Supabase Client (CANONICAL)
 *
 * RULE (LOCKED):
 * - ONLY ONE createClient() in the entire app → this file.
 * - All imports must come from here.
 *
 * WHY THIS FILE MATTERS:
 * - Prevents “Signed out” UI desync caused by multiple clients or mismatched storage keys.
 * - Trims env vars to avoid apikey ending with %0A (newline) → REST/Realtime auth failures.
 * - Uses an environment-specific storageKey so LOCAL and PROD sessions never collide.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ⚠️ IMPORTANT: env values can include trailing whitespace/newlines in deployments.
// We MUST trim to avoid apikey ending with %0A (newline) → Realtime fails + REST 403.
const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? "").trim();
const supabaseAnonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

/**
 * Derive a stable environment/project identifier for storageKey.
 * - Prod: https://<project-ref>.supabase.co  -> <project-ref>
 * - Local: http://127.0.0.1:54321          -> local-127.0.0.1-54321
 * - Fallback: unknown
 */
function deriveProjectId(urlRaw: string): string {
  try {
    const u = new URL(urlRaw);

    // Local dev (127.0.0.1 / localhost)
    if (u.hostname === "127.0.0.1" || u.hostname === "localhost") {
      return `local-${u.hostname}-${u.port || "80"}`;
    }

    // Supabase hosted: <ref>.supabase.co
    const m = u.hostname.match(/^([a-z0-9-]+)\.supabase\.co$/i);
    if (m?.[1]) return m[1];

    // Other hosted domains (fallback to hostname)
    return u.hostname;
  } catch {
    return "unknown";
  }
}

const projectId = deriveProjectId(supabaseUrl);

// Ensure LOCAL and PROD sessions never conflict in the same browser/profile.
const storageKey = `mb-supabase-auth-${projectId}`;

// Use localStorage when available; fall back safely in SSR/tests.
const storage =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined"
    ? window.localStorage
    : undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("[supabaseClient] Missing env vars", {
    supabaseUrl: !!supabaseUrl,
    supabaseAnonKey: !!supabaseAnonKey,
  });
} else {
  // Extra debug signal for the exact bug you hit (%0A)
  if (/\s$/.test(String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""))) {
    console.warn(
      "[supabaseClient] VITE_SUPABASE_ANON_KEY had trailing whitespace; trimmed."
    );
  }
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Keep sessions across refresh
    persistSession: true,

    // Keep tokens fresh
    autoRefreshToken: true,

    // Important for OAuth / magic link return URLs
    detectSessionInUrl: true,

    // Make auth storage deterministic across envs
    storageKey,
    storage,

    // Explicit SPA OAuth flow (safe default for modern Supabase)
    flowType: "pkce",
  },
});

/**
 * Optional: quick sanity helper for debugging UI auth-state issues.
 * Call in DevTools: window.__MB_ENV__()
 */
function getEnvSnapshot() {
  return {
    supabaseUrl,
    projectId,
    storageKey,
    hasAnonKey: !!supabaseAnonKey,
    anonKeyPrefix: supabaseAnonKey ? supabaseAnonKey.slice(0, 18) + "…" : "",
    isDev: !!import.meta.env.DEV,
  };
}

/**
 * TEST SUPPORT (SAFE)
 * Allows snapshot/unit tests to spy or override behavior without creating
 * a second Supabase client or breaking the single-client rule.
 *
 * Tests may import:
 *   import { __mock } from "@/lib/supabaseClient"
 */
export const __mock = {
  get client() {
    return supabase;
  },
  get env() {
    return getEnvSnapshot();
  },
};

// Debug hooks (DEV only): lets you run auth commands in DevTools.
if (import.meta.env.DEV) {
  try {
    (globalThis as any).__MB_SUPABASE__ = supabase;
    (globalThis as any).__MB_ENV__ = () => getEnvSnapshot();
    // eslint-disable-next-line no-console
    console.log("[MB] __MB_SUPABASE__ attached", getEnvSnapshot());
  } catch {
    // ignore
  }
}