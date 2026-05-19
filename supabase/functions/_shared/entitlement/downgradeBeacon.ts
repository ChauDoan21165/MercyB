// supabase/functions/_shared/entitlement/downgradeBeacon.ts
//
// A18 §7 row 6 — the entitlement-downgrade beacon.
//
// When `recomputeEntitlement` flips a user's `is_premium` from `true`
// to `false`, we emit a Sentry breadcrumb so the rollout is observable
// at the moment of every flip (B13 §phase-3 defense 5: "mandatory
// observability for a reversible rollout"). The flip is NOT a failure
// — it is the correctness path firing — but it is an exit from a paid
// state and must surface to dashboards by construction, not by the
// next error event happening to ride alongside it.
//
// PR1.5 SCOPE — additive helpers only. This file ships with **zero
// importers** in app code today; PR2 (caller wires post-#789+#832
// apply) composes:
//
//     const prevIsPremium = await loadPriorEntitlementIsPremium(supabase, userId, appId);
//     const row = await recomputeEntitlement(supabase, userId, opts);
//     await emitDowngradeBeaconIfNeeded({
//       supabaseAvailable: true, userId, appId, reason: opts.reason,
//       prevIsPremium, nextIsPremium: row.is_premium,
//     });
//
// SEQUENCING NOTE — this PR bases on `origin/main`, NOT on #843. The
// dispatch ("Base: origin/main NOT stacked on #843") + "Do not touch
// #843 branch" rules out modifying `recompute.ts` (which isn't on main
// yet). Instead PR1.5 ships standalone helpers that PR2 will compose
// alongside `recomputeEntitlement` once both PR1 (#843) and PR1.5
// land. Until then this file is dead code in the bundle — same
// additive-only discipline as PR-A/PR-B and PR1.
//
// The breadcrumb shape is set per dispatch:
//
//     {
//       category: "billing.downgrade",
//       message:  `entitlement downgraded: ${userId} (${reason})`,
//       level:    "warning",
//       data:     { userId, appId, reason },
//     }

import { addEdgeBreadcrumb } from "../sentry.ts";

/**
 * Minimal supabase-js surface used by the prior-entitlement loader.
 * Defined inline to keep this module esm.sh-free (vitest-importable).
 *
 * NOTE: structurally identical to `SupabaseClientLike` in
 * `_shared/entitlement/recompute.ts` (shipped on #843, not yet on
 * main). PR2 will fold both into a single type; for PR1.5 the
 * duplication is intentional — we can't import from a file that
 * isn't on `origin/main` yet without stacking on #843, which the
 * dispatch forbids.
 */
export interface SupabaseClientLike {
  // deno-lint-ignore no-explicit-any
  from(table: string): any;
}

/**
 * Read the `is_premium` column of the user's current entitlements row
 * (if any) — the "prior" state we compare against post-recompute.
 *
 * Returns:
 *   - `boolean` when a row exists for `(userId, appId)`.
 *   - `null`    when no row exists. The first-ever recompute for a
 *               user passes `null` → `emitDowngradeBeaconIfNeeded`
 *               correctly suppresses the beacon (there is no prior
 *               state to "downgrade from").
 *
 * Failure routing: on a read error we return `null` (not throw) — a
 * missing prior-state read should NOT block recompute itself, only
 * suppress the beacon for this call. The caller is expected to
 * structured-log the underlying error if it cares.
 */
export async function loadPriorEntitlementIsPremium(
  supabase: SupabaseClientLike,
  userId: string,
  appId: string,
): Promise<boolean | null> {
  try {
    const result = await supabase
      .from("entitlements")
      .select("is_premium")
      .eq("user_id", userId)
      .eq("app_id", appId)
      .maybeSingle();

    if (result?.error) return null;

    const row = result?.data as { is_premium?: unknown } | null | undefined;
    if (!row) return null;

    return row.is_premium === true;
  } catch {
    return null;
  }
}

export interface DowngradeBeaconContext {
  userId: string;
  appId: string;
  reason: string;
  prevIsPremium: boolean | null;
  nextIsPremium: boolean;
}

/**
 * Emit the A18 §7 row 6 downgrade beacon iff the user's is_premium
 * truly flipped active→inactive. All other transitions (first write,
 * staying premium, staying non-premium, upgrade from null/false → true)
 * are no-ops. Sentry SDK is initialized lazily inside
 * `addEdgeBreadcrumb`; when `SENTRY_DSN` is unset this whole call is
 * a safe no-op.
 */
export async function emitDowngradeBeaconIfNeeded(
  ctx: DowngradeBeaconContext,
): Promise<void> {
  // The single condition the beacon fires on: a real flip from
  // premium to non-premium. Null prior (no row) is NOT a downgrade —
  // the user wasn't premium to begin with.
  if (ctx.prevIsPremium !== true) return;
  if (ctx.nextIsPremium !== false) return;

  await addEdgeBreadcrumb({
    category: "billing.downgrade",
    message: `entitlement downgraded: ${ctx.userId} (${ctx.reason})`,
    level: "warning",
    data: {
      userId: ctx.userId,
      appId: ctx.appId,
      reason: ctx.reason,
    },
  });
}
