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
// vitest jsdom env can't resolve that package). On native we swap supabase-js's
// default `navigator.locks` coordinator for a no-op: WKWebView's lock impl
// stalls under cold-boot contention and surfaces "Lock was stolen / Lock broken"
// AbortErrors. Single-tab native context means cross-tab coordination — the
// only thing the real lock provides — isn't needed. On web we leave the default
// untouched so multi-tab refresh stays coordinated.
const isNativeShell =
  typeof window !== "undefined" &&
  Boolean(
    (window as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor
      ?.isNativePlatform?.(),
  );

const noopAuthLock = <R,>(
  _name: string,
  _acquireTimeout: number,
  fn: () => Promise<R>,
): Promise<R> => fn();

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey,
      storage,
      flowType: "pkce",
      ...(isNativeShell ? { lock: noopAuthLock } : {}),
    },
  },
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