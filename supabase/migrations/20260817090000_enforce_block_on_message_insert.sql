-- Enforce blocking at the database level: prevent sending DMs to/from blocked users.
-- Replaces the existing INSERT policy that only checked sender_id = auth.uid().

DROP POLICY IF EXISTS "Users can send messages as themselves" ON public.messages;

CREATE POLICY "Users can send messages as themselves"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND NOT public.is_blocked(auth.uid(), receiver_id)
  );
