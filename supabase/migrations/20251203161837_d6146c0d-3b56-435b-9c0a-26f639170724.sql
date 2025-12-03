-- Create study_log table for tracking user study activity
CREATE TABLE IF NOT EXISTS public.study_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT (CURRENT_DATE),
  room_id text,
  path_slug text,
  day_index int,
  topic_en text,
  topic_vi text,
  minutes int,
  mood_before text,
  mood_after text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.study_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own study log"
ON public.study_log
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study log"
ON public.study_log
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own study log"
ON public.study_log
FOR UPDATE
USING (auth.uid() = user_id);

-- Index for efficient queries by user and date
CREATE INDEX IF NOT EXISTS idx_study_log_user_date ON public.study_log(user_id, date DESC);