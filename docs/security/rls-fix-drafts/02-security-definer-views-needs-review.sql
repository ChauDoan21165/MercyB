-- ─────────────────────────────────────────────────────────────────────────
-- DRAFT — DO NOT APPLY FROM THIS LOCATION
-- ─────────────────────────────────────────────────────────────────────────
-- This file lives in docs/security/rls-fix-drafts/, NOT in
-- supabase/migrations/. See ./README.md.
--
-- Finding: !84 §3D — "Views without explicit security_invoker = true"
-- Tracker: security_definer_view (Advisor backlog item)
-- ─────────────────────────────────────────────────────────────────────────
--
-- Audit correction
-- ----------------
-- !84 §3D listed TWO NEEDS-REVIEW views: `vip3_public_profiles` and
-- `v_user_pronunciation_stats`.
--
-- On re-inspection for this drafting pass, `vip3_public_profiles` was
-- ALREADY hardened on 2025-12-07. Migration
--   supabase/migrations/20251207003729_ae21e160-240f-4f6b-b46b-c7d8de42cec7.sql
-- explicitly drops the old SECURITY DEFINER form and recreates with
-- `WITH (security_invoker = true)` — the file's own header comment
-- says: "Drop the security definer view and recreate as SECURITY
-- INVOKER (default)".
--
-- !84 §3D should be amended to list only `v_user_pronunciation_stats`.
-- The fix README in this directory tracks the correction.
--
-- Background — v_user_pronunciation_stats
-- ---------------------------------------
-- Defined in supabase/migrations/20260426000000_speech_attempts_persistence.sql:97.
-- Aggregates per-user 7/30/90-day attempt counts and median elapsed_ms
-- from public.speech_attempts. The migration's own header comment says:
--   "View inherits RLS from the base table. Authenticated users see
--    only their own aggregated row; level-9+ admins see everyone (via
--    the new …)"
-- That intent only holds if `security_invoker = true`. On Postgres 15+
-- the view defaults to `security_invoker = false`, meaning it executes
-- as the view owner (postgres) — bypassing RLS on speech_attempts.
--
-- Risk of applying THIS migration
-- -------------------------------
-- - LOW. The view's intent (per its header comment) was already to
--   inherit RLS; this fix just makes the intent operative.
-- - The base table public.speech_attempts has its own RLS policies; verify
--   they exist before flipping (a CHECK QUERY at the bottom of this
--   file does this).
-- - The view continues to return the same columns; only the access path
--   changes.

-- ── Step 1. Re-create v_user_pronunciation_stats with security_invoker ──
-- CREATE OR REPLACE VIEW does NOT change the `security_invoker` option
-- if it was set when the view was created. The clean path is DROP +
-- CREATE; the WITH () clause must be present on creation.

DROP VIEW IF EXISTS public.v_user_pronunciation_stats;

CREATE VIEW public.v_user_pronunciation_stats
WITH (security_invoker = true)
AS
WITH base AS (
  SELECT
    user_id,
    overall_score,
    attempted_at,
    elapsed_ms
  FROM public.speech_attempts
  WHERE overall_score IS NOT NULL
    AND attempted_at > now() - interval '90 days'
)
SELECT
  user_id,
  COUNT(*)                                                              AS attempts_90d,
  ROUND(AVG(overall_score))::integer                                    AS avg_score_90d,
  COUNT(*) FILTER (WHERE attempted_at > now() - interval '30 days')     AS attempts_30d,
  ROUND(AVG(overall_score) FILTER (WHERE attempted_at > now() - interval '30 days'))::integer AS avg_score_30d,
  COUNT(*) FILTER (WHERE attempted_at > now() - interval '7 days')      AS attempts_7d,
  ROUND(AVG(overall_score) FILTER (WHERE attempted_at > now() - interval '7 days'))::integer  AS avg_score_7d,
  MAX(attempted_at)                                                     AS last_attempt_at,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY elapsed_ms)
    FILTER (WHERE elapsed_ms IS NOT NULL AND elapsed_ms > 0)            AS median_elapsed_ms_90d
FROM base
GROUP BY user_id;

COMMENT ON VIEW public.v_user_pronunciation_stats IS
  'Per-user pronunciation aggregate (7/30/90d windows). security_invoker = '
  'true so the view inherits RLS from public.speech_attempts. '
  'Hardened by !84 follow-up after audit found implicit security_invoker = '
  'false on PG15+ would have bypassed base-table RLS.';

-- ── Re-grant SELECT (DROP removed table-level grants) ──────────────────
-- v_user_pronunciation_stats existing grants:
--   GRANT SELECT ON public.v_user_pronunciation_stats TO authenticated;
-- We re-issue here.

GRANT SELECT ON public.v_user_pronunciation_stats TO authenticated;

-- ── Verification (run before AND after apply) ──────────────────────────
-- 0. Pre-apply: confirm base table has RLS enabled with at least one
--    SELECT policy for `authenticated`. If not, this fix would lock
--    authenticated users OUT of their own stats — abort and fix base
--    table first.
--   SELECT polname, polcmd, polroles::regrole[]
--     FROM pg_policy
--    WHERE polrelid = 'public.speech_attempts'::regclass
--      AND polcmd = 'r';
--   Expect at least one row.
--
-- 1. Post-apply: view's security_invoker flag is true.
--   SELECT reloptions FROM pg_class
--    WHERE relname = 'v_user_pronunciation_stats'
--      AND relnamespace = 'public'::regnamespace;
--   Expect '{security_invoker=true}' (or similar).
--
-- 2. Post-apply: authenticated user reads their own row.
--   (As user A) SELECT * FROM public.v_user_pronunciation_stats
--                WHERE user_id = auth.uid();
--   Expect ≤ 1 row.
--   (As user A) SELECT count(*) FROM public.v_user_pronunciation_stats
--                WHERE user_id != auth.uid();
--   Expect 0 (filtered by base-table RLS via security_invoker).
--
-- 3. Post-apply: level-9+ admin sees everyone (if base-table RLS has an
--    admin policy).
