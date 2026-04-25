-- C2 fix — admin email audit trail.
--
-- Records every outbound admin-initiated email so we can:
--   1. Trace abuse if a service-role key or admin account is compromised.
--   2. Implement per-admin per-hour rate limits without depending on the
--      vendor's API surface (Resend doesn't expose per-admin counts).
--
-- The send-feedback-reply edge function is the first writer; future
-- admin-side mailers should INSERT here too. RLS is read-only by admin
-- (level >= 9); writes go through SECURITY DEFINER edge functions only.
--
-- Reversibility:
--   DROP TABLE IF EXISTS public.email_audit;

CREATE TABLE IF NOT EXISTS public.email_audit (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  feedback_id     uuid REFERENCES public.feedback(id) ON DELETE SET NULL,
  recipient_email text NOT NULL,
  subject         text NOT NULL,
  sent_at         timestamptz NOT NULL DEFAULT now(),
  success         boolean NOT NULL,
  error_message   text,
  metadata        jsonb
);

CREATE INDEX IF NOT EXISTS email_audit_admin_idx
  ON public.email_audit (admin_user_id, sent_at DESC);

CREATE INDEX IF NOT EXISTS email_audit_feedback_idx
  ON public.email_audit (feedback_id);

COMMENT ON TABLE public.email_audit IS
  'Audit trail of admin-initiated outbound emails. SECURITY DEFINER edge functions write; admin reads via RLS.';

-- ── RLS ──────────────────────────────────────────────────────────────────

ALTER TABLE public.email_audit ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_admin_level') THEN
    EXECUTE $sql$
      DROP POLICY IF EXISTS email_audit_select_admin ON public.email_audit;
      CREATE POLICY email_audit_select_admin
        ON public.email_audit
        FOR SELECT
        TO authenticated
        USING (public.get_admin_level() >= 9);
    $sql$;
  END IF;
END
$$;

-- ── Per-admin hourly rate limit RPC ──────────────────────────────────────
-- Returns true if the caller is allowed to send another email; false if
-- they have already sent N within the last hour. Used by send-feedback-reply
-- before invoking Resend. SECURITY DEFINER so it can read across all rows
-- regardless of RLS.
CREATE OR REPLACE FUNCTION public.check_admin_email_rate_limit(
  p_admin_id  uuid,
  p_max       integer DEFAULT 10,
  p_window    interval DEFAULT '1 hour'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  recent_count integer;
BEGIN
  IF p_admin_id IS NULL THEN
    RETURN false;
  END IF;

  SELECT COUNT(*) INTO recent_count
    FROM public.email_audit
    WHERE admin_user_id = p_admin_id
      AND sent_at > now() - p_window
      AND success = true;

  RETURN recent_count < p_max;
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_admin_email_rate_limit(uuid, integer, interval) TO authenticated;
