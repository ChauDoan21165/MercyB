-- 20260519250000_create_recompute_entitlement_tx_rpc.sql
--
-- Create public.recompute_entitlement_tx — the atomic two-table write
-- target invoked by the future server-side recomputeEntitlement(userId)
-- writer (Deno edge function, service-role key). Resolves A8d gap #2f.
--
-- Origin / design input (every decision below is fixed there, none made
-- here): reports/RECON-recompute-entitlement-impl-brief-A18.md §6
-- "Write — one upsert + the monotonic guard" (branch
-- a18/recompute-impl-brief, commit c56663e7d), which in turn cites
-- RECON-recompute-entitlement-design-B68.md §4 + §6 + O2 (the design)
-- and RECON-entitlements-table-schema-A5.md §"Relationship to
-- profiles" (the table spec). This migration is a faithful
-- transcription of those decisions; it makes no design choices of
-- its own.
--
-- Upstream chain: A18 brief §6 mandates this RPC because the Deno
-- edge runtime has no cross-table transaction primitive; the writer
-- needs the entitlements UPSERT and the legacy profiles.premium_*
-- projection (B48 invariant 1) to commit together or not at all. A
-- two-call edge implementation can drift on partial failure (B68 §7
-- row 5: "stale projection = critical drift") — the RPC closes that
-- class structurally.
--
-- Hard predecessor: PR #789's 20260519230000_create_entitlements_table.sql
-- MUST be applied first. This migration references public.entitlements
-- columns by name and writes into the table; it will fail with a
-- relation-not-found if the table does not yet exist. Apply order:
--   1. #789  (table)         - 20260519230000
--   2. #792  (T2 retirement) - 20260519240000  (orthogonal, A11 spec)
--   3. THIS  (RPC)           - 20260519250000  (only this requires #789 first)
--
-- APPLY VIA SUPABASE SQL EDITOR ONLY — Chau applies, human-reviewed
-- first (CLAUDE.md Git discipline; D6 / locked #4; memory:
-- agent-infra-access, db-schema-drift-audit — there is NO unattended
-- SQL/catalog path to this Supabase). This migration is NOT
-- auto-applied and MUST NOT be applied via `supabase db push`.
--
-- 100% idempotent and stage-safe: `create or replace function` is
-- inherently re-runnable; `revoke … from public, anon, authenticated`
-- and `grant execute … to service_role` are both idempotent. The
-- whole file may be re-run with no error and no change.
--
-- Rollback (DOWN) — documentation only; run manually if reverting.
-- The function has no persisted state; dropping it is lossless. Any
-- in-flight A18 writer that still calls it will start failing with
-- "function does not exist" — that is the intended fail-loud signal
-- (B68 §7 forbids silent swallowing).
--   REVOKE EXECUTE ON FUNCTION public.recompute_entitlement_tx(
--     uuid, text, text, text, timestamptz, timestamptz) FROM service_role;
--   DROP FUNCTION IF EXISTS public.recompute_entitlement_tx(
--     uuid, text, text, text, timestamptz, timestamptz);

-- ── public.recompute_entitlement_tx ──────────────────────────────────
-- Atomic two-table write:
--   (1) INSERT … ON CONFLICT DO UPDATE WHERE computed_at-monotonic into
--       public.entitlements (PK = user_id, app_id). The monotonic guard
--       on computed_at makes a stale recompute a no-op rather than a
--       clobber, per A18 brief §6 / B68 §6 / O4.
--   (2) UPDATE the legacy public.profiles.premium_* projection from
--       the AUTHORITATIVE entitlements row (re-read after step 1, so
--       the projection reflects what survived the monotonic guard —
--       not the stale input that may have lost the race). This closes
--       the drift class B68 §7 row 5 calls out.
--
-- Inputs are the DERIVED snapshot produced by deriveEntitlement() in
-- supabase/functions/_shared/entitlement.ts (PR #802, on origin/main).
-- The RPC does NOT re-derive in SQL — that would create a second
-- derivation owner and re-introduce the B13 two-derivation bug class
-- (B68 O1: single ownership of derive = B13 phase 3). All inference
-- (status normalization, expiry rule, gift-fallback merge, winner
-- selection) stays in JS where it is unit-tested.
--
-- is_premium is DELIBERATELY NOT a parameter and is NOT written —
-- entitlements.is_premium is GENERATED ALWAYS … STORED from status
-- (#789 lines 85-88). The same generation expression is used to
-- project to profiles.premium_status below (see legacy mapping).
-- updated_at on entitlements is owned by the value-change trigger
-- entitlements_touch_updated_at (#789 lines 140-160) — not written
-- here.

create or replace function public.recompute_entitlement_tx(
  p_user_id      uuid,
  p_app_id       text,
  p_status       text,
  p_source       text,
  p_expires_at   timestamptz,
  p_computed_at  timestamptz
) returns public.entitlements
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_row public.entitlements;
begin
  -- (1) Monotonic UPSERT into the canonical materialised entitlements
  -- row. The WHERE clause on DO UPDATE is the monotonic guard — a
  -- recompute carrying an older computed_at is a no-op, NOT a
  -- clobber. RETURNING captures the row that was actually written;
  -- it is NULL when the conflict resolution rejected the update.
  insert into public.entitlements (
    user_id, app_id, status, source, expires_at, computed_at
  ) values (
    p_user_id, p_app_id, p_status, p_source, p_expires_at, p_computed_at
  )
  on conflict (user_id, app_id) do update
    set status      = excluded.status,
        source      = excluded.source,
        expires_at  = excluded.expires_at,
        computed_at = excluded.computed_at
    where excluded.computed_at >= public.entitlements.computed_at
  returning * into v_row;

  -- (2) If the monotonic guard rejected our write, re-read whatever
  -- IS in the table — the legacy projection must reflect THAT, not
  -- our stale inputs. (If we projected p_status to profiles while
  -- the entitlements table held a fresher answer, profiles would
  -- silently regress — exactly the drift this RPC exists to prevent.)
  if v_row.user_id is null then
    select * into v_row
      from public.entitlements
     where user_id = p_user_id
       and app_id  = p_app_id;

    -- Extremely unlikely race: the row was concurrently deleted between
    -- our INSERT…ON CONFLICT attempt and this re-read. The
    -- on-delete-cascade on entitlements.user_id (#789 line 59) means
    -- the profile is also gone — no projection target exists. Return
    -- a null composite so the JS caller can handle / log it (B68 §7
    -- failure routing); do NOT swallow.
    if v_row.user_id is null then
      return null;
    end if;
  end if;

  -- (3) Legacy projection into public.profiles.premium_* (B48
  -- invariant 1 — legacy/UI convenience, NEVER authoritative).
  -- Profiles' CHECK constraints accept a narrower taxonomy than
  -- entitlements:
  --   profiles.premium_status  CHECK in ('active','inactive')
  --   profiles.premium_source  CHECK in ('stripe','apple','google') or NULL
  -- so we MAP:
  --   premium_status := v_row.is_premium ? 'active' : 'inactive'
  --                    (uses the GENERATED column, structurally
  --                     consistent with entitlements.status)
  --   premium_source := keep if in ('stripe','apple','google'), else NULL
  --                    (gift_code is not representable on profiles —
  --                     premium_status still flips correctly on is_premium,
  --                     so the user-facing premium gate is unaffected)
  --   premium_expires_at := v_row.expires_at  (no taxonomy)
  --
  -- The profiles_freeze_privileged_columns BEFORE UPDATE trigger
  -- (20260614000000) reverts authenticated-role writes to these
  -- columns; service_role / SQL Editor are exempt by the trigger's
  -- own jwt.claim.role check. The RPC's SECURITY DEFINER does NOT
  -- change request.jwt.claim.role — when invoked via PostgREST with
  -- the service-role key, claim.role = 'service_role' and the freeze
  -- passes; when invoked from SQL Editor, claim.role is NULL and the
  -- freeze passes. Either path: this UPDATE is honored.
  update public.profiles
     set premium_status     = case when v_row.is_premium
                                   then 'active'
                                   else 'inactive' end,
         premium_source     = case when v_row.source
                                     in ('stripe','apple','google')
                                   then v_row.source
                                   else null end,
         premium_expires_at = v_row.expires_at
   where id = p_user_id;

  -- (4) Return the authoritative row for the caller. JS recomputeEntitlement
  -- returns this directly to its caller (no second read needed).
  return v_row;
end;
$$;

-- ── Permissions — service-role only ──────────────────────────────────
-- Default behavior of CREATE FUNCTION is GRANT EXECUTE to PUBLIC. Revoke
-- it explicitly, then grant only to service_role. The RPC writes to two
-- different RLS-protected tables and bypasses RLS via SECURITY DEFINER;
-- exposing it to anon or authenticated would re-open the privilege
-- escalation class that profiles_freeze_privileged_columns just closed.
revoke execute on function public.recompute_entitlement_tx(
  uuid, text, text, text, timestamptz, timestamptz
) from public;
revoke execute on function public.recompute_entitlement_tx(
  uuid, text, text, text, timestamptz, timestamptz
) from anon;
revoke execute on function public.recompute_entitlement_tx(
  uuid, text, text, text, timestamptz, timestamptz
) from authenticated;

grant execute on function public.recompute_entitlement_tx(
  uuid, text, text, text, timestamptz, timestamptz
) to service_role;

comment on function public.recompute_entitlement_tx(
  uuid, text, text, text, timestamptz, timestamptz
) is
  'Atomic two-table write target for the server-side recomputeEntitlement '
  'writer (A18). Monotonic UPSERT into public.entitlements + projection '
  'into public.profiles.premium_*. Inputs are the derived snapshot from '
  'deriveEntitlement() in _shared/entitlement.ts (PR #802); the RPC does '
  'NOT re-derive (single derive owner = B13 phase 3, B68 O1). service_role '
  'only. See reports/RECON-recompute-entitlement-impl-brief-A18.md §6.';

-- ── Verify block (OPTIONAL — commented; run manually after apply) ─────
-- Supabase SQL Editor (web). All read-only.
--
--   -- (a) Function exists with the expected 6-arg signature
--   SELECT n.nspname AS schema,
--          p.proname AS name,
--          pg_catalog.pg_get_function_identity_arguments(p.oid) AS args,
--          pg_catalog.pg_get_function_result(p.oid) AS returns,
--          p.prosecdef AS security_definer
--     FROM pg_catalog.pg_proc p
--     JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
--    WHERE n.nspname = 'public'
--      AND p.proname = 'recompute_entitlement_tx';
--   -- expect: schema=public, name=recompute_entitlement_tx,
--   --         args="p_user_id uuid, p_app_id text, p_status text,
--   --               p_source text, p_expires_at timestamp with time zone,
--   --               p_computed_at timestamp with time zone",
--   --         returns=public.entitlements, security_definer=t
--
--   -- (b) Search_path is locked
--   SELECT proconfig
--     FROM pg_catalog.pg_proc p
--     JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
--    WHERE n.nspname = 'public'
--      AND p.proname = 'recompute_entitlement_tx';
--   -- expect: {"search_path=public, pg_temp"}
--
--   -- (c) Execute grants — service_role only
--   SELECT grantee, privilege_type
--     FROM information_schema.role_routine_grants
--    WHERE specific_schema = 'public'
--      AND routine_name    = 'recompute_entitlement_tx'
--    ORDER BY grantee;
--   -- expect: ONE row — grantee=service_role, privilege_type=EXECUTE.
--   -- (no PUBLIC, no anon, no authenticated)
--
--   -- (d) Smoke test — service_role only; do NOT run unless explicitly
--   -- testing. Picks a real user_id from profiles for a no-op
--   -- recompute (same values, fresh computed_at). Wrap in
--   -- BEGIN; … ROLLBACK; so it never persists.
--   --
--   -- BEGIN;
--   -- SELECT * FROM public.recompute_entitlement_tx(
--   --   p_user_id     => '<some-real-user-uuid>'::uuid,
--   --   p_app_id      => 'mercy_blade',
--   --   p_status      => 'inactive',
--   --   p_source      => null,
--   --   p_expires_at  => null,
--   --   p_computed_at => now()
--   -- );
--   -- ROLLBACK;
--   -- expect: ONE row of public.entitlements; if a row pre-existed
--   --        with a fresher computed_at, the returned row is the
--   --        pre-existing one (monotonic guard worked).
