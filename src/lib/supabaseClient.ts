// src/lib/supabaseClient.ts

import { createClient } from "@supabase/supabase-js";

/**
 * Support both Vite and Next.js environment variables.
 * This allows Mercy Blade to run the same codebase everywhere
 * without breaking when switching hosting providers.
 */

const supabaseUrl =
  // Vite:
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env?.VITE_SUPABASE_URL) ||
  // Next.js / Vercel:
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseAnonKey =
  // Vite:
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  // Next.js:
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Safety check – fail loudly if environment variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables.");
  console.error("supabaseUrl =", supabaseUrl);
  console.error("supabaseAnonKey =", supabaseAnonKey);
  throw new Error(
    "Supabase URL or anon key is missing. Check your .env.local and Vercel project environment variables."
  );
}

// Create the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
