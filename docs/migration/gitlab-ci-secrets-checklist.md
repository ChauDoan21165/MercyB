# GitLab CI Secrets Checklist

Draft source: `.gitlab-ci.yml`

Set these under GitLab **Settings -> CI/CD -> Variables**. Use protected variables for jobs limited to protected branches/tags. Use masked variables for tokens, keys, and passwords when GitLab accepts the value format.

## Required for merge checks

These are needed only if the corresponding merge-check jobs should run at full strength before merge. The current draft is safe without them where noted, but the gate may skip or run with reduced coverage.

| Variable | Purpose | Recommendation | CI jobs | Required before merge? |
| --- | --- | --- | --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL used by delete-account coverage and deployed edge-function probes. | Masked if possible; not necessarily secret, but keep protected if it points at production. | `delete_account_coverage`, `validate_deployed_edge_functions` | Required for full Supabase-backed coverage; otherwise some scripts skip or stay manual. |
| `VITE_SUPABASE_ANON_KEY` or `SUPABASE_ANON_KEY` or `VITE_SUPABASE_PUBLISHABLE_KEY` | Public/anon key used to probe deployed edge functions. | Masked if GitLab accepts it; protected for production. Prefer one canonical variable and mirror only if scripts require legacy names. | `validate_deployed_edge_functions` | Required only if deployed edge-function validation is enforced before merge. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key for privileged Supabase checks such as delete-account coverage. | Masked and protected. Never expose to untrusted fork/MR pipelines. | `delete_account_coverage`; also deploy/live validation scripts if later enabled | Required for full delete-account coverage; otherwise script is expected to skip. |

## Required before deploy

These should be configured before enabling manual deploy jobs.

| Variable | Purpose | Recommendation | CI jobs | Required before merge? |
| --- | --- | --- | --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Authenticates Supabase CLI for migration, edge deploy, and drift/deployment checks. | Masked and protected. | `supabase_migrations_staging`, `supabase_migrations_prod`, `supabase_edge_functions_deploy`, `check_edge_function_drift` | No. Deploy/drift blocker only. |
| `SUPABASE_PROJECT_REF` | Production Supabase project ref. Draft defaults to `buemdfxyhxunzpgdoqin`; configure as a variable if environment-specific. | Protected; not usually masked. | `supabase_migrations_prod`, `supabase_edge_functions_deploy`, `check_edge_function_drift` | No. Deploy blocker only. |
| `SUPABASE_DB_PASSWORD` | Production database password for `supabase db push`. | Masked and protected. | `supabase_migrations_prod` | No. Production migration blocker. |
| `SUPABASE_STAGING_PROJECT_REF` | Staging Supabase project ref. | Protected; not usually masked. | `supabase_migrations_staging` | No. Staging migration blocker. |
| `SUPABASE_STAGING_DB_PASSWORD` | Staging database password for `supabase db push`. | Masked and protected. | `supabase_migrations_staging` | No. Staging migration blocker. |
| `EDGE_FUNCTION_NAME` | Optional manual selector for one Supabase edge function; empty means deploy all repo functions except helper folders. | Not secret. Set per manual job run, not globally unless needed. | `supabase_edge_functions_deploy` | No. Optional deploy selector. |
| `VERCEL_TOKEN` | Authenticates Vercel pull/build/deploy. | Masked and protected. | `production_deploy_vercel`; future GitLab preview deploy job if added | No. Vercel deploy blocker. |
| `VERCEL_ORG_ID` | Vercel org/team id for project linking. | Protected; masked if GitLab accepts it. | `production_deploy_vercel` | No. Vercel deploy blocker. |
| `VERCEL_PROJECT_ID` | Vercel project id for project linking. | Protected; masked if GitLab accepts it. | `production_deploy_vercel` | No. Vercel deploy blocker. |

## Optional integrations

| Variable | Purpose | Recommendation | CI jobs | Required before merge? |
| --- | --- | --- | --- | --- |
| `SENTRY_AUTH_TOKEN` | Enables production sourcemap upload during Vercel builds if Sentry integration is restored. | Masked and protected. | `production_deploy_vercel` through Vercel/Sentry build env; future Sentry monitor jobs | No. Optional observability quality gate. |
| `CODECOV_TOKEN` | Uploads Vitest coverage if Codecov is restored in GitLab. | Masked and protected. | Future coverage upload job; current `vitest_coverage` only stores artifacts | No. Optional reporting only. |

## Current deploy blockers

- Vercel production deploy cannot run until `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` exist.
- Supabase production migrations cannot run until `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF`, and `SUPABASE_DB_PASSWORD` exist.
- Supabase staging migrations cannot run until `SUPABASE_ACCESS_TOKEN`, `SUPABASE_STAGING_PROJECT_REF`, and `SUPABASE_STAGING_DB_PASSWORD` exist.
- Supabase edge-function deploy cannot run until `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT_REF` exist.
- Enforced deployed edge-function validation needs `VITE_SUPABASE_URL` plus one anon/publishable key variable.
- Full delete-account coverage needs `VITE_SUPABASE_URL` plus `SUPABASE_SERVICE_ROLE_KEY`; without them the script is expected to skip.

## GitLab-specific notes

- Keep service-role and deploy variables protected so they are unavailable to untrusted merge request pipelines.
- GitHub Actions PR comments, auto-commits, Codecov upload, Lighthouse reports, and Vercel preview comments need separate GitLab integrations or follow-up CI jobs.
- Do not enable automatic production deploys until protected branch rules and environment approvals are configured.
