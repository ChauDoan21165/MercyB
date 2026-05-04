-- Grant INSERT and SELECT on public.feedback to the authenticated role.
-- Required for RLS policies to be evaluated for app users — without these
-- grants, Postgres rejects with "42501: permission denied for table feedback"
-- before RLS can run.
--
-- Already applied to production via SQL Editor on 2026-05-04 during PR1
-- diagnostic session. This file makes the grant reproducible for future
-- environment rebuilds.

grant insert, select on public.feedback to authenticated;
