BEGIN;

ALTER TABLE public.family_invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS family_invitations_owner_select ON public.family_invitations;
DROP POLICY IF EXISTS family_invitations_recipient_by_token ON public.family_invitations;

CREATE POLICY family_invitations_owner_select
  ON public.family_invitations
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (inviter_user_id = auth.uid());

REVOKE SELECT ON public.family_invitations FROM anon;
GRANT SELECT ON public.family_invitations TO authenticated;

COMMIT;
