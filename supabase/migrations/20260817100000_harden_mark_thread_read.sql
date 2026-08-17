-- Fix: mark_thread_read used a caller-supplied p_user_id parameter,
-- letting any authenticated user mark someone else's messages as read.
-- Replace it with auth.uid() so the function always operates on the
-- caller's own unread messages.

CREATE OR REPLACE FUNCTION public.mark_thread_read(p_partner_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
BEGIN
  UPDATE messages
  SET read_by = array_append(COALESCE(read_by, '{}'), _uid::text)
  WHERE sender_id = p_partner_id
    AND receiver_id = _uid
    AND NOT (COALESCE(read_by, '{}') @> ARRAY[_uid::text]);
END;
$$;

-- Drop the old two-argument overload so it cannot be called any more.
DROP FUNCTION IF EXISTS public.mark_thread_read(uuid, uuid);
