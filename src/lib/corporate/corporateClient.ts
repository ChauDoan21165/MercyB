/**
 * Corporate / school multi-seat client.
 *
 * Step 9 (Monetization). Provides the API surface the admin UI shell
 * uses to set up a corporate account, invite seats, redeem invites,
 * list members, and remove members.
 *
 * All Supabase access is concentrated in this file so the page
 * components stay declarative. Functions return discriminated
 * `{ ok: true, data } | { ok: false, error }` results so UI callers
 * can render targeted error copy without try/catch.
 *
 * Stripe product creation, sales, and the actual paid subscription
 * link are deliberately NOT here — that's a daytime sales-cycle move
 * tracked outside this PR. Until a stripe_subscription_id is attached,
 * accounts exist in the DB but don't grant entitlement.
 */

import { supabase } from "@/lib/supabaseClient";

export type CorporateOrganizationType =
  | "school"
  | "church"
  | "business"
  | "community"
  | "other";

export const CORPORATE_ORGANIZATION_TYPES: ReadonlyArray<CorporateOrganizationType> =
  ["school", "church", "business", "community", "other"] as const;

export const CORPORATE_MIN_SEAT_COUNT = 5;
export const CORPORATE_MAX_BULK_INVITES = 100;

export interface CorporateAccount {
  id: string;
  owner_user_id: string;
  organization_name: string;
  organization_type: CorporateOrganizationType | null;
  contact_email: string;
  contact_phone: string | null;
  country: string;
  stripe_subscription_id: string | null;
  seat_count: number;
  created_at: string;
  active: boolean;
}

export interface CorporateSeat {
  corporate_account_id: string;
  user_id: string;
  invited_by: string | null;
  joined_at: string;
}

export interface CorporateSeatInvite {
  id: string;
  corporate_account_id: string;
  invited_email: string | null;
  invite_code: string;
  expires_at: string;
  redeemed_by_user_id: string | null;
  redeemed_at: string | null;
  created_at: string;
}

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; code?: string };

export interface CreateCorporateAccountInput {
  organizationName: string;
  organizationType: CorporateOrganizationType;
  contactEmail: string;
  contactPhone?: string | null;
  country: string;
  seatCount: number;
}

// ──────────────────────────────────────────────────────────────────────
// Validation
// ──────────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Pure synchronous validator. Exposed so the form can run it before
 * hitting the network. Returns the first failing message, or null when
 * the input is acceptable.
 */
export function validateCreateCorporateAccountInput(
  input: CreateCorporateAccountInput,
): string | null {
  const orgName = (input.organizationName ?? "").trim();
  const contactEmail = (input.contactEmail ?? "").trim();
  const country = (input.country ?? "").trim();

  if (orgName.length === 0) {
    return "Organization name is required.";
  }
  if (orgName.length > 200) {
    return "Organization name must be 200 characters or fewer.";
  }
  if (!CORPORATE_ORGANIZATION_TYPES.includes(input.organizationType)) {
    return "Organization type is invalid.";
  }
  if (!EMAIL_RE.test(contactEmail)) {
    return "Contact email is not a valid email address.";
  }
  if (country.length === 0) {
    return "Country is required.";
  }
  if (
    !Number.isInteger(input.seatCount) ||
    input.seatCount < CORPORATE_MIN_SEAT_COUNT
  ) {
    return `Seat count must be an integer ≥ ${CORPORATE_MIN_SEAT_COUNT}.`;
  }
  return null;
}

/**
 * CSV bulk parser for the "invite many seats" form. Accepts:
 *   - newline-separated emails
 *   - comma-separated emails (single line OK)
 *   - mixed, with whitespace and trailing commas tolerated
 *
 * Pure: no I/O. Returns deduped, lower-cased, valid emails plus a
 * separate list of rejections so the UI can show "skipped 3 invalid
 * rows: foo@, bar, baz@x".
 */
