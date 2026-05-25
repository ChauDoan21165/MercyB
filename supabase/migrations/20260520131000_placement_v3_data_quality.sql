-- Placement V3 data-quality audit persistence.
-- Additive only; intended for human review before applying.

create table if not exists public.placement_v3_integrity_runs (
  id uuid primary key default gen_random_uuid(),
  run_id text not null unique,
  status text not null default 'complete'
    check (status in ('running','complete','blocked','failed')),
  command text not null,
  audit_kinds text[] not null default '{}',
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  total_issues int not null default 0,
  blocker_count int not null default 0,
  error_count int not null default 0,
  warning_count int not null default 0,
  info_count int not null default 0,
  missing_required_surfaces text[] not null default '{}',
  changed_files text[] not null default '{}',
  raw_output_path text
);

create table if not exists public.placement_v3_integrity_issues (
  id uuid primary key default gen_random_uuid(),
  run_id text not null references public.placement_v3_integrity_runs(run_id) on delete cascade,
  issue_key text not null,
  audit_kind text not null,
  category text not null,
  severity text not null check (severity in ('info','warning','error','blocker')),
  file_path text not null,
  message text not null,
  evidence jsonb not null default '{}'::jsonb,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (run_id, issue_key)
);

create table if not exists public.placement_v3_taxonomy_issues (
  id uuid primary key default gen_random_uuid(),
  run_id text not null references public.placement_v3_integrity_runs(run_id) on delete cascade,
  issue_key text not null,
  category text not null,
  severity text not null check (severity in ('info','warning','error','blocker')),
  taxonomy_id text,
  file_path text not null,
  message text not null,
  evidence jsonb not null default '{}'::jsonb,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (run_id, issue_key)
);

create table if not exists public.placement_v3_recommendation_issues (
  id uuid primary key default gen_random_uuid(),
  run_id text not null references public.placement_v3_integrity_runs(run_id) on delete cascade,
  issue_key text not null,
  category text not null,
  severity text not null check (severity in ('info','warning','error','blocker')),
  source_id text,
  target_id text,
  file_path text not null,
  message text not null,
  evidence jsonb not null default '{}'::jsonb,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (run_id, issue_key)
);

create table if not exists public.placement_v3_alignment_issues (
  id uuid primary key default gen_random_uuid(),
  run_id text not null references public.placement_v3_integrity_runs(run_id) on delete cascade,
  issue_key text not null,
  category text not null,
  severity text not null check (severity in ('info','warning','error','blocker')),
  prompt_id text,
  rubric_id text,
  file_path text not null,
  message text not null,
  evidence jsonb not null default '{}'::jsonb,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  unique (run_id, issue_key)
);

create index if not exists idx_pv3_integrity_issues_run
  on public.placement_v3_integrity_issues (run_id, severity, category);
create index if not exists idx_pv3_taxonomy_issues_run
  on public.placement_v3_taxonomy_issues (run_id, severity, category);
create index if not exists idx_pv3_recommendation_issues_run
  on public.placement_v3_recommendation_issues (run_id, severity, category);
create index if not exists idx_pv3_alignment_issues_run
  on public.placement_v3_alignment_issues (run_id, severity, category);

alter table public.placement_v3_integrity_runs enable row level security;
alter table public.placement_v3_integrity_issues enable row level security;
alter table public.placement_v3_taxonomy_issues enable row level security;
alter table public.placement_v3_recommendation_issues enable row level security;
alter table public.placement_v3_alignment_issues enable row level security;

drop policy if exists "pv3_integrity_runs_admin_read" on public.placement_v3_integrity_runs;
create policy "pv3_integrity_runs_admin_read"
  on public.placement_v3_integrity_runs
  for select to authenticated
  using (public.get_admin_level() >= 9);

drop policy if exists "pv3_integrity_issues_admin_read" on public.placement_v3_integrity_issues;
create policy "pv3_integrity_issues_admin_read"
  on public.placement_v3_integrity_issues
  for select to authenticated
  using (public.get_admin_level() >= 9);

drop policy if exists "pv3_taxonomy_issues_admin_read" on public.placement_v3_taxonomy_issues;
create policy "pv3_taxonomy_issues_admin_read"
  on public.placement_v3_taxonomy_issues
  for select to authenticated
  using (public.get_admin_level() >= 9);

drop policy if exists "pv3_recommendation_issues_admin_read" on public.placement_v3_recommendation_issues;
create policy "pv3_recommendation_issues_admin_read"
  on public.placement_v3_recommendation_issues
  for select to authenticated
  using (public.get_admin_level() >= 9);

drop policy if exists "pv3_alignment_issues_admin_read" on public.placement_v3_alignment_issues;
create policy "pv3_alignment_issues_admin_read"
  on public.placement_v3_alignment_issues
  for select to authenticated
  using (public.get_admin_level() >= 9);
