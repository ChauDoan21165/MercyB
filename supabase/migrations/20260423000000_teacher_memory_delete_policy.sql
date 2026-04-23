-- Add DELETE policy on teacher_memory so users can reset Mercy's memory.
-- GDPR Article 17 + Apple 5.1.1(v) require users to be able to remove
-- their own derived AI memory, not just the auth.users row.
--
-- The existing policies (select/insert/update) were added in
-- 20260422001259_add_teacher_memory.sql but DELETE was omitted.

DROP POLICY IF EXISTS "teacher_memory_own_delete" ON public.teacher_memory;

CREATE POLICY "teacher_memory_own_delete"
  ON public.teacher_memory
  FOR DELETE
  USING (auth.uid() = user_id);

-- Explicit table-level grant for the authenticated role (same safeguard
-- the entitlement_events migration documented).
GRANT DELETE ON public.teacher_memory TO authenticated;
