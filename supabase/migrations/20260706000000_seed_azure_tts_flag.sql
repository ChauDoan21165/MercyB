-- Seed the azure_tts feature flag for the mercy-tts edge function.
-- Azure Cognitive Services TTS is the PRIMARY Mercy cloud voice provider
-- (native VN neural voice; reuses the AZURE_SPEECH_* secrets).
-- Seeded disabled so the deploy is inert until Chau flips it on (or adds a
-- cohort to enabled_user_ids) — ElevenLabs keeps serving until then.
INSERT INTO public.feature_flags (flag_key, is_enabled, description)
VALUES ('azure_tts', false, 'Enable Azure Cognitive Services Text-to-Speech as the primary Mercy cloud voice.')
ON CONFLICT (flag_key) DO UPDATE
SET description = EXCLUDED.description;
