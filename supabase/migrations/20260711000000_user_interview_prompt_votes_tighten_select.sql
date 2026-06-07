BEGIN;

CREATE OR REPLACE FUNCTION public.user_interview_prompt_votes_recount()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_prompt uuid;
  v_up int;
  v_flag int;
BEGIN
  v_prompt := coalesce(new.prompt_id, old.prompt_id);
  SELECT
    count(*) FILTER (WHERE vote_type = 'up'),
    count(*) FILTER (WHERE vote_type = 'flag')
    INTO v_up, v_flag
    FROM public.user_interview_prompt_votes
    WHERE prompt_id = v_prompt;

  UPDATE public.user_interview_prompts
     SET upvotes_count = v_up,
         flag_count = v_flag,
         status = CASE
           WHEN status = 'published' AND v_flag >= 5 THEN 'rejected'::public.interview_prompt_status
           ELSE status
         END,
         rejection_reason = CASE
           WHEN status = 'published' AND v_flag >= 5 THEN coalesce(rejection_reason, 'auto-pulled (5+ flags)')
           ELSE rejection_reason
         END
   WHERE id = v_prompt;

  RETURN NULL;
END;
$$;

DROP POLICY IF EXISTS "votes_select_all" ON public.user_interview_prompt_votes;
DROP POLICY IF EXISTS "votes_select_own" ON public.user_interview_prompt_votes;

CREATE POLICY "votes_select_own"
  ON public.user_interview_prompt_votes
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

REVOKE SELECT ON public.user_interview_prompt_votes FROM anon;
GRANT SELECT ON public.user_interview_prompt_votes TO authenticated;

COMMIT;
