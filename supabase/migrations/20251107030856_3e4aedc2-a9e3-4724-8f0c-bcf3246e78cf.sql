-- Create audit log table for payment proof access
CREATE TABLE IF NOT EXISTS public.payment_proof_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.payment_proof_submissions(id) ON DELETE CASCADE,
  admin_user_id UUID NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.payment_proof_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.payment_proof_audit_log
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON public.payment_proof_audit_log
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = admin_user_id AND has_role(auth.uid(), 'admin'));

-- Create function to purge old payment proofs (90 days)
CREATE OR REPLACE FUNCTION public.purge_old_payment_proofs()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete payment submissions older than 90 days
  DELETE FROM public.payment_proof_submissions
  WHERE created_at < now() - interval '90 days';
  
  -- Delete audit logs older than 1 year
  DELETE FROM public.payment_proof_audit_log
  WHERE created_at < now() - interval '1 year';
END;
$$;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_payment_proof_created_at 
ON public.payment_proof_submissions(created_at);

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at 
ON public.payment_proof_audit_log(created_at);