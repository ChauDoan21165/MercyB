-- =====================================================
-- Mercy Blade Speech Attempts Table (V2 - Regional Aware)
-- =====================================================

create table if not exists public.speech_attempts (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references auth.users(id) on delete cascade,

  room_id text not null,
  line_id text not null,
  tier_level text, -- FREE, VIP1, VIP2, VIP3 (Captured for billing/metrics)

  target_text text not null,
  transcript text,
  normalized_target text,
  normalized_transcript text,

  match_score numeric(5,4), -- 0.0000 to 1.0000

  -- Phoneme & Regional Feedback
  error_code text, -- e.g., 'MISSING_FINAL_S', 'R_Z_CONFUSION'
  user_origin text, -- 'HANOI', 'SAIGON', or 'OTHER' (Captured at time of attempt)
  
  missing_words text[] default '{}',
  extra_words text[] default '{}',

  feedback_message text, -- The specific regional remediation text used
  audio_path text, -- Path in Supabase Storage

  created_at timestamptz not null default now()
);

-- =====================================================
-- Indexes
-- =====================================================

create index if not exists speech_attempts_user_id_idx
on public.speech_attempts(user_id);

create index if not exists speech_attempts_room_id_idx
on public.speech_attempts(room_id);

-- Optimized for Heatmaps and 90-Day Plan trends
create index if not exists speech_attempts_error_analysis_idx
on public.speech_attempts(user_id, error_code, created_at desc);

create index if not exists speech_attempts_created_at_idx
on public.speech_attempts(created_at desc);

-- =====================================================
-- Enable Row Level Security
-- =====================================================

alter table public.speech_attempts enable row level security;

-- =====================================================
-- Policies (Safe Recreate)
-- =====================================================

drop policy if exists speech_attempts_select_own on public.speech_attempts;
drop policy if exists speech_attempts_insert_own on public.speech_attempts;
drop policy if exists speech_attempts_service_role on public.speech_attempts;

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

-- Essential for Edge Functions to bypass RLS for aggregate analytics
create policy speech_attempts_service_role
on public.speech_attempts
for all
to service_role
using (true)
with check (true);