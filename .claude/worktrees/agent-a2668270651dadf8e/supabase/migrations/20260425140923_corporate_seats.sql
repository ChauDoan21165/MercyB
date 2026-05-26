-- 20260425140923_corporate_seats.sql
--
-- Step 9 (Monetization) — corporate / school multi-seat infrastructure.
--
-- Multi-seat is for diaspora schools, churches, and small businesses
-- that buy MercyBlade for 5+ learners under one bill. Distinct from the
-- family plan (A2's scope): different audience, different sales cycle,
-- different table set.
--
-- Three tables:
--   1. corporate_accounts        — one row per paying organisation.
--   2. corporate_seats           — junction; (account, user) PK enforces
--                                  one-account-per-user via UNIQUE(user_id).
--   3. corporate_seat_invites    — pending email invites with a 14-day
--                                  expiry. Codes are 8-char alphanumeric
--                                  with confusable I/O/0/1 stripped.
--
-- Stripe product / SKU / sales pricing for corporate is daytime work
-- and intentionally NOT created here — this PR ships only the schema +
-- the data shape needed by the admin UI shell.
--
-- Reversibility:
--   DROP TABLE IF EXISTS public.corporate_seat_invites;
--   DROP TABLE IF EXISTS public.corporate_seats;
--   DROP TABLE IF EXISTS public.corporate_accounts;

-- ── 1. corporate_accounts ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.corporate_accounts (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- The user who created the account becomes the admin/owner. Required
  -- so RLS has a stable handle for "who can invite / remove seats".
  -- Not in the task spec verbatim, but every operation in the spec
  -- ("admin only") requires SOME owner column to gate against.
  owner_user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  organization_name      text NOT NULL,
  organization_type      text CHECK (
                           organization_type IN
                           ('school', 'church', 'business', 'community', 'other')
                         ),
  contact_email          text NOT NULL,
  contact_phone          text,
  country                text NOT NULL,

  -- Stripe link is optional at this stage — the PR doesn't create a
  -- Stripe product, so most rows will have a null id until sales lands
  -- the customer. UNIQUE so a real subscription can never be linked
  -- to two accounts by accident.
  stripe_subscription_id text UNIQUE,

  seat_count             integer NOT NULL CHECK (seat_count >= 5),
  created_at             timestamptz NOT NULL DEFAULT now(),
  active                 boolean NOT NULL DEFAULT true,

  CONSTRAINT corporate_accounts_org_name_not_blank
    CHECK (char_length(trim(organization_name)) > 0),
  CONSTRAINT corporate_accounts_email_format
    CHECK (contact_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);

-- One active account per owner. Inactive (cancelled / wound down)
-- accounts can coexist for audit history.
CREATE UNIQUE INDEX IF NOT EXISTS corporate_accounts_one_active_per_owner
  ON public.corporate_accounts (owner_user_id)
  WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_corporate_accounts_owner
  ON public.corporate_accounts (owner_user_id, active);

COMMENT ON TABLE public.corporate_accounts IS
  'Step 9 monetization. Multi-seat plans for schools / churches / small businesses (>= 5 seats).';

-- ── 2. corporate_seats ────────────────────────────────────────────────────
-- A user can be a seat in at most one corporate account at a time. If
-- two organisations both want them, the older membership has to be
-- removed before they can join the second. UNIQUE(user_id) enforces this.
CREATE TABLE IF NOT EXISTS public.corporate_seats (
  corporate_account_id uuid NOT NULL REFERENCES public.corporate_accounts(id) ON DELETE CASCADE,
  user_id              uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_by           uuid REFERENCES auth.users(id),
  joined_at            timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (corporate_account_id, user_id),
  CONSTRAINT corporate_seats_user_unique UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_corporate_seats_user
  ON public.corporate_seats (user_id);

CREATE INDEX IF NOT EXISTS idx_corporate_seats_account
  ON public.corporate_seats (corporate_account_id);

COMMENT ON TABLE public.corporate_seats IS
  'Junction. UNIQUE(user_id) enforces one corporate account per user (independent of family plan membership).';

-- ── 3. corporate_seat_invites ─────────────────────────────────────────────
-- Codes mirror the family plan format (8-char alphanumeric with I/O/0/1
-- removed) so a learner can never confuse two invites visually.
CREATE TABLE IF NOT EXISTS public.corporate_seat_invites (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  corporate_account_id uuid NOT NULL REFERENCES public.corporate_accounts(id) ON DELETE CASCADE,
  invited_email        text,
  invite_code          text NOT NULL UNIQUE,
  expires_at           timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  redeemed_by_user_id  uuid REFERENCES auth.users(id),
  redeemed_at          timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT corporate_seat_invites_code_format
    CHECK (invite_code ~ '^[A-HJ-NP-Z2-9]{8}$'),
  CONSTRAINT corporate_seat_invites_email_format CHECK (
    invited_email IS NULL
    OR invited_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  )
);

CREATE INDEX IF NOT EXISTS idx_corporate_seat_invites_account
  ON public.corporate_seat_invites (corporate_account_id, redeemed_at);

CREATE INDEX IF NOT EXISTS idx_corporate_seat_invites_email
  ON public.corporate_seat_invites (invited_email)
  WHERE invited_email IS NOT NULL;

COMMENT ON TABLE public.corporate_seat_invites IS
  'Short-lived (14-day) invites; codes are 8-char alphanumeric with I/O/0/1 stripped.';

-- ── 4. Seat-cap trigger ───────────────────────────────────────────────────
-- Refuses inserts that would exceed the corporate_account.seat_count cap.
-- CHECK can't reference a parent row, so we enforce in plpgsql.
CREATE OR REPLACE FUNCTION public.corporate_seats_enforce_cap()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cap            integer;
  current_count  integer;
  is_active      boolean;
BEGIN
  SELECT seat_count, active
    INTO cap, is_active
    FROM public.corporate_accounts
   WHERE id = NEW.corporate_account_id;

  IF cap IS NULL THEN
    RAISE EXCEPTION 'corporate account % not found', NEW.corporate_account_id;
  END IF;
  IF is_active IS NOT TRUE THEN
    RAISE EXCEPTION 'corporate account % is not active', NEW.corporate_account_id;
  END IF;

  SELECT count(*) INTO current_count
    FROM public.corporate_seats WHERE corporate_account_id = NEW.corporate_account_id;

  IF current_count >= cap THEN
    RAISE EXCEPTION 'corporate account % is full (seat_count = %)',
      NEW.corporate_account_id, cap;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_corporate_seats_cap ON public.corporate_seats;
CREATE TRIGGER trg_corporate_seats_cap
  BEFORE INSERT ON public.corporate_seats
  FOR EACH ROW
  EXECUTE FUNCTION public.corporate_seats_enforce_cap();

-- ── 5. RLS ────────────────────────────────────────────────────────────────
-- Policy summary:
--   corporate_accounts
--     - SELECT: owner OR seat-holder of the account
--     - INSERT: caller becomes owner
--     - UPDATE / DELETE: owner only
--   corporate_seats
--     - SELECT: owner of the account OR the seat-holder themselves
--     - INSERT: owner of the account
--     - DELETE: owner OR the seat-holder (self-leave)
--   corporate_seat_invites
--     - SELECT / INSERT / DELETE: owner of the account
--     - Redemption goes through the SECURITY DEFINER RPC at the bottom.

ALTER TABLE public.corporate_accounts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_seats         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.corporate_seat_invites  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS corporate_accounts_select_owner_or_seat ON public.corporate_accounts;
CREATE POLICY corporate_accounts_select_owner_or_seat
  ON public.corporate_accounts
  FOR SELECT
  TO authenticated
  USING (
    owner_user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.corporate_seats s
      WHERE s.corporate_account_id = corporate_accounts.id
        AND s.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS corporate_accounts_insert_self_as_owner ON public.corporate_accounts;
CREATE POLICY corporate_accounts_insert_self_as_owner
  ON public.corporate_accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (owner_user_id = auth.uid());

DROP POLICY IF EXISTS corporate_accounts_update_owner ON public.corporate_accounts;
CREATE POLICY corporate_accounts_update_owner
  ON public.corporate_accounts
  FOR UPDATE
  TO authenticated
  USING (owner_user_id = auth.uid())
  WITH CHECK (owner_user_id = auth.uid());

DROP POLICY IF EXISTS corporate_accounts_delete_owner ON public.corporate_accounts;
CREATE POLICY corporate_accounts_delete_owner
  ON public.corporate_accounts
  FOR DELETE
  TO authenticated
  USING (owner_user_id = auth.uid());

DROP POLICY IF EXISTS corporate_seats_select_owner_or_self ON public.corporate_seats;
CREATE POLICY corporate_seats_select_owner_or_self
  ON public.corporate_seats
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.corporate_accounts a
      WHERE a.id = corporate_seats.corporate_account_id
        AND a.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS corporate_seats_insert_owner ON public.corporate_seats;
CREATE POLICY corporate_seats_insert_owner
  ON public.corporate_seats
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.corporate_accounts a
      WHERE a.id = corporate_account_id
        AND a.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS corporate_seats_delete_owner_or_self ON public.corporate_seats;
CREATE POLICY corporate_seats_delete_owner_or_self
  ON public.corporate_seats
  FOR DELETE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.corporate_accounts a
      WHERE a.id = corporate_seats.corporate_account_id
        AND a.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS corporate_seat_invites_owner_select ON public.corporate_seat_invites;
CREATE POLICY corporate_seat_invites_owner_select
  ON public.corporate_seat_invites
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.corporate_accounts a
      WHERE a.id = corporate_seat_invites.corporate_account_id
        AND a.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS corporate_seat_invites_owner_insert ON public.corporate_seat_invites;
CREATE POLICY corporate_seat_invites_owner_insert
  ON public.corporate_seat_invites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.corporate_accounts a
      WHERE a.id = corporate_account_id
        AND a.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS corporate_seat_invites_owner_delete ON public.corporate_seat_invites;
CREATE POLICY corporate_seat_invites_owner_delete
  ON public.corporate_seat_invites
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.corporate_accounts a
      WHERE a.id = corporate_seat_invites.corporate_account_id
        AND a.owner_user_id = auth.uid()
    )
  );

-- ── 6. Redeem RPC ─────────────────────────────────────────────────────────
-- Members redeem invites via this SECURITY DEFINER function so the
-- client doesn't need direct write access to other people's seat rows.
-- Failure modes raise distinct exceptions so the UI can show targeted
-- error copy ("expired" vs "already in another org" vs "account full").
CREATE OR REPLACE FUNCTION public.corporate_seat_redeem_invite(p_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid             uuid := auth.uid();
  invite_row      public.corporate_seat_invites%ROWTYPE;
  existing_count  integer;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'corporate_seat_redeem_invite requires an authenticated user';
  END IF;

  SELECT * INTO invite_row
    FROM public.corporate_seat_invites
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
    FROM public.corporate_seats WHERE user_id = uid;
  IF existing_count > 0 THEN
    RAISE EXCEPTION 'already in a corporate account' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.corporate_seats (corporate_account_id, user_id, invited_by)
  VALUES (invite_row.corporate_account_id, uid, NULL);
  -- invited_by left NULL on the redeem path. The corporate-account
  -- owner is always queryable via corporate_accounts.owner_user_id.

  UPDATE public.corporate_seat_invites
     SET redeemed_by_user_id = uid,
         redeemed_at = now()
   WHERE id = invite_row.id;

  RETURN invite_row.corporate_account_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.corporate_seat_redeem_invite(text) TO authenticated;
