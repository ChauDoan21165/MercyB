begin;

create or replace function public.grant_admin_by_email(_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid;
begin
  select u.id into v_user_id
  from auth.users u
  where lower(u.email) = lower(_email)
  limit 1;

  if v_user_id is null then
    return;
  end if;

  insert into public.user_roles (user_id, role)
  values (v_user_id, 'admin')
  on conflict (user_id, role) do nothing;
end;
$$;

select public.grant_admin_by_email('cd12536@gmail.com');

commit;