-- Step 9 (Monetization) — family plan infrastructure.
--
-- A family plan ties one paying owner to up to N learners (default 5,
-- 2-8 hard range). When the owner has an active premium subscription,
-- entitlement flows through to every member transparently — no separate
-- billing relationship. The Stripe product/SKU for the family plan is
-- daytime work; this PR ships only the schema + the data shape.
--
-- Three tables:
--   1. family_plans         — plan rows owned by one user.
--   2. family_plan_members  — junction; (plan_id, user_id) PK enforces
--                              "a user can be in at most one plan".
--   3. family_plan_invites  — short-lived codes the owner mints, members
--                              redeem. Codes are 8-char alphanumeric with
--                              I/O/0/1 stripped (set client-side and
--                              enforced via CHECK).
--
-- Reversibility:
--   DROP TABLE IF EXISTS public.family_plan_invites;
--   DROP TABLE IF EXISTS public.family_plan_members;
--   DROP TABLE IF EXISTS public.family_plans;

-- ── 1. family_plans ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.family_plans (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id text UNIQUE,
  max_members            integer NOT NULL DEFAULT 5
                          CHECK (max_members BETWEEN 2 AND 8),
  created_at             timestamptz NOT NULL DEFAULT now(),
  active                 boolean NOT NULL DEFAULT true
);

-- One active plan per owner. Inactive plans (cancelled / wound down) can
-- coexist for audit. The partial unique index gates the active case.
CREATE UNIQUE INDEX IF NOT EXISTS family_plans_one_active_per_owner
  ON public.family_plans (owner_user_id)
  WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_family_plans_owner
  ON public.family_plans (owner_user_id, active);

COMMENT ON TABLE public.family_plans IS
  'Step 9 monetization. One active row per owner; inactive rows kept for audit.';

