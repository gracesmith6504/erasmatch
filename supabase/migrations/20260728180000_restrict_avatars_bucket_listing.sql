-- The "Allow public to read all avatars" policy is scoped to the whole
-- bucket with no per-user restriction, letting any authenticated user
-- enumerate every avatar ever uploaded via the storage list API. The app
-- never uses that path — every avatar render uses the public URL already
-- stored on profiles.avatar_url (generated once at upload time), which is
-- served via the bucket's public flag and is unaffected by this policy.
DROP POLICY IF EXISTS "Allow public to read all avatars" ON storage.objects;
