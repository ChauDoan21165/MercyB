-- Create storage bucket for room audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('room-audio', 'room-audio', true);

-- Create RLS policy for public read access (VIP3 users only via app logic)
CREATE POLICY "Public read access for room audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'room-audio');

-- Create RLS policy for service role to upload
CREATE POLICY "Service role can upload room audio"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'room-audio');