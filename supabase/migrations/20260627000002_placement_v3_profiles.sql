-- Placement v3 profiles.
--
-- Additive only: does not touch v1 user_placements or v2 placement_* tables.
-- Profiles are computed by service_role after grading/calibration.

create table if not exists public.placement_v3_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.placement_v3_sessions(id) on delete cascade,
  cefr_overall text not null check (
    cefr_overall in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')
  ),
  cefr_overall_confidence numeric(3,2) not null check (
    cefr_overall_confidence >= 0.00 and cefr_overall_confidence <= 1.00
  ),
  cefr_per_skill jsonb not null,
  l1_interference_flags jsonb not null default '[]'::jsonb,
  strengths jsonb not null default '[]'::jsonb,
  gaps jsonb not null default '[]'::jsonb,
  recommended_lessons jsonb not null default '[]'::jsonb,
  computed_at timestamptz not null default now(),
  is_current boolean not null default true,
  created_at timestamptz not null default now(),
  constraint uniq_profiles_user_session unique (user_id, session_id)
);

comment on table public.placement_v3_profiles is
  'Placement v3: computed CEFR profile and recommendations for a completed placement session. Authenticated users can read only their own rows.';

create index if not exists idx_profiles_user_current
  on public.placement_v3_profiles (user_id)
  where is_current = true;
