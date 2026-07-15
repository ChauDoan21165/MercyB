// supabase/functions/_shared/entitlement.ts
//
// THE canonical entitlement derive for every edge-function reader on the
// money path. Pure, esm.sh-free, `now`-injectable — directly importable
// under vitest without a Deno or network shim, exactly like
// me-entitlement/entitlement.ts and stripe-webhook/idempotency.ts.
//
// PR-A scope (B13 Phase 3): ADDITIVE ONLY. This file ships with **zero
// importers** in app code. It exists so PR-B can repoint the four
// expiry-blind readers (R1 me-entitlement/entitlement.ts, R2
// get-subscription-status/index.ts, R3 stripe-webhook/core.ts, R4
// _shared/billing.ts) at one source of truth in a single atomic diff.
// Behavior change today is exactly zero; the regression risk of this PR
// is purely "did the new module compile and pass its own tests."
//
// The expiry rule encoded by `isEntitled` is the single behavioral
// generalization across PR-A + PR-B vs. main:
//
//   1. status ∉ {active, trialing, grace_period, past_due} → NOT entitled
//      (paused/expired/revoked/inactive were never premium).
//   2. expiresAtMs === null → entitled. Absent expiry stays entitling.
//      Lifetime / gift / null-period rows legitimately have no end; the
//      proven bug is "active + past expiry," NOT "absent expiry."
//      Introducing a lockout for null-expiry would flip legitimate users
//      — forbidden (restore-before-redesign).
//   3. else expiresAtMs > nowMs (strict). expiresAtMs === nowMs ⇒ expired.
//      No clock-skew grace; a tolerance is itself a policy decision and
//      would re-introduce the exact class of bug this PR closes.
//
// `normalizeStatus` is deliberately stricter for cancellation terminal
// states: canceled/cancelled/ended/terminated are non-entitling even when a
// stale period end remains in the future. Access comes from subscription
// status + current_period_end + provider; a canceled status means free.

export type EntitlementStatus =
  | "active"
  | "trialing"
  | "grace_period"
  | "past_due"
  | "paused"
  | "expired"
  | "revoked"
  | "inactive";

export type EntitlementSource =
  | "stripe"
  | "apple"
  | "google"
  | "gift_code"
  | null;

// Structurally accepts both a raw subscription row and a persisted
// projection row (profiles.premium_*). Readers pass either shape.
export type EntitlementInput = {
  status?: unknown;
  subscription_status?: unknown;
  state?: unknown;
  expires_at?: unknown;
  current_period_end?: unknown;
  current_period_end_at?: unknown;
  period_end?: unknown;
  ends_at?: unknown;
  expired_at?: unknown;
  updated_at?: unknown;
  created_at?: unknown;
  source?: unknown;
  provider?: unknown;
  platform?: unknown;
  store?: unknown;
  id?: unknown;
};

export type EntitlementSnapshot = {
  is_premium: boolean;
  status: EntitlementStatus;
  source: EntitlementSource;
  expires_at: string | null;
};

export const ENTITLING_STATUSES: ReadonlySet<EntitlementStatus> = new Set([
  "active",
  "trialing",
  "grace_period",
  "past_due",
]);

/* ── primitive helpers ────────────────────────────────────────────────── */

function asNonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function toIsoString(value: unknown): string | null {
  const raw = asNonEmptyString(value);
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toMs(value: unknown): number | null {
  const iso = toIsoString(value);
  return iso ? new Date(iso).getTime() : null;
}

function normalizeNowMs(now: Date | number): number {
  if (typeof now === "number") {
    return Number.isFinite(now) ? now : 0;
  }
  const ms = now.getTime();
  return Number.isFinite(ms) ? ms : 0;
}

/* ── public leaf helpers ──────────────────────────────────────────────── */

/** First ISO timestamp found across the canonical expiry field order. */
export function getExpiresAt(row: EntitlementInput): string | null {
  return (
    toIsoString(row.expires_at) ??
    toIsoString(row.current_period_end_at) ??
    toIsoString(row.current_period_end) ??
    toIsoString(row.period_end) ??
    toIsoString(row.ends_at) ??
    toIsoString(row.expired_at) ??
    null
  );
}

function getSortTimestamp(row: EntitlementInput): number {
  const candidates: unknown[] = [
    row.updated_at,
    row.current_period_end_at,
    row.current_period_end,
    row.expires_at,
    row.period_end,
    row.ends_at,
    row.created_at,
  ];
  for (const value of candidates) {
    const ms = toMs(value);
    if (ms !== null) return ms;
  }
  return 0;
}

export function normalizeSource(row: EntitlementInput): EntitlementSource {
  const raw = (
    asNonEmptyString(row.source) ??
    asNonEmptyString(row.provider) ??
    asNonEmptyString(row.platform) ??
    asNonEmptyString(row.store)
  )?.toLowerCase();

  switch (raw) {
    case "stripe":
      return "stripe";
    case "apple":
    case "app_store":
    case "appstore":
    case "apple_app_store":
      return "apple";
    case "google":
    case "google_play":
    case "googleplay":
    case "play_store":
    case "play":
    case "android":
      return "google";
    case "gift_code":
    case "gift":
    case "gift-code":
      return "gift_code";
    default:
      return null;
  }
}

/**
 * Map a raw row to a canonical EntitlementStatus string.
 *
 * `nowMs` is INJECTED rather than read from `Date.now()` — required for the
 * expiry-edge unit suite to be deterministic and mirrors the
 * recompute-injectable discipline (PR #580).
 */
export function normalizeStatus(
  row: EntitlementInput,
  nowMs: number
): EntitlementStatus {
  const raw = (
    asNonEmptyString(row.status) ??
    asNonEmptyString(row.subscription_status) ??
    asNonEmptyString(row.state)
  )?.toLowerCase();

  const expiresAt = getExpiresAt(row);
  const expiresAtMs = expiresAt ? new Date(expiresAt).getTime() : null;

  switch (raw) {
    case "active":
      return "active";
    case "trialing":
    case "trial":
      return "trialing";
    case "grace_period":
    case "grace":
    case "in_grace_period":
      return "grace_period";
    case "past_due":
    case "past-due":
    case "unpaid":
      return "past_due";
    case "paused":
    case "pause":
    case "on_hold":
      return "paused";
    case "revoked":
    case "refunded":
    case "refund":
    case "chargeback":
      return "revoked";
    case "expired":
      return "expired";
    case "inactive":
    case "incomplete":
    case "incomplete_expired":
      return "inactive";
    case "canceled":
    case "cancelled":
    case "ended":
    case "terminated":
      return "expired";
    default:
      if (expiresAtMs !== null && expiresAtMs <= nowMs) return "expired";
      return "inactive";
  }
}

/**
 * The single is_premium decision used by every reader after PR-B lands.
 *
 *   1. non-entitling status → false
 *   2. null expiry           → false  (malformed provider row / no period)
 *   3. expiresAtMs > nowMs   → true   (strict)
 *   4. otherwise             → false  (expiresAtMs === nowMs ⇒ expired)
 */
export function isEntitled(
  status: EntitlementStatus,
  expiresAtMs: number | null,
  nowMs: number
): boolean {
  if (!ENTITLING_STATUSES.has(status)) return false;
  if (expiresAtMs === null) return false;
  return expiresAtMs > nowMs;
}

/* ── winner selection (lifted from me-entitlement/entitlement.ts) ─────── */

export function statusRank(status: EntitlementStatus): number {
  switch (status) {
    case "active":
      return 70;
    case "trialing":
      return 60;
    case "grace_period":
      return 50;
    case "past_due":
      return 40;
    case "paused":
      return 30;
    case "expired":
      return 20;
    case "revoked":
      return 10;
    case "inactive":
    default:
      return 0;
  }
}

/**
 * Compare two rows for "best entitlement" ordering. Higher status rank
 * wins; ties broken by latest expiry, then latest sort timestamp, then
 * id (deterministic). Pure given the same `nowMs`.
 */
export function compareRows(
  a: EntitlementInput,
  b: EntitlementInput,
  nowMs: number
): number {
  const aStatus = normalizeStatus(a, nowMs);
  const bStatus = normalizeStatus(b, nowMs);

  const byStatus = statusRank(bStatus) - statusRank(aStatus);
  if (byStatus !== 0) return byStatus;

  const aExpiresMs = toMs(getExpiresAt(a)) ?? 0;
  const bExpiresMs = toMs(getExpiresAt(b)) ?? 0;
  if (bExpiresMs !== aExpiresMs) return bExpiresMs - aExpiresMs;

  const byTimestamp = getSortTimestamp(b) - getSortTimestamp(a);
  if (byTimestamp !== 0) return byTimestamp;

  const aId = String(a.id ?? "");
  const bId = String(b.id ?? "");
  return aId.localeCompare(bId);
}

/* ── the canonical derive ─────────────────────────────────────────────── */

/**
 * Reduce N rows to a single expiry-aware entitlement snapshot. Pure;
 * `now` is injected. Returns the inactive snapshot for an empty input.
 */
export function deriveEntitlement(
  rows: readonly EntitlementInput[],
  now: Date | number
): EntitlementSnapshot {
  const nowMs = normalizeNowMs(now);

  if (rows.length === 0) {
    return {
      is_premium: false,
      status: "inactive",
      source: null,
      expires_at: null,
    };
  }

  const best = [...rows].sort((a, b) => compareRows(a, b, nowMs))[0];

  const status = normalizeStatus(best, nowMs);
  const source = normalizeSource(best);
  const expiresAt = getExpiresAt(best);
  const expiresAtMs = expiresAt ? new Date(expiresAt).getTime() : null;

  return {
    is_premium: isEntitled(status, expiresAtMs, nowMs),
    status,
    source,
    expires_at: expiresAt,
  };
}
