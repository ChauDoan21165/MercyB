-- 20260519260000_make_audit_tables_user_id_nullable.sql
--
-- Make user_id nullable + soften FK ON DELETE CASCADE → SET NULL on
-- four audit / cost-tracking / fraud-detection tables, so that the
-- delete-account edge function can ANONYMIZE rows on user erasure
-- (set user_id = NULL, retain row) instead of being forced to DELETE
-- them (forced today by the NOT NULL + CASCADE pair).
--
-- ORIGIN / DESIGN INPUT (every decision below is fixed there, none made here):
--   - A6d audit (commit aba3d6fba / reports/PRIVACY-b1-manifest-classification-A6d.md)
--     classifies these 4 tables as `anonymize` for retention reasons:
--       email_sends_log    — deliverability audit (RFC 8058 patterns)
--       push_send_log      — per-send delivery diagnostics
--       referral_audit_log — ANTI-ABUSE / fraud-detection memory (the
--                            highest-priority of the four — deleting
--                            fraud evidence on request is a policy risk)
--       speech_analysis_logs — OpenAI cost-tracking analytics
--   - A4 #811 (b1-manifest-42-tables) flagged that A6d's classification
--     is unachievable today because all four have `user_id NOT NULL
--     REFERENCES … ON DELETE CASCADE`. Setting user_id = NULL on an
--     UPDATE atomically violates NOT NULL; the UPDATE rejects; the
--     subsequent auth.users DELETE then CASCADE-deletes the row, so
--     anonymize ends up identical-to-delete with extra error noise.
--   - This migration unblocks the flip. A separate follow-up manifest
--     PR (post-apply) re-classifies the 4 tables from `delete` →
--     `anonymize` in user-data-manifest.ts.
--
-- APPLY VIA SUPABASE SQL EDITOR ONLY — Chau applies, human-reviewed
-- first (CLAUDE.md Git discipline; D6 / locked #4; memory:
-- project_db_schema_drift_audit, project_578_rls_applied — there is
-- NO unattended SQL/catalog path to this Supabase). This migration is
-- NOT auto-applied and MUST NOT be applied via `supabase db push`.
--
-- 100% idempotent + stage-safe: every statement is ALTER COLUMN ...
-- DROP NOT NULL (no-op if already nullable), DROP CONSTRAINT IF EXISTS
-- + ADD CONSTRAINT IF NOT EXISTS via a guarded DO block. Each table's
-- block is independent — safe to run in stages, safe to re-run.
--
-- NON-BREAKING for current behavior: the existing delete-account flow
-- explicitly DELETEs these rows in Pass 1 before reaching the auth.users
-- deletion in Pass 4. After this migration the CASCADE → SET NULL change
-- only affects what *would* happen if a row survived to Pass 4, which
-- doesn't occur on the current `delete` classification. The behavior
-- change unlocks the future `anonymize` re-classification — it does not
-- change today's outcomes for these tables.
--
-- ── Rollback (DOWN) — documentation only; run manually if reverting ──
-- Note: rollback re-introduces the policy risk A6d flagged (deletion of
-- fraud/audit evidence on user-erasure request). Discouraged.
--
--   -- For each of the 4 tables:
--   ALTER TABLE public.<table> ALTER COLUMN user_id SET NOT NULL;
--   ALTER TABLE public.<table>
--     DROP CONSTRAINT IF EXISTS <table>_user_id_fkey;
--   ALTER TABLE public.<table>
--     ADD CONSTRAINT <table>_user_id_fkey
--     FOREIGN KEY (user_id) REFERENCES <auth.users|public.profiles>(id)
--     ON DELETE CASCADE;
--
-- Pre-apply baseline check (run separately FIRST, in SQL Editor):
--
--   SELECT c.table_name,
--          c.column_name,
--          c.is_nullable,
--          tc.constraint_name,
--          rc.delete_rule
--     FROM information_schema.columns c
--     LEFT JOIN information_schema.constraint_column_usage ccu
--       ON ccu.table_name = c.table_name AND ccu.column_name = c.column_name
--     LEFT JOIN information_schema.table_constraints tc
--       ON tc.constraint_name = ccu.constraint_name
--       AND tc.constraint_type = 'FOREIGN KEY'
--     LEFT JOIN information_schema.referential_constraints rc
--       ON rc.constraint_name = tc.constraint_name
--    WHERE c.table_schema = 'public'
--      AND c.table_name IN ('email_sends_log','push_send_log',
--                           'referral_audit_log','speech_analysis_logs')
--      AND c.column_name = 'user_id';
--
--   -- Expect (pre-apply): all 4 rows is_nullable = 'NO', delete_rule = 'CASCADE'.


