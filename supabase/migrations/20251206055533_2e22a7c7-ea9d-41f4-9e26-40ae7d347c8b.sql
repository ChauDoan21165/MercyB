-- Fix SECURITY DEFINER views by recreating them with SECURITY INVOKER

-- Drop and recreate room_health_view with SECURITY INVOKER
DROP VIEW IF EXISTS public.room_health_view;

CREATE VIEW public.room_health_view 
WITH (security_invoker = true) AS
SELECT 
    id AS room_id,
    id AS slug,
    tier,
    title_en,
    title_vi,
    100 AS health_score,
    0 AS audio_coverage,
    false AS is_low_health,
    false AS has_zero_audio
FROM rooms r;

-- Drop and recreate daily_feedback_summary with SECURITY INVOKER
DROP VIEW IF EXISTS public.daily_feedback_summary;

CREATE VIEW public.daily_feedback_summary 
WITH (security_invoker = true) AS
SELECT 
    date(created_at) AS feedback_date,
    count(*) AS total_feedback,
    count(*) FILTER (WHERE priority = 'high'::text) AS high_priority,
    count(*) FILTER (WHERE priority = 'normal'::text) AS normal_priority,
    count(*) FILTER (WHERE priority = 'low'::text) AS low_priority,
    count(*) FILTER (WHERE status = 'new'::text) AS new_feedback
FROM feedback
GROUP BY date(created_at)
ORDER BY date(created_at) DESC;