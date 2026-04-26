-- Feature flags — percentage-based rollout column.
--
-- Adds an optional rollout_percentage to feature_flags so a flag can be
-- gradually enabled across a user cohort by stable hash bucket
-- (computed client + server side via getUserHashBucket / equivalent).
--
-- Resolution order — kept in sync with src/hooks/useFeatureFlag.ts and
-- src/lib/featureFlags.ts (isFlagEnabledForUser):
--
--   1. enabled_user_ids contains user                                    → ON
--   2. rollout_percentage IS NOT NULL AND user_hash_bucket < percentage  → ON  (new)
--   3. is_enabled = true                                                  → ON
--   4. else                                                               → OFF
--
-- Default value NULL = no percentage rollout (existing behaviour
-- unchanged). Migration is additive and safe to apply to prod
-- immediately — no flag flips on its own.

ALTER TABLE feature_flags
  ADD COLUMN IF NOT EXISTS rollout_percentage smallint
    CHECK (rollout_percentage IS NULL OR (rollout_percentage >= 0 AND rollout_percentage <= 100));

COMMENT ON COLUMN feature_flags.rollout_percentage IS
  'When set, the flag is ON for users whose stable hash bucket falls below this percentage. NULL = ignore (only is_enabled + enabled_user_ids apply).';
