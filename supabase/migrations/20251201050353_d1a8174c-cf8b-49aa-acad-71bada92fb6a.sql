-- MB-KIDS-GUARD-01 — 2025-12-01
-- Performance indexes (replay-safe, schema-safe)

DO $$
BEGIN
  IF to_regclass('public.kids_subscriptions') IS NOT NULL THEN
    EXECUTE '
      CREATE INDEX IF NOT EXISTS idx_kids_subscriptions_user_status
      ON public.kids_subscriptions(user_id, status)
    ';
  ELSE
    RAISE NOTICE ''kids_subscriptions table missing; skipping indexes.'';
  END IF;
END $$;
