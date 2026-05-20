-- 20260519230000_create_entitlements_table.sql
--
-- Create public.entitlements — the single materialised answer to
-- "is this user entitled?". ONE row per (user_id, app_id), written ONLY
-- by the future server-side recomputeEntitlement(userId) (service-role),
-- read ONLY by loadEntitlement(userId, appId).
--
-- Origin / design input (every decision below is fixed there, none made
-- here): reports/RECON-entitlements-table-schema-A5.md (D1 design recon,
-- branch b67/entitlements-schema-spec). This migration is a faithful
-- transcription of that spec's §"Schema — SQL DDL"; it makes no schema
-- decisions of its own. Upstream chain: B48 target-state invariants 1–3,
-- B13 two-derivation class of bug.
--
-- Why a materialised table (not derive-on-read): is_premium is a
-- GENERATED ALWAYS … STORED column — it is structurally impossible for
-- is_premium to disagree with status, which is exactly the B13 class of
-- bug (two copies of the premium derivation drifting). The schema
-- enforces the invariant the code kept failing to.
--
-- APPLY VIA SUPABASE SQL EDITOR ONLY — Chau applies, human-reviewed
-- first (CLAUDE.md Git discipline; D6 / locked #4; memory:
-- agent-infra-access, db-schema-drift-audit — there is NO unattended
-- SQL/catalog path to this Supabase). This migration is NOT auto-applied
-- and MUST NOT be applied via `supabase db push`. Backfill
-- (recomputeEntitlement for every profile) is a SEPARATE, later step in
-- the gated implementation dispatch — see the spec §"Backfill plan";
-- this migration creates the empty table only.
--
-- 100% idempotent and stage-safe: every statement is CREATE … IF NOT
-- EXISTS, DROP … IF EXISTS + CREATE, CREATE OR REPLACE, or an
-- inherently re-runnable GRANT / ENABLE RLS / COMMENT. Each block below
-- is independent and may be run on its own; the whole file may be
-- re-run against a database that already has the table with no error
-- and no change. (Postgres has NO `CREATE POLICY IF NOT EXISTS` in any
-- version, including PG16 — the DROP POLICY IF EXISTS + CREATE POLICY
-- pair is the established repo idempotency pattern, used by 17 prior
-- migrations; this migration follows it, per the spec's own DDL.)
--
-- Rollback (DOWN) — documentation only; run manually if reverting.
-- The table stores nothing not re-derivable from subscriptions +
-- user_subscriptions, so dropping it is lossless (spec §Rollback).
-- Prefer the read-flip / stop-writing tiers in the spec before DROP;
-- only after ≥1 stable release of derive-on-read, Chau-applied:
--   DROP TRIGGER  IF EXISTS entitlements_touch_updated_at ON public.entitlements;
--   DROP FUNCTION IF EXISTS public.entitlements_touch_updated_at();
--   DROP TABLE    IF EXISTS public.entitlements;  -- cascades its indexes/policy

-- ── public.entitlements ──────────────────────────────────────────────
-- ONE materialised row per (user_id, app_id). The single answer to
-- "is this user entitled?". Written ONLY by the server-side
-- recomputeEntitlement(userId) (service-role). Read ONLY by
-- loadEntitlement(userId, appId). A derived projection of
-- `subscriptions` (+ gift source) — holds nothing not re-derivable
-- from upstream truth (this is what makes rollback lossless).

create table if not exists public.entitlements (
  user_id      uuid        not null
                 references public.profiles(id) on delete cascade,

  -- Single-valued ('mercy_blade') in prod today; multi-tenant-capable.
  -- Default keeps every existing .eq("app_id", …) call site working.
  app_id       text        not null default 'mercy_blade',

  -- Full canonical status (read-side shape, not the write-side binary).
  -- CHECK mirrors subscriptions.status + 'inactive' (entitlement.ts
  -- CanonicalStatus). text+CHECK, not ENUM — see spec §Design decision 2.
  status       text        not null default 'inactive'
                 check (status in (
                   'active','trialing','grace_period','past_due',
                   'paused','expired','revoked','inactive')),

  -- Includes 'gift_code' (entitlement.ts CanonicalSource) so a
  -- gift-derived entitlement is representable regardless of D3 timing.
  -- NULL when status is non-entitling / no winner row.
  source       text        null
                 check (source is null or source in (
                   'stripe','apple','google','gift_code')),

  expires_at   timestamptz null,

  -- The B13-killer: is_premium can NEVER drift from status because it
  -- is not written — it is computed by the engine. Single source of the
  -- premium predicate (= isPremiumStatus, entitlement.ts:153-160).
  is_premium   boolean     not null
                 generated always as (
                   status in ('active','trialing','grace_period','past_due')
                 ) stored,

  -- Liveness: bumped by recomputeEntitlement on EVERY run, even a no-op
  -- recompute. "When did we last check?" → B7 staleness monitoring.
  computed_at  timestamptz not null default timezone('utc', now()),

  -- Audit: bumped by trigger ONLY when (status,source,expires_at)
  -- actually changes. "When did the answer last change?"
  updated_at   timestamptz not null default timezone('utc', now()),

  primary key (user_id, app_id)
);

-- ── Indexes ──────────────────────────────────────────────────────────
-- Read pattern is "by user_id" → the PK's leftmost column already
-- serves equality + prefix scans on user_id; loadEntitlement does
-- `where user_id = $1 and app_id = $2` which is a pure PK point-get.
-- NO standalone user_id index needed (would duplicate the PK prefix).
-- Write pattern is single-row UPSERT on the PK → also covered.

-- MRR / "how many users are entitled" (B7 Q1/Q4 safety-net query):
create index if not exists entitlements_is_premium_idx
  on public.entitlements (app_id)
  where is_premium;

-- Staleness sweep (B7 safety-net: rows not recomputed in N hours →
-- a stuck/missing write path is now observable, not silent):
create index if not exists entitlements_computed_at_idx
  on public.entitlements (computed_at);

-- ── RLS — users read own row only, service-role writes ───────────────
alter table public.entitlements enable row level security;

-- Dual lock (defense in depth — the profiles-freeze lesson:
-- 20260614000000_* proved table-level GRANTs are the real risk surface):
--   (1) no write policy for `authenticated`
--   (2) no write GRANT for `authenticated`
-- recomputeEntitlement uses the service-role key → bypasses RLS.
-- anon has neither grant nor policy → no access at all.
grant select on public.entitlements to authenticated;
-- (deliberately NO insert/update/delete grant to authenticated)

drop policy if exists entitlements_select_own on public.entitlements;
create policy entitlements_select_own
  on public.entitlements
  for select
  to authenticated
  using (auth.uid() = user_id);

-- ── updated_at maintenance (value-change only) ───────────────────────
-- computed_at is set explicitly by recomputeEntitlement each run.
-- updated_at moves only on a real delta, so it is a true change clock.
create or replace function public.entitlements_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  if new.status   is distinct from old.status
  or new.source   is distinct from old.source
  or new.expires_at is distinct from old.expires_at then
    new.updated_at := timezone('utc', now());
  else
    new.updated_at := old.updated_at;
  end if;
  return new;
end;
$$;

drop trigger if exists entitlements_touch_updated_at on public.entitlements;
create trigger entitlements_touch_updated_at
  before update on public.entitlements
  for each row
  execute function public.entitlements_touch_updated_at();

comment on table public.entitlements is
  'Single materialised answer to "is this user entitled?". One row per '
  '(user_id, app_id). Server-write-only (recomputeEntitlement, '
  'service-role). Derived projection of subscriptions (+ gift source); '
  'losslessly rebuildable. is_premium is GENERATED — cannot drift from '
  'status (closes the B13 two-derivation class). See '
  'reports/RECON-entitlements-table-schema-A5.md.';

-- ── Verify block (OPTIONAL — commented; run manually after apply) ─────
-- psql:
--   \d entitlements
--
-- Supabase SQL Editor (web — \d is a psql meta-command and does NOT run
-- there; use these instead):
--   SELECT column_name, data_type, is_nullable, column_default,
--          is_generated, generation_expression
--     FROM information_schema.columns
--    WHERE table_schema = 'public' AND table_name = 'entitlements'
--    ORDER BY ordinal_position;
--
--   SELECT * FROM pg_policies WHERE tablename = 'entitlements';
--
--   -- Generated column present + RLS on + grants as designed:
--   SELECT relrowsecurity AS rls_enabled
--     FROM pg_class WHERE oid = 'public.entitlements'::regclass;
--   SELECT grantee, privilege_type
--     FROM information_schema.role_table_grants
--    WHERE table_schema = 'public' AND table_name = 'entitlements';
--   -- Expect: authenticated → SELECT only (no INSERT/UPDATE/DELETE);
--   --         no anon grant at all.
