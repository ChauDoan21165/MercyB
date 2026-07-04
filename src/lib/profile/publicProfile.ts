// src/lib/profile/publicProfile.ts
//
// Step 6 (Community) — client surface for public user profiles.
//
// Three things live here:
//   1. Validators for username + bio + country code. Pure functions so
//      tests can hit them without spinning up Supabase. Mirrors the DB
//      constraints so callers fail fast before round-tripping.
//   2. Read: getPublicProfile(username) — hits the SECURITY DEFINER
//      RPC `get_public_profile_by_username`. Returns null when the
//      username doesn't exist OR the profile is private. From the
//      caller's perspective those are indistinguishable on purpose
//      (don't leak existence).
//   3. Write: updateUsername / updateBio / updateProfileFields /
//      togglePublic — owner-only updates against the profiles row.
//      Validation runs client-side; the DB enforces uniqueness +
//      length on bio + ISO code on country as a backstop.

import { supabase } from "@/lib/supabaseClient";

/** Minimum username length matching DB constraint. */
export const USERNAME_MIN = 3;
/** Brief target — alphanumeric + underscore only, max 20. */
export const USERNAME_MAX = 20;
export const BIO_MAX = 280;
const USERNAME_REGEX = /^[A-Za-z0-9_]+$/;
const COUNTRY_REGEX = /^[A-Z]{2}$/;

export type UsernameValidationError =
  | "empty"
  | "too_short"
  | "too_long"
  | "invalid_chars";

export type BioValidationError = "too_long";

export type CountryValidationError = "invalid_format";

/**
 * Validate a username against the public-profile rule set:
 * 3–20 chars, alphanumeric + underscore only.
 * Returns null on success, an error code otherwise.
 */
export function validateUsername(raw: string): UsernameValidationError | null {
  const value = raw.trim();
  if (value.length === 0) return "empty";
  if (value.length < USERNAME_MIN) return "too_short";
  if (value.length > USERNAME_MAX) return "too_long";
  if (!USERNAME_REGEX.test(value)) return "invalid_chars";
  return null;
}

/**
 * Validate a bio against the 280-char public-profile cap. Empty / null
 * is allowed (the column is nullable). Returns null on success.
 */
export function validateBio(raw: string | null | undefined): BioValidationError | null {
  if (!raw) return null;
  if (raw.length > BIO_MAX) return "too_long";
  return null;
}

/**
 * Validate an ISO 3166-1 alpha-2 country code (e.g. "VN", "US"). Empty
 * / null is allowed. Returns null on success.
 */
export function validateCountry(
  raw: string | null | undefined,
): CountryValidationError | null {
  if (!raw) return null;
  if (!COUNTRY_REGEX.test(raw)) return "invalid_format";
  return null;
}

export interface PublicProfile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  country: string | null;
  avatar_url: string | null;
  learning_started_at: string | null;
  streak_current: number;
  streak_longest: number;
  total_xp: number;
  lessons_completed: number;
}

/**
 * Look up a public profile by username. Hits the SECURITY DEFINER RPC,
 * so this is safe to call from anon (logged-out) sessions.
 *
 * Returns null in three cases — kept indistinguishable to avoid
 * leaking which usernames are taken vs. which profiles are private:
 *   - username does not exist
 *   - profile exists but is_public is false
 *   - any unexpected error (logged via console.warn)
 */
export async function getPublicProfile(
  username: string,
): Promise<PublicProfile | null> {
  const trimmed = username.trim();
  if (trimmed.length === 0) return null;

  const { data, error } = await supabase.rpc("get_public_profile_by_username", {
    p_username: trimmed,
  });

  if (error) {
    console.warn("[publicProfile] RPC error", error);
    return null;
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;
  return toPublicProfile(row as PublicProfile);
}

function toPublicProfile(row: PublicProfile): PublicProfile {
  return {
    id: row.id,
    username: row.username,
    display_name: row.display_name,
    bio: row.bio,
    country: row.country,
    avatar_url: row.avatar_url,
    learning_started_at: row.learning_started_at,
    streak_current: row.streak_current,
    streak_longest: row.streak_longest,
    total_xp: row.total_xp,
    lessons_completed: row.lessons_completed,
  };
}

/**
 * Toggle the user's is_public flag. Owner-only via existing profiles
 * RLS update policy.
 */
export async function togglePublic(
  userId: string,
  isPublic: boolean,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("profiles")
    .update({ is_public: isPublic })
    .eq("id", userId);
  return { error: error?.message ?? null };
}

/**
 * Update the user's username. Validates first; surfaces the unique-
 * constraint violation as a `taken` error code so the UI can show a
 * dedicated message.
 */
export async function updateUsername(
  userId: string,
  rawUsername: string,
): Promise<{ error: UsernameValidationError | "taken" | "unknown" | null }> {
  const validation = validateUsername(rawUsername);
  if (validation) return { error: validation };

  const { error } = await supabase
    .from("profiles")
    .update({ username: rawUsername.trim() })
    .eq("id", userId);

  if (!error) return { error: null };
  // Postgres unique violation code = 23505. Supabase surfaces it as
  // error.code === '23505' OR by string match in the message.
  const code = (error as { code?: string }).code;
  if (code === "23505" || /duplicate key|unique/i.test(error.message)) {
    return { error: "taken" };
  }
  console.warn("[publicProfile] updateUsername error", error);
  return { error: "unknown" };
}

/**
 * Update bio. Empty string clears the field (saved as null).
 */
export async function updateBio(
  userId: string,
  rawBio: string,
): Promise<{ error: BioValidationError | "unknown" | null }> {
  const validation = validateBio(rawBio);
  if (validation) return { error: validation };

  const value = rawBio.trim().length === 0 ? null : rawBio;
  const { error } = await supabase
    .from("profiles")
    .update({ bio: value })
    .eq("id", userId);
  if (error) {
    console.warn("[publicProfile] updateBio error", error);
    return { error: "unknown" };
  }
  return { error: null };
}

export interface ProfileFieldUpdate {
  display_name?: string | null;
  bio?: string | null;
  country?: string | null;
  learning_started_at?: string | null;
}

/**
 * Multi-field update for the profile editor. Validates bio + country.
 */
export async function updateProfileFields(
  userId: string,
  fields: ProfileFieldUpdate,
): Promise<{ error: string | null }> {
  if (fields.bio !== undefined && validateBio(fields.bio) !== null) {
    return { error: "bio_too_long" };
  }
  if (fields.country !== undefined && validateCountry(fields.country) !== null) {
    return { error: "country_invalid" };
  }
  const { error } = await supabase
    .from("profiles")
    .update(fields)
    .eq("id", userId);
  return { error: error?.message ?? null };
}
