-- A4 — convert per-conversation OpenAI cost telemetry into a request-time gate.
--
-- Background: ai-chat already writes (input_tokens, output_tokens,
-- estimated_cost_vnd) per request to public.ai_usage_logs via logAiUsageLog
-- in supabase/functions/ai-chat/index.ts. The numbers are observable but
-- nothing gates a runaway conversation. A long history × verbose user × a
-- buggy client retry could rack up real money before anyone notices.
--
-- This migration:
--   1. Adds a nullable conversation_id column to ai_usage_logs so the
--      edge function can attribute each token spend to a thread.
--      `text` (not uuid) on purpose:
--        - mercy_conversations.id is uuid, but ai-chat may also be called
--          from non-thread contexts (one-shot guidance), and we don't want
--          the column to reject that traffic.
--        - Client-supplied conversation IDs that aren't uuids are still
--          valid groupers — server doesn't have to validate the shape to
--          enforce the cap.
--   2. Adds an index on (conversation_id, created_at DESC) so the
--      "SUM(estimated_cost_vnd) for this conversation" read is cheap as
--      the table grows. Partial WHERE conversation_id IS NOT NULL keeps
--      the index small for legacy rows that pre-date this migration.
--   3. Seeds a feature-flag kill switch: `conversation_cost_cap_enabled`
--      defaults ON. Toggling OFF bypasses the gate entirely (emergency
--      relief without redeploy). The actual cap *value* (in VND) is read
--      from the CONVERSATION_COST_CAP_VND env var so Chau can adjust the
--      number via `supabase secrets set` without touching the flag row.
--
-- Reversibility:
--   DELETE FROM public.feature_flags WHERE flag_key = 'conversation_cost_cap_enabled';
--   DROP INDEX IF EXISTS public.ai_usage_logs_conversation_id_idx;
--   ALTER TABLE public.ai_usage_logs DROP COLUMN IF EXISTS conversation_id;

-- ── 1. conversation_id column on ai_usage_logs ──────────────────────────

ALTER TABLE public.ai_usage_logs
  ADD COLUMN IF NOT EXISTS conversation_id text;

COMMENT ON COLUMN public.ai_usage_logs.conversation_id IS
  'Optional grouping key for per-conversation cost-cap enforcement. Typically a mercy_conversations.id (uuid as text), but any stable client-supplied tag works. NULL when the call was not part of a tracked thread.';

CREATE INDEX IF NOT EXISTS ai_usage_logs_conversation_id_idx
  ON public.ai_usage_logs (conversation_id, created_at DESC)
  WHERE conversation_id IS NOT NULL;

-- ── 2. Feature-flag kill switch ─────────────────────────────────────────

INSERT INTO public.feature_flags (flag_key, is_enabled, description)
VALUES (
  'conversation_cost_cap_enabled',
  true,
  'Enforce the per-conversation OpenAI spend cap in ai-chat. ON = gate active (returns 402 when a conversation crosses the cap). OFF = bypass entirely (emergency relief without redeploy). The cap *value* in VND is set via the CONVERSATION_COST_CAP_VND env var (default 1200 ≈ $0.05 USD); change it with `supabase secrets set --project-ref <ref> CONVERSATION_COST_CAP_VND=2400`.'
)
ON CONFLICT (flag_key) DO NOTHING;
