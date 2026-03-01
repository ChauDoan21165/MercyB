-- Harden roles + feedback + audit logging + service_role-only admin grant
-- Idempotent migration for Supabase

begin;

--------------------------------------------------------------------------------
-- 1) Prevent users from deleting their own admin role
--------------------------------------------------------------------------------

-- RLS: allow admins to delete roles, but NOT their own admin role
do $$
begin
  -- user_roles already has RLS enabled in your base migration
  -- Add a delete policy only if it doesn't exist yet.
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename  = 'user_roles'
      and policyname = 'Admins can delete roles (except own admin)'
  ) then
    execute $pol$
      create policy "Admins can delete roles (except own admin)"
        on public.user_roles
        for delete
        to authenticated
        using (
          public.has_role(auth.uid(), 'admin')
          and not (user_id = auth.uid() and role = 'admin')
        );
    $pol$;
  end if;
end $$;

-- Extra safety: trigger guard (works even if someone later adds permissive policies)
-- Uses JWT claims if present; allows server-side/maintenance deletes where no JWT exists.
create or replace function public.prevent_self_admin_role_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  jwt_sub text;
  actor uuid;
begin
  jwt_sub := current_setting('request.jwt.claim.sub', true);

  if jwt_sub is not null and jwt_sub <> '' then
    actor := jwt_sub::uuid;

    if old.role = 'admin' and old.user_id = actor then
      raise exception 'Cannot delete your own admin role';
    end if;
  end if;

  return old;
end;
$$;

drop trigger if exists trg_prevent_self_admin_role_delete on public.user_roles;
create trigger trg_prevent_self_admin_role_delete
before delete on public.user_roles
for each row
execute function public.prevent_self_admin_role_delete();

--------------------------------------------------------------------------------
-- 2) Add created_by field to feedback (backfill + constraints + index)
--------------------------------------------------------------------------------

alter table public.feedback
  add column if not exists created_by uuid;

-- Default created_by to the inserting user when available
-- (If inserted via service role / no JWT, created_by stays null until explicitly set)
do $$
begin
  -- Set default only if there isn't one already
  if not exists (
    select 1
    from pg_attrdef d
    join pg_attribute a on a.attrelid = d.adrelid and a.attnum = d.adnum
    join pg_class c on c.oid = d.adrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'feedback'
      and a.attname = 'created_by'
  ) then
    execute 'alter table public.feedback alter column created_by set default auth.uid()';
  end if;
end $$;

-- Backfill existing rows: prefer user_id, else leave null
update public.feedback
set created_by = coalesce(created_by, user_id)
where created_by is null;

-- Add FK (idempotent)
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'feedback_created_by_fkey'
      and conrelid = 'public.feedback'::regclass
  ) then
    execute '
      alter table public.feedback
      add constraint feedback_created_by_fkey
      foreign key (created_by) references auth.users(id)
      on delete set null
    ';
  end if;
end $$;

-- Enforce created_by not null for normal app usage
-- (If you truly need service inserts without JWT, keep this NOT VALID until you ensure fills)
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'feedback_created_by_not_null'
      and conrelid = 'public.feedback'::regclass
  ) then
    execute '
      alter table public.feedback
      add constraint feedback_created_by_not_null
      check (created_by is not null)
      not valid
    ';
  end if;
end $$;

-- Validate the constraint (safe if you’ve backfilled / ensured created_by on inserts)
alter table public.feedback
  validate constraint feedback_created_by_not_null;

-- Helpful indexes
create index if not exists feedback_created_by_idx on public.feedback(created_by);
create index if not exists feedback_created_at_idx on public.feedback(created_at);

-- Tighten feedback insert policy to ensure created_by is the actor (admin/service can still do whatever)
do $$
begin
  -- Replace policy if you want stronger checks. We'll create an additional stricter policy;
  -- RLS is permissive, so we also recommend dropping the old insert policy and replacing it.
  if exists (
    select 1
    from pg_policies
    where schemaname='public' and tablename='feedback' and policyname='Users can insert their own feedback'
  ) then
    execute 'drop policy "Users can insert their own feedback" on public.feedback';
  end if;

  execute $pol$
    create policy "Users can insert their own feedback"
      on public.feedback
      for insert
      to authenticated
      with check (
        auth.uid() = user_id
        and auth.uid() = created_by
      );
  $pol$;
