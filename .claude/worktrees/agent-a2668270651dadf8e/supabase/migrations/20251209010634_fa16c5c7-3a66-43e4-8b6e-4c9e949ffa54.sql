-- Allow anonymous feedback by making user_id nullable
ALTER TABLE public.feedback ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert their own feedback" ON public.feedback;

-- Create new policy allowing both authenticated and anonymous feedback
CREATE POLICY "Anyone can insert feedback"
ON public.feedback
FOR INSERT
WITH CHECK (
  (user_id IS NULL) OR (auth.uid() = user_id)
);