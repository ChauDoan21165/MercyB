/**
 * Public API — key hashing + constant-time comparison.
 *
 * Storage rule: the raw key is shown to the developer **once** at
 * creation time. Only SHA-256 hex + an 8-char prefix land in the
 * database. Verification on every request:
 *
 *   incoming bearer  →  hashApiKey()  →  SELECT … WHERE key_hash = $1
 *
 * The constant-time compare guard is for defense-in-depth — Postgres
 * `=` on a TEXT column is already constant-time relative to attacker
 * input, but if a future caller does in-memory comparison (e.g. a
 * cache layer) we want the safe primitive at hand.
 *
 * Web-Crypto-only. Runs unchanged in Deno (Supabase edge functions),
 * Node 18+ (vitest), and modern browsers.
 */

/** Length of the random body of a generated key (post-prefix). */
const KEY_BODY_LENGTH = 40;
/** Visible prefix every key starts with. */
export const KEY_VISIBLE_PREFIX = "mb_";
/** First 8 chars of the raw key shown in UI lists. */
export const KEY_PREFIX_DISPLAY_LENGTH = 8;

/**
 * Hash a raw API key into the SHA-256 hex string we store in
 * `developer_api_keys.key_hash`.
 *
 * @param raw The bearer token as received from the client (or as
 *            generated and shown to the developer at creation time).
 * @returns 64-char lowercase hex string.
 */
export async function hashApiKey(raw: string): Promise<string> {
  const data = new TextEncoder().encode(raw);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bytesToHex(new Uint8Array(digest));
}

/**
 * Generate a random API key with a `mb_` prefix. Returns BOTH the
 * raw key (to show the developer once) and the storable shape:
 *   - keyHash:   SHA-256 hex
 *   - keyPrefix: first 8 chars of raw, for UI display + admin search
 *
 * Entropy: 40 bytes random hex = 320 bits, well above industry standard.
 */
export async function generateApiKey(): Promise<{
  raw: string;
  keyHash: string;
  keyPrefix: string;
}> {
  const bytes = new Uint8Array(KEY_BODY_LENGTH);
  crypto.getRandomValues(bytes);
  const body = bytesToHex(bytes);
  const raw = `${KEY_VISIBLE_PREFIX}${body}`;
  const keyHash = await hashApiKey(raw);
  const keyPrefix = raw.slice(0, KEY_PREFIX_DISPLAY_LENGTH);
  return { raw, keyHash, keyPrefix };
}

/**
 * Constant-time string equality. Falls back to a length-mismatch path
 * (one early return) but the per-char loop runs to completion using
 * XOR-OR accumulation — no early exit on first mismatch.
 *
 * Use this for any in-memory comparison of secrets. For database
 * lookups, equality on a text column already runs in constant time
 * relative to the attacker-controlled input.
 */
export function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * Extract the raw bearer token from an `Authorization: Bearer …` header.
 * Returns null when the header is missing/malformed/empty so the caller
 * can early-return a 401 without further validation.
 */
export function extractBearerToken(authHeader: string | null | undefined): string | null {
  if (!authHeader || typeof authHeader !== "string") return null;
  const trimmed = authHeader.trim();
  // Case-insensitive scheme match — RFC 7235 says "Bearer" is case-insensitive.
  const lower = trimmed.toLowerCase();
  if (!lower.startsWith("bearer ")) return null;
  const token = trimmed.slice(7).trim();
  return token.length > 0 ? token : null;
}

/** Helper: Uint8Array → lowercase hex string. */
function bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i += 1) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}
