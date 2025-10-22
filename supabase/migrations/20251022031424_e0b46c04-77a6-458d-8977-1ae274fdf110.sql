-- Add total question limit tracking to promo redemptions
ALTER TABLE public.user_promo_redemptions
ADD COLUMN IF NOT EXISTS total_question_limit INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS total_questions_used INTEGER DEFAULT 0;

-- Create 10 promo codes with 30 questions each
INSERT INTO public.promo_codes (code, description, daily_question_limit, max_redemptions, is_active)
VALUES 
  ('MERCY30-A1B2', 'Free 30 questions across all rooms / 30 câu hỏi miễn phí', 30, 100, true),
  ('MERCY30-C3D4', 'Free 30 questions across all rooms / 30 câu hỏi miễn phí', 30, 100, true),
  ('MERCY30-E5F6', 'Free 30 questions across all rooms / 30 câu hỏi miễn phí', 30, 100, true),
  ('MERCY30-G7H8', 'Free 30 questions across all rooms / 30 câu hỏi miễn phí', 30, 100, true),
  ('MERCY30-I9J0', 'Free 30 questions across all rooms / 30 câu hỏi miễn phí', 30, 100, true),
  ('MERCY30-K1L2', 'Free 30 questions across all rooms / 30 câu hỏi miễn phí', 30, 100, true),
  ('MERCY30-M3N4', 'Free 30 questions across all rooms / 30 câu hỏi miễn phí', 30, 100, true),
  ('MERCY30-O5P6', 'Free 30 questions across all rooms / 30 câu hỏi miễn phí', 30, 100, true),
  ('MERCY30-Q7R8', 'Free 30 questions across all rooms / 30 câu hỏi miễn phí', 30, 100, true),
  ('MERCY30-S9T0', 'Free 30 questions across all rooms / 30 câu hỏi miễn phí', 30, 100, true)
ON CONFLICT (code) DO NOTHING;