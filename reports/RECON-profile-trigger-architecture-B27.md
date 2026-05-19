# RECON — profiles tier trigger architecture (B27, 2026-05-19)

Diagnostic only. No code/migration change. Labels: silent-failure, dead-code, stale-audit-note.

> **CONVENTION WRAPPER added by B36 (2026-05-19).** B27 authored a complete
> diagnostic but left it uncommitted at its worktree root
> (`RECON-profile-trigger-architecture.md`) — one `git worktree prune` from
> loss. B36 relocated it to the B16 convention path
> (`reports/RECON-profile-trigger-architecture-B27.md`) and added the two
> sections the 6-section recon-doc convention requires that B27's original
> structure did not name explicitly (**Verdict**, **Worktree disposition**).
> B27's §1–§5 below are **verbatim and unaltered** — the substantive analysis
> is B27's; only this header, the Verdict line, and the closing disposition
> are B36's.

## Verdict

`sync_profile_tier_from_payment_transactions` (T2) is **dormant by
table-mismatch, not by being disabled**: it is bound to
`public.payment_transactions`, a table the two canonical real-money paths
(Stripe webhook, RevenueCat) **never insert into**, so `profiles.tier` is
never propagated for any Stripe-paying user — the "paid but `tier=level0`"
class. The freeze trigger T1 is orthogonal and must be kept. Recommended
fix is **scoped-B**: keep T1, retire T2 (tombstone migration, drift binding
documented), delete B25's numeric `tier >= N` bypass, defer full Option C
as a phased follow-up. (Full reasoning, trigger map, and the gift-path
exception are in §1–§5.)

## 1. Trigger map

### T1 — `profiles_freeze_privileged_columns` (the freeze trigger)

