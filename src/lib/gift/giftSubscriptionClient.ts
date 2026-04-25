// src/lib/gift/giftSubscriptionClient.ts
//
// Step 9 (Monetization) — client surface for the peer-to-peer gift
// subscription flow. The matching schema lives in
// `supabase/migrations/20260425083000_gift_subscriptions.sql`.
//
// Generates 12-char unambiguous codes (no O/0/I/1/L/U/V — characters
// people misread on phones), inserts them as a purchaser, looks them
// up by code, and atomically redeems them by binding the recipient's
// user_id + redeemed_at. The redemption RLS policy refuses any UPDATE
// that targets an already-redeemed row, so racing redemptions on the
// same code resolve to "exactly one winner, the rest get not_found".
//
// IMPORTANT: this module does NOT touch billing/Stripe. Real payment
// hooks land in the daytime sender pass — the purchase form here
// inserts the gift row immediately so the rest of the flow can be
// exercised end-to-end. Production wiring marker: see PurchaseGiftForm
// for the TODO around Stripe checkout.

import { supabase } from "@/lib/supabaseClient";

const TABLE = "gift_subscriptions";

/** Length of every minted gift code. 12 chars × 26 = ~9.5e16 keyspace. */
export const GIFT_CODE_LENGTH = 12;

/** Allowed durations (months). Matches DB CHECK constraint. */
export const ALLOWED_DURATIONS = [1, 3, 6, 12] as const;
export type GiftDurationMonths = (typeof ALLOWED_DURATIONS)[number];

/** Personal-message char limit. Matches DB CHECK constraint. */
export const PERSONAL_MESSAGE_MAX = 280;

/**
 * Alphabet for generated codes — uppercase ASCII letters + digits with
 * the look-alike characters removed: O/0, I/1/L, U/V, B/8 are kept
 * apart by removing one of each pair.
 *
 * Avoid: O, 0, I, 1, L, U, V (each could be confused with another)
 * Keep:  A B C D E F G H J K M N P Q R S T W X Y Z 2 3 4 5 6 7 8 9
 */
const ALPHABET = "ABCDEFGHJKMNPQRSTWXYZ23456789";

export type GiftSubscriptionRow = {
  id: string;
  code: string;
  durationMonths: GiftDurationMonths;
  purchaserUserId: string | null;
  purchaserEmail: string | null;
  recipientEmail: string | null;
  recipientUserId: string | null;
  personalMessage: string | null;
  createdAt: string;
  redeemedAt: string | null;
  expiresAt: string;
};

/**
 * Generate a random gift code from the unambiguous alphabet. Pure
 * function exported so tests + the daytime Stripe webhook can use the
 * same generator.
 */
export function generateGiftCodeString(length: number = GIFT_CODE_LENGTH): string {
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
      out += ALPHABET[buf[i] % ALPHABET.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
  }
  return out;
}

export type GenerateGiftError =
  | "invalid_duration"
  | "message_too_long"
  | "no_unique_code"
  | "insert_failed";

/**
 * Generate + persist a gift code. Retries the random pick a few times
 * if the unique constraint hits (vanishingly rare given the keyspace,
 * but worth handling). Returns the inserted row on success.
 */
export async function generateGiftCode(
  purchaserId: string,
  durationMonths: number,
  recipientEmail: string,
  personalMessage: string | null,
  purchaserEmail?: string | null,
): Promise<{ row: GiftSubscriptionRow | null; error: GenerateGiftError | null }> {
  if (!isAllowedDuration(durationMonths)) {
    return { row: null, error: "invalid_duration" };
  }
  if (
    personalMessage !== null &&
    personalMessage !== undefined &&
    personalMessage.length > PERSONAL_MESSAGE_MAX
  ) {
    return { row: null, error: "message_too_long" };
  }

  const trimmedMessage =
    personalMessage && personalMessage.trim().length > 0
      ? personalMessage.trim()
      : null;
  const trimmedRecipient =
    recipientEmail && recipientEmail.trim().length > 0
      ? recipientEmail.trim().toLowerCase()
      : null;

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateGiftCodeString();
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        code,
        duration_months: durationMonths,
        purchaser_user_id: purchaserId,
        purchaser_email: purchaserEmail ?? null,
        recipient_email: trimmedRecipient,
        personal_message: trimmedMessage,
      })
      .select("*")
      .maybeSingle();

    if (!error && data) return { row: rowFromDb(data), error: null };

    const code23505 = (error as { code?: string } | null)?.code === "23505";
    if (code23505 || /unique/i.test(error?.message ?? "")) {
      // Unique-violation on the random code — retry with a new one.
      continue;
    }
    if (error) {
      console.warn("[giftSubscription] insert failed:", error.message);
      return { row: null, error: "insert_failed" };
    }
  }
  return { row: null, error: "no_unique_code" };
}

