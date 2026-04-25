-- Step 5 (Marketing) — referral codes + uses.
--
-- Greenfield: no referral data existed before this migration.
--
-- Design:
--   - referral_codes: 1:N with auth.users (a user can rotate codes
--     later, but the MVP issues exactly one code per user). Code is
--     the PK because look-ups are always by code (URL share, redeem).
--   - referral_uses: one row per (code, referred_user_id). The unique
--     constraint enforces "each user can only redeem a given code once."
--     reward_granted_* flags exist now even though reward delivery is
--     deferred — once the daytime billing-integration job runs, it
--     just flips the flags + grants 7 free days.
--   - RLS:
--       referral_codes: owner reads/writes own row; anyone authenticated
--       can SELECT (we need to look up arbitrary codes during redeem).
--       Insert/update/delete is owner-only — code generation goes
--       through the RPC, which runs SECURITY DEFINER and validates.
--       referral_uses: the referred user can SELECT their own use rows
--       (so the Apply form can show "you already redeemed CODE"); the
--       owner of the code can SELECT all uses of that code (so the
--       ReferralCard can show "5 friends joined"). Direct insert/update
--       is denied — the apply RPC is the only writer.
--
-- Reversibility:
--   DROP FUNCTION IF EXISTS public.get_or_create_referral_code();
--   DROP FUNCTION IF EXISTS public.apply_referral_code(text);
--   DROP TABLE IF EXISTS public.referral_uses;
--   DROP TABLE IF EXISTS public.referral_codes;

-- ── 1. referral_codes ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.referral_codes (
  code           text PRIMARY KEY,
  owner_user_id  uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at     timestamptz NOT NULL DEFAULT now(),
  uses_count     integer NOT NULL DEFAULT 0,
  -- Code shape: 6 chars from the unambiguous alphabet
  -- (digits 2-9 + uppercase A-Z minus I and O).
  CONSTRAINT referral_codes_format CHECK (code ~ '^[2-9A-HJ-NP-Z]{6}$'),
  CONSTRAINT referral_codes_uses_nonneg CHECK (uses_count >= 0)
);

-- One code per owner today; relax to N-codes-per-user later by dropping
-- this constraint.
CREATE UNIQUE INDEX IF NOT EXISTS referral_codes_owner_uniq
  ON public.referral_codes (owner_user_id);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read codes (needed for redeem-time lookup).
-- We expose only `code, owner_user_id, created_at, uses_count` — no PII.
DROP POLICY IF EXISTS referral_codes_select_all ON public.referral_codes;
CREATE POLICY referral_codes_select_all
  ON public.referral_codes
  FOR SELECT
  TO authenticated
  USING (true);

-- Direct writes restricted to owner. In normal flow the RPC is the
-- writer; this policy is the safety net.
DROP POLICY IF EXISTS referral_codes_write_own ON public.referral_codes;
CREATE POLICY referral_codes_write_own
  ON public.referral_codes
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);

-- ── 2. referral_uses ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.referral_uses (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code                     text NOT NULL REFERENCES public.referral_codes(code) ON DELETE CASCADE,
  referred_user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  used_at                  timestamptz NOT NULL DEFAULT now(),
  reward_granted_owner     boolean NOT NULL DEFAULT false,
  reward_granted_referred  boolean NOT NULL DEFAULT false,
  CONSTRAINT referral_uses_unique_per_user UNIQUE (code, referred_user_id)
);

CREATE INDEX IF NOT EXISTS referral_uses_code_idx
  ON public.referral_uses (code);
CREATE INDEX IF NOT EXISTS referral_uses_referred_idx
  ON public.referral_uses (referred_user_id);

ALTER TABLE public.referral_uses ENABLE ROW LEVEL SECURITY;

