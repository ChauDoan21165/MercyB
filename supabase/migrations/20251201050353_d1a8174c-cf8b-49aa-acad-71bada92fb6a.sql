-- Performance Optimization: Add Missing Database Indexes
-- This migration adds critical indexes to improve query performance at scale

-- user_subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id
ON public.user_subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status
ON public.user_subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_status
ON public.user_subscriptions(user_id, status);

-- subscription_tiers indexes
CREATE INDEX IF NOT EXISTS idx_subscription_tiers_name
ON public.subscription_tiers(name);

-- rooms indexes
CREATE INDEX IF NOT EXISTS idx_rooms_tier
ON public.rooms(tier);

CREATE INDEX IF NOT EXISTS idx_rooms_domain
ON public.rooms(domain);

-- user_quotas indexes
CREATE INDEX IF NOT EXISTS idx_user_quotas_user_date
ON public.user_quotas(user_id, quota_date);

-- payment_transactions indexes
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id
ON public.payment_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_status
ON public.payment_transactions(status);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_external_ref
ON public.payment_transactions(external_reference);

-- feedback indexes
CREATE INDEX IF NOT EXISTS idx_feedback_user_id
ON public.feedback(user_id);

CREATE INDEX IF NOT EXISTS idx_feedback_status
ON public.feedback(status);

CREATE INDEX IF NOT EXISTS idx_feedback_created_at
ON public.feedback(created_at DESC);

-- room_usage_analytics indexes
CREATE INDEX IF NOT EXISTS idx_room_usage_analytics_user_room
ON public.room_usage_analytics(user_id, room_id);

CREATE INDEX IF NOT EXISTS idx_room_usage_analytics_session_start
ON public.room_usage_analytics(session_start DESC);

-- security_events indexes
CREATE INDEX IF NOT EXISTS idx_security_events_user_id
ON public.security_events(user_id);

CREATE INDEX IF NOT EXISTS idx_security_events_severity
ON public.security_events(severity);

CREATE INDEX IF NOT EXISTS idx_security_events_created_at
ON public.security_events(created_at DESC);

-- audit_logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id
ON public.audit_logs(admin_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
ON public.audit_logs(created_at DESC);

-- kids_subscriptions indexes (guarded: table may not exist)
DO $$
BEGIN
  IF to_regclass('public.kids_subscriptions') IS NULL THEN
    RAISE NOTICE 'kids_subscriptions missing; skipping kids_subscriptions indexes.';
    RETURN;
  END IF;

  EXECUTE 'CREATE INDEX IF NOT EXISTS idx_kids_subscriptions_user_status ON public.kids_subscriptions(user_id, status)';
END $$;

-- user_promo_redemptions indexes
CREATE INDEX IF NOT EXISTS idx_user_promo_redemptions_user_id
ON public.user_promo_redemptions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_promo_redemptions_expires_at
ON public.user_promo_redemptions(expires_at);

-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_tier_status
ON public.user_subscriptions(tier_id, status, user_id);

-- Add index to system_logs for querying (guarded: table may not exist)
DO $$
BEGIN
  IF to_regclass('public.system_logs') IS NULL THEN
    RAISE NOTICE 'system_logs missing; skipping system_logs indexes.';
    RETURN;
  END IF;

  EXECUTE 'CREATE INDEX IF NOT EXISTS idx_system_logs_level_created ON public.system_logs(level, created_at DESC)';
  EXECUTE 'CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON public.system_logs(user_id)';
END $$;
