# DB SECURITY BASELINE v1 — Mercy Blade (Supabase)

Date: 2026-01-02
Project: Mercy Blade Real (Supabase)
Owner: ChauDoan
Mode: PARANOID (assume app compromised; DB must still hold)

## Scope
- Schemas: public, auth, storage
- Roles evaluated: anon, authenticated, service_role (awareness only)
- Core goals:
  1) No unintended READ for anon/authenticated on sensitive tables
  2) No unintended WRITE for anon/authenticated outside guarded pathways
  3) RLS is enabled where expected (and policies are not “USING true” everywhere)
  4) SECURITY DEFINER functions exist only where intended and are owned by postgres
  5) Views/triggers do not create bypass paths

## Evidence (Snapshot)
- Vercel deploy: GREEN after audit + UI fixes
- ChauDoanSQL audit runner: COMPLETE

## Invariants (must remain true)
### Privileges
- No public schema “create” for anon/authenticated
- No direct table CREATE/ALTER/DROP for anon/authenticated
- Any anon/authenticated WRITE permissions must be justified by:
  - RLS enabled AND
  - narrow RLS policies OR
  - only via SECURITY DEFINER functions

### RLS
- Sensitive tables must have RLS = true
- RLS “forced” optional; if false, confirm owner is postgres and policies are restrictive

### Functions
- SECURITY DEFINER functions:
  - owner = postgres
  - no dynamic SQL execution from user input (no EXECUTE format(...) with raw user strings)
  - enforce authorization internally (role checks / claims checks)

### Views / Materialized Views
- Views should not expose sensitive data beyond RLS/policy intent
- Materialized views should not contain private user data unless RLS strategy is explicit

### Triggers
- Triggers should not write across boundaries without authorization checks

## Red Flags Checklist (if any show up → STOP)
- Any GRANT of ALL PRIVILEGES to anon/authenticated
- Any table with RLS disabled that contains user-private data
- Any policy with (USING true) on sensitive tables
- Any SECURITY DEFINER function owned by non-postgres
- Any function that builds SQL via concatenation / EXECUTE with untrusted input

## Re-run Protocol
Run: supabase/sql/ChauDoanSQL_DB_SECURITY_BASELINE_v1.sql
Compare outputs to expected “GREEN” patterns.
If differences:
- classify: expected change vs regression
- document diffs in a new baseline version (v2)
