-- Corrected post-apply on 2026-07-14 to match live certificate_code uuid casts.
BEGIN;

-- Capture and replace dashboard-only certificate RPCs so browser callers can
-- no longer forge p_user_id. These SQL files are output-only; do not apply
-- from automation.

DO $$
BEGIN
  IF to_regprocedure('public.issue_certificate(uuid,text,integer,jsonb)') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.issue_certificate(uuid, text, integer, jsonb) FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.issue_certificate(uuid, text, integer, jsonb) FROM anon;
    REVOKE ALL ON FUNCTION public.issue_certificate(uuid, text, integer, jsonb) FROM authenticated;
  END IF;
END;
$$;
DROP FUNCTION IF EXISTS public.issue_certificate(uuid, text, integer, jsonb);

CREATE OR REPLACE FUNCTION public.issue_certificate(
  p_cert_type text,
  p_milestone_value integer,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS public.certificates
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_row public.certificates%ROWTYPE;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'issue_certificate requires an authenticated user'
      USING ERRCODE = '28000';
  END IF;

  IF p_cert_type IS NULL OR length(trim(p_cert_type)) = 0 THEN
    RAISE EXCEPTION 'issue_certificate: p_cert_type is required'
      USING ERRCODE = '22023';
  END IF;

  IF p_milestone_value IS NULL THEN
    RAISE EXCEPTION 'issue_certificate: p_milestone_value is required'
      USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.certificate_types ct
    WHERE ct.cert_type = p_cert_type
      AND ct.milestone_value = p_milestone_value
      AND ct.is_active = true
  ) THEN
    RAISE EXCEPTION 'issue_certificate: unknown or inactive certificate type %/%',
      p_cert_type,
      p_milestone_value
      USING ERRCODE = '22023';
  END IF;

  SELECT *
  INTO v_row
  FROM public.certificates c
  WHERE c.user_id = v_user_id
    AND c.cert_type = p_cert_type
    AND c.milestone_value = p_milestone_value
  LIMIT 1;

  IF FOUND THEN
    RETURN v_row;
  END IF;

  INSERT INTO public.certificates (
    user_id,
    cert_type,
    milestone_value,
    metadata
  )
  VALUES (
    v_user_id,
    p_cert_type,
    p_milestone_value,
    COALESCE(p_metadata, '{}'::jsonb)
  )
  RETURNING * INTO v_row;

  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.issue_certificate(text, integer, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.issue_certificate(text, integer, jsonb) FROM anon;
GRANT EXECUTE ON FUNCTION public.issue_certificate(text, integer, jsonb) TO authenticated;

COMMENT ON FUNCTION public.issue_certificate(text, integer, jsonb) IS
  'Self-scoped certificate issuance. Uses auth.uid() for user_id; browser callers cannot choose another user.';

DO $$
BEGIN
  IF to_regprocedure('public.get_user_certificates(uuid)') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.get_user_certificates(uuid) FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.get_user_certificates(uuid) FROM anon;
    REVOKE ALL ON FUNCTION public.get_user_certificates(uuid) FROM authenticated;
  END IF;
END;
$$;
DROP FUNCTION IF EXISTS public.get_user_certificates(uuid);

CREATE OR REPLACE FUNCTION public.get_user_certificates()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  cert_type text,
  milestone_value integer,
  certificate_code text,
  metadata jsonb,
  issued_at timestamptz,
  display_name_en text,
  display_name_vi text,
  description_en text,
  description_vi text,
  category text,
  sort_order integer
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'get_user_certificates requires an authenticated user'
      USING ERRCODE = '28000';
  END IF;

  RETURN QUERY
  SELECT
    c.id,
    c.user_id,
    c.cert_type,
    c.milestone_value,
    c.certificate_code::text,
    c.metadata,
    c.issued_at,
    ct.display_name_en,
    ct.display_name_vi,
    ct.description_en,
    ct.description_vi,
    ct.category,
    ct.sort_order
  FROM public.certificates c
  JOIN public.certificate_types ct
    ON ct.cert_type = c.cert_type
  WHERE c.user_id = v_user_id
  ORDER BY c.issued_at DESC, ct.sort_order ASC, c.id ASC;
END;
$$;

REVOKE ALL ON FUNCTION public.get_user_certificates() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_user_certificates() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_user_certificates() TO authenticated;

COMMENT ON FUNCTION public.get_user_certificates() IS
  'Self-scoped certificate listing. Uses auth.uid(); callers cannot list another user certificates.';

CREATE OR REPLACE FUNCTION public.verify_certificate(p_code text)
RETURNS TABLE (
  id uuid,
  cert_type text,
  milestone_value integer,
  certificate_code text,
  issued_at timestamptz,
  display_name_en text,
  display_name_vi text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT
    c.id,
    c.cert_type,
    c.milestone_value,
    c.certificate_code::text,
    c.issued_at,
    ct.display_name_en,
    ct.display_name_vi
  FROM public.certificates c
  JOIN public.certificate_types ct
    ON ct.cert_type = c.cert_type
  WHERE c.certificate_code = p_code::uuid
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION public.verify_certificate(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.verify_certificate(text) TO anon, authenticated;

COMMENT ON FUNCTION public.verify_certificate(text) IS
  'Public certificate verification by opaque certificate_code. Returns only public certificate display fields.';

COMMIT;
