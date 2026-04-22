-- app_feedback RLS policies
--
-- Problem: admins seeing "permission denied for table app_feedback" on
-- /admin/feedback. The table has RLS enabled but no SELECT policy grants
-- access. App-level admin status is invisible to Postgres.
--
-- This migration:
-- - Ensures RLS is on.
-- - Drops any stale policies to stay idempotent.
-- - Adds a SELECT policy for admins (admin_level >= 9 via get_admin_level).
-- - Adds an INSERT policy so authenticated users can submit their own
--   feedback (matches src/components/room/hooks/useRoomFeedback.ts).
-- - Grants the table-level privileges authenticated needs before RLS is
--   evaluated (the same gotcha that broke study_log + teacher_memory).

ALTER TABLE public.app_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "app_feedback_admin_read"     ON public.app_feedback;
DROP POLICY IF EXISTS "app_feedback_user_insert"    ON public.app_feedback;
DROP POLICY IF EXISTS "Admins can read app_feedback" ON public.app_feedback;
DROP POLICY IF EXISTS "Users can send feedback"     ON public.app_feedback;

-- ── Admins: read everything ─────────────────────────────────────────────────
CREATE POLICY "app_feedback_admin_read"
  ON public.app_feedback
  FOR SELECT
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);

-- ── Authenticated users: insert their own feedback ──────────────────────────
-- user_id is nullable in the INSERT payload (see useRoomFeedback.ts), so we
-- accept both NULL and the caller's own uid. Admins also satisfy this.
CREATE POLICY "app_feedback_user_insert"
  ON public.app_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IS NULL
    OR user_id = auth.uid()
  );

-- Table-level grants. Without these, Postgres rejects INSERT before RLS
-- is even checked.
GRANT SELECT, INSERT ON public.app_feedback TO authenticated;
