-- Drop constraint if it exists (from auth schema reference)
ALTER TABLE public.feedback
DROP CONSTRAINT IF EXISTS feedback_user_id_fkey;

-- Add foreign key relationship from feedback to profiles
ALTER TABLE public.feedback
ADD CONSTRAINT feedback_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;