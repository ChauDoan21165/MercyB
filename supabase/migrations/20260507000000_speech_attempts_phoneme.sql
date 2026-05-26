-- Day 1 — Azure Pronunciation Assessment columns on public.speech_attempts.
--
-- Three additive columns. No new table, no rename, no destructive op.
-- Mirrors the schema decision in
-- reports/plan-phoneme-scoring-azure-2026-04-26.md § 1(g).
--
-- Background:
--   The April 26 spike (reports/spike-azure-pronunciation-2026-04-26.md)
--   verified Azure Pronunciation Assessment catches Vietnamese-L1
--   substitutions that ElevenLabs missed. The Day-1 edge function at
--   supabase/functions/azure-phoneme/ writes its results into the
--   existing speech_attempts table. These three columns are what it
--   needs that aren't already there.
--
-- Why no separate table:
--   speech_attempts already carries match_score, overall_score,
--   word_scores (jsonb), and the analytics view v_user_pronunciation_stats
--   reads from it. Splitting cloud results into a sibling table would
--   force every dashboard query to JOIN. Three nullable columns cost
--   nothing on the read side.
--
-- Reversibility:
--   ALTER TABLE public.speech_attempts
--     DROP COLUMN IF EXISTS provider,
--     DROP COLUMN IF EXISTS provider_cost_usd,
--     DROP COLUMN IF EXISTS phoneme_scores;

ALTER TABLE public.speech_attempts
  ADD COLUMN IF NOT EXISTS provider          text,
  ADD COLUMN IF NOT EXISTS provider_cost_usd numeric(10, 6),
  ADD COLUMN IF NOT EXISTS phoneme_scores    jsonb;

-- Constrain provider to the two values the application writes today.
-- New providers (e.g. 'speechace', 'azure_v2') need a migration to
-- extend this list — explicit gate, not free-form text.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'speech_attempts_provider_chk'
  ) THEN
    ALTER TABLE public.speech_attempts
      ADD CONSTRAINT speech_attempts_provider_chk
      CHECK (provider IS NULL OR provider IN ('cloud', 'local'));
  END IF;
END$$;

-- provider_cost_usd is non-negative when set.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'speech_attempts_provider_cost_chk'
  ) THEN
    ALTER TABLE public.speech_attempts
      ADD CONSTRAINT speech_attempts_provider_cost_chk
      CHECK (provider_cost_usd IS NULL OR provider_cost_usd >= 0);
  END IF;
END$$;

-- Lookup pattern: "show me cloud-scored attempts for this user in the
-- last hour" (cost dashboards, abuse triage). Partial index keeps it
-- cheap because most rows are local-scored once cloud rolls out.
CREATE INDEX IF NOT EXISTS speech_attempts_provider_attempted_idx
  ON public.speech_attempts (provider, attempted_at DESC)
  WHERE provider IS NOT NULL;

COMMENT ON COLUMN public.speech_attempts.provider IS
  'Pronunciation scoring provider. ''cloud'' = Azure Pronunciation Assessment edge function. ''local'' = src/lib/pronunciation/scorer.ts. NULL on legacy rows from before the column existed.';

COMMENT ON COLUMN public.speech_attempts.provider_cost_usd IS
  'Per-attempt USD cost charged by the cloud provider. NULL on local-scored rows.';

COMMENT ON COLUMN public.speech_attempts.phoneme_scores IS
  'Azure per-phoneme detail. Shape: [{ word, score, phonemes: [{phoneme, score}] }]. NULL on local-scored rows.';
