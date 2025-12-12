// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  // Vite style env
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  // Fallback for Next style
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseAnonKey =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL or anon key is missing. Check your .env and Vercel env vars."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
