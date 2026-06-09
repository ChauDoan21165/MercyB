-- Lane C / C2 — Conversation data-capture pipeline (the data-flywheel moat).
--
-- New objects ONLY (no ALTER on existing tables, no DROP, no cutover) per the
-- Supabase lockout. Human-reviewed; apply MANUALLY via the SQL Editor — do NOT
-- run `supabase db push` from CI. Hand-off target for Lane B.
--
-- WHAT THIS IS, AND HOW IT DIFFERS FROM Track 2 (20260703000000_learner_
-- interaction_capture.sql): that table is the ANONYMIZED analytics lake —
-- HMAC learner_hash, no raw user_id, PII-scrubbed, written only by a
-- service-role edge function. THESE two tables are the per-learner, USER-OWNED
-- conversation record: raw user_id + raw turn text, written by the browser
-- client (src/lib/tutor/conversationCapture.ts) under self-RLS, exactly like
-- public.feature_outcome_events. They are complementary, not duplicates: one
-- powers cohort analytics, the other is the learner's own durable transcript
-- and the per-conversation retention summary.
--
-- PRIVACY: rows carry raw learner_input / ai_response. RLS makes them
-- strictly self-owned (a user reads/writes only their own rows; no broad
-- SELECT). The CALLER (Lane A) is responsible for gating capture behind
-- learning-data consent — see public.learning_data_consent and the
-- LEARNING_CAPTURE_ENABLED flag. The capture module writes whenever invoked;
-- it does not self-gate.

BEGIN;

-- ─────────────────────────────────────────────────────────────────────────
-- 1. conversations — one row per tutor conversation session
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.conversations (
  id                   uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  -- Speak-topic / theme label this conversation ran (free text key, e.g.
  -- "banking", "job_interview"); nullable for ad-hoc sessions.
  theme_id             text,
  started_at           timestamptz NOT NULL DEFAULT now(),
  ended_at             timestamptz,
  -- Session rollups, populated on endSession(). Defaulted to 0 so a session
  -- that never cleanly ends still reads sanely.
  turn_count           integer     NOT NULL DEFAULT 0
                         CHECK (turn_count >= 0),
  errors_detected      integer     NOT NULL DEFAULT 0
                         CHECK (errors_detected >= 0),
  corrections_accepted integer     NOT NULL DEFAULT 0
                         CHECK (corrections_accepted >= 0),
  -- Warm, Vietnamese-first recap text (or any caller-supplied summary).
  summary              text
);

COMMENT ON TABLE public.conversations IS
  'C2 data-flywheel: one row per tutor conversation session. User-owned (self-RLS), written by the browser client (src/lib/tutor/conversationCapture.ts). Distinct from the anonymized Track-2 learner_interaction_capture lake. Consent-gating is the caller''s (Lane A) responsibility.';

CREATE INDEX IF NOT EXISTS conversations_user_started_idx
  ON public.conversations (user_id, started_at);
CREATE INDEX IF NOT EXISTS conversations_theme_idx
  ON public.conversations (theme_id);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Self-owned: a learner inserts / reads / updates only their own sessions.
-- Analytics reads go through service-role, which bypasses RLS — so no broad
-- SELECT policy is granted (mirrors feature_outcome_events).
DROP POLICY IF EXISTS conversations_insert_own ON public.conversations;
CREATE POLICY conversations_insert_own
  ON public.conversations
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS conversations_select_own ON public.conversations;
CREATE POLICY conversations_select_own
  ON public.conversations
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS conversations_update_own ON public.conversations;
CREATE POLICY conversations_update_own
  ON public.conversations
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────
-- 2. conversation_events — one row per turn / error / correction event
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.conversation_events (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid        NOT NULL REFERENCES public.conversations (id) ON DELETE CASCADE,
  turn_number     integer     NOT NULL DEFAULT 0
                    CHECK (turn_number >= 0),
  event_type      text        NOT NULL
                    CHECK (event_type IN (
                      'turn_completed',
                      'error_detected',
                      'correction_accepted',
                      'correction_rejected'
                    )),
  learner_input   text,
  ai_response     text,
  -- Structured per-event detail (the detected error or the correction the
  -- learner acted on); forward-compatible jsonb so the event shape can grow
  -- without an ALTER.
  error_details   jsonb,
  created_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.conversation_events IS
  'C2 data-flywheel: per-turn events for a conversation (turn_completed / error_detected / correction_accepted / correction_rejected). FK-cascades from public.conversations. Self-RLS via the parent''s user_id.';

CREATE INDEX IF NOT EXISTS conversation_events_conversation_idx
  ON public.conversation_events (conversation_id, turn_number);
CREATE INDEX IF NOT EXISTS conversation_events_type_idx
  ON public.conversation_events (event_type);

ALTER TABLE public.conversation_events ENABLE ROW LEVEL SECURITY;

-- Ownership is derived from the parent conversation's user_id. A learner may
-- insert / read an event only when they own its conversation. No UPDATE /
-- DELETE policy — events are append-only from the client's perspective.
DROP POLICY IF EXISTS conversation_events_insert_own ON public.conversation_events;
CREATE POLICY conversation_events_insert_own
  ON public.conversation_events
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.conversations c
       WHERE c.id = conversation_id
         AND c.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS conversation_events_select_own ON public.conversation_events;
CREATE POLICY conversation_events_select_own
  ON public.conversation_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
       WHERE c.id = conversation_id
         AND c.user_id = auth.uid()
    )
  );

COMMIT;
