/**
 * MercyBlade Blue — Supabase Client (CANONICAL SINGLE OWNER)
 * Path: src/lib/supabaseClient.ts
 * Version: MB-BLUE-94.14.15 — 2025-12-25 (+0700)
 *
 * RULE (LOCKED):
 * - ONLY ONE createClient() in the entire app → this file.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || "").trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || "").trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
