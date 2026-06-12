-- Allow the web-facing feedback function (running with the anon key) to
-- insert rows into mercy_feedback_events without needing the service-role key.
-- RLS is already enabled on this table (20260422020000). There is no
-- SELECT/UPDATE/DELETE policy here — inserts only. The function enforces
-- a 50-item cap and explicit column allowlist at the application layer.

DROP POLICY IF EXISTS "mercy_feedback_events_anon_insert" ON public.mercy_feedback_events;
DROP POLICY IF EXISTS "mercy_feedback_events_auth_insert" ON public.mercy_feedback_events;

CREATE POLICY "mercy_feedback_events_anon_insert"
  ON public.mercy_feedback_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "mercy_feedback_events_auth_insert"
  ON public.mercy_feedback_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
