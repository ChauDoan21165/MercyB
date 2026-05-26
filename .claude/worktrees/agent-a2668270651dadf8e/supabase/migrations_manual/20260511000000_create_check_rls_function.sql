-- Run in Supabase SQL Editor to enable the admin-security-health
-- Edge Function to verify RLS status on production tables.
--
-- Creates the check_rls_enabled helper function and grants the
-- authenticated role execute permission.

CREATE OR REPLACE FUNCTION public.check_rls_enabled(table_name text)
RETURNS boolean
LANGUAGE sql STABLE
SET search_path = ''
AS $$
  SELECT relrowsecurity
  FROM pg_catalog.pg_class
  WHERE relname = table_name
    AND relnamespace = 'public'::regnamespace
$$;

GRANT EXECUTE ON FUNCTION public.check_rls_enabled(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_rls_enabled(text) TO anon;
GRANT EXECUTE ON FUNCTION public.check_rls_enabled(text) TO service_role;

COMMENT ON FUNCTION public.check_rls_enabled(text) IS
'Returns true if RLS (row level security) is enabled on the given table in the public schema. Used by supabase/functions/admin-security-health/index.ts.';
