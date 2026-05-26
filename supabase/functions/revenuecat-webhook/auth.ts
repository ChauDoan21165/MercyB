// supabase/functions/revenuecat-webhook/auth.ts
//
// Authorization for the RevenueCat webhook.
//
// RevenueCat does NOT sign its webhooks (no HMAC, no signature header —
// verified against the official docs + RevenueCat's own community forum;
// see reports/RECON-revenuecat-hmac.md and
// https://www.revenuecat.com/docs/integrations/webhooks). Its only
// webhook-security mechanism is a shared secret sent in the
// `Authorization` header, configured in
// RevenueCat Dashboard → Integrations → Webhook → Authorization header
// and mirrored into the Supabase secret `REVENUECAT_WEBHOOK_AUTH_TOKEN`.
//
// This module hardens that check in two ways over a plain `===`:
//   1. Constant-time comparison (no string-equality timing side-channel).
//   2. Multiple accepted tokens, so the secret can be rotated with zero
//      downtime ("<new>,<old>" during cutover, then "<new>").
//
// The constant-time primitive intentionally mirrors the proven shape in
// stripe-webhook/stripe-signature.ts:5-11 — do NOT re-roll it.

/**
 * Byte-wise constant-time equality. Returns immediately on a length
 * mismatch (length is not secret here — token length is not sensitive),
 * then compares every remaining byte with no data-dependent branch.
 * Identical in shape to stripe-webhook/stripe-signature.ts.
 */
export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;

  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a[i] ^ b[i];
  return out === 0;
}

/**
 * Parse the `REVENUECAT_WEBHOOK_AUTH_TOKEN` secret into a list of
 * accepted tokens. Comma- or newline-separated to support zero-downtime
 * rotation. Mirrors stripe-signature.ts `parseWebhookSecrets`.
 */
export function parseTokens(raw: string): string[] {
  return String(raw || "")
    .split(/[\n,]+/g)
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * True iff `presented` constant-time-matches AT LEAST ONE configured
 * token. Every configured token is checked (no early return) so the
 * work done does not reveal which — if any — token matched.
 *
 * @param presented the bearer value extracted from the Authorization
 *   header (already stripped of an optional "Bearer " prefix)
 * @param configured the result of `parseTokens(env)`
 */
export function isAuthorized(
  presented: string,
  configured: string[],
): boolean {
  const enc = new TextEncoder();
  const presentedBytes = enc.encode(presented);

  let ok = false;
  for (const token of configured) {
    // `|| ok` (not early-return) keeps the comparison count constant.
    ok = timingSafeEqual(presentedBytes, enc.encode(token)) || ok;
  }
  return ok;
}
