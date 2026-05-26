-- Tighten INSERT policy: feedback now requires authentication.
-- Anonymous submissions are no longer permitted (per app design).

drop policy if exists "anyone can insert feedback" on public.feedback;

create policy "authenticated users insert own feedback"
  on public.feedback
  for insert
  to authenticated
  with check (user_id = auth.uid());

-- Update the rate-limit trigger to skip the anonymous branch (no longer reachable):
create or replace function public.check_feedback_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_recent_count int;
begin
  if new.user_id is null then
    raise exception 'feedback requires authentication' using errcode = 'P0001';
  end if;

  select count(*) into user_recent_count
    from public.feedback
    where user_id = new.user_id
      and created_at > now() - interval '1 hour';

  if user_recent_count >= 10 then
    raise exception 'rate_limit: max 10 feedback submissions per hour per user'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;
