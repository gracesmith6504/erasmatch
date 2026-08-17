-- ============================================================
-- Fix 6: Add an INSERT policy for the avatars storage bucket.
--
-- Before: There was NO rule saying who can upload avatars.
--         Depending on Supabase defaults, this could mean
--         anyone can upload files, or nobody can — either way
--         it's wrong.
--
-- After:  You can only upload files into YOUR OWN folder.
--         The app stores avatars as  avatars/<your-user-id>/photo.webp
--         so this policy says "you can only upload to a folder
--         named after your own user ID."
-- ============================================================

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);
