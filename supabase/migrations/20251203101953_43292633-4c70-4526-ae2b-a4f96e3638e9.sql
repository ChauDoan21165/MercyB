-- Add separate audio columns for content, reflection, and dare
ALTER TABLE path_days 
ADD COLUMN IF NOT EXISTS audio_content_en text,
ADD COLUMN IF NOT EXISTS audio_content_vi text,
ADD COLUMN IF NOT EXISTS audio_reflection_en text,
ADD COLUMN IF NOT EXISTS audio_reflection_vi text,
ADD COLUMN IF NOT EXISTS audio_dare_en text,
ADD COLUMN IF NOT EXISTS audio_dare_vi text;

-- Add comment for clarity
COMMENT ON COLUMN path_days.audio_content_en IS 'Audio file for main content (English)';
COMMENT ON COLUMN path_days.audio_content_vi IS 'Audio file for main content (Vietnamese)';
COMMENT ON COLUMN path_days.audio_reflection_en IS 'Audio file for reflection prompt (English)';
COMMENT ON COLUMN path_days.audio_reflection_vi IS 'Audio file for reflection prompt (Vietnamese)';
COMMENT ON COLUMN path_days.audio_dare_en IS 'Audio file for dare/challenge (English)';
COMMENT ON COLUMN path_days.audio_dare_vi IS 'Audio file for dare/challenge (Vietnamese)';