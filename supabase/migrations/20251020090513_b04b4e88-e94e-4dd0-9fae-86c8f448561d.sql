-- Create app_role enum for user roles
create type public.app_role as enum ('admin', 'user');

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamp with time zone default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Create security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
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
  )
$$;

-- Create feedback table
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  message text not null,
  category text,
  priority text default 'normal',
  status text default 'new',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.feedback enable row level security;

-- RLS policies for user_roles
create policy "Users can view their own roles"
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- RLS policies for feedback
create policy "Users can insert their own feedback"
  on public.feedback
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can view their own feedback"
  on public.feedback
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Admins can view all feedback"
  on public.feedback
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update all feedback"
  on public.feedback
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for feedback updated_at
create trigger set_feedback_updated_at
  before update on public.feedback
  for each row
  execute function public.handle_updated_at();

-- Create a view for daily feedback summary (admins only)
create or replace view public.daily_feedback_summary as
select 
  date(created_at) as feedback_date,
  count(*) as total_feedback,
  count(*) filter (where priority = 'high') as high_priority,
  count(*) filter (where priority = 'normal') as normal_priority,
  count(*) filter (where priority = 'low') as low_priority,
  count(*) filter (where status = 'new') as new_feedback
from public.feedback
group by date(created_at)
order by feedback_date desc;