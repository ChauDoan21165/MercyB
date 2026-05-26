-- Real-world listening library.
--
-- Two tables:
--   listening_clips         — public catalogue, anyone can read
--   user_listening_progress — per-user attempt log, RLS owner-only
--
-- audio_url is nullable for now: the seed pack stores transcripts +
-- metadata, and a follow-up TTS task populates the URLs after audio
-- is generated. The /listening UI shows a "Audio đang được chuẩn bị"
-- notice when audio_url is null.

-- The library has no PII, no scoring secrets — just dialogue text
-- and comprehension keys. Public read is intentional so the home
-- "Continue: Restaurant" suggestion card can render for anonymous
-- visitors as well as signed-in users.

-- pgcrypto is fully qualified for any future random-id use; no
-- bare gen_random_uuid() calls in this migration.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Catalogue ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.listening_clips (
  id                       text        PRIMARY KEY,
  category                 text        NOT NULL,
  title_en                 text        NOT NULL,
  title_vi                 text        NOT NULL,
  description_vi           text        NOT NULL,
  duration_seconds         integer     NOT NULL,
  accent                   text        NOT NULL,
  difficulty               text        NOT NULL,
  transcript               jsonb       NOT NULL,
  vocabulary_keys          text[]      NOT NULL DEFAULT '{}',
  comprehension_questions  jsonb       NOT NULL,
  audio_url                text,
  created_at               timestamptz NOT NULL DEFAULT now(),

  CHECK (category IN (
    'restaurant', 'doctor', 'customer-service', 'job-interview',
    'casual', 'shopping', 'transportation'
  )),
  CHECK (accent     IN ('us', 'uk', 'au', 'ca')),
  CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  CHECK (duration_seconds BETWEEN 15 AND 180)
);

COMMENT ON TABLE public.listening_clips IS
  'Real-world listening practice catalogue. Public-read by RLS — no PII or scoring secrets stored here.';
COMMENT ON COLUMN public.listening_clips.audio_url IS
  'NULL until the TTS background job has generated audio. The /listening UI degrades to transcript-only when null.';

CREATE INDEX IF NOT EXISTS idx_listening_clips_category
  ON public.listening_clips (category);
CREATE INDEX IF NOT EXISTS idx_listening_clips_difficulty
  ON public.listening_clips (difficulty);
CREATE INDEX IF NOT EXISTS idx_listening_clips_accent
  ON public.listening_clips (accent);

-- ── Per-user progress ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_listening_progress (
  user_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clip_id          text        NOT NULL REFERENCES public.listening_clips(id) ON DELETE CASCADE,
  completed_at     timestamptz NOT NULL DEFAULT now(),
  score            integer     NOT NULL,
  total_questions  integer     NOT NULL,
  replays          integer     NOT NULL DEFAULT 0,

  PRIMARY KEY (user_id, clip_id),
  CHECK (score >= 0),
  CHECK (total_questions > 0),
  CHECK (score <= total_questions),
  CHECK (replays >= 0)
);

COMMENT ON TABLE public.user_listening_progress IS
  'One row per (user, clip) listening completion. Owner-only RLS — never leaks per-user activity to others.';

CREATE INDEX IF NOT EXISTS idx_user_listening_progress_user
  ON public.user_listening_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_user_listening_progress_completed
  ON public.user_listening_progress (user_id, completed_at DESC);

-- ── RLS ───────────────────────────────────────────────────────────────

ALTER TABLE public.listening_clips         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_listening_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS listening_public_read ON public.listening_clips;
CREATE POLICY listening_public_read
  ON public.listening_clips
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS listening_progress_owner ON public.user_listening_progress;
CREATE POLICY listening_progress_owner
  ON public.user_listening_progress
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── Service-role write helper (admin / TTS pipeline only) ─────────────
-- Catalogue updates always go through service_role (the TTS job
-- backfilling audio_url, or admin imports). RLS denies INSERT/UPDATE
-- to authenticated by omission of a policy; service_role bypasses RLS
-- entirely. This is intentional — clip authoring is not user-facing.
