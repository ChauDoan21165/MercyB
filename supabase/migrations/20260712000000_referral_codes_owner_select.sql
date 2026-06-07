BEGIN;

DROP POLICY IF EXISTS referral_codes_select_all
  ON public.referral_codes;

DROP POLICY IF EXISTS referral_codes_select_own
  ON public.referral_codes;

CREATE POLICY referral_codes_select_own
  ON public.referral_codes
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_user_id);

COMMIT;
