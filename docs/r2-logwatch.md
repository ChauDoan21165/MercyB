# R2 Logwatch

R2 LOGWATCH is the Supabase-side server failure scanner from the error-detection fleet. It is a single Supabase Edge Function at `supabase/functions/r2-logwatch` and is intended to run every 15 minutes from `pg_cron`.

## What It Watches

R2 scans these sources in priority order:

1. `public.function_failure_logs`
2. `cron.job_run_details`
3. `net._http_response`
4. Supabase Management API platform logs, only when `SUPABASE_MGMT_TOKEN` exists in the function environment

Rows attributed to the synthetic account prefix `63e289e1-` are excluded from sources that carry `user_id`. The full synthetic UUID is not present in the repo; existing cohort tooling uses this prefix.

The function groups failures by source, provider, route, mode, status, and error class. It dedupes through `public.r2_logwatch_alert_history` for 60 minutes and sends a pre-diagnosed Resend email to `admin@mercyblade.com`.

`?selftest=1` returns JSON showing what would alert. It sends no email and writes no dedupe rows.

## Coverage

R2 can see:

- Rows written to `public.function_failure_logs`.
- Failed `pg_cron` runs in `cron.job_run_details`.
- Non-2xx, timeout, or error rows in `net._http_response`.
- Supabase platform log rows when Chau provisions `SUPABASE_MGMT_TOKEN` with analytics log read permission.

R2 cannot see:

- Cloudflare Pages runtime logs by default.
- Cloudflare `console.error` output from `functions/api/mercy-ai.ts` unless Logpush or another log-drain writes it into a queryable table.
- Browser-only failures. Those are R1 Sentinel territory.

MR !2627 added structured `console.error` helpers in `src/pages-functions/failureLog.ts` and `supabase/functions/_shared/failureLog.ts`. In the merged code, those helpers do not write to a database table. Therefore Cloudflare Pages function failures such as `/api/mercy-ai` do not currently land in `public.function_failure_logs`; R2's Cloudflare coverage remains parked until Chau chooses Logpush or a producer that writes the safe fields into the table.

## Environment

Required function secrets:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`

Optional:

- `SUPABASE_MGMT_TOKEN`
- `SUPABASE_PROJECT_REF` defaults to `buemdfxyhxunzpgdoqin`

The optional Management API token is never logged.

## Post-Merge Steps

1. Apply `supabase/migrations_manual/20260712090000_r2_logwatch_tables.sql` in Supabase SQL Editor.
2. Deploy only this function:

```bash
supabase functions deploy r2-logwatch --project-ref buemdfxyhxunzpgdoqin --use-api
```

3. Seed one fake failure in SQL Editor:

```sql
\i supabase/migrations_manual/20260712090200_r2_logwatch_seed_fake_failure.sql
```

If SQL Editor does not support `\i`, paste the file contents directly.

4. Run selftest with the public anon key:

```bash
curl -sS 'https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/r2-logwatch?selftest=1' \
  -H 'Authorization: Bearer <SUPABASE_ANON_KEY>' \
  -H 'apikey: <SUPABASE_ANON_KEY>'
```

Expected: JSON with `would_alert: 1` and a `/api/mercy-ai` `r2_seed_provider_failed` signature.

5. Run a real invoke:

```bash
curl -sS 'https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/r2-logwatch' \
  -H 'Authorization: Bearer <SUPABASE_ANON_KEY>' \
  -H 'apikey: <SUPABASE_ANON_KEY>'
```

Expected: JSON with `sent: 1`, `alertable: 1`, and a new `r2_logwatch_alert_history` row. `admin@mercyblade.com` receives an email from `MercyBlade R2 Logwatch <admin@mercyblade.com>`.

6. Apply `supabase/migrations_manual/20260712090100_r2_logwatch_cron_15min.sql` in SQL Editor after replacing `<SUPABASE_ANON_KEY>` with the public anon key.

Expected: `pg_cron` invokes R2 every 15 minutes through `net.http_post`.
