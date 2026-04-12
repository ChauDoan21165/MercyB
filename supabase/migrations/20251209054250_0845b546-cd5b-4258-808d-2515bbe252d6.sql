
-- Drop the restrictive constraint and replace with one that allows all VIP tiers
ALTER TABLE public.gift_codes DROP CONSTRAINT IF EXISTS gift_codes_tier_check;

ALTER TABLE public.gift_codes ADD CONSTRAINT gift_codes_tier_check 
  CHECK (tier = ANY (ARRAY['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6', 'Level 7', 'Level 8', 'Level 9']));
