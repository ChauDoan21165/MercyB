-- Grant EXECUTE on public.award_points to authenticated users.
--
-- The original migration (20251124083520_*.sql) that defines this
-- function omitted the GRANT. Supabase revokes EXECUTE-from-PUBLIC by
-- default, so authenticated callers get 42501 ("permission denied for
-- function award_points") and the client-side kill-switch in
-- src/services/pointsService.ts flips, disabling server-side point
-- sync for the rest of the session. Sibling functions added later all
-- have the explicit GRANT:
--
--   award_leaderboard_points  →  20260429000000_leaderboard_weekly.sql:160
--   award_xp_event            →  20260609000000_xp_gamification.sql:290
--
-- This migration brings award_points to parity with them. The function
-- is SECURITY DEFINER and validates _user_id internally; granting
-- EXECUTE to authenticated does not weaken any RLS — the row-level
-- writes go through the function owner's privileges, not the caller's.

GRANT EXECUTE ON FUNCTION public.award_points(
  uuid,
  integer,
  text,
  text,
  text
) TO authenticated;
