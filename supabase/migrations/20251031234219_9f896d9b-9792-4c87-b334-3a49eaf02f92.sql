-- Create 5 special VIP access codes with unlimited questions
INSERT INTO promo_codes (
  code,
  description,
  daily_question_limit,
  max_redemptions,
  current_redemptions,
  expires_at,
  is_active
) VALUES 
('MERCY2025VIP', 'Special VIP Access - Unlimited Questions', 999999, 999, 0, NOW() + INTERVAL '10 years', true),
('BLADE2025FULL', 'Special VIP Access - Unlimited Questions', 999999, 999, 0, NOW() + INTERVAL '10 years', true),
('HEALING2025MAX', 'Special VIP Access - Unlimited Questions', 999999, 999, 0, NOW() + INTERVAL '10 years', true),
('MENTAL2025PRO', 'Special VIP Access - Unlimited Questions', 999999, 999, 0, NOW() + INTERVAL '10 years', true),
('SUPPORT2025ULTRA', 'Special VIP Access - Unlimited Questions', 999999, 999, 0, NOW() + INTERVAL '10 years', true)
ON CONFLICT (code) DO UPDATE SET
  daily_question_limit = EXCLUDED.daily_question_limit,
  expires_at = EXCLUDED.expires_at,
  max_redemptions = EXCLUDED.max_redemptions,
  is_active = EXCLUDED.is_active;