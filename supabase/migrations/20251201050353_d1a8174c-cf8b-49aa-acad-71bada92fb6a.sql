-- Performance Optimization: Add Missing Database Indexes
-- This migration adds critical indexes to improve query performance at scale

-- user_subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id 
ON user_subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status 
ON user_subscriptions(status);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_status 
ON user_subscriptions(user_id, status);

-- subscription_tiers indexes
CREATE INDEX IF NOT EXISTS idx_subscription_tiers_name 
ON subscription_tiers(name);

-- rooms indexes
CREATE INDEX IF NOT EXISTS idx_rooms_tier 
ON rooms(tier);

CREATE INDEX IF NOT EXISTS idx_rooms_domain 
ON rooms(domain);

-- user_quotas indexes
CREATE INDEX IF NOT EXISTS idx_user_quotas_user_date 
ON user_quotas(user_id, quota_date);

-- payment_transactions indexes
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id 
ON payment_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_status 
ON payment_transactions(status);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_external_ref 
ON payment_transactions(external_reference);

-- feedback indexes
CREATE INDEX IF NOT EXISTS idx_feedback_user_id 
ON feedback(user_id);

CREATE INDEX IF NOT EXISTS idx_feedback_status 
ON feedback(status);

CREATE INDEX IF NOT EXISTS idx_feedback_created_at 
ON feedback(created_at DESC);

-- room_usage_analytics indexes
CREATE INDEX IF NOT EXISTS idx_room_usage_analytics_user_room 
ON room_usage_analytics(user_id, room_id);

CREATE INDEX IF NOT EXISTS idx_room_usage_analytics_session_start 
ON room_usage_analytics(session_start DESC);

-- security_events indexes
CREATE INDEX IF NOT EXISTS idx_security_events_user_id 
ON security_events(user_id);

CREATE INDEX IF NOT EXISTS idx_security_events_severity 
ON security_events(severity);

CREATE INDEX IF NOT EXISTS idx_security_events_created_at 
ON security_events(created_at DESC);

-- audit_logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_id 
ON audit_logs(admin_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at 
ON audit_logs(created_at DESC);

-- kids_subscriptions indexes
CREATE INDEX IF NOT EXISTS idx_kids_subscriptions_user_status 
ON kids_subscriptions(user_id, status);

-- user_promo_redemptions indexes
CREATE INDEX IF NOT EXISTS idx_user_promo_redemptions_user_id 
ON user_promo_redemptions(user_id);

CREATE INDEX IF NOT EXISTS idx_user_promo_redemptions_expires_at 
ON user_promo_redemptions(expires_at);

-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_tier_status 
ON user_subscriptions(tier_id, status, user_id);

-- Add index to system_logs for querying (if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'system_logs'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_system_logs_level_created 
    ON system_logs(level, created_at DESC);
    
    CREATE INDEX IF NOT EXISTS idx_system_logs_user_id 
    ON system_logs(user_id);
  END IF;
END $$;