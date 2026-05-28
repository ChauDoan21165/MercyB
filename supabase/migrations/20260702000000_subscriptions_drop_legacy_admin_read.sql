-- A1 Phase 2 draft: remove the legacy broad admin-read policy.
--
-- Approval-gated production step. Do not apply without Chau approval.
--
-- Scope:
--   * public.subscriptions only.
--   * Drop only the legacy subscriptions_admin_read policy.
--   * Keep subscriptions_self_select and subscriptions_admin_select from
--     20260701000000_subscriptions_rls_select_policies.sql.

BEGIN;

DROP POLICY IF EXISTS subscriptions_admin_read ON public.subscriptions;

COMMIT;
