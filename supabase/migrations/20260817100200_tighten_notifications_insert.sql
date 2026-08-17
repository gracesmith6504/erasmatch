-- Fix: the notifications INSERT policy only checked actor_id = auth.uid()
-- but let any user target any other user_id with arbitrary title/body.
-- Tighten to:
--   1. actor_id must be the caller (already enforced)
--   2. user_id must differ from actor_id (no self-notifications)
--   3. type must be one of the known values
--   4. title and body must have sane length limits

DROP POLICY IF EXISTS "Users can insert notifications as themselves" ON notifications;

CREATE POLICY "Users can insert notifications as themselves"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = actor_id
    AND user_id <> actor_id
    AND type IN ('direct_message', 'profile_view', 'city_join')
    AND length(title) <= 200
    AND length(body) <= 1000
  );
