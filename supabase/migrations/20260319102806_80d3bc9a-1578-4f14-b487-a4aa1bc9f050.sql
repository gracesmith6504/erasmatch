-- Create blocked_users table
CREATE TABLE public.blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text,
  reported boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (blocker_id, blocked_id)
);

-- Enable RLS
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

-- Users can see their own blocks
CREATE POLICY "Users can see own blocks"
  ON public.blocked_users FOR SELECT TO authenticated
  USING (auth.uid() = blocker_id);

-- Admins can see all blocks (for report review)
CREATE POLICY "Admins can see all blocks"
  ON public.blocked_users FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Users can insert blocks as themselves
CREATE POLICY "Users can block others"
  ON public.blocked_users FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = blocker_id);

-- Users can unblock (delete their own blocks)
CREATE POLICY "Users can unblock"
  ON public.blocked_users FOR DELETE TO authenticated
  USING (auth.uid() = blocker_id);

-- Security definer function to check bidirectional blocks
CREATE OR REPLACE FUNCTION public.is_blocked(user_a uuid, user_b uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.blocked_users
    WHERE (blocker_id = user_a AND blocked_id = user_b)
       OR (blocker_id = user_b AND blocked_id = user_a)
  )
$$;