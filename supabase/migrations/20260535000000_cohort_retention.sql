-- Cohort retention storage.
--
-- One row per (cohort_week_start, days_since_signup) bucket holding
-- the active and total user counts. The aggregator edge function
-- writes; the admin retention dashboard reads through a SECURITY
-- DEFINER RPC. Direct read access is denied.
--
-- "Active" is defined application-side (see
-- supabase/functions/cohort-retention-aggregator/index.ts) as:
--   ≥1 speech_attempt OR ≥1 user_sessions row OR
--   profiles.last_active_at within the day.
-- The migration only stores the result, not the rule, so the activity
-- definition can evolve without a schema change.
--
-- Privacy posture:
--   - aggregate counts only — no user_id columns, no individual rows
--   - service-role-only WRITE; deny-all READ for everyone except the
--     SECURITY DEFINER reader RPC, which checks
--     public.get_admin_level() >= 9 before returning rows
--
-- Reversibility:
--   DROP FUNCTION IF EXISTS public.get_cohort_retention(date, date, text);
--   DROP TABLE IF EXISTS public.cohort_retention_daily;

-- ── Table ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.cohort_retention_daily (
  cohort_week_start date NOT NULL,
  days_since_signup integer NOT NULL,
  -- "all", "free", or "paid" — lets the dashboard filter by cohort
  -- segment without re-running the aggregator each time.
  segment text NOT NULL DEFAULT 'all',
  active_users integer NOT NULL DEFAULT 0,
  total_users  integer NOT NULL DEFAULT 0,
  computed_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (cohort_week_start, days_since_signup, segment),
  CHECK (days_since_signup >= 0),
  CHECK (active_users >= 0),
  CHECK (total_users  >= 0),
  CHECK (active_users <= total_users),
  CHECK (segment IN ('all', 'free', 'paid'))
);

COMMENT ON TABLE public.cohort_retention_daily IS
  'Aggregate retention counts per (cohort_week_start, days_since_signup, segment). Written by the cohort-retention-aggregator edge function; read by the /admin/retention dashboard via the get_cohort_retention SECURITY DEFINER RPC.';

CREATE INDEX IF NOT EXISTS cohort_retention_daily_week_idx
  ON public.cohort_retention_daily (cohort_week_start DESC, days_since_signup);

-- ── RLS: deny-all by default, with no policies ────────────────────────
-- An RLS-enabled table with no SELECT policy denies SELECT to authenticated
-- and anon. The service_role bypasses RLS entirely (used by the aggregator).
-- Admin reads happen through the SECURITY DEFINER RPC below, which
-- enforces its own admin-level gate.
ALTER TABLE public.cohort_retention_daily ENABLE ROW LEVEL SECURITY;

