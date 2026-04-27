-- ElevenLabs Vietnamese voice for Mercy (gated)
--
-- Three pieces:
--   1. feature_flags row 'elevenlabs_tts' — global OFF, empty cohort.
--      Chau toggles via Supabase dashboard (or adds a tester to
--      enabled_user_ids) once API key + voice IDs are in place.
--   2. mercy-tts-cache storage bucket — PUBLIC read so the browser can
--      hit `getPublicUrl(...)` without an extra auth round-trip. Service
--      role inserts the rendered mp3 keyed by sha256(text + voice_id).
--      Cache hits cost nothing; same text + voice = same hash forever.
--   3. mercy_tts_usage table — one row per ElevenLabs render (cache miss).
--      Powers the daily caps in supabase/functions/mercy-tts/index.ts:
--        - per-user: 50 renders / 24h
--        - global:   1000 renders / 24h  (≈ $3 / day at Creator pricing)
--      Cache hits are NOT logged; only paid renders count toward caps.
--
-- Reversibility:
--   DROP TABLE IF EXISTS public.mercy_tts_usage;
--   DROP POLICY IF EXISTS "mercy_tts_cache_public_read" ON storage.objects;
--   DELETE FROM storage.buckets WHERE id = 'mercy-tts-cache';
--   DELETE FROM public.feature_flags WHERE flag_key = 'elevenlabs_tts';

-- ── Feature flag (off by default) ──────────────────────────────────────
INSERT INTO public.feature_flags (flag_key, is_enabled, enabled_user_ids, description)
VALUES (
  'elevenlabs_tts',
  false,
  ARRAY[]::uuid[],
  'Use ElevenLabs cloud voices for Mercy speech instead of browser TTS. See supabase/functions/mercy-tts/ and src/hooks/useMercyVoice.ts. OFF until ELEVENLABS_API_KEY + voice IDs are configured.'
)
ON CONFLICT (flag_key) DO NOTHING;

-- ── Cache bucket ───────────────────────────────────────────────────────
-- Public read mirrors `room-audio` (post-Phase-2). Tier-gating + caps
-- live in the edge function, not in storage RLS.
INSERT INTO storage.buckets (id, name, public)
VALUES ('mercy-tts-cache', 'mercy-tts-cache', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

DROP POLICY IF EXISTS "mercy_tts_cache_public_read" ON storage.objects;
CREATE POLICY "mercy_tts_cache_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'mercy-tts-cache');

-- INSERT/UPDATE/DELETE intentionally restricted: only the edge function
-- (service-role key) writes to this bucket. No user-facing policies.

-- ── Usage table for daily caps ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mercy_tts_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  text_hash TEXT NOT NULL,
  voice_id TEXT NOT NULL,
  language TEXT NOT NULL,
  text_length INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mercy_tts_usage_user_created_idx
  ON public.mercy_tts_usage (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS mercy_tts_usage_created_idx
  ON public.mercy_tts_usage (created_at DESC);

ALTER TABLE public.mercy_tts_usage ENABLE ROW LEVEL SECURITY;

-- Users can read their own rows (for a future "TTS quota left today" UI).
DROP POLICY IF EXISTS "mercy_tts_usage_owner_read" ON public.mercy_tts_usage;
CREATE POLICY "mercy_tts_usage_owner_read"
  ON public.mercy_tts_usage
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- INSERT is service-role only (the edge function); no user-facing policy.
