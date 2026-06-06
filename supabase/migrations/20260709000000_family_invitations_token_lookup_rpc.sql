BEGIN;

CREATE OR REPLACE FUNCTION public.get_family_invitation_by_token(p_token text)
RETURNS TABLE (
  inviter_user_id uuid,
  recipient_name text,
  template_key text,
  custom_message text,
  relationship text,
  trial_bonus_days integer,
  expires_at timestamptz,
  status text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    fi.inviter_user_id,
    fi.recipient_name,
    fi.template_key,
    fi.custom_message,
    fi.relationship,
    fi.trial_bonus_days,
    fi.expires_at,
    fi.status
  FROM public.family_invitations fi
  WHERE fi.invite_token = p_token
  LIMIT 1
$$;

COMMENT ON FUNCTION public.get_family_invitation_by_token(text) IS
  'Token-scoped public family invitation lookup. Returns only display fields needed by /invite/:token; intentionally omits recipient_email, recipient_phone, and invite_token.';

REVOKE ALL ON FUNCTION public.get_family_invitation_by_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_family_invitation_by_token(text) TO anon, authenticated;

COMMIT;