-- ── Reader RPC ────────────────────────────────────────────────────────
-- The dashboard calls this with an optional date window and segment. The
-- function bypasses RLS via SECURITY DEFINER, but checks
-- public.get_admin_level() before returning anything — non-admins get
-- zero rows. Returns rows ordered for the dashboard's triangle layout.
CREATE OR REPLACE FUNCTION public.get_cohort_retention(
  p_since        date    DEFAULT (current_date - interval '12 weeks')::date,
  p_until        date    DEFAULT current_date,
  p_segment      text    DEFAULT 'all'
)
RETURNS TABLE (
  cohort_week_start date,
  days_since_signup integer,
  segment           text,
  active_users      integer,
  total_users       integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF coalesce(public.get_admin_level(), 0) < 9 THEN
    RETURN;
  END IF;

  IF p_segment NOT IN ('all', 'free', 'paid') THEN
    RAISE EXCEPTION 'invalid segment: %', p_segment;
  END IF;

  RETURN QUERY
  SELECT crd.cohort_week_start,
         crd.days_since_signup,
         crd.segment,
         crd.active_users,
         crd.total_users
    FROM public.cohort_retention_daily crd
   WHERE crd.cohort_week_start BETWEEN p_since AND p_until
     AND crd.segment = p_segment
   ORDER BY crd.cohort_week_start DESC, crd.days_since_signup ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_cohort_retention(date, date, text)
  TO authenticated;

COMMENT ON FUNCTION public.get_cohort_retention(date, date, text) IS
  'Read the cohort retention triangle. SECURITY DEFINER + admin-level gate (>= 9). Returns nothing for non-admin callers — never raises, so the dashboard fails closed silently.';

-- ── Behavioural rollups RPC ───────────────────────────────────────────
-- One trip for the /admin/behavioral page. Returns four series the
-- dashboard charts: daily new signups, daily active users, daily
-- speech-attempt count, and the cumulative funnel.
--
-- Daily series are returned as one row per day in the requested
-- window. Empty days return zero, so chart libraries don't have to
-- pad missing dates client-side.
CREATE OR REPLACE FUNCTION public.get_behavioral_metrics(
  p_since date DEFAULT (current_date - interval '90 days')::date,
  p_until date DEFAULT current_date
)
RETURNS TABLE (
  metric_date     date,
  new_signups     integer,
  active_users    integer,
  speech_attempts integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF coalesce(public.get_admin_level(), 0) < 9 THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH days AS (
    SELECT generate_series(p_since, p_until, interval '1 day')::date AS d
  ),
  signups AS (
    SELECT date_trunc('day', created_at AT TIME ZONE 'UTC')::date AS d,
           count(*)::integer AS n
      FROM public.profiles
     WHERE created_at >= p_since
       AND created_at <  (p_until + interval '1 day')
     GROUP BY 1
  ),
  attempts AS (
    SELECT date_trunc('day', attempted_at AT TIME ZONE 'UTC')::date AS d,
           count(*)::integer AS n
      FROM public.speech_attempts
     WHERE attempted_at >= p_since
       AND attempted_at <  (p_until + interval '1 day')
     GROUP BY 1
  ),
  active AS (
    SELECT date_trunc('day', last_activity AT TIME ZONE 'UTC')::date AS d,
           count(distinct user_id)::integer AS n
      FROM public.user_sessions
     WHERE last_activity >= p_since
       AND last_activity <  (p_until + interval '1 day')
     GROUP BY 1
  )
  SELECT days.d,
         coalesce(signups.n,  0),
         coalesce(active.n,   0),
         coalesce(attempts.n, 0)
    FROM days
    LEFT JOIN signups  ON signups.d  = days.d
    LEFT JOIN active   ON active.d   = days.d
    LEFT JOIN attempts ON attempts.d = days.d
   ORDER BY days.d ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_behavioral_metrics(date, date) TO authenticated;

COMMENT ON FUNCTION public.get_behavioral_metrics(date, date) IS
  'Daily DAU + new signups + speech attempts in the requested window. SECURITY DEFINER + admin-level gate. Returns empty for non-admins; pads missing days with zeros so the dashboard does not need to interpolate.';

-- ── Funnel RPC ────────────────────────────────────────────────────────
-- Conversion funnel snapshot at the moment of call. Counts users who
-- ever passed each milestone: signed up → first attempt → 5 attempts →
-- 30 attempts → paid (tier > 0). Each subsequent count is a subset of
-- the previous, so dashboard renders are trivial.
CREATE OR REPLACE FUNCTION public.get_conversion_funnel()
RETURNS TABLE (
  signed_up           integer,
  reached_first       integer,
  reached_five        integer,
  reached_thirty      integer,
  paid                integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_signed_up      integer;
  v_first          integer;
  v_five           integer;
  v_thirty         integer;
  v_paid           integer;
BEGIN
  IF coalesce(public.get_admin_level(), 0) < 9 THEN
    RETURN;
  END IF;

  SELECT count(*)::integer INTO v_signed_up FROM public.profiles;

  WITH per_user AS (
    SELECT user_id, count(*)::integer AS n
      FROM public.speech_attempts
     GROUP BY user_id
  )
  SELECT
    count(*) FILTER (WHERE n >= 1)::integer,
    count(*) FILTER (WHERE n >= 5)::integer,
    count(*) FILTER (WHERE n >= 30)::integer
    INTO v_first, v_five, v_thirty
    FROM per_user;

  SELECT count(*)::integer INTO v_paid
    FROM public.profiles
   WHERE coalesce(tier, 0) > 0;

  RETURN QUERY
  SELECT v_signed_up,
         coalesce(v_first,  0),
         coalesce(v_five,   0),
         coalesce(v_thirty, 0),
         v_paid;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_conversion_funnel() TO authenticated;

COMMENT ON FUNCTION public.get_conversion_funnel() IS
  'Conversion funnel snapshot: signed_up → reached_first → reached_five → reached_thirty → paid. Each stage subset of the previous. Admin-only via get_admin_level >= 9.';

-- ── Telemetry: latest aggregator run ──────────────────────────────────
-- The dashboard wants to show "last refreshed at" without joining the
-- aggregator's run-log. A trivial helper.
CREATE OR REPLACE FUNCTION public.get_cohort_retention_freshness()
RETURNS timestamptz
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT max(computed_at)
    FROM public.cohort_retention_daily
   WHERE coalesce(public.get_admin_level(), 0) >= 9;
$$;

GRANT EXECUTE ON FUNCTION public.get_cohort_retention_freshness() TO authenticated;
