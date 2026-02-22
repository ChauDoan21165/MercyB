/**
 * MercyBlade Blue — Supabase Client (CANONICAL)
 *
 * RULE (LOCKED):
 * - ONLY ONE createClient() in the entire app → this file.
 * - All imports must come from here.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("[supabaseClient] Missing env vars", {
    supabaseUrl: !!supabaseUrl,
    supabaseAnonKey: !!supabaseAnonKey,
  });
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Debug hook (safe): lets you run auth commands in DevTools.
// NOTE: DevTools is JS, so use globalThis.__MB_SUPABASE__ (no TS casts).
try {
  (globalThis as any).__MB_SUPABASE__ = supabase;
  // eslint-disable-next-line no-console
  console.log("[MB] __MB_SUPABASE__ attached");
} catch {
  // ignore
}