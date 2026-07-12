# Supabase CD Setup

These are Chau's one-time setup steps for the Supabase access-tiers system.

## 1. Apply Agent Read-Only Role SQL

Open Supabase SQL Editor and apply:

```text
supabase/migrations_manual/20260712100000_agent_readonly_role.sql
```

This creates `agent_readonly` and grants exact `SELECT` privileges on the approved ops tables only.

After applying it, set a password for `agent_readonly` in SQL Editor or through the dashboard, then build the pooler URL used for `AGENT_RO_DATABASE_URL`.

## 2. Create CI Variables

In GitLab, open `Settings > CI/CD > Variables` and add:

- `SUPABASE_ACCESS_TOKEN`
  - Protected: yes
  - Masked: yes
  - Scope: protected `main` pipelines only
  - Purpose: Supabase CLI function deploys

- `MIGRATOR_DATABASE_URL`
  - Protected: yes
  - Masked: yes
  - Scope: protected `main` pipelines only
  - Purpose: `psql` migration application

- `AGENT_RO_DATABASE_URL`
  - Protected: yes
  - Masked: yes
  - Purpose: read-only agent diagnostics through the pooler

Optional:

- `SUPABASE_PROJECT_REF`
  - Default expected project ref is `buemdfxyhxunzpgdoqin`.

Do not add these variables to lane shells. Do not paste them into chat.

## 3. Enable CD

Leave `SUPABASE_CD_ENABLED` unset by default.

When ready, set:

```text
SUPABASE_CD_ENABLED=1
```

Keep it protected and scoped to `main` pipelines.

## 4. Operating Rules

- Function deploys run only from protected `main` pipelines when `supabase/functions/**` changed.
- Migration applies run only from protected `main` pipelines when `supabase/migrations/**` changed.
- `scripts/sql-lint.mjs` blocks destructive SQL unless the migration contains the exact Chau approval marker.
- `supabase db push` remains permanently forbidden.
