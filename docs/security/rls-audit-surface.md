# RLS Audit Surface Map

**Status:** read-only diagnostic produced by C-side. The fixes called out below are decisions for A-side / Chau.

**Generated:** 2026-05-27.
**Last refreshed:** 2026-05-27 — `public.subscriptions` finding marked RESOLVED post-!86. See the top-of-doc resolution block.
**Method:** five parallel inventory passes over `supabase/migrations/` (237 SQL files), `supabase/functions/` (109 edge functions), and `supabase/config.toml`. Every claim in this doc has the migration file path it came from; spot-checked against the actual SQL before publishing.

**Cross-references:**
- ChatGPT's tracker: `reports/A-SIDE-monetization-auth-release-gate-tracker.md` (Advisor backlog).
- Live architecture: `docs/architecture/systems/billing-entitlement.md`, `ai-tutor.md`, `study-os-stage-3.md`.

---

## 🟢 RESOLVED — `public.subscriptions` RLS (originally flagged CRITICAL)

> **Status:** SHIPPED in `a1/subscriptions-rls-select-policies` (!86, merged 2026-05-27). The finding below describes the **historical** state at !84's authoring time; the resolution paragraph at the end of this block describes what actually shipped. This banner is preserved (rather than deleted) so the next auditor sees both the original severity and the chain of action that closed it.
>
> ---
>
> **Originally:** `public.subscriptions` had no Row Level Security and was readable by every authenticated user. Severity: **CRITICAL** — worse than the `security_definer_view` Advisor backlog item, because `security_definer_view` is about views bypassing RLS on otherwise-protected base tables, while this was the raw billing table itself with no protection at all.
>
> **Evidence (at original authoring):**
> - Created in `supabase/migrations/20260315211233_unified_entitlements_and_subscriptions.sql:3`.
> - Schema includes `user_id`, `provider` (stripe/apple/google), `provider_customer_id`, `provider_subscription_id`, `provider_transaction_id`, `status`, `current_period_start/end`, `cancel_at_period_end`, `canceled_at`, `ended_at`, **`raw_payload jsonb`** (full webhook payload — often contains customer email, card metadata, address fragments).
> - `grep -rn "ENABLE ROW LEVEL.*public\.subscriptions\b" supabase/migrations/` returned zero matches at audit time.
> - The batch RLS-enable migration `20260422020000_enable_rls_on_exposed_tables.sql` (which retroactively closed 11 other Advisor-flagged tables) did not include `subscriptions` — it covered `ai_price_catalog`, `ai_product_catalog`, `apple_iap_events`, `billing_price_map`, `mercy_feedback_*`, `stripe_events`, `stripe_webhook_events`, `user_subscription_state`, and `entitlement_events` only.
>
> **Why it was worse than `security_definer_view`:** the Advisor `security_definer_view` finding is about Postgres-15-default `security_invoker = false` on views — the view evaluates as the owner rather than the caller, but the base tables typically still have RLS. With `public.subscriptions` un-RLS'd, the base table itself was unprotected — even a correctly-written `security_invoker = true` view over it would have exposed every row.
>
> ---
>
> **Resolution:** A1 shipped `supabase/migrations/20260701000000_subscriptions_rls_select_policies.sql` (!86, merged 2026-05-27 21:42 UTC). The migration enables RLS plus two SELECT policies:
>
> ```sql
> ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
>
> CREATE POLICY subscriptions_self_select
>   ON public.subscriptions FOR SELECT TO authenticated
>   USING (auth.uid() = user_id);
>
> CREATE POLICY subscriptions_admin_select
>   ON public.subscriptions FOR SELECT TO authenticated
>   USING (public.get_admin_level(auth.uid()) >= 9);
> ```
>
> No GRANT/REVOKE changes. No INSERT/UPDATE/DELETE policies — writes were already service-role-only via the stripe-webhook / apple-iap-sync / google-webhook edge functions, and stay that way.
>
> **Pre-merge call-site verification** is in `docs/security/subscriptions-rls-callsite-verification.md` (!94 companion doc): 20 call sites audited, 15 service-role (bypass RLS, unaffected), 1 user-JWT edge function reading only the caller's own row (works correctly), 3 browser-side helpers in `src/billing/*` that are dead code in prod (zero callers), and 2 admin dashboard call sites that read all rows via the admin policy.
>
> **Complementary follow-up:** !94 flagged a latent frontend / backend admin-gate mismatch (`useAdminAccess.ts:59` admitted `safeLevel > 0` while !86's admin policy requires `>= 9`). The mismatch was harmless in production (Chau is the only admin in prod and is at level 10, confirmed by the `admin_users` distribution check) but was closed for future-proofing in **!100** (`fix/admin-gate-level-9-align`, merged 2026-05-27): `useAdminAccess.ts:59` now also requires `safeLevel >= 9`.
>
> **Verification post-merge** (run any time to re-confirm):
> ```sql
> -- As any non-admin authenticated session:
> SELECT count(*) FROM public.subscriptions WHERE user_id != auth.uid();
> -- Expect 0 (RLS filtering).
> ```
>
> **Still tracked as out-of-scope follow-ups** (not part of !86, not part of this resolution):
> - `src/hooks/useUserAccess.ts:213, 330` carry the same loose `adminLevel > 0` pattern that !100 closed in `useAdminAccess.ts`. Sibling hook with its own snapshot tests; deserves its own MR. Flagged in !100's description.
> - The `useUserAccess.ts` tightening is a future hardening, not a regression — Chau is still the only admin at level 10 and no current account is affected.

---

## Table of contents

- [§0 Scope & methodology](#0-scope--methodology)
- [§1 Risk-ranked summary](#1-risk-ranked-summary)
- [§2 Public-schema tables — RLS state](#2-public-schema-tables--rls-state)
- [§3 SECURITY DEFINER functions](#3-security-definer-functions)
- [§4 GRANTs to anon / authenticated](#4-grants-to-anon--authenticated)
- [§5 Materialized views](#5-materialized-views)
- [§6 Triggers + pg_cron schedules](#6-triggers--pgcron-schedules)
- [§7 Edge functions — service-role-key cross-reference](#7-edge-functions--service-role-key-cross-reference)
- [§8 Cross-reference vs Advisor backlog](#8-cross-reference-vs-advisor-backlog)
- [§9 Findings A-side should resolve or waive](#9-findings-a-side-should-resolve-or-waive)

---

## 0. Scope & methodology

### What was audited
- All `.sql` files under `supabase/migrations/` (237 files, ordered by filename which encodes ISO timestamp).
- All edge-function directories under `supabase/functions/` (109 functions; `_shared/`, `_billing/`, `shared/` skipped as helpers).
- `supabase/config.toml` — for every function's `verify_jwt` setting.
- ChatGPT's tracker for already-classified backlog items.

### What was NOT audited
- The live Supabase project state — this audit is repo-as-source-of-truth. The CLAUDE.md notes that 179 PROD_AHEAD relations exist (drift between repo migrations and prod). A real Advisor reading from prod may show findings this audit can't see and vice versa. A complementary pass against the live DB is a separate dispatch.
- The Supabase dashboard "Auth → Settings" surface — `auth_leaked_password_protection` is a dashboard toggle, not a migration.
- Supabase Storage RLS (`storage.objects` policies) — separate audit dimension.
- Auth schema (`auth.users`, `auth.sessions`) — managed by Supabase, not in repo migrations except where triggers attach.

### Source-of-truth hierarchy
Per `CLAUDE.md` "Source-of-truth hierarchy": (1) last known good behavior → (2) current production reality → (3) minimal safe diff → (4) new design ideas. This audit reports (1) and (2) only; the "what to fix" column is a placeholder for A-side's decision.

### A note on "ZERO policies" claims
An earlier draft pass claimed 29 tables had RLS-enabled but zero policies. Spot-checks against the actual SQL invalidated several of those claims (`gift_subscriptions` has 4 policies; `referral_codes` has 4; `entitlement_events` has 2 — `20260422020000_enable_rls_on_exposed_tables.sql` added them retroactively). The verified "RLS enabled but no policies" count is therefore listed table-by-table in §2C rather than as a single aggregate.

---

## 1. Risk-ranked summary

| # | Finding | Severity | Status | Where | Tracker entry |
|---|---|---|---|---|---|
| 1 | **`public.subscriptions` has no RLS** | CRITICAL (historical) | **HISTORICAL-CLOSED** | §2B, top-of-doc | Closed by !86 (`20260701000000_subscriptions_rls_select_policies.sql`) on 2026-05-27; latent frontend mismatch closed in !100 |
| 2 | `security_definer_view` (views w/o `security_invoker = true`) — concrete inventory | HIGH | LIVE — Advisor backlog | §3D | Tracker row: `security_definer_view` |
| 3 | `authenticated_security_definer_function_executable` — concrete inventory | HIGH | LIVE — Advisor backlog | §3B, §4B | Tracker row: `authenticated_security_definer_function_executable` |
| 4 | `record_login_attempt(email,...)` callable by anon — DoS / lockout-flood vector | MEDIUM-HIGH | LIVE | §3A, §4B | Not in tracker |
| 5 | `get_admin_level(uuid)` callable by authenticated — admin-status enumeration | MEDIUM | LIVE | §4B | Not in tracker |
| 6 | `unsubscribe_by_token(text)` callable by anon — mass-unsubscribe if tokens are weak | MEDIUM | LIVE | §3A | Not in tracker |
| 7 | `verify_jwt = false` + service-role-key edge functions other than known webhooks | MEDIUM | LIVE | §7C | Not in tracker |
| 8 | `auth_leaked_password_protection` (Supabase Auth dashboard setting) | LOW-MEDIUM | LIVE — Advisor backlog | n/a (dashboard) | Tracker row: `auth_leaked_password_protection` |
| 9 | `feature_flags.enabled_user_ids` cohort-UUID leak to anon (2026-05-08 → 2026-06-26) | HIGH | **HISTORICAL-CLOSED** | §4C | Closed by `20260626000000_feature_flags_public_view.sql` (masked view + REVOKE) |
| 10 | `auth_users_exposed` via referral leaderboard matviews | CRITICAL | **HISTORICAL-CLOSED** | §5B | Closed in Phase 2 destructive SQL (tracker MR !32 + safe projections) |
| 11 | `mercy-ai rls_disabled_in_public`, `mercy-ai sensitive_columns_exposed` | n/a | **NOT CONFIRMED** | n/a | Tracker says no live-Advisor evidence; do not classify as active |

**Net live exposure beyond what the tracker already covers:** post-!86, finding #1 is now HISTORICAL-CLOSED. Remaining live exposure is #4, #5, #6, #7 (MEDIUM range). Findings #2, #3, #8 are the three Advisor backlog items the tracker is already watching, with concrete inventories added.

---

## 2. Public-schema tables — RLS state

### 2A. Tables with RLS enabled + at least one policy

A representative high-stakes subset (the full set is ~155 tables):

| Table | Policies | Scoping summary |
|---|---|---|
| `profiles` | 8 | User-owns-own row + VIP3 tier read + admin override |
| `user_subscriptions` | 7 | User-owns-own + admin |
| `gift_subscriptions` | 4 | Purchaser select/insert + recipient select + redeem (in `20260425083000`) |
| `gift_codes` | 3 | Admin + authenticated user |
| `access_codes` | 12 (some duplicates) | Public view + admin control |
| `entitlement_events` | 2 | User own SELECT + INSERT (added retroactively by `20260422020000`) |
| `referral_codes` | 4 | Public read + owner write |
| `mercy_conversations` | 4 | User-owned, full CRUD |
| `placement_v3_sessions` | 3 | User-scoped |
| `admin_users` | 4 | Hierarchical admin levels |

### 2B. Tables that NEVER had ENABLE ROW LEVEL SECURITY ← historical critical gap candidates

| Table | Created in | Severity | Status |
|---|---|---|---|
| ~~**`public.subscriptions`**~~ | `20260315211233_unified_entitlements_and_subscriptions.sql` | CRITICAL (historical) | 🟢 **CLOSED** by `20260701000000_subscriptions_rls_select_policies.sql` (!86, merged 2026-05-27) — see top-of-doc resolution block. |

After !86 there are no remaining public-schema tables that lack RLS. The other tables in `20260315211233…` (`entitlement_events`, the `profiles` ALTER) either had RLS already at create time or got it from the batch retroactive enable at `20260422020000…`.

### 2C. Tables with RLS enabled but no `CREATE POLICY` for non-service-role

The batch migration `20260422020000_enable_rls_on_exposed_tables.sql` deliberately leaves 10 tables RLS-enabled-without-policies. The comment is explicit: *"Edge functions using SERVICE_ROLE_KEY bypass RLS. Anon + authenticated keys get zero access, which is what we want."* This is **service-role-only** — intentional deny-by-default for client access.

| Table | Reason listed | Verified intentional? |
|---|---|---|
| `ai_price_catalog` | Server-only billing config | Yes (batch comment) |
| `ai_product_catalog` | Server-only billing config | Yes |
| `apple_iap_events` | Webhook ingest only | Yes |
| `billing_price_map` | Server-only billing config | Yes |
| `mercy_feedback_daily_rollups` | Server aggregation | Yes |
| `mercy_feedback_events` | Server ingest | Yes |
| `mercy_worst_answers_daily` | Server aggregation | Yes |
| `stripe_events` | Webhook ingest | Yes |
| `stripe_webhook_events` | Webhook ingest | Yes |
| `user_subscription_state` | Computed view-of-record | Yes |

Other tables flagged by an automated scan as "RLS enabled but zero policies" turned out to have policies on second look (`gift_subscriptions`, `entitlements`, `referral_codes`, `entitlement_events`, etc.) — the scan caught earlier migrations that enabled RLS, missing the policies added in subsequent migrations. Don't propagate that aggregate without table-by-table re-verification.

### 2D. Tables referenced but not defined in any migration

These tables exist in production but their `CREATE TABLE` is not in `supabase/migrations/` — likely created via Supabase Studio UI before migrations were standardized. They show RLS enabled (so they're protected) but their origin should be reconciled. CLAUDE.md flags 179 PROD_AHEAD relations as a known drift; a separate dispatch maps these.

- `app_feedback`
- `mercy_feedback_daily_rollups`, `mercy_feedback_events`, `mercy_worst_answers_daily` (also retroactively touched by the batch migration)
- `stripe_events`
- `user_knowledge_profile`
- `user_subscription_state`

---

## 3. SECURITY DEFINER functions

### 3A. SECURITY DEFINER granted to `anon` — privilege-escalation surface

These are functions that an unauthenticated user can call. They run as the function owner (typically `postgres`), bypassing RLS. Each entry is HIGH-attention by definition; the per-entry risk depends on what the function does.

| Function | Migration | Purpose | Risk |
|---|---|---|---|
| `log_system_event(text, text, text, uuid, jsonb)` | `20260622000000_secdef_browser_write_wrappers.sql` | Browser-side telemetry log | MEDIUM — input clamped (msg ≤ 10K, level whitelisted); log poisoning still possible. No rate limit. |
| `record_login_attempt(text, boolean, text, text, text)` | `20260622000000_secdef_browser_write_wrappers.sql` | Pre-auth login-attempt telemetry | **MEDIUM-HIGH** — anon can flood `login_attempts` with attacker-chosen IPs/user-agents; if downstream lockout logic counts attempts naively this is a DoS vector against legitimate users. Validates email shape and clamps lengths, but no per-IP rate limit on the function itself. |
| `record_paywall_exposure_anon(text, text, text)` | `20260503020000_paywall_experiments.sql` | A/B exposure tracking | LOW — anon_id is opaque, no user link |
| `unsubscribe_by_token(text)` | `20260522000000_email_preferences.sql`, `20260620…_email_preferences_v2.sql` | One-click unsubscribe per RFC 8058 | **MEDIUM** — by design publicly callable; risk is entirely token entropy. If tokens are predictable or sequential, mass unsubscribe is possible. (Token generation is `generate_unsubscribe_token` trigger; needs separate review of its entropy source.) |
| `mark_family_invite_clicked(text)` | `20260528000000_family_invitations.sql` | Funnel tracking | LOW — only writes click count |
| `session_is_aal2()` | `20260529000000_mfa_aal2_required_when_enrolled.sql` | Read session AAL state | LOW — read-only, session-scoped |
| `user_has_verified_mfa()` | `20260529000000_mfa_aal2_required_when_enrolled.sql` | Read MFA verification state | LOW — read-only |
| `lifetime_intent_count()` | `20260503…_paywall_experiments.sql` | Aggregate counter | LOW — returns integer only |
| `weekly_leaderboard_top(integer)` | `20260510005000_weekly_leaderboard.sql` | Public top-N leaderboard | LOW — display-name only |

### 3B. SECURITY DEFINER granted to `authenticated`

This is the surface the Advisor `authenticated_security_definer_function_executable` finding cares about. Authenticated users can call these, and the functions bypass RLS by running as `postgres`. Risk depends on whether the function has an internal authz check.

#### Self-scoped (the function reads `auth.uid()` and only touches its own row)
These are low risk by design — the function effectively re-implements user-scoped RLS in code:

`get_email_preferences()`, `get_my_ai_monthly_meter()`, `get_or_create_referral_code()`, `mfa_backup_code_unused_count()`, `mfa_active_lockout()`, `leaderboard_weekly_my_rank()`, `weekly_leaderboard_my_rank()`, `is_teacher_reviewer()`.

#### Admin-gated (the function checks `get_admin_level() >= 9` and returns empty/raises for non-admins)
Low risk if the admin check is airtight. The admin check itself runs inside the function body, so a non-admin call returns nothing meaningful:

`analytics_daily_active_users()`, `analytics_feature_usage_7d()`, `analytics_user_funnel()`, `analytics_room_popularity()`, `analytics_user_cohorts()`, `analytics_cohort_retention(integer)`, `analytics_l1_rule_effectiveness()`, `analytics_weakness_trends_weekly(integer)`, `compute_operation_p95(text, timestamptz)`, `compute_route_p95(text, text, timestamptz)`, `get_cohort_retention(date, date, text)`, `get_behavioral_metrics(date, date)`, `get_conversion_funnel()`, `get_cohort_retention_freshness()`.

#### Takes a user_id parameter without enforcing caller == subject (HIGH attention)

| Function | Migration | What it does | Risk |
|---|---|---|---|
| `get_admin_level(uuid)` | `20260427010000_grant_execute_get_admin_level.sql` | Returns the admin level (0–10) of the user_id passed in | **MEDIUM** — admin-status enumeration. Any authenticated user can probe whether any other user is an admin. Used heavily inside RLS policies (where this is correct), but the bare grant lets clients call it too. Consider adding `IF caller != target_uid AND caller_admin_level < 9 RETURN 0` shim. |
| `grant_referral_reward(uuid)` | `20260512_referrals.sql`, `20260502_referral_reward_grant.sql` | Grants referral reward to owner_user_id | **HIGH** — if the function does not internally validate `auth.uid() = owner_user_id`, an attacker could grant rewards to a user_id they don't own. Inspect the function body before clearing. |
| `kick_study_group_member(uuid, uuid)` | `20260430…_study_groups.sql` | Removes a member from a study group | **HIGH** — must validate caller is group owner. Inspect. |
| `check_admin_email_rate_limit(uuid, integer, interval)` | `20260505…_admin_email_rate_limit.sql` | Queries rate-limit state for an admin | MEDIUM — allows authenticated callers to probe any admin's rate-limit state. Not directly damaging but an information disclosure. |
| `referral_owner_grants_in_year(uuid)` | `20260512_referrals.sql` | Counts referral grants for a user | MEDIUM — information disclosure: count any user's referral activity. |
| `apply_referral_code(text)` | `20260512_referrals.sql`, `20260429_referrals.sql` | Apply a code as the calling user | MEDIUM — must validate caller is unique user, no replay |
| `award_leaderboard_points(integer, text)` | `20260429…_leaderboard_weekly.sql` | Increment caller's leaderboard score | MEDIUM — must enforce inputs (e.g. max points per call). Self-service inflation possible if naive. |
| `increment_user_xp(integer)` | `20260424…_user_xp.sql` | Increment caller's XP | MEDIUM — same concern as `award_leaderboard_points`. |
| `refresh_weekly_digest(date)` | `20260517000000_weekly_digest_aggregates.sql` | Recompute aggregates for a given week | LOW-MEDIUM — expensive, recommend admin-gating. |
| `record_vocabulary_review(uuid, uuid, integer)` | `20260612010000_pronunciation_srs_rpcs.sql` | SRS write | LOW — typically scoped to caller |
| `record_pronunciation_attempt(uuid, text, ...)` | `20260612010000_pronunciation_srs_rpcs.sql` | SRS write | LOW — scoped to caller |
| `join_study_group(uuid, text)` | `20260430…_study_groups.sql` | Caller joins a group | LOW |
| `mark_family_invite_signed_up(text, uuid)` | `20260528000000_family_invitations.sql` | Service + authenticated overlap; needs caller-equals-uid check | MEDIUM |
| `corporate_seat_redeem_invite(text)` | `20260425…_corporate_seats.sql` | Caller redeems invite | LOW |
| `family_plan_redeem_invite(text)` | `20260503…_family_plans.sql` | Caller redeems invite | LOW |
| `pick_todays_challenge(uuid)` | `20260607…_daily_challenge.sql` | Read challenge for a user | LOW |
| `xp_level_for_total(integer)` | `20260609…_xp_levels.sql` | Pure lookup | LOW |

The MEDIUM/HIGH rows above are the concrete payload for the Advisor finding `authenticated_security_definer_function_executable`. Resolution options for A-side: (a) add caller-equals-subject checks inside function bodies; (b) revoke EXECUTE from authenticated and route via edge functions; (c) ratify the current state as acceptable with a justification.

### 3C. SECURITY DEFINER granted to `service_role`

Service-role bypasses RLS by design, so a function being SECURITY DEFINER and granted to service_role is redundant from a security model standpoint — it's stylistic. Not a risk vector. Inventory omitted; full list is in the raw `grep` output of `GRANT EXECUTE … TO service_role`.

### 3D. Views without explicit `security_invoker = true` (the `security_definer_view` Advisor finding)

Postgres 15+ defaults to `security_invoker = false`, which means the view evaluates as its owner (`postgres`) rather than the caller, bypassing the caller's RLS on the underlying tables. This is the Advisor finding the tracker is watching.

| View | Migration | Underlying tables | Effective access | Verdict |
|---|---|---|---|---|
| `public.feature_flags_public` | `20260626000000_feature_flags_public_view.sql` | `public.feature_flags` | anon + authenticated SELECT | **INTENTIONAL** — the security boundary IS `security_invoker = false`. The view masks `enabled_user_ids` to the caller's own UUID (or `[]`). If you flipped it to `security_invoker = true`, anon couldn't read at all because anon has no SELECT on the base table (revoked in the same migration). |
| `public.vip3_public_profiles` | `20251206221346_*.sql` | `public.profiles` | Implicit grants | **NEEDS REVIEW** — base table `profiles` has RLS with a VIP3-tier policy; view may be unintentionally widening access. |
| `public.v_user_pronunciation_stats` | `20260426000000_speech_attempts_persistence.sql` | `public.speech_attempts` | Implicit grants | **NEEDS REVIEW** — is it consumed via RPC only, or selected directly from the client? If directly, RLS on `speech_attempts` may be bypassed. |
| `public.v_analytics_user_cohorts` | `20260425165003_compounding_analytics.sql` | various | RPC-only | **ACCEPTABLE** — only callable via `analytics_user_cohorts()` RPC; RPC enforces admin gate. |
| `public.v_analytics_cohort_retention_daily` | same | various | RPC-only | **ACCEPTABLE** — same pattern |
| `public.v_analytics_l1_rule_effectiveness` | same | various | RPC-only | **ACCEPTABLE** — same pattern |
| `public.v_analytics_weakness_trends_weekly` | same | various | RPC-only | **ACCEPTABLE** — same pattern |
| `public.v_analytics_daily_active_users` | `20260427000000_admin_analytics_views.sql` | various | RPC-only | **ACCEPTABLE** — same pattern |
| `public.v_analytics_feature_usage_7d` | same | various | RPC-only | **ACCEPTABLE** — same pattern |
| `public.v_analytics_user_funnel` | same | various | RPC-only | **ACCEPTABLE** — same pattern |
| `public.v_analytics_room_popularity` | same | various | RPC-only | **ACCEPTABLE** — same pattern |
| `public.user_entitlements`, `public.user_entitlements_v`, `public.mb_user_effective_rank`, `public.v_user_ai_monthly_meter` | `20260630…_entitlement_user_rank_secdef_phase_a.sql` | various | authenticated + service_role SELECT | **HARDENED PHASE A** — explicitly flipped to `security_invoker = true` in this migration. Phase B (tighter grants) tracked separately. |

The two **NEEDS REVIEW** rows (`vip3_public_profiles`, `v_user_pronunciation_stats`) are the concrete payload for the Advisor `security_definer_view` backlog item. The acceptable rows above are not — they're safe because their access path is RPC-only with admin gating inside the RPC body.

---

## 4. GRANTs to anon / authenticated

### 4A. Direct privileges on tables / views

#### To `anon` (live grants)

| Object | Privilege | Granted in | Status |
|---|---|---|---|
| `public.feature_flags_public` | SELECT | `20260626000000_feature_flags_public_view.sql` | LIVE; masked view |
| `public.referral_leaderboard_monthly_public` | SELECT | `20260629…_safe_referral_leaderboard_projection.sql` | LIVE; safe physical projection (no `auth.users` join) |
| `public.referral_leaderboard_all_time_public` | SELECT | same | LIVE; safe physical projection |
| `public.weekly_digest_data` | SELECT | `20260517000000_weekly_digest_aggregates.sql` | LIVE; aggregates only, no user_id |
| `public.weekly_leaderboard` | SELECT | `20260510005000_weekly_leaderboard.sql` | LIVE; top-10 display only |

#### To `authenticated` (live grants — selected high-signal entries)

| Object | Privilege | Notes |
|---|---|---|
| `public.feature_flags` | SELECT | Authenticated can read base unmasked table. Admin tooling consumes this. |
| `public.feature_flags_public` | SELECT | Authenticated may use masked view too. |
| `public.teacher_memory` | SELECT, INSERT, UPDATE, DELETE | User-owned (RLS enforces) |
| `public.user_room_progress` | SELECT, INSERT, UPDATE, DELETE | User-owned (RLS enforces) |
| `public.entitlement_events` | SELECT, INSERT | User-owned (RLS added retroactively `20260422020000`) |
| `public.mercy_unified_sessions` | SELECT, INSERT, UPDATE | User-owned |
| `public.user_entitlements`, `public.user_entitlements_v`, `public.mb_user_effective_rank`, `public.v_user_ai_monthly_meter` | SELECT | View layer over entitlement state; Phase A hardened |
| `public.referral_leaderboard_optin` | SELECT, INSERT, UPDATE, DELETE | User-owned |

### 4B. `GRANT EXECUTE` on SECURITY DEFINER functions

The full inventory is §3A (anon) and §3B (authenticated). The privilege-escalation surfaces worth singling out:

- `record_login_attempt` (anon) — DoS vector against the lockout-counter
- `unsubscribe_by_token` (anon) — mass-unsubscribe if tokens are weak
- `get_admin_level(uuid)` (authenticated) — admin enumeration
- `grant_referral_reward(uuid)` (authenticated) — reward fraud if caller ≠ owner check is missing
- `kick_study_group_member(uuid, uuid)` (authenticated) — moderation abuse if caller ≠ owner check is missing
- `award_leaderboard_points`, `increment_user_xp` (authenticated) — gamification inflation if input caps are missing

### 4C. Historical-closed: `feature_flags` PII leak (2026-05-08 → 2026-06-26, ~7 weeks)

Sequence:
1. `20260508010000_feature_flags_grant_select.sql:10` — `GRANT SELECT ON public.feature_flags TO anon;` (giving anon direct read of the table, including the `enabled_user_ids uuid[]` cohort column).
2. `20260626000000_feature_flags_public_view.sql:70` — `REVOKE SELECT ON public.feature_flags FROM anon;` + introduced `feature_flags_public` view that masks `enabled_user_ids` to the caller's own UUID.

**Status:** CLOSED. The window during which any anonymous visitor could read every cohort UUID for every flag was approximately 49 days. No evidence in the repo that this was exploited, but the exposure was real. If a user-disclosure obligation applies, A-side may want to characterize this period explicitly.

### 4D. Historical-closed: referral leaderboard `auth_users_exposed`

Per the tracker: closed in Phase 2 destructive SQL (`!32` plus follow-up). Legacy matviews `public.monthly_referral_leaderboard` and `public.all_time_referral_leaderboard` dropped along with their anon grants. New safe projections `referral_leaderboard_{monthly,all_time}_public` live (no `user_id`, no `auth.users` join). Confirmed by inspection of `20260629000000_safe_referral_leaderboard_projection.sql`.

---

## 5. Materialized views

### 5A. Current matviews in `public` schema

None of note. The audit pass found no surviving `CREATE MATERIALIZED VIEW public.*` that grants to anon/authenticated. Safe projections in `20260629…` are *tables*, not matviews (deliberate — physical tables are faster to refresh than matviews and support direct RLS).

### 5B. Historical-closed: `monthly_referral_leaderboard` + `all_time_referral_leaderboard`

| Matview | Created | Dropped | Replaced by |
|---|---|---|---|
| `public.monthly_referral_leaderboard` | `20260524000000_referral_leaderboard.sql` | Same migration (race-condition guard) then Phase 2 destructive SQL after `!32` | `public.referral_leaderboard_monthly_public` (physical table) in `20260629…` |
| `public.all_time_referral_leaderboard` | same | same | `public.referral_leaderboard_all_time_public` (physical table) in `20260629…` |

Two cron jobs were installed in `20260524…` to refresh these matviews (`refresh-referral-leaderboards-daily` at 00:30 UTC); after the drop, those cron jobs reference dropped matviews and are no-ops or errors. Recommend A-side verifies the legacy cron schedules are removed from `cron.job` in prod — `grep` over `supabase/migrations/` shows only the create, not a corresponding `cron.unschedule`.

---

## 6. Triggers + pg_cron schedules

### 6A. Money/auth-critical triggers

| Trigger | Table | Event | Function | Migration |
|---|---|---|---|---|
| `on_auth_user_created` | `auth.users` | AFTER INSERT | `public.handle_new_user()` | `20251208225203…` |
| `on_admin_user_created` | `auth.users` | AFTER INSERT | `public.handle_admin_signup()` | `20251020153130…` (auto-assigns admin role for `cd12536@gmail.com` — bootstrap; verify production has this scoped correctly) |
| `update_user_subscriptions_updated_at` | `public.user_subscriptions` | BEFORE UPDATE | `public.handle_updated_at()` | `20251020094557…` |
| `update_payment_transactions_updated_at` | `public.payment_transactions` | BEFORE UPDATE | same | `20251120035109…` |
| `update_gift_codes_updated_at` | `public.gift_codes` | BEFORE UPDATE | same | `20251122042210…` |
| `update_access_codes_updated_at` | `public.access_codes` | BEFORE UPDATE | same | `20251120035109…` |
| `update_bank_transfer_orders_updated_at` | `public.bank_transfer_orders` | BEFORE UPDATE | same | `20251209075112…` |
| `trg_corporate_seats_cap` | `public.corporate_seats` | BEFORE INSERT/UPDATE | `public.enforce_corporate_seat_cap()` | `20260425…_corporate_seats.sql` |
| `trg_family_plan_members_cap` | `public.family_plan_members` | BEFORE INSERT | `public.enforce_family_plan_member_cap()` | `20260503…_family_plans.sql` |
| `profiles_set_unsubscribe_token` | `public.profiles` | BEFORE INSERT | `public.generate_unsubscribe_token()` | `20260522…_email_preferences.sql` (entropy of this generator gates the `unsubscribe_by_token` finding above) |

44 triggers total. The full list is in the underlying research; everything not above is timestamp maintenance, denormalization, or registry cache invalidation — low security relevance.

### 6B. pg_cron schedules

| Job | Cron | Function | Role | Notes |
|---|---|---|---|---|
| `cleanup-anonymous-users` | `0 3 * * *` | `public.cleanup_anonymous_users()` | default (`postgres`, RLS-bypass) | Deletes anon `auth.users` >30 days idle |
| `refresh-referral-leaderboards-daily` | `30 0 * * *` | `public.refresh_referral_leaderboards()` | default | **STALE** — refreshes matviews that are now dropped (see §5B). Verify the cron is unscheduled in prod. |
| `refresh-safe-referral-leaderboards-daily` | `40 0 * * *` | `public.refresh_safe_referral_leaderboard_projections()` | default | Live — refreshes the safe physical projections |
| `flag-suspicious-referrers-daily` | `35 0 * * *` | `public.flag_suspicious_referrers()` | default | Anti-gaming (10+ refs in 1h) |
| `latency-aggregate-daily` | `10 2 * * *` | `public.latency_aggregate_daily(current_date - 1)` | default | Folds latency_events → aggregates |
| `latency-cleanup-daily` | `20 2 * * *` | `public.delete_old_latency_events()` | default | Retention reaper |
| `cleanup-ip-rate-limit` | `0 * * * *` | `public.delete_old_ip_rate_limit()` | default | Hourly reaper |
| `refresh-weekly-digest` | `0 23 * * 0` | `public.refresh_weekly_digest()` | default | Sunday 23:00 UTC = Monday 06:00 ICT |
| `web-vitals-aggregate-daily` | `50 2 * * *` | `public.aggregate_web_vitals_daily(current_date - 1)` | default | RUM data fold |
| `web-vitals-cleanup-daily` | `0 3 * * *` | `public.delete_old_web_vitals()` | default | Retention reaper |
| `slo-cleanup-daily` | `30 2 * * *` | `public.delete_old_slo_data()` | default | SLO retention reaper |

All 11 crons run as the default cron-owner role (`postgres` in Supabase), which bypasses RLS by design. No cron is wired to a role-switching invocation. The `refresh-referral-leaderboards-daily` row above is the only one that may be silently failing post-drop; worth a follow-up to unschedule it cleanly.

---

## 7. Edge functions — service-role-key cross-reference

109 functions audited under `supabase/functions/`. Of those, approximately 77 instantiate a Supabase client with `SUPABASE_SERVICE_ROLE_KEY` (RLS-bypass), and approximately 14 are configured `verify_jwt = false` in `supabase/config.toml`. The intersection — service-role + verify_jwt-off — is where attack surface concentrates.

### 7A. `verify_jwt = false` + service-role-key (highest risk)

| Function | Mitigation | Risk note |
|---|---|---|
| `stripe-webhook` | Stripe HMAC signature verification | Highest blast radius — payment mutation on profiles, subscriptions, entitlement_events, email_outbox, stripe_webhook_events. If signature verify ever fails open, arbitrary billing changes. |
| `apple-iap-sync`, `apple-server-notifications`, `revenuecat-webhook`, `google-webhook` | Provider signature/JWT | Webhooks; lower risk if signature checks are strict. |
| `redeem-gift-code` | Code uniqueness + expiry; **no per-user rate limit observed** | Anyone can POST any gift-code string. Brute-force / leaked-code redemption could grant arbitrary tier upgrades. |
| `redeem-access-code` | RPC `redeem_access_code_atomic` does the work | Same as gift codes — needs rate limit and entropy on the code. |
| `bank-transfer-orders` | Manual `Authorization` header check **inside the function body** | `verify_jwt = false` at the platform level but the code does its own JWT parse. Risk: if the code path that does the check errors silently, the platform won't catch it. Migrating to platform-level `verify_jwt = true` would be more defensive. |
| `email-broadcast`, `email-automations` | No platform auth | Service-role + verify_jwt-off + writes to email_events with reads across profiles — intended for the internal scheduler but technically callable by anyone who knows the URL. Spam / phishing risk. |
| `email-unsubscribe` | Opaque per-user token (RFC 8058 one-click) | Safe IF tokens are unguessable. Token generator entropy → §6A `generate_unsubscribe_token`. |
| `security-alert`, `send-pending-emails`, `send-redeem-email` | Internal trigger only (assumed) | Service-role + no auth. Risk is purely "is the URL externally discoverable". |

### 7B. `verify_jwt = true` + service-role-key (intentional RLS bypass, gated by user JWT)

This is the largest category — admin tooling, AI features, and content moderation. The user JWT proves identity; the function then uses service-role to do cross-user reads (e.g., admin stats over all profiles) or system-wide config reads. The pattern is sound IF the admin/owner check is enforced inside the function body. Representative entries:

`admin-management`, `admin-daily-digest`, `admin-stats`, `admin-billing-cancel-subscription`, `admin-set-tier`, `generate-gift-code`, `manage-admins`, `verify-payment-screenshot`, `ai-chat`, `adult-content-url`, `guide-assistant`, `guide-english-helper`, `guide-pronunciation-coach`, `room-chat`, `room-health-summary`, `audit-db-health`, `audit-v4-safe-shield`, `audio-storage-audit`.

Verify each admin function does an admin-level check before privileged operations. Spot-checking `admin-set-tier` and `generate-gift-code` is a reasonable starter; full audit of the ~30 admin-tier functions is a separate dispatch.

### 7C. User JWT only (no service-role, RLS-respecting)

~27 functions. The pattern is: function instantiates a Supabase client with the anon key and the user's `Authorization` header — RLS still applies. Examples: `admin-list-rooms`, `get-room`, `get-profile`, `text-to-speech`, `secure-room-loader`, `me-entitlement`, `placement-session`. These are the safest pattern; the function is effectively a thin server-side proxy over RLS-protected reads/writes.

---

## 8. Cross-reference vs Advisor backlog

| Tracker row | This audit's concrete inventory | A-side decision needed |
|---|---|---|
| `security_definer_view` | §3D — two NEEDS-REVIEW views (`vip3_public_profiles`, `v_user_pronunciation_stats`) + one INTENTIONAL (`feature_flags_public`) + eight RPC-only safe + four hardened Phase A | Verify the two NEEDS-REVIEW views, then either flip to `security_invoker = true` or ratify with comment |
| `authenticated_security_definer_function_executable` | §3B — ~15 functions, of which 8 are admin-gated (safe), 4 are self-scoped (safe), and ~6 take user-id params without enforced caller-equals-subject check (`get_admin_level`, `grant_referral_reward`, `kick_study_group_member`, `check_admin_email_rate_limit`, `referral_owner_grants_in_year`, `apply_referral_code`) | Per-function decision: add internal authz check, revoke EXECUTE, or ratify |
| `auth_leaked_password_protection` | Out of repo scope — Supabase Auth dashboard setting | Chau toggles in the Supabase dashboard |
| ~~**NEW — `public.subscriptions` no-RLS**~~ | §1 finding #1, top-of-doc | 🟢 **CLOSED** — RLS + own-row + admin-read policies shipped in !86 (`20260701000000_subscriptions_rls_select_policies.sql`); latent frontend gate mismatch closed in !100. |
| `mercy-ai rls_disabled_in_public` (not confirmed) | No matching tracker-evidence found in repo migrations | Per tracker rules, do not classify as active without exact Advisor screenshot |
| `mercy-ai sensitive_columns_exposed` (not confirmed) | No matching evidence | Same; do not classify as active |

---

## 9. Findings A-side should resolve or waive

This list is decision-shaped, not action-shaped. C-side does not apply destructive SQL; A-side / Chau decides scope per the tracker's "one MR per Critical" rule.

1. ~~**CRITICAL — `public.subscriptions` RLS enable.**~~ 🟢 **CLOSED** in !86 (`20260701000000_subscriptions_rls_select_policies.sql`, merged 2026-05-27). One-MR-per-Critical rule satisfied. Resolution detail in the top-of-doc block. Complementary frontend gate alignment closed in !100.
2. **HIGH — `security_definer_view` resolution.** Two views need a verdict; the third (`feature_flags_public`) needs a doc comment so the next audit doesn't misclassify it.
3. **HIGH — `authenticated_security_definer_function_executable` per-function decisions.** Six functions need caller-equals-subject checks or to be moved behind edge functions.
4. **MEDIUM — `record_login_attempt` rate-limit shim.** Add per-IP rate limit on the function body, or move the lockout-counter mutation behind an edge function with its own throttle.
5. **MEDIUM — `unsubscribe_by_token` entropy review.** Verify `generate_unsubscribe_token` uses a cryptographic source with ≥128 bits of entropy. If yes, mark as ratified; if no, rotate.
6. **MEDIUM — `email-broadcast` / `email-automations` auth.** Either move to `verify_jwt = true` with an admin check or add an internal-only shared-secret check.
7. **MEDIUM — `bank-transfer-orders` config alignment.** Migrate the in-code JWT check to platform-level `verify_jwt = true`.
8. **LOW — `refresh-referral-leaderboards-daily` stale cron.** Unschedule the cron now that the matviews are dropped.
9. **LOW — `auth_leaked_password_protection` dashboard toggle.** Out of repo; Chau toggles.
10. **DOC — `feature_flags` historical exposure window.** Decide whether to characterize the 2026-05-08 → 2026-06-26 PII window in a disclosure log.

---

*End of audit. This document is the diagnostic; remediation MRs are A-side's call.*
