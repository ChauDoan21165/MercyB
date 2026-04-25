-- Step 7 (AI Teacher v2) — Mock interview sessions.
--
-- Design:
--   - One row per session. A session is the user picking a scenario
--     (e.g. "tech-support-helpdesk"), answering 5–8 questions, and
--     getting a summary. We persist enough to resume mid-session and
--     to surface a "your past attempts" list later.
--   - `answers` is a jsonb array — one entry per submitted question.
--     Schema is defined and validated client-side in
--     src/lib/interview/interviewSession.ts. Keeping it jsonb means
--     the per-answer payload can grow (transcripts, audio refs,
--     scoring breakdowns) without another migration.
--   - `scenario_slug` is a free-form text reference into the static
--     scenario registry (`src/data/mock-interviews/scenarios.ts`).
--     We do NOT FK into a scenarios table because scenarios are code-
--     defined, not user-defined.
--
-- RLS:
--   Owner-only — a user can only see, insert, update, and delete
--   their own session rows. The `auth.uid() = user_id` check on every
--   policy enforces this. There's no admin escape — staff who need to
--   audit a session do it via the service role on the server.
--
-- Reversibility:
--   DROP POLICY IF EXISTS interview_sessions_select_own ON public.interview_sessions;
--   DROP POLICY IF EXISTS interview_sessions_insert_own ON public.interview_sessions;
--   DROP POLICY IF EXISTS interview_sessions_update_own ON public.interview_sessions;
--   DROP POLICY IF EXISTS interview_sessions_delete_own ON public.interview_sessions;
--   DROP TABLE IF EXISTS public.interview_sessions;

CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_slug  text NOT NULL,
  started_at     timestamptz NOT NULL DEFAULT now(),
  completed_at   timestamptz,
  answers        jsonb NOT NULL DEFAULT '[]'::jsonb,
  overall_score  double precision,
  CONSTRAINT interview_sessions_scenario_slug_chk
    CHECK (length(trim(scenario_slug)) BETWEEN 1 AND 80),
  CONSTRAINT interview_sessions_score_range_chk
    CHECK (overall_score IS NULL OR (overall_score >= 0 AND overall_score <= 1))
);

COMMENT ON TABLE public.interview_sessions IS
  'Mock-interview attempts (Step 7 / AI Teacher v2). One row per session. RLS owner-only.';

COMMENT ON COLUMN public.interview_sessions.scenario_slug IS
  'Reference into the static scenario registry in src/data/mock-interviews/scenarios.ts.';

COMMENT ON COLUMN public.interview_sessions.answers IS
  'jsonb array of InterviewAnswer (questionIndex, text, submittedAt, score). Validated client-side.';

-- "My past attempts" lookup.
CREATE INDEX IF NOT EXISTS idx_interview_sessions_user_recent
  ON public.interview_sessions (user_id, started_at DESC);

-- ── RLS ──────────────────────────────────────────────────────────────────

ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS interview_sessions_select_own ON public.interview_sessions;
CREATE POLICY interview_sessions_select_own
  ON public.interview_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS interview_sessions_insert_own ON public.interview_sessions;
CREATE POLICY interview_sessions_insert_own
  ON public.interview_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS interview_sessions_update_own ON public.interview_sessions;
CREATE POLICY interview_sessions_update_own
  ON public.interview_sessions
  FOR UPDATE
  TO authenticated
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS interview_sessions_delete_own ON public.interview_sessions;
CREATE POLICY interview_sessions_delete_own
  ON public.interview_sessions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
