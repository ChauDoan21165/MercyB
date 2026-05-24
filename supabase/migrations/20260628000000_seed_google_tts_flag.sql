-- A6: Google TTS server-side provider gate for Teacher Mercy voice.
-- OFF by default. Enable only after GOOGLE_TTS_API_KEY or
-- GOOGLE_CLOUD_TTS_API_KEY is configured and verified server-side.

INSERT INTO public.feature_flags (flag_key, is_enabled, description)
VALUES (
  'google_tts',
  false,
  'Use Google Cloud Text-to-Speech as the first server-side Teacher Mercy voice provider. OFF until a valid server-side Google TTS key is configured.'
)
ON CONFLICT (flag_key) DO UPDATE
SET
  description = EXCLUDED.description,
  is_enabled = public.feature_flags.is_enabled;
