-- supabase/migrations/20260615000000_profiles_native_target_languages.sql
--
-- Duolingo-style onboarding — schema foundation (PR 1 of 3).
--
-- Adds the (native, target) language-pair axis to public.profiles so the
-- onboarding flow can ask "what's your native language?" and "what do
-- you want to learn?" and persist the answer.
--
--   native_language   text   — the L1 the lesson pedagogy is authored
--                              for. Domain (STRATEGY.md v3.0 §4 — 2
--                              native languages): 'vi' | 'en'.
--                              NULLABLE, NO DEFAULT — see the
--                              onboarding-gate contract below.
--   target_languages  text[] — ordered list of target language codes
--                              the user is learning. Element domain
--                              (v3.0 §4 — 8 targets): en, ja, ko, zh,
--                              fr, de, es, vi. First element = primary
--                              target. NULLABLE, NO DEFAULT.
--
-- ── Onboarding-gate contract (WHY there is NO column DEFAULT) ──────────
-- Phase 3 of this build gates the new onboarding flow on
-- `native_language IS NULL`: a *new* user must see NULL so the flow
-- fires; an *existing* user must NOT (option (c) — nothing changes for
-- them). A column `DEFAULT 'vi'` would populate native_language on every
-- new signup row, the NULL gate would never be true, and onboarding
-- would never run — the entire feature would be silently dead. So the
-- column is intentionally DEFAULT-less + NULLABLE, and existing rows are
-- backfilled explicitly below. DO NOT add `DEFAULT 'vi'` in a later
-- migration: it disables the onboarding flow with no error. (The brief's
-- "default 'vi'" describes the backfill VALUE for existing users, not a
-- column DEFAULT clause; implemented as the backfill UPDATE — the only
-- design where both "new users onboard" and "existing users skip" hold
-- under the NULL gate.)
--
-- ── Backfill = option (c) ─────────────────────────────────────────────
-- Every existing profile is set to (vi, ['en']) so the current cohort
-- and any pre-existing accounts skip onboarding and see exactly the home
-- page they see today. New rows (inserted by handle_new_user, which does
-- not reference these columns) get NULL → onboarding fires for them only.
--
-- ── Freeze-trigger interaction (verified, locked #15 — not assumed) ────
-- 20260614000000_profiles_freeze_privileged_columns.sql reverts
-- `authenticated`-role deltas to ONLY 13 named privileged columns.
-- native_language / target_languages are NOT among them, and that
-- migration's own comment guarantees "every non-sensitive column
-- (including any future column) stays user-writable exactly as today".
-- The table-level `GRANT SELECT,UPDATE ON public.profiles TO
-- authenticated` already covers new columns. => the onboarding
-- client-side write (PR 2) needs NO additional grant and NO
-- reconciliation with the freeze trigger. The SQL Editor that applies
-- this file runs as postgres with no request.jwt → the freeze trigger
-- passes through, so the backfill UPDATEs below are unaffected.
--
-- ── Apply path (locked #4 / drift protocol, same as #562, #578) ───────
-- This SQL file is shipped for human review and applied by Chau via the
-- Supabase SQL Editor. It is NOT applied via `supabase db push`.

BEGIN;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS native_language  text,
  ADD COLUMN IF NOT EXISTS target_languages text[];

-- CHECK constraints document the canonical value sets (v3.0 §4) and
-- block typos, while allowing NULL (pre-onboarding new users) and any
-- subset (incl. empty) of the valid target set. Per-native menu
-- filtering (e.g. excluding Spanish from the vi-native menu — see
-- reports/RECON-content-readiness-matrix.md decision 2) is APPLICATION
-- logic in the onboarding flow, not a DB constraint: the DB stays
-- permissive to the full valid set so future pairs need no migration.

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_native_language_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_native_language_check
  CHECK (
    native_language IS NULL
    OR native_language IN ('vi', 'en')
  );

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_target_languages_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_target_languages_check
  CHECK (
    target_languages IS NULL
    OR target_languages <@ ARRAY['en','ja','ko','zh','fr','de','es','vi']::text[]
  );

-- Backfill = option (c). At this point both columns are brand-new so
-- every existing row is NULL for both; set them to (vi, ['en']). New
-- rows stay NULL (handle_new_user does not touch these columns) so the
-- onboarding gate fires for new users only.
UPDATE public.profiles
  SET native_language = 'vi'
  WHERE native_language IS NULL;

UPDATE public.profiles
  SET target_languages = ARRAY['en']::text[]
  WHERE target_languages IS NULL;

-- Partial index for the onboarding gate query
-- (WHERE native_language IS NULL). Empty immediately after backfill;
-- grows only with new pre-onboarding users → stays tiny. Distinct from
-- the existing profiles_pending_onboarding_idx (different predicate).
CREATE INDEX IF NOT EXISTS profiles_pending_pair_onboarding_idx
  ON public.profiles (created_at)
  WHERE native_language IS NULL;

COMMENT ON COLUMN public.profiles.native_language IS
  'L1 the lesson pedagogy is authored for. ''vi''|''en'' (STRATEGY v3.0 §4). NULL = has not completed pair-selection onboarding → the Duolingo-style flow fires. NO column DEFAULT by design: a DEFAULT would disable the NULL onboarding gate.';
COMMENT ON COLUMN public.profiles.target_languages IS
  'Ordered target language codes the user is learning. Element domain: en,ja,ko,zh,fr,de,es,vi (STRATEGY v3.0 §4). First element = primary target. NULL until onboarding completes.';

COMMIT;
