-- Create storage bucket for manually uploaded room audio
INSERT INTO storage.buckets (id, name, public)
VALUES ('room-audio-uploads', 'room-audio-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policy for admins to upload audio
CREATE POLICY "Admins can upload room audio files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'room-audio-uploads'
  AND has_role(auth.uid(), 'admin')
);

-- RLS policy for public read access
CREATE POLICY "Public can read room audio uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'room-audio-uploads');

-- RLS policy for admins to delete
CREATE POLICY "Admins can delete room audio files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'room-audio-uploads'
  AND has_role(auth.uid(), 'admin')
);