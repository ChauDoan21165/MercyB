-- Email re-engagement send log (A6 / Step 4 retention skeleton).
--
-- Records every re-engagement email the system *intends* to send. Rows are
-- inserted as status='pending' by the email-reengagement edge function. The
-- production sender (deferred — vendor TBD) flips them to 'sent' / 'failed'
-- after the actual Resend (or other) call. 'skipped' is used when a user is
-- categorized but should not receive an email this run (e.g., already received
-- a re-engagement email recently, or last_active_at is too old to bother).
--
-- This table is admin-internal. RLS denies all client access; only the
-- service-role key (used by edge functions and SQL Editor) can read/write.
--
-- Reversibility:
--   DROP TABLE IF EXISTS public.email_sends_log;

CREATE TABLE IF NOT EXISTS public.email_sends_log (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email         text NOT NULL,
  campaign      text NOT NULL,
  scheduled_at  timestamptz NOT NULL DEFAULT now(),
  sent_at       timestamptz,
  status        text NOT NULL DEFAULT 'pending',
  error_message text,
  CONSTRAINT email_sends_log_status_chk
    CHECK (status IN ('pending', 'sent', 'failed', 'skipped')),
  CONSTRAINT email_sends_log_campaign_chk
    CHECK (campaign IN ('reengagement_7d', 'reengagement_14d', 'reengagement_30d'))
);

COMMENT ON TABLE public.email_sends_log IS
  'Re-engagement email queue + audit trail. Admin-internal; populated by email-reengagement edge function.';

-- Fast lookup of "what should the sender process next".
CREATE INDEX IF NOT EXISTS idx_email_sends_log_pending
  ON public.email_sends_log (status, scheduled_at)
  WHERE status = 'pending';

-- Prevent re-queueing the same campaign for the same user while one is still pending.
-- (Once status flips to 'sent' or 'skipped', a new row may be queued in a future run.)
CREATE UNIQUE INDEX IF NOT EXISTS uq_email_sends_log_user_campaign_pending
  ON public.email_sends_log (user_id, campaign)
  WHERE status = 'pending';

-- Audit history per user.
CREATE INDEX IF NOT EXISTS idx_email_sends_log_user_id
  ON public.email_sends_log (user_id, scheduled_at DESC);

-- ── RLS: service-role only ────────────────────────────────────────────────
ALTER TABLE public.email_sends_log ENABLE ROW LEVEL SECURITY;

-- No SELECT/INSERT/UPDATE/DELETE policies are created. With RLS enabled and
-- no policies, anon + authenticated requests get zero access. service_role
-- bypasses RLS, so edge functions and SQL Editor (admin) can still operate.
