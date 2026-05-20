// src/lib/supabaseClient.ts
/**
 * MercyBlade Blue — Supabase Client (CANONICAL)
 *
 * RULE (LOCKED):
 * - ONLY browser/client createClient() in the app → this file. (SSR has a
 *   separate service-role client in src/server/host/renderer.ts that never
 *   ships to the browser bundle — that exception is intentional.)
 * - All browser-code imports must come from here.
 *
 * WHY THIS FILE MATTERS:
 * - Prevents “Signed out” UI desync caused by multiple clients or mismatched storage keys.
 * - Trims env vars to avoid apikey ending with %0A (newline) → REST/Realtime auth failures.
 * - Uses an environment-specific storageKey so LOCAL and PROD sessions never collide.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { captureRlsDenied } from "@/lib/monitoring/captureException";
import { instrumentSupabase } from "@/lib/monitoring/instrumentSupabase";

// ⚠️ IMPORTANT: env values can include trailing whitespace/newlines in deployments.
// We MUST trim to avoid apikey ending with %0A (newline) → Realtime fails + REST 403.
const rawSupabaseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? "").trim();
const rawSupabaseAnonKey = String(
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
).trim();

// Test-environment fallback. supabase-js's `createClient` throws
// "supabaseUrl is required" when either argument is empty, which would
// crash every test file that transitively imports this module — even
// tests that mock the client further down. We hand `createClient` an
// obviously-fake URL so the singleton can be constructed. Real prod
// behavior is preserved: the `console.warn` below still fires, and any
// actual Supabase call against the placeholder will fail loudly.
const FALLBACK_SUPABASE_URL = "https://placeholder.invalid.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY = "placeholder-anon-key-not-real";

const supabaseUrl = rawSupabaseUrl || FALLBACK_SUPABASE_URL;
const supabaseAnonKey = rawSupabaseAnonKey || FALLBACK_SUPABASE_ANON_KEY;

type EnvSnapshot = {
  supabaseUrl: string;
  projectId: string;
  storageKey: string;
  hasAnonKey: boolean;
  anonKeyPrefix: string;
  isDev: boolean;
};

type SessionResult = Awaited<ReturnType<SupabaseClient["auth"]["getSession"]>>;

type GetRoomFromDBResult = {
  entries: Record<string, unknown>[] | null;
  meta: Record<string, unknown> | null;
};

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

    if (u.hostname === "127.0.0.1" || u.hostname === "localhost") {
      return `local-${u.hostname}-${u.port || "80"}`;
    }

    const m = u.hostname.match(/^([a-z0-9-]+)\.supabase\.co$/i);
    if (m?.[1]) return m[1];

    return u.hostname;
  } catch {
    return "unknown";
  }
}

const projectId = deriveProjectId(supabaseUrl);
const storageKey = `mb-supabase-auth-${projectId}`;

const storage =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined"
    ? window.localStorage
    : undefined;

if (!rawSupabaseUrl || !rawSupabaseAnonKey) {
  // Warn loudly so a misconfigured prod deploy is obvious in logs,
  // even though the fallback values keep the module load alive.
  console.warn("[supabaseClient] Missing env vars", {
    supabaseUrl: !!rawSupabaseUrl,
    supabaseAnonKey: !!rawSupabaseAnonKey,
  });
} else if (/\s$/.test(String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""))) {
  console.warn(
    "[supabaseClient] VITE_SUPABASE_ANON_KEY had trailing whitespace; trimmed.",
  );
}

// Capacitor injects `window.Capacitor` at runtime in the native shell. Detect
// without importing `@capacitor/core` so this module stays test-safe (the
// vitest jsdom env can't resolve that package).
const isNativeShell =
  typeof window !== "undefined" &&
  Boolean(
    (window as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor
      ?.isNativePlatform?.(),
  );

// Create a custom Web Locks wrapper that serialises legitimate concurrent
// auth operations (PKCE code-verifier writes, session-token persistence)
// across tabs, but absorbs the AbortError thrown when a newer tab/client
// steals the lock. The steal is itself correct behaviour — the newer tab
// should take over. The older tab simply yields without propagating the
// AbortError up to the React ErrorBoundary.
function createAuthLock(): <R>(
  name: string,
  acquireTimeout: number,
  fn: () => Promise<R>,
) => Promise<R> {
  const noopLock = <R,>(
    _name: string,
    _acquireTimeout: number,
    fn: () => Promise<R>,
  ): Promise<R> => fn();

  // navigator.locks may be unavailable in older browsers, private-mode
  // restrictions, or some WebView contexts. Fall through to noop lock.
  if (
    typeof navigator === "undefined" ||
    typeof navigator.locks?.request !== "function"
  ) {
    return noopLock;
  }

  return <R,>(
    name: string,
    acquireTimeout: number,
    fn: () => Promise<R>,
  ): Promise<R> =>
    new Promise<R>((resolve, reject) => {
      navigator.locks.request(name, { mode: "exclusive", steal: false, ifAvailable: false }, (lock) => {
        if (lock === null) {
          // ifAvailable would return null — not our case, but defensive.
          resolve(fn());
          return new Promise<void>((r) => r());
        }
        return new Promise<void>((innerResolve) => {
          fn().then(resolve, reject).finally(() => innerResolve());
        });
      }).catch((err: unknown) => {
        // AbortError with "steal" = another tab/client legitimately took
        // over the lock. Resolve silently — do NOT reject. The steal is
        // correct behaviour. The older tab recovers by re-rendering; any
        // desynced auth state surfaces cleanly on the next user action.
        if (
          err instanceof DOMException &&
          err.name === "AbortError" &&
          err.message.includes("Lock broken by another request with the 'steal' option")
        ) {
          console.warn(
            "[supabaseClient] auth lock stolen by another client — silent recovery",
          );
          resolve(fn());
          return;
        }
        // Any other lock error propagates normally.
        reject(err);
      });
    });
}

const customAuthLock = createAuthLock();

// Tag every PostgREST 403 (RLS denial) so a Sentry alert can catch a
// silent get_admin_level / RLS-predicate regression (#578, #562). A 403
// is a RETURN value from supabase-js, never a thrown error — without
// this wrapper it reaches Sentry nowhere. Scoped to the PostgREST data
// plane (/rest/v1/): Storage and Auth 403s have different meanings and
// their own handling. captureRlsDenied is a no-op when Sentry is off.
function instrumentedFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  return fetch(input, init).then((res) => {
    if (res.status === 403) {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      if (url.includes("/rest/v1/")) {
        const table = url.split("/rest/v1/")[1]?.split(/[/?]/)[0] || "unknown";
        captureRlsDenied(table, init?.method ?? "GET");
      }
    }
    return res;
  });
}

// Only override supabase-js's fetch when a global fetch exists. In an
// environment without one, leave supabase-js to resolve its own fetch
// rather than handing it a wrapper that would throw — defensive, keeps
// the test/SSR paths unchanged.
const globalFetchOption =
  typeof fetch === "function" ? { fetch: instrumentedFetch } : undefined;

// instrumentSupabase mutates the client in place to wrap `.from()` and
// `.rpc()` with slow-query timing → Sentry. A no-op when the feature flag
// is off (test mode, or VITE_SUPABASE_QUERY_INSTRUMENTATION_ENABLED=false).
// See src/lib/monitoring/instrumentSupabase.ts.
export const supabase: SupabaseClient = instrumentSupabase(
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey,
      storage,
      flowType: "pkce",
      lock: customAuthLock,
    },
    ...(globalFetchOption ? { global: globalFetchOption } : {}),
  }),
);

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

export async function getRoomFromDB(
  roomId: string,
): Promise<GetRoomFromDBResult | null> {
  const [{ data: roomData, error: roomError }, { data: entryData, error: entryError }] =
    await Promise.all([
      supabase.from("rooms").select("*").eq("id", roomId).maybeSingle(),
      supabase
        .from("room_entries")
        .select("*")
        .eq("room_id", roomId)
        .order("index", { ascending: true }),
    ]);

  if (roomError) {
    throw roomError;
  }

  if (entryError) {
    throw entryError;
  }

  return {
    entries: Array.isArray(entryData)
      ? (entryData as Record<string, unknown>[])
      : null,
    meta:
      roomData && typeof roomData === "object"
        ? (roomData as Record<string, unknown>)
        : null,
  };
}

async function getJwtForDebug(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function getSessionForDebug(): Promise<SessionResult> {
  return await supabase.auth.getSession();
}

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