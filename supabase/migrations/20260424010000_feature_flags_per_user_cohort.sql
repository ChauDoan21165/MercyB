-- Adds per-user opt-in cohorts to public.feature_flags so we can dark-launch
-- features to a small allowlist (e.g. Chau + 1-2 testers) before flipping
-- the global is_enabled bit for everyone.
--
-- Resolution semantics (documented in src/hooks/useFeatureFlag.ts and
-- src/lib/featureFlags.ts — keep all three in sync):
--   1. If enabled_user_ids contains the requesting user → ON
--   2. Else if is_enabled = true                       → ON (global rollout)
--   3. Else                                            → OFF
--
-- Existing is_enabled (bool) behavior is unchanged when enabled_user_ids is
-- empty, so this migration is backward-compatible for every existing flag.

ALTER TABLE public.feature_flags
  ADD COLUMN IF NOT EXISTS enabled_user_ids uuid[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.feature_flags.enabled_user_ids IS
  'Per-user opt-in allowlist. If user_id is in this array, the flag is ON for that user regardless of is_enabled. Used for dark-launching to test cohorts.';

-- GIN index supports fast array-containment lookups (enabled_user_ids @> ARRAY[user_id]).
-- Current table is tiny (dozens of rows at most) but this keeps lookups cheap
-- if we ever add many flags or many test-cohort users.
CREATE INDEX IF NOT EXISTS feature_flags_enabled_user_ids_gin_idx
  ON public.feature_flags USING GIN (enabled_user_ids);
