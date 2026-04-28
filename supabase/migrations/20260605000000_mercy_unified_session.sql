-- Mercy unification — Step 1: per-user session preference + context.
--
-- The product surface is moving from a multi-tab Mercy drawer (Speak,
-- Say, Teacher, Notebook) to a single conversational chat. This table
-- records that preference per user plus a small JSON context summary
-- so the unified chat can pick up where the user left off.
--
-- Existing `mercy_messages` (introduced earlier) is unchanged. The
-- legacy multi-tab UI keeps working — controlled by `session_type`
-- below.
--
-- Design:
--   - One row per user: PRIMARY KEY (user_id). Cheap to read on every
--     Mercy mount.
--   - session_type: 'unified' (default) routes to UnifiedMercyChat;
--     'speak_only' is a fallback flag the existing speak-tab code can
--     check; 'classic' opts back into the legacy drawer.
--   - context_summary: jsonb blob the chat writes — currently lesson
--     in progress, last intent detected, last sentence reviewed. Lets
--     a returning user resume without re-reading prior messages.
--
-- Reversibility:
--   DROP TABLE IF EXISTS public.mercy_unified_sessions;

CREATE TABLE IF NOT EXISTS public.mercy_unified_sessions (
  user_id           uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type      text NOT NULL DEFAULT 'unified'
                    CHECK (session_type IN ('unified', 'classic', 'speak_only')),
  started_at        timestamptz NOT NULL DEFAULT now(),
  last_message_at   timestamptz NOT NULL DEFAULT now(),
  context_summary   jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_mercy_unified_sessions_last_message
  ON public.mercy_unified_sessions (last_message_at DESC);

COMMENT ON TABLE public.mercy_unified_sessions IS
  'Per-user Mercy session preference + context. Default session_type = ''unified'' (single chat). Legacy multi-tab opt-in via ''classic''.';

-- ── RLS ────────────────────────────────────────────────────────────────────
ALTER TABLE public.mercy_unified_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS mercy_unified_sessions_select_own
  ON public.mercy_unified_sessions;
CREATE POLICY mercy_unified_sessions_select_own
  ON public.mercy_unified_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS mercy_unified_sessions_write_own
  ON public.mercy_unified_sessions;
CREATE POLICY mercy_unified_sessions_write_own
  ON public.mercy_unified_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE ON public.mercy_unified_sessions TO authenticated;
