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
const supabaseAnonKey = String(
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
).trim();

type EnvSnapshot = {
  supabaseUrl: string;
  projectId: string;
  storageKey: string;
  hasAnonKey: boolean;
  anonKeyPrefix: string;
  isDev: boolean;
};

type SessionResult = Awaited<ReturnType<SupabaseClient["auth"]["getSession"]>>;

declare global {
  /* eslint-disable no-var -- TypeScript ambient globals must use `var` here. */
  var __MB_SUPABASE__: SupabaseClient | undefined;
  var __MB_ENV__: (() => EnvSnapshot) | undefined;
  var __MB_JWT__: (() => Promise<string | null>) | undefined;
  var __MB_SESSION__: (() => Promise<SessionResult>) | undefined;
  /* eslint-enable no-var */

  interface Window {
    __MB_SUPABASE__?: SupabaseClient;
    __MB_ENV__?: () => EnvSnapshot;
    __MB_JWT__?: () => Promise<string | null>;
    __MB_SESSION__?: () => Promise<SessionResult>;
  }
}

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
} else if (/\s$/.test(String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""))) {
  // Extra debug signal for the exact bug you hit (%0A)
  console.warn(
    "[supabaseClient] VITE_SUPABASE_ANON_KEY had trailing whitespace; trimmed.",
  );
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
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
  },
);

/**
 * Optional: quick sanity helper for debugging UI auth-state issues.
 * Call in DevTools: window.__MB_ENV__?.()
 */
function getEnvSnapshot(): EnvSnapshot {
  return {
    supabaseUrl,
    projectId,
    storageKey,
    hasAnonKey: !!supabaseAnonKey,
    anonKeyPrefix: supabaseAnonKey ? `${supabaseAnonKey.slice(0, 18)}…` : "",
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

async function getJwtForDebug(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function getSessionForDebug(): Promise<SessionResult> {
  return await supabase.auth.getSession();
}

// Debug hooks (DEV only): lets you run auth commands in DevTools.
if (import.meta.env.DEV) {
  try {
    globalThis.__MB_SUPABASE__ = supabase;
    globalThis.__MB_ENV__ = getEnvSnapshot;
    globalThis.__MB_JWT__ = getJwtForDebug;
    globalThis.__MB_SESSION__ = getSessionForDebug;

    if (typeof window !== "undefined") {
      window.__MB_SUPABASE__ = supabase;
      window.__MB_ENV__ = getEnvSnapshot;
      window.__MB_JWT__ = getJwtForDebug;
      window.__MB_SESSION__ = getSessionForDebug;
    }

    console.log("[MB] Debug hooks attached", {
      ...getEnvSnapshot(),
      devtools: [
        "window.__MB_SUPABASE__",
        "window.__MB_ENV__?.()",
        "await window.__MB_JWT__?.()",
        "await window.__MB_SESSION__?.()",
      ],
    });
  } catch {
    // ignore
  }
}