-- 20260617000000_index_private_messages_fks.sql
--
-- Add the three missing foreign-key indexes on public.private_messages.
--
-- Why: production-readiness sweep finding H1 (Top-5 #4) — see
-- /private/tmp/production-readiness-report.md §"Area 3". The table was
-- created in 20251022212846_ebab8791-edfd-4336-9224-b245cdb6e5b0.sql with
-- THREE foreign keys and ZERO indexes:
--
--   sender_id   UUID NOT NULL REFERENCES auth.users(id)              ON DELETE CASCADE
--   receiver_id UUID NOT NULL REFERENCES auth.users(id)              ON DELETE CASCADE
--   request_id  UUID NOT NULL REFERENCES public.private_chat_requests ON DELETE CASCADE
--
-- Postgres does NOT auto-index foreign keys (only PK + UNIQUE). With no
-- index, every one of these is a SEQUENTIAL SCAN of the whole table:
--
--   1. Account deletion (a GDPR/compliance path): delete-account's
--      user-data-manifest.ts:112-113 runs
--        DELETE FROM public.private_messages WHERE sender_id   = <uuid>;
--        DELETE FROM public.private_messages WHERE receiver_id = <uuid>;
--   2. auth.users row deletion → ON DELETE CASCADE must find child rows
--      by sender_id / receiver_id.
--   3. private_chat_requests row deletion (manifest:110-111 deletes those
--      by sender_id/receiver_id during the same account deletion) →
--      ON DELETE CASCADE must find child private_messages by request_id.
--
-- So all THREE FK columns are scanned during a single account deletion.
-- private_messages is an append-only chat table with unbounded growth;
-- the scans get linearly worse and account deletion is a path that must
-- stay reliable.
--
-- APPLY VIA SUPABASE SQL EDITOR ONLY (Phase 2 manual gate, per CLAUDE.md
-- — Chau applies; this is NOT auto-applied). CREATE INDEX CONCURRENTLY
-- CANNOT run inside a transaction block, so it MUST be run statement-by-
-- statement in the SQL Editor and MUST NOT be applied via
-- `supabase db push` (which wraps each migration in a txn and would
-- error: "CREATE INDEX CONCURRENTLY cannot run inside a transaction
-- block"). CONCURRENTLY is used so the index build takes no
-- ACCESS EXCLUSIVE write lock — safe whether the table is tiny today or
-- large later. If you would rather apply this through db push, replace
-- each `CREATE INDEX CONCURRENTLY` below with plain `CREATE INDEX`
-- (acceptable only while the table is small).
--
-- 100% idempotent: every statement is `IF NOT EXISTS`, so re-running is a
-- no-op against a database that already has the index. Human-reviewed
-- before apply (CLAUDE.md).

-- ── sender_id ───────────────────────────────────────────────────────────
-- Benefits:  DELETE FROM public.private_messages WHERE sender_id = $1;
--            (delete-account manifest:112) + auth.users ON DELETE CASCADE
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_private_messages_sender_id
  ON public.private_messages (sender_id);

-- ── receiver_id ─────────────────────────────────────────────────────────
-- Benefits:  DELETE FROM public.private_messages WHERE receiver_id = $1;
--            (delete-account manifest:113) + auth.users ON DELETE CASCADE
--            + the RLS SELECT policy's (auth.uid() = receiver_id) branch
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_private_messages_receiver_id
  ON public.private_messages (receiver_id);

-- ── request_id ──────────────────────────────────────────────────────────
-- Benefits:  private_chat_requests ON DELETE CASCADE → child lookup
--            DELETE FROM public.private_messages WHERE request_id = $1;
--            + per-thread message fetch by request_id
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_private_messages_request_id
  ON public.private_messages (request_id);

-- ── Rollback (DOWN) — documentation only; run manually if reverting ─────
--   DROP INDEX CONCURRENTLY IF EXISTS public.idx_private_messages_sender_id;
--   DROP INDEX CONCURRENTLY IF EXISTS public.idx_private_messages_receiver_id;
--   DROP INDEX CONCURRENTLY IF EXISTS public.idx_private_messages_request_id;
