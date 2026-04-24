-- Wave 2 Step 3 — persist CC1's pronunciation scores.
--
-- Context: PR #22 landed the pronunciation scoring library at
-- src/lib/pronunciation/ (recognizeOnce + scorePronunciation). PR #24
-- shipped /speak over that library. Scores currently display but
-- disappear on unload — this migration + the companion client changes
-- persist each attempt.
--
-- What's here:
--   1. Schema additions on public.speech_attempts (existing table has
--      target_text + transcript already; we add the fields the new
--      scorer produces).
--   2. Admin-overlay SELECT policy (level 9+) alongside the existing
--      own_select / own_insert, matching the pattern used for
--      feature_flags admin writes.
--   3. No UPDATE/DELETE policies — append-only audit trail. Absence
--      of a policy = deny (RLS fail-closed).
--   4. Plain view v_user_pronunciation_stats — aggregates per user
--      over 7 / 30 / 90 day windows. For our cohort size this is
--      cheap on read; no cron, no materialization, no drift.
--
-- Reversibility:
--   DROP VIEW IF EXISTS public.v_user_pronunciation_stats;
--   DROP POLICY IF EXISTS speech_attempts_admin_select ON public.speech_attempts;
--   ALTER TABLE public.speech_attempts
--     DROP COLUMN IF EXISTS overall_score,
--     DROP COLUMN IF EXISTS word_scores,
--     DROP COLUMN IF EXISTS elapsed_ms,
--     DROP COLUMN IF EXISTS context,
--     DROP COLUMN IF EXISTS attempted_at;

-- ── 1. Column additions (idempotent) ──────────────────────────────────────
ALTER TABLE public.speech_attempts
  ADD COLUMN IF NOT EXISTS overall_score integer,
  ADD COLUMN IF NOT EXISTS word_scores   jsonb,
  ADD COLUMN IF NOT EXISTS elapsed_ms    integer,
  ADD COLUMN IF NOT EXISTS context       jsonb;

-- attempted_at is a clearer name than created_at for this domain;
-- adding an alias column keeps the brief's contract while preserving the
-- existing created_at timestamp for anything that already reads it.
ALTER TABLE public.speech_attempts
  ADD COLUMN IF NOT EXISTS attempted_at timestamp with time zone;

-- Backfill attempted_at from created_at once.
UPDATE public.speech_attempts
   SET attempted_at = created_at
 WHERE attempted_at IS NULL;

-- Once backfilled, make attempted_at NOT NULL + default now().
ALTER TABLE public.speech_attempts
  ALTER COLUMN attempted_at SET DEFAULT now();

ALTER TABLE public.speech_attempts
  ALTER COLUMN attempted_at SET NOT NULL;

-- Guard rails: scores stay in 0..100 (CC1's scorer already clamps, but
-- belt-and-suspenders against a misbehaving client).
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'speech_attempts_overall_score_range'
  ) THEN
    ALTER TABLE public.speech_attempts
      ADD CONSTRAINT speech_attempts_overall_score_range
      CHECK (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 100));
  END IF;
END$$;

-- Query pattern from the rollup view: (user_id, attempted_at DESC).
-- speech_attempts_user_id_idx + speech_attempts_created_at_idx already
-- exist — add a composite for the per-user time-window scan.
CREATE INDEX IF NOT EXISTS speech_attempts_user_attempted_idx
  ON public.speech_attempts (user_id, attempted_at DESC);

-- ── 2. Admin-overlay SELECT policy ────────────────────────────────────────
-- Own-row SELECT + INSERT already exist (migration 20260309_create_speech_attempts).
-- This lets level-9+ admins read any row for analytics / moderation.
-- UPDATE + DELETE policies are intentionally absent for all roles except
-- service_role — append-only audit trail.
DROP POLICY IF EXISTS speech_attempts_admin_select ON public.speech_attempts;

CREATE POLICY speech_attempts_admin_select
  ON public.speech_attempts
  FOR SELECT
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);

-- ── 3. Rollup view ────────────────────────────────────────────────────────
-- Per-user aggregates over 7 / 30 / 90 day rolling windows. Plain view
-- (not materialized) — computed on each SELECT. Cheap at our scale
-- (thousands of rows) and guaranteed never to drift from the base table.
-- If we ever hit millions of rows and this gets slow, swap to a
-- MATERIALIZED VIEW refreshed by pg_cron; the SELECT contract stays the
-- same so callers don't change.
CREATE OR REPLACE VIEW public.v_user_pronunciation_stats AS
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
  COUNT(*)                                         AS attempts_90d,
  ROUND(AVG(overall_score))::integer               AS avg_score_90d,
  COUNT(*) FILTER (WHERE attempted_at > now() - interval '30 days') AS attempts_30d,
  ROUND(AVG(overall_score) FILTER (WHERE attempted_at > now() - interval '30 days'))::integer AS avg_score_30d,
  COUNT(*) FILTER (WHERE attempted_at > now() - interval '7 days')  AS attempts_7d,
  ROUND(AVG(overall_score) FILTER (WHERE attempted_at > now() - interval '7 days'))::integer  AS avg_score_7d,
  MAX(attempted_at)                                AS last_attempt_at,
  -- Median elapsed_ms — useful signal for whether the user is rushing.
  -- Uses PERCENTILE_CONT which needs a numeric, so NULL-safe via FILTER.
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY elapsed_ms)
    FILTER (WHERE elapsed_ms IS NOT NULL AND elapsed_ms > 0)         AS median_elapsed_ms_90d
FROM base
GROUP BY user_id;

-- View inherits RLS from the base table. Authenticated users see only
-- their own aggregated row; level-9+ admins see everyone (via the new
-- admin_select policy).
GRANT SELECT ON public.v_user_pronunciation_stats TO authenticated;

COMMENT ON VIEW public.v_user_pronunciation_stats IS
  'Per-user pronunciation stats over 7/30/90-day rolling windows. Derives from speech_attempts in real time; no cron needed at current scale. Switch to MATERIALIZED VIEW + pg_cron if this gets slow.';
