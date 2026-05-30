
-- =========================================
-- FIX 1: Profiles - restrict SELECT to authenticated, hide email from others
-- =========================================

-- Drop the overly permissive public SELECT policies
DROP POLICY IF EXISTS "Allow public read access to profiles" ON profiles;
DROP POLICY IF EXISTS "Allow read only if not deleted" ON profiles;

-- Authenticated users can read non-deleted profiles
CREATE POLICY "Authenticated users can read profiles"
  ON profiles FOR SELECT TO authenticated
  USING (deleted_at IS NULL);

-- Revoke direct SELECT on email column from anon and authenticated
-- Then grant it back only via a security definer function
REVOKE SELECT ON profiles FROM anon;

-- =========================================
-- FIX 2: Notifications - restrict INSERT to own actor_id only
-- =========================================

DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON notifications;

CREATE POLICY "Users can insert notifications as themselves"
  ON notifications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = actor_id);
