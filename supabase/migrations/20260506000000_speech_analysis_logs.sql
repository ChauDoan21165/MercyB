-- C3 — speech-analyze hardening (A4 follow-up to A3 audit).
--
-- Audit log for every speech-analyze invocation. Replaces the previous
-- pattern where the function silently logged into mb_pronunciation_attempts
-- on success only. The new table records every call — including rejections
-- (rate-limited, budget-exceeded, invalid audio, Whisper errors) so we can
-- (a) catch abuse patterns, (b) trace OpenAI cost back to the calling user,
-- and (c) explain to a user why a particular call was rejected.
--
-- Identity is JWT-derived in the edge function, so user_id here is
-- authoritative — not spoofable from form data.
--
-- Status enum (free-form text on purpose — easier to add new statuses
-- without a migration; constrained by check):
--   'ok'                — Whisper ran, response returned
--   'no_speech'         — Whisper returned empty transcript
--   'rate_limited'      — caller hit the per-user rate limit
--   'budget_exceeded'   — caller over check_ai_budget
--   'invalid_audio'     — file too big, wrong mime type, missing
--   'whisper_error'     — OpenAI returned non-2xx
--   'auth_required'     — no JWT or invalid JWT (logged with NULL user_id
--                         only when we know nothing — usually we just
--                         return 401 and don't log)
--
-- RLS:
--   - SELECT: owner only (a user can read their own history later if we
--     build a "speech history" UI). No admin-tier read policy here —
--     admin investigations should go through the service role from the
--     server, not via a client SELECT.
--   - INSERT: no client-facing policy. Inserts come from the edge
--     function via the service role, which bypasses RLS.
--
-- Reversibility:
--   DROP POLICY IF EXISTS speech_analysis_logs_select_own ON public.speech_analysis_logs;
--   DROP TABLE IF EXISTS public.speech_analysis_logs;

CREATE TABLE IF NOT EXISTS public.speech_analysis_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  audio_seconds   numeric(6, 2),
  openai_cost_usd numeric(10, 6),
  status          text NOT NULL,
  error_msg       text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT speech_analysis_logs_status_chk
    CHECK (status IN (
      'ok',
      'no_speech',
      'rate_limited',
      'budget_exceeded',
      'invalid_audio',
      'whisper_error',
      'auth_required'
    )),
  CONSTRAINT speech_analysis_logs_audio_seconds_chk
    CHECK (audio_seconds IS NULL OR (audio_seconds >= 0 AND audio_seconds <= 600)),
  CONSTRAINT speech_analysis_logs_cost_chk
    CHECK (openai_cost_usd IS NULL OR openai_cost_usd >= 0)
);

COMMENT ON TABLE public.speech_analysis_logs IS
  'C3 audit log: every speech-analyze invocation. Identity is JWT-derived in the edge function (not from form data).';

COMMENT ON COLUMN public.speech_analysis_logs.audio_seconds IS
  'Audio duration in seconds. NULL when the call was rejected before Whisper ran.';

COMMENT ON COLUMN public.speech_analysis_logs.openai_cost_usd IS
  'Estimated Whisper cost. NULL when the call was rejected before Whisper ran.';

-- Per-user history lookup ("show me my last N attempts").
CREATE INDEX IF NOT EXISTS idx_speech_analysis_logs_user_recent
  ON public.speech_analysis_logs (user_id, created_at DESC);

-- Status roll-ups for cost / abuse monitoring.
CREATE INDEX IF NOT EXISTS idx_speech_analysis_logs_status_recent
  ON public.speech_analysis_logs (status, created_at DESC);

-- ── RLS ──────────────────────────────────────────────────────────────────

ALTER TABLE public.speech_analysis_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS speech_analysis_logs_select_own ON public.speech_analysis_logs;
CREATE POLICY speech_analysis_logs_select_own
  ON public.speech_analysis_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- No INSERT / UPDATE / DELETE policies — writes go through the service
-- role from the speech-analyze edge function. Clients have no path to
-- forge an audit row.
