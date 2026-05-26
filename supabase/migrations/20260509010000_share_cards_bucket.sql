-- Share-cards bucket for the Facebook score-card feature.
--
-- Holds 1200×630 PNG score cards generated client-side after a Speak
-- session. URL is fed to Facebook's sharer.php as a public OG image so
-- the card embeds inline in the user's post.
--
-- Access model:
--   - PUBLIC read so Facebook's OG scraper (anonymous) can fetch the
--     image without an apikey header.
--   - INSERT restricted to authenticated users writing under their own
--     user-id prefix. Path scheme is `<auth.uid()>/<filename>.png`,
--     enforced by the WITH CHECK clause below.
--   - UPDATE blocked (cards are immutable; new attempt = new file).
--   - DELETE allowed for the owner so a future "delete share history"
--     UI works without a service-role round-trip.
--
-- Reversibility:
--   DROP POLICY IF EXISTS "share_cards_public_read"     ON storage.objects;
--   DROP POLICY IF EXISTS "share_cards_owner_insert"    ON storage.objects;
--   DROP POLICY IF EXISTS "share_cards_owner_delete"    ON storage.objects;
--   DELETE FROM storage.buckets WHERE id = 'share-cards';

INSERT INTO storage.buckets (id, name, public)
VALUES ('share-cards', 'share-cards', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- ── Public read ────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "share_cards_public_read" ON storage.objects;
CREATE POLICY "share_cards_public_read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'share-cards');

-- ── Owner-only INSERT ──────────────────────────────────────────────────
-- Storage prefix is the user's UUID — derived from `name` because
-- storage.objects splits the path into `name` + `bucket_id`. The
-- (storage.foldername(name))[1] expression returns the first path
-- segment, which is where uploadShareCard.ts puts the user-id prefix.
DROP POLICY IF EXISTS "share_cards_owner_insert" ON storage.objects;
CREATE POLICY "share_cards_owner_insert"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'share-cards'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ── Owner-only DELETE ──────────────────────────────────────────────────
DROP POLICY IF EXISTS "share_cards_owner_delete" ON storage.objects;
CREATE POLICY "share_cards_owner_delete"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'share-cards'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- No UPDATE policy on purpose — score cards are immutable. A retake
-- writes a new file rather than overwriting the old one.

-- Policy intent (kept as plain SQL comments because the migration role
-- doesn't own storage.objects and so can't COMMENT ON POLICY there —
-- prior version of this file failed at apply time on those statements):
--
--   share_cards_public_read   — Allows Facebook OG scraper (anonymous)
--                               to fetch share-card PNGs.
--   share_cards_owner_insert  — Authenticated users can upload to
--                               <their-uid>/* only. Path enforcement
--                               matches uploadShareCard.ts derivePath().
--   share_cards_owner_delete  — Owner can delete their own cards;
--                               supports a future "delete share history"
--                               UI without a service-role round-trip.
