/**
 * Supabase client factory for the smoke suite.
 *
 * Two flavours:
 *   - anonClient()    — anon-key JWT, same as a signed-out browser.
 *                       Specs use this indirectly through the Playwright
 *                       browser context; direct use is for health checks.
 *   - serviceClient() — service-role JWT. Bypasses RLS. Use sparingly, and
 *                       ONLY for fixture setup/teardown where the test
 *                       shape requires admin privileges (e.g. promoting
 *                       an admin, seeding a streak row out-of-band).
 *
 * Both return a lazy singleton — spec files can call these in beforeAll
 * without worrying about duplicate connections.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import {
  TEST_SUPABASE_ANON_KEY,
  TEST_SUPABASE_SERVICE_KEY,
  TEST_SUPABASE_URL,
  hasServiceKey,
  hasSupabaseTestCreds,
  requireEnv,
} from "./env";

let anon: SupabaseClient | null = null;
let service: SupabaseClient | null = null;

export function anonClient(): SupabaseClient {
  if (!hasSupabaseTestCreds()) {
    requireEnv("TEST_SUPABASE_URL", TEST_SUPABASE_URL);
    requireEnv("TEST_SUPABASE_ANON_KEY", TEST_SUPABASE_ANON_KEY);
  }
  if (!anon) {
    anon = createClient(TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return anon;
}

export function serviceClient(): SupabaseClient {
  requireEnv("TEST_SUPABASE_URL", TEST_SUPABASE_URL);
  requireEnv("TEST_SUPABASE_SERVICE_KEY", TEST_SUPABASE_SERVICE_KEY);
  if (!service) {
    service = createClient(TEST_SUPABASE_URL, TEST_SUPABASE_SERVICE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return service;
}

export { hasSupabaseTestCreds, hasServiceKey };

/**
 * Sign up a brand-new user through the real Supabase auth endpoint and
 * return the session tokens. Used by auth-and-placement.spec for the
 * new-user signup flow.
 */
export async function signUpUser(email: string, password: string) {
  const client = anonClient();
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

/**
 * Delete a test user (service role required). Best-effort cleanup in
 * afterAll hooks.
 */
export async function deleteUser(userId: string): Promise<void> {
  if (!hasServiceKey()) return; // silent no-op when we can't clean up
  const svc = serviceClient();
  await svc.auth.admin.deleteUser(userId);
}

/**
 * Read a profile row by user id via the service client (bypasses RLS).
 * Specs use this to assert side-effects without signing the user in.
 */
export async function fetchProfile(userId: string): Promise<Record<string, unknown> | null> {
  const svc = serviceClient();
  const { data, error } = await svc
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as Record<string, unknown> | null) ?? null;
}