-- Read your own redemptions OR all redemptions of codes you own.
DROP POLICY IF EXISTS referral_uses_select_owner_or_referred ON public.referral_uses;
CREATE POLICY referral_uses_select_owner_or_referred
  ON public.referral_uses
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = referred_user_id
    OR EXISTS (
      SELECT 1 FROM public.referral_codes c
       WHERE c.code = referral_uses.code
         AND c.owner_user_id = auth.uid()
    )
  );

-- No direct writes; the RPC is the only writer (SECURITY DEFINER).

-- ── 3. RPC — get-or-create the caller's referral code ─────────────────────
-- 6-char generator. Alphabet is unambiguous (no 0/1/I/O). Collision
-- probability per attempt: 1 / 32^6 ≈ 1 / 1.07B; in practice a 5-attempt
-- loop is enough but we keep it generous.
CREATE OR REPLACE FUNCTION public.get_or_create_referral_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid              uuid := auth.uid();
  existing_code    text;
  candidate        text;
  attempts         integer := 0;
  alphabet         text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  i                integer;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'get_or_create_referral_code requires an authenticated user';
  END IF;

  SELECT code INTO existing_code
    FROM public.referral_codes
    WHERE owner_user_id = uid
    LIMIT 1;
  IF existing_code IS NOT NULL THEN
    RETURN existing_code;
  END IF;

  LOOP
    attempts := attempts + 1;
    candidate := '';
    FOR i IN 1..6 LOOP
      candidate := candidate || substr(
        alphabet,
        1 + floor(random() * length(alphabet))::int,
        1
      );
    END LOOP;

    BEGIN
      INSERT INTO public.referral_codes (code, owner_user_id)
        VALUES (candidate, uid);
      RETURN candidate;
    EXCEPTION WHEN unique_violation THEN
      -- Either the code collided (vanishingly rare) OR another tx
      -- created the owner's row first. Loop and re-check.
      SELECT code INTO existing_code
        FROM public.referral_codes
        WHERE owner_user_id = uid
        LIMIT 1;
      IF existing_code IS NOT NULL THEN
        RETURN existing_code;
      END IF;
    END;

    IF attempts >= 8 THEN
      RAISE EXCEPTION 'get_or_create_referral_code: exhausted attempts';
    END IF;
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_or_create_referral_code() TO authenticated;

-- ── 4. RPC — apply a referral code as the caller ──────────────────────────
-- Returns json: { ok: bool, status: text }
--   status ∈ 'applied' | 'self_referral' | 'invalid_code' | 'already_used'
-- Atomic: insert into referral_uses and bump uses_count in one tx.
CREATE OR REPLACE FUNCTION public.apply_referral_code(p_code text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid          uuid := auth.uid();
  norm_code    text;
  owner_id     uuid;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'apply_referral_code requires an authenticated user';
  END IF;

  IF p_code IS NULL THEN
    RETURN json_build_object('ok', false, 'status', 'invalid_code');
  END IF;

  -- Normalise: trim + uppercase. The CHECK constraint enforces shape.
  norm_code := upper(btrim(p_code));
  IF norm_code !~ '^[2-9A-HJ-NP-Z]{6}$' THEN
    RETURN json_build_object('ok', false, 'status', 'invalid_code');
  END IF;

  SELECT owner_user_id INTO owner_id
    FROM public.referral_codes
    WHERE code = norm_code;
  IF owner_id IS NULL THEN
    RETURN json_build_object('ok', false, 'status', 'invalid_code');
  END IF;

  IF owner_id = uid THEN
    RETURN json_build_object('ok', false, 'status', 'self_referral');
  END IF;

  BEGIN
    INSERT INTO public.referral_uses (code, referred_user_id)
      VALUES (norm_code, uid);
  EXCEPTION WHEN unique_violation THEN
    RETURN json_build_object('ok', false, 'status', 'already_used');
  END;

  UPDATE public.referral_codes
     SET uses_count = uses_count + 1
   WHERE code = norm_code;

  RETURN json_build_object('ok', true, 'status', 'applied');
END;
$$;

GRANT EXECUTE ON FUNCTION public.apply_referral_code(text) TO authenticated;
