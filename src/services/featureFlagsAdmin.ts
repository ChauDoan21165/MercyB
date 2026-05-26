/**
 * Admin-only CRUD helpers for public.feature_flags.
 *
 * All calls run under the signed-in admin's JWT. Server-side RLS
 * (see 20260425010000_admin_feature_flags_rls.sql) enforces:
 *   - All authenticated users: SELECT feature_flags (added earlier,
 *     by 20260424010000_feature_flags_per_user_cohort.sql).
 *   - Admins (get_admin_level(auth.uid()) >= 9): INSERT / UPDATE
 *     feature_flags, plus cross-user SELECT on profiles for the
 *     email → uuid lookup.
 *
 * A non-admin client hitting the writer functions below will get a 403
 * from PostgREST — AdminRoute already blocks them at the router level,
 * but the RLS policy is the authoritative gate.
 */

import { supabase } from "@/lib/supabaseClient";

export type FeatureFlagRow = {
  id: string;
  flag_key: string;
  is_enabled: boolean;
  description: string | null;
  enabled_user_ids: string[];
  created_at: string;
  updated_at: string;
};

export type FeatureFlagPatch = {
  is_enabled?: boolean;
  description?: string | null;
  enabled_user_ids?: string[];
};

export type ProfileLookupResult = {
  id: string;
  email: string | null;
  username: string | null;
  display_name: string | null;
};

// A15b-fix-1: This module is the admin Feature-Flags UI — INSERT/UPDATE/full-
// row SELECT including enabled_user_ids. It intentionally stays on the BASE
// table, not feature_flags_public, because:
//   - listFeatureFlags needs the unmasked enabled_user_ids for the admin UI
//     to render the cohort editor.
//   - updateFeatureFlag is an UPDATE, which is not writable through the view.
// Admin RLS gates (get_admin_level >= 9 via the *_admin_insert / *_admin_update
// policies in 20260425010000_admin_feature_flags_rls.sql) are the enforcement
// boundary here, not the view.
export async function listFeatureFlags(): Promise<FeatureFlagRow[]> {
  const { data, error } = await supabase
    .from("feature_flags")
    .select("id, flag_key, is_enabled, description, enabled_user_ids, created_at, updated_at")
    .order("flag_key", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: String(row.id),
    flag_key: String(row.flag_key),
    is_enabled: Boolean(row.is_enabled),
    description: row.description ?? null,
    enabled_user_ids: Array.isArray(row.enabled_user_ids)
      ? (row.enabled_user_ids as string[])
      : [],
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  }));
}

export async function updateFeatureFlag(
  id: string,
  patch: FeatureFlagPatch,
): Promise<FeatureFlagRow> {
  const payload: Record<string, unknown> = {};
  if (patch.is_enabled !== undefined) payload.is_enabled = patch.is_enabled;
  if (patch.description !== undefined) payload.description = patch.description;
  if (patch.enabled_user_ids !== undefined) {
    payload.enabled_user_ids = patch.enabled_user_ids;
  }

  const { data, error } = await supabase
    .from("feature_flags")
    .update(payload)
    .eq("id", id)
    .select("id, flag_key, is_enabled, description, enabled_user_ids, created_at, updated_at")
    .single();
  if (error) throw error;
  const row = data as FeatureFlagRow;
  return {
    ...row,
    enabled_user_ids: Array.isArray(row.enabled_user_ids) ? row.enabled_user_ids : [],
  };
}

/**
 * Look up a user profile by email. Relies on the admin-scoped SELECT
 * overlay on `profiles` added in 20260425010000_admin_feature_flags_rls.sql.
 * A non-admin caller will get zero results (RLS filters their visible
 * set to their own row, which almost certainly won't match the typed
 * email).
 */
export async function lookupProfileByEmail(
  email: string,
): Promise<ProfileLookupResult | null> {
  const clean = email.trim().toLowerCase();
  if (!clean || !clean.includes("@")) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, username, display_name")
    .eq("email", clean)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    id: String((data as { id: string }).id),
    email: (data as { email: string | null }).email ?? null,
    username: (data as { username: string | null }).username ?? null,
    display_name: (data as { display_name: string | null }).display_name ?? null,
  };
}

/**
 * Add a user's UUID to a flag's cohort, idempotently.
 * Returns the updated cohort array.
 */
export function addToCohort(cohort: string[], userId: string): string[] {
  const clean = userId.trim();
  if (!clean) return cohort;
  if (cohort.includes(clean)) return cohort;
  return [...cohort, clean];
}

export function removeFromCohort(cohort: string[], userId: string): string[] {
  return cohort.filter((id) => id !== userId);
}
