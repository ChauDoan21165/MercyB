-- Create promo codes table
CREATE TABLE public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  daily_question_limit INTEGER NOT NULL DEFAULT 20,
  max_redemptions INTEGER NOT NULL DEFAULT 1,
  current_redemptions INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user promo redemptions table
CREATE TABLE public.user_promo_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  promo_code_id UUID NOT NULL REFERENCES public.promo_codes(id),
  redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  daily_question_limit INTEGER NOT NULL,
  UNIQUE(user_id, promo_code_id)
);

-- Create moderation violations table
CREATE TABLE public.user_moderation_violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  violation_type TEXT NOT NULL,
  severity_level INTEGER NOT NULL,
  message_content TEXT,
  room_id TEXT,
  action_taken TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create moderation status table
CREATE TABLE public.user_moderation_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL,
  violation_score INTEGER NOT NULL DEFAULT 0,
  total_violations INTEGER NOT NULL DEFAULT 0,
  last_violation_at TIMESTAMP WITH TIME ZONE,
  is_muted BOOLEAN NOT NULL DEFAULT false,
  muted_until TIMESTAMP WITH TIME ZONE,
  is_suspended BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_promo_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_moderation_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_moderation_status ENABLE ROW LEVEL SECURITY;

-- RLS Policies for promo_codes
CREATE POLICY "Anyone can view active promo codes"
ON public.promo_codes FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage promo codes"
ON public.promo_codes FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for user_promo_redemptions
CREATE POLICY "Users can view their own redemptions"
ON public.user_promo_redemptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own redemptions"
ON public.user_promo_redemptions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all redemptions"
ON public.user_promo_redemptions FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for moderation violations
CREATE POLICY "Users can view their own violations"
ON public.user_moderation_violations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all violations"
ON public.user_moderation_violations FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert violations"
ON public.user_moderation_violations FOR INSERT
WITH CHECK (true);

-- RLS Policies for moderation status
CREATE POLICY "Users can view their own status"
ON public.user_moderation_status FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all statuses"
ON public.user_moderation_status FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can manage moderation status"
ON public.user_moderation_status FOR ALL
USING (true);

-- Insert 20 promo codes
INSERT INTO public.promo_codes (code, description, daily_question_limit, max_redemptions, expires_at)
VALUES
  ('FRIEND2025-01', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-02', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-03', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-04', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-05', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-06', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-07', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-08', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-09', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-10', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-11', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-12', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-13', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-14', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-15', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-16', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-17', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-18', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-19', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year'),
  ('FRIEND2025-20', 'Friend access: 20 questions/day', 20, 1, now() + interval '1 year');