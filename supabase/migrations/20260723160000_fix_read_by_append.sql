-- Atomic batch function to mark all messages in a thread as read.
-- Uses array_append instead of overwriting the read_by array.
CREATE OR REPLACE FUNCTION public.mark_thread_read(p_partner_id uuid, p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE messages
  SET read_by = array_append(COALESCE(read_by, '{}'), p_user_id::text)
  WHERE sender_id = p_partner_id
    AND receiver_id = p_user_id
    AND NOT (COALESCE(read_by, '{}') @> ARRAY[p_user_id::text]);
END;
$$;
