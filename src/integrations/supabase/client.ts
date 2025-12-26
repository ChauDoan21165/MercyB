/**
 * MercyBlade Blue — Supabase Client (RE-EXPORT ONLY)
 * Path: src/integrations/supabase/client.ts
 * Version: MB-BLUE-94.14.15 — 2025-12-25 (+0700)
 *
 * RULE (LOCKED):
 * - This file MUST NOT create a client.
 * - It must ONLY re-export the canonical client from src/lib/supabaseClient.ts
 *
 * IMPORTANT:
 * - Use RELATIVE import here to avoid any TS path-alias edge cases in re-export.
 */

export { supabase } from "../../lib/supabaseClient";
export { default } from "../../lib/supabaseClient";
