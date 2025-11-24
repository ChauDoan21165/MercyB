-- Add domain column to rooms table for VIP9 strategic categorization
ALTER TABLE public.rooms 
ADD COLUMN IF NOT EXISTS domain text;

-- Add index for better query performance on domain filtering
CREATE INDEX IF NOT EXISTS idx_rooms_domain ON public.rooms(domain);

-- Add comment explaining the domain field
COMMENT ON COLUMN public.rooms.domain IS 'Strategic domain for VIP9 rooms: Individual, Corporate, or National';
