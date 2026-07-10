/**
 * Tier-3 prod synthetic learner — environment / credential access.
 *
 * SECURITY: this module reads credentials from the process environment ONLY.
 * No credential value is ever hard-coded, logged, or committed. The account and
 * these variables are provisioned by Chau as masked GitLab CI/CD variables on
 * the admin-host runner (see reports/prod-synthetic-learner-design.md §3). When
 * the vars are absent the runner SKIPS (never fails) so CI stays green until the
 * schedule is switched on with creds.
 *
 * Variable NAMES (values live only on the admin host):
 *   PROD_SYNTH_EMAIL           synthetic account email
 *   PROD_SYNTH_PASSWORD        synthetic account password
 *   PROD_SYNTH_SUPABASE_URL    prod Supabase URL (for the DB read-back, journey d)
 *   PROD_SYNTH_SUPABASE_ANON_KEY  prod anon key (public; used for the auth REST call)
 *   PROD_SYNTH_BASE_URL        prod web origin (default https://mercyblade.com)
 *   EXPECTED_DEPLOY_SHA        optional override for journey (f); else resolved
 *                              from the latest main pipeline at run start
 *   RESEND_ALERT_TOKEN         Resend API token for the failure-only alert email
 *   SYNTH_ALERT_TO             alert recipient (default admin@mercyblade.com)
 */

export const SYNTH_BASE_URL = process.env.PROD_SYNTH_BASE_URL ?? "https://mercyblade.com";
export const SYNTH_EMAIL = process.env.PROD_SYNTH_EMAIL ?? "";
export const SYNTH_PASSWORD = process.env.PROD_SYNTH_PASSWORD ?? "";
export const SYNTH_SUPABASE_URL = process.env.PROD_SYNTH_SUPABASE_URL ?? "";
export const SYNTH_SUPABASE_ANON_KEY = process.env.PROD_SYNTH_SUPABASE_ANON_KEY ?? "";
export const ALERT_TO = process.env.SYNTH_ALERT_TO ?? "admin@mercyblade.com";

/** True iff the synthetic account creds are present. Journeys skip (not fail)
 * otherwise — the same convention the rest of tests/e2e uses. */
export function hasSyntheticCreds(): boolean {
  return Boolean(SYNTH_EMAIL && SYNTH_PASSWORD && SYNTH_SUPABASE_URL && SYNTH_SUPABASE_ANON_KEY);
}

/** Redact anything credential-shaped from a string before it reaches a log,
 * artifact, or alert body. Belt-and-braces: we never log creds directly, but a
 * captured request URL or error could echo a token. */
export function redact(text: string): string {
  return text
    .replaceAll(SYNTH_PASSWORD || "\0no-pass\0", "***")
    .replaceAll(SYNTH_SUPABASE_ANON_KEY || "\0no-key\0", "***")
    .replace(/(apikey|authorization|access_token|password)=[^&\s"']+/gi, "$1=***")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, "Bearer ***");
}
