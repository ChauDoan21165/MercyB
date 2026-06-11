// send-redeem-email/auth.ts
//
// Pure helpers for the two-layer relay guard:
//   1. isAuthorizedCaller — service-role key check (who can call us)
//   2. isKnownRecipient  — audience check (who we will mail)
//
// Both functions are stateless so they can be unit-tested without
// Deno globals or real Supabase calls.

/**
 * Strip the "Bearer " prefix from an Authorization header value and
 * return the raw token. Returns "" for null/empty input.
 */
export function extractBearerToken(header: string | null): string {
  return (header ?? "").replace(/^Bearer\s+/i, "").trim();
}

/**
 * Returns true only when a non-empty serviceRoleKey is known AND the
 * presented token matches it exactly. Fails closed: undefined key → false.
 */
export function isAuthorizedCaller(
  presentedToken: string,
  serviceRoleKey: string | null | undefined,
): boolean {
  return !!serviceRoleKey && presentedToken === serviceRoleKey;
}

/**
 * Returns true when `email` (case-insensitive) is found in the
 * provided user list. Used to verify the recipient is a real
 * MercyBlade user before we relay the send.
 *
 * Fails closed: empty/null users list → false.
 */
export function isKnownRecipient(
  email: string,
  users: ReadonlyArray<{ email?: string | null }>,
): boolean {
  if (!email || users.length === 0) return false;
  const lower = email.toLowerCase();
  return users.some((u) => (u.email ?? "").toLowerCase() === lower);
}
