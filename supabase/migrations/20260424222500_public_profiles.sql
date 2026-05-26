-- Step 6 (Community) — public user profiles + progress sharing.
--
-- Adds the column set the new /u/:username page reads:
--   display_name    - shown instead of email/full_name on the public page
--   bio             - 280-char self-introduction (Twitter-length cap)
--   country         - ISO 3166-1 alpha-2 code (e.g. "VN", "US"); UI maps
--                     to a flag emoji client-side
--   learning_started_at - opt-in "X days learning" badge anchor
--   is_public       - privacy default OFF; user must opt in to expose
--
-- `username` already exists (added 2025-10-21, len 3..30, UNIQUE).
-- The brief asks for 3..20 alphanumeric+underscore, but tightening
-- those constraints retroactively could reject already-saved usernames
-- (some legacy ones contain hyphens / longer than 20 chars). The new
-- rule is enforced in src/lib/profile/publicProfile.ts on every update;
-- the DB keeps its existing constraint as a permissive backstop.
--
-- Public access is exposed through a SECURITY DEFINER RPC instead of a
-- broad SELECT policy on profiles, so the existing strict RLS (email,
-- phone, full_name visible only to the owner) is preserved unchanged.
-- The RPC returns ONLY public-safe columns and only when is_public is
-- true. PII columns (email, phone, full_name) are never returned.
--
-- Reversibility:
--   DROP FUNCTION IF EXISTS public.get_public_profile_by_username(text);
--   ALTER TABLE profiles DROP COLUMN IF EXISTS display_name;
--   ALTER TABLE profiles DROP COLUMN IF EXISTS bio;
--   ALTER TABLE profiles DROP COLUMN IF EXISTS country;
--   ALTER TABLE profiles DROP COLUMN IF EXISTS learning_started_at;
--   ALTER TABLE profiles DROP COLUMN IF EXISTS is_public;

-- ── 1. Schema additions ──────────────────────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_name text;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bio text;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS country text;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS learning_started_at date;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;

-- Length cap on bio (280 chars, same as Twitter). NULL is allowed.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_bio_max_280'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_bio_max_280
      CHECK (bio IS NULL OR length(bio) <= 280);
  END IF;
END $$;

-- ISO 3166-1 alpha-2 country code: 2 uppercase letters when present.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_country_iso_alpha2'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_country_iso_alpha2
      CHECK (country IS NULL OR country ~ '^[A-Z]{2}$');
  END IF;
END $$;

-- Hot-path index for the public-profile lookup (username + is_public).
CREATE INDEX IF NOT EXISTS profiles_username_public_idx
  ON public.profiles (username) WHERE is_public = true;

-- ── 2. Public-profile lookup RPC ─────────────────────────────────────────
-- SECURITY DEFINER so it can read across rows without exposing the table
-- to anon. Returns NO PII (email, phone, full_name, preferred_name) — only
-- the columns the public profile page is allowed to render.

CREATE OR REPLACE FUNCTION public.get_public_profile_by_username(p_username text)
RETURNS TABLE (
  id                  uuid,
  username            text,
  display_name        text,
  bio                 text,
  country             text,
  avatar_url          text,
  learning_started_at date,
  streak_current      integer,
  streak_longest      integer,
  total_xp            integer,
  lessons_completed   integer
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT
    p.id,
    p.username,
    p.display_name,
    p.bio,
    p.country,
    p.avatar_url,
    p.learning_started_at,
    p.streak_current,
    p.streak_longest,
    COALESCE(x.total_xp, 0)::integer  AS total_xp,
    COALESCE((
      SELECT COUNT(*)::integer
      FROM public.user_room_progress urp
      WHERE urp.user_id = p.id
        AND urp.progress_pct >= 100
    ), 0) AS lessons_completed
  FROM public.profiles p
  LEFT JOIN public.user_xp x ON x.user_id = p.id
  WHERE p.username = p_username
    AND p.is_public = true
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_public_profile_by_username(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_profile_by_username(text)
  TO anon, authenticated;

COMMENT ON FUNCTION public.get_public_profile_by_username(text) IS
  'Returns public-safe profile for a username when is_public=true. Never returns email/phone/full_name. Used by /u/:username page.';
