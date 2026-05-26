INSERT INTO public.feature_flags (flag_key, is_enabled, description)
VALUES ('google_tts', false, 'Enable Google Cloud Text-to-Speech for Mercy cloud voice.')
ON CONFLICT (flag_key) DO UPDATE
SET description = EXCLUDED.description;
