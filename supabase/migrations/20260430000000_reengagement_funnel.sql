-- A10 — Re-engagement funnel campaigns.
--
-- Layered on top of A6's email_sends_log skeleton (PR #81) and the trial-
-- expiry extension (20260425080800_trial_expiry_funnel.sql). Adds the five
-- behavior-based + monthly-broadcast campaign values that the
-- email-reengagement edge function now produces.
--
-- The campaign_type column already accepts 'reengagement' from the trial-
-- expiry migration, so no campaign_type change is needed here — only the
-- campaign CHECK constraint is replaced.
--
-- Reversibility:
--   ALTER TABLE public.email_sends_log
--     DROP CONSTRAINT IF EXISTS email_sends_log_campaign_chk_v3;
--   ALTER TABLE public.email_sends_log
--     ADD CONSTRAINT email_sends_log_campaign_chk_v2
--     CHECK (
--       campaign IN (
--         'reengagement_7d',
--         'reengagement_14d',
--         'reengagement_30d',
--         'trial_expiry_d_minus_3',
--         'trial_expiry_d_minus_1',
--         'trial_expiry_d_plus_1'
--       )
--     );

ALTER TABLE public.email_sends_log
  DROP CONSTRAINT IF EXISTS email_sends_log_campaign_chk_v2;

ALTER TABLE public.email_sends_log
  ADD CONSTRAINT email_sends_log_campaign_chk_v3
  CHECK (
    campaign IN (
      -- A6 skeleton (time-based)
      'reengagement_7d',
      'reengagement_14d',
      'reengagement_30d',
      -- Trial-expiry funnel (PR #149/#102)
      'trial_expiry_d_minus_3',
      'trial_expiry_d_minus_1',
      'trial_expiry_d_plus_1',
      -- A10 re-engagement funnel (this migration)
      'reengagement_active_then_silent',
      'reengagement_trial_completed_d_plus_14',
      'reengagement_post_subscribe_d_plus_7',
      'reengagement_almost_lapsed',
      'reengagement_added_something_new'
    )
  );

COMMENT ON CONSTRAINT email_sends_log_campaign_chk_v3 ON public.email_sends_log IS
  'Allowed campaign keys across all email tracks. Extending: add the new value here and bump the constraint version (v4, v5...).';
