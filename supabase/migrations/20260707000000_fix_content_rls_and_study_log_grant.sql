-- Fix recurring PostgREST 403 (RLS denied) production errors on the content
-- catalog (rooms, room_entries) and on study_log writes.
--
-- Applied manually via the Supabase SQL Editor after review (this project's
-- security DDL is human-applied, not `db push`); CI verifies the reviewed
-- artifact via the companion contract test. Idempotent and transactional —
-- safe to re-run.
--
-- ROOT CAUSE
--   rooms       — SELECT was tightened to authenticated-only
--                 (auth_users_select_rooms_only, 20251201080440), dropping the
--                 original public read. The /tiers + legacy /rooms browse
--                 surface loads the catalog (id, title, domain, track, tier)
--                 for ANONYMOUS visitors (the pre-signup entry point) → 403.
--   room_entries— SELECT was tier-gated (20251207122320). Anonymous room opens
--                 403 (the client recovers via bundled JSON, but it floods
--                 Sentry). room_entries is the normalized form of rooms.entries
--                 — identical content.
--   study_log   — client is correct (user_id = auth.uid()) and the own-row
--                 policies are correct, yet authenticated trial users still 403
--                 on INSERT: the recurring "RLS enabled without table GRANT"
--                 gotcha this repo has hit on study_log before.
--
-- POSTURE
--   rooms/room_entries hold GLOBAL, non-PII, non-owned lesson content that
--   already ships to every browser via the bundled public/data/*.json catalog;
--   tier-gating is enforced in the APP layer (see CLAUDE.md), so DB SELECT
--   gating gave zero protection while breaking anonymous browse. Restore narrow
--   public SELECT (read-only; admin write/manage policies are left intact).
--   study_log is per-user: GRANT + own-row policies only, ownership preserved.
--
-- FUTURE COUPLING (read before un-bundling content):
--   If public/data/*.json is ever migrated to DB-only delivery
--   (bundle-size work, currently deferred), revisit rooms/room_entries SELECT
--   here — at that point premium content would no longer be public via the
--   bundle and would need real DB-side tier gating again.

BEGIN;

-- ── rooms: restore public read of the content catalog ──────────────────
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.rooms TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can view rooms" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated users can view all rooms" ON public.rooms;
DROP POLICY IF EXISTS "Anonymous users can view demo rooms only" ON public.rooms;
DROP POLICY IF EXISTS "auth_users_select_rooms_only" ON public.rooms;
DROP POLICY IF EXISTS rooms_public_select ON public.rooms;

CREATE POLICY rooms_public_select
  ON public.rooms
  FOR SELECT
  USING (true);

-- ── room_entries: same public-content posture as rooms ─────────────────
ALTER TABLE public.room_entries ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.room_entries TO anon, authenticated;

DROP POLICY IF EXISTS "Users can view room entries based on room tier" ON public.room_entries;
DROP POLICY IF EXISTS room_entries_public_select ON public.room_entries;

CREATE POLICY room_entries_public_select
  ON public.room_entries
  FOR SELECT
  USING (true);

-- ── study_log: restore own-row read/write for authenticated users ──────
ALTER TABLE public.study_log ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.study_log TO authenticated;

DROP POLICY IF EXISTS "Users can read own study log" ON public.study_log;
DROP POLICY IF EXISTS "Users can insert own study log" ON public.study_log;
DROP POLICY IF EXISTS "Users can update own study log" ON public.study_log;
DROP POLICY IF EXISTS study_log_own_select ON public.study_log;
DROP POLICY IF EXISTS study_log_own_insert ON public.study_log;
DROP POLICY IF EXISTS study_log_own_update ON public.study_log;

CREATE POLICY study_log_own_select
  ON public.study_log
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY study_log_own_insert
  ON public.study_log
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY study_log_own_update
  ON public.study_log
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

COMMIT;
