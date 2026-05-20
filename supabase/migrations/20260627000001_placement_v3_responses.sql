-- Placement v3 responses.
--
-- Additive only: does not touch v1 user_placements or v2 placement_* tables.
-- Responses are append-only for authenticated clients. AI assessment fields
-- are service_role-owned.

create table if not exists public.placement_v3_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.placement_v3_sessions(id) on delete cascade,
  task_index integer not null check (task_index >= 0),
  modality text not null check (
    modality in ('writing', 'speaking', 'reading', 'listening', 'conversation')
  ),
  prompt_id text not null,
  prompt_text text not null,
  user_response_text text,
  audio_storage_path text,
  response_duration_ms integer check (
    response_duration_ms is null or response_duration_ms >= 0
  ),
  ai_assessment jsonb,
  ai_assessment_version text,
  graded_at timestamptz,
  created_at timestamptz not null default now()
);

comment on table public.placement_v3_responses is
  'Placement v3: append-only learner responses. ai_assessment stores the grader CEFRAssessment payload and is written by service_role only.';

create index if not exists idx_responses_session_id
  on public.placement_v3_responses (session_id);

create index if not exists idx_responses_session_task
  on public.placement_v3_responses (session_id, task_index);
