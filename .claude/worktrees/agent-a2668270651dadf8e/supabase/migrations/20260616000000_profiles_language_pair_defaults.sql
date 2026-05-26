-- supabase/migrations/20260616000000_profiles_language_pair_defaults.sql
--
-- fix(onboarding): default new users to (vi, ['en']) — don't fire the
-- onboarding flow. Reverses the explicit "NO column DEFAULT" decision
-- documented in 20260615000000_profiles_native_target_languages.sql.
--
-- ── WHY this reverses PR 1/3's decision (read this) ───────────────────
-- 20260615000000 deliberately left native_language / target_languages
-- DEFAULT-less so the `native_language IS NULL` Home gate would fire
-- for every new signup and route them through the Duolingo-style
-- native+target picker (PR 2/3, src/pages/onboarding/OnboardingPage.tsx).
--
-- That gate is now intentionally disabled. Rationale (dispatch context,
-- STRATEGY v3.0 §4 — ~95% of effort and the identity moat is the
-- Vietnamese-native side):
--   • vi-native learners studying English are ~95% of signups — the
--     home market.
--   • For them the picker answer is invariably (vi, ['en']). Asking the
--     question is friction with zero information gain — it adds a
--     screen between a new user and their first lesson and buys nothing.
--   • The native+target picker still exists and is fully reachable, but
--     as an explicit, opt-in Settings action only:
--     src/components/account/LanguagePairSettings.tsx, mounted at
--     /account (PR 3/3). A user who wants a different pair, or a
--     vi-native user who also wants to add Japanese/Korean/etc., does
--     it there. Settings is the *only* path to the picker now.
--
-- With a column DEFAULT, handle_new_user (canonical def in
-- 20251208225203_4f050c74-…sql — `INSERT INTO public.profiles
-- (id, email, full_name)`, never names these two columns) produces new
-- rows with native_language='vi', target_languages=['en']. The Home
-- gate's `if (row.native_language) return;` is therefore always true
-- for new users → /onboarding is never reached via the gate. The
-- OnboardingPage route stays in the router but becomes orphaned (no
-- live caller); it is intentionally retained for a possible future
-- Settings-driven guided-tour remount — see its top-of-file comment.
--
-- ── CHECK-constraint compatibility (Option A is clean — verified) ─────
-- 20260615000000 added:
--   profiles_native_language_check :
--     native_language IS NULL OR native_language IN ('vi','en')
--   profiles_target_languages_check:
--     target_languages IS NULL
--     OR target_languages <@ ARRAY['en','ja','ko','zh','fr','de','es','vi']
-- DEFAULT 'vi'              satisfies the first  ('vi' ∈ {vi,en}).
-- DEFAULT ARRAY['en']::text[] satisfies the second ({en} ⊆ the set).
-- No constraint complication → Option A (column DEFAULT), not Option B
-- (patch handle_new_user).
--
-- ── Defensive re-backfill (NOT just a forward fix) ────────────────────
-- 20260615000000's backfill set every row that existed *at that file's
-- apply time* to (vi, ['en']). Any user who signed up AFTER that
-- migration applied but BEFORE this one has native_language = NULL and
-- is, right now, being redirected into the picker on every Home visit.
-- The dispatch intent is "no new user ever sees the onboarding screens"
-- — so this migration also UPDATEs any remaining NULLs. The UPDATEs
-- touch only NULL rows; already-set pairs are never overwritten, so a
-- user who deliberately changed their pair in Settings keeps it. This
-- makes the fix complete (not only forward-looking) and order/replay
-- safe.
--
-- ── profiles_pending_pair_onboarding_idx — intentionally retained ─────
-- The partial index from 20260615000000 (predicate
-- WHERE native_language IS NULL) will now stay permanently empty. It is
-- deliberately NOT dropped: it is byte-cheap when empty, and it
-- re-arms automatically with zero migration work if onboarding is ever
-- re-enabled. Dropping it would be scope creep for a default-fix PR.
--
-- ── Apply path (locked #4 / drift protocol — same as #562, #578, the
--    PR 1/3 migration) ───────────────────────────────────────────────
-- Human-reviewed, then applied by Chau via the Supabase SQL Editor.
-- NOT applied via `supabase db push`. The SQL Editor runs as postgres
-- with no request.jwt, so the #578/#586 freeze trigger
-- (20260614000000_profiles_freeze_privileged_columns.sql) passes
-- through and the UPDATEs below are unaffected (native_language /
-- target_languages were already verified NOT among the 13 frozen
-- privileged columns in PR 1/3).

BEGIN;

-- 1. Forward fix: every future signup row gets the home-market pair
--    without handle_new_user needing to name these columns.
ALTER TABLE public.profiles
  ALTER COLUMN native_language  SET DEFAULT 'vi';
ALTER TABLE public.profiles
  ALTER COLUMN target_languages SET DEFAULT ARRAY['en']::text[];

-- 2. Defensive backfill: heal any rows that slipped through as NULL
--    between PR 1/3's apply and this one (genuine new signups that are
--    currently being bounced into the picker). NULL-only — never
--    overwrites a deliberately-chosen pair.
UPDATE public.profiles
  SET native_language = 'vi'
  WHERE native_language IS NULL;

UPDATE public.profiles
  SET target_languages = ARRAY['en']::text[]
  WHERE target_languages IS NULL;

-- 3. Refresh the column comments: the NULL-gate contract is retired.
COMMENT ON COLUMN public.profiles.native_language IS
  'L1 the lesson pedagogy is authored for. ''vi''|''en'' (STRATEGY v3.0 §4). DEFAULT ''vi'' (20260616000000): new vi-native→English signups (~95%, the home market) skip the onboarding picker entirely. The Duolingo-style native+target picker is now a Settings-only opt-in (LanguagePairSettings @ /account). NULL is no longer produced for new users; the legacy NULL Home gate is effectively inert.';
COMMENT ON COLUMN public.profiles.target_languages IS
  'Ordered target language codes the user is learning. Element domain: en,ja,ko,zh,fr,de,es,vi (STRATEGY v3.0 §4). First element = primary target. DEFAULT ARRAY[''en'']::text[] (20260616000000) — see native_language comment. Changed only via Settings (LanguagePairSettings @ /account).';

COMMIT;
