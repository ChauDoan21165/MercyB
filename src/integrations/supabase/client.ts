// src/integrations/supabase/client.ts

import { createClient } from "@supabase/supabase-js";

/**
 * Support both Vite and Next.js style environment variables.
 * This lets Mercy Blade run locally, in Codespaces, and on Vercel
 * using the same client.
 */

const supabaseUrl =
  // Vite style:
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env?.VITE_SUPABASE_URL) ||
  // Next.js / Vercel style:
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseAnonKey =
  // Vite style:
  (typeof import.meta !== "undefined" &&
    (import.meta as any).env?.VITE_SUPABASE_ANON_KEY) ||
  // Next.js / Vercel style:
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Safety check – if keys are missing, stop the app loudly
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables.");
  console.error("supabaseUrl =", supabaseUrl);
  console.error("supabaseAnonKey =", supabaseAnonKey ? "[present]" : "undefined");
  throw new Error(
    "Supabase URL or anon key is missing. Check your .env file locally and your Vercel project environment variables."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
