// supabase/functions/me-entitlement/entitlement.ts
//
// B13 Phase 3 PR-B: this module is now a thin compatibility wrapper over
// `supabase/functions/_shared/entitlement.ts` (the single source of truth
// for status + expiry derivation). The original copy of the derivation
// logic lived here; PR-A extracted it; PR-B repoints index.ts (R1) at
// the shared module via `normalizeEntitlement(rows, now)`.
//
// What stays in this file:
//   - `computeTrialStatus` + `TRIAL_DAYS` + `GRANDFATHER_CUTOFF_ISO` —
//     free-tier trial-window logic, NOT entitlement-derive logic. It's
//     time-based (created_at + 3d) and orthogonal to expiry-aware
//     subscription status; rightfully me-entitlement-local.
//   - `toIsoString` / `asNonEmptyString` — used by index.ts for the
//     gift-fallback expiry coercion. The shared module's equivalents
//     are private; rather than expand the shared API, we keep these
//     identical-behavior local copies to minimize the PR-B diff there.
//
// Everything else re-exports from `_shared/entitlement.ts`, preserving
// the existing API surface (`normalizeStatus`, `normalizeSource`,
// `getExpiresAt`, `compareRows`, `statusRank`, `isPremiumStatus`,
// `normalizeEntitlement`, types `CanonicalStatus` / `CanonicalSource` /
// `SubscriptionRow`) so callers — including the existing test suite —
// keep working with their current call signatures.
//
// The only deliberate behavior change is that `normalizeEntitlement`
// (R1's read surface) now routes `is_premium` through `deriveEntitlement`,
// which applies the expiry check. An "active" row with a past expiry
// stops granting premium. That is the B13 fix. The status STRING
// produced by `normalizeStatus` is unchanged for non-expired inputs
// (parity with the previous implementation, including the existing
// `canceled + future expiry ⇒ active` rule).

import {
  compareRows as sharedCompareRows,
  deriveEntitlement,
  type EntitlementInput,
  ENTITLING_STATUSES,
  type EntitlementSnapshot,
  type EntitlementSource,
  type EntitlementStatus,
  getExpiresAt as sharedGetExpiresAt,
  normalizeSource as sharedNormalizeSource,
  normalizeStatus as sharedNormalizeStatus,
  statusRank as sharedStatusRank,
} from "../_shared/entitlement.ts";

export type CanonicalSource = EntitlementSource;
export type CanonicalStatus = EntitlementStatus;
export type SubscriptionRow = EntitlementInput;

export function asNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export function toIsoString(value: unknown): string | null {
  const raw = asNonEmptyString(value);
  if (!raw) return null;

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function getExpiresAt(row: SubscriptionRow): string | null {
  return sharedGetExpiresAt(row);
}

export function normalizeSource(row: SubscriptionRow): CanonicalSource {
  return sharedNormalizeSource(row);
}

// Back-compat overload: existing call sites (and the legacy test suite)
// call `normalizeStatus(row)` without a `nowMs` argument. Default to the
// process clock — identical to the original behavior. New call sites
// should pass `nowMs` explicitly per the shared module's contract.
export function normalizeStatus(
  row: SubscriptionRow,
  nowMs: number = Date.now(),
): CanonicalStatus {
  return sharedNormalizeStatus(row, nowMs);
}

export function isPremiumStatus(status: CanonicalStatus): boolean {
  return ENTITLING_STATUSES.has(status);
}

export function statusRank(status: CanonicalStatus): number {
  return sharedStatusRank(status);
}

// Back-compat overload: legacy callers compare without a `nowMs` argument
// (`rows.sort(compareRows)`). Default to the process clock to preserve
// that surface; the only branch that consults `nowMs` is the
// canceled/default expiry-aware status mapping.
export function compareRows(
  a: SubscriptionRow,
  b: SubscriptionRow,
  nowMs: number = Date.now(),
): number {
  return sharedCompareRows(a, b, nowMs);
}

/**
 * Reduce N subscription rows to a single expiry-aware entitlement
 * projection. The persisted-surface fields (`is_premium`, `source`,
 * `status`, `expires_at`) match the existing me-entitlement contract;
 * the only behavioral delta vs main is that `is_premium` now requires
 * the row's expiry to be in the future (B13 Phase 3 PR-B).
 *
 * `now` is optional for back-compat with code that doesn't (yet) thread
 * a clock; index.ts threads `new Date()` explicitly post-PR-B.
 */
export function normalizeEntitlement(
  rows: SubscriptionRow[],
  now: Date | number = new Date(),
): EntitlementSnapshot {
  return deriveEntitlement(rows, now);
}

// ── Trial window (Phase 2) ───────────────────────────────────────────────────
// Free-tier users get exactly TRIAL_DAYS of access from profiles.created_at.
// Users created before GRANDFATHER_CUTOFF_ISO are grandfathered (no expiry).
// Premium users bypass the trial gate entirely.
export const TRIAL_DAYS = 3;
export const GRANDFATHER_CUTOFF_ISO = "2026-04-22T00:00:00Z";

export function computeTrialStatus(
  createdAtRaw: unknown,
  isPremium: boolean,
  trialExtensionDaysRaw: unknown = 0,
): { trial_expires_at: string | null; is_trial_expired: boolean } {
  if (isPremium) {
    return { trial_expires_at: null, is_trial_expired: false };
  }

  const createdAtIso = toIsoString(createdAtRaw);
  if (!createdAtIso) {
    // No profile row or unparseable created_at: fail open (grandfathered).
    // Avoids locking out legitimate users on data-integrity edge cases.
    return { trial_expires_at: null, is_trial_expired: false };
  }

  const createdAtMs = new Date(createdAtIso).getTime();
  const cutoffMs = new Date(GRANDFATHER_CUTOFF_ISO).getTime();

  if (createdAtMs < cutoffMs) {
    return { trial_expires_at: null, is_trial_expired: false };
  }

  // Referral rewards (and any future grants) accumulate in
  // profiles.trial_extension_days. Defensive clamp: ignore non-finite or
  // negative values rather than corrupting the formula.
  const extensionDaysNum = Number(trialExtensionDaysRaw);
  const extensionDays = Number.isFinite(extensionDaysNum) && extensionDaysNum > 0
    ? extensionDaysNum
    : 0;

  const totalTrialDays = TRIAL_DAYS + extensionDays;
  const trialEndsMs = createdAtMs + totalTrialDays * 24 * 60 * 60 * 1000;
  return {
    trial_expires_at: new Date(trialEndsMs).toISOString(),
    is_trial_expired: Date.now() > trialEndsMs,
  };
}
