-- Reconcile committed storage audio write policies with live.
--
-- Live writes for audio storage are service-role owned. Older committed
-- migrations created bucket-only write policies with misleading service/admin
-- comments, so a fresh reset could reopen browser writes to audio buckets.
-- Public/read policies are intentionally left alone.

BEGIN;

DROP POLICY IF EXISTS "Service role can upload room audio" ON storage.objects;
DROP POLICY IF EXISTS "VIP users can upload to room-audio-uploads" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload room audio files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete room audio files" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload access for audio files" ON storage.objects;
DROP POLICY IF EXISTS "Admin update access for audio files" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete access for audio files" ON storage.objects;

CREATE POLICY "Service role can upload room audio"
  ON storage.objects
  AS PERMISSIVE
  FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'room-audio');

CREATE POLICY "Service role can upload room audio uploads"
  ON storage.objects
  AS PERMISSIVE
  FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'room-audio-uploads');

CREATE POLICY "Service role can delete room audio uploads"
  ON storage.objects
  AS PERMISSIVE
  FOR DELETE
  TO service_role
  USING (bucket_id = 'room-audio-uploads');

CREATE POLICY "Service role can upload audio files"
  ON storage.objects
  AS PERMISSIVE
  FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'audio');

CREATE POLICY "Service role can update audio files"
  ON storage.objects
  AS PERMISSIVE
  FOR UPDATE
  TO service_role
  USING (bucket_id = 'audio')
  WITH CHECK (bucket_id = 'audio');

CREATE POLICY "Service role can delete audio files"
  ON storage.objects
  AS PERMISSIVE
  FOR DELETE
  TO service_role
  USING (bucket_id = 'audio');

COMMIT;
