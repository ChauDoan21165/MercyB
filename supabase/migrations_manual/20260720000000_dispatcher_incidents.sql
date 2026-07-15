-- Dispatcher incident triage tables.
-- File-output only for Admin1 dispatcher MR. Do not apply without Chau's SQL gate.

create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  incident_key text not null unique,
  signature text not null,
  status text not null default 'open'
    check (status in ('open', 'acknowledged', 'resolved')),
  severity text not null
    check (severity in ('critical', 'high', 'medium', 'low', 'info')),
  summary text not null,
  evidence_url text,
  robots text[] not null default '{}',
  event_count integer not null default 0 check (event_count >= 0),
  below_alert_threshold boolean not null default false,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  email_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.error_events (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid references public.incidents(id) on delete set null,
  robot text not null,
  severity text not null
    check (severity in ('critical', 'high', 'medium', 'low', 'info')),
  signature text not null,
  incident_key text not null,
  summary text not null,
  evidence_url text,
  occurred_at timestamptz not null default now(),
  below_alert_threshold boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.error_signatures (
  signature text primary key,
  incident_key text not null,
  last_robot text not null,
  last_severity text not null
    check (last_severity in ('critical', 'high', 'medium', 'low', 'info')),
  last_summary text not null,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.alert_threads (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid references public.incidents(id) on delete set null,
  thread_type text not null check (thread_type in ('incident', 'daily_digest')),
  subject text not null,
  email_sent boolean not null default false,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.dispatcher_alert_history (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid references public.incidents(id) on delete set null,
  event_id uuid references public.error_events(id) on delete set null,
  alert_type text not null check (alert_type in ('incident', 'daily_digest')),
  robot text not null,
  signature text not null,
  severity text not null
    check (severity in ('critical', 'high', 'medium', 'low', 'info')),
  email_sent boolean not null default false,
  subject text not null,
  created_at timestamptz not null default now()
);

create index if not exists error_events_incident_key_created_idx
  on public.error_events (incident_key, created_at desc);

create index if not exists error_events_below_threshold_occurred_idx
  on public.error_events (occurred_at desc)
  where below_alert_threshold = true;

create index if not exists incidents_status_last_seen_idx
  on public.incidents (status, last_seen_at desc);

create index if not exists dispatcher_alert_history_incident_created_idx
  on public.dispatcher_alert_history (incident_id, created_at desc);

alter table public.incidents enable row level security;
alter table public.error_events enable row level security;
alter table public.error_signatures enable row level security;
alter table public.alert_threads enable row level security;
alter table public.dispatcher_alert_history enable row level security;

drop policy if exists "dispatcher service role incidents all" on public.incidents;
create policy "dispatcher service role incidents all"
  on public.incidents for all to service_role
  using (true) with check (true);

drop policy if exists "dispatcher service role error_events all" on public.error_events;
create policy "dispatcher service role error_events all"
  on public.error_events for all to service_role
  using (true) with check (true);

drop policy if exists "dispatcher service role error_signatures all" on public.error_signatures;
create policy "dispatcher service role error_signatures all"
  on public.error_signatures for all to service_role
  using (true) with check (true);

drop policy if exists "dispatcher service role alert_threads all" on public.alert_threads;
create policy "dispatcher service role alert_threads all"
  on public.alert_threads for all to service_role
  using (true) with check (true);

drop policy if exists "dispatcher service role alert_history all" on public.dispatcher_alert_history;
create policy "dispatcher service role alert_history all"
  on public.dispatcher_alert_history for all to service_role
  using (true) with check (true);

revoke all on public.incidents from anon, authenticated;
revoke all on public.error_events from anon, authenticated;
revoke all on public.error_signatures from anon, authenticated;
revoke all on public.alert_threads from anon, authenticated;
revoke all on public.dispatcher_alert_history from anon, authenticated;
