-- v2 hardened SaaS baseline: roles, feedback, admin bootstrap, audit logs
-- This migration is written to be idempotent for CI (safe to run multiple times).

begin;

--------------------------------------------------------------------------------
-- Extensions
--------------------------------------------------------------------------------
create extension if not exists pgcrypto;
create extension if not exists citext;

--------------------------------------------------------------------------------
-- 1) Roles (app_role + user_roles) + hardened policies
--------------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1 from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'app_role'
  ) then
    create type public.app_role as enum ('admin', 'user');
  end if;
end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  -- one row per user/role
  unique (user_id, role)
);

-- NEW: If user_roles existed already, ensure created_by exists (CREATE TABLE IF NOT EXISTS won't add it)
do $$
begin
  if to_regclass('public.user_roles') is not null then
    if not exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'user_roles' and column_name = 'created_by'
    ) then
      alter table public.user_roles
        add column created_by uuid references auth.users(id) on delete set null;
    end if;
  end if;
end $$;

-- helpful indexes
create index if not exists user_roles_user_id_idx on public.user_roles(user_id);
create index if not exists user_roles_role_idx on public.user_roles(role);
create index if not exists user_roles_created_at_idx on public.user_roles(created_at);

alter table public.user_roles enable row level security;

-- Helper: has_role(user, role)
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

-- NEW: Ensure created_by is set on insert (so clients don't have to send it)
create or replace function public.handle_user_roles_created_by()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.created_by is null then
      new.created_by := auth.uid();
    end if;
    return new;
  end if;

  return new;
end;
$$;

drop trigger if exists set_user_roles_created_by on public.user_roles;
create trigger set_user_roles_created_by
before insert on public.user_roles
for each row
execute function public.handle_user_roles_created_by();

-- Remove old policies if they exist (idempotent)
drop policy if exists "Users can view their own roles" on public.user_roles;
drop policy if exists "Admins can view all roles" on public.user_roles;
drop policy if exists "Admins can manage roles" on public.user_roles;
drop policy if exists "Admins can insert roles" on public.user_roles;
drop policy if exists "Admins can update roles" on public.user_roles;
drop policy if exists "Admins can delete roles" on public.user_roles;

-- Read: users can see their own roles; admins can see all
create policy "Users can view their own roles"
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Admins can view all roles"
  on public.user_roles
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Write: only admins can insert/update/delete roles
create policy "Admins can insert roles"
  on public.user_roles
  for insert
  to authenticated
  with check (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    -- NEW: allow NULL because trigger will set it; still allow explicit self-set
    and (created_by is null or created_by = auth.uid())
  );

create policy "Admins can update roles"
  on public.user_roles
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role))
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "Admins can delete roles"
  on public.user_roles
  for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Guardrails:
--  - Users cannot delete their own admin role (even if they are admin).
--  - Prevent deleting the last remaining admin.
create or replace function public.prevent_admin_self_or_last_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_count int;
begin
  if old.role = 'admin' then
    -- prevent self-delete
    if auth.uid() is not null and old.user_id = auth.uid() then
      raise exception 'Cannot delete your own admin role';
    end if;

    -- prevent deleting last admin
    select count(*) into admin_count
    from public.user_roles
    where role = 'admin';

    if admin_count <= 1 then
      raise exception 'Cannot delete the last admin role';
    end if;
  end if;

  return old;
end;
$$;

drop trigger if exists trg_prevent_admin_self_or_last_delete on public.user_roles;
create trigger trg_prevent_admin_self_or_last_delete
before delete on public.user_roles
for each row
execute function public.prevent_admin_self_or_last_delete();

--------------------------------------------------------------------------------
-- 2) Audit log for role changes
--------------------------------------------------------------------------------

create table if not exists public.role_audit_log (
  id uuid primary key default gen_random_uuid(),
  action text not null check (action in ('grant', 'revoke', 'update')),
  actor_user_id uuid references auth.users(id) on delete set null,
  target_user_id uuid references auth.users(id) on delete cascade,
  role public.app_role,
  -- request context (works for API calls; may be null for SQL editor)
  actor_jwt_role text,
  actor_ip inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists role_audit_log_target_idx on public.role_audit_log(target_user_id, created_at desc);
create index if not exists role_audit_log_actor_idx on public.role_audit_log(actor_user_id, created_at desc);

alter table public.role_audit_log enable row level security;

drop policy if exists "Admins can view role audit logs" on public.role_audit_log;
create policy "Admins can view role audit logs"
  on public.role_audit_log
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role));

