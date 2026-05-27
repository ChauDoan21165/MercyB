-- ─────────────────────────────────────────────────────────────────────────
-- DRAFT — DO NOT APPLY FROM THIS LOCATION
-- ─────────────────────────────────────────────────────────────────────────
-- This file lives in docs/security/rls-fix-drafts/, NOT in
-- supabase/migrations/. See ./README.md.
--
-- Finding: !84 §1 finding #5 — MEDIUM.
--          `public.get_admin_level(uuid)` granted EXECUTE to
--          authenticated lets any authenticated user probe the admin
--          status of any user_id (admin enumeration).
-- ─────────────────────────────────────────────────────────────────────────
--
-- Two viable shapes, presented for A-side to choose between
-- =========================================================
-- Shape A — inline caller-equals-subject check (see draft 03)
-- Shape B — revoke EXECUTE from authenticated entirely; force callers
--           through edge functions that use service-role
--
-- This file documents Shape B as the alternative. The brief explicitly
-- requested both angles; pick one and discard the other before
-- applying.

-- ─────────────────────────────────────────────────────────────────────────
-- SHAPE A — inline caller-equals-subject (already in draft 03)
-- ─────────────────────────────────────────────────────────────────────────
-- See ./03-security-definer-functions-caller-check.sql section 1.
--
-- Pros:
--   - Doesn't change the call surface. Browser code keeps calling
--     supabase.rpc('get_admin_level', { _user_id }).
--   - Self-probe still works, which is load-bearing for RLS policies
--     written as USING (public.get_admin_level(auth.uid()) >= 9).
--
-- Cons:
--   - Adds plpgsql + branch logic to a function that was previously a
--     terse SQL one-liner. Slight perf hit (negligible in practice).
--   - Defense-in-depth-only: a level-9 admin can still probe anyone.

-- ─────────────────────────────────────────────────────────────────────────
-- SHAPE B — revoke EXECUTE from authenticated
-- ─────────────────────────────────────────────────────────────────────────
-- Force admin-status queries to go through an edge function that uses
-- service_role to call get_admin_level. The browser never calls this
-- function directly.
--
-- Pros:
--   - Clean. The function stops being client-reachable at all.
--   - No body changes; the existing one-liner stays.
--
-- Cons:
--   - BREAKING CHANGE if any RLS policy on a public table calls
--     public.get_admin_level(auth.uid()). When the policy is evaluated,
--     it runs as the policy owner — typically the table owner / postgres
--     — which is SECURITY DEFINER itself. So policy-call paths are NOT
--     affected by the client EXECUTE grant; they should continue to
--     work. BUT a sweep of every policy is necessary before applying;
--     a misclassified policy that doesn't run as SD will start
--     erroring at SELECT time.
--   - Browser code that calls supabase.rpc('get_admin_level', …) will
--     start receiving "permission denied for function get_admin_level"
--     (the exact error that 20260427010000 was created to FIX). So
--     this fix requires a coordinated browser-side change too.
--
-- The first migration in the repo (20260427010000) was created
-- specifically to GRANT EXECUTE to authenticated — its commit message
-- says "Fix: permission denied for function get_admin_level in prod".
-- That makes Shape B a regression-class change unless we audit every
-- call site first.

-- ── Shape B implementation (DO NOT apply without site audit first) ────

REVOKE EXECUTE ON FUNCTION public.get_admin_level(uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.get_admin_level(uuid) FROM PUBLIC;

-- service_role retains implicit access; edge functions using service-
-- role can still call it without explicit grant (service_role bypasses
-- function permission checks the same way it bypasses RLS).

-- Optional: add explicit COMMENT so the next contributor knows why.
COMMENT ON FUNCTION public.get_admin_level(uuid) IS
  'Returns admin level (0-10) for a user. Service-role-only callable. '
  'Browser code must NOT call this directly — route through the admin-'
  'level edge function which uses service-role. Tightened by !84 follow-up '
  'after audit found admin-status enumeration was possible via direct RPC.';

-- ── Pre-apply audit (do this BEFORE applying Shape B) ──────────────────
--
-- Confirm zero browser-side callers:
--
--   1. grep -rn "get_admin_level" src/
--      Expect: zero matches (or only inside comments/types).
--   2. grep -rn "rpc('get_admin_level'" src/
--      Expect: zero matches.
--   3. grep -rn "rpc(\"get_admin_level\"" src/
--      Expect: zero matches.
--
-- Confirm every RLS policy that calls get_admin_level is on a table
-- owned by postgres (so the policy expression runs SD anyway):
--
--   SELECT
--     n.nspname AS schema,
--     c.relname AS table,
--     p.polname AS policy,
--     pg_get_userbyid(c.relowner) AS table_owner
--   FROM pg_policy p
--   JOIN pg_class c ON c.oid = p.polrelid
--   JOIN pg_namespace n ON n.oid = c.relnamespace
--   WHERE pg_get_expr(p.polqual, p.polrelid) ILIKE '%get_admin_level%'
--      OR pg_get_expr(p.polwithcheck, p.polrelid) ILIKE '%get_admin_level%';
--
-- Expect: every row shows table_owner = postgres.

-- ── Recommendation ─────────────────────────────────────────────────────
-- Shape A (draft 03) is the safer choice. Shape B is the cleaner shape
-- ONLY if the call-site audit comes back clean. A-side / Chau decides.
