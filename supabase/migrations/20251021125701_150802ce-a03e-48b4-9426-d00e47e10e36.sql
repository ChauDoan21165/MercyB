-- Delete old simple promo codes
DELETE FROM public.promo_codes WHERE code LIKE 'FRIEND2025-%';

-- Insert new complex promo codes
INSERT INTO public.promo_codes (code, description, daily_question_limit, max_redemptions, expires_at)
VALUES
  ('MB7K2-XP4QW-9N8RL', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FH3VZ-8M6YT-Q2NDP', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('WJ9LX-5C4RM-H7KGF', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('DT2NP-K8WQ4-6V9XL', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('GX7RH-3M9VC-L4TQP', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('NP4KW-9X2FM-T7VQH', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('QL8DM-6H3VR-K9NPX', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('VH2QP-7L9KT-M4CWX', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('RT9WX-3N6HP-Q8FLV', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('MK4FQ-8V2NL-D7XHW', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('XL6PH-2Q9VM-T3KRN', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('HW9NL-5K7QP-F2VMX', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('QN3VX-8M4RH-L9KTP', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('TP7KR-2W9NF-H6QVL', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FM8XQ-4L6HP-V3NRK', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('LK2NV-9P7QH-W4MXF', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('PV6HW-3T9KL-N2QRX', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('KH4QF-7M2WN-P9LVX', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('WQ9NX-5H7RL-K3VPM', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('RL3VH-8K4QP-M7WNX', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year');

-- Create VIP topic requests table (enhanced)
CREATE TABLE IF NOT EXISTS public.vip_topic_requests_detailed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tier TEXT NOT NULL,
  topic_title TEXT NOT NULL,
  topic_description TEXT NOT NULL,
  specific_goals TEXT,
  target_audience TEXT,
  urgency TEXT DEFAULT 'medium',
  additional_notes TEXT,
  status TEXT DEFAULT 'pending',
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vip_topic_requests_detailed ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own requests"
ON public.vip_topic_requests_detailed FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own requests"
ON public.vip_topic_requests_detailed FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests"
ON public.vip_topic_requests_detailed FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all requests"
ON public.vip_topic_requests_detailed FOR UPDATE
USING (has_role(auth.uid(), 'admin'));