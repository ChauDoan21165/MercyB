-- Bank Transfer Orders table for Techcombank payments
CREATE TABLE public.bank_transfer_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL,
  amount_vnd INTEGER NOT NULL,
  transfer_note TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  screenshot_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_by_admin_id UUID REFERENCES public.admin_users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT
);

-- Indexes
CREATE INDEX idx_bank_transfer_orders_user_id ON public.bank_transfer_orders(user_id);
CREATE INDEX idx_bank_transfer_orders_status ON public.bank_transfer_orders(status);
CREATE INDEX idx_bank_transfer_orders_created_at ON public.bank_transfer_orders(created_at DESC);

-- Enable RLS
ALTER TABLE public.bank_transfer_orders ENABLE ROW LEVEL SECURITY;

-- Users can insert their own orders
CREATE POLICY "Users can insert own orders"
ON public.bank_transfer_orders
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
ON public.bank_transfer_orders
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own pending orders (but only screenshot_url)
CREATE POLICY "Users can update own pending orders"
ON public.bank_transfer_orders
FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id);

-- Admins level 9+ can view all orders
CREATE POLICY "Admins can view all orders"
ON public.bank_transfer_orders
FOR SELECT
USING (get_admin_level(auth.uid()) >= 9);

-- Admins level 9+ can update all orders
CREATE POLICY "Admins can update all orders"
ON public.bank_transfer_orders
FOR UPDATE
USING (get_admin_level(auth.uid()) >= 9);

-- Updated at trigger
CREATE TRIGGER update_bank_transfer_orders_updated_at
BEFORE UPDATE ON public.bank_transfer_orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();