-- Create user_tiers table for simple tier tracking
CREATE TABLE public.user_tiers (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'free',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_tiers ENABLE ROW LEVEL SECURITY;

-- Users can read their own tier
CREATE POLICY "Users can view own tier" ON public.user_tiers
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own tier
CREATE POLICY "Users can update own tier" ON public.user_tiers
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own tier  
CREATE POLICY "Users can insert own tier" ON public.user_tiers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can manage all tiers
CREATE POLICY "Admins can manage all tiers" ON public.user_tiers
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- Index for quick lookups
CREATE INDEX idx_user_tiers_tier ON public.user_tiers(tier);