-- A6: OpenAI Realtime voice chat gate for AI Tutor Journey/Speak.
-- OFF by default. Enable only after OPENAI_API_KEY is configured server-side
-- and the realtime voice UX has been verified for the intended cohort.

INSERT INTO public.feature_flags (flag_key, is_enabled, description)
VALUES (
  'openai_realtime_voice',
  false,
  'Use OpenAI Realtime WebRTC voice chat in AI Tutor Journey/Speak. OFF until OPENAI_API_KEY is configured server-side and reviewed.'
)
ON CONFLICT (flag_key) DO UPDATE
SET
  description = EXCLUDED.description,
  is_enabled = public.feature_flags.is_enabled;
