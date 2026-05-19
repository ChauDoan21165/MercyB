-- =============================================================================
-- Revoke anon (and where appropriate, authenticated) SELECT on internal views
-- =============================================================================
--
-- WHY
-- Postgres views execute with the *view owner's* privileges (not
-- security_invoker), so a view owned by `postgres` over an RLS-protected base
-- table BYPASSES that RLS. Combined with the default Supabase `anon` SELECT
-- grant, the views below leaked billing / admin / analytics data to anyone
-- holding the public anon key (it ships in the browser bundle).
--
-- Source: RLS audit 2026-05-18 (/private/tmp/rls-policies-audit.md). These
-- views are NOT in repo migrations (prod-ahead drift); this file is the parity
-- record so source-of-truth and prod converge going forward.
--
-- SAFETY
-- * Idempotent: REVOKE/GRANT of an absent privilege is a no-op; each statement
--   is guarded by to_regclass so a missing relation is skipped, not fatal.
-- * service_role is preserved (and explicitly re-granted) so edge functions
--   (admin-billing-metrics, delete-account) and server paths keep working —
--   verified those use SUPABASE_SERVICE_ROLE_KEY.
-- * NOT in scope (intentional public content — verified, do NOT revoke):
--     weekly_digest_data  (migration 20260517000000: public-read RLS policy;
--                           powers the public /blog WeeklyDigest page)
--     pronunciation_challenges, listening_clips, writing_prompts, feature_flags
--     certificate_types   (reference data; separate low-pri review, not here)
--
-- Apply order: this file is the repo parity record. The same statements must
-- be run in the Supabase SQL Editor (project convention: GRANT/REVOKE are not
-- applied via `db push`). See the PR body for the paste-ready block.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- GROUP A — service_role / admin-only. Frontend never queries these via the
-- browser client (0 src/ references); revoke from BOTH anon and authenticated.
-- ---------------------------------------------------------------------------
do $$
declare
  v text;
  group_a text[] := array[
    'billing_subscription_events_v',
    'billing_active_subscriptions_v',
    'billing_mrr_inputs_v',
    'billing_recent_subscription_changes_v',
    'admin_mrr_snapshot',
    'admin_revenue_risk_snapshot',
    'mercy_feedback_insights',
    'mercy_feedback_prompt_summary',
    'v_analytics_user_cohorts',
    'v_analytics_room_popularity',
    'v_analytics_cohort_retention_daily',
    'v_analytics_daily_active_users',
    'v_analytics_user_funnel'
  ];
begin
  foreach v in array group_a loop
    if to_regclass('public.' || v) is null then
      raise notice 'skip (absent): public.%', v;
      continue;
    end if;
    execute format('revoke select on public.%I from anon', v);
    execute format('revoke select on public.%I from authenticated', v);
    -- defensive: guarantee server paths (edge fns / BI) keep read access
    execute format('grant select on public.%I to service_role', v);
    raise notice 'group A locked (service_role only): public.%', v;
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- GROUP B — queried by the frontend as an AUTHENTICATED user. Revoke anon
-- ONLY; keep authenticated (an explicit GRANT makes re-runs self-healing).
--   admin_users_dashboard_v1   -> AdminUsersPage.tsx:718 (admin, authenticated)
--   v_user_pronunciation_stats -> speechHistory.getUserStats() (self-scoped
--                                 by auth.uid(); .maybeSingle over GROUP BY
--                                 user_id)
-- NOTE (follow-up, NOT this PR): both still bypass RLS for *any* authenticated
-- user. admin_users_dashboard_v1 needs an internal get_admin_level()>=9 guard
-- (or move to the SECURITY DEFINER RPC the page already has) and/or
-- security_invoker; v_user_pronunciation_stats should be confirmed
-- self-scoping. Tracked in the PR body.
-- ---------------------------------------------------------------------------
do $$
declare
  v text;
  group_b text[] := array[
    'admin_users_dashboard_v1',
    'v_user_pronunciation_stats'
  ];
begin
  foreach v in array group_b loop
    if to_regclass('public.' || v) is null then
      raise notice 'skip (absent): public.%', v;
      continue;
    end if;
    execute format('revoke select on public.%I from anon', v);
    execute format('grant select on public.%I to authenticated', v);
    execute format('grant select on public.%I to service_role', v);
    raise notice 'group B locked (authenticated + service_role): public.%', v;
  end loop;
end $$;
