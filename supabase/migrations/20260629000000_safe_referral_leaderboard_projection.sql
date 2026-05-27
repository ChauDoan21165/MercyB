-- Phase 1 safe path for Supabase Advisor auth_users_exposed.
--
-- The legacy public materialized views:
--   - public.monthly_referral_leaderboard
--   - public.all_time_referral_leaderboard
-- depend on auth.users and remain in place for Phase 1 compatibility.
--
-- This migration adds physical public projection tables with no auth.users
-- dependency, plus service-only refresh/read helpers. Phase 2, after the
-- production client is verified on these tables, revokes/drops the legacy
-- public materialized views.

CREATE SCHEMA IF NOT EXISTS private;

REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO service_role;

-- Private physical projections retain user_id for service-only jobs.
CREATE TABLE IF NOT EXISTS private.referral_leaderboard_monthly_private (
  rank                         integer NOT NULL CHECK (rank > 0),
  user_id                      uuid NOT NULL,
  display_name                 text NOT NULL,
  month_starts_on              date NOT NULL,
  total_referrals_this_month   integer NOT NULL CHECK (total_referrals_this_month >= 0),
  successful_conversions       integer NOT NULL CHECK (successful_conversions >= 0),
  refreshed_at                 timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (month_starts_on, rank)
);

CREATE INDEX IF NOT EXISTS idx_referral_lb_monthly_private_user
  ON private.referral_leaderboard_monthly_private (user_id, month_starts_on);

