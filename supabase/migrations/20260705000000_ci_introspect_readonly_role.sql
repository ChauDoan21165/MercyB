-- Scoped, read-only Postgres role for the delete-account-guard schema
-- introspection (psql-direct path; see scripts/check-delete-account-coverage.mjs).
--
-- LOGIN role, but created PASSWORDLESS here. Chau sets the password OUT OF BAND
-- via a separate `ALTER ROLE ci_introspect PASSWORD '...'` (kept out of the repo
-- AND out of any agent session), then puts the full connection string in the
-- protected CI variable SUPABASE_CI_INTROSPECT_DSN.
--
-- Privilege floor — strictly read-only:
--   NOSUPERUSER, NOBYPASSRLS, NOCREATEDB, NOCREATEROLE, NOINHERIT, no write grants.
-- Because the role is NOT BYPASSRLS and holds no RLS policies, SELECT on any
-- RLS-enabled table returns ZERO rows — it can enumerate schema metadata
-- (information_schema) but cannot read user PII.
--
-- New objects/grants only. Apply via psql (Chau, DB-password-gated) — NOT db push.
-- Idempotent: safe to run more than once.

-- 1. The role — created only if absent, passwordless, login-capable.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'ci_introspect') then
    create role ci_introspect
      login
      nosuperuser
      nobypassrls
      nocreatedb
      nocreaterole
      noinherit;
  end if;
end
$$;

-- 2. Schema visibility (needed for information_schema to list public objects).
grant usage on schema public to ci_introspect;

-- 3. Read-only visibility of every CURRENT relation (table OR view) in public,
--    so information_schema.columns lists ALL user-id-bearing relations — not an
--    anon-style subset. This breadth is required: the guard's job is to catch a
--    NEW user table absent from the manifest, so the role must be able to see
--    tables it doesn't yet know about. Still strictly SELECT — no write.
grant select on all tables in schema public to ci_introspect;

-- 4. Future-proof: relations created later auto-grant SELECT, so a newly-added
--    user table is still caught. NOTE: default privileges apply per GRANTOR role;
--    `postgres` is the usual Supabase migration runner. If your migrations run as
--    a different role, change `for role postgres` to match it.
alter default privileges for role postgres in schema public
  grant select on tables to ci_introspect;
