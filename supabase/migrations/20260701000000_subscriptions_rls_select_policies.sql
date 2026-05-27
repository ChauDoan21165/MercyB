-- A1: Critical fix for public.subscriptions RLS exposure.
--
-- Scope:
--   * public.subscriptions only.
--   * Enable RLS.
--   * Allow authenticated users to SELECT only their own rows.
--   * Allow level-9 admins to SELECT all rows through the existing
--     public.get_admin_level(auth.uid()) helper.
--
-- Intentionally absent in this MR:
--   * No GRANT/REVOKE changes.
--   * No DROP statements.
--   * No sibling billing table changes.
--   * No raw_payload schema/data changes.

BEGIN;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'subscriptions'
      AND policyname = 'subscriptions_self_select'
  ) THEN
    CREATE POLICY subscriptions_self_select
      ON public.subscriptions
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'subscriptions'
      AND policyname = 'subscriptions_admin_select'
  ) THEN
    CREATE POLICY subscriptions_admin_select
      ON public.subscriptions
      FOR SELECT
      TO authenticated
      USING (public.get_admin_level(auth.uid()) >= 9);
  END IF;
END $$;

COMMIT;
