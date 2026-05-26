-- Create payment_transactions table for unified transaction logging
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  tier_id uuid REFERENCES public.subscription_tiers(id),
  amount numeric NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('paypal', 'bank_transfer', 'access_code')),
  transaction_type text NOT NULL CHECK (transaction_type IN ('subscription', 'extension', 'redemption')),
  external_reference text,
  period_days integer NOT NULL DEFAULT 30,
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create access_codes table
CREATE TABLE IF NOT EXISTS public.access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  tier_id uuid NOT NULL REFERENCES public.subscription_tiers(id),
  days integer NOT NULL,
  max_uses integer NOT NULL DEFAULT 1,
  used_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamp with time zone,
  created_by uuid NOT NULL,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create access_code_redemptions table
CREATE TABLE IF NOT EXISTS public.access_code_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_id uuid NOT NULL REFERENCES public.access_codes(id),
  user_id uuid NOT NULL,
  redeemed_at timestamp with time zone NOT NULL DEFAULT now(),
  subscription_id uuid REFERENCES public.user_subscriptions(id),
  transaction_id uuid REFERENCES public.payment_transactions(id)
);

-- Enable RLS on all new tables
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_code_redemptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_transactions
CREATE POLICY "Admins can view all transactions"
  ON public.payment_transactions FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own transactions"
  ON public.payment_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions"
  ON public.payment_transactions FOR INSERT
  WITH CHECK (true);

-- RLS Policies for access_codes
CREATE POLICY "Admins can manage access codes"
  ON public.access_codes FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can view active codes for redemption"
  ON public.access_codes FOR SELECT
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- RLS Policies for access_code_redemptions
CREATE POLICY "Admins can view all redemptions"
  ON public.access_code_redemptions FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own redemptions"
  ON public.access_code_redemptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert redemptions"
  ON public.access_code_redemptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_payment_transactions_created_at ON public.payment_transactions(created_at DESC);
CREATE INDEX idx_access_codes_code ON public.access_codes(code);
CREATE INDEX idx_access_codes_tier_id ON public.access_codes(tier_id);
CREATE INDEX idx_access_code_redemptions_user_id ON public.access_code_redemptions(user_id);
CREATE INDEX idx_access_code_redemptions_code_id ON public.access_code_redemptions(code_id);

-- Add trigger for updated_at
CREATE TRIGGER update_payment_transactions_updated_at
  BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_access_codes_updated_at
  BEFORE UPDATE ON public.access_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();