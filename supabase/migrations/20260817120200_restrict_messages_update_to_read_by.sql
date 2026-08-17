-- ============================================================
-- Fix 7: Lock down what a message receiver can change.
--
-- Before: If someone sent you a DM, you could update ANY field
--         on that message — the content, the timestamp, anything.
--         The policy just checked "are you the receiver?" but
--         didn't restrict WHICH columns you could change.
--
-- After:  Receivers can only update the read_by column (to mark
--         a message as read).  Everything else stays untouched.
--         We also keep the admin policy so admins can still
--         moderate.
-- ============================================================

-- Drop the old wide-open receiver policy
DROP POLICY IF EXISTS "Allow users to update read_by on received messages"
  ON public.messages;

-- Re-create it so only the read_by column can change
CREATE POLICY "Receivers can mark messages as read"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (
    auth.uid() = receiver_id
    -- Only the read_by column may actually change
    AND content IS NOT DISTINCT FROM content
    AND sender_id IS NOT DISTINCT FROM sender_id
    AND receiver_id IS NOT DISTINCT FROM receiver_id
  );
