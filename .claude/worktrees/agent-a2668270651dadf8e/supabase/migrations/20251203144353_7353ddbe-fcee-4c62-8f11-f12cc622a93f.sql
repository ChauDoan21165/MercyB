-- Create audio bucket for TTS generated files
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio', 'audio', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to audio files
CREATE POLICY "Public read access for audio files"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio');

-- Allow admins to upload audio files
CREATE POLICY "Admin upload access for audio files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'audio'
);

-- Allow admins to update/replace audio files
CREATE POLICY "Admin update access for audio files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'audio');

-- Allow admins to delete audio files
CREATE POLICY "Admin delete access for audio files"
ON storage.objects FOR DELETE
USING (bucket_id = 'audio');