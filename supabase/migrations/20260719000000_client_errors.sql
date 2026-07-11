-- R1 SENTINEL phase 1 — client-side error telemetry.
--
-- OUTPUT ONLY. Apply MANUALLY via the Supabase SQL Editor or the psql pooler.
-- Do NOT run `supabase db push`.
--
-- Stores only normalized client error metadata: route, uid-if-any, build sha,
-- endpoint, status, method, duration, and a scrubbed error signature. It must
-- never store learner text, audio, transcripts, request bodies, response bodies,
-- stack traces, cookies, authorization headers, or query-string payloads.

create extension if not exists "pgcrypto";

create table if not exists public.client_errors (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  client_ts       timestamptz,
  route           text not null default '/',
  user_id         uuid null,
  build_sha       text null,
  endpoint        text null,
  status          integer null,
  method          text null,
  duration_ms     integer null,
  error_signature text not null,
  error_kind      text not null,
  source          text not null default 'r1-sentinel',

  constraint client_errors_user_id_fkey
    foreign key (user_id) references auth.users (id) on delete set null,
  constraint client_errors_status_chk
    check (status is null or (status >= 0 and status <= 599)),
  constraint client_errors_error_kind_chk
    check (error_kind in ('api', 'js', 'unhandledrejection')),
  constraint client_errors_no_oversized_fields_chk
    check (
      length(route) <= 300
      and (build_sha is null or length(build_sha) <= 80)
      and (endpoint is null or length(endpoint) <= 500)
      and (method is null or length(method) <= 16)
      and length(error_signature) <= 500
      and length(source) <= 40
    )
);

create index if not exists client_errors_created_idx
  on public.client_errors (created_at desc);

create index if not exists client_errors_signature_window_idx
  on public.client_errors (error_signature, status, created_at desc)
  where status >= 500;

create index if not exists client_errors_user_created_idx
  on public.client_errors (user_id, created_at desc)
  where user_id is not null;

comment on table public.client_errors is
  'R1 SENTINEL client error metadata only. No learner text/audio/transcripts, request bodies, response bodies, stacks, cookies, auth headers, or query strings.';

comment on column public.client_errors.error_signature is
  'Scrubbed normalized signature such as "api:POST /api/mercy-ai -> 502" or "js:TypeError"; never raw learner content or stack traces.';

alter table public.client_errors enable row level security;

drop policy if exists client_errors_anon_insert on public.client_errors;
create policy client_errors_anon_insert
  on public.client_errors
  for insert
  to anon
  with check (user_id is null);

drop policy if exists client_errors_auth_insert on public.client_errors;
create policy client_errors_auth_insert
  on public.client_errors
  for insert
  to authenticated
  with check (user_id is null or user_id = auth.uid());

revoke all on public.client_errors from anon, authenticated;
grant insert on public.client_errors to anon, authenticated;

-- Interim R1 alert dedupe table. Read/write is service-role only through the
-- client-error-alert Edge Function; no browser access.
create table if not exists public.client_error_alert_history (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  signature_key     text not null,
  error_signature   text not null,
  route             text null,
  endpoint          text null,
  status            integer null,
  build_sha         text null,
  window_started_at timestamptz not null,
  window_ended_at   timestamptz not null,
  real_user_count   integer not null default 0,
  event_count       integer not null default 0,
  email_sent        boolean not null default false,
  diagnosis         text null
);

create unique index if not exists client_error_alert_history_signature_window_uidx
  on public.client_error_alert_history (signature_key, window_started_at);

create index if not exists client_error_alert_history_created_idx
  on public.client_error_alert_history (created_at desc);

alter table public.client_error_alert_history enable row level security;
revoke all on public.client_error_alert_history from anon, authenticated;

comment on table public.client_error_alert_history is
  'R1 SENTINEL interim alert dedupe history. Service-role only.';
