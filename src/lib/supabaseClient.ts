/**
 * MercyBlade Blue — Supabase Client (CANONICAL)
 *
 * RULE (LOCKED):
 * - ONLY ONE createClient() in the entire app → this file.
 * - All imports must come from here.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrlRaw = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKeyRaw = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// ✅ Trim to kill invisible newline/space bugs from .env/.copy-paste
const supabaseUrl = String(supabaseUrlRaw || "").trim();
const supabaseAnonKey = String(supabaseAnonKeyRaw || "").trim();

if (!supabaseUrl || !supabaseAnonKey) {
  // Keep existing warning vibe, but also prevent a “zombie client”
  console.warn("[supabaseClient] Missing env vars", {
    supabaseUrl: !!supabaseUrl,
    supabaseAnonKey: !!supabaseAnonKey,
  });

  // ✅ Hard fail: otherwise requests go out with an invalid apikey and you get 401 forever
  throw new Error("[supabaseClient] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

// ✅ Single real client (the only createClient in the app)
const _realSupabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ Export as let so tests can swap the client via live binding
export let supabase = _realSupabase;

/**
 * ✅ TEST HOOK (tiny + optional)
 * - Allows Vitest to inject a stubbed supabase client without creating a second createClient().
 * - Production code should never call this.
 */
export const __mock = {
  set(client: any) {
    supabase = client;
  },
  reset() {
    supabase = _realSupabase;
  },
};
