-- P0-3 Wave 2 — unblock the user_room_progress writer.
--
-- Context: the table existed in production for months but had zero writers,
-- so v_user_progress_current returned no room rows and the Home page's
-- "recent rooms" card was silently empty. See docs/audit-history-phase-1.md.
--
-- This migration:
--   1. Adds the UNIQUE constraint required for client-side idempotent upserts
--      keyed by (user_id, app_id, room_id). Matches the pattern used by
--      user_path_progress.
--   2. Adds the hot-path index for the "recent rooms" query (ORDER BY
--      last_seen_at DESC limit 12).
--   3. Ensures full own-row RLS (select/insert/update/delete) is in place.
--      CLAUDE.md documents that some user_* tables have RLS applied only
--      via SQL Editor — this migration codifies the policies so the
--      frontend writer provably works under RLS.
--   4. Grants explicit table-level INSERT/UPDATE/SELECT/DELETE to the
--      authenticated role (same pattern the entitlement_events migration
--      documents: without this, Postgres rejects INSERT before RLS runs).
--
-- Column note for code reviewers: the brief calls this column
-- "last_studied_at" but the actual schema column (and the one the
-- v_user_progress_current view reads) is `last_seen_at`. Using the
-- existing name to avoid a view-breaking rename.

-- 1. UNIQUE constraint for onConflict upsert ───────────────────────────────
CREATE UNIQUE INDEX IF NOT EXISTS user_room_progress_user_app_room_uniq
  ON public.user_room_progress (user_id, app_id, room_id);

-- 2. Hot-path index for HomeProgressCards "recent rooms" query ─────────────
CREATE INDEX IF NOT EXISTS user_room_progress_user_last_seen_idx
  ON public.user_room_progress (user_id, last_seen_at DESC);

-- 3. RLS — enable + own-row policies (idempotent) ──────────────────────────
ALTER TABLE public.user_room_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_room_progress_own_select" ON public.user_room_progress;
DROP POLICY IF EXISTS "user_room_progress_own_insert" ON public.user_room_progress;
DROP POLICY IF EXISTS "user_room_progress_own_update" ON public.user_room_progress;
DROP POLICY IF EXISTS "user_room_progress_own_delete" ON public.user_room_progress;

CREATE POLICY "user_room_progress_own_select"
  ON public.user_room_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "user_room_progress_own_insert"
  ON public.user_room_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_room_progress_own_update"
  ON public.user_room_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_room_progress_own_delete"
  ON public.user_room_progress
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. Table-level grants (required for INSERT under RLS) ────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_room_progress TO authenticated;

-- Reversibility note: to roll back, drop the two indexes and policies:
--   DROP INDEX IF EXISTS public.user_room_progress_user_app_room_uniq;
--   DROP INDEX IF EXISTS public.user_room_progress_user_last_seen_idx;
--   DROP POLICY IF EXISTS "user_room_progress_own_select" ON public.user_room_progress;
--   DROP POLICY IF EXISTS "user_room_progress_own_insert" ON public.user_room_progress;
--   DROP POLICY IF EXISTS "user_room_progress_own_update" ON public.user_room_progress;
--   DROP POLICY IF EXISTS "user_room_progress_own_delete" ON public.user_room_progress;
-- Rolling back the GRANTs is rarely needed; if so:
--   REVOKE SELECT, INSERT, UPDATE, DELETE ON public.user_room_progress FROM authenticated;
