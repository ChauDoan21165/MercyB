-- A15b — Anon-readable tables: prod confirmation queries.
-- Read-only. Paste each block into Supabase SQL Editor.
-- The first two are sanity checks; the third is the load-bearing one
-- (decides whether the feature_flags finding is active or dormant).

-- ─────────────────────────────────────────────────────────────────────
-- 1. weekly_digest_data — confirm schema in prod matches the migration
--    (paranoia: schema drift could have silently added a user column).
-- ─────────────────────────────────────────────────────────────────────
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'weekly_digest_data'
ORDER BY ordinal_position;
-- EXPECTATION: 9 columns, all aggregates. No user_id, no email, no uuid
-- foreign key.

-- ─────────────────────────────────────────────────────────────────────
-- 2. listening_clips — confirm schema in prod matches the migration.
-- ─────────────────────────────────────────────────────────────────────
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'listening_clips'
ORDER BY ordinal_position;
-- EXPECTATION: 13 columns, all content. No user_id, no email.

-- ─────────────────────────────────────────────────────────────────────
-- 3. feature_flags — THE ONE THAT MATTERS.
--    If this returns rows, the leak is active in prod.
-- ─────────────────────────────────────────────────────────────────────
SELECT
  flag_key,
  is_enabled,
  array_length(enabled_user_ids, 1) AS cohort_size,
  enabled_user_ids
FROM public.feature_flags
WHERE array_length(enabled_user_ids, 1) > 0
ORDER BY flag_key;
-- INTERPRETATION:
--   0 rows   → finding is DORMANT. Document, no immediate action.
--   ≥ 1 row  → finding is ACTIVE. Apply Option 1 from §2.7 of the recon doc
--             before next prod deploy. The UUIDs in cohort_size are presently
--             readable by any unauthenticated browser.

-- ─────────────────────────────────────────────────────────────────────
-- 4. Bonus — confirm GRANT SELECT on feature_flags actually reaches anon.
--    (If the GRANT is missing, the RLS policy is moot.)
-- ─────────────────────────────────────────────────────────────────────
SELECT grantee, privilege_type, is_grantable
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND table_name = 'feature_flags'
  AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;
-- EXPECTATION: anon = SELECT (otherwise the RLS policy is theoretical).
