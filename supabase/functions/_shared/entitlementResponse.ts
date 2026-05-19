// supabase/functions/_shared/entitlementResponse.ts
//
// Pure projection helpers for the EntitlementResponse shape returned by
// `_shared/billing.ts:readEntitlementForUser`. Split out from billing.ts
// in B13 Phase 3 PR-B so it can be imported directly under vitest —
// billing.ts itself has a top-level esm.sh import (`createClient` from
// supabase-js) that the default ESM loader rejects. Same discipline as
// `me-entitlement/entitlement.ts` (esm.sh-free pure) vs `index.ts`
// (Deno-only).
//
// Behavior is unchanged from billing.ts pre-split; billing.ts now
// re-exports `normalizeEntitlementStatus`, `toEntitlementResponse`,
// and the related types from here, so existing callers keep working.

import {
  deriveEntitlement,
  type EntitlementStatus as SharedEntitlementStatus,
} from "./entitlement.ts";

export type BillingProvider = "stripe" | "apple" | "google";
// EntitlementSource here is the BillingProvider subset because this
// projection persists/reads via the legacy `profiles.premium_source`
// column, which only carries stripe/apple/google. Gift entitlements
// live in `user_subscriptions` and flow through me-entitlement's
// fallback, not through this surface.
export type EntitlementSource = BillingProvider | null;
// EntitlementStatus is owned by `_shared/entitlement.ts` (B13 Phase 3 PR-A).
export type EntitlementStatus = SharedEntitlementStatus;

export type EntitlementResponse = {
  is_premium: boolean;
  source: EntitlementSource;
  status: EntitlementStatus;
  expires_at: string | null;
};

export function asNonEmptyStringOrNull(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Loose runtime guard for the `status` column read off the
 * `user_entitlements*` / `my_entitlements*` views. Unknown values
 * collapse to "inactive" — the projection's reader never crashes on a
 * stray Stripe-state string that the union doesn't recognize.
 */
export function normalizeEntitlementStatus(value: unknown): EntitlementStatus {
  const normalized = asNonEmptyStringOrNull(value)?.toLowerCase() ?? "inactive";

  switch (normalized) {
    case "active":
    case "trialing":
    case "grace_period":
    case "past_due":
    case "paused":
    case "expired":
    case "revoked":
    case "inactive":
      return normalized;
    default:
      return "inactive";
  }
}

/**
 * Project a persisted entitlement row (or `null` when no row exists)
 * into the EntitlementResponse shape returned to callers.
 *
 * B13 Phase 3 PR-B (R4 of four): `is_premium` flows through the shared
 * expiry-aware `deriveEntitlement`. Pre-PR-B this was a status-only
 * predicate; `expires_at` was read but never gated on, so an
 * `active`-but-past-expiry row returned `is_premium: true`. The
 * `status` string is preserved (not flipped to "expired") so
 * downstream consumers that discriminate on status see the same value
 * the persisted row holds.
 */
export function toEntitlementResponse(
  row: {
    source?: unknown;
    status?: unknown;
    expires_at?: unknown;
  } | null,
  now: Date | number = new Date(),
): EntitlementResponse {
  const sourceRaw = asNonEmptyStringOrNull(row?.source);
  const source: EntitlementSource =
    sourceRaw === "stripe" || sourceRaw === "apple" || sourceRaw === "google"
      ? sourceRaw
      : null;

  const status = normalizeEntitlementStatus(row?.status);
  const expires_at = asNonEmptyStringOrNull(row?.expires_at);

  const is_premium = deriveEntitlement(
    [{ status, expires_at, source }],
    now,
  ).is_premium;

  return {
    is_premium,
    source,
    status,
    expires_at,
  };
}
