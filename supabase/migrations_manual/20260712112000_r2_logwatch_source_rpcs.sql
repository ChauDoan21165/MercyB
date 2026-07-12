-- R2 LOGWATCH manual SQL: narrow public RPCs for cron/net sources.
-- Apply after the R2 tables SQL. This keeps cron and net schemas unexposed
-- to PostgREST while allowing the R2 edge function service-role client to
-- read only the fields it needs.

create or replace function public.r2_recent_cron_failures(window_start timestamptz)
returns table (
  job_name text,
  status text,
  return_message text,
  start_time timestamptz,
  end_time timestamptz
)
language sql
security definer
set search_path = ''
as $$
  select
    coalesce(j.jobname, d.jobid::text) as job_name,
    d.status,
    d.return_message,
    d.start_time,
    d.end_time
  from cron.job_run_details as d
  left join cron.job as j on j.jobid = d.jobid
  where d.start_time >= window_start
    and d.status <> 'succeeded'
  order by d.start_time desc
  limit 200
$$;

alter function public.r2_recent_cron_failures(timestamptz) owner to postgres;
revoke all on function public.r2_recent_cron_failures(timestamptz) from public;
revoke execute on function public.r2_recent_cron_failures(timestamptz) from anon, authenticated;
grant execute on function public.r2_recent_cron_failures(timestamptz) to service_role;

create or replace function public.r2_recent_http_errors(window_start timestamptz)
returns table (
  id bigint,
  status_code integer,
  created timestamptz,
  content text
)
language sql
security definer
set search_path = ''
as $$
  select
    r.id,
    r.status_code,
    r.created,
    left(r.content, 300) as content
  from net._http_response as r
  where r.created >= window_start
    and (r.status_code is null or r.status_code < 200 or r.status_code >= 300)
  order by r.created desc
  limit 200
$$;

alter function public.r2_recent_http_errors(timestamptz) owner to postgres;
revoke all on function public.r2_recent_http_errors(timestamptz) from public;
revoke execute on function public.r2_recent_http_errors(timestamptz) from anon, authenticated;
grant execute on function public.r2_recent_http_errors(timestamptz) to service_role;
