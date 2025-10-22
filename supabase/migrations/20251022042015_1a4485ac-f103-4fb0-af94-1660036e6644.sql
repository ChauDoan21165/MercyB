-- Create storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false);

-- RLS policy for authenticated users to upload their own screenshots
CREATE POLICY "Users can upload their payment screenshots"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'payment-proofs' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policy for users to view their own screenshots
CREATE POLICY "Users can view their own payment screenshots"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-proofs'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policy for admins to view all screenshots
CREATE POLICY "Admins can view all payment screenshots"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'payment-proofs'
  AND has_role(auth.uid(), 'admin')
);