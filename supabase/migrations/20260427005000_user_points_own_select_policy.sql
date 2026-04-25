-- Fix: user_points 403 Forbidden on client SELECT.
--
-- Symptom (prod console):
--   GET /rest/v1/user_points?select=total_points&user_id=eq.XXX  → 403
--
-- Root cause:
--   `user_points` has RLS enabled but the production database is
--   missing (or has a drifted version of) the per-user SELECT policy
--   that should let authenticated callers read their own row. An
--   earlier migration (20251020130857_…) defined
--   "Users can view own points", but prod migration state has drifted
--   per CLAUDE.md — this migration re-asserts the policy under a
--   snake_case name so it's unambiguous on pg_policies.
--
-- Safe to re-run; the DROP IF EXISTS + CREATE is idempotent.

-- Enable RLS defensively (no-op if already enabled).
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS user_points_own_select ON public.user_points;
CREATE POLICY user_points_own_select
  ON public.user_points
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
