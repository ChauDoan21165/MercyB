-- ──────────────────────────────────────────────────────────────────────────
-- A15: RLS policy documentation
--
-- Adds COMMENT ON POLICY for every RLS policy that lacks one.
-- Pure metadata. Zero schema change. Zero runtime impact. Idempotent.
--
-- Source-of-truth document: reports/RLS-CANONICAL-REFERENCE-A15.md
-- Snapshot used to author this: reports/RLS-current-state-A15.json
--
-- Apply path: Supabase SQL Editor (per project rule — not via `supabase db push`).
-- Re-running is safe: the DO block only writes when the existing comment is NULL.
--
-- Coverage strategy (in priority order):
--   1. Hand-curated comments for security-noted policies (§3 of the canonical doc).
--   2. Templated comment for the `require_aal2_when_factor_present` fan-out (§2.2).
--   3. Pattern-matched comments for common naming conventions (§2.1).
--   4. Generic fallback so 100% of policies get a comment.
--
-- Re-snapshot pg_policies after apply to verify 0 NULL comments remain.
-- ──────────────────────────────────────────────────────────────────────────

BEGIN;

DO $a15$
DECLARE
  pol_rec       record;
  intent_text   text;
  curated_text  text;
  existing_cmt  text;
BEGIN
  FOR pol_rec IN
    SELECT
      n.nspname     AS schemaname,
      cl.relname    AS tablename,
      pol.polname   AS policyname,
      pol.polcmd    AS polcmd,
      pol.polpermissive AS permissive,
      pol.oid       AS policy_oid
    FROM pg_policy pol
    JOIN pg_class cl    ON cl.oid = pol.polrelid
    JOIN pg_namespace n ON n.oid = cl.relnamespace
    WHERE n.nspname IN ('public', 'auth', 'storage')
    ORDER BY n.nspname, cl.relname, pol.polname
  LOOP

    -- Skip if a non-empty comment already exists. Makes the migration idempotent.
    SELECT description
      INTO existing_cmt
      FROM pg_description
     WHERE objoid   = pol_rec.policy_oid
       AND classoid = 'pg_policy'::regclass;

    IF existing_cmt IS NOT NULL AND length(trim(existing_cmt)) > 0 THEN
      CONTINUE;
    END IF;

    curated_text := NULL;
    intent_text  := NULL;

    -- ─────────────────────────────────────────────────────────────────
    -- 1. Hand-curated overrides for security-noted tables (§3).
    -- ─────────────────────────────────────────────────────────────────
    IF pol_rec.tablename = 'weekly_digest_data' THEN
      curated_text := 'PUBLIC SELECT (anon + authenticated, USING true). '
                   || 'Intentional public read of aggregate-only weekly content '
                   || '(serves the /blog and marketing surfaces). Adding any '
                   || 'per-user column to this table breaks the RLS contract — '
                   || 'revisit before ALTERing the schema. See §3.1 of '
                   || 'reports/RLS-CANONICAL-REFERENCE-A15.md.';

    ELSIF pol_rec.tablename = 'feature_flags' THEN
      curated_text := 'PUBLIC SELECT — feature flags must be readable client-side '
                   || 'at page load, including for anonymous visitors, so the SPA '
                   || 'can branch on rollouts before sign-in. No PII expected. '
                   || 'Writes are admin-only via separate policy. See §3.2.';

    ELSIF pol_rec.tablename = 'listening_clips' THEN
      curated_text := 'PUBLIC SELECT — preview audio for free-tier and trial users; '
                   || 'audio URLs reference the public listening-clips bucket. Any '
                   || 'later addition of per-user columns (attempts, scores) breaks '
                   || 'the contract. See §3.3.';

    END IF;

    -- ─────────────────────────────────────────────────────────────────
    -- 2. The aal2 RESTRICTIVE fan-out — same intent across ~40 tables.
    -- ─────────────────────────────────────────────────────────────────
    IF curated_text IS NULL
       AND pol_rec.policyname = 'require_aal2_when_factor_present' THEN
      curated_text := 'RESTRICTIVE FOR ALL TO authenticated. When the calling user '
                   || 'has an enrolled MFA factor, the row is unreachable unless '
                   || 'the JWT carries aal=aal2. Users without an enrolled factor '
                   || 'are unaffected. Combines via AND with permissive policies — '
                   || 'adds a gate, never widens access. Source: '
                   || 'supabase/migrations/20260529000000_mfa_aal2_required_when_enrolled.sql. '
                   || 'See §2.2.';
    END IF;

    -- ─────────────────────────────────────────────────────────────────
    -- 3. Pattern-matched intent for the common naming conventions.
    --    Order: most specific → least specific.
    -- ─────────────────────────────────────────────────────────────────
    IF curated_text IS NULL THEN
      intent_text := CASE
        WHEN pol_rec.policyname ILIKE '%service%role%'
          OR pol_rec.policyname ILIKE 'service_role%'  THEN
          'service_role bypass — server-side only, used by Vercel API routes and '
          || 'Supabase edge functions. RLS does not gate service_role; this policy '
          || 'documents the intent rather than enforcing access.'

        WHEN (pol_rec.policyname ILIKE '%admin%manage%'
              OR pol_rec.policyname ILIKE '%admin%all%'
              OR pol_rec.policyname ILIKE '%admins can manage%')  THEN
          'Super-admin write/manage access. Gate: get_admin_level(auth.uid()) >= 9. '
          || 'See §2.1 tier ladder.'

        WHEN (pol_rec.policyname ILIKE '%admin%view%'
              OR pol_rec.policyname ILIKE '%admin%select%'
              OR pol_rec.policyname ILIKE 'admins can view%')  THEN
          'Admin read access. Tier threshold encoded in the predicate (5 = teacher, '
          || '7 = regional/billing, 9 = super-admin). See §2.1.'

        WHEN pol_rec.policyname ILIKE '%admin%'  THEN
          'Admin-scoped policy. Tier threshold encoded in the predicate '
          || '(5 = teacher, 7 = regional/billing, 9 = super-admin). See §2.1.'

        WHEN (pol_rec.policyname ILIKE '%own%'
              OR pol_rec.policyname ILIKE '%their own%'
              OR pol_rec.policyname ILIKE 'users can%own%')  THEN
          'Owner access — predicate restricts the row to its owning auth.uid(). '
          || 'Standard self-row pattern.'

        WHEN (pol_rec.policyname ILIKE '%public%'
              OR pol_rec.policyname ILIKE 'anyone can%'
              OR pol_rec.policyname ILIKE '%anonymous%read%')  THEN
          'PUBLIC read. Intentional anonymous SELECT — verify the table holds no '
          || 'per-user PII before extending this pattern to a new table.'

        WHEN (pol_rec.policyname ILIKE '%authenticated%'
              OR pol_rec.policyname ILIKE 'logged in%'
              OR pol_rec.policyname ILIKE 'signed-in%')  THEN
          'Authenticated read/write — any signed-in user, no per-row ownership '
          || 'check. Use sparingly; prefer owner-scoped policies.'

        WHEN pol_rec.policyname ILIKE '%insert%'  THEN
          'INSERT policy. See predicate for ownership and tier constraints.'

        WHEN pol_rec.policyname ILIKE '%update%'  THEN
          'UPDATE policy. See predicate (USING) and update target (WITH CHECK).'

        WHEN pol_rec.policyname ILIKE '%delete%'  THEN
          'DELETE policy. Usually owner-scoped or admin-only — see predicate.'

        WHEN pol_rec.policyname ILIKE '%select%'  THEN
          'SELECT policy. See predicate for ownership and tier constraints.'

        ELSE
          NULL
      END;
    END IF;

    -- ─────────────────────────────────────────────────────────────────
    -- 4. Generic fallback — name + cmd + table. Guarantees 100% coverage.
    -- ─────────────────────────────────────────────────────────────────
    IF curated_text IS NULL AND intent_text IS NULL THEN
      intent_text := format(
        'RLS policy %L on %I.%I (cmd: %s, permissive: %s). Auto-generated '
        || 'placeholder — please replace with a specific intent line in a '
        || 'follow-up migration. See reports/RLS-CANONICAL-REFERENCE-A15.md §6 '
        || 'for the update workflow.',
        pol_rec.policyname,
        pol_rec.schemaname,
        pol_rec.tablename,
        pol_rec.polcmd,
        CASE WHEN pol_rec.permissive THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END
      );
    END IF;

    -- Apply.
    EXECUTE format(
      'COMMENT ON POLICY %I ON %I.%I IS %L',
      pol_rec.policyname,
      pol_rec.schemaname,
      pol_rec.tablename,
      COALESCE(curated_text, intent_text)
    );

  END LOOP;

  -- Sanity check + log.
  DECLARE
    documented integer;
    undocumented integer;
  BEGIN
    SELECT count(*) INTO documented
    FROM pg_policy pol
    JOIN pg_description d
      ON d.objoid = pol.oid AND d.classoid = 'pg_policy'::regclass
    JOIN pg_class cl    ON cl.oid = pol.polrelid
    JOIN pg_namespace n ON n.oid = cl.relnamespace
    WHERE n.nspname IN ('public','auth','storage')
      AND d.description IS NOT NULL AND length(trim(d.description)) > 0;

    SELECT count(*) INTO undocumented
    FROM pg_policy pol
    LEFT JOIN pg_description d
      ON d.objoid = pol.oid AND d.classoid = 'pg_policy'::regclass
    JOIN pg_class cl    ON cl.oid = pol.polrelid
    JOIN pg_namespace n ON n.oid = cl.relnamespace
    WHERE n.nspname IN ('public','auth','storage')
      AND (d.description IS NULL OR length(trim(d.description)) = 0);

    RAISE NOTICE 'A15: documented policies = %, undocumented = % (expect undocumented = 0).',
                 documented, undocumented;
  END;
END
$a15$;

COMMIT;
