-- Step 9 (Monetization) — extend email_sends_log for the trial-expiry
-- 3-stage funnel (D-3 / D-1 / D+1).
--
-- The skeleton table from PR #email_sends_log only allowed three
-- reengagement_*d campaign values. Trial-expiry emails are a separate
-- track with their own cadence, so this migration:
--
--   1. Adds a `campaign_type` discriminator column so reports + dashboards
--      can group "all reengagement" vs "all trial expiry" vs future tracks
--      without parsing the campaign string.
--   2. Backfills `campaign_type` for the existing reengagement_*d rows so
--      it's NOT NULL going forward.
--   3. Replaces the campaign CHECK constraint with one that accepts the
--      new trial_expiry_* values alongside the original reengagement_*.
--   4. Adds a composite index on (user_id, campaign_type, sent_at) so the
--      "has this user already received a trial-expiry email?" query stays
--      fast as the log grows.
--
-- Reversibility:
--   ALTER TABLE public.email_sends_log
--     DROP CONSTRAINT IF EXISTS email_sends_log_campaign_chk_v2;
--   ALTER TABLE public.email_sends_log
--     ADD CONSTRAINT email_sends_log_campaign_chk
--     CHECK (campaign IN ('reengagement_7d','reengagement_14d','reengagement_30d'));
--   DROP INDEX IF EXISTS public.idx_email_sends_log_user_type_sent_at;
--   ALTER TABLE public.email_sends_log DROP COLUMN IF EXISTS campaign_type;

-- ── 1. campaign_type column ──────────────────────────────────────────────

ALTER TABLE public.email_sends_log
  ADD COLUMN IF NOT EXISTS campaign_type text;

UPDATE public.email_sends_log
SET campaign_type = 'reengagement'
WHERE campaign_type IS NULL
  AND campaign IN ('reengagement_7d', 'reengagement_14d', 'reengagement_30d');

ALTER TABLE public.email_sends_log
  ALTER COLUMN campaign_type SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'email_sends_log_campaign_type_chk'
  ) THEN
    ALTER TABLE public.email_sends_log
      ADD CONSTRAINT email_sends_log_campaign_type_chk
      CHECK (campaign_type IN ('reengagement', 'trial_expiry', 'other'));
  END IF;
END $$;

-- ── 2. Replace campaign CHECK to include trial_expiry_* values ───────────

ALTER TABLE public.email_sends_log
  DROP CONSTRAINT IF EXISTS email_sends_log_campaign_chk;

ALTER TABLE public.email_sends_log
  ADD CONSTRAINT email_sends_log_campaign_chk_v2
  CHECK (
    campaign IN (
      'reengagement_7d',
      'reengagement_14d',
      'reengagement_30d',
      'trial_expiry_d_minus_3',
      'trial_expiry_d_minus_1',
      'trial_expiry_d_plus_1'
    )
  );

-- ── 3. Composite index for type-filtered audit lookups ──────────────────
-- Hot path: "did this user already receive a trial_expiry email this run?"
-- The existing `(user_id, scheduled_at DESC)` index handles "all rows for
-- this user", but does not let Postgres skip non-trial_expiry rows fast.

CREATE INDEX IF NOT EXISTS idx_email_sends_log_user_type_sent_at
  ON public.email_sends_log (user_id, campaign_type, sent_at DESC);

-- ── 4. Comment refresh ──────────────────────────────────────────────────

COMMENT ON COLUMN public.email_sends_log.campaign_type IS
  'High-level discriminator for the email track: reengagement | trial_expiry | other. Lets dashboards group sends without parsing the campaign string.';
