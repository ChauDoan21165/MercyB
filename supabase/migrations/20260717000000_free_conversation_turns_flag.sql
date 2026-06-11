-- Seed feature flag: free_conversation_turns
--
-- Controls whether non-premium users get N free AI conversation turns per
-- week (DEFAULT OFF = today's 403 behavior is preserved).
--
-- When ON: free users get FREE_TURNS_PER_WEEK (= 5) turns/week tracked via
-- ai_usage_events (endpoint = 'ai-conversation-turn'), then hit a 403 gate.
-- Admin can flip ON per-user via enabled_user_ids for staged rollout.
--
-- Apply: SQL Editor (manual). Do NOT run `supabase db push` from CI.

INSERT INTO public.feature_flags (flag_key, is_enabled, description)
VALUES (
  'free_conversation_turns',
  false,
  'N free AI conversation turns/week for non-premium users. OFF = 403 for all free users (existing behavior). ON = 5 turns/week then gate.'
)
ON CONFLICT (flag_key) DO NOTHING;
