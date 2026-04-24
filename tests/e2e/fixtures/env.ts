/**
 * Read env vars that the smoke suite needs and fail loudly when they're
 * missing. Playwright doesn't ship with a built-in "skip when env absent"
 * pattern — we bake a small helper so every spec gets the same behaviour
 * and the same error message.
 *
 * Required:
 *   TEST_SUPABASE_URL          — points at a dedicated test project
 *   TEST_SUPABASE_ANON_KEY     — anon key for the test project
 *
 * Optional:
 *   TEST_SUPABASE_SERVICE_KEY  — service-role key (for fixture setup /
 *                                teardown that needs to bypass RLS, e.g.
 *                                seeding a streak row or promoting an
 *                                admin in admin-flag-control.spec).
 *   TEST_USER_EMAIL / TEST_USER_PASSWORD
 *                              — pre-seeded non-admin account for specs
 *                                that assume an existing user (grammar,
 *                                pronunciation, streak).
 *   TEST_ADMIN_EMAIL / TEST_ADMIN_PASSWORD
 *                              — pre-seeded level-9+ admin account for
 *                                admin-flag-control.spec.
 *   TEST_BASE_URL              — override the default 127.0.0.1:3107.
 *
 * All env vars are read at import time. Specs should call
 * `requireEnv("TEST_SUPABASE_URL")` from within a beforeAll if they need
 * a required var — that way tests that don't need a var can still run.
 */

export const BASE_URL =
  process.env.TEST_BASE_URL ?? "http://127.0.0.1:3107";

export const TEST_SUPABASE_URL = process.env.TEST_SUPABASE_URL ?? "";
export const TEST_SUPABASE_ANON_KEY = process.env.TEST_SUPABASE_ANON_KEY ?? "";
export const TEST_SUPABASE_SERVICE_KEY =
  process.env.TEST_SUPABASE_SERVICE_KEY ?? "";

export const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL ?? "";
export const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD ?? "";
export const TEST_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL ?? "";
export const TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD ?? "";

/**
 * Call from a `beforeAll` or the top of a test to short-circuit when the
 * caller hasn't supplied a required env var. Throws a descriptive error so
 * the Playwright reporter shows *why* a suite is skipping.
 */
export function requireEnv(name: string, value: string): string {
  if (!value) {
    throw new Error(
      `Missing required env var ${name}. ` +
        `Set it in .env.test.local or export it before running. ` +
        `See tests/e2e/README.md for the full list.`,
    );
  }
  return value;
}

/**
 * Lightweight predicate: true iff all required Supabase env vars are set.
 * Use this with `test.describe.skip(!hasSupabaseTestCreds(), ...)` to
 * mark suites as skipped rather than errored when creds are missing.
 */
export function hasSupabaseTestCreds(): boolean {
  return Boolean(TEST_SUPABASE_URL && TEST_SUPABASE_ANON_KEY);
}

export function hasTestUser(): boolean {
  return Boolean(TEST_USER_EMAIL && TEST_USER_PASSWORD);
}

export function hasTestAdmin(): boolean {
  return Boolean(TEST_ADMIN_EMAIL && TEST_ADMIN_PASSWORD);
}

export function hasServiceKey(): boolean {
  return Boolean(TEST_SUPABASE_SERVICE_KEY);
}

/** A unique email for brand-new-user signup specs. */
export function newUserEmail(prefix = "smoke"): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}+${Date.now()}.${random}@mercyblade-smoke.test`;
}