| Property | Value |
|---|---|
| Migration | `20260614000000_profiles_freeze_privileged_columns.sql` (PR #578) |
| Timing | **BEFORE UPDATE** on `public.profiles`, FOR EACH ROW |
| Function | `public.profiles_freeze_privileged_columns()` — SECURITY DEFINER, `search_path=''` |
| Behaviour | *Reverts* (not rejects) any delta to 13 privileged columns incl. `tier, plan_type, premium_status, premium_expires_at, premium_source, access_expires_at, vip_rank, trial_extension_days, stripe_customer_id, is_admin, admin_level, role, email_unsubscribe_token` |
| Bypass | `current_setting('request.jwt.claim.role') IS DISTINCT FROM 'authenticated'` → return NEW unchanged. So **service_role + SQL Editor/postgres (NULL claim) pass through**; only the browser `authenticated` REST role is frozen. anon has no UPDATE grant on profiles. |
| Live in prod? | **Yes** — applied + verified via SQL Editor 2026-05-18 (memory `project_578_rls_applied`). Tracked migration is the first/self-contained one for this surface. |
| Intent | Security control: closes the profiles privilege-escalation in `RECON-rls-completeness.md §1` (free account PATCHing `is_admin:true`). **Not an entitlement mechanism.** |

### T2 — `sync_profile_tier_from_payment_transactions` (the dormant sync trigger)

| Property | Value |
|---|---|
| Function-fix migration | `20260510010000_fix_sync_profile_tier_trigger.sql` (CREATE OR REPLACE FUNCTION **only**) |
| Trigger BINDING | **Not in any tracked migration** — `CREATE TRIGGER … ON public.payment_transactions EXECUTE sync_profile_tier_from_payment_transactions` is pure SQL-Editor prod drift. The fix migration explicitly relies on the pre-existing drift binding ("triggers reference the function by oid"). |
| Timing | **AFTER INSERT** on `public.payment_transactions`, FOR EACH ROW (per fix-migration header + redeem path) |
| Function | `public.sync_profile_tier_from_payment_transactions()` — SECURITY DEFINER, `search_path=public` |
| Behaviour | If `new.status` ∈ (`paid`,`completed`): look up `subscription_tiers.vip_key::text` by `new.tier_id`; UPDATE `profiles.tier`/`tier_id` for `new.user_id`. Early-returns (silent no-op) if status null/other, tier-key null, or both `_col_exists` checks false. |
| Drift dependency | Calls `public._col_exists('public','profiles','tier'|'tier_id')` — `_col_exists` defined in **no tracked migration** (drift). If absent in prod the function errors at var-init; if it returns false the function no-ops silently. |
| Drift history | Already a serial schema-drift casualty: referenced `subscription_tiers.key` after prod renamed it `.vip_key` via SQL Editor → gift redemptions threw `column st.key does not exist` until `20260510010000` patched it. |
| Live in prod? | Function body is tracked + was applied (gift path works post-fix). Binding enabled/disabled state is **catalog-only — unverifiable by an agent** (no `pg_trigger` path; memory `project_pg_indexes_preflight`). SQL for Chau in §4. |

## 2. Billing paths vs. the sync trigger — the core finding

Three entitlement-write paths exist. **None of the real-money paths inserts `payment_transactions`, so none fires T2.**

| Path | Writes | `payment_transactions` INSERT? | Fires T2? | Sets `profiles.tier`? |
|---|---|---|---|---|
| **Stripe** `stripe-webhook/billing.ts` | `entitlement_events`, `subscriptions`, `profiles.{premium_status,premium_expires_at,premium_source}` | **No** | **No** | **No** — only `premium_status` |
| **RevenueCat** `revenuecat-webhook/projection.ts` | `subscriptions`, `profiles.{tier,premium_status}` | **No** | **No** | **Yes — written directly**, not via trigger |
| **Gift/access-code** `redeem_access_code_atomic` RPC (service_role) | `user_subscriptions`, `payment_transactions (status='completed')`, `access_code_redemptions` | **Yes** | **Yes** | Via T2 (if `_col_exists` + `subscription_tiers.vip_key` resolve) |

Read side: `me-entitlement` derives entitlement from `subscriptions` (canonical), falls back to legacy `user_subscriptions` for gift codes, and does **not** read `profiles.tier`.

## 3. Dormant-trigger root cause

**Hypothesis 3 (table mismatch) — CONFIRMED and refined.** Not disabled; not a guard-always-false; not replaced-and-not-dropped. T2 is bound to `payment_transactions`, a table the **canonical billing paths (Stripe, RevenueCat) never write**. It is reachable *only* by the gift/access-code redemption path. For every Stripe-paying user the trigger never fires and `profiles.tier` is never propagated → "paid but `tier=level0`" class (cf. B5 mylinh, memory `project_room_tier_db_corruption`).

Freeze interaction: when T2 *does* fire (gift path), its inner `UPDATE profiles` runs under the original service_role request → `request.jwt.claim.role='service_role'` → T1 bypasses → write succeeds. **T1 does not cause T2's dormancy.** They are orthogonal.

Two latent failure modes even on the gift path: (a) untracked `_col_exists` drift object; (b) untracked trigger binding — both invisible to repo-only review and to non-catalog agents.

## 4. Architectural intent

`profiles.tier` was **originally intended as the canonical paid-tier signal** — T2's existence is the proof of that intent. The architecture has since moved to a **derived model**: `subscriptions` → `me-entitlement` → `premium_status` is the source of truth. `profiles.tier` now survives as an **inconsistently-maintained denormalized cache**: RevenueCat writes it directly, Stripe never touches it, gift codes depend on the half-dead T2, and `me-entitlement` doesn't read it. Two entitlement signals that disagree by construction. B25's numeric `tier >= N` gate reads the stale cache — that is the bug class.

Live verification SQL for Chau (SQL Editor — agents have no catalog path):
```sql
select tgname, tgenabled, tgtype,
       (select proname from pg_proc p where p.oid = t.tgfoid) as fn
from pg_trigger t
where tgrelid in ('public.profiles'::regclass,'public.payment_transactions'::regclass)
  and not tgisinternal;
select proname, prosecdef from pg_proc
where proname in ('sync_profile_tier_from_payment_transactions',
                  'profiles_freeze_privileged_columns','_col_exists');
```

## 5. Recommendation

**None of A/B/C is correct as literally stated.** Literal Option B ("delete *both* triggers") would delete T1, reopening the CRITICAL exploitable profiles privilege-escalation (RECON-rls-completeness §1, live since #578). Reject. Option A re-points/feeds a SQL trigger to chase a denormalized cache — duplicates entitlement logic (already in TS `deriveEntitlementFromSubscriptions`) into a proven serial drift casualty; violates "one owner per function." Option C is the right destination but app-wide-refactor sized — wrong blast radius for one move on the money path.

**Recommended: scoped-B, freeze explicitly preserved + Option-C insight applied only to the gate B25 touched.**

1. **Keep T1** (`profiles_freeze_privileged_columns`) untouched — live security control, orthogonal to entitlement.
2. **Retire T2** (`sync_profile_tier_from_payment_transactions`) — path-scoped, drift-dependent (`_col_exists` + binding untracked), never fires for the dominant Stripe path. Do **not** "fix" it (Option A re-entrenches a second source of truth). Retirement is a tombstone migration documenting the drift binding, applied by Chau via SQL Editor (drift protocol).
3. **Delete B25's numeric `tier >= N` bypass.** Commit: paid entitlement is read **only** from `me-entitlement` / `premium_status` / `subscriptions`, never the `profiles.tier` cache.
4. **Defer full Option C** (every `profiles.tier` reader → entitlement) as a tracked, phased follow-up — money path, do not big-bang.

Rationale: smallest safe diff that removes the disagreeing signal, preserves the security control, and stops new code from depending on the stale cache, without re-implementing entitlement derivation in SQL. Aligns with CLAUDE.md "restore before redesign", "one owner per function", "central files are dangerous", "small diffs over smart diffs".

## Worktree disposition

`keep — spec for the scoped-B follow-up dispatch.` §5 is the specification
for three concrete follow-ups: (a) a T2-retirement tombstone migration that
documents the untracked SQL-Editor trigger binding + `_col_exists` drift
object (Chau-applied via SQL Editor — no unattended path; cf.
`project_db_schema_drift_audit`), (b) deletion of B25's numeric
`tier >= N` gate, (c) a deferred phased Option-C tracked item. The two
catalog facts B27 could not verify from an agent (T2's
enabled/disabled state, `_col_exists`/binding existence) require the
`pg_trigger`/`pg_proc` SQL in §4, run by Chau — those open items keep this
worktree as the live reference until the scoped-B PRs land. Do **not**
prune until the T2-retirement migration is authored against this doc.
