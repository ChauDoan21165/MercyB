// supabase/functions/_shared/entitlement/recompute.ts
//
// A18 PR1 — the server-side single writer for `public.entitlements`.
//
// SHAPE
//   Reads:
//     R1  subscriptions               (canonical billing rows)
//     R2  user_subscriptions          (B22 gift fallback — delete on D3)
//   Derive (single owner, B13 phase 3): `deriveEntitlement(rows, now)`
//                                       from `../entitlement.ts`.
//   Write: ONE call to the atomic `recompute_entitlement_tx` RPC (#832)
//          which upserts `entitlements` with a monotonic-on-`computed_at`
//          guard AND projects to `profiles.premium_*` in a single
//          transaction. No two-edge-write path exists (B68 §7 row 5
//          forbids the drift class).
//
// ADDITIVE-ONLY (PR1 scope per dispatch).
//   This module ships with **zero importers** in app code. PR2 will
//   rewire `stripe-webhook/finalizeSubscriptionProcessing`; PR3
//   `revenuecat-webhook`; PR4 the redeem-* paths. Until then this
//   function is dead code in the bundle — vitest tests exercise it
//   against a mocked supabase client.
//
// HARD GATE (prod dispatch, not source):
//   * #789 — `public.entitlements` table applied (table = nowhere-to-
//     write protection).
//   * #832 — `recompute_entitlement_tx` RPC applied. The
//     `supabase.rpc("recompute_entitlement_tx", …)` call below will
//     fail with "function does not exist" until then. That is the
//     intended fail-loud signal (A18 §7 / B68 §7) — there is no
//     fallback two-call path in this module by design.
//   Both are Chau-applied via SQL Editor (B48 D6 — no unattended SQL
//   path to this Supabase). PR2's caller-rewire is the canary; this
//   PR's tests do not require the RPC to exist.
//
// CONTRADICTIONS RESOLVED (cite in PR body):
//   1. B68 §1 colocated `deriveEntitlement` inside `recompute.ts`;
//      A18 §2 + B68 O1 say IMPORT it from `_shared/entitlement.ts`.
//      Resolved per O1 (single derive owner = B13 ph3) — imported.
//   2. A18 §10 mandated this PR also delete the 4 code-dead writers
//      and rewire stripe-webhook's `finalizeSubscriptionProcessing`.
//      Current dispatch narrows PR1 to ADDITIVE-ONLY (zero importers,
//      zero call-site changes). Resolved per dispatch — deletions
//      and rewires move to PR2.
//   3. B68 §6 / A18 §6 D-G3 mandated reuse of #766's `casRetry`
//      helper. The monotonic-on-`computed_at` WHERE clause lives in
//      the RPC itself (#832), so no JS-side retry loop is needed
//      here: a "lost the race" stale-recompute is a no-op SQL UPDATE
//      that returns the fresher row (and we accept it as the
//      converged truth — A18 §6 "natural convergence is the
//      self-heal regardless"). No `casRetry` import needed.

import {
  deriveEntitlement,
  type EntitlementInput,
  type EntitlementSnapshot,
  type EntitlementSource,
  type EntitlementStatus,
} from "../entitlement.ts";
import { addEdgeBreadcrumb, captureEdgeError } from "../sentry.ts";

export const DEFAULT_APP_ID = "mercy_blade";

/** Provenance string for Sentry tags + downgrade beacon. REQUIRED on every call. */
export type RecomputeReason =
  | "stripe-webhook"
  | "revenuecat-webhook"
  | "redeem-gift-code"
  | "redeem-access-code"
  | "admin-manual-fix"
  | "backfill";

export interface RecomputeOptions {
  /** Defaults to `DEFAULT_APP_ID`. */
  appId?: string;
  /**
   * Injected clock, captured ONCE at function entry. Tests / backfill
   * scripts pass a fixed `Date` so the monotonic guard's behavior is
   * deterministic. Idempotency hinges on this — never `Date.now()`
   * inside `deriveEntitlement` (B13 phase 3 / B68 §5).
   */
  now?: Date;
  /** REQUIRED — Sentry provenance + B13 downgrade-beacon `reason`. */
  reason: RecomputeReason;
}

/**
 * The persisted row shape returned by `recompute_entitlement_tx` (PR #832).
 * Local declaration per A8f §4 recommendation; will fold into supabase
 * `database.types.ts` after the migrations are applied and types are
 * regenerated. Until then this is the authoritative shape this writer
 * returns to its caller.
 */
