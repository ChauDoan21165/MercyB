-- Scope legacy PUBLIC `WITH CHECK (true)` INSERT policies to service_role.
--
-- WHY THIS EXISTS  (A59 anon-write audit follow-up)
-- ───────────────────────────────────────────────────────────────────────
-- The A59 audit found ~10 INSERT policies created in 2025-11/12 with no
-- `TO` role clause (Postgres defaults these to PUBLIC, which INCLUDES the
-- `anon` role) and an unconditional `WITH CHECK (true)`. Today they are
-- INERT for anon: this project requires explicit table-level grants before
-- RLS is evaluated (see 20260422020000_enable_rls_on_exposed_tables.sql:
-- "Without these Postgres rejects the INSERT before RLS is evaluated") and
-- there is no `GRANT INSERT … TO anon` anywhere. They are LATENT risk: the
-- moment a future migration adds a blanket grant or Supabase default
-- privileges are restored, ~10 internal tables become anon-writable
-- (forged payment rows, log/cost poisoning, fake moderation violations).
--
-- This migration closes that latent hole for the 8 tables whose only
-- writers are edge functions (service_role) — verified by grepping src/
-- and supabase/functions/ for actual write call sites.
--
-- NOTE on mechanism: `service_role` BYPASSES RLS entirely, so the
-- `TO service_role` policy below is a defense-in-depth / intent marker —
-- it is the `REVOKE INSERT … FROM anon, authenticated` that is the
-- operative lock (and is idempotent: REVOKE of an un-granted privilege is
-- a harmless no-op). Both are kept so the table is never left with a
-- PUBLIC `WITH CHECK (true)` policy again.
--
-- Idempotent: every block is DROP POLICY IF EXISTS (legacy name AND new
-- name) followed by CREATE, so this file is safe to re-run.
--
-- PROJECT CONVENTION: GRANT/REVOKE + policy DDL is applied by hand via the
-- Supabase SQL Editor, NOT `supabase db push`. This file is the reviewed
-- artifact + the copy-paste source for that manual apply.
--
-- ── DELIBERATELY EXCLUDED — would regress production ────────────────────
-- The A59 brief also listed `system_logs` and `login_attempts`. Both are
-- written DIRECTLY FROM THE BROWSER, not server-side:
--   • system_logs    — src/lib/logger.ts:93 persists client error/warn
--                       logs in prod for ANY user (incl. anonymous).
--                       Scoping to service_role + revoking authenticated
--                       would silently kill all client error telemetry.
--   • login_attempts — src/utils/securityUtils.ts:91 (trackLoginAttempt)
--                       inserts during login, i.e. the ANON pre-auth
--                       context, to drive brute-force lockout. This is a
--                       legitimate by-design anon write; revoking it is a
--                       SECURITY REGRESSION (disables lockout tracking).
-- Both require a product decision (keep the anon/client path, or move the
-- write behind a SECURITY DEFINER RPC like log_security_event already
-- does for security_events) and are intentionally left untouched here.
-- ───────────────────────────────────────────────────────────────────────

BEGIN;

-- 1. payment_transactions — writer: Stripe webhook edge fn (service_role)
DROP POLICY IF EXISTS "System can insert transactions"        ON public.payment_transactions;
DROP POLICY IF EXISTS "payment_transactions_service_insert"   ON public.payment_transactions;
CREATE POLICY "payment_transactions_service_insert"
  ON public.payment_transactions FOR INSERT TO service_role WITH CHECK (true);
REVOKE INSERT ON public.payment_transactions FROM anon, authenticated;

-- 2. ai_usage — writer: supabase/functions/_shared/aiLogger.ts (service_role)
DROP POLICY IF EXISTS "System can insert AI usage logs"  ON public.ai_usage;
DROP POLICY IF EXISTS "ai_usage_service_insert"          ON public.ai_usage;
CREATE POLICY "ai_usage_service_insert"
  ON public.ai_usage FOR INSERT TO service_role WITH CHECK (true);
REVOKE INSERT ON public.ai_usage FROM anon, authenticated;

-- 3. ai_usage_events — writer: supabase/functions/_shared/aiUsage.ts (service_role)
DROP POLICY IF EXISTS "System can insert AI usage"        ON public.ai_usage_events;
DROP POLICY IF EXISTS "ai_usage_events_service_insert"    ON public.ai_usage_events;
CREATE POLICY "ai_usage_events_service_insert"
  ON public.ai_usage_events FOR INSERT TO service_role WITH CHECK (true);
REVOKE INSERT ON public.ai_usage_events FROM anon, authenticated;

-- 4. security_incidents — writer: supabase/functions/security-alert (service_role)
DROP POLICY IF EXISTS "System can insert incidents"          ON public.security_incidents;
DROP POLICY IF EXISTS "security_incidents_service_insert"    ON public.security_incidents;
CREATE POLICY "security_incidents_service_insert"
  ON public.security_incidents FOR INSERT TO service_role WITH CHECK (true);
REVOKE INSERT ON public.security_incidents FROM anon, authenticated;

-- 5. uptime_checks — writer: supabase/functions/uptime-monitor (service_role)
DROP POLICY IF EXISTS "System can insert uptime checks"   ON public.uptime_checks;
DROP POLICY IF EXISTS "uptime_checks_service_insert"      ON public.uptime_checks;
CREATE POLICY "uptime_checks_service_insert"
  ON public.uptime_checks FOR INSERT TO service_role WITH CHECK (true);
REVOKE INSERT ON public.uptime_checks FROM anon, authenticated;

-- 6. security_events — client path is the SECURITY DEFINER RPC
--    public.log_security_event (bypasses this table policy entirely);
--    direct table writer is supabase/functions/shared/rate-limit.ts
--    (service_role). The current "Authenticated can log own events"
--    policy's `OR user_id IS NULL` branch is PUBLIC-predicate-reachable —
--    this scoping also closes that hole.
DROP POLICY IF EXISTS "Authenticated can log own events"   ON public.security_events;
DROP POLICY IF EXISTS "System can insert security events"  ON public.security_events;
DROP POLICY IF EXISTS "security_events_service_insert"     ON public.security_events;
CREATE POLICY "security_events_service_insert"
  ON public.security_events FOR INSERT TO service_role WITH CHECK (true);
REVOKE INSERT ON public.security_events FROM anon, authenticated;

-- 7. email_events — writers: email-broadcast / email-automations /
--    send-email-campaign edge fns (service_role)
DROP POLICY IF EXISTS "System can insert email events"   ON public.email_events;
DROP POLICY IF EXISTS "email_events_service_insert"      ON public.email_events;
CREATE POLICY "email_events_service_insert"
  ON public.email_events FOR INSERT TO service_role WITH CHECK (true);
REVOKE INSERT ON public.email_events FROM anon, authenticated;

-- 8. user_moderation_violations — writer: supabase/functions/content-moderation (service_role)
DROP POLICY IF EXISTS "System can insert violations"               ON public.user_moderation_violations;
DROP POLICY IF EXISTS "user_moderation_violations_service_insert"  ON public.user_moderation_violations;
CREATE POLICY "user_moderation_violations_service_insert"
  ON public.user_moderation_violations FOR INSERT TO service_role WITH CHECK (true);
REVOKE INSERT ON public.user_moderation_violations FROM anon, authenticated;

COMMIT;
