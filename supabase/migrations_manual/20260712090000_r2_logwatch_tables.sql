-- R2 LOGWATCH manual SQL: source + alert history tables.
-- Apply in Supabase SQL Editor after merge, before deploying r2-logwatch.

create extension if not exists pgcrypto;

-- Source table watched first by R2. MR !2627 currently writes structured
-- console JSON, not DB rows; this table gives R2 a durable source once a
-- producer/log-drain writes those same safe fields.
create table if not exists public.function_failure_logs (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  event       text not null check (event in ('function_failure', 'edge_function_failure')),
  route       text not null,
  mode        text null,
  status      integer not null,
  error_class text not null,
  request_id  text null,
  user_id     uuid null,
  detail      jsonb not null default '{}'::jsonb
);

create index if not exists function_failure_logs_created_idx
  on public.function_failure_logs (created_at desc);

create index if not exists function_failure_logs_status_created_idx
  on public.function_failure_logs (status, created_at desc);

alter table public.function_failure_logs enable row level security;
revoke all on public.function_failure_logs from anon, authenticated;
grant all on public.function_failure_logs to service_role;

comment on table public.function_failure_logs is
  'R2 LOGWATCH durable server failure source. Browser roles cannot read or write.';

create table if not exists public.r2_logwatch_alert_history (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  signature_key     text not null,
  source            text not null,
  provider          text not null,
  route             text null,
  mode              text null,
  status            integer null,
  error_class       text not null,
  window_started_at timestamptz not null,
  window_ended_at   timestamptz not null,
  first_seen_at     timestamptz not null,
  last_seen_at      timestamptz not null,
  event_count       integer not null default 0,
  email_sent        boolean not null default false,
  diagnosis         text null
);

create unique index if not exists r2_logwatch_alert_history_signature_window_uidx
  on public.r2_logwatch_alert_history (signature_key, window_started_at);

create index if not exists r2_logwatch_alert_history_created_idx
  on public.r2_logwatch_alert_history (created_at desc);

alter table public.r2_logwatch_alert_history enable row level security;
revoke all on public.r2_logwatch_alert_history from anon, authenticated;
grant all on public.r2_logwatch_alert_history to service_role;

comment on table public.r2_logwatch_alert_history is
  'R2 LOGWATCH alert dedupe history. Service-role only.';
