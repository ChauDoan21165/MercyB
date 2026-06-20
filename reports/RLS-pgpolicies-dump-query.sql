-- A15: RLS canonical reference dump.
-- Read-only. Paste into Supabase SQL Editor and return the JSON result.
-- Captures: every policy, every RLS-enabled table, every existing pg_description on a policy.

SELECT json_build_object(
  'snapshot_taken_at', NOW()::text,
  'pg_version', version(),
  'project_ref', current_setting('cluster_name', true),
  'policies', (
    SELECT COALESCE(json_agg(row_to_json(p) ORDER BY p.schemaname, p.tablename, p.policyname), '[]'::json)
    FROM (
      SELECT
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
      FROM pg_policies
      WHERE schemaname IN ('public', 'auth', 'storage')
    ) p
  ),
  'tables_with_rls_enabled', (
    SELECT COALESCE(json_agg(row_to_json(t) ORDER BY t.schemaname, t.tablename), '[]'::json)
    FROM (
      SELECT
        n.nspname AS schemaname,
        c.relname AS tablename,
        c.relrowsecurity AS rls_enabled,
        c.relforcerowsecurity AS rls_forced
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relkind = 'r'
        AND n.nspname IN ('public', 'auth', 'storage')
        AND c.relrowsecurity = true
    ) t
  ),
  'tables_in_scope_without_rls', (
    SELECT COALESCE(json_agg(row_to_json(t) ORDER BY t.schemaname, t.tablename), '[]'::json)
    FROM (
      SELECT
        n.nspname AS schemaname,
        c.relname AS tablename
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE c.relkind = 'r'
        AND n.nspname = 'public'
        AND c.relrowsecurity = false
    ) t
  ),
  'existing_policy_comments', (
    SELECT COALESCE(json_agg(row_to_json(c) ORDER BY c.schemaname, c.tablename, c.policyname), '[]'::json)
    FROM (
      SELECT
        n.nspname AS schemaname,
        cl.relname AS tablename,
        pol.polname AS policyname,
        d.description AS comment
      FROM pg_policy pol
      JOIN pg_class cl ON cl.oid = pol.polrelid
      JOIN pg_namespace n ON n.oid = cl.relnamespace
      LEFT JOIN pg_description d ON d.objoid = pol.oid AND d.classoid = 'pg_policy'::regclass
      WHERE n.nspname IN ('public', 'auth', 'storage')
        AND d.description IS NOT NULL
    ) c
  )
) AS rls_snapshot;
