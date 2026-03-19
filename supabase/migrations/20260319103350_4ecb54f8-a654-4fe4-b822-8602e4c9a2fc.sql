-- Allow users to always read their own profile (even if soft-deleted)
-- This is needed for upsert during re-registration
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON profiles;

CREATE POLICY "Authenticated users can read profiles"
  ON profiles FOR SELECT TO authenticated
  USING (deleted_at IS NULL OR id = auth.uid());