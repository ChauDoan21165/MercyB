-- =============================================================================
-- Revoke anon SELECT on RESIDUAL public views (sweep follow-up to #676)
-- =============================================================================
--
-- WHY
-- Postgres views run with the *view owner's* privileges unless created
-- `WITH (security_invoker = true)`. A `postgres`-owned view over an
-- RLS-protected base table therefore BYPASSES that RLS, and Supabase's default
-- `anon` SELECT grant makes the result readable by anyone holding the public
-- anon key (it ships in the browser bundle).
--
-- #676 (20260618000000_revoke_anon_on_internal_views.sql, merged) locked the
-- billing / admin / analytics views it had evidence for. This migration
-- finishes the sweep over every remaining `public` view so that anon is
-- revoked *by default*, and adds a dynamic catch-all so prod-ahead drift views
-- (definitions not in repo migrations) are covered too.
--
-- SAFETY
-- * Idempotent: REVOKE of an absent privilege is a no-op; the explicit lists
--   are `to_regclass`-guarded so a missing relation is skipped, not fatal.
-- * service_role is preserved (re-granted) so edge functions / BI keep read
--   access (all internal views are consumed server-side only — 0 src/ refs).
-- * Catch-all touches `anon` ONLY (never `authenticated`), so it cannot break
--   an unknown live authenticated feature — it only closes the anon hole.
-- * INTENTIONAL PUBLIC — allowlisted, never revoked (verified, #676 + memory):
--     weekly_digest_data  (20260517000000 public-read RLS; powers /blog).
--     pronunciation_challenges, listening_clips, writing_prompts,
--     feature_flags, certificate_types  (public reference data; these are
--     base tables, listed for parity with #676's allowlist intent).
--
-- Apply order: repo parity record. The SAME statements must be run in the
-- Supabase SQL Editor (project convention: GRANT/REVOKE are NOT applied via
-- `db push`). The full file is the paste-ready block (see PR body).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- GROUP A (residual) — internal / admin / analytics. 0 src/ browser refs
-- (only generated FK metadata in supabase/types.ts). Server-side only.
-- Revoke from BOTH anon and authenticated; service_role keeps SELECT.
--   daily_feedback_summary          feedback rollup (admin/BI)
--   room_health_view                content-health rollup (admin)
--   v_analytics_feature_usage_7d    analytics (admin dashboards / BI)
--   v_analytics_l1_rule_effectiveness  analytics
--   v_analytics_weakness_trends_weekly analytics
-- ---------------------------------------------------------------------------
do $$
declare
  v text;
  group_a text[] := array[
    'daily_feedback_summary',
    'room_health_view',
    'v_analytics_feature_usage_7d',
    'v_analytics_l1_rule_effectiveness',
    'v_analytics_weakness_trends_weekly'
  ];
begin
  foreach v in array group_a loop
    if to_regclass('public.' || v) is null then
      raise notice 'skip (absent): public.%', v;
      continue;
    end if;
    execute format('revoke all on public.%I from anon', v);
    execute format('revoke all on public.%I from authenticated', v);
    execute format('grant select on public.%I to service_role', v);
    raise notice 'group A locked (service_role only): public.%', v;
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- GROUP B (residual) — queried by AUTHENTICATED users. Revoke anon only;
-- keep authenticated (explicit GRANT makes re-runs self-healing).
--   vip3_public_profiles  Level-3 matchmaking directory. Created
--     `WITH (security_invoker = true)` over profiles and gated by
--     is_vip3_user(auth.uid()) — it RESPECTS caller RLS (not a bypass), and
--     anon (no auth.uid()) sees nothing anyway; revoke anon as defense-in-depth.
-- ---------------------------------------------------------------------------
do $$
declare
  v text;
  group_b text[] := array[
    'vip3_public_profiles'
  ];
begin
  foreach v in array group_b loop
    if to_regclass('public.' || v) is null then
      raise notice 'skip (absent): public.%', v;
      continue;
    end if;
    execute format('revoke all on public.%I from anon', v);
    execute format('grant select on public.%I to authenticated', v);
    execute format('grant select on public.%I to service_role', v);
    raise notice 'group B locked (authenticated + service_role): public.%', v;
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- GROUP C — dynamic catch-all. Sweep EVERY public view; revoke anon SELECT
-- (anon-only — never touches authenticated) on any view not in the
-- intentional-public allowlist. Closes prod-ahead drift views whose
-- definitions are not in repo migrations. Idempotent over #676 + Groups A/B.
-- ---------------------------------------------------------------------------
do $$
declare
  r record;
  allow text[] := array[
    'weekly_digest_data',        -- public /blog — NEVER revoke
    'pronunciation_challenges',  -- public reference data
    'listening_clips',           -- public reference data
    'writing_prompts',           -- public reference data
    'feature_flags',             -- public reference data
    'certificate_types'          -- public reference data
  ];
begin
  for r in
    select table_name
    from information_schema.views
    where table_schema = 'public'
  loop
    if r.table_name = any(allow) then
      raise notice 'skip (intentional public): public.%', r.table_name;
      continue;
    end if;
    execute format('revoke all on public.%I from anon', r.table_name);
    raise notice 'catch-all: anon revoked on public.%', r.table_name;
  end loop;
end $$;