export type LookupGiftStatus =
  | "available"
  | "already_redeemed"
  | "expired"
  | "not_found";

export interface LookupGiftResult {
  status: LookupGiftStatus;
  row: GiftSubscriptionRow | null;
}

/**
 * Look up a gift code without redeeming it. Used by the recipient's
 * confirm screen to show duration + personal message before they
 * actually claim it. Returns "not_found" both for genuinely missing
 * codes and for any RLS error — don't leak which case it was.
 */
export async function lookupGiftCode(code: string): Promise<LookupGiftResult> {
  const trimmed = code.trim().toUpperCase();
  if (trimmed.length !== GIFT_CODE_LENGTH) {
    return { status: "not_found", row: null };
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("code", trimmed)
    .maybeSingle();

  if (error || !data) return { status: "not_found", row: null };

  const row = rowFromDb(data);
  const now = Date.now();
  if (row.redeemedAt) return { status: "already_redeemed", row };
  if (Date.parse(row.expiresAt) <= now) return { status: "expired", row };
  return { status: "available", row };
}

export type RedeemGiftError =
  | "not_found"
  | "already_redeemed"
  | "expired"
  | "update_failed";

/**
 * Atomically claim a gift code for the current user. The DB-side
 * redemption policy refuses any UPDATE that targets a row already
 * redeemed (redeemed_at NOT NULL) or expired, so concurrent
 * redemptions on the same code resolve to one winner.
 */
export async function redeemGiftCode(
  userId: string,
  code: string,
): Promise<{ row: GiftSubscriptionRow | null; error: RedeemGiftError | null }> {
  const trimmed = code.trim().toUpperCase();
  if (trimmed.length !== GIFT_CODE_LENGTH) {
    return { row: null, error: "not_found" };
  }

  // Pre-check for a friendlier error message; the actual race protection
  // is the DB-side RLS policy below.
  const lookup = await lookupGiftCode(trimmed);
  if (lookup.status === "already_redeemed") {
    return { row: null, error: "already_redeemed" };
  }
  if (lookup.status === "expired") return { row: null, error: "expired" };
  if (lookup.status === "not_found" || !lookup.row) {
    return { row: null, error: "not_found" };
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      recipient_user_id: userId,
      redeemed_at: now,
    })
    .eq("id", lookup.row.id)
    .is("redeemed_at", null)
    .select("*")
    .maybeSingle();

  if (error) {
    console.warn("[giftSubscription] redeem failed:", error.message);
    return { row: null, error: "update_failed" };
  }
  if (!data) {
    // RLS denied (redeemed in parallel) or row vanished.
    return { row: null, error: "already_redeemed" };
  }
  return { row: rowFromDb(data), error: null };
}

/**
 * Gifts the user purchased (any status — pending, redeemed, expired).
 * Order: newest first.
 */
export async function listMyPurchasedGifts(
  userId: string,
): Promise<GiftSubscriptionRow[]> {
  if (!userId) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("purchaser_user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[giftSubscription] listPurchased failed:", error.message);
    return [];
  }
  return Array.isArray(data) ? data.map(rowFromDb) : [];
}

/**
 * Gifts redeemed against the user's account. Order: most recently
 * redeemed first.
 */
export async function listMyRedeemedGifts(
  userId: string,
): Promise<GiftSubscriptionRow[]> {
  if (!userId) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("recipient_user_id", userId)
    .not("redeemed_at", "is", null)
    .order("redeemed_at", { ascending: false });
  if (error) {
    console.warn("[giftSubscription] listRedeemed failed:", error.message);
    return [];
  }
  return Array.isArray(data) ? data.map(rowFromDb) : [];
}

// ── helpers ───────────────────────────────────────────────────────────────

function isAllowedDuration(n: number): n is GiftDurationMonths {
  return ALLOWED_DURATIONS.includes(n as GiftDurationMonths);
}

function rowFromDb(raw: unknown): GiftSubscriptionRow {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: String(r.id ?? ""),
    code: String(r.code ?? ""),
    durationMonths: Number(r.duration_months ?? 0) as GiftDurationMonths,
    purchaserUserId: r.purchaser_user_id ? String(r.purchaser_user_id) : null,
    purchaserEmail: r.purchaser_email ? String(r.purchaser_email) : null,
    recipientEmail: r.recipient_email ? String(r.recipient_email) : null,
    recipientUserId: r.recipient_user_id ? String(r.recipient_user_id) : null,
    personalMessage: r.personal_message ? String(r.personal_message) : null,
    createdAt: String(r.created_at ?? ""),
    redeemedAt: r.redeemed_at ? String(r.redeemed_at) : null,
    expiresAt: String(r.expires_at ?? ""),
  };
}
