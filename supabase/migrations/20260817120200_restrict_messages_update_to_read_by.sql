-- ============================================================
-- Fix 7: Remove the receiver UPDATE policy on messages.
--
-- Before: The receiver UPDATE policy let receivers modify ANY
--         column on messages sent to them (content, timestamps,
--         sender_id — everything).  An attempt to restrict it
--         with "content IS NOT DISTINCT FROM content" didn't work
--         because RLS WITH CHECK compares NEW to itself (always true).
--
-- After:  Drop the receiver UPDATE policy entirely.  Receivers
--         never need to UPDATE messages directly — all read_by
--         changes go through mark_thread_read(), which is
--         SECURITY DEFINER and bypasses RLS.  The admin UPDATE
--         policy stays for moderation.
-- ============================================================

DROP POLICY IF EXISTS "Allow users to update read_by on received messages"
  ON public.messages;

DROP POLICY IF EXISTS "Receivers can mark messages as read"
  ON public.messages;