-- No one should write directly; only trigger (SECURITY DEFINER) writes
revoke insert, update, delete on public.role_audit_log from anon, authenticated;

create or replace function public.log_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text;
  v_actor uuid;
begin
  v_actor := auth.uid();

  if tg_op = 'INSERT' then
    v_action := 'grant';
    insert into public.role_audit_log(action, actor_user_id, target_user_id, role, actor_jwt_role, actor_ip, user_agent)
    values (
      v_action,
      v_actor,
      new.user_id,
      new.role,
      current_setting('request.jwt.claim.role', true),
      nullif(current_setting('request.headers.x-real-ip', true), '')::inet,
      nullif(current_setting('request.headers.user-agent', true), '')
    );
    return new;
  elsif tg_op = 'DELETE' then
    v_action := 'revoke';
    insert into public.role_audit_log(action, actor_user_id, target_user_id, role, actor_jwt_role, actor_ip, user_agent)
    values (
      v_action,
      v_actor,
      old.user_id,
      old.role,
      current_setting('request.jwt.claim.role', true),
      nullif(current_setting('request.headers.x-real-ip', true), '')::inet,
      nullif(current_setting('request.headers.user-agent', true), '')
    );
    return old;
  else
    v_action := 'update';
    insert into public.role_audit_log(action, actor_user_id, target_user_id, role, actor_jwt_role, actor_ip, user_agent)
    values (
      v_action,
      v_actor,
      new.user_id,
      new.role,
      current_setting('request.jwt.claim.role', true),
      nullif(current_setting('request.headers.x-real-ip', true), '')::inet,
      nullif(current_setting('request.headers.user-agent', true), '')
    );
    return new;
  end if;
end;
$$;

drop trigger if exists trg_log_role_change_insert on public.user_roles;
drop trigger if exists trg_log_role_change_delete on public.user_roles;
drop trigger if exists trg_log_role_change_update on public.user_roles;

create trigger trg_log_role_change_insert
after insert on public.user_roles
for each row execute function public.log_role_change();

create trigger trg_log_role_change_delete
after delete on public.user_roles
for each row execute function public.log_role_change();

create trigger trg_log_role_change_update
after update on public.user_roles
for each row execute function public.log_role_change();

--------------------------------------------------------------------------------
-- 3) Feedback table (created_by) + hardened constraints/indexes
--------------------------------------------------------------------------------

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  message text not null check (length(message) between 1 and 5000),
  category text,
  priority text not null default 'normal' check (priority in ('low','normal','high')),
  status text not null default 'new' check (status in ('new','triaged','in_progress','resolved','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- If feedback existed already, ensure created_by column exists (idempotent)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='feedback' and column_name='created_by'
  ) then
    alter table public.feedback add column created_by uuid references auth.users(id) on delete set null;
  end if;
end $$;

create index if not exists feedback_user_id_created_at_idx on public.feedback(user_id, created_at desc);
create index if not exists feedback_created_at_idx on public.feedback(created_at desc);
create index if not exists feedback_status_priority_idx on public.feedback(status, priority);

alter table public.feedback enable row level security;

-- updated_at trigger + created_by on insert
create or replace function public.handle_feedback_timestamps()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if new.created_by is null then
      new.created_by := auth.uid();
    end if;
    if new.user_id is null then
      new.user_id := auth.uid();
    end if;
    new.updated_at := now();
    return new;
  end if;

  if tg_op = 'UPDATE' then
    new.updated_at := now();
    return new;
  end if;

  return new;
end;
$$;

drop trigger if exists set_feedback_timestamps on public.feedback;
create trigger set_feedback_timestamps
before insert or update on public.feedback
for each row
execute function public.handle_feedback_timestamps();

-- Policies (drop + recreate)
drop policy if exists "Users can insert their own feedback" on public.feedback;
drop policy if exists "Users can view their own feedback" on public.feedback;
drop policy if exists "Admins can view all feedback" on public.feedback;
drop policy if exists "Admins can update all feedback" on public.feedback;

create policy "Users can insert their own feedback"
  on public.feedback
  for insert
  to authenticated
  with check (
    -- NEW: allow NULL because trigger sets it; still allow explicit self-set
    (user_id is null or auth.uid() = user_id)
    and (created_by is null or created_by = auth.uid())
  );

create policy "Users can view their own feedback"
  on public.feedback
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Admins can view all feedback"
  on public.feedback
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role));

