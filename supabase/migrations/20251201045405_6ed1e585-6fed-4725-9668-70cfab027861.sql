-- Testimonials table for marketing
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  user_title TEXT, -- e.g., "VIP3 Learner", "Parent of 2 kids"
  avatar_url TEXT,
  content_en TEXT NOT NULL,
  content_vi TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  tier TEXT, -- which tier the testimonial represents
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals table for viral growth
CREATE TABLE IF NOT EXISTS public.user_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id UUID NOT NULL REFERENCES auth.users(id),
  referral_code TEXT UNIQUE NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id),
  referred_at TIMESTAMPTZ,
  reward_granted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast referral lookups
CREATE INDEX IF NOT EXISTS idx_referral_code ON public.user_referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrer_user ON public.user_referrals(referrer_user_id);

-- RLS policies for testimonials (public read, admin write)
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read testimonials"
  ON public.testimonials FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage testimonials"
  ON public.testimonials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS policies for referrals
ALTER TABLE public.user_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own referrals"
  ON public.user_referrals FOR SELECT
  USING (referrer_user_id = auth.uid() OR referred_user_id = auth.uid());

CREATE POLICY "Users can create referrals"
  ON public.user_referrals FOR INSERT
  WITH CHECK (referrer_user_id = auth.uid());

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 8-char uppercase alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if exists
    SELECT EXISTS(SELECT 1 FROM public.user_referrals WHERE referral_code = code) INTO exists;
    
    IF NOT exists THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;