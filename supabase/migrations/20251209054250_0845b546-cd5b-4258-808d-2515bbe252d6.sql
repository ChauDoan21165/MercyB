
-- Drop the restrictive constraint and replace with one that allows all VIP tiers
ALTER TABLE public.gift_codes DROP CONSTRAINT IF EXISTS gift_codes_tier_check;

ALTER TABLE public.gift_codes ADD CONSTRAINT gift_codes_tier_check 
  CHECK (tier = ANY (ARRAY['VIP1', 'VIP2', 'VIP3', 'VIP4', 'VIP5', 'VIP6', 'VIP7', 'VIP8', 'VIP9']));
