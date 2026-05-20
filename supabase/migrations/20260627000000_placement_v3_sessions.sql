-- Placement v3 sessions.
--
-- Additive only: does not touch v1 user_placements or v2 placement_* tables.
-- Placement v3 requires auth. anon receives no grants. service_role receives
-- full table privileges and bypasses RLS for edge-function orchestration.

create table if not exists public.placement_v3_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  abandoned_at timestamptz,
  current_modality text check (
    current_modality is null
    or current_modality in ('writing', 'speaking', 'reading', 'listening', 'conversation')
  ),
  current_task_index integer not null default 0 check (current_task_index >= 0),
  total_tasks integer check (total_tasks is null or total_tasks >= 0),
  language_pair jsonb not null check (
    jsonb_typeof(language_pair) = 'object'
    and language_pair ? 'native'
    and language_pair ? 'target'
  ),
  flow_state text not null default 'in_progress' check (
    flow_state in ('in_progress', 'completed', 'abandoned', 'error')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.placement_v3_sessions is
  'Placement v3: one row per DET-class placement attempt. Authenticated owner read/insert/limited update; service_role owns grading/orchestration.';

comment on column public.placement_v3_sessions.language_pair is
  'Learner pair, e.g. {"native":"vi","target":"en"}. Kept jsonb for future pair matrix expansion.';

create index if not exists idx_sessions_user_id
  on public.placement_v3_sessions (user_id);

create index if not exists idx_sessions_flow_state
  on public.placement_v3_sessions (flow_state)
  where flow_state in ('in_progress');

create index if not exists idx_sessions_started_at
  on public.placement_v3_sessions (started_at desc);
