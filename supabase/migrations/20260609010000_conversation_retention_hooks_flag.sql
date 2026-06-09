-- D1 — conversation retention hooks flag.
--
-- Production-safe default: OFF. Local/dev can run with the compile-time
-- VITE_CONVERSATION_RETENTION_HOOKS default ON; the database row remains dark
-- until Lane A/B explicitly cohorts users or flips global rollout.

INSERT INTO public.feature_flags (flag_key, is_enabled, enabled_user_ids, description)
VALUES (
  'CONVERSATION_RETENTION_HOOKS',
  false,
  '{}',
  'D1 conversation retention hooks: encouragement copy, conversation-turn XP wrapper, and weekly progress visibility. Prod default OFF; dev compile-time default ON.'
)
ON CONFLICT (flag_key) DO NOTHING;