end $$;

--------------------------------------------------------------------------------
-- 3) Audit logging table for role changes + triggers
--------------------------------------------------------------------------------

create table if not exists public.user_role_audit (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid,
  actor_email text,
  actor_jwt_role text,
  target_user_id uuid not null,
  target_role public.app_role not null,
  action text not null check (action in ('insert','delete')),
  created_at timestamp with time zone not null default now()
);

alter table public.user_role_audit enable row level security;

-- Admins can read audit log
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname='public' and tablename='user_role_audit' and policyname='Admins can view role audit'
  ) then
    execute $pol$
      create policy "Admins can view role audit"
        on public.user_role_audit
        for select
        to authenticated
        using (public.has_role(auth.uid(), 'admin'));
    $pol$;
  end if;
end $$;

-- Trigger function to write audit rows
create or replace function public.log_user_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  jwt_sub text;
  actor uuid;
  actor_role text;
  actor_email text;
begin
  jwt_sub := current_setting('request.jwt.claim.sub', true);
  actor_role := current_setting('request.jwt.claim.role', true);

  if jwt_sub is not null and jwt_sub <> '' then
    actor := jwt_sub::uuid;
    select u.email into actor_email from auth.users u where u.id = actor;
  else
    actor := null;
    actor_email := null;
  end if;

  if tg_op = 'INSERT' then
    insert into public.user_role_audit (
      actor_user_id, actor_email, actor_jwt_role,
      target_user_id, target_role, action
    ) values (
      actor, actor_email, actor_role,
      new.user_id, new.role, 'insert'
    );
    return new;

  elsif tg_op = 'DELETE' then
    insert into public.user_role_audit (
      actor_user_id, actor_email, actor_jwt_role,
      target_user_id, target_role, action
    ) values (
      actor, actor_email, actor_role,
      old.user_id, old.role, 'delete'
    );
    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists trg_user_roles_audit_ins on public.user_roles;
create trigger trg_user_roles_audit_ins
after insert on public.user_roles
for each row
execute function public.log_user_role_change();

drop trigger if exists trg_user_roles_audit_del on public.user_roles;
create trigger trg_user_roles_audit_del
after delete on public.user_roles
for each row
execute function public.log_user_role_change();

create index if not exists user_role_audit_target_user_idx on public.user_role_audit(target_user_id);
create index if not exists user_role_audit_created_at_idx on public.user_role_audit(created_at);

--------------------------------------------------------------------------------
-- 4) Restrict grant_admin_by_email() to service_role only
--------------------------------------------------------------------------------

-- This assumes you already have a function public.grant_admin_by_email(text)
-- We'll replace it with a hardened version that:
--   - Requires JWT role = 'service_role'
--   - Is SECURITY DEFINER
--   - Is idempotent via ON CONFLICT DO NOTHING
--
-- If you *don't* already have it, this creates it.

create or replace function public.grant_admin_by_email(p_email text)
returns void
language plpgsql
security definer
set search_path = public
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
    -- user not found yet; you can choose to silently ignore or error
    raise exception 'No auth.users row found for email %', p_email;
  end if;

  insert into public.user_roles (user_id, role)
  values (v_user_id, 'admin')
  on conflict (user_id, role) do nothing;
end;
$$;

-- Lock down EXECUTE so regular clients can’t call it even accidentally.
-- (Note: JWT service_role bypasses RLS, but function EXECUTE still matters for PostgREST exposure)
revoke all on function public.grant_admin_by_email(text) from public;
revoke all on function public.grant_admin_by_email(text) from anon;
revoke all on function public.grant_admin_by_email(text) from authenticated;

-- Optional: if you use a DB role named "service_role" (often not), grant it.
-- In many Supabase setups this role may not exist as a Postgres role, so this is best-effort.
do $$
begin
  if exists (select 1 from pg_roles where rolname = 'service_role') then
    execute 'grant execute on function public.grant_admin_by_email(text) to service_role';
  end if;
end $$;

commit;