-- Helper RPC for admin-security-health: returns every public table that
-- has a `user_id` column along with its current RLS-enabled state.
-- Used by the security health check to surface any table that holds
-- per-user data but doesn't enforce row-level security.
--
-- SECURITY DEFINER + restricted to service_role so we don't leak the
-- table inventory to anon. The Edge Function calls this with its
-- service-role client only.

CREATE OR REPLACE FUNCTION public.list_user_data_tables_rls_status()
RETURNS TABLE (
  table_name text,
  rls_enabled boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT
    c.relname::text AS table_name,
    c.relrowsecurity AS rls_enabled
  FROM pg_catalog.pg_class c
  JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
  JOIN pg_catalog.pg_attribute a
    ON a.attrelid = c.oid
   AND a.attname = 'user_id'
   AND a.attnum > 0
   AND NOT a.attisdropped
  WHERE n.nspname = 'public'
    AND c.relkind = 'r'                  -- ordinary tables only, no views
  ORDER BY c.relname;
$$;

REVOKE ALL ON FUNCTION public.list_user_data_tables_rls_status() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_user_data_tables_rls_status() TO service_role;
