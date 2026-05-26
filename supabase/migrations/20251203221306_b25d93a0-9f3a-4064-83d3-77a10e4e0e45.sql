-- Create bank_payment_requests table for bank transfer payments
CREATE TABLE IF NOT EXISTS public.bank_payment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tier text NOT NULL,
  amount numeric NOT NULL,
  screenshot_url text NOT NULL,
  transfer_note text,
  status text NOT NULL DEFAULT 'pending',
  admin_note text,
  created_at timestamptz DEFAULT now(),
  approved_at timestamptz
);

-- Enable RLS
ALTER TABLE public.bank_payment_requests ENABLE ROW LEVEL SECURITY;

-- User can see own bank payments
CREATE POLICY "User can see own bank payments"
ON public.bank_payment_requests
FOR SELECT
USING (auth.uid() = user_id);

-- User can insert own bank payments
CREATE POLICY "User can insert own bank payments"
ON public.bank_payment_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admin can manage all bank payments
CREATE POLICY "Admin can manage bank payments"
ON public.bank_payment_requests
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create storage bucket for bank payment screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('bank-payments', 'bank-payments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for bank-payments bucket
CREATE POLICY "Users can upload bank payment screenshots"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'bank-payments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own bank payment screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'bank-payments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all bank payment screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'bank-payments' AND has_role(auth.uid(), 'admin'::app_role));