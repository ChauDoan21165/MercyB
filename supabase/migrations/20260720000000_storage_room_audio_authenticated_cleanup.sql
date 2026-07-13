-- Remove broad authenticated room-audio storage writes left in live policy state.
--
-- text-to-speech uploads generated cache files to room-audio with the caller's
-- authenticated Supabase client. Keep that path INSERT-only and filename-scoped.
-- room-audio-uploads has no current authenticated write path; service_role owns it.
-- Read policies, including room_audio_select_anon_temp, are intentionally untouched.

BEGIN;

DROP POLICY IF EXISTS "authenticated_all_room_audio" ON storage.objects;
DROP POLICY IF EXISTS "authenticated_all_room_audio_uploads" ON storage.objects;

DROP POLICY IF EXISTS "Authenticated TTS can insert generated room audio" ON storage.objects;

CREATE POLICY "Authenticated TTS can insert generated room audio"
  ON storage.objects
  AS PERMISSIVE
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'room-audio'
    AND auth.uid() IS NOT NULL
    AND name ~ '^[^/]+/[^/]+\.mp3$'
  );

COMMIT;
