// supabase/functions/_shared/premiumEntitlement.ts
//
// One canonical "is this caller an entitled premium user?" decision for
// server-side feature gates. It exists to kill a silent money-path bug:
//
//   • B5: billing NEVER writes `profiles.tier`. The columns Stripe →
//     recomputeAndPersistEntitlement actually persists are
//     `profiles.premium_status` + `profiles.premium_expires_at`.
//   • B17: `profiles.tier` is a TEXT column (database.types.ts:
//     `tier: string`), so the old `typeof row.tier === "number"` reads
//     in azure-phoneme + mock-interview ALWAYS coerced tier to 0 → every
//     `if (tier >= 1)` / `if (tier >= 2)` paid bypass was unreachable
//     dead code. A premium user who paid AFTER their trial lapsed (the
//     normal upgrade path — discovered case: "Mylinh") was denied
//     pronunciation scoring and dropped to the free mock-interview
//     limit, despite paying.
//
// Source of truth = `premium_status` + `premium_expires_at`, mirroring
// the live access gates the app already trusts (useUserAccess /
// me-entitlement / adult-content-url: status ∈ {active,trialing}), with
// B13's caveat #3: `past_due` / `grace_period` are the Stripe dunning
// window and MUST stay entitling regardless of expiry — Stripe is still
// actively retrying the card; revoking there punishes a transient
// failure (and is exactly the cohort dunning emails try to save).
//
// Pure + Deno-free (no Deno.*, no https:// imports) so vitest exercises
// it directly and azure-phoneme/core.ts (which must stay Deno-free) can
// import it the same way mock-interview/core.ts imports
// _shared/mockInterviewRateLimit.ts.

export type PremiumEntitlementRow = {
  /** `profiles.premium_status` — billing-written. Schema-typed
   *  non-null (`premium_status: string`); accept null defensively for
   *  legacy rows / partial selects. */
  premium_status: string | null;
  /** `profiles.premium_expires_at` — billing-written ISO timestamp.
   *  Null = billing has not stamped an end yet (freshly-activated
   *  sub before the first webhook recompute). */
  premium_expires_at: string | null;
  /** `profiles.tier` — TEXT in the DB ('0' | '1' | … as a string).
   *  Defensive SECONDARY signal only (the email-reengagement
   *  `isPaidActive` pattern: "uses both profiles.tier AND
   *  subscription_status"). NEVER the primary gate and NEVER coerced
   *  to a number — that coercion is the exact B17 dead-bypass bug. */
  tier?: string | number | null;
};

/** active / trialing entitle only while not past `premium_expires_at`. */
const ENTITLING_WITH_EXPIRY = new Set(["active", "trialing"]);

/**
 * Stripe dunning window. Entitling REGARDLESS of `premium_expires_at`:
 * the card just failed and Stripe is still retrying — the user is still
 * a paying account. Enforcing expiry here would revoke access mid-
 * dunning (B13 caveat #3).
 */
const ENTITLING_REGARDLESS_OF_EXPIRY = new Set(["past_due", "grace_period"]);

/**
 * True when the caller should be treated as an entitled premium user
 * for a server-side feature gate.
 *
 * Decision order:
 *   1. `past_due` / `grace_period` → entitled (dunning, ignore expiry).
 *   2. `active` / `trialing`       → entitled iff not past expiry. A
 *      null / unparseable `premium_expires_at` is treated as
 *      not-expired (billing hasn't stamped an end) — the same fail-
 *      toward-access posture the trial gate already uses for a missing
 *      trial timestamp.
 *   3. Defensive secondary: a non-empty, non-"0"/"free" `tier` STRING
 *      still grants (covers premium_status drift / never-written rows).
 *      This branch only ever GRANTS, never denies, so a stale tier can
 *      never lock a paying user out.
 *
 * @param row   premium_status + premium_expires_at (+ optional tier).
 * @param nowMs current time in ms; injectable for deterministic tests.
 */
export function isPremiumEntitled(
  row: PremiumEntitlementRow | null | undefined,
  nowMs: number = Date.now(),
): boolean {
  if (!row) return false;

  const status = String(row.premium_status ?? "").trim().toLowerCase();

  if (ENTITLING_REGARDLESS_OF_EXPIRY.has(status)) return true;

  if (ENTITLING_WITH_EXPIRY.has(status)) {
    if (!row.premium_expires_at) return true;
    const expiresMs = Date.parse(row.premium_expires_at);
    if (!Number.isFinite(expiresMs)) return true;
    return nowMs < expiresMs;
  }

  const tier = String(row.tier ?? "").trim().toLowerCase();
  if (tier !== "" && tier !== "0" && tier !== "free") return true;

  return false;
}