create policy "Admins can update all feedback"
  on public.feedback
  for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role))
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));

--------------------------------------------------------------------------------
-- 4) Admin-only summary "view" (safe)
-- Note: RLS does not apply to views directly; instead this view filters by admin.
-- Non-admins will see 0 rows.
--------------------------------------------------------------------------------

create or replace view public.daily_feedback_summary as
select
  date(created_at) as feedback_date,
  count(*) as total_feedback,
  count(*) filter (where priority = 'high') as high_priority,
  count(*) filter (where priority = 'normal') as normal_priority,
  count(*) filter (where priority = 'low') as low_priority,
  count(*) filter (where status = 'new') as new_feedback
from public.feedback
where public.has_role(auth.uid(), 'admin'::public.app_role)
group by date(created_at)
order by feedback_date desc;

-- Only authenticated can select; filter ensures admin-only results.
revoke all on public.daily_feedback_summary from anon;
grant select on public.daily_feedback_summary to authenticated;

--------------------------------------------------------------------------------
-- 5) Admin bootstrap allowlist + auto-grant on signup
--------------------------------------------------------------------------------

create table if not exists public.admin_allowlist (
  email citext primary key,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

-- Seed an initial admin email (safe if re-run)
insert into public.admin_allowlist(email)
values ('cd12536@gmail.com'::citext)
on conflict (email) do nothing;

alter table public.admin_allowlist enable row level security;

drop policy if exists "Admins can manage admin allowlist" on public.admin_allowlist;
create policy "Admins can manage admin allowlist"
  on public.admin_allowlist
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role))
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Trigger: when a user signs up and their email is in allowlist, grant admin
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if exists (
    select 1 from public.admin_allowlist a
    where a.email = new.email::citext
  ) then
    insert into public.user_roles(user_id, role, created_by)
    values (new.id, 'admin'::public.app_role, new.id)
    on conflict (user_id, role) do nothing;
  else
    -- optional: default role row
    insert into public.user_roles(user_id, role, created_by)
    values (new.id, 'user'::public.app_role, new.id)
    on conflict (user_id, role) do nothing;
  end if;

  return new;
end;
$$;

-- Create the trigger on auth.users (idempotent)
do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_auth_user_created_grant_roles'
  ) then
    create trigger on_auth_user_created_grant_roles
    after insert on auth.users
    for each row execute function public.handle_new_auth_user();
  end if;
end $$;

--------------------------------------------------------------------------------
-- 6) grant_admin_by_email() restricted to service_role only
--------------------------------------------------------------------------------

drop function if exists public.grant_admin_by_email(text);

create function public.grant_admin_by_email(p_email text)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  jwt_role text;
  v_user_id uuid;
begin
  jwt_role := current_setting('request.jwt.claim.role', true);

  if jwt_role is distinct from 'service_role' then
    raise exception 'grant_admin_by_email may only be called with service_role';
  end if;

  select id into v_user_id
  from auth.users
  where lower(email) = lower(p_email)
  limit 1;

  if v_user_id is null then
    raise exception 'No auth.users row found for email %', p_email;
  end if;

  insert into public.user_roles(user_id, role, created_by)
  values (v_user_id, 'admin'::public.app_role, v_user_id)
  on conflict (user_id, role) do nothing;
end;
$$;

revoke all on function public.grant_admin_by_email(text) from public;
revoke all on function public.grant_admin_by_email(text) from anon;
revoke all on function public.grant_admin_by_email(text) from authenticated;

-- grant execute to service_role if it exists
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function public.grant_admin_by_email(text) to service_role';
  end if;
end $$;

commit;