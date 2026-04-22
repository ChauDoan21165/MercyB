-- Enables RLS on 11 tables flagged by Supabase's security advisor as publicly
-- accessible. 10 of them are only written/read by edge functions (service_role
-- bypasses RLS), so enabling RLS with no policies locks them down cleanly.
-- `entitlement_events` is also queried from the client for IAP idempotency, so
-- it gets explicit per-user policies.

-- ── Server-only tables: enable RLS, NO policies ─────────────────────────────
-- Edge functions using SERVICE_ROLE_KEY bypass RLS. Anon + authenticated keys
-- get zero access, which is what we want.

ALTER TABLE public.ai_price_catalog           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_product_catalog         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apple_iap_events           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_price_map          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercy_feedback_daily_rollups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercy_feedback_events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mercy_worst_answers_daily  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_events              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_webhook_events      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscription_state    ENABLE ROW LEVEL SECURITY;

-- ── entitlement_events: client reads/writes own rows for IAP idempotency ────

ALTER TABLE public.entitlement_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "entitlement_events_own_read"   ON public.entitlement_events;
DROP POLICY IF EXISTS "entitlement_events_own_insert" ON public.entitlement_events;

CREATE POLICY "entitlement_events_own_read"
  ON public.entitlement_events
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "entitlement_events_own_insert"
  ON public.entitlement_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- No UPDATE/DELETE policies — clients cannot modify past events.
-- Edge functions (service_role) bypass RLS and can still insert/update.

-- Explicit table-level grants for the authenticated role. Without these
-- Postgres rejects the INSERT before RLS is evaluated (same mistake that
-- broke study_log + teacher_memory earlier).
GRANT SELECT, INSERT ON public.entitlement_events TO authenticated;
