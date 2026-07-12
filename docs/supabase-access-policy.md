# Supabase Access Policy

This policy mirrors the merge gatekeeper: access is tiered by blast radius, and the highest-risk action controls the whole task.

## Tier A: Agent Read-Only

Agents may query production observability state directly through a new `agent_readonly` database role.

Allowed:

- `SELECT` only.
- Pooler connection only.
- Ops surfaces only: `client_errors`, `function_failure_logs`, alert-history tables, `net._http_response`, `cron.job`, and `cron.job_run_details`.

Not allowed:

- Writes of any kind.
- Service-role keys.
- Dashboard changes.
- `supabase db push`.

Tier A is for diagnosis and evidence gathering, not repair.

## Tier B: Main-Only CI

CI may apply approved Supabase changes only after merge to `main`, and only when Chau enables `SUPABASE_CD_ENABLED=1`.

Allowed:

- Deploy the full Supabase Edge Function suite when a merge to `main` touches `supabase/functions/**`.
- Apply new migration SQL files from `supabase/migrations/**` in filename order.
- Run `scripts/sql-lint.mjs` before applying migration files.
- Track applied files in `public.applied_migrations`.

Constraints:

- The deploy token lives only in protected and masked CI variables scoped to protected `main` pipelines.
- The deploy token never enters lane shells, local agent sessions, or ad-hoc MR jobs.
- `supabase db push` remains permanently forbidden.
- Migration application uses `psql "$MIGRATOR_DATABASE_URL" -f <file>`, not Supabase CLI migration push.

Standing tokens caused a prior incident. This design deliberately avoids standing lane-shell tokens.

Tier B reviewer check:

- RLS-tighten-after-client-live is a Tier 2 reviewer check in v1. It is not automated here. Reviewers must confirm that any RLS tightening lands only after the corresponding client/server read-write path is live and verified.

## Tier C: Chau-Held

Chau retains direct control over destructive and privileged Supabase actions.

Chau-held actions:

- Destructive SQL approval.
- Service-role access.
- Token creation.
- Supabase dashboard GUI changes.
- Auth/payment/entitlement schema changes.
- Any SQL requiring the destructive marker:

```sql
-- CHAU-APPROVED: Approve Phase 2 destructive SQL for <task>
```

The marker is not a blanket approval. It must name the task and be present in the specific migration file that needs destructive SQL.

Forbidden everywhere except Chau-held manual action:

- `supabase db push`
- Unscoped service-role distribution
- Unmasked or unprotected deploy tokens