export function parseBulkEmails(
  raw: string,
  limit: number = CORPORATE_MAX_BULK_INVITES,
): { valid: string[]; invalid: string[]; truncated: boolean } {
  const tokens = String(raw ?? "")
    .split(/[\s,;]+/)
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 0);

  const valid: string[] = [];
  const invalid: string[] = [];
  const seen = new Set<string>();

  for (const tok of tokens) {
    if (EMAIL_RE.test(tok)) {
      if (!seen.has(tok)) {
        seen.add(tok);
        valid.push(tok);
      }
    } else {
      invalid.push(tok);
    }
  }

  const truncated = valid.length > limit;
  return {
    valid: truncated ? valid.slice(0, limit) : valid,
    invalid,
    truncated,
  };
}

// ──────────────────────────────────────────────────────────────────────
// Invite-code generation (8-char alphanumeric, I/O/0/1 stripped)
// ──────────────────────────────────────────────────────────────────────

const INVITE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/**
 * Generate an 8-char invite code matching the DB CHECK
 * `^[A-HJ-NP-Z2-9]{8}$`. Uses crypto.getRandomValues when available,
 * falling back to Math.random for SSR / Node-without-crypto.
 */
export function generateInviteCode(): string {
  const N = 8;
  const out: string[] = [];
  const cryptoApi: { getRandomValues?: (a: Uint8Array) => Uint8Array } | undefined =
    typeof globalThis !== "undefined"
      ? (globalThis as unknown as {
          crypto?: { getRandomValues?: (a: Uint8Array) => Uint8Array };
        }).crypto
      : undefined;

  if (cryptoApi?.getRandomValues) {
    const buf = new Uint8Array(N);
    cryptoApi.getRandomValues(buf);
    for (let i = 0; i < N; i++) {
      out.push(INVITE_ALPHABET[buf[i] % INVITE_ALPHABET.length]);
    }
  } else {
    for (let i = 0; i < N; i++) {
      out.push(
        INVITE_ALPHABET[Math.floor(Math.random() * INVITE_ALPHABET.length)],
      );
    }
  }
  return out.join("");
}

// ──────────────────────────────────────────────────────────────────────
// Owner / admin operations
// ──────────────────────────────────────────────────────────────────────

export async function createCorporateAccount(
  adminUserId: string,
  input: CreateCorporateAccountInput,
): Promise<Result<CorporateAccount>> {
  if (!adminUserId) {
    return { ok: false, error: "Authentication required.", code: "AUTH_REQUIRED" };
  }
  const validation = validateCreateCorporateAccountInput(input);
  if (validation) {
    return { ok: false, error: validation, code: "VALIDATION" };
  }

  const row = {
    owner_user_id: adminUserId,
    organization_name: input.organizationName.trim(),
    organization_type: input.organizationType,
    contact_email: input.contactEmail.trim(),
    contact_phone:
      input.contactPhone && input.contactPhone.trim().length > 0
        ? input.contactPhone.trim()
        : null,
    country: input.country.trim(),
    seat_count: input.seatCount,
  };

  const { data, error } = await supabase
    .from("corporate_accounts")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    return { ok: false, error: error.message, code: error.code ?? undefined };
  }
  return { ok: true, data: data as CorporateAccount };
}

/**
 * Mint a fresh invite for an email and persist it to the DB. The
 * caller is the corporate-account owner; RLS enforces that.
 */
export async function inviteSeat(
  corporateAccountId: string,
  email: string,
): Promise<Result<CorporateSeatInvite>> {
  if (!corporateAccountId) {
    return { ok: false, error: "Corporate account id required.", code: "VALIDATION" };
  }
  const cleaned = String(email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(cleaned)) {
    return { ok: false, error: "Invalid email address.", code: "VALIDATION" };
  }

  const row = {
    corporate_account_id: corporateAccountId,
    invited_email: cleaned,
    invite_code: generateInviteCode(),
  };
  const { data, error } = await supabase
    .from("corporate_seat_invites")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    return { ok: false, error: error.message, code: error.code ?? undefined };
  }
  return { ok: true, data: data as CorporateSeatInvite };
}

/**
 * Bulk-invite — mints one invite per email. Stops at
 * CORPORATE_MAX_BULK_INVITES; surface partial results so the UI can
 * tell the admin "10 of 12 sent". The CSV parsing happens client-side
 * via `parseBulkEmails`; this function trusts its `emails` arg has
 * already been deduped + validated.
 */
