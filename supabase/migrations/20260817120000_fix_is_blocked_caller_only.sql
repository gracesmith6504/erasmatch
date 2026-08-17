-- ============================================================
-- Fix 5: Restrict is_blocked() so you can only check YOUR OWN
-- block relationships — not spy on whether two strangers blocked
-- each other.
--
-- Before: is_blocked(user_a, user_b) let any logged-in user pass
--         ANY two user IDs and find out if a block exists between
--         them.  That leaks private block info.
--
-- After:  The function takes just one argument (the other user)
--         and always uses YOUR login (auth.uid()) as one side.
--         You can only ask "did I block them, or did they block me?"
--
-- Also updates the messages INSERT policy which depends on this
-- function.
-- ============================================================

-- 1. Drop the policy that depends on the old function
DROP POLICY IF EXISTS "Users can send messages as themselves" ON public.messages;

-- 2. Drop the old 2-argument version
DROP FUNCTION IF EXISTS public.is_blocked(uuid, uuid);

-- 3. Create the new 1-argument version
CREATE OR REPLACE FUNCTION public.is_blocked(other_user uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.blocked_users
    WHERE (blocker_id = auth.uid() AND blocked_id = other_user)
       OR (blocker_id = other_user AND blocked_id = auth.uid())
  )
$$;

-- 4. Re-create the messages INSERT policy using the new 1-arg function
CREATE POLICY "Users can send messages as themselves"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND NOT public.is_blocked(receiver_id)
  );