-- ── 2. family_plan_members ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.family_plan_members (
  family_plan_id uuid NOT NULL REFERENCES public.family_plans(id) ON DELETE CASCADE,
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_by     uuid REFERENCES auth.users(id),
  joined_at      timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (family_plan_id, user_id),
  -- A user can only be in one family plan at a time.
  -- (Owners are also members of their own plan — see seed function below.)
  CONSTRAINT family_plan_members_user_unique UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_family_plan_members_user
  ON public.family_plan_members (user_id);

COMMENT ON TABLE public.family_plan_members IS
  'Junction. UNIQUE(user_id) enforces one plan per user.';

-- ── 3. family_plan_invites ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.family_plan_invites (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_plan_id      uuid NOT NULL REFERENCES public.family_plans(id) ON DELETE CASCADE,
  invited_email       text,
  invite_code         text NOT NULL UNIQUE,
  expires_at          timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  redeemed_by_user_id uuid REFERENCES auth.users(id),
  redeemed_at         timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  -- Codes are 8-char alphanumeric, uppercase, with the unambiguous-set
  -- I, O, 0, 1 banned. We enforce the CHARACTER set at the DB so any
  -- client (now or later) can't slip in a confusable code.
  CONSTRAINT family_plan_invites_code_format
    CHECK (invite_code ~ '^[A-HJ-NP-Z2-9]{8}$')
);

CREATE INDEX IF NOT EXISTS idx_family_plan_invites_plan
  ON public.family_plan_invites (family_plan_id, redeemed_at);

COMMENT ON TABLE public.family_plan_invites IS
  'Short-lived invites; codes are 8-char alphanumeric with I/O/0/1 stripped.';

-- ── 4. Auto-seed owner as a member when a plan is created ─────────────────
-- The owner is always implicitly the first member. We seed via trigger
-- so client code never has to remember to do it.
CREATE OR REPLACE FUNCTION public.family_plans_seed_owner_membership()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.family_plan_members (family_plan_id, user_id, invited_by)
  VALUES (NEW.id, NEW.owner_user_id, NEW.owner_user_id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_family_plans_seed_owner ON public.family_plans;
CREATE TRIGGER trg_family_plans_seed_owner
  AFTER INSERT ON public.family_plans
  FOR EACH ROW
  WHEN (NEW.active = true)
  EXECUTE FUNCTION public.family_plans_seed_owner_membership();

-- ── 5. Member-count cap enforced via trigger ──────────────────────────────
-- Refused: more members than max_members on the parent plan. Cheaper than
-- a CHECK because CHECK can't reference parent rows.
CREATE OR REPLACE FUNCTION public.family_plan_members_enforce_cap()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count integer;
  cap           integer;
BEGIN
  SELECT max_members INTO cap
    FROM public.family_plans WHERE id = NEW.family_plan_id;

  IF cap IS NULL THEN
    RAISE EXCEPTION 'family plan % not found', NEW.family_plan_id;
  END IF;

  SELECT count(*) INTO current_count
    FROM public.family_plan_members WHERE family_plan_id = NEW.family_plan_id;

  IF current_count >= cap THEN
    RAISE EXCEPTION 'family plan % is full (max_members = %)',
      NEW.family_plan_id, cap;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_family_plan_members_cap ON public.family_plan_members;
CREATE TRIGGER trg_family_plan_members_cap
  BEFORE INSERT ON public.family_plan_members
  FOR EACH ROW
  EXECUTE FUNCTION public.family_plan_members_enforce_cap();

-- ── 6. RLS ────────────────────────────────────────────────────────────────
-- Policy summary:
--   family_plans
--     - SELECT: owner OR active member of the plan
--     - INSERT: caller becomes owner_user_id
--     - UPDATE / DELETE: owner only
--   family_plan_members
--     - SELECT: owner of the plan OR the member themselves
--     - INSERT: only the owner adds members directly (the redeem flow uses
--       SECURITY DEFINER in client code; alternatively allowed from the
--       owner's session)
--     - DELETE: owner OR the member themselves (self-leave)
--   family_plan_invites
--     - SELECT: owner of the plan
--     - INSERT: owner of the plan
--     - DELETE: owner of the plan
--     - Redemption is owner-side or via a SECURITY DEFINER RPC (out of scope
--       here — the client uses the unique invite_code as the gate).
ALTER TABLE public.family_plans         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_plan_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_plan_invites  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS family_plans_select_owner_or_member ON public.family_plans;
CREATE POLICY family_plans_select_owner_or_member
  ON public.family_plans
  FOR SELECT
  TO authenticated
  USING (
    owner_user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.family_plan_members m
      WHERE m.family_plan_id = family_plans.id
        AND m.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS family_plans_insert_self_as_owner ON public.family_plans;
CREATE POLICY family_plans_insert_self_as_owner
  ON public.family_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_user_id = auth.uid());

DROP POLICY IF EXISTS family_plans_update_owner ON public.family_plans;
CREATE POLICY family_plans_update_owner
  ON public.family_plans
  FOR UPDATE
  TO authenticated
  USING (owner_user_id = auth.uid())
  WITH CHECK (owner_user_id = auth.uid());

DROP POLICY IF EXISTS family_plans_delete_owner ON public.family_plans;
CREATE POLICY family_plans_delete_owner
  ON public.family_plans
  FOR DELETE
  TO authenticated
  USING (owner_user_id = auth.uid());

DROP POLICY IF EXISTS family_plan_members_select_owner_or_self ON public.family_plan_members;
CREATE POLICY family_plan_members_select_owner_or_self
  ON public.family_plan_members
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.family_plans p
      WHERE p.id = family_plan_members.family_plan_id
        AND p.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS family_plan_members_insert_owner ON public.family_plan_members;
CREATE POLICY family_plan_members_insert_owner
  ON public.family_plan_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_plans p
      WHERE p.id = family_plan_id
        AND p.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS family_plan_members_delete_owner_or_self ON public.family_plan_members;
CREATE POLICY family_plan_members_delete_owner_or_self
  ON public.family_plan_members
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.family_plans p
      WHERE p.id = family_plan_members.family_plan_id
        AND p.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS family_plan_invites_owner_select ON public.family_plan_invites;
CREATE POLICY family_plan_invites_owner_select
  ON public.family_plan_invites
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.family_plans p
      WHERE p.id = family_plan_invites.family_plan_id
        AND p.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS family_plan_invites_owner_insert ON public.family_plan_invites;
CREATE POLICY family_plan_invites_owner_insert
  ON public.family_plan_invites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.family_plans p
      WHERE p.id = family_plan_id
        AND p.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS family_plan_invites_owner_delete ON public.family_plan_invites;
CREATE POLICY family_plan_invites_owner_delete
  ON public.family_plan_invites
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.family_plans p
      WHERE p.id = family_plan_invites.family_plan_id
        AND p.owner_user_id = auth.uid()
    )
  );

-- ── 7. Redeem RPC ─────────────────────────────────────────────────────────
-- Members redeem invites via this SECURITY DEFINER function so the client
-- doesn't need write access to family_plan_invites or to other people's
-- family_plan_members rows. The function:
--   - Validates the code exists, is not redeemed, and not expired.
--   - Refuses if the caller is already in any family plan.
--   - Inserts the membership (cap trigger still fires).
--   - Stamps the invite redeemed.
--
-- Returns the family_plan_id on success, or raises an explicit exception
-- on each failure mode so the client can show targeted error copy.
CREATE OR REPLACE FUNCTION public.family_plan_redeem_invite(p_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid             uuid := auth.uid();
  invite_row      public.family_plan_invites%ROWTYPE;
  existing_count  integer;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'family_plan_redeem_invite requires an authenticated user';
  END IF;

  SELECT * INTO invite_row
    FROM public.family_plan_invites
    WHERE invite_code = p_code;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'invite not found' USING ERRCODE = '22023';
  END IF;
  IF invite_row.redeemed_at IS NOT NULL THEN
    RAISE EXCEPTION 'invite already redeemed' USING ERRCODE = '22023';
  END IF;
  IF invite_row.expires_at < now() THEN
    RAISE EXCEPTION 'invite expired' USING ERRCODE = '22023';
  END IF;

  SELECT count(*) INTO existing_count
    FROM public.family_plan_members WHERE user_id = uid;
  IF existing_count > 0 THEN
    RAISE EXCEPTION 'already in a family plan' USING ERRCODE = '22023';
  END IF;

  -- invited_by is NULL on the redeem path because we don't carry the
  -- inviter id through invite rows. The plan owner is always queryable
  -- via family_plans.owner_user_id.
  INSERT INTO public.family_plan_members (family_plan_id, user_id, invited_by)
  VALUES (invite_row.family_plan_id, uid, NULL);

  UPDATE public.family_plan_invites
     SET redeemed_by_user_id = uid,
         redeemed_at = now()
   WHERE id = invite_row.id;

  RETURN invite_row.family_plan_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.family_plan_redeem_invite(text) TO authenticated;
