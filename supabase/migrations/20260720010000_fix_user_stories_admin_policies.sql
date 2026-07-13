-- Capture the production hotfix for /stories 403s.
--
-- Prod already had this applied manually. Keep it in migration history so a
-- rebuild does not reintroduce admin policies that call get_admin_level()
-- without auth.uid() while evaluating public published-story reads.

drop policy if exists "admin_select" on public.user_stories;
create policy "admin_select"
  on public.user_stories
  for select
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9);

drop policy if exists "admin_update" on public.user_stories;
create policy "admin_update"
  on public.user_stories
  for update
  to authenticated
  using (public.get_admin_level(auth.uid()) >= 9)
  with check (public.get_admin_level(auth.uid()) >= 9);
