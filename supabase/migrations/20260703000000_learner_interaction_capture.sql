-- Track 2 — Learner interaction data capture pipeline.
--
-- Creates two NEW objects only. No ALTER, no DROP, no schema cutover,
-- no changes to any existing table (speech_attempts is intentionally
-- untouched — this is a separate, anonymized, append-only store).
--
--   1. public.learner_interaction_capture
--        Append-only capture of correction-engine + pronunciation
--        results. NO raw user_id (only an HMAC `learner_hash` computed
--        server-side in the learner-capture edge function), NO raw
--        audio (`audio_retained` is a hard false), text columns are
--        PII-scrubbed by the edge function before they ever land here.
--        RLS is enabled with NO user-facing policies: end users can
--        neither read nor write it. Writes happen only via the
--        learner-capture edge function (service-role, bypasses RLS).
--        Analytics reads happen only via service-role.
--
--   2. public.learning_data_consent
--        Per-user, explicit opt-in for learning-data capture. This is
--        NOT marketing-tracking consent (that lives in localStorage via
--        behaviorTrackingFlag.ts and gates Pixel/GA4/UTM) — keep the two
--        separate. Users own their row (RLS self-select/insert/update).
--
-- The whole pipeline stays dark behind the client flag
-- LEARNING_CAPTURE_ENABLED (default OFF) until this migration is applied
-- (via SQL Editor — NOT `supabase db push`) and a consent UI ships.

BEGIN;

-- ─────────────────────────────────────────────────────────────────────
-- 1. Capture table
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.learner_interaction_capture (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- HMAC-SHA256(user_id, LEARNER_CAPTURE_PEPPER), 64-char lowercase hex.
  -- Computed in the edge function; the raw user_id is never stored.
  learner_hash       text        NOT NULL,
  -- HMAC of the client session id, for grouping a single sitting.
  session_hash       text,

  interaction_type   text        NOT NULL
                       CHECK (interaction_type IN ('correction', 'pronunciation', 'conversation')),
  target_language    text,
  explain_language   text,

  -- PII-scrubbed by the edge function (emails / UUIDs / long digit runs
  -- / URLs removed) before insert.
  input_text         text,
  correction_status  text
                       CHECK (correction_status IS NULL OR correction_status IN
                         ('corrected', 'unchanged', 'needs_ai', 'abstained')),
  applied_rule_ids   text[]      NOT NULL DEFAULT '{}',
  corrected_text     text,

  -- Pronunciation-only; null for text-only interactions.
  pron_overall_score smallint    CHECK (pron_overall_score IS NULL OR
                                        (pron_overall_score >= 0 AND pron_overall_score <= 100)),
  pron_word_scores   jsonb,
  pron_tone_scores   jsonb,

  -- INVARIANT: raw audio is never retained. This column exists to make
  -- that promise auditable; it must always be false.
  audio_retained     boolean     NOT NULL DEFAULT false
                       CHECK (audio_retained = false),

  -- Event time from the client; created_at is the server write time.
  client_ts          timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),

  -- Which consent text the learner agreed to, and a forward-compat
  -- version so future shape changes need no ALTER on existing rows.
  consent_version    text,
  schema_version     smallint    NOT NULL DEFAULT 1
);

COMMENT ON TABLE public.learner_interaction_capture IS
  'Track 2: append-only, anonymized capture of correction + pronunciation interactions. No raw user_id, no raw audio. Written only by the learner-capture edge function (service-role). Consent-gated via public.learning_data_consent.';

-- Analytics access patterns: by cohort-hash and by time.
CREATE INDEX IF NOT EXISTS learner_interaction_capture_learner_hash_idx
  ON public.learner_interaction_capture (learner_hash);
CREATE INDEX IF NOT EXISTS learner_interaction_capture_created_at_idx
  ON public.learner_interaction_capture (created_at);
CREATE INDEX IF NOT EXISTS learner_interaction_capture_type_idx
  ON public.learner_interaction_capture (interaction_type);

-- RLS on, NO user-facing policies. End users get no read/write; only
-- the service-role edge function (which bypasses RLS) ever touches it.
ALTER TABLE public.learner_interaction_capture ENABLE ROW LEVEL SECURITY;
-- Belt-and-suspenders: force RLS even for the table owner so a stray
-- non-service-role query can never read it.
ALTER TABLE public.learner_interaction_capture FORCE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────────────
-- 2. Consent table
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.learning_data_consent (
  user_id         uuid        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  consented       boolean     NOT NULL DEFAULT false,
  consent_version text,
  updated_at      timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.learning_data_consent IS
  'Per-user explicit opt-in for Track 2 learning-data capture. Distinct from marketing-tracking consent (localStorage). Absence of a row = not consented = no capture.';

ALTER TABLE public.learning_data_consent ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'learning_data_consent'
      AND policyname = 'learning_data_consent_self_select'
  ) THEN
    CREATE POLICY learning_data_consent_self_select
      ON public.learning_data_consent
      FOR SELECT TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'learning_data_consent'
      AND policyname = 'learning_data_consent_self_insert'
  ) THEN
    CREATE POLICY learning_data_consent_self_insert
      ON public.learning_data_consent
      FOR INSERT TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'learning_data_consent'
      AND policyname = 'learning_data_consent_self_update'
  ) THEN
    CREATE POLICY learning_data_consent_self_update
      ON public.learning_data_consent
      FOR UPDATE TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

COMMIT;