export async function inviteSeatsBulk(
  corporateAccountId: string,
  emails: ReadonlyArray<string>,
): Promise<Result<{ created: CorporateSeatInvite[]; failed: string[] }>> {
  if (!corporateAccountId) {
    return { ok: false, error: "Corporate account id required.", code: "VALIDATION" };
  }
  const slice = emails.slice(0, CORPORATE_MAX_BULK_INVITES);
  const created: CorporateSeatInvite[] = [];
  const failed: string[] = [];

  for (const email of slice) {
    const result = await inviteSeat(corporateAccountId, email);
    if (result.ok) {
      created.push(result.data);
    } else {
      failed.push(email);
    }
  }
  return { ok: true, data: { created, failed } };
}

/**
 * Redeem an invite as the currently-authenticated learner. Calls the
 * DB SECURITY DEFINER function `corporate_seat_redeem_invite`.
 *
 * Note: `userId` is accepted for API symmetry with the rest of this
 * module, but the RPC binds to `auth.uid()` server-side. The arg is
 * validated here so the UI can fail fast on missing auth.
 */
export async function redeemSeatInvite(
  inviteCode: string,
  userId: string,
): Promise<Result<{ corporateAccountId: string }>> {
  if (!userId) {
    return { ok: false, error: "Authentication required.", code: "AUTH_REQUIRED" };
  }
  const code = String(inviteCode ?? "").trim().toUpperCase();
  if (!/^[A-HJ-NP-Z2-9]{8}$/.test(code)) {
    return {
      ok: false,
      error: "Invite code must be 8 letters/numbers (no I, O, 0, 1).",
      code: "VALIDATION",
    };
  }

  const { data, error } = await supabase.rpc("corporate_seat_redeem_invite", {
    p_code: code,
  });
  if (error) {
    return { ok: false, error: error.message, code: error.code ?? undefined };
  }
  return { ok: true, data: { corporateAccountId: String(data ?? "") } };
}

export async function listSeats(
  corporateAccountId: string,
): Promise<Result<CorporateSeat[]>> {
  if (!corporateAccountId) {
    return { ok: false, error: "Corporate account id required.", code: "VALIDATION" };
  }
  const { data, error } = await supabase
    .from("corporate_seats")
    .select("*")
    .eq("corporate_account_id", corporateAccountId)
    .order("joined_at", { ascending: true });

  if (error) {
    return { ok: false, error: error.message, code: error.code ?? undefined };
  }
  return { ok: true, data: (data ?? []) as CorporateSeat[] };
}

/**
 * Admin removes a seat. RLS enforces that the caller is the corporate
 * account owner — the seat-holder themselves can also self-leave via
 * the same delete policy, but `removeSeat` exists as the admin-side
 * surface and is what the dashboard's "remove" button calls.
 */
export async function removeSeat(
  corporateAccountId: string,
  userId: string,
): Promise<Result<{ removed: true }>> {
  if (!corporateAccountId || !userId) {
    return { ok: false, error: "Account and user ids are required.", code: "VALIDATION" };
  }
  const { error } = await supabase
    .from("corporate_seats")
    .delete()
    .eq("corporate_account_id", corporateAccountId)
    .eq("user_id", userId);
  if (error) {
    return { ok: false, error: error.message, code: error.code ?? undefined };
  }
  return { ok: true, data: { removed: true } };
}

/**
 * Read the corporate account the current admin owns (or null if none).
 * Used by the dashboard page to decide whether to show setup vs. manage.
 */
export async function getOwnedCorporateAccount(
  ownerUserId: string,
): Promise<Result<CorporateAccount | null>> {
  if (!ownerUserId) {
    return { ok: false, error: "Authentication required.", code: "AUTH_REQUIRED" };
  }
  const { data, error } = await supabase
    .from("corporate_accounts")
    .select("*")
    .eq("owner_user_id", ownerUserId)
    .eq("active", true)
    .maybeSingle();
  if (error) {
    return { ok: false, error: error.message, code: error.code ?? undefined };
  }
  return { ok: true, data: (data as CorporateAccount | null) ?? null };
}
