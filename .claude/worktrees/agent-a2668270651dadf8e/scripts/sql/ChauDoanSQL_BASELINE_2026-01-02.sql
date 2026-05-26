-- ===============================================================
-- ChauDoanSQL — Holistic Security Audit (Supabase / PostgreSQL)
-- SAFE TO RUN — READ-ONLY (no mutations)
-- ===============================================================

-- ---------------------------------------------------------------
-- 1. SESSION CONTEXT
-- ---------------------------------------------------------------
select
  current_user,
  session_user,
  current_database() as db,
  current_schema() as schema,
  inet_client_addr() as client_addr,
  now() as now;

-- ---------------------------------------------------------------
-- 2. SCHEMAS & ROLE USAGE
-- ---------------------------------------------------------------
select
  n.nspname as schema,
  r.rolname as role,
  has_schema_privilege(r.rolname, n.nspname, 'USAGE') as has_usage,
  has_schema_privilege(r.rolname, n.nspname, 'CREATE') as has_create
from pg_namespace n
cross join (
  select rolname
  from pg_roles
  where rolname in ('public','anon','authenticated','service_role','postgres')
) r
where n.nspname in ('public','auth','storage')
order by n.nspname, r.rolname;

-- ---------------------------------------------------------------
-- 3. TABLES & RLS STATUS
-- ---------------------------------------------------------------
select
  n.nspname as schema,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
order by c.relname;

-- ---------------------------------------------------------------
-- 4. RLS POLICIES
-- ---------------------------------------------------------------
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

-- ---------------------------------------------------------------
-- 5. TABLE-LEVEL PRIVILEGES
-- ---------------------------------------------------------------
select
  table_schema,
  table_name,
  grantee,
  privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee in ('PUBLIC','anon','authenticated','service_role')
order by table_name, grantee, privilege_type;

-- ---------------------------------------------------------------
-- 6. COLUMN-LEVEL PRIVILEGES
-- ---------------------------------------------------------------
select
  table_schema,
  table_name,
  column_name,
  grantee,
  privilege_type
from information_schema.column_privileges
where table_schema = 'public'
  and grantee in ('PUBLIC','anon','authenticated','service_role')
order by table_name, column_name, grantee, privilege_type;

-- ---------------------------------------------------------------
-- 7. VIEWS & MATERIALIZED VIEWS
-- ---------------------------------------------------------------
select
  n.nspname as schema,
  c.relname as view_name,
  pg_get_userbyid(c.relowner) as owner,
  c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind in ('v','m')
order by c.relname;

-- ---------------------------------------------------------------
-- 8. SECURITY DEFINER FUNCTIONS
-- ---------------------------------------------------------------
select
  n.nspname as schema,
  p.proname as function_name,
  pg_get_userbyid(p.proowner) as owner,
  p.prosecdef as security_definer,
  p.provolatile as volatility,
  pg_get_function_identity_arguments(p.oid) as args
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname in ('public','auth','storage')
  and p.prosecdef = true
order by n.nspname, p.proname;

-- ---------------------------------------------------------------
-- 9. TRIGGERS (SAFE ORDER BY)
-- ---------------------------------------------------------------
select
  event_object_schema as schema,
  event_object_table,
  trigger_name,
  action_timing,
  event_manipulation
from information_schema.triggers
where event_object_schema = 'public'
order by event_object_table, trigger_name;

-- ---------------------------------------------------------------
-- 10. EXTENSIONS
-- ---------------------------------------------------------------
select
  extname,
  extversion
from pg_extension
order by extname;

-- ---------------------------------------------------------------
-- 11. FINAL ASSERTION
-- ---------------------------------------------------------------
select 'ChauDoanSQL security audit COMPLETE' as status;
