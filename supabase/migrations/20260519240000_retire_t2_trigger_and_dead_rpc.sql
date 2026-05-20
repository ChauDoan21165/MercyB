-- 20260519240000_retire_t2_trigger_and_dead_rpc.sql
--
-- Retire T2: the dormant profiles.tier sync trigger on payment_transactions,
-- its trigger function, and the dead sibling RPC.
--
-- ORIGIN / DESIGN INPUT (every decision below is fixed there, none made here):
-- reports/DESIGN-t2-retirement-migration-A11.md (branch b70/t2-retirement-design).
-- This migration is a faithful transcription of that spec's §2 ("The
-- retirement migration — exact DDL"); it makes no design decisions of its own.
-- Evidence chain: reports/RECON-tier-trigger.md (live supabase db dump
-- 2026-05-17, §1-2, §1b, §4, §6), reports/RECON-profile-trigger-
-- architecture-B27.md §1 (T2 row) + the B63 binding-verification annotation,
-- reports/RECON-billing-target-state-B48.md W6 / P2.
--
-- PROVENANCE — THIS IS THE FIRST TRACKED MIGRATION TO TOUCH T2'S BINDING.
-- T2's trigger binding, the trigger function's original CREATE, and the
-- sibling RPC sync_profile_tier_from_latest_payment are PRODUCTION
-- SQL-EDITOR DRIFT — created in no tracked migration. The lone tracked
-- reference, 20260510010000_fix_sync_profile_tier_trigger.sql, is a
-- CREATE OR REPLACE FUNCTION hot-fix only; it contains no CREATE/DROP/ALTER
-- TRIGGER and depends on the pre-existing untracked binding by oid. The
-- "a DROP migration must pair with the CREATE migration" rule does not
-- apply: there is no CREATE migration to pair with, by definition. Adopting
-- this untracked drift into version control AT THE MOMENT OF ITS REMOVAL is
-- the correct reconciliation — the history then contains a complete account
-- of an object whose birth was out-of-band. A repo-only reviewer cannot see
-- the original drift; this block is the record so future agents do not
-- "rediscover" it as a new finding. See A11 spec §6,
-- RECON-tier-trigger.md §1, B27 §1 (T2).
--
-- WHY RETIRE (not fix): dormant by table-mismatch — neither canonical
-- real-money path (Stripe stripe-webhook, RevenueCat revenuecat-webhook)
-- ever INSERTs into payment_transactions, so for every paying user T2 never
-- fires (B27 §2-§3; the live binding is AFTER INSERT OR UPDATE OF status per
-- B63 — wider than INSERT, but the canonical paths still never touch the
-- table, so the dormancy verdict is unchanged and the DROP is event-list-
-- agnostic). Both profiles.tier readers are type-broken: the column is
-- text DEFAULT 'free' in prod, while stories/eligibility.ts (R1) and the
-- mock-interview rate-limit (R2) expect a number — they consume nothing T2
-- writes (RECON-tier-trigger §4). "Fixing" T2 would re-entrench a second
-- entitlement source of truth (B27 §5 — violates one-owner-per-function).
-- Behaviour-neutral: revenuecat-webhook still writes profiles.tier directly
-- (RECON-tier-trigger §3); the column stays a single-writer, IAP-only legacy
-- cache. Net runtime behavior change of this migration: NONE.
--
-- KEEP T1 (profiles_freeze_privileged_columns) — an orthogonal LIVE security
-- control (tracked: 20260614000000_profiles_freeze_privileged_columns.sql).
-- It is NOT touched by this migration. Post-apply check #3 below is the
-- guardrail that proves it survived. B27 §1, §3.
--
-- NOT DROPPED HERE: public._col_exists(text,text,text). Also untracked
-- drift, but a generic schema-introspection utility that may have other
-- callers this audit did not enumerate. Out of scope for T2 retirement —
-- flag for a separate drift sweep; do NOT bundle (A11 §2d).
--
-- TIMESTAMP: 20260519240000 — one slot after A17's
-- 20260519230000_create_entitlements_table.sql (branch
-- feat/entitlements-table-migration, "per A5 spec"). The parallel billing
-- workstream uses a coordinated 2026-05-19 23/24 band so retirement +
-- entitlements migrations cluster together. A11 §2d's mechanically-computed
-- ">=20260625000000" was correct for main's state on 2026-05-19; the band
-- supersedes it for cross-agent coordination. Position relative to main's
-- June migrations is immaterial: T2 retirement has no technical predecessor
-- (A11 §4a) and is applied by hand in the SQL Editor, never by
-- `supabase db push`, so lexicographic db-push reconciliation does not run.
--
-- APPLY VIA SUPABASE SQL EDITOR ONLY — Chau applies, human-reviewed first.
-- This migration is NOT auto-applied and MUST NOT be applied via
-- `supabase db push` (CLAUDE.md Git discipline; schema-drift protocol;
-- memory: project_db_schema_drift_audit, project_578_rls_applied — there
-- is NO unattended SQL/catalog path to this Supabase). Recommended apply
-- ordering: AFTER B17 PR1 / PR #774 merges (defense-in-depth per A11 §4b —
-- not a technical block; applying before #774 is safe but should be noted
-- as a deviation in the apply record).
--
-- 100% idempotent: every statement is DROP ... IF EXISTS. Safe to re-run;
-- safe if a prior partial apply already removed one object.
--
-- ---------------------------------------------------------------------------
-- PRE-APPLY — RUN THESE MANUALLY FIRST, SEPARATELY (A11 §2c, §5).
-- Agents have no pg_proc/\df path on this project; the (uuid) signature in
-- the third DROP is inferred from generated types (types.ts:10025), which
-- are accurate but could lag an overload. Chau MUST confirm the signature
-- before applying and adjust if an overload exists. IF EXISTS makes a
-- wrong-signature DROP a no-op (caught by post-check #2), not a misfire.
--
--   -- Baseline: expect trg_sync_profile_tier_from_payment present (live drift).
--   select tgname, tgenabled, tgtype,
--          (select proname from pg_proc p where p.oid = t.tgfoid) as fn
--   from pg_trigger t
--   where tgrelid = 'public.payment_transactions'::regclass
--     and not tgisinternal;
--
--   -- Overload check before the third DROP below.
--   select p.oid::regprocedure as signature, p.prosecdef
--   from pg_proc p
--   where p.proname in ('sync_profile_tier_from_payment_transactions',
--                       'sync_profile_tier_from_latest_payment');
-- ---------------------------------------------------------------------------

-- 2a. Drop the trigger binding. Table-qualified; IF EXISTS makes a prior
--     manual disable/drop in the SQL Editor a safe no-op (A11 §2a).
DROP TRIGGER IF EXISTS trg_sync_profile_tier_from_payment
  ON public.payment_transactions;

-- 2b. Drop the trigger function. RETURNS trigger => no declared args =>
--     no-arg signature. NO CASCADE BY DESIGN: after 2a there are no
--     dependents; if the catalog disagrees we want this to fail loudly
--     rather than silently drop an unknown dependent (A11 §2b; CLAUDE.md
--     "fail loud"; memory feedback_testing_discipline). Do not add CASCADE.
DROP FUNCTION IF EXISTS public.sync_profile_tier_from_payment_transactions();

-- 2c. Drop the dead sibling RPC. Same update-profiles-set-tier write, zero
--     callers — present only in generated types.ts / database.types.ts
--     (B48 W6; RECON-tier-trigger §1b). Identical dead-write-elimination
--     class; bundled with T2 to avoid a second near-identical money-path
--     migration (A11 §3 — A11's explicit recommendation; no consolidation-PR
--     step depends on when it drops). DROP matches on arg TYPE (uuid), not
--     name: sync_profile_tier_from_latest_payment(p_user_id uuid) RETURNS text
--     (types.ts:10025). FOLLOW-UP (non-blocking, NOT this migration): a
--     stale entry remains in generated types until `supabase gen types` is
--     re-run; a type entry for a non-existent function is inert.
DROP FUNCTION IF EXISTS public.sync_profile_tier_from_latest_payment(uuid);

-- ---------------------------------------------------------------------------
-- ROLLBACK (DOWN) — DOCUMENTATION ONLY. Recreating this drift is explicitly
-- NOT recommended (A11 TL;DR "Reversibility": one-way by intent — dead-write
-- elimination). A faithful runnable rollback CANNOT be provided from the
-- repo: the original trigger-binding, trigger-function body, and RPC body
-- were NEVER tracked by any migration (§6 above) — their source of truth was
-- production-only drift, now removed by intent. The lone tracked artifact
-- (20260510010000_fix_sync_profile_tier_trigger.sql) is a CREATE OR REPLACE
-- of the function body that still presupposes the untracked binding, so it
-- alone cannot restore T2. If a revert is ever truly required, reconstruct
-- from reports/RECON-tier-trigger.md §1-2 (the live 2026-05-17 db dump) under
-- human review — but per A11 this re-introduces the B27 §5 two-source-of-
-- truth defect and should not be done.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- POST-APPLY VERIFICATION (A11 §5) — runnable read-only SELECTs; Chau eyeballs
-- the result sets after the DROPs above execute in the SQL Editor. Agents
-- have no pg_trigger/pg_proc path, so this is Chau-run, not agent-verified.
-- ---------------------------------------------------------------------------

-- 1. Trigger gone from payment_transactions  -- EXPECT: 0 rows
select tgname
from pg_trigger
where tgrelid = 'public.payment_transactions'::regclass
  and tgname = 'trg_sync_profile_tier_from_payment'
  and not tgisinternal;

-- 2. Both functions gone  -- EXPECT: 0 rows
select proname, oid::regprocedure as signature
from pg_proc
where proname in ('sync_profile_tier_from_payment_transactions',
                  'sync_profile_tier_from_latest_payment');

-- 3. CRITICAL GUARDRAIL — T1 freeze trigger STILL present (must NOT have
--    been collateral-damaged).  -- EXPECT: exactly 1 row, tgenabled = 'O'
--    If this returns 0 rows: STOP — something dropped T1; do not proceed.
select tgname, tgenabled
from pg_trigger
where tgrelid = 'public.profiles'::regclass
  and tgname like '%freeze_privileged_columns%'
  and not tgisinternal;
