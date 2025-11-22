-- Add INSERT policy for kids_entries to allow admins to populate content
CREATE POLICY "Admins can insert kids entries"
ON public.kids_entries
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);

-- Add UPDATE policy for kids_entries to allow admins to modify content
CREATE POLICY "Admins can update kids entries"
ON public.kids_entries
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  )
);