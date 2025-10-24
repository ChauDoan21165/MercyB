-- Unlock suspended user
UPDATE public.user_moderation_status 
SET 
  is_suspended = false,
  violation_score = 0,
  updated_at = now()
WHERE user_id = '6f8ac5ab-756e-4399-bb11-dcfb0534fd11';