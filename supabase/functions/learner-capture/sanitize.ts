// supabase/functions/learner-capture/sanitize.ts
//
// Track 2 — the PURE anonymization + sanitization core of the
// learner-capture trust boundary, split out of index.ts so it can be
// regression-tested without the Deno HTTP/Supabase shell.
//
// Everything here is dependency-free and URL-free: only Web Crypto
// (crypto.subtle), TextEncoder, and standard string ops — all available
// in both Deno (the edge runtime) and Node/jsdom (the vitest runner). The
// security-critical guarantee the tests lock: a raw user id is never
// stored (only its HMAC), and PII never survives into a free-text column.
//
// index.ts imports from here; behaviour is byte-identical to the inlined
// originals it replaced.

export const MAX_TEXT_LENGTH = 2000;
export const MAX_RULE_IDS = 32;

/** HMAC-SHA256(message, key) → 64-char lowercase hex. */
export async function hmacHex(message: string, key: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
  const bytes = new Uint8Array(sig);
  let out = "";
  for (let i = 0; i < bytes.length; i += 1) out += bytes[i].toString(16).padStart(2, "0");
  return out;
}

/**
 * Strip PII from free text before storage. Removes emails, UUIDs, URLs,
 * and 6+ digit runs (phone numbers / IDs). Conservative — when in doubt,
 * redact. Truncates to MAX_TEXT_LENGTH.
 */
export function scrubPii(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
    .replace(/\bhttps?:\/\/\S+/gi, "[redacted-url]")
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, "[redacted-id]")
    .replace(/\b\d{6,}\b/g, "[redacted-number]")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return null;
  return cleaned.slice(0, MAX_TEXT_LENGTH);
}

export function clampScore(n: unknown): number | null {
  if (typeof n !== "number" || !Number.isFinite(n)) return null;
  return Math.min(100, Math.max(0, Math.round(n)));
}

export function sanitizeRuleIds(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string")
    .map((v) => v.trim().slice(0, 80))
    .filter(Boolean)
    .slice(0, MAX_RULE_IDS);
}
