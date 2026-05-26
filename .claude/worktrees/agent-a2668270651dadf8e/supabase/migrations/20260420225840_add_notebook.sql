-- =====================================================
-- Personal Notebook — per-user saved words & grammar points
-- =====================================================

create table if not exists public.user_notebook_items (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references public.profiles(id) on delete cascade,

  item_type text not null check (item_type in ('word', 'grammar')),
  content_en text not null,
  content_vi text,
  notes text,

  source text not null check (source in ('room', 'teacher', 'manual')),
  source_ref text,

  audio_url text,

  -- SM-2 spaced repetition state
  ease_factor numeric(4,2) not null default 2.5,
  interval_days integer not null default 0,
  repetitions integer not null default 0,
  review_count integer not null default 0,

  next_review_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- =====================================================
-- Indexes
-- =====================================================

create unique index if not exists user_notebook_items_user_type_content_uniq
  on public.user_notebook_items (user_id, item_type, lower(content_en));

create index if not exists user_notebook_items_user_due_idx
  on public.user_notebook_items (user_id, next_review_at);

create index if not exists user_notebook_items_user_created_idx
  on public.user_notebook_items (user_id, created_at desc);

-- =====================================================
-- Row Level Security
-- =====================================================

alter table public.user_notebook_items enable row level security;

drop policy if exists user_notebook_items_select_own on public.user_notebook_items;
drop policy if exists user_notebook_items_insert_own on public.user_notebook_items;
drop policy if exists user_notebook_items_update_own on public.user_notebook_items;
drop policy if exists user_notebook_items_delete_own on public.user_notebook_items;
drop policy if exists user_notebook_items_service_role on public.user_notebook_items;

create policy user_notebook_items_select_own
  on public.user_notebook_items
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy user_notebook_items_insert_own
  on public.user_notebook_items
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy user_notebook_items_update_own
  on public.user_notebook_items
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy user_notebook_items_delete_own
  on public.user_notebook_items
  for delete
  to authenticated
  using (auth.uid() = user_id);

create policy user_notebook_items_service_role
  on public.user_notebook_items
  for all
  to service_role
  using (true)
  with check (true);
