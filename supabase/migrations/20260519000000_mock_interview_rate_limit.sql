-- Mock interview server-side rate limit (revenue protection).
--
-- WHY THIS EXISTS
-- ───────────────────────────────────────────────────────────────────────
-- A9's mock interview rooms shipped (PR #176) with a localStorage-only
-- weekly cap. localStorage is bypassable via private browsing or one
-- click of "clear site data". Mock interview is positioned as a
-- flagship paid feature ("luyện phỏng vấn" sells 200K VND/month);
-- without server-side enforcement, free-tier users can run unlimited
-- sessions and the monetization gate is theatre.
--
-- This migration installs the persistence layer the new
-- `mock-interview` edge function reads + writes:
--
--   1. `public.mock_interview_sessions` — one row per session start.
--      Status flips to `completed` when the user finishes (or
--      `abandoned` if the client never calls /end). The rate-limit
--      query counts rows by `started_at` regardless of status.
--   2. RLS — owners read their own; service_role writes (the edge
--      function uses the service role).
--   3. Hot-path index on `(user_id, started_at)` for the weekly
--      count.
--
-- The server-side gate logic lives in
-- `supabase/functions/_shared/mockInterviewRateLimit.ts` (computed
-- against this table from the edge function).
--
-- HOW TO MANUALLY RESET A USER'S COUNT (admin / support)
--   DELETE FROM public.mock_interview_sessions
--   WHERE user_id = '<uuid>'
--     AND started_at >= date_trunc('week', now() AT TIME ZONE 'Asia/Ho_Chi_Minh');
--
-- HOW TO DISABLE ENFORCEMENT WITHOUT DROPPING DATA
--   Set the `MOCK_INTERVIEW_RATE_LIMIT_ENABLED` env var to `false` on
--   the edge function and redeploy. The function falls open. The
--   table keeps logging (analytics still work).

CREATE TABLE IF NOT EXISTS public.mock_interview_sessions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_id   text NOT NULL,
  started_at    timestamptz NOT NULL DEFAULT now(),
  completed_at  timestamptz,
  status        text NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'completed', 'abandoned'))
);

-- Hot path: weekly-count query and "user's recent sessions" admin lookup.
CREATE INDEX IF NOT EXISTS idx_mock_interview_sessions_user_started
  ON public.mock_interview_sessions (user_id, started_at DESC);

-- Secondary index for telemetry rollups (per-day session volume).
CREATE INDEX IF NOT EXISTS idx_mock_interview_sessions_started
  ON public.mock_interview_sessions (started_at DESC);

ALTER TABLE public.mock_interview_sessions ENABLE ROW LEVEL SECURITY;

-- Owner read — drives the "X of Y this week" indicator on the room
-- page (the client may call this directly via the supabase-js client
-- in addition to the edge function's RPC path).
DROP POLICY IF EXISTS mock_interview_sessions_owner_select
  ON public.mock_interview_sessions;
CREATE POLICY mock_interview_sessions_owner_select
  ON public.mock_interview_sessions
  FOR SELECT
  USING (user_id = auth.uid());

-- No INSERT/UPDATE/DELETE policies for clients — the edge function
-- writes via the service role (which bypasses RLS) and we don't want
-- the client setting its own scenario_id / status server-side.

COMMENT ON TABLE public.mock_interview_sessions IS
  'One row per mock interview session. Drives the weekly free-tier rate limit and conversion telemetry. Edge function `mock-interview` is the canonical writer; clients can SELECT their own rows via RLS for the "X of Y this week" indicator.';

COMMENT ON COLUMN public.mock_interview_sessions.status IS
  'active = started but not finished; completed = /end called; abandoned = inferred (cron may flip stale active sessions in a future migration).';
