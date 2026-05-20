-- Placement v3 RLS and grants.
--
-- Default posture: no anon access. Authenticated users receive only the
-- explicit grants/policies below. service_role receives full privileges
-- and bypasses RLS for edge functions.

alter table public.placement_v3_sessions enable row level security;
alter table public.placement_v3_responses enable row level security;
alter table public.placement_v3_profiles enable row level security;

-- Remove accidental broad grants before adding the intended surface.
revoke all on table public.placement_v3_sessions from anon, authenticated;
revoke all on table public.placement_v3_responses from anon, authenticated;
revoke all on table public.placement_v3_profiles from anon, authenticated;

grant select, insert on table public.placement_v3_sessions to authenticated;
grant update (
  flow_state,
  completed_at,
  current_modality,
  current_task_index,
  updated_at
) on table public.placement_v3_sessions to authenticated;
grant all privileges on table public.placement_v3_sessions to service_role;

grant select, insert on table public.placement_v3_responses to authenticated;
grant all privileges on table public.placement_v3_responses to service_role;

grant select on table public.placement_v3_profiles to authenticated;
grant all privileges on table public.placement_v3_profiles to service_role;

-- placement_v3_sessions: owner read/insert/limited-column update.
drop policy if exists "placement_v3_sessions_select_own" on public.placement_v3_sessions;
create policy "placement_v3_sessions_select_own"
  on public.placement_v3_sessions
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "placement_v3_sessions_insert_own" on public.placement_v3_sessions;
create policy "placement_v3_sessions_insert_own"
  on public.placement_v3_sessions
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "placement_v3_sessions_update_own" on public.placement_v3_sessions;
create policy "placement_v3_sessions_update_own"
  on public.placement_v3_sessions
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- placement_v3_responses: owner read/insert via owning session. No client
-- UPDATE/DELETE; grading fields are service_role-owned.
drop policy if exists "placement_v3_responses_select_own_session" on public.placement_v3_responses;
create policy "placement_v3_responses_select_own_session"
  on public.placement_v3_responses
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.placement_v3_sessions s
      where s.id = placement_v3_responses.session_id
        and s.user_id = auth.uid()
    )
  );

drop policy if exists "placement_v3_responses_insert_own_session" on public.placement_v3_responses;
create policy "placement_v3_responses_insert_own_session"
  on public.placement_v3_responses
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.placement_v3_sessions s
      where s.id = placement_v3_responses.session_id
        and s.user_id = auth.uid()
    )
  );

-- placement_v3_profiles: owner read only. No client INSERT/UPDATE/DELETE.
drop policy if exists "placement_v3_profiles_select_own" on public.placement_v3_profiles;
create policy "placement_v3_profiles_select_own"
  on public.placement_v3_profiles
  for select
  to authenticated
  using (user_id = auth.uid());
