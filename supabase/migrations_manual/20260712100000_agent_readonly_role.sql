-- One-time Supabase access-tier role setup.
-- Chau applies this manually in SQL Editor.

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'agent_readonly') then
    create role agent_readonly login;
  end if;
end $$;

grant usage on schema public to agent_readonly;
grant usage on schema net to agent_readonly;
grant usage on schema cron to agent_readonly;

do $$
begin
  if to_regclass('public.client_errors') is not null then
    grant select on public.client_errors to agent_readonly;
  end if;

  if to_regclass('public.function_failure_logs') is not null then
    grant select on public.function_failure_logs to agent_readonly;
  end if;

  if to_regclass('public.client_error_alert_history') is not null then
    grant select on public.client_error_alert_history to agent_readonly;
  end if;

  if to_regclass('public.r2_logwatch_alert_history') is not null then
    grant select on public.r2_logwatch_alert_history to agent_readonly;
  end if;

  if to_regclass('public.perf_alert_history') is not null then
    grant select on public.perf_alert_history to agent_readonly;
  end if;

  if to_regclass('public.alert_history') is not null then
    grant select on public.alert_history to agent_readonly;
  end if;

  if to_regclass('net._http_response') is not null then
    grant select on net._http_response to agent_readonly;
  end if;

  if to_regclass('cron.job') is not null then
    grant select on cron.job to agent_readonly;
  end if;

  if to_regclass('cron.job_run_details') is not null then
    grant select on cron.job_run_details to agent_readonly;
  end if;
end $$;

comment on role agent_readonly is
  'Read-only agent diagnostics role. SELECT-only ops surface; use via pooler.';