-- ════════════════════════════════════════════════════════════════════
-- 1. email_sends_log — re-engagement email deliverability audit
--    FK: public.email_sends_log.user_id → auth.users(id)
-- ════════════════════════════════════════════════════════════════════

ALTER TABLE public.email_sends_log
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.email_sends_log
  DROP CONSTRAINT IF EXISTS email_sends_log_user_id_fkey;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'email_sends_log_user_id_fkey'
       AND conrelid = 'public.email_sends_log'::regclass
  ) THEN
    ALTER TABLE public.email_sends_log
      ADD CONSTRAINT email_sends_log_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END
$$;


-- ════════════════════════════════════════════════════════════════════
-- 2. push_send_log — per-user push delivery diagnostics
--    FK: public.push_send_log.user_id → auth.users(id)
-- ════════════════════════════════════════════════════════════════════

ALTER TABLE public.push_send_log
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.push_send_log
  DROP CONSTRAINT IF EXISTS push_send_log_user_id_fkey;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'push_send_log_user_id_fkey'
       AND conrelid = 'public.push_send_log'::regclass
  ) THEN
    ALTER TABLE public.push_send_log
      ADD CONSTRAINT push_send_log_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END
$$;


-- ════════════════════════════════════════════════════════════════════
-- 3. referral_audit_log — ANTI-ABUSE / fraud-detection memory
--    FK: public.referral_audit_log.user_id → public.profiles(id)
--    NOTE: this FK targets public.profiles (not auth.users) — kept as-is.
-- ════════════════════════════════════════════════════════════════════

ALTER TABLE public.referral_audit_log
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.referral_audit_log
  DROP CONSTRAINT IF EXISTS referral_audit_log_user_id_fkey;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'referral_audit_log_user_id_fkey'
       AND conrelid = 'public.referral_audit_log'::regclass
  ) THEN
    ALTER TABLE public.referral_audit_log
      ADD CONSTRAINT referral_audit_log_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
  END IF;
END
$$;


-- ════════════════════════════════════════════════════════════════════
-- 4. speech_analysis_logs — per-attempt OpenAI cost-tracking
--    FK: public.speech_analysis_logs.user_id → auth.users(id)
-- ════════════════════════════════════════════════════════════════════

ALTER TABLE public.speech_analysis_logs
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.speech_analysis_logs
  DROP CONSTRAINT IF EXISTS speech_analysis_logs_user_id_fkey;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname = 'speech_analysis_logs_user_id_fkey'
       AND conrelid = 'public.speech_analysis_logs'::regclass
  ) THEN
    ALTER TABLE public.speech_analysis_logs
      ADD CONSTRAINT speech_analysis_logs_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END
$$;


-- ════════════════════════════════════════════════════════════════════
-- POST-APPLY VERIFICATION (Chau-run after the four blocks above) —
-- EXPECT 4 ROWS, all with is_nullable='YES' and delete_rule='SET NULL'.
-- ════════════════════════════════════════════════════════════════════
--
-- SELECT c.table_name,
--        c.is_nullable,
--        rc.delete_rule
--   FROM information_schema.columns c
--   LEFT JOIN information_schema.constraint_column_usage ccu
--     ON ccu.table_name = c.table_name AND ccu.column_name = c.column_name
--   LEFT JOIN information_schema.referential_constraints rc
--     ON rc.constraint_name = ccu.constraint_name
--  WHERE c.table_schema = 'public'
--    AND c.column_name = 'user_id'
--    AND c.table_name IN ('email_sends_log','push_send_log',
--                         'referral_audit_log','speech_analysis_logs')
--  ORDER BY c.table_name;
--
-- If ANY row reports is_nullable='NO' or delete_rule != 'SET NULL':
-- STOP — re-run the relevant ALTER block above; the migration is
-- idempotent so re-running is safe.
