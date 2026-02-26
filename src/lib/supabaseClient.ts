/**
 * MercyBlade Blue — Supabase Client (CANONICAL)
 *
 * RULE (LOCKED):
 * - ONLY ONE createClient() in the entire app → this file.
 * - All imports must come from here.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ⚠️ IMPORTANT: env values can include trailing whitespace/newlines in deployments.
// We MUST trim to avoid apikey ending with %0A (newline) → Realtime fails + REST 403.
const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? "").trim();
const supabaseAnonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

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

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

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
};

// Debug hook (safe): lets you run auth commands in DevTools.
try {
  (globalThis as any).__MB_SUPABASE__ = supabase;
  console.log("[MB] __MB_SUPABASE__ attached");
} catch {
  // ignore
}