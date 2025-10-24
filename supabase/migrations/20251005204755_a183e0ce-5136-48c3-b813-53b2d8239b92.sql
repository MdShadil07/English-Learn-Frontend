-- Create storage buckets for media uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('community-media', 'community-media', true),
  ('room-covers', 'room-covers', true),
  ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for community media
CREATE POLICY "Community media is publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'community-media');

CREATE POLICY "Users can upload community media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'community-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own community media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'community-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for room covers
CREATE POLICY "Room covers are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'room-covers');

CREATE POLICY "Users can upload room covers"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'room-covers' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own room covers"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'room-covers' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for profile photos
CREATE POLICY "Profile photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload own profile photo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own profile photo"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own profile photo"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);