CREATE TABLE IF NOT EXISTS private.referral_leaderboard_all_time_private (
  rank                         integer PRIMARY KEY CHECK (rank > 0),
  user_id                      uuid NOT NULL,
  display_name                 text NOT NULL,
  total_referrals              integer NOT NULL CHECK (total_referrals >= 0),
  total_premium_conversions    integer NOT NULL CHECK (total_premium_conversions >= 0),
  first_referral_date          timestamptz,
  refreshed_at                 timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_lb_all_time_private_user
  ON private.referral_leaderboard_all_time_private (user_id);

REVOKE ALL ON private.referral_leaderboard_monthly_private FROM PUBLIC, anon, authenticated;
REVOKE ALL ON private.referral_leaderboard_all_time_private FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE
  ON private.referral_leaderboard_monthly_private TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE
  ON private.referral_leaderboard_all_time_private TO service_role;

-- Public physical projections intentionally omit raw auth/profile user IDs.
CREATE TABLE IF NOT EXISTS public.referral_leaderboard_monthly_public (
  rank                         integer NOT NULL CHECK (rank > 0),
  display_name                 text NOT NULL,
  month_starts_on              date NOT NULL,
  total_referrals_this_month   integer NOT NULL CHECK (total_referrals_this_month >= 0),
  successful_conversions       integer NOT NULL CHECK (successful_conversions >= 0),
  refreshed_at                 timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (month_starts_on, rank)
);

CREATE INDEX IF NOT EXISTS idx_referral_lb_monthly_public_rank
  ON public.referral_leaderboard_monthly_public
  (month_starts_on, rank);

CREATE TABLE IF NOT EXISTS public.referral_leaderboard_all_time_public (
  rank                         integer PRIMARY KEY CHECK (rank > 0),
  display_name                 text NOT NULL,
  total_referrals              integer NOT NULL CHECK (total_referrals >= 0),
  total_premium_conversions    integer NOT NULL CHECK (total_premium_conversions >= 0),
  first_referral_date          timestamptz,
  refreshed_at                 timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.referral_leaderboard_monthly_public ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_leaderboard_all_time_public ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS referral_lb_monthly_public_read
  ON public.referral_leaderboard_monthly_public;
CREATE POLICY referral_lb_monthly_public_read
  ON public.referral_leaderboard_monthly_public
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS referral_lb_all_time_public_read
  ON public.referral_leaderboard_all_time_public;
CREATE POLICY referral_lb_all_time_public_read
  ON public.referral_leaderboard_all_time_public
  FOR SELECT
  TO anon, authenticated
  USING (true);

REVOKE ALL ON public.referral_leaderboard_monthly_public FROM PUBLIC;
REVOKE ALL ON public.referral_leaderboard_all_time_public FROM PUBLIC;
GRANT SELECT ON public.referral_leaderboard_monthly_public TO anon, authenticated;
GRANT SELECT ON public.referral_leaderboard_all_time_public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE
  ON public.referral_leaderboard_monthly_public TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE
  ON public.referral_leaderboard_all_time_public TO service_role;

COMMENT ON TABLE public.referral_leaderboard_monthly_public IS
  'Safe physical public monthly referral leaderboard projection. No auth.users dependency and no raw user identifiers.';
COMMENT ON TABLE public.referral_leaderboard_all_time_public IS
  'Safe physical public all-time referral leaderboard projection. No auth.users dependency and no raw user identifiers.';

CREATE OR REPLACE FUNCTION public.refresh_safe_referral_leaderboard_projections()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, private
AS $$
BEGIN
  TRUNCATE TABLE
    private.referral_leaderboard_monthly_private,
    private.referral_leaderboard_all_time_private,
    public.referral_leaderboard_monthly_public,
    public.referral_leaderboard_all_time_public;

  INSERT INTO private.referral_leaderboard_monthly_private (
    rank,
    user_id,
    display_name,
    month_starts_on,
    total_referrals_this_month,
    successful_conversions,
    refreshed_at
  )
  SELECT
    row_number() OVER (
      PARTITION BY ranked.month_starts_on
      ORDER BY ranked.successful_conversions DESC,
               ranked.total_referrals_this_month DESC,
               ranked.display_name ASC,
               ranked.user_id ASC
    )::integer AS rank,
    ranked.user_id,
    ranked.display_name,
    ranked.month_starts_on,
    ranked.total_referrals_this_month,
    ranked.successful_conversions,
    now()
  FROM (
    WITH successful_refs AS (
      SELECT
        rc.owner_user_id AS owner_user_id,
        GREATEST(au.email_confirmed_at, sa.first_attempt_at) AS converted_at
      FROM public.referral_uses ru
      JOIN public.referral_codes rc ON rc.code = ru.code
      JOIN auth.users au ON au.id = ru.referred_user_id
      JOIN LATERAL (
        SELECT min(created_at) AS first_attempt_at
        FROM public.speech_attempts
        WHERE user_id = ru.referred_user_id
      ) sa ON true
      WHERE au.email_confirmed_at IS NOT NULL
        AND sa.first_attempt_at IS NOT NULL
    ),
    daily_counts AS (
      SELECT
        owner_user_id,
        date_trunc('month', converted_at)::date AS month_starts_on,
        date_trunc('day', converted_at)::date AS conv_day,
        LEAST(5, count(*)::integer) AS capped_count
      FROM successful_refs
      GROUP BY owner_user_id, date_trunc('month', converted_at), date_trunc('day', converted_at)
    ),
    all_refs_monthly AS (
      SELECT
        rc.owner_user_id,
        date_trunc('month', ru.used_at)::date AS month_starts_on,
        count(*)::integer AS total_referrals_this_month
      FROM public.referral_uses ru
      JOIN public.referral_codes rc ON rc.code = ru.code
      GROUP BY rc.owner_user_id, date_trunc('month', ru.used_at)
    ),
    conv_monthly AS (
      SELECT
        owner_user_id,
        month_starts_on,
        sum(capped_count)::integer AS successful_conversions
      FROM daily_counts
      GROUP BY owner_user_id, month_starts_on
    )
    SELECT
      coalesce(a.owner_user_id, c.owner_user_id) AS user_id,
      o.display_name,
      coalesce(a.month_starts_on, c.month_starts_on) AS month_starts_on,
      coalesce(a.total_referrals_this_month, 0) AS total_referrals_this_month,
      coalesce(c.successful_conversions, 0) AS successful_conversions
    FROM all_refs_monthly a
    FULL OUTER JOIN conv_monthly c
      ON c.owner_user_id = a.owner_user_id
     AND c.month_starts_on = a.month_starts_on
    JOIN public.referral_leaderboard_optin o
      ON o.user_id = coalesce(a.owner_user_id, c.owner_user_id)
     AND o.status = 'active'
  ) ranked;

  INSERT INTO private.referral_leaderboard_all_time_private (
    rank,
    user_id,
    display_name,
    total_referrals,
    total_premium_conversions,
    first_referral_date,
    refreshed_at
  )
  SELECT
    row_number() OVER (
      ORDER BY ranked.total_premium_conversions DESC,
               ranked.total_referrals DESC,
               ranked.display_name ASC,
               ranked.user_id ASC
    )::integer AS rank,
    ranked.user_id,
    ranked.display_name,
    ranked.total_referrals,
    ranked.total_premium_conversions,
    ranked.first_referral_date,
    now()
  FROM (
    WITH successful_refs AS (
      SELECT
        rc.owner_user_id AS owner_user_id,
        GREATEST(au.email_confirmed_at, sa.first_attempt_at) AS converted_at
      FROM public.referral_uses ru
      JOIN public.referral_codes rc ON rc.code = ru.code
      JOIN auth.users au ON au.id = ru.referred_user_id
      JOIN LATERAL (
        SELECT min(created_at) AS first_attempt_at
        FROM public.speech_attempts
        WHERE user_id = ru.referred_user_id
      ) sa ON true
      WHERE au.email_confirmed_at IS NOT NULL
        AND sa.first_attempt_at IS NOT NULL
    ),
    daily_counts AS (
      SELECT
        owner_user_id,
        date_trunc('day', converted_at)::date AS conv_day,
        LEAST(5, count(*)::integer) AS capped_count
      FROM successful_refs
      GROUP BY owner_user_id, date_trunc('day', converted_at)
    ),
    all_refs_total AS (
      SELECT
        rc.owner_user_id,
        count(*)::integer AS total_referrals,
        min(ru.used_at) AS first_referral_date
      FROM public.referral_uses ru
      JOIN public.referral_codes rc ON rc.code = ru.code
      GROUP BY rc.owner_user_id
    ),
    conv_total AS (
      SELECT
        owner_user_id,
        sum(capped_count)::integer AS total_premium_conversions
      FROM daily_counts
      GROUP BY owner_user_id
    )
    SELECT
      coalesce(a.owner_user_id, c.owner_user_id) AS user_id,
      o.display_name,
      coalesce(a.total_referrals, 0) AS total_referrals,
      coalesce(c.total_premium_conversions, 0) AS total_premium_conversions,
      a.first_referral_date
    FROM all_refs_total a
    FULL OUTER JOIN conv_total c
      ON c.owner_user_id = a.owner_user_id
    JOIN public.referral_leaderboard_optin o
      ON o.user_id = coalesce(a.owner_user_id, c.owner_user_id)
     AND o.status = 'active'
  ) ranked;

  INSERT INTO public.referral_leaderboard_monthly_public (
    rank,
    display_name,
    month_starts_on,
    total_referrals_this_month,
    successful_conversions,
    refreshed_at
  )
  SELECT
    rank,
    display_name,
    month_starts_on,
    total_referrals_this_month,
    successful_conversions,
    refreshed_at
  FROM private.referral_leaderboard_monthly_private;

  INSERT INTO public.referral_leaderboard_all_time_public (
    rank,
    display_name,
    total_referrals,
    total_premium_conversions,
    first_referral_date,
    refreshed_at
  )
  SELECT
    rank,
    display_name,
    total_referrals,
    total_premium_conversions,
    first_referral_date,
    refreshed_at
  FROM private.referral_leaderboard_all_time_private;
END;
$$;

REVOKE ALL ON FUNCTION public.refresh_safe_referral_leaderboard_projections()
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_safe_referral_leaderboard_projections()
  TO service_role;

COMMENT ON FUNCTION public.refresh_safe_referral_leaderboard_projections() IS
  'Service-only refresh for safe physical referral leaderboard projections. Internally reads auth.users but exposes no auth dependency to public tables.';

CREATE OR REPLACE FUNCTION public.get_referral_recognition_candidates(
  p_month_starts_on date,
  p_limit integer DEFAULT 10
)
RETURNS TABLE (
  user_id uuid,
  display_name text,
  successful_conversions integer,
  total_referrals_this_month integer
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, private
AS $$
  SELECT
    m.user_id,
    m.display_name,
    m.successful_conversions,
    m.total_referrals_this_month
  FROM private.referral_leaderboard_monthly_private m
  WHERE m.month_starts_on = p_month_starts_on
  ORDER BY m.rank ASC
  LIMIT greatest(1, least(100, coalesce(p_limit, 10)));
$$;

REVOKE ALL ON FUNCTION public.get_referral_recognition_candidates(date, integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_referral_recognition_candidates(date, integer)
  TO service_role;

COMMENT ON FUNCTION public.get_referral_recognition_candidates(date, integer) IS
  'Service-only RPC for recognition emails. Returns private user IDs from the physical private projection; not granted to browser roles.';

-- Seed safe projections immediately at migration time. Legacy objects remain
-- untouched until Phase 2.
SELECT public.refresh_safe_referral_leaderboard_projections();

-- Keep the safe physical projections fresh. Existing legacy cron jobs remain
-- untouched for Phase 1 compatibility.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'refresh-safe-referral-leaderboards-daily',
      '40 0 * * *',
      $cron$ SELECT public.refresh_safe_referral_leaderboard_projections(); $cron$
    );
  END IF;
END $$;
