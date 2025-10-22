-- Create table for payment proof submissions
CREATE TABLE public.payment_proof_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  tier_id UUID NOT NULL REFERENCES public.subscription_tiers(id),
  screenshot_url TEXT NOT NULL,
  username TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'paypal_manual',
  
  -- OCR extracted data
  extracted_transaction_id TEXT,
  extracted_amount NUMERIC,
  extracted_date TIMESTAMP WITH TIME ZONE,
  extracted_email TEXT,
  ocr_confidence NUMERIC, -- 0-1 score
  
  -- Verification status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, auto_approved, admin_approved, rejected
  verification_method TEXT, -- ocr_auto, admin_manual
  admin_notes TEXT,
  verified_by UUID, -- admin user_id
  verified_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_proof_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can insert their own submissions"
ON public.payment_proof_submissions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own submissions"
ON public.payment_proof_submissions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all submissions"
ON public.payment_proof_submissions FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all submissions"
ON public.payment_proof_submissions FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Create indexes
CREATE INDEX idx_payment_proof_user ON public.payment_proof_submissions(user_id);
CREATE INDEX idx_payment_proof_status ON public.payment_proof_submissions(status);
CREATE INDEX idx_payment_proof_created ON public.payment_proof_submissions(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_payment_proof_updated_at
BEFORE UPDATE ON public.payment_proof_submissions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();