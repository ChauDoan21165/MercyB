-- Add VIP3 II tier to subscription_tiers table
INSERT INTO public.subscription_tiers (
  name,
  name_vi,
  price_monthly,
  room_access_per_day,
  custom_topics_allowed,
  priority_support,
  is_active,
  display_order
)
VALUES (
  'VIP3 II',
  'VIP3 II',
  150000,  -- Pricing in VND (adjust as needed)
  5,  -- 5 rooms per day access
  3,  -- 3 custom topics allowed
  true,  -- Priority support enabled
  true,  -- Active tier
  4  -- Display order: between VIP3 (3) and VIP4 (5)
)
ON CONFLICT (name) DO UPDATE SET
  name_vi = EXCLUDED.name_vi,
  price_monthly = EXCLUDED.price_monthly,
  room_access_per_day = EXCLUDED.room_access_per_day,
  custom_topics_allowed = EXCLUDED.custom_topics_allowed,
  priority_support = EXCLUDED.priority_support,
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order,
  updated_at = now();