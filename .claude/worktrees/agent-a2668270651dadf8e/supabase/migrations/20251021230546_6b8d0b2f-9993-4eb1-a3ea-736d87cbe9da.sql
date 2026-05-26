-- Fix Security Definer View issue by converting to SECURITY INVOKER
-- This makes the view respect the querying user's RLS policies instead of the creator's

-- Drop the existing SECURITY DEFINER view
DROP VIEW IF EXISTS public.daily_feedback_summary;

-- Recreate the view with SECURITY INVOKER option
-- This preserves the exact same structure and column order
CREATE VIEW public.daily_feedback_summary
WITH (security_invoker=true) AS
SELECT 
  DATE(created_at) AS feedback_date,
  COUNT(*) AS total_feedback,
  COUNT(*) FILTER (WHERE priority = 'high'::text) AS high_priority,
  COUNT(*) FILTER (WHERE priority = 'normal'::text) AS normal_priority,
  COUNT(*) FILTER (WHERE priority = 'low'::text) AS low_priority,
  COUNT(*) FILTER (WHERE status = 'new'::text) AS new_feedback
FROM public.feedback
GROUP BY DATE(created_at)
ORDER BY DATE(created_at) DESC;

-- Now the view will respect the RLS policies on the underlying feedback table
-- Only admins can view all feedback (per existing RLS policies), so only they can see this aggregated view
-- Regular users will only see aggregated data for their own feedback