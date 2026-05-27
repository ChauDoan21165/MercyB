# Referral Leaderboard auth_users_exposed Phase 2

Phase 1 adds safe physical public projection tables and moves client/server
reads to them. Do not revoke or drop the legacy materialized views until the
production deploy is verified reading only:

- `public.referral_leaderboard_monthly_public`
- `public.referral_leaderboard_all_time_public`

Phase 2 post-deploy SQL order:

```sql
-- 1. Verify production traffic reads only the safe physical projections:
--    - public.referral_leaderboard_monthly_public
--    - public.referral_leaderboard_all_time_public
-- Use Supabase logs/API gateway telemetry before changing legacy objects.

-- 2. Unschedule the legacy cron job before dropping its refresh function.
select cron.unschedule('refresh-referral-leaderboards-daily');

-- 3. Remove browser-role access from legacy auth.users-dependent views.
REVOKE SELECT ON public.monthly_referral_leaderboard FROM anon, authenticated;
REVOKE SELECT ON public.all_time_referral_leaderboard FROM anon, authenticated;

-- 4. Drop the legacy refresh function and unsafe auth.users-dependent views.
DROP FUNCTION IF EXISTS public.refresh_referral_leaderboards();
DROP MATERIALIZED VIEW IF EXISTS public.monthly_referral_leaderboard;
DROP MATERIALIZED VIEW IF EXISTS public.all_time_referral_leaderboard;

-- 5. Re-run the Advisor check and verify auth_users_exposed clears.
```
