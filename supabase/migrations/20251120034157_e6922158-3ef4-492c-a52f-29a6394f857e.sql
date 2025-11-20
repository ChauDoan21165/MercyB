-- Add description and yearly price columns to subscription_tiers
ALTER TABLE public.subscription_tiers
ADD COLUMN IF NOT EXISTS description_en text,
ADD COLUMN IF NOT EXISTS description_vi text,
ADD COLUMN IF NOT EXISTS price_yearly numeric;

-- Insert VIP5 tier
INSERT INTO public.subscription_tiers (
  name,
  name_vi,
  price_monthly,
  price_yearly,
  description_en,
  description_vi,
  room_access_per_day,
  custom_topics_allowed,
  priority_support,
  display_order,
  is_active
) VALUES (
  'VIP5',
  'VIP5',
  70.00,
  299.00,
  'VIP5 offers complete English writing support. Students write, and AI gives expert feedback: strengths, mistakes, clarity fixes, rewriting steps, and IELTS-style comments.',
  'VIP5 mang đến hỗ trợ viết tiếng Anh toàn diện. Học viên viết, AI phân tích và phản hồi rõ ràng: điểm mạnh, lỗi sai, cách cải thiện, bước viết lại và nhận xét theo chuẩn IELTS.',
  999,
  999,
  true,
  6,
  true
);