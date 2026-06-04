-- ═════════════════════════════════════════════════════════════════════════
-- get_feature_outcome — ratified completed-only retention win + flag seed.
--
-- SUPERSEDES the RPC defined in 20260701120000_feature_outcome_events.sql (the
-- earlier returned_d7 / user_sessions version). That landed migration is NOT
-- edited — this new migration redefines the function after it (DROP then
-- CREATE, since the RETURNS TABLE column set changed; bare CREATE OR REPLACE
-- cannot change a return type). The table/RLS/policies from 20260701120000 are
-- left untouched.
--
-- PROD IS ALREADY CORRECT. Prod received this ratified RPC via the SQL Editor
-- apply; this migration exists for repo→prod consistency and fresh-DB builds
-- only. It is idempotent and must NOT be re-applied to prod (no db push).
--
-- Also seeds the RETENTION_OUTCOME_EVENTS feature flag ROW as DISABLED so the
-- flag stops being off-book. The seed only guarantees the row exists (default
-- off); enabling it is a separate runtime change. ON CONFLICT DO NOTHING so it
-- never clobbers a runtime-set value on re-run.
--
-- RPC body below is byte-identical to the parser-verified bundle Section 2
-- (sha-fingerprinted in the MR). Admin guard, search_path, REVOKE/GRANT verbatim.
-- ═════════════════════════════════════════════════════════════════════════
BEGIN;

DROP FUNCTION IF EXISTS public.get_feature_outcome(text, timestamptz, integer);

CREATE OR REPLACE FUNCTION public.get_feature_outcome(
  p_feature_key      text,
  p_since            timestamptz DEFAULT (now() - interval '30 days'),
  p_min_interactions integer     DEFAULT 3
)
RETURNS TABLE (
  feature_key      text,
  shown            integer,
  completed_users  integer,
  won              integer,
  win_rate         numeric
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
  WITH shown_users AS (
    -- reported funnel only; does NOT gate the win (0 for retention_loop)
    SELECT DISTINCT e.user_id
      FROM public.feature_outcome_events e
     WHERE e.feature_key = p_feature_key
       AND e.event = 'shown'
       AND e.occurred_at >= p_since
  ),
  completed_any AS (
    -- win_rate denominator: distinct users with >= 1 'completed' in window
    -- (intentionally NOT local_day-gated; pessimistic during transition).
    SELECT DISTINCT e.user_id
      FROM public.feature_outcome_events e
     WHERE e.feature_key = p_feature_key
       AND e.event = 'completed'
       AND e.occurred_at >= p_since
  ),
  completed_days AS (
    -- one row per (user, CLIENT-STAMPED local day) with a completed for the key.
    -- Regex-guard the value before casting: skip absent or malformed local_day
    -- (fail-closed). UTC date(occurred_at) is intentionally NOT used.
    SELECT DISTINCT
           e.user_id,
           (e.payload->>'local_day')::date AS local_day
      FROM public.feature_outcome_events e
     WHERE e.feature_key = p_feature_key
       AND e.event = 'completed'
       AND e.occurred_at >= p_since
       AND e.payload->>'local_day' ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
  ),
  won_users AS (
    -- rolling 7-day: a left-anchored span [d, d+6] on each active day holding
    -- >= p_min_interactions DISTINCT active local-days qualifies the user.
    SELECT d1.user_id
      FROM completed_days d1
      JOIN completed_days d2
        ON d2.user_id   = d1.user_id
       AND d2.local_day >= d1.local_day
       AND d2.local_day <  d1.local_day + 7
     GROUP BY d1.user_id, d1.local_day
    HAVING count(DISTINCT d2.local_day) >= p_min_interactions
  )
  SELECT
    p_feature_key,
    (SELECT count(*) FROM shown_users)::integer,
    (SELECT count(*) FROM completed_any)::integer,
    (SELECT count(DISTINCT user_id) FROM won_users)::integer,
    round(
      100.0 * (SELECT count(DISTINCT user_id) FROM won_users)
      / nullif((SELECT count(*) FROM completed_any), 0),
      1
    );
END;
$$;

REVOKE ALL ON FUNCTION public.get_feature_outcome(text, timestamptz, integer) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_feature_outcome(text, timestamptz, integer) TO authenticated;


-- ─────────────────────────────────────────────────────────────────────────
-- RETENTION_OUTCOME_EVENTS flag — seed DISABLED, idempotent (off-book fix).
-- Matches public.feature_flags(flag_key, is_enabled, description). flag_key is
-- the EXACT string read by src/lib/analytics.ts emitFeatureOutcome. Enable is a
-- later runtime change; DO NOTHING preserves any existing row/state.
-- ─────────────────────────────────────────────────────────────────────────
INSERT INTO public.feature_flags (flag_key, is_enabled, description)
VALUES (
  'RETENTION_OUTCOME_EVENTS',
  false,
  'Dark gate for first-party feature-outcome telemetry (feature_outcome_events). Off by default; enabled at runtime per launch. Read by src/lib/analytics.ts emitFeatureOutcome; consumed by the get_feature_outcome RPC.'
)
ON CONFLICT (flag_key) DO NOTHING;

COMMIT;
