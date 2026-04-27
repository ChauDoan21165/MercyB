-- Public monthly referral leaderboard (opt-in).
--
-- Layered on top of the referral schema (PR #83 / 20260429010000_referrals.sql)
-- which provides referral_codes(code, owner_user_id, ...) and
-- referral_uses(code, referred_user_id, used_at, reward_granted_owner,
-- reward_granted_referred). This migration adds:
--
--   - referral_leaderboard_optin: explicit per-user opt-in. NO row ⇒ NOT
--     on the public leaderboard. status='active' is the only state that
--     surfaces a user. Privacy-first: no auto-opt-in for referrers.
--   - monthly_referral_leaderboard (materialized view): aggregates the
--     opted-in users' referrals from referral_uses, joining the owner
--     side via referral_codes. Daily cap of 5 successful refs/day per
--     user is applied INSIDE the aggregation.
--   - all_time_referral_leaderboard (materialized view): same join,
--     career totals.
--   - referral_audit_log: one row per anti-gaming flag event.
--   - flag_suspicious_referrers(): scans referral_uses for users with
--     10+ refs in 1h, sets status='flagged' on their optin row.
--   - pg_cron: refreshes both views daily at 00:30 UTC.
--
-- "Successful conversion" = referee has auth.users.email_confirmed_at
-- IS NOT NULL AND has at least one row in speech_attempts. This keeps
-- signup-and-delete farms out of the leaderboard counts.
--
-- Reversibility:
--   DROP FUNCTION IF EXISTS public.flag_suspicious_referrers();
--   DROP FUNCTION IF EXISTS public.refresh_referral_leaderboards();
--   DROP MATERIALIZED VIEW IF EXISTS public.all_time_referral_leaderboard;
--   DROP MATERIALIZED VIEW IF EXISTS public.monthly_referral_leaderboard;
--   DROP TABLE IF EXISTS public.referral_audit_log;
--   DROP TABLE IF EXISTS public.referral_leaderboard_optin;

-- ── 1. opt-in table ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.referral_leaderboard_optin (
  user_id                       uuid PRIMARY KEY
                                  REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name                  text NOT NULL
                                  CHECK (char_length(display_name) <= 30
                                         AND char_length(display_name) >= 1),
  status                        text NOT NULL DEFAULT 'active'
                                  CHECK (status IN ('active', 'opted_out', 'flagged')),
  opted_in_at                   timestamptz NOT NULL DEFAULT now(),
  -- Track recognition email per-month to enforce one-per-month cap.
  -- Format: 'YYYY-MM' (e.g. '2026-04').
  last_recognition_email_month  text,
  created_at                    timestamptz NOT NULL DEFAULT now(),
  updated_at                    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_lb_optin_status
  ON public.referral_leaderboard_optin (status)
  WHERE status = 'active';

COMMENT ON TABLE public.referral_leaderboard_optin IS
  'Per-user opt-in for the public monthly referral leaderboard. status=''active'' means the user appears in the public materialized views.';

ALTER TABLE public.referral_leaderboard_optin ENABLE ROW LEVEL SECURITY;

-- Owner can SELECT/INSERT/UPDATE/DELETE their own row.
DROP POLICY IF EXISTS referral_lb_optin_select_own
  ON public.referral_leaderboard_optin;
CREATE POLICY referral_lb_optin_select_own
  ON public.referral_leaderboard_optin
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS referral_lb_optin_write_own
  ON public.referral_leaderboard_optin;
CREATE POLICY referral_lb_optin_write_own
  ON public.referral_leaderboard_optin
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Admin (level >= 9) can flag a user (set status='flagged') without
-- being the row owner. Admin update is intentionally narrow: it can
-- update any column but the only legitimate use is flipping status.
DROP POLICY IF EXISTS referral_lb_optin_admin_flag
  ON public.referral_leaderboard_optin;
CREATE POLICY referral_lb_optin_admin_flag
  ON public.referral_leaderboard_optin
  FOR UPDATE TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9)
  WITH CHECK (public.get_admin_level(auth.uid()) >= 9);

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.referral_leaderboard_optin TO authenticated;

-- ── 2. audit log ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.referral_audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason      text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_audit_log_user_id
  ON public.referral_audit_log (user_id, created_at DESC);

ALTER TABLE public.referral_audit_log ENABLE ROW LEVEL SECURITY;

-- Admin-only read.
DROP POLICY IF EXISTS referral_audit_log_admin_read
  ON public.referral_audit_log;
CREATE POLICY referral_audit_log_admin_read
  ON public.referral_audit_log
  FOR SELECT TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);

