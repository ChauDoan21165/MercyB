// supabase/functions/_shared/familyInviteValidation.ts
//
// Pure validation + normalisation for the bulk-invite recipient list.
// Vitest-friendly; no Deno or Supabase imports.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS_REGEX = /^\+?\d{8,15}$/;

export const FAMILY_INVITE_TEMPLATE_KEYS = [
  "family",
  "friend",
  "colleague",
  "custom",
] as const;
export type FamilyInviteTemplateKey =
  (typeof FAMILY_INVITE_TEMPLATE_KEYS)[number];

export const FAMILY_INVITE_RELATIONSHIPS = [
  // Vietnamese-cultural addressing buckets. The bulk-send copy module
  // picks the right pronoun (chị/anh/em/cô/chú/bạn) from these.
  "older_sister", // chị
  "older_brother", // anh
  "younger", // em (sibling, younger)
  "aunt", // cô / dì
  "uncle", // chú / cậu / bác
  "parent", // mẹ / bố / má / ba
  "cousin",
  "friend",
  "colleague",
  "other",
] as const;
export type FamilyInviteRelationship =
  (typeof FAMILY_INVITE_RELATIONSHIPS)[number];

export interface RawRecipient {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  relationship?: unknown;
}

export interface NormalizedRecipient {
  name: string | null;
  email: string | null;
  phone: string | null;
  relationship: FamilyInviteRelationship | null;
}

export type RecipientValidationError =
  | "missing_contact"
  | "invalid_email"
  | "invalid_phone"
  | "name_too_long";

/**
 * Normalise + validate one recipient. Returns either the cleaned-up
 * row or a stable error code (per-row; the bulk handler decides what
 * to do with mixed batches).
 */
export function normalizeRecipient(
  raw: RawRecipient,
):
  | { ok: true; recipient: NormalizedRecipient }
  | { ok: false; error: RecipientValidationError } {
  const name = pickString(raw.name);
  const emailRaw = pickString(raw.email);
  const phoneRaw = pickString(raw.phone);
  const relationship = pickRelationship(raw.relationship);

  if (name && name.length > 100) {
    return { ok: false, error: "name_too_long" };
  }

  let email: string | null = null;
  if (emailRaw) {
    const trimmed = emailRaw.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmed)) {
      return { ok: false, error: "invalid_email" };
    }
    email = trimmed;
  }

  let phone: string | null = null;
  if (phoneRaw) {
    const compact = phoneRaw.replace(/[\s().-]/g, "");
    if (!PHONE_DIGITS_REGEX.test(compact)) {
      return { ok: false, error: "invalid_phone" };
    }
    phone = compact;
  }

  if (!email && !phone) {
    return { ok: false, error: "missing_contact" };
  }

  return {
    ok: true,
    recipient: {
      name: name ?? null,
      email,
      phone,
      relationship: relationship ?? null,
    },
  };
}

/**
 * Bulk validation. Returns:
 *   - `valid`: cleaned-up recipients, ready for insert
 *   - `errors`: per-input errors (with the original index so the UI
 *     can highlight the right row)
 *   - `dedupedFromInput`: how many duplicates were collapsed (same
 *     normalised email/phone within the batch)
 *
 * Per-recipient cap defaults to 25 to give some headroom over the
 * brief's 5-10-field UI; the rate limit (separate module) caps the
 * actual send burst at 20/hour.
 */
export interface BulkValidationResult {
  valid: NormalizedRecipient[];
  errors: Array<{ index: number; error: RecipientValidationError | "duplicate" | "batch_too_large" }>;
  dedupedFromInput: number;
}

export const MAX_BATCH_SIZE = 25;

export function normalizeBulk(
  raws: RawRecipient[],
): BulkValidationResult {
  const errors: BulkValidationResult["errors"] = [];
  const valid: NormalizedRecipient[] = [];
  const seenEmails = new Set<string>();
  const seenPhones = new Set<string>();
  let deduped = 0;

  if (raws.length > MAX_BATCH_SIZE) {
    // Mark the overflow indices as batch_too_large; still try to
    // process the first MAX_BATCH_SIZE so the user gets partial work.
    for (let i = MAX_BATCH_SIZE; i < raws.length; i++) {
      errors.push({ index: i, error: "batch_too_large" });
    }
  }

  const limit = Math.min(raws.length, MAX_BATCH_SIZE);
  for (let i = 0; i < limit; i++) {
    const result = normalizeRecipient(raws[i]);
    if (!result.ok) {
      errors.push({ index: i, error: result.error });
      continue;
    }
    const r = result.recipient;
    const dupKey = r.email ? `e:${r.email}` : r.phone ? `p:${r.phone}` : "";
    if (r.email && seenEmails.has(r.email)) {
      deduped += 1;
      errors.push({ index: i, error: "duplicate" });
      continue;
    }
    if (r.phone && seenPhones.has(r.phone)) {
      deduped += 1;
      errors.push({ index: i, error: "duplicate" });
      continue;
    }
    if (r.email) seenEmails.add(r.email);
    if (r.phone) seenPhones.add(r.phone);
    void dupKey;
    valid.push(r);
  }

  return { valid, errors, dedupedFromInput: deduped };
}

// ── helpers ─────────────────────────────────────────────────────────────

function pickString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function pickRelationship(
  value: unknown,
): FamilyInviteRelationship | null {
  if (typeof value !== "string") return null;
  return (FAMILY_INVITE_RELATIONSHIPS as readonly string[]).includes(value)
    ? (value as FamilyInviteRelationship)
    : null;
}

// ── 12-char invite token generator ───────────────────────────────────

const TOKEN_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // matches schema regex
export const INVITE_TOKEN_LENGTH = 12;

/**
 * Generate an unambiguous 12-char token. Used as the recipient's
 * single-use URL slug. Pure function — Web Crypto when available,
 * Math.random fallback for vitest under Node without crypto.
 */
export function generateInviteToken(length: number = INVITE_TOKEN_LENGTH): string {
  let out = "";
  const cryptoLike =
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.getRandomValues === "function"
      ? globalThis.crypto
      : null;

  if (cryptoLike) {
    const buf = new Uint32Array(length);
    cryptoLike.getRandomValues(buf);
    for (let i = 0; i < length; i++) {
      out += TOKEN_ALPHABET[buf[i] % TOKEN_ALPHABET.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      out += TOKEN_ALPHABET[Math.floor(Math.random() * TOKEN_ALPHABET.length)];
    }
  }
  return out;
}