export type EntitlementRow = EntitlementSnapshot & {
  user_id: string;
  app_id: string;
  computed_at: string;
  updated_at: string;
};

/**
 * The minimal supabase-js surface this writer uses. Structural typing
 * — production callers pass a `SupabaseClient<Database>` from
 * `@supabase/supabase-js`; tests pass an in-memory stub. Keeps this
 * module esm.sh-free so vitest can import it directly (mirrors the
 * discipline already applied to `me-entitlement/entitlement.ts` and
 * `_shared/entitlementResponse.ts`).
 */
export interface SupabaseClientLike {
  // deno-lint-ignore no-explicit-any
  from(table: string): any;
  // deno-lint-ignore no-explicit-any
  rpc(fn: string, params: Record<string, unknown>): any;
}

/**
 * Single writer for `public.entitlements` + legacy `profiles.premium_*`
 * projection. Reads subscriptions + the B22 gift fallback, runs the
 * shared expiry-aware derive, calls one RPC that performs an atomic
 * monotonic-UPSERT + projection.
 *
 * Throws on any read or write failure. Never swallows. Stripe webhook
 * 5xx → provider retry is the correct upstream behaviour (B68 §7).
 */
export async function recomputeEntitlement(
  supabase: SupabaseClientLike,
  userId: string,
  opts: RecomputeOptions,
): Promise<EntitlementRow> {
  const appId = opts.appId ?? DEFAULT_APP_ID;
  // Capture `now` once at entry. Every downstream consumer (derive +
  // RPC `p_computed_at`) uses this same instant — idempotency depends
  // on a single frozen clock.
  const now = opts.now ?? new Date();

  /* ── R1: subscriptions ──────────────────────────────────────────── */

  const r1 = await supabase
    .from("subscriptions")
    .select("status,current_period_end,provider,id")
    .eq("user_id", userId)
    .eq("app_id", appId);

  if (r1.error) {
    await captureEdgeError(r1.error, {
      functionName: "recomputeEntitlement",
      userId,
      tags: { phase: "read-subscriptions", reason: opts.reason },
      extra: { appId },
    });
    throw r1.error;
  }

  const subscriptionRows: EntitlementInput[] = Array.isArray(r1.data)
    ? (r1.data as EntitlementInput[])
    : [];

  /* ── R2: gift fallback ───── delete on D3 (B22 fold-in) ─────────── */
  // The redeem-access-code RPC writes into the legacy `user_subscriptions`
  // table, not `subscriptions`. Without this fallback a fully-valid
  // gift redemption produces no entitlement. Live pattern this is
  // ported from: `me-entitlement/index.ts:42-63 fetchActiveGiftSubscription`.
  // When D3 folds gifts into `subscriptions`, this whole block is one
  // localized deletion — that is why it is wrapped in a single
  // contiguous comment-fence.
  //
  // Inconsistent rows (`is_gift_redemption=false` slipping through, a
  // redeemed gift with null `current_period_end`, etc.) are captured
  // as a warning AND filtered from derive input. Never silently
  // dropped (B22-class money-silent-failure killer), never thrown
  // (the rest of the derive is still correct).

  const r2GiftRows: EntitlementInput[] = [];
  const nowIso = now.toISOString();

  const r2 = await supabase
    .from("user_subscriptions")
    .select("id,status,is_gift_redemption,current_period_end,source")
    .eq("user_id", userId)
    .eq("status", "active")
    .eq("is_gift_redemption", true)
    .gt("current_period_end", nowIso)
    .order("current_period_end", { ascending: false, nullsFirst: false })
    .limit(1);

  if (r2.error) {
    await captureEdgeError(r2.error, {
      functionName: "recomputeEntitlement",
      userId,
      tags: { phase: "read-gifts", reason: opts.reason },
      extra: { appId },
    });
    throw r2.error;
  }

  const r2Rows = Array.isArray(r2.data) ? (r2.data as Array<Record<string, unknown>>) : [];
  for (const giftRow of r2Rows) {
    const isGift = giftRow.is_gift_redemption === true;
    const periodEnd = typeof giftRow.current_period_end === "string"
      ? giftRow.current_period_end
      : null;

    // Inconsistency 1: row leaked through the filter but the flag is
    // false. Inconsistency 2: row claims `status=active` but has no
    // period end (the redeem RPC always sets it). Both are bug-shaped
    // — surface and filter.
    if (!isGift || periodEnd === null) {
      await captureEdgeError(
        new Error("recomputeEntitlement: gift row failed integrity check"),
        {
          functionName: "recomputeEntitlement",
          userId,
          tags: { phase: "gift-inconsistency", reason: opts.reason },
          extra: {
            appId,
            giftRowId: giftRow.id,
            isGiftRedemption: giftRow.is_gift_redemption,
            currentPeriodEnd: giftRow.current_period_end,
          },
        },
      );
      continue;
    }

    r2GiftRows.push({
      status: "active",
      current_period_end: periodEnd,
      source: "gift_code",
      id: typeof giftRow.id === "string" ? giftRow.id : undefined,
    });
  }

  // --- end gift fallback ---

  /* ── R3: prior entitlement state (for downgrade beacon detection) ─ */
  // SELECT the existing entitlement is_premium so we can detect a
  // true→false flip after the RPC returns (A18 §7 row 6). If this
  // read fails the recompute MUST still proceed — the downgrade beacon
  // is observability, not correctness ("NOT a failure" in the brief's
  // failure matrix). We capture a warning so the missed observability
  // is itself observable. First-write case (no prior row) is normal
  // and yields priorIsPremium=null → no beacon possible.

  let priorIsPremium: boolean | null = null;
  const r3 = await supabase
    .from("entitlements")
    .select("is_premium")
    .eq("user_id", userId)
    .eq("app_id", appId)
    .maybeSingle();

  if (r3.error) {
    await captureEdgeError(r3.error, {
      functionName: "recomputeEntitlement",
      userId,
      tags: { phase: "read-prior-entitlement", reason: opts.reason },
      extra: { appId },
    });
    // Do NOT throw — proceed without prior-state knowledge.
  } else if (r3.data) {
    priorIsPremium = (r3.data as { is_premium?: unknown }).is_premium === true;
  }

  /* ── derive (single owner = B13 ph3) ────────────────────────────── */

  const derived: EntitlementSnapshot = deriveEntitlement(
    [...subscriptionRows, ...r2GiftRows],
    now,
  );

  /* ── write: ONE atomic RPC (#832) ───────────────────────────────── */

  const rpc = await supabase.rpc("recompute_entitlement_tx", {
    p_user_id: userId,
    p_app_id: appId,
    p_status: derived.status,
    p_source: derived.source,
    p_expires_at: derived.expires_at,
    p_computed_at: nowIso,
  });

  if (rpc.error) {
    await captureEdgeError(rpc.error, {
      functionName: "recomputeEntitlement",
      userId,
      tags: { phase: "upsert-entitlements", reason: opts.reason },
      extra: { appId, derivedStatus: derived.status },
    });
    throw rpc.error;
  }

  if (rpc.data === null || rpc.data === undefined) {
    // The RPC re-reads the entitlements row when the monotonic guard
    // rejects the upsert; it returns NULL only in the race where the
    // row was concurrently deleted (profile gone via on-delete-cascade).
    // Fail loud — there is no projection target.
    const err = new Error(
      "recomputeEntitlement: RPC returned null — entitlements row absent post-upsert",
    );
    await captureEdgeError(err, {
      functionName: "recomputeEntitlement",
      userId,
      tags: { phase: "upsert-entitlements", reason: opts.reason },
      extra: { appId },
    });
    throw err;
  }

  const row = rpc.data as EntitlementRow;

  /* ── downgrade beacon (A18 §7 row 6) ────────────────────────────── */
  // Mandatory observability for B13 phase-3's reversible rollout: a
  // true→false flip on is_premium emits a Sentry breadcrumb (context
  // for any subsequent event in this isolate) AND a structured
  // console.info log (standalone observability — does not depend on
  // a later Sentry event firing). Pure observability path — the
  // function never throws here (any beacon error is swallowed inside
  // addEdgeBreadcrumb, by design).

  if (priorIsPremium === true && row.is_premium === false) {
    await addEdgeBreadcrumb({
      category: "billing.downgrade",
      message: `entitlement downgraded: ${userId} (${opts.reason})`,
      level: "warning",
      data: { userId, appId, reason: opts.reason },
    });
    console.info(
      JSON.stringify({
        scope: "recomputeEntitlement",
        level: "warning",
        event: "downgrade-beacon",
        userId,
        appId,
        reason: opts.reason,
      }),
    );
  }

  return row;
}

/**
 * Re-exported for callers that already have an `EntitlementSnapshot`
 * (e.g. backfill scripts that derive once over many users). Kept here
 * so the public PR1 surface is self-contained.
 */
export type { EntitlementInput, EntitlementSnapshot, EntitlementSource, EntitlementStatus };
