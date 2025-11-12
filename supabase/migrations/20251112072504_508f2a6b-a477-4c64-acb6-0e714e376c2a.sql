-- Secure storage buckets by removing public read access
-- This ensures only authenticated users with proper VIP tiers can access audio via signed URLs

-- Remove public read policy from room-audio bucket
DROP POLICY IF EXISTS "Public read access for room audio" ON storage.objects;

-- Remove public read policy from room-audio-uploads bucket
DROP POLICY IF EXISTS "Public can read room audio uploads" ON storage.objects;

-- Ensure VIP3+ users can access their generated audio via signed URLs (policy already exists)
-- The text-to-speech edge function generates signed URLs with 24-hour expiry
-- Only VIP3+ users can call the function, so access is properly restricted