-- ── 3. materialized view: monthly leaderboard ──────────────────────────
-- Aggregates per (owner_user_id, month). Joins onto opt-in (active
-- status only) so non-opted-in users never surface.
--
-- Daily cap of 5 successful refs/day per user is applied via a CTE:
--   - count distinct successful refs per (owner, day)
--   - cap each day at 5
--   - sum days within the month
--
-- "Successful conversion" = email_confirmed_at IS NOT NULL AND has
-- ≥ 1 speech_attempts row. The first speech attempt date is the
-- conversion date.

DROP MATERIALIZED VIEW IF EXISTS public.monthly_referral_leaderboard;

CREATE MATERIALIZED VIEW public.monthly_referral_leaderboard AS
WITH successful_refs AS (
  -- Per-referee qualification: has confirmed email + at least one
  -- speech attempt. The conversion timestamp is the earliest of
  -- (email_confirmed_at, first speech_attempt) — both must be true,
  -- so the converted_at is the LATER of the two (the moment the
  -- referee qualified).
  SELECT
    rc.owner_user_id           AS owner_user_id,
    ru.referred_user_id        AS referred_user_id,
    ru.used_at                 AS used_at,
    GREATEST(
      au.email_confirmed_at,
      sa.first_attempt_at
    )                          AS converted_at
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
  -- Count successful conversions per (owner, day-of-conversion),
  -- capped at 5 per day to neutralize burst-farming.
  SELECT
    owner_user_id,
    date_trunc('month', converted_at)::date  AS month_starts_on,
    date_trunc('day',   converted_at)::date  AS conv_day,
    LEAST(5, count(*)::int)                  AS capped_count
  FROM successful_refs
  GROUP BY owner_user_id, date_trunc('month', converted_at), date_trunc('day', converted_at)
),
all_refs_monthly AS (
  -- Total referrals (any state) by month — anchored on used_at.
  SELECT
    rc.owner_user_id,
    date_trunc('month', ru.used_at)::date AS month_starts_on,
    count(*)::int                          AS total_referrals_this_month
  FROM public.referral_uses ru
  JOIN public.referral_codes rc ON rc.code = ru.code
  GROUP BY rc.owner_user_id, date_trunc('month', ru.used_at)
),
conv_monthly AS (
  SELECT
    owner_user_id,
    month_starts_on,
    SUM(capped_count)::int AS successful_conversions
  FROM daily_counts
  GROUP BY owner_user_id, month_starts_on
)
SELECT
  COALESCE(a.owner_user_id, c.owner_user_id)             AS user_id,
  COALESCE(a.month_starts_on, c.month_starts_on)         AS month_starts_on,
  COALESCE(a.total_referrals_this_month, 0)              AS total_referrals_this_month,
  COALESCE(c.successful_conversions, 0)                  AS successful_conversions,
  o.display_name                                         AS display_name
FROM all_refs_monthly a
FULL OUTER JOIN conv_monthly c
  ON c.owner_user_id   = a.owner_user_id
 AND c.month_starts_on = a.month_starts_on
JOIN public.referral_leaderboard_optin o
  ON o.user_id = COALESCE(a.owner_user_id, c.owner_user_id)
 AND o.status = 'active';

CREATE UNIQUE INDEX IF NOT EXISTS idx_monthly_referral_lb_user_month
  ON public.monthly_referral_leaderboard (user_id, month_starts_on);

CREATE INDEX IF NOT EXISTS idx_monthly_referral_lb_month_rank
  ON public.monthly_referral_leaderboard
  (month_starts_on, successful_conversions DESC, total_referrals_this_month DESC);

COMMENT ON MATERIALIZED VIEW public.monthly_referral_leaderboard IS
  'Monthly per-user referral totals (opted-in only). Daily cap of 5 successful refs/day applied in the aggregation.';

-- ── 4. materialized view: all-time leaderboard ─────────────────────────

DROP MATERIALIZED VIEW IF EXISTS public.all_time_referral_leaderboard;

CREATE MATERIALIZED VIEW public.all_time_referral_leaderboard AS
WITH successful_refs AS (
  SELECT
    rc.owner_user_id,
    ru.referred_user_id,
    ru.used_at,
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
    LEAST(5, count(*)::int)               AS capped_count
  FROM successful_refs
  GROUP BY owner_user_id, date_trunc('day', converted_at)
),
all_refs_total AS (
  SELECT
    rc.owner_user_id,
    count(*)::int      AS total_referrals,
    min(ru.used_at)    AS first_referral_date
  FROM public.referral_uses ru
  JOIN public.referral_codes rc ON rc.code = ru.code
  GROUP BY rc.owner_user_id
),
conv_total AS (
  SELECT
    owner_user_id,
    SUM(capped_count)::int AS total_premium_conversions
  FROM daily_counts
  GROUP BY owner_user_id
)
SELECT
  COALESCE(a.owner_user_id, c.owner_user_id)  AS user_id,
  COALESCE(a.total_referrals, 0)              AS total_referrals,
  COALESCE(c.total_premium_conversions, 0)    AS total_premium_conversions,
  a.first_referral_date                       AS first_referral_date,
  o.display_name                              AS display_name
FROM all_refs_total a
FULL OUTER JOIN conv_total c
  ON c.owner_user_id = a.owner_user_id
JOIN public.referral_leaderboard_optin o
  ON o.user_id = COALESCE(a.owner_user_id, c.owner_user_id)
 AND o.status = 'active';

CREATE UNIQUE INDEX IF NOT EXISTS idx_all_time_referral_lb_user
  ON public.all_time_referral_leaderboard (user_id);

CREATE INDEX IF NOT EXISTS idx_all_time_referral_lb_rank
  ON public.all_time_referral_leaderboard
  (total_premium_conversions DESC, total_referrals DESC);

COMMENT ON MATERIALIZED VIEW public.all_time_referral_leaderboard IS
  'All-time per-user referral totals (opted-in only). Daily cap of 5 successful refs/day applied.';

-- Public (anon + authenticated) read.
GRANT SELECT ON public.monthly_referral_leaderboard  TO anon, authenticated;
GRANT SELECT ON public.all_time_referral_leaderboard TO anon, authenticated;

-- ── 5. anti-gaming: flag users with 10+ refs in 1h ───────────────────────

CREATE OR REPLACE FUNCTION public.flag_suspicious_referrers()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  flagged_count integer := 0;
  rec record;
BEGIN
  FOR rec IN
    WITH bursts AS (
      -- For each (owner, ref) pair, count refs in the trailing 1h window.
      SELECT
        rc.owner_user_id AS owner_user_id,
        ru.used_at       AS used_at,
        count(*) OVER (
          PARTITION BY rc.owner_user_id
          ORDER BY ru.used_at
          RANGE BETWEEN interval '1 hour' PRECEDING AND CURRENT ROW
        ) AS in_window
      FROM public.referral_uses ru
      JOIN public.referral_codes rc ON rc.code = ru.code
    )
    SELECT DISTINCT owner_user_id
    FROM bursts
    WHERE in_window >= 10
  LOOP
    -- Flag the optin row if it exists and is currently 'active'.
    UPDATE public.referral_leaderboard_optin
       SET status = 'flagged',
           updated_at = now()
     WHERE user_id = rec.owner_user_id
       AND status  = 'active';

    IF FOUND THEN
      INSERT INTO public.referral_audit_log (user_id, reason)
      VALUES (rec.owner_user_id, '10_or_more_refs_in_1h');
      flagged_count := flagged_count + 1;
    END IF;
  END LOOP;

  RETURN flagged_count;
END;
$$;

COMMENT ON FUNCTION public.flag_suspicious_referrers() IS
  'Scans referral_uses for users with 10+ refs in any 1h window; flips their leaderboard opt-in to status=flagged and writes an audit row.';

-- ── 6. refresh helper ────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.refresh_referral_leaderboards()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.monthly_referral_leaderboard;
  REFRESH MATERIALIZED VIEW public.all_time_referral_leaderboard;
END;
$$;

COMMENT ON FUNCTION public.refresh_referral_leaderboards() IS
  'Refreshes both referral leaderboard materialized views. Called daily by pg_cron.';

-- ── 7. pg_cron schedule (daily 00:30 UTC) ────────────────────────────────
-- pg_cron must be enabled at the project level. If not, this block is a
-- no-op (commented). Schedule is idempotent: cron.schedule replaces the
-- existing job with the same name.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule(
      'refresh-referral-leaderboards-daily',
      '30 0 * * *',
      $cron$ SELECT public.refresh_referral_leaderboards(); $cron$
    );
    PERFORM cron.schedule(
      'flag-suspicious-referrers-daily',
      '35 0 * * *',
      $cron$ SELECT public.flag_suspicious_referrers(); $cron$
    );
  END IF;
END $$;
