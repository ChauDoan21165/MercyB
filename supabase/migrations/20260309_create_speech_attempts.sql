-- =====================================================
-- Mercy Blade Speech Attempts Table
-- =====================================================

create table if not exists public.speech_attempts (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null,

  room_id text not null,
  line_id text not null,

  target_text text not null,

  transcript text,
  normalized_target text,
  normalized_transcript text,

  match_score numeric(5,4),

  missing_words text[] default '{}',
  extra_words text[] default '{}',

  feedback_message text,

  audio_path text,

  created_at timestamptz not null default now()
);

-- =====================================================
-- Indexes
-- =====================================================

create index if not exists speech_attempts_user_id_idx
on public.speech_attempts(user_id);

create index if not exists speech_attempts_room_id_idx
on public.speech_attempts(room_id);

create index if not exists speech_attempts_line_id_idx
on public.speech_attempts(line_id);

create index if not exists speech_attempts_created_at_idx
on public.speech_attempts(created_at desc);

-- =====================================================
-- Enable Row Level Security
-- =====================================================

alter table public.speech_attempts enable row level security;

-- =====================================================
-- Policies (safe recreate)
-- =====================================================

drop policy if exists speech_attempts_select_own
on public.speech_attempts;

drop policy if exists speech_attempts_insert_own
on public.speech_attempts;

create policy speech_attempts_select_own
on public.speech_attempts
for select
to authenticated
using (auth.uid() = user_id);

create policy speech_attempts_insert_own
on public.speech_attempts
for insert
to authenticated
with check (auth.uid() = user_id);

-- =====================================================
-- Optional: allow service role full access
-- =====================================================

drop policy if exists speech_attempts_service_role
on public.speech_attempts;

create policy speech_attempts_service_role
on public.speech_attempts
for all
to service_role
using (true)
with check (true);