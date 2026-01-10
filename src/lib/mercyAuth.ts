// FILE: src/lib/mercyAuth.ts
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const mercyCoreUrl = String(import.meta.env.VITE_MERCY_CORE_SUPABASE_URL ?? "").trim();
const mercyCoreAnon = String(import.meta.env.VITE_MERCY_CORE_SUPABASE_ANON_KEY ?? "").trim();
const mercyLoginUrl = String(import.meta.env.VITE_MERCY_LOGIN_URL ?? "").trim();

/**
 * IMPORTANT:
 * createClient() throws "supabaseUrl is required" if mercyCoreUrl is empty.
 * We must NOT create the client until env is present.
 *
 * Keep best-effort posture: never throw from app paths; just return null + warn.
 */

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (_client) return _client;

  if (!mercyCoreUrl || !mercyCoreAnon) {
    // eslint-disable-next-line no-console
    console.warn("[mercyAuth] Missing Mercy Core envs. Check .env.local and restart Vite.", {
      hasUrl: Boolean(mercyCoreUrl),
      hasAnon: Boolean(mercyCoreAnon),
    });
    return null;
  }

  _client = createClient(mercyCoreUrl, mercyCoreAnon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return _client;
}

// NOTE: Keep export name stable for existing imports.
// It may be null until env is loaded correctly.
export const mercyAuth: SupabaseClient | null = getClient();

export function redirectToMercyLogin(returnTo: string) {
  if (!mercyLoginUrl) {
    // best-effort: do not throw and do not block UI
    // eslint-disable-next-line no-console
    console.warn("[mercyAuth] Missing VITE_MERCY_LOGIN_URL; cannot redirect.");
    return;
  }
  const url = `${mercyLoginUrl}?returnTo=${encodeURIComponent(returnTo)}`;
  window.location.assign(url);
}

export async function getMercyUserId(): Promise<string | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const { data, error } = await client.auth.getSession();
    if (error) return null;
    return data.session?.user?.id ?? null;
  } catch {
    return null;
  }
}
