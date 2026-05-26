-- ============================================================
-- Roles + Feedback System (Hardened + Idempotent + CI-safe)
-- - admin-only daily summary
-- - first user bootstrap admin
-- - stricter constraints + indexes
-- ============================================================

begin;

-- ------------------------------------------------------------
-- 0) Extensions (gen_random_uuid)
-- ------------------------------------------------------------
create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- 1) Enums (idempotent)
-- ------------------------------------------------------------
do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'app_role' and n.nspname = 'public'
  ) then
    create type public.app_role as enum ('admin', 'user');
  end if;

  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'feedback_priority' and n.nspname = 'public'
  ) then
    create type public.feedback_priority as enum ('low', 'normal', 'high');
  end if;

  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where t.typname = 'feedback_status' and n.nspname = 'public'
  ) then
    create type public.feedback_status as enum ('new', 'triaged', 'in_progress', 'done');
  end if;
end $$;


-- ------------------------------------------------------------
-- 2) user_roles table
-- ------------------------------------------------------------
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;


-- ------------------------------------------------------------
-- 3) Role check function
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
-- 4) feedback table (hardened types + constraints)
-- ------------------------------------------------------------
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  message text not null,
  category text,
  priority public.feedback_priority not null default 'normal',
  status public.feedback_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

-- message should not be empty/whitespace
alter table public.feedback
  drop constraint if exists feedback_message_not_blank,
  add constraint feedback_message_not_blank
  check (length(btrim(message)) > 0);

-- optional: keep category sane
alter table public.feedback
  drop constraint if exists feedback_category_len,
  add constraint feedback_category_len
  check (category is null or length(category) <= 100);


-- ------------------------------------------------------------
-- 5) RLS policies (drop + recreate)
-- ------------------------------------------------------------

-- user_roles
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

-- feedback
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
-- 6) updated_at trigger function + trigger (idempotent)
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

drop trigger if exists set_feedback_updated_at on public.feedback;
create trigger set_feedback_updated_at
  before update on public.feedback
  for each row
  execute function public.handle_updated_at();


-- ------------------------------------------------------------
-- 7) Admin-only daily feedback summary “RLS” gating
--    (Views don't have RLS; we gate rows using has_role(auth.uid(),'admin'))
-- ------------------------------------------------------------
create or replace view public.daily_feedback_summary as
select
  date(f.created_at) as feedback_date,
  count(*) as total_feedback,
  count(*) filter (where f.priority = 'high')   as high_priority,
  count(*) filter (where f.priority = 'normal') as normal_priority,
  count(*) filter (where f.priority = 'low')    as low_priority,
  count(*) filter (where f.status = 'new')      as new_feedback
from public.feedback f
where public.has_role(auth.uid(), 'admin')
group by date(f.created_at)
order by feedback_date desc;


-- ------------------------------------------------------------
-- 8) Default admin bootstrap (first user becomes admin)
--    - Runs when a new auth.users row is created
--    - If no admins exist yet, assign admin to that user
-- ------------------------------------------------------------
create or replace function public.assign_first_user_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- If no admin exists yet, make this user the admin.
  if not exists (
    select 1 from public.user_roles where role = 'admin'
  ) then
    insert into public.user_roles (user_id, role)
    values (new.id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;

  return new;
end;
$$;

-- Create trigger on auth.users (idempotent)
do $$
begin
  if exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'auth' and c.relname = 'users'
  ) then
    -- drop/recreate trigger safely
    execute 'drop trigger if exists on_auth_user_created_assign_admin on auth.users;';
    execute 'create trigger on_auth_user_created_assign_admin
             after insert on auth.users
             for each row
             execute function public.assign_first_user_admin();';
  end if;
end $$;


-- ------------------------------------------------------------
-- 9) Indexes (performance)
-- ------------------------------------------------------------
create index if not exists idx_user_roles_user_id on public.user_roles(user_id);
create index if not exists idx_user_roles_role on public.user_roles(role);

create index if not exists idx_feedback_user_id on public.feedback(user_id);
create index if not exists idx_feedback_created_at on public.feedback(created_at desc);
create index if not exists idx_feedback_status on public.feedback(status);
create index if not exists idx_feedback_priority on public.feedback(priority);

-- Helpful for admin triage dashboard queries:
create index if not exists idx_feedback_new_high on public.feedback(created_at desc)
  where status = 'new' and priority = 'high';

commit;