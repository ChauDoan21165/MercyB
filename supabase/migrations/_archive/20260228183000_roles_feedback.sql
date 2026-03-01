-- ============================================================
-- Roles + Feedback System (Idempotent Migration)
-- ============================================================

begin;

-- ------------------------------------------------------------
-- 1. Create app_role enum (if not exists)
-- ------------------------------------------------------------
do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'app_role'
      and n.nspname = 'public'
  ) then
    create type public.app_role as enum ('admin', 'user');
  end if;
end $$;


-- ------------------------------------------------------------
-- 2. Create user_roles table (if not exists)
-- ------------------------------------------------------------
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;


-- ------------------------------------------------------------
-- 3. Security definer role-check function
-- ------------------------------------------------------------
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;


-- ------------------------------------------------------------
-- 4. Create feedback table (if not exists)
-- ------------------------------------------------------------
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  message text not null,
  category text,
  priority text default 'normal',
  status text default 'new',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.feedback enable row level security;


-- ------------------------------------------------------------
-- 5. RLS Policies (drop + recreate for idempotency)
-- ------------------------------------------------------------

-- user_roles policies
drop policy if exists "Users can view their own roles" on public.user_roles;
create policy "Users can view their own roles"
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Admins can view all roles" on public.user_roles;
create policy "Admins can view all roles"
  on public.user_roles
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));


-- feedback policies
drop policy if exists "Users can insert their own feedback" on public.feedback;
create policy "Users can insert their own feedback"
  on public.feedback
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can view their own feedback" on public.feedback;
create policy "Users can view their own feedback"
  on public.feedback
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Admins can view all feedback" on public.feedback;
create policy "Admins can view all feedback"
  on public.feedback
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can update all feedback" on public.feedback;
create policy "Admins can update all feedback"
  on public.feedback
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));


-- ------------------------------------------------------------
-- 6. updated_at trigger function
-- ------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ------------------------------------------------------------
-- 7. Trigger (drop + recreate to stay idempotent)
-- ------------------------------------------------------------
drop trigger if exists set_feedback_updated_at on public.feedback;

create trigger set_feedback_updated_at
  before update on public.feedback
  for each row
  execute function public.handle_updated_at();


-- ------------------------------------------------------------
-- 8. Daily feedback summary view
-- ------------------------------------------------------------
create or replace view public.daily_feedback_summary as
select 
  date(created_at) as feedback_date,
  count(*) as total_feedback,
  count(*) filter (where priority = 'high')   as high_priority,
  count(*) filter (where priority = 'normal') as normal_priority,
  count(*) filter (where priority = 'low')    as low_priority,
  count(*) filter (where status = 'new')      as new_feedback
from public.feedback
group by date(created_at)
order by feedback_date desc;


commit;