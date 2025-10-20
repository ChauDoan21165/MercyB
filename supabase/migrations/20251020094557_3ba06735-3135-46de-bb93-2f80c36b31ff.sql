-- Create subscription tiers table
CREATE TABLE public.subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  name_vi TEXT NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  room_access_per_day INTEGER,
  custom_topics_allowed INTEGER,
  priority_support BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert the 4 tiers from your UI
INSERT INTO public.subscription_tiers (name, name_vi, price_monthly, room_access_per_day, custom_topics_allowed, priority_support, display_order) VALUES
  ('Free', 'Miễn phí', 0.00, 10, 0, false, 1),
  ('VIP1', 'VIP1', 2.00, 1, 1, false, 2),
  ('VIP2', 'VIP2', 4.00, 2, 2, false, 3),
  ('VIP3', 'VIP3', 6.00, 3, 3, true, 4);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tier_id UUID NOT NULL REFERENCES public.subscription_tiers(id),
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Create usage tracking table (for daily limits)
CREATE TABLE public.subscription_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  rooms_accessed INTEGER DEFAULT 0,
  custom_topics_requested INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, usage_date)
);

-- Enable RLS on all tables
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_tiers (public readable)
CREATE POLICY "Anyone can view subscription tiers"
  ON public.subscription_tiers
  FOR SELECT
  USING (is_active = true);

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscription"
  ON public.user_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription"
  ON public.user_subscriptions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON public.user_subscriptions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for subscription_usage
CREATE POLICY "Users can view their own usage"
  ON public.subscription_usage
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
  ON public.subscription_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
  ON public.subscription_usage
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin policies for managing subscriptions
CREATE POLICY "Admins can manage all subscriptions"
  ON public.user_subscriptions
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all usage"
  ON public.subscription_usage
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_subscription_usage_user_date ON public.subscription_usage(user_id, usage_date);

-- Create trigger for updated_at
CREATE TRIGGER update_subscription_tiers_updated_at
  BEFORE UPDATE ON public.subscription_tiers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to get user's current tier
CREATE OR REPLACE FUNCTION public.get_user_tier(user_uuid UUID)
RETURNS TABLE (
  tier_name TEXT,
  room_access_per_day INTEGER,
  custom_topics_allowed INTEGER,
  priority_support BOOLEAN
) 
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    t.name,
    t.room_access_per_day,
    t.custom_topics_allowed,
    t.priority_support
  FROM user_subscriptions us
  JOIN subscription_tiers t ON us.tier_id = t.id
  WHERE us.user_id = user_uuid
    AND us.status = 'active'
  LIMIT 1;
$$;

-- Function to check daily usage limits
CREATE OR REPLACE FUNCTION public.check_usage_limit(
  user_uuid UUID,
  limit_type TEXT -- 'rooms' or 'topics'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tier_limit INTEGER;
  current_usage INTEGER;
BEGIN
  -- Get the user's tier limit
  IF limit_type = 'rooms' THEN
    SELECT room_access_per_day INTO tier_limit
    FROM subscription_tiers t
    JOIN user_subscriptions us ON t.id = us.tier_id
    WHERE us.user_id = user_uuid AND us.status = 'active';
  ELSIF limit_type = 'topics' THEN
    SELECT custom_topics_allowed INTO tier_limit
    FROM subscription_tiers t
    JOIN user_subscriptions us ON t.id = us.tier_id
    WHERE us.user_id = user_uuid AND us.status = 'active';
  ELSE
    RETURN false;
  END IF;

  -- If no subscription found, return false
  IF tier_limit IS NULL THEN
    RETURN false;
  END IF;

  -- Get current usage
  IF limit_type = 'rooms' THEN
    SELECT COALESCE(rooms_accessed, 0) INTO current_usage
    FROM subscription_usage
    WHERE user_id = user_uuid AND usage_date = CURRENT_DATE;
  ELSIF limit_type = 'topics' THEN
    SELECT COALESCE(custom_topics_requested, 0) INTO current_usage
    FROM subscription_usage
    WHERE user_id = user_uuid AND usage_date = CURRENT_DATE;
  END IF;

  -- Return true if under limit
  RETURN COALESCE(current_usage, 0) < tier_limit;
END;
$$;