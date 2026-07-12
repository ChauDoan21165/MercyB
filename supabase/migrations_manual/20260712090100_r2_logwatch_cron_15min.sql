-- R2 LOGWATCH manual SQL: 15-minute pg_cron schedule.
-- Apply in Supabase SQL Editor after tables are applied and r2-logwatch is deployed.
-- Replace <SUPABASE_ANON_KEY> with the public anon key before running.

create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'r2-logwatch-15min') then
    perform cron.unschedule('r2-logwatch-15min');
  end if;
end $$;

select cron.schedule(
  'r2-logwatch-15min',
  '*/15 * * * *',
  $$
  select net.http_post(
    url := 'https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/r2-logwatch',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <SUPABASE_ANON_KEY>',
      'apikey', '<SUPABASE_ANON_KEY>'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 30000
  );
  $$
);
