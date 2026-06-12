# R2 v2 Execution Readiness

Status: NOT READY TO EXECUTE
Owner: A1
Date: 2026-06-12

This runbook records the execution gates and future SQL shape for removing the legacy entitlement snapshot surface after the post-pooler dependency preflight. It is intentionally a readiness artifact. Do not run the removal SQL until every gate below is complete and a fresh dependency preflight is clean.

## Source Evidence

- Pooler preflight: `/Users/admin/reports/r2-preflight-results.md`
- Prior draft runbook: `/Users/admin/reports/runbook-r2-drop-entitlements-dump.md`
- Repoint plan: `/Users/admin/reports/repoint-plan-r2.md`

The pooler preflight found live dependents on `public.user_entitlements_raw_20260301_181303`:

- Views: `public.my_entitlements`, `public.my_entitlements_v1`
- Function: `public.set_user_entitlements(uuid,text,integer,jsonb)`
- Triggers: two user triggers plus internal foreign-key triggers
- Types: table row and array types

No policies or materialized views were reported in the preflight. The current production-safe conclusion is that the old single-relation removal draft is not execution-ready.

## Readiness Gates

All gates are required before any production relation-removal statement is run.

1. Confirm entitlement coverage after app repointing.
   - Chau-run SQL must show zero active users whose only active entitlement source is `my_entitlements` or `my_entitlements_v1`.
   - If any rows are returned, stop and reconcile those users before proceeding.
2. Remove app fallback reads from the billing shared helper.
   - Remove `my_entitlements_v1` and `my_entitlements` from the candidate relation list in `supabase/functions/_shared/billing.ts`.
   - Keep the primary entitlement views in place.
3. Remove delete-account cleanup coverage for the snapshot relation.
   - Remove the manifest entry for `public.user_entitlements_raw_20260301_181303` in `supabase/functions/delete-account/user-data-manifest.ts`.
   - Leave unrelated entitlement surfaces unchanged unless separately preflighted.
4. Deploy the updated billing and delete-account edge functions.
   - Verify the deployed edge functions are serving the repointed code before relation removal.
5. Regenerate database types after schema removal is applied.
   - This is a follow-up after production removal, not a precondition for the SQL itself.
6. Re-run the dependency preflight immediately before execution.
   - The fresh preflight must account for views, materialized views, functions, triggers, policies, table row types, array types, and foreign-key internals.
   - Do not use blanket cascade behavior.

## Dependency Order For Future Removal

Use explicit dependency order. If a fresh preflight finds additional user-owned dependents, add them to the plan before execution.

1. Remove `public.my_entitlements_v1`.
2. Remove `public.my_entitlements`.
3. Remove `public.set_user_entitlements(uuid,text,integer,jsonb)`.
4. Remove `public.user_entitlements_raw_20260301_181303`.

The base `public.user_entitlements_raw` relation is not covered by the post-pooler preflight named above. It must not be removed by this v2 plan unless a separate fresh preflight explicitly covers it and the app/manifest gates are expanded for that relation.

## Fresh Preflight SQL

Run this read-only preflight against production immediately before execution.

```sql
begin;
set transaction read only;

with targets as (
  select 'public.my_entitlements'::regclass as oid
  union all
  select 'public.my_entitlements_v1'::regclass
  union all
  select 'public.user_entitlements_raw_20260301_181303'::regclass
),
function_targets as (
  select 'public.set_user_entitlements(uuid,text,integer,jsonb)'::regprocedure as oid
)
select
  d.classid::regclass as dependent_catalog,
  d.objid::regclass as dependent_object,
  d.refclassid::regclass as referenced_catalog,
  d.refobjid::regclass as referenced_object,
  d.deptype
from pg_depend d
join targets t on t.oid = d.refobjid
order by 1, 2, 3, 4, 5;

select
  p.schemaname,
  p.tablename,
  p.policyname
from pg_policies p
where p.schemaname = 'public'
  and p.tablename in (
    'my_entitlements',
    'my_entitlements_v1',
    'user_entitlements_raw_20260301_181303'
  )
order by 1, 2, 3;

select
  schemaname,
  matviewname
from pg_matviews
where schemaname = 'public'
  and definition ~ '(my_entitlements|my_entitlements_v1|user_entitlements_raw_20260301_181303)'
order by 1, 2;

select
  n.nspname as function_schema,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as args
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where p.oid in (select oid from function_targets)
order by 1, 2, 3;

rollback;
```

## Future Apply SQL Skeleton

Only fill and run this block after all readiness gates pass and the fresh preflight has no unaccounted user-owned dependents. Keep the statements explicit.

```sql
begin;

DROP VIEW IF EXISTS public.my_entitlements_v1;
DROP VIEW IF EXISTS public.my_entitlements;
DROP FUNCTION IF EXISTS public.set_user_entitlements(uuid,text,integer,jsonb);
DROP
TABLE IF EXISTS public.user_entitlements_raw_20260301_181303;

commit;
```

## Abort Conditions

Abort before execution if any of these are true:

- App code still reads `my_entitlements` or `my_entitlements_v1` as entitlement fallbacks.
- Delete-account manifest still targets `public.user_entitlements_raw_20260301_181303`.
- Coverage SQL finds active users only present through legacy `my_*` views.
- Fresh preflight finds policies, materialized views, functions, or other user-owned dependents not explicitly listed in the apply plan.
- The executor cannot confirm the deployed functions are the repointed versions.
