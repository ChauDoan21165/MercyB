-- Create user_music_uploads table for music with admin approval workflow
CREATE TABLE IF NOT EXISTS public.user_music_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  artist text,
  file_url text NOT NULL,
  duration_seconds integer,
  file_size_bytes bigint,
  upload_status text NOT NULL DEFAULT 'pending',
  admin_notes text,
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT valid_upload_status CHECK (upload_status IN ('pending', 'approved', 'rejected'))
);

-- Create favorite_tracks table
CREATE TABLE IF NOT EXISTS public.favorite_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id uuid NOT NULL REFERENCES public.user_music_uploads(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, track_id)
);

-- Create favorite_rooms table
CREATE TABLE IF NOT EXISTS public.favorite_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, room_id)
);

-- Enable RLS
ALTER TABLE public.user_music_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_rooms ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_music_uploads
CREATE POLICY "Users can insert their own music uploads"
ON public.user_music_uploads FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own uploads"
ON public.user_music_uploads FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view approved music"
ON public.user_music_uploads FOR SELECT
TO authenticated
USING (upload_status = 'approved');

CREATE POLICY "Admins can view all music uploads"
ON public.user_music_uploads FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update music uploads"
ON public.user_music_uploads FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete music uploads"
ON public.user_music_uploads FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for favorite_tracks
CREATE POLICY "Users can manage their favorite tracks"
ON public.favorite_tracks FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for favorite_rooms
CREATE POLICY "Users can manage their favorite rooms"
ON public.favorite_rooms FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for user music
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-music', 'user-music', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for user-music bucket
CREATE POLICY "Users can upload their own music"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user-music' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own music"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-music' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all user music"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'user-music' AND
  has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete user music"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'user-music' AND
  has_role(auth.uid(), 'admin')